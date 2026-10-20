/* ============================================================
   xlsx-lite.js — минимальный генератор .xlsx (OOXML SpreadsheetML)
   Без внешних зависимостей. Использует JSZip-подобную сборку ZIP
   вручную (store, без сжатия) + XML. Поддерживает несколько листов,
   строки, объединённые ячейки, стили (жирный/цвет/фон/выравнивание).
   Достаточно для Excel / LibreOffice / Google Sheets / WPS.
   ============================================================ */

(function (global) {
  'use strict';

  /* ---------- CRC32 ---------- */
  const CRC_TABLE = (() => {
    const t = new Uint32Array(256);
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
      t[n] = c >>> 0;
    }
    return t;
  })();
  function crc32(bytes) {
    let c = 0xFFFFFFFF;
    for (let i = 0; i < bytes.length; i++) c = CRC_TABLE[(c ^ bytes[i]) & 0xFF] ^ (c >>> 8);
    return (c ^ 0xFFFFFFFF) >>> 0;
  }

  /* ---------- ZIP (STORE) ---------- */
  function zipStore(entries) {
    // entries: [{name:string, data:Uint8Array}]
    const enc = new TextEncoder();
    const localParts = [], centralParts = [];
    let offset = 0;
    const now = new Date();
    const dosTime = ((now.getHours() << 11) | (now.getMinutes() << 5) | (now.getSeconds() >> 1)) & 0xFFFF;
    const dosDate = (((now.getFullYear() - 1980) << 9) | ((now.getMonth() + 1) << 5) | now.getDate()) & 0xFFFF;

    for (const e of entries) {
      const nameBytes = enc.encode(e.name);
      const crc = crc32(e.data);
      const lh = new DataView(new ArrayBuffer(30));
      lh.setUint32(0, 0x04034b50, true);
      lh.setUint16(4, 20, true);
      lh.setUint16(6, 0, true);
      lh.setUint16(8, 0, true); // store
      lh.setUint16(10, dosTime, true);
      lh.setUint16(12, dosDate, true);
      lh.setUint32(14, crc, true);
      lh.setUint32(18, e.data.length, true);
      lh.setUint32(22, e.data.length, true);
      lh.setUint16(26, nameBytes.length, true);
      lh.setUint16(28, 0, true);
      localParts.push(new Uint8Array(lh.buffer), nameBytes, e.data);

      const ch = new DataView(new ArrayBuffer(46));
      ch.setUint32(0, 0x02014b50, true);
      ch.setUint16(4, 20, true);
      ch.setUint16(6, 20, true);
      ch.setUint16(8, 0, true);
      ch.setUint16(10, 0, true);
      ch.setUint16(12, dosTime, true);
      ch.setUint16(14, dosDate, true);
      ch.setUint32(16, crc, true);
      ch.setUint32(20, e.data.length, true);
      ch.setUint32(24, e.data.length, true);
      ch.setUint16(28, nameBytes.length, true);
      ch.setUint16(30, 0, true);
      ch.setUint16(32, 0, true);
      ch.setUint16(34, 0, true);
      ch.setUint16(36, 0, true);
      ch.setUint32(38, 0, true);
      ch.setUint32(42, offset, true);
      centralParts.push(new Uint8Array(ch.buffer), nameBytes);

      offset += 30 + nameBytes.length + e.data.length;
    }

    const centralSize = centralParts.reduce((s, p) => s + p.length, 0);
    const end = new DataView(new ArrayBuffer(22));
    end.setUint32(0, 0x06054b50, true);
    end.setUint16(8, entries.length, true);
    end.setUint16(10, entries.length, true);
    end.setUint32(12, centralSize, true);
    end.setUint32(16, offset, true);

    const total = offset + centralSize + 22;
    const out = new Uint8Array(total);
    let pos = 0;
    for (const p of [...localParts, ...centralParts, new Uint8Array(end.buffer)]) {
      out.set(p, pos); pos += p.length;
    }
    return out;
  }

  /* ---------- helpers ---------- */
  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/\r?\n/g, '&#10;');
  }
  function colName(i) { // 0 -> A
    let s = '';
    i++;
    while (i > 0) { const m = (i - 1) % 26; s = String.fromCharCode(65 + m) + s; i = Math.floor((i - 1) / 26); }
    return s;
  }

  /* Стили: индекс в cellXfs. id 0 — базовый. */
  const STYLE_DEFS = [
    { id: 'base' },
    { id: 'title', font: { b: 1, sz: 20, color: 'FFFF0055' } },
    { id: 'subtitle', font: { b: 1, sz: 12, color: 'FF00E5FF' } },
    { id: 'header', font: { b: 1, sz: 11, color: 'FFFFFFFF' }, fill: 'FFD6006E', align: 'center' },
    { id: 'label', font: { b: 1, sz: 11 } },
    { id: 'cell', },
    { id: 'num', align: 'center' },
    { id: 'big', font: { b: 1, sz: 14, color: 'FFD6006E' }, align: 'center' },
    { id: 'note', font: { i: 1, sz: 10, color: 'FF777777' } },
    { id: 'section', font: { b: 1, sz: 13, color: 'FFFF0055' }, fill: 'FFF2F2F2' },
    { id: 'borderNum', align: 'center', border: 1 },
    { id: 'borderCell', border: 1 },
  ];
  const styleIdx = {};
  STYLE_DEFS.forEach((s, i) => styleIdx[s.id] = i);

  function stylesXml() {
    const fonts = ['<font/>'];
    const fills = ['<fill><patternFill patternType="none"/></fill>', '<fill><patternFill patternType="gray125"/></fill>'];
    const borders = ['<border><left/><right/><top/><bottom/><diagonal/></border>'];
    const xfs = ['<xf/>'];
    for (const s of STYLE_DEFS.slice(1)) {
      let fi = 0, fli = 0, bo = 0, alId = 0;
      if (s.font) {
        let f = '<font>';
        if (s.font.b) f += '<b/>';
        if (s.font.i) f += '<i/>';
        f += `<sz val="${s.font.sz || 11}"/>`;
        if (s.font.color) f += `<color rgb="${s.font.color}"/>`;
        f += '<name val="Calibri"/></font>';
        fi = fonts.length; fonts.push(f);
      }
      if (s.fill) {
        fli = fills.length;
        fills.push(`<fill><patternFill patternType="solid"><fgColor rgb="${s.fill}"/><bgColor indexed="64"/></patternFill></fill>`);
      }
      if (s.border) {
        bo = borders.length;
        borders.push('<border><left style="thin"><color indexed="64"/></left><right style="thin"><color indexed="64"/></right><top style="thin"><color indexed="64"/></top><bottom style="thin"><color indexed="64"/></bottom><diagonal/></border>');
      }
      const aligns = [];
      xfs.push(`<xf numFmtId="0" fontId="${fi}" fillId="${fli}" borderId="${bo}" xfId="0"${s.align ? ` applyAlignment="1"` : ''}>${s.align ? `<alignment horizontal="${s.align}" vertical="center" wrapText="1"/>` : ''}</xf>`);
    }
    return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
      '<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">' +
      `<fonts count="${fonts.length}">${fonts.join('')}</fonts>` +
      `<fills count="${fills.length}">${fills.join('')}</fills>` +
      `<borders count="${borders.length}">${borders.join('')}</borders>` +
      '<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>' +
      `<cellXfs count="${xfs.length}">${xfs.join('')}</cellXfs>` +
      '</styleSheet>';
  }

  /* Лист: rows = [[{v, s}|string|number|null,...], ...]
     merges = ["A1:D1", ...]; widths = [w1, w2, ...] */
  function sheetXml(sheet) {
    const cols = (sheet.widths || []).map((w, i) =>
      `<col min="${i + 1}" max="${i + 1}" width="${w}" customWidth="1"/>`).join('');
    let rowsXml = '';
    (sheet.rows || []).forEach((row, ri) => {
      let cellsXml = '';
      (row || []).forEach((cell, ci) => {
        if (cell === null || cell === undefined) return;
        let v, st = 0;
        if (typeof cell === 'object' && !Array.isArray(cell)) { v = cell.v; st = styleIdx[cell.s] ?? 0; }
        else { v = cell; }
        if (v === null || v === undefined || v === '') return;
        const ref = `${colName(ci)}${ri + 1}`;
        if (typeof v === 'number') {
          cellsXml += `<c r="${ref}" s="${st}"><v>${v}</v></c>`;
        } else {
          cellsXml += `<c r="${ref}" s="${st}" t="inlineStr"><is><t xml:space="preserve">${esc(v)}</t></is></c>`;
        }
      });
      rowsXml += `<row r="${ri + 1}">${cellsXml}</row>`;
    });
    const merges = (sheet.merges || []).length
      ? `<mergeCells count="${sheet.merges.length}">${sheet.merges.map(m => `<mergeCell ref="${m}"/>`).join('')}</mergeCells>` : '';
    return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
      '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">' +
      (cols ? `<cols>${cols}</cols>` : '') +
      `<sheetData>${rowsXml}</sheetData>${merges}</worksheet>`;
  }

  function buildWorkbook(sheets) {
    const enc = new TextEncoder();
    const names = sheets.map(s => s.name.replace(/[\\\/\?\*\[\]:]/g, '_'));
    const entries = [];
    const add = (name, xml) => entries.push({ name, data: enc.encode(xml) });

    add('[Content_Types].xml',
      '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
      '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">' +
      '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>' +
      '<Default Extension="xml" ContentType="application/xml"/>' +
      '<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>' +
      sheets.map((_, i) => `<Override PartName="/xl/worksheets/sheet${i + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`).join('') +
      '<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>' +
      '</Types>');

    add('_rels/.rels',
      '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
      '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
      '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>' +
      '</Relationships>');

    add('xl/workbook.xml',
      '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
      '<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">' +
      '<sheets>' + names.map((n, i) => `<sheet name="${esc(n)}" sheetId="${i + 1}" r:id="rId${i + 1}"/>`).join('') + '</sheets></workbook>');

    add('xl/_rels/workbook.xml.rels',
      '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
      '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
      sheets.map((_, i) => `<Relationship Id="rId${i + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${i + 1}.xml"/>`).join('') +
      `<Relationship Id="rId${sheets.length + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>` +
      '</Relationships>');

    add('xl/styles.xml', stylesXml());
    sheets.forEach((s, i) => add(`xl/worksheets/sheet${i + 1}.xml`, sheetXml(s)));

    return zipStore(entries);
  }

  global.XLSXLite = {
    /* sheets: [{name, rows, merges, widths}] -> Blob (.xlsx) */
    toBlob(sheets) {
      return new Blob([buildWorkbook(sheets)], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
    }
  };
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
