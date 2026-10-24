// ============================================================
// ЭКСПОРТ ЛИСТА ПЕРСОНАЖА — .xlsx / .pdf / .json
// Всё работает на стороне клиента, без сервера и без внешних
// библиотек (файлы формируются «вручную» по спецификациям):
//   .json — сериализация персонажа + schemaVersion (как Data/ExportExample.json)
//   .xlsx — OOXML-архив: ZIP stored (без сжатия) + CRC-32
//   .pdf  — PDF 1.7 в стиле интерфейса приложения (тёмный фон, неон)
//           со встроенными TrueType-шрифтами (кириллица без транслитерации)
// Скачивание — через Blob + <a download> (поддерживается во всех
// современных браузерах: Chrome, Firefox, Safari, Edge, Opera).
// ============================================================

import { PDF_FONTS } from "./pdf-fonts.js";

// ---------- Низкоуровневые утилиты ----------

function crc32(bytes) {
  let c, table = crc32.table;
  if (!table) {
    table = crc32.table = new Uint32Array(256);
    for (let n = 0; n < 256; n++) {
      c = n;
      for (let k = 0; k < 8; k++) c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
      table[n] = c >>> 0;
    }
  }
  let crc = 0xffffffff;
  for (let i = 0; i < bytes.length; i++) crc = table[(crc ^ bytes[i]) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

// ZIP-архив без сжатия (метод stored) — максимально совместимый способ
// собрать .xlsx: Excel, LibreOffice, Google Sheets читают его корректно.
function zipStore(entries) {
  const enc = new TextEncoder();
  const files = entries.map((e) => ({ name: enc.encode(e.name), data: typeof e.data === "string" ? enc.encode(e.data) : e.data }));
  const chunks = [], central = [];
  let offset = 0;

  for (const f of files) {
    const crc = crc32(f.data);
    const local = new DataView(new ArrayBuffer(30));
    local.setUint32(0, 0x04034b50, true);
    local.setUint16(4, 20, true);            // version needed
    local.setUint16(6, 0, true);             // flags
    local.setUint16(8, 0, true);             // method = stored
    local.setUint16(10, 0, true);            // mod time
    local.setUint16(12, 0x21, true);         // mod date (2026-01-01)
    local.setUint32(14, crc, true);
    local.setUint32(18, f.data.length, true);
    local.setUint32(22, f.data.length, true);
    local.setUint16(26, f.name.length, true);
    local.setUint16(28, 0, true);
    chunks.push(new Uint8Array(local.buffer), f.name, f.data);

    const cen = new DataView(new ArrayBuffer(46));
    cen.setUint32(0, 0x02014b50, true);
    cen.setUint16(4, 20, true);
    cen.setUint16(6, 20, true);
    cen.setUint16(8, 0, true);
    cen.setUint16(10, 0, true);              // method = stored
    cen.setUint16(12, 0, true);
    cen.setUint16(14, 0x21, true);
    cen.setUint32(16, crc, true);
    cen.setUint32(20, f.data.length, true);
    cen.setUint32(24, f.data.length, true);
    cen.setUint16(28, f.name.length, true);
    cen.setUint32(42, offset, true);         // relative offset of local header
    central.push(new Uint8Array(cen.buffer), f.name);

    offset += 30 + f.name.length + f.data.length;
  }

  const centralSize = central.reduce((a, b) => a + b.length, 0);
  const eocd = new DataView(new ArrayBuffer(22));
  eocd.setUint32(0, 0x06054b50, true);
  eocd.setUint16(8, files.length, true);
  eocd.setUint16(10, files.length, true);
  eocd.setUint32(12, centralSize, true);
  eocd.setUint32(16, offset, true);

  return new Blob([...chunks, ...central, new Uint8Array(eocd.buffer)], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
}

function xmlEsc(s) {
  return String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

function colLetter(n) { // 1 → A, 27 → AA
  let s = "";
  while (n > 0) { const m = (n - 1) % 26; s = String.fromCharCode(65 + m) + s; n = Math.floor((n - 1) / 26); }
  return s;
}

// ---------- Сбор текстовых данных листа ----------

export function buildSheetData(c, dict) {
  const ru = dict.skillRu, statRu = dict.STAT_RU;
  const rows = c.skills.map((s, i) => ({ s, i })).sort((a, b) => b.s.level - a.s.level || a.i - b.i);
  return {
    title: `Cyberpunk RED — ${c.name} «${c.nick}»`,
    identity: [
      ["Имя", c.name], ["Псевдоним", c.nick], ["Возраст", `${c.age} лет`],
      ["Роль", c.roleRu], ["Стиль", c.style], ["Способ создания", c.methodName]
    ],
    derived: [
      ["Бодрость (HP)", `${c.hp} / ${c.hp}`],
      ["Тяжело ранен (порог)", Math.ceil(c.hp / 2)],
      ["Спасбросок от смерти", c.stats.BODY],
      ["Человечность (текущая / максимум)", `${c.hum} / ${(c.empMax ?? c.stats.EMP) * 10}`],
      ["Эмпатия (текущая / максимальная)", `${Math.floor(c.hum / 10)} / ${c.empMax ?? c.stats.EMP}`],
      ["Скорость (MOVE)", c.stats.MOVE],
      ["Наличные (эдди)", c.cash]
    ],
    stats: c.statsOrder.map((k) => [k, statRu[k] || k, c.stats[k]]),
    skills: rows.map(({ s }) => {
      const st = ru.statOf(s.name);
      return [ru.nameOf(s.name), st, ru.statName(st), s.level, (typeof c.stats[st] === "number" ? c.stats[st] : 0) + s.level];
    }),
    lifepath: c.lifepath.map((lp) => [lp.label, lp.value]),
    gear: c.gear.filter((g) => !isImplantGear(g)).map(gearLabel),
    // Импланты — отдельный список (киберимпланты из магазина)
    implants: c.gear.filter(isImplantGear).map(gearLabel),
    // Активные оружие и броня (только по одному; SP/урон — свои значения или из книги)
    loadout: buildLoadout(c),
    note: c.note
  };
}

// Строка экипировки для экспорта: «Название — SP N» / «Название — урон Nd6»
function buildLoadout(c) {
  const rows = [];
  const w = (c.gear || []).find((g) => g && typeof g === "object" && g.weapon && g.active)
    || (c.gear || []).find((g) => g && typeof g === "object" && g.weapon);
  const a = (c.gear || []).find((g) => g && typeof g === "object" && g.armor && g.active)
    || (c.gear || []).find((g) => g && typeof g === "object" && g.armor);
  if (w) rows.push(`Активное оружие: ${gearLabel(w)}${w.damage ? ` — урон ${w.damage}` : ""}`);
  if (a) rows.push(`Активная броня: ${gearLabel(a)}${Number.isFinite(Number(a.sp)) ? ` — SP ${a.sp}` : ""}`);
  return rows;
}

// Киберимплант в инвентаре: объект с флагом implant:true (ставится при
// покупке в магазине «Киберимпланты»). Тот же признак, что и в js/app.js.
function isImplantGear(g) {
  return !!(g && typeof g === "object" && g.implant);
}

// Строка инвентаря для экспорта/печати: элементы могут быть текстом
// (снаряжение роли) или объектом { name, cost } (покупки в магазине)
function gearLabel(g) {
  if (g && typeof g === "object") {
    return `${g.name}${Number(g.cost) > 0 ? ` (${Number(g.cost).toLocaleString("ru-RU")} eb)` : ""}`;
  }
  return g;
}

// ---------- Экспорт в JSON ----------

export function exportJSON(c) {
  const payload = {
    schemaVersion: 1,
    app: "cyberpunk-red-character-generator",
    exportedAt: new Date().toISOString(),
    character: c
  };
  return new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
}

// ---------- Импорт из JSON ----------
// Принимает как полный экспорт этого приложения ({ schemaVersion, character }),
// так и «голый» объект персонажа. Возвращает валидированный объект с
// заполненными служебными полями; при ошибке — бросает Error с текстом для toast.
export function parseImportedJSON(text) {
  let obj;
  try { obj = JSON.parse(text); } catch { throw new Error("Файл не является корректным JSON"); }
  const c = (obj && typeof obj === "object" && obj.character) ? obj.character : obj;
  if (!c || typeof c !== "object") throw new Error("В файле нет данных персонажа");
  if (!c.name || !c.stats || !Array.isArray(c.skills)) throw new Error("Не хватает полей: name / stats / skills");
  // заполняем недостающие служебные поля, чтобы лист отрисовался корректно
  c.roleRu ||= c.role || "—";
  c.nick ||= "";
  c.age ||= 20;
  c.style ||= "—";
  c.methodName ||= `Способ №${c.method || "?"}`;
  c.note ||= "Импортирован из файла";
  c.statsOrder ||= Object.keys(c.stats);
  c.hp ??= calcHPFromStats(c);
  c.empMax = Math.max(0, Number(c.empMax ?? c.stats.EMP) || 0);
  c.hum = Math.max(0, Math.min(Number(c.hum ?? c.empMax * 10) || 0, c.empMax * 10));
  c.stats.EMP = Math.floor(c.hum / 10);
  c.cash ??= 0;
  c.lifepath ||= [];
  // старые/импортированные записи пути без ключей пунктов — дополняем по порядку,
  // чтобы панель «Выбрать вручную» корректно работала и с импортированными листами
  if (typeof LIFEPATH_FIELDS !== "undefined") {
    c.lifepath.forEach((lp, i) => {
      const f = LIFEPATH_FIELDS[i];
      if (f) { lp.key ||= f.key; lp.label ||= f.label; lp.icon ||= f.icon; }
    });
  }
  c.gear ||= [];
  return c;
}

function calcHPFromStats(c) {
  return 10 + Math.ceil(((c.stats.BODY || 0) + (c.stats.WILL || 0)) / 2) * 5;
}

// ---------- Экспорт в XLSX ----------

function sheetXml(rows) {
  let body = "";
  rows.forEach((r, ri) => {
    body += `<row r="${ri + 1}">`;
    r.forEach((val, ci) => {
      const isNum = typeof val === "number" && Number.isFinite(val);
      body += `<c r="${colLetter(ci + 1)}${ri + 1}"${isNum ? "" : ' t="inlineStr"'}>` +
        (isNum ? `<v>${val}</v>` : `<is><t>${xmlEsc(val)}</t></is>`) + `</c>`;
    });
    body += `</row>`;
  });
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetData>${body}</sheetData></worksheet>`;
}

export function exportXLSX(data) {
  const S = (title, rows) => ({ title, rows });
  const sheets = [
    S("Персонаж", [
      ["Лист персонажа — Cyberpunk RED"], [],
      ...data.identity, [],
      ["Производные характеристики"], ...data.derived, [],
      ["Примечание о создании"], [data.note]
    ]),
    S("Характеристики", [["Абр.", "Название", "Значение"], ...data.stats]),
    S("Навыки", [["Навык", "Хар-ка", "Название хар-ки", "Уровень", "Ур.+хар-ка"], ...data.skills]),
    S("Жизненный путь", [["Пункт", "Значение"], ...data.lifepath]),
    S("Снаряжение", [["Предмет"], ...data.gear.map((g) => [g])]),
    S("Импланты", [["Имплант"], ...(data.implants || []).map((g) => [g])]),
    S("Экипировка", [["Активные оружие и броня"], ...(data.loadout || []).map((r) => [r])])
  ];

  const wbSheets = sheets.map((s, i) =>
    `<sheet name="${xmlEsc(s.title)}" sheetId="${i + 1}" r:id="rId${i + 1}"/>`).join("");
  const wbRels = sheets.map((_, i) =>
    `<Relationship Id="rId${i + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${i + 1}.xml"/>`).join("");
  const ctOverrides = sheets.map((_, i) =>
    `<Override PartName="/xl/worksheets/sheet${i + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`).join("");

  const entries = [
    { name: "[Content_Types].xml", data: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>${ctOverrides}</Types>` },
    { name: "_rels/.rels", data: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>` },
    { name: "xl/workbook.xml", data: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets>${wbSheets}</sheets></workbook>` },
    { name: "xl/_rels/workbook.xml.rels", data: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${wbRels}</Relationships>` },
    ...sheets.map((s, i) => ({ name: `xl/worksheets/sheet${i + 1}.xml`, data: sheetXml(s.rows) }))
  ];

  return zipStore(entries);
}

// ---------- Экспорт в PDF ----------
// Полноценный PDF 1.7, визуально повторяющий оформление страницы
// (css/style.css): тёмный фон Найт-Сити с неоновой сеткой, красная
// шапка CYBERPUNK/RED, жёлтые/циановые заголовки секций, карточки
// панелей со скруглением и рамкой. Шрифты DejaVu Sans/Bold встраиваются
// как TrueType (Type 42) из js/pdf-fonts.js — поэтому кириллица
// отображается нативно, без транслитерации.
//
// Формат страницы подобран под чтение на телефоне: узкая «книжная»
// полоса (как экран смартфона), одна колонка, крупный кегль, щедрые
// отступы — при 100% масштабе страница заполняет экран без мелкого
// текста и горизонтальной прокрутки.

// Палитра — те же значения, что CSS-переменные :root в css/style.css
const CP = {
  red: "#ff003c", redDeep: "#b3002a", cyan: "#00e5ff", yellow: "#fcee0a",
  bg: "#0b0b10", panel: "#14141c", panel2: "#1b1b26", line: "#2a2a3a",
  text: "#e8e8f0", muted: "#9a9ab0"
};

// Страница «под телефон»: пропорции близки к экрану смартфона,
// масштабирование «по ширине» даёт комфортный размер текста.
const PG = { W: 360, H: 640, M: 14 };

// ---------- Цветовые утилиты ----------
function hexRgb(h) {
  const n = parseInt(h.slice(1), 16);
  return [(n >> 16 & 255) / 255, n >> 8 & 255, n & 255];
}
function mix(a, b, t) {
  const A = hexRgb(a), B = hexRgb(b);
  return `rgb(${A.map((v, i) => (v + (B[i] - v) * t).toFixed(4)).join(" ")})`;
}

// ---------- Встраивание TrueType (Type 42) ----------
// Собирает минимальный валидный TTF (head/hhea/maxp/cvt /hmtx/cmap/loca/glyf)
// из данных js/pdf-fonts.js (генерируются tools/make_pdf_fonts.py).
function buildTTF(F) {
  const ng = F.ng;
  const gidOf = (cp) => (cp >= 0 && cp <= 0xFFFF ? (F.cp[String(cp)] ?? 0) : 0);

  // --- глифы: флаги on-curve -> биты 0/1, координаты delta-кодированием ---
  const glyfParts = [];
  let locaOff = 0;
  const locaOffsets = [0];
  for (let gid = 0; gid < ng; gid++) {
    const g = F.glyphs[gid];
    let bytes = [];
    if (g && g.p && g.p.length) {
      const nc = g.e.length;
      const last = g.p.length - 1;
      const ends = g.e.map((e) => e - 1);
      const flagsArr = [];
      let prevX = 0, prevY = 0;
      const xs = [], ys = [];
      for (let i = 0; i <= last; i++) {
        const x = g.p[i][0], y = g.p[i][1];
        const dx = x - prevX, dy = y - prevY;
        prevX = x; prevY = y;
        xs.push(dx); ys.push(dy);
        let fl = g.f[i] ? 1 : 0;
        if (dx === 0) fl |= 2; else if (dx >= -255 && dx <= 255) fl |= 4;
        if (dy === 0) fl |= 8; else if (dy >= -255 && dy <= 255) fl |= 16;
        flagsArr.push(fl);
      }
      // упаковка флагов: одинаковые подряд -> repeat
      const flagBytes = [];
      for (let i = 0; i <= last;) {
        const fl = flagsArr[i];
        let rep = 0;
        while (i + 1 + rep <= last && flagsArr[i + 1 + rep] === fl && rep < 255) rep++;
        flagBytes.push(fl);
        if (rep) { flagBytes.push(rep); i += rep + 1; } else i++;
      }
      const coordBytes = [];
      for (let i = 0; i <= last; i++) {
        const fl = flagsArr[i];
        if (fl & 2) { if (!(fl & 4)) coordBytes.push(0); }
        else if (fl & 4) coordBytes.push(xs[i] & 0xff);
        else { coordBytes.push(xs[i] >> 8 & 0xff); coordBytes.push(xs[i] & 0xff); }
      }
      for (let i = 0; i <= last; i++) {
        const fl = flagsArr[i];
        if (fl & 8) { if (!(fl & 16)) coordBytes.push(0); }
        else if (fl & 16) coordBytes.push(ys[i] & 0xff);
        else { coordBytes.push(ys[i] >> 8 & 0xff); coordBytes.push(ys[i] & 0xff); }
      }
      const head = new Uint8Array(10 + nc * 2);
      const dv = new DataView(head.buffer);
      dv.setInt16(0, nc, false);
      dv.setInt16(2, 0, false); dv.setInt16(4, 0, false);   // xMin/yMin
      dv.setInt16(6, 0, false); dv.setInt16(8, 0, false);   // xMax/yMax (viewer их не требует)
      ends.forEach((e, k) => dv.setUint16(10 + k * 2, e, false));
      bytes = [...head, ...flagBytes, 0, 0, ...coordBytes]; // 4 байта padding после флагов
    }
    while (bytes.length % 4) bytes.push(0);
    glyfParts.push(new Uint8Array(bytes));
    locaOff += bytes.length;
    locaOffsets.push(locaOff);
  }

  const u16 = (arr, off, v) => { arr[off] = v >> 8 & 0xff; arr[off + 1] = v & 0xff; };
  const u32 = (arr, off, v) => { arr[off] = v >>> 24 & 0xff; arr[off + 1] = v >>> 16 & 0xff; arr[off + 2] = v >>> 8 & 0xff; arr[off + 3] = v & 0xff; };
  const i16 = (arr, off, v) => u16(arr, off, v < 0 ? v + 0x10000 : v);

  const head = new Uint8Array(54);
  i16(head, 4, 1); i16(head, 6, 0); u32(head, 8, 0x5F0F3CF5);
  head.set([0, 1, 0, 0], 12);                 // magicKey
  u16(head, 18, 1);                            // indexToLocFormat: long
  i16(head, 36, 2);                            // macStyle: bold bit handled per-font
  u16(head, 44, 1000);                         // unitsPerEm
  // dataRange 16..20 = 0, glyphDataFormat 34 = 0

  const hhea = new Uint8Array(36);
  i16(hhea, 4, F.asc); i16(hhea, 6, F.desc); i16(hhea, 8, 0);
  u16(hhea, 10, 600);                          // advanceWidthMax
  u16(hhea, 34, ng);                           // numberOfHMetrics

  const maxp = new Uint8Array(32);
  u16(maxp, 4, 1); u16(maxp, 6, ng);

  const cvt = new Uint8Array(4);               // fallback для ppem-масштабирования

  const hmtx = new Uint8Array(ng * 4);
  for (let gid = 0; gid < ng; gid++) {
    u16(hmtx, gid * 4, F.adv[String(gid)] ?? 0);
    u16(hmtx, gid * 4 + 2, 0);                 // lsb = 0 (валидно, просто нетошно)
  }

  // cmap format 4: по одному сегменту на непрерывный диапазон gid'ов
  // (субсет DejaVu даёт связные блоки ASCII / Latin-1 / кириллица / punct)
  const codes = Object.keys(F.cp).map(Number).filter((cc) => cc > 0).sort((a, b) => a - b);
  const segs = [];
  for (const cc of codes) {
    const gid = F.cp[String(cc)];
    const last = segs[segs.length - 1];
    if (last && cc === last.end + 1 && gid === last.deltas[last.deltas.length - 1] + 1) last.end = cc;
    else segs.push({ start: cc, end: cc, deltas: [gid - cc] });
  }
  segs.push({ start: 0xFFFF, end: 0xFFFF, deltas: [1] });
  const segCount = segs.length;
  const searchRange = 2 ** Math.floor(Math.log2(segCount)) * 2;
  const entrySelector = Math.floor(Math.log2(searchRange / 2));
  const rangeShift = segCount * 2 - searchRange;
  const cmapLen = 14 + segCount * 8 + 2;
  const cmap = new Uint8Array(cmapLen);
  const cmv = new DataView(cmap.buffer);
  cmv.setUint16(0, 0, false); cmv.setUint16(2, 1, false);   // version, numTables
  cmv.setUint16(4, 3, false); cmv.setUint16(6, 0, false);   // platform Windows, BMP
  cmv.setUint16(8, 12 + cmapLen, false);                     // offset subtable
  cmv.setUint16(10, 4, false);                               // format 4
  cmv.setUint16(12, cmapLen, false);                         // length
  cmv.setUint16(14, 0, false);                               // language
  cmv.setUint16(16, segCount * 2, false);                    // segCountX2
  cmv.setUint16(18, searchRange, false);
  cmv.setUint16(20, entrySelector, false);
  cmv.setUint16(22, rangeShift, false);
  let p = 24;
  for (const s of segs) { cmv.setUint16(p, s.end, false); p += 2; }
  cmv.setUint16(p, 0, false); p += 2;                        // reservedPad
  for (const s of segs) { cmv.setUint16(p, s.start, false); p += 2; }
  for (const s of segs) { cmv.setUint16(p, ((s.deltas[0] % 0x10000) + 0x10000) % 0x10000, false); p += 2; }
  for (const s of segs) { cmv.setUint16(p, 0, false); p += 2; } // idRangeOffset

  const loca = new Uint8Array((ng + 1) * 4);
  for (let i = 0; i <= ng; i++) u32(loca, i * 4, locaOffsets[i]);

  const glyfLen = glyfParts.reduce((a, g) => a + g.length, 0);
  const tables = [
    { tag: "head", data: head }, { tag: "hhea", data: hhea }, { tag: "maxp", data: maxp },
    { tag: "cvt ", data: cvt }, { tag: "hmtx", data: hmtx }, { tag: "cmap", data: cmap },
    { tag: "loca", data: loca }, { tag: "glyf", data: (() => { const all = new Uint8Array(glyfLen); let o = 0; for (const g of glyfParts) { all.set(g, o); o += g.length; } return all; })() }
  ];

  // сортировка по тегу (требование спецификации к порядку таблиц)
  tables.sort((a, b) => (a.tag < b.tag ? -1 : a.tag > b.tag ? 1 : 0));

  const numTables = tables.length;
  const headerLen = 12 + numTables * 16;
  let bodyLen = 0;
  const recs = tables.map((t) => {
    const len = t.data.length;
    const pad = (4 - (len % 4)) % 4;
    const off = headerLen + bodyLen;
    bodyLen += len + pad;
    return { ...t, off, len, pad };
  });
  const out = new Uint8Array(headerLen + bodyLen);
  const ov = new DataView(out.buffer);
  ov.setUint32(0, 0x00010000, false);
  ov.setUint16(4, numTables, false);
  let sr = 16; while (sr * 2 <= numTables * 16) sr *= 2;
  ov.setUint16(6, Math.log2(sr / 16), false);
  ov.setUint16(8, sr, false);
  ov.setUint16(10, numTables * 16 - sr, false);
  let cursor = headerLen;
  for (const r of recs) {
    for (let i = 0; i < 4; i++) out[cursor + i] = r.tag.charCodeAt(i);
    u32(out, cursor + 4, 0); // checksum (viewers не проверяют)
    u32(out, cursor + 8, r.off);
    u32(out, cursor + 12, r.len);
    cursor += 16;
  }
  for (const r of recs) { out.set(r.data, r.off); cursor = r.off + r.len + r.pad; }
  return { bytes: out, gidOf };
}

// Объекты PDF-файла: dict — словарь объекта/стрима; если data задан,
// объект оформляется как потоковый (stream ... endstream).
class PdfDoc {
  constructor() { this.objs = []; }
  add(dict, data) { this.objs.push({ dict, data }); return this.objs.length; }
  set(id, dict) { this.objs[id - 1] = { dict, data: null }; }
  assemble() {
    const chunks = [];
    let len = 0;
    const enc = new TextEncoder();
    const pushPart = (p) => { const b = typeof p === "string" ? enc.encode(p) : p; chunks.push(b); len += b.length; };
    pushPart("%PDF-1.7\n%\xE2\xE3\xCF\xD3\n");
    const offsets = [];
    this.objs.forEach((o, i) => {
      offsets.push(len);
      pushPart(`${i + 1} 0 obj\n`);
      if (o.data !== undefined && o.data !== null) {
        pushPart(o.dict + "\nstream\n");
        pushPart(o.data);
        pushPart("\nendstream\n");
      } else {
        pushPart(o.dict + "\n");
      }
      pushPart("endobj\n");
    });
    const xrefPos = len;
    let xr = `xref\n0 ${this.objs.length + 1}\n0000000000 65535 f \n`;
    for (const off of offsets) xr += String(off).padStart(10, "0") + " 00000 n \n";
    pushPart(xr);
    pushPart(`trailer\n<< /Size ${this.objs.length + 1} /Root ${this.catalogId} 0 R /Info ${this.infoId} 0 R >>\nstartxref\n${xrefPos}\n%%EOF`);
    return new Blob(chunks, { type: "application/pdf" });
  }
}

// ---------- Текст: измерение и перенос по словам ----------
function measure(str, font, size) {
  let w = 0;
  for (const ch of str) {
    const cp = ch.codePointAt(0);
    const gid = font.gidOf(cp);
    w += (font.F.adv[String(gid)] ?? 0);
  }
  return w / 1000 * size;
}
function wrapText(str, font, size, maxW) {
  const words = String(str ?? "").split(/\s+/).filter(Boolean);
  const lines = [];
  let cur = "";
  for (const wd of words) {
    const cand = cur ? cur + " " + wd : wd;
    if (!cur || measure(cand, font, size) <= maxW) cur = cand;
    else { lines.push(cur); cur = wd; }
  }
  if (cur) lines.push(cur);
  return lines.length ? lines : [""];
}

// ---------- Рисование страниц (content-операторы) ----------
function escStr(s) {
  return s.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function drawPanel(ops, x, yTop, w, h, fillHex, strokeHex) {
  const r = 8, top = yTop, bot = yTop - h;
  const k = 0.5523 * r; // константа аппроксимации четверти окружности кубическим Безье
  ops.push(`q ${hexRgb(fillHex).join(" ")} rg${strokeHex ? ` ${hexRgb(strokeHex).join(" ")} RG 1 w` : ""}`);
  ops.push(`${x + r} ${top} m`);
  ops.push(`${x + w - r} ${top} l`);
  ops.push(`${x + w - r + k} ${top} ${x + w} ${top - r + k} ${x + w} ${top - r} c`);
  ops.push(`${x + w} ${bot + r} l`);
  ops.push(`${x + w} ${bot + r - k} ${x + w - r + k} ${bot} ${x + w - r} ${bot} c`);
  ops.push(`${x + r} ${bot} l`);
  ops.push(`${x + r - k} ${bot} ${x} ${bot + r - k} ${x} ${bot + r} c`);
  ops.push(`${x} ${top - r} l`);
  ops.push(`${x} ${top - r + k} ${x + r - k} ${top} ${x + r} ${top} c`);
  ops.push(strokeHex ? "B" : "f");
  ops.push("Q");
}

function drawChip(ops, cx, cy, label, font, textColor, fillHex) {
  const size = 8.5;
  const tw = measure(label, font, size);
  const w = tw + 12, h = 15;
  const x = cx - w / 2, y = cy - h / 2;
  drawPanel(ops, x, y + h, w, h, fillHex, CP.line);
  ops.push(`BT /F1 ${size} Tf ${hexRgb(textColor).join(" ")} rg ${(cx - tw / 2).toFixed(2)} ${(cy - size * 0.3).toFixed(2)} Td (${escStr(label)}) Tj ET`);
}

// ---------- Основной экспортёр ----------
export function exportPDF(c, dict) {
  const GROUP_RU = dict.GROUP_RU || {};
  const skillRu = (n) => (dict.SKILL_BY_NAME?.[n]?.ru) || n;
  const skillStat = (n) => (dict.SKILL_BY_NAME?.[n]?.stat) || "—";
  const statRu = (s) => dict.STAT_RU?.[s] || s;

  // Шрифты: собираем встраиваемые TTF из данных js/pdf-fonts.js
  const R = buildTTF(PDF_FONTS.reg);  R.F = PDF_FONTS.reg;
  const B = buildTTF(PDF_FONTS.bold); B.F = PDF_FONTS.bold;

  const W = PG.W, H = PG.H, M = PG.M;
  const CW = W - 2 * M; // ширина контента
  const pagesOps = [];
  let ops = null, y = 0;

  // фон + неоновая сетка (как .bg-grid в css/style.css)
  const pageDecor = () => {
    const o = [`q ${hexRgb(CP.bg).join(" ")} rg 0 0 ${W} ${H} re f Q`];
    o.push(`q 0.4 w`);
    for (let gy = 42; gy < H; gy += 42) o.push(`0.05 0.30 0.32 RG 0 ${gy} m ${W} ${gy} l S`);
    for (let gx = 42; gx < W; gx += 42) o.push(`0.32 0.02 0.08 RG ${gx} 0 m ${gx} ${H} l S`);
    o.push(`Q`);
    return o;
  };
  const newPage = () => {
    if (ops) pagesOps.push(ops);
    ops = pageDecor();
    y = H - 68;
  };
  const ensure = (need) => { if (y - need < 36) newPage(); };

  newPage();

  // ---- Шапка (как .app-head: CYBERPUNK красным + RED жёлтым) ----
  ops.push(`q ${hexRgb(CP.panel).join(" ")} rg 0 ${H - 52} ${W} 52 re f Q`);
  ops.push(`0.165 0.165 0.228 RG 1 w 0 ${(H - 52.5).toFixed(1)} m ${W} ${(H - 52.5).toFixed(1)} l S`);
  ops.push(`BT /F2 17 Tf ${hexRgb(CP.red).join(" ")} rg ${M} ${H - 33} Td (CYBERPUNK) Tj ET`);
  ops.push(`BT /F2 17 Tf ${hexRgb(CP.yellow).join(" ")} rg ${(M + measure("CYBERPUNK ", B, 17) + 6).toFixed(2)} ${H - 33} Td (RED) Tj ET`);
  ops.push(`BT /F1 8.5 Tf ${hexRgb(CP.muted).join(" ")} rg ${M} ${H - 46} Td (${escStr("Лист персонажа · Найт-Сити 2045")}) Tj ET`);

  // ---- Имя / роль ----
  ensure(46);
  drawPanel(ops, M, y, CW, 44, CP.panel2, CP.line);
  ops.push(`BT /F2 14 Tf ${hexRgb(CP.text).join(" ")} rg ${M + 10} ${y - 19} Td (${escStr(`${c.name}${c.nick ? ` «${c.nick}»` : ""}`)}) Tj ET`);
  ops.push(`BT /F1 9.5 Tf ${hexRgb(CP.cyan).join(" ")} rg ${M + 10} ${y - 34} Td (${escStr(`${dict.ROLE_RU?.[c.role] || c.role} · ${c.methodName || ""}`)}) Tj ET`);
  ops.push(`BT /F2 9.5 Tf ${hexRgb(CP.yellow).join(" ")} rg ${(W - M - 10 - measure(`${c.age} лет`, B, 9.5)).toFixed(2)} ${y - 19} Td (${escStr(`${c.age} лет`)}) Tj ET`);
  y -= 54;

  // ---- Карточка секции (заголовок с цветной полосой слева) ----
  const section = (title, accent) => {
    ensure(48);
    y -= 6;
    drawPanel(ops, M, y, CW, 18, CP.panel, CP.line);
    ops.push(`q ${hexRgb(accent).join(" ")} rg ${M} ${y - 18} 3 18 re f Q`);
    ops.push(`BT /F2 10.5 Tf ${hexRgb(accent).join(" ")} rg ${M + 9} ${y - 12.5} Td (${escStr(title.toUpperCase())}) Tj ET`);
    y -= 26;
  };
  const kv = (label, value, opts = {}) => {
    ensure(16);
    const size = opts.size || 9.5;
    ops.push(`BT /F1 ${size} Tf ${hexRgb(CP.muted).join(" ")} rg ${M + 8} ${(y - size).toFixed(2)} Td (${escStr(label)}) Tj ET`);
    const lw = measure(label + "  ", R, size);
    const lines = wrapText(value, B, size, CW - 16 - lw);
    lines.forEach((ln, i) => {
      ops.push(`BT /F2 ${size} Tf ${hexRgb(opts.color || CP.text).join(" ")} rg ${(M + 8 + lw).toFixed(2)} ${(y - size - i * (size + 2)).toFixed(2)} Td (${escStr(ln)}) Tj ET`);
    });
    y -= lines.length * (size + 2) + 3;
  };

  // ---- Личность ----
  section("Личность", CP.cyan);
  kv("Стиль:", c.style || "—");
  kv("Наличные:", `${c.cash} эдди`, { color: CP.yellow });
  if (c.note) {
    ensure(20);
    const nl = wrapText(c.note, R, 8.5, CW - 16);
    y -= 2;
    nl.forEach((ln) => {
      ops.push(`BT /F1 8.5 Tf ${hexRgb(CP.muted).join(" ")} rg ${M + 8} ${(y - 8.5).toFixed(2)} Td (${escStr(ln)}) Tj ET`);
      y -= 10.5;
    });
  }

  // ---- Характеристики: панель 2×N + чипы производных ----
  section("Характеристики", CP.yellow);
  const order = c.statsOrder || Object.keys(c.stats);
  const colW = (CW - 16) / 2;
  const cellH = 30;
  const half = Math.ceil(order.length / 2);
  const panelH = half * cellH + 8;
  ensure(panelH + 8);
  drawPanel(ops, M, y, CW, panelH, CP.panel, CP.line);
  order.forEach((k, idx) => {
    const col = idx < half ? 0 : 1;
    const rowI = idx < half ? idx : idx - half;
    const cx = M + 8 + col * colW;
    const cy = y - 4 - rowI * cellH;
    ops.push(`BT /F2 13 Tf ${hexRgb(CP.red).join(" ")} rg ${cx.toFixed(2)} ${(cy - 12).toFixed(2)} Td (${escStr(k)}) Tj ET`);
    ops.push(`BT /F1 7.5 Tf ${hexRgb(CP.muted).join(" ")} rg ${(cx + measure(k, B, 13) + 4).toFixed(2)} ${(cy - 12).toFixed(2)} Td (${escStr(statRu(k))}) Tj ET`);
    const vs = String(c.stats[k]);
    ops.push(`BT /F2 15 Tf ${hexRgb(CP.text).join(" ")} rg ${(cx + colW - 26 - measure(vs, B, 15)).toFixed(2)} ${(cy - 13).toFixed(2)} Td (${escStr(vs)}) Tj ET`);
    if (rowI < half - 1) ops.push(`0.165 0.165 0.228 RG 0.6 w ${cx.toFixed(2)} ${(cy - cellH + 6).toFixed(2)} m ${(cx + colW - 8).toFixed(2)} ${(cy - cellH + 6).toFixed(2)} l S`);
  });
  y -= panelH + 10;

  // Чипы производных (HP / тяжело ранен / смерть / HUM / MOVE)
  const chips = [
    [`HP ${c.hp}/${c.hp}`, CP.red],
    [`тяжело ранен ${Math.ceil(c.hp / 2)}`, CP.yellow],
    [`смерть ${c.stats.BODY}`, CP.red],
    [`HUM ${c.hum}/${(c.empMax ?? c.stats.EMP) * 10}`, CP.cyan],
    [`EMP ${Math.floor(c.hum / 10)}/${c.empMax ?? c.stats.EMP}`, CP.cyan],
    [`MOVE ${c.stats.MOVE}`, CP.cyan]
  ];
  {
    const chipLines = [[]];
    let lineW = 0;
    for (const item of chips) {
      const cw = measure(item[0], B, 8.5) + 12 + 5;
      if (lineW + cw > CW && chipLines[chipLines.length - 1].length) { chipLines.push([]); lineW = 0; }
      chipLines[chipLines.length - 1].push(item);
      lineW += cw;
    }
    for (const ln of chipLines) {
      ensure(20);
      let cxp = M + 4;
      for (const [label, col] of ln) {
        const cw = measure(label, B, 8.5) + 12;
        drawChip(ops, cxp + cw / 2, y - 8, label, B, col, CP.panel2);
        cxp += cw + 5;
      }
      y -= 20;
    }
    y -= 6;
  }

  // ---- Навыки: группировка + строки «уровень | навык [хар] + хар = сумма» ----
  section("Навыки", CP.cyan);
  const byGroup = {};
  const sorted = c.skills.map((s, i) => ({ s, i })).sort((a, b) => b.s.level - a.s.level || a.i - b.i);
  for (const { s } of sorted) {
    const g = dict.SKILL_BY_NAME?.[s.name]?.group || "Прочие";
    (byGroup[g] ||= []).push(s);
  }
  for (const [g, list] of Object.entries(byGroup)) {
    ensure(20);
    ops.push(`BT /F2 8.5 Tf ${hexRgb(CP.yellow).join(" ")} rg ${M + 6} ${(y - 9).toFixed(2)} Td (${escStr((GROUP_RU[g] || g).toUpperCase() + ` — ${list.length}`)}) Tj ET`);
    y -= 14;
    for (const s of list) {
      const st = skillStat(s.name);
      const sv = typeof c.stats[st] === "number" ? c.stats[st] : 0;
      const sum = String(sv + s.level);
      const lv = String(s.level);
      ensure(17);
      // правый блок: cyan level | muted "+sv =" | yellow/white sum
      const sumW = measure(sum, B, 9), addW = measure(`+ ${sv} = `, R, 8), lvW = measure(lv, B, 9);
      const rx = W - M - 6;
      ops.push(`BT /F2 9 Tf ${hexRgb(sv + s.level >= 10 ? CP.yellow : CP.text).join(" ")} rg ${(rx - sumW).toFixed(2)} ${(y - 9).toFixed(2)} Td (${escStr(sum)}) Tj ET`);
      ops.push(`BT /F1 8 Tf ${hexRgb(CP.muted).join(" ")} rg ${(rx - sumW - addW - 3).toFixed(2)} ${(y - 8.5).toFixed(2)} Td (${escStr(`+ ${sv} = `)}) Tj ET`);
      ops.push(`BT /F2 9 Tf ${hexRgb(CP.cyan).join(" ")} rg ${(rx - sumW - addW - lvW - 16).toFixed(2)} ${(y - 9).toFixed(2)} Td (${escStr(lv)}) Tj ET`);
      // название навыка (с truncation по ширине)
      const nameW = rx - sumW - addW - lvW - 30 - (M + 6);
      let nm = skillRu(s.name);
      if (measure(nm, R, 9) > nameW) {
        while (nm.length > 2 && measure(nm + "…", R, 9) > nameW) nm = nm.slice(0, -1);
        nm += "…";
      }
      ops.push(`BT /F1 9 Tf ${hexRgb(CP.text).join(" ")} rg ${M + 6} ${(y - 9).toFixed(2)} Td (${escStr(nm)}) Tj ET`);
      const stTag = `[${st}]`;
      ops.push(`BT /F1 7.5 Tf ${hexRgb(CP.muted).join(" ")} rg ${(M + 6 + measure(nm, R, 9) + 4).toFixed(2)} ${(y - 8.5).toFixed(2)} Td (${escStr(stTag)}) Tj ET`);
      y -= 15;
    }
    y -= 4;
  }

  // ---- Жизненный путь ----
  if (c.lifepath?.length) {
    section("Жизненный путь", CP.yellow);
    for (const lp of c.lifepath) kv(lp.label + ":", lp.value || "—");
  }

  // ---- Снаряжение (без имплантов — они в отдельном списке «Импланты») ----
  const gearPlain = (c.gear || []).filter((g) => !isImplantGear(g));
  if (gearPlain.length) {
    section("Снаряжение", CP.red);
    for (const gRaw of gearPlain) {
      const g = String(gearLabel(gRaw)); // покупки из магазина — объекты { name, cost }
      const lines = wrapText(g, R, 9, CW - 30);
      lines.forEach((ln, i) => {
        ensure(13);
        if (i === 0) ops.push(`BT /F1 9 Tf ${hexRgb(CP.cyan).join(" ")} rg ${M + 6} ${(y - 9).toFixed(2)} Td (\u2022) Tj ET`);
        ops.push(`BT /F1 9 Tf ${hexRgb(CP.text).join(" ")} rg ${M + 18} ${(y - 9).toFixed(2)} Td (${escStr(ln)}) Tj ET`);
        y -= 12;
      });
      y -= 2;
    }
  }

  // ---- Экипировка: активное оружие (урон) и активная броня (SP) ----
  {
    const actW = (c.gear || []).find((g) => g && typeof g === "object" && g.weapon && g.active)
      || (c.gear || []).find((g) => g && typeof g === "object" && g.weapon);
    const actA = (c.gear || []).find((g) => g && typeof g === "object" && g.armor && g.active)
      || (c.gear || []).find((g) => g && typeof g === "object" && g.armor);
    if (actW || actA) {
      section("Экипировка", CP.yellow);
      if (actW) kv("Активное оружие:", `${String(gearLabel(actW))}${actW.damage ? ` — урон ${actW.damage}` : ""}`, { color: CP.text });
      if (actA) kv("Активная броня:", `${String(gearLabel(actA))}${Number.isFinite(Number(actA.sp)) ? ` — SP ${actA.sp}` : ""}`, { color: CP.text });
    }
  }

  // ---- Импланты (киберимпланты, купленные в магазине) ----
  const implantList = (c.gear || []).filter(isImplantGear);
  if (implantList.length) {
    section("Импланты", CP.yellow);
    for (const gRaw of implantList) {
      const g = String(gearLabel(gRaw));
      const lines = wrapText(g, R, 9, CW - 30);
      lines.forEach((ln, i) => {
        ensure(13);
        if (i === 0) ops.push(`BT /F1 9 Tf ${hexRgb(CP.cyan).join(" ")} rg ${M + 6} ${(y - 9).toFixed(2)} Td (\u2022) Tj ET`);
        ops.push(`BT /F1 9 Tf ${hexRgb(CP.text).join(" ")} rg ${M + 18} ${(y - 9).toFixed(2)} Td (${escStr(ln)}) Tj ET`);
        y -= 12;
      });
      y -= 2;
    }
  }

  pagesOps.push(ops);
  const total = pagesOps.length;

  // нижние колонтитулы (номер страницы — как на телефоне удобно листать)
  pagesOps.forEach((po, i) => {
    po.push(`0.165 0.165 0.228 RG 1 w ${M} 30 m ${W - M} 30 l S`);
    po.push(`BT /F1 7.5 Tf ${hexRgb(CP.muted).join(" ")} rg ${M} 18 Td (${escStr(`Cyberpunk RED · ${c.name} · стр. ${i + 1} из ${total}`)}) Tj ET`);
  });

  // ---- Сборка PDF ----
  const doc = new PdfDoc();
  const catalogId = doc.add(null); doc.catalogId = catalogId;
  const pagesId = doc.add(null);
  const infoId = doc.add(`<< /Title (${escStr(`Cyberpunk RED — ${c.name} «${c.nick}»`)}) /Producer (cyberpunk-red-character-generator) /CreationDate (D:${datePdf()}) >>`);
  doc.infoId = infoId;

  const fontObj = (name, ttf) => {
    const fileId = doc.add(`<< /Length ${ttf.bytes.length} /Length1 ${ttf.bytes.length} >>`, ttf.bytes);
    const tuId = doc.add(`<< /Length ${(() => { const s = toUnicodeCMap(ttf.F); return encLen(s); })() } >>`, toUnicodeCMap(ttf.F));
    const wArr = [];
    for (let gid = 0; gid < ttf.F.ng; gid++) wArr.push(ttf.F.adv[String(gid)] ?? 0);
    return doc.add(`<< /Type /Font /Subtype /Type42 /BaseFont /${name} /FirstChar 0 /LastChar ${wArr.length - 1} /Widths [${wArr.join(" ")}] /FontDescriptor << /Type /FontDescriptor /FontName /${name} /Flags 32 /FontBBox [-100 -236 1606 1901] /ItalicAngle 0 /Ascent 928 /Descent -236 /CapHeight 729 /StemV 90 /FontFile2 ${fileId} 0 R >> /ToUnicode ${tuId} 0 R >>`);
  };
  const f1Id = fontObj("DejaVuSans", R);
  const f2Id = fontObj("DejaVuSans-Bold", B);

  const pageIds = [];
  pagesOps.forEach((po) => {
    const content = po.join("\n");
    const cid = doc.add(`<< /Length ${encLen(content)} >>`, content);
    const pid = doc.add(`<< /Type /Page /Parent ${pagesId} 0 R /MediaBox [0 0 ${W} ${H}] /Resources << /Font << /F1 ${f1Id} 0 R /F2 ${f2Id} 0 R >> >> /Contents ${cid} 0 R >>`);
    pageIds.push(pid);
  });

  doc.set(catalogId, `<< /Type /Catalog /Pages ${pagesId} 0 R /ViewerPreferences << /FitWindow true >> /Lang (ru) >>`);
  doc.set(pagesId, `<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(" ")}] /Count ${pageIds.length} >>`);

  return doc.assemble();
}

function datePdf() {
  const d = new Date(), p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}`;
}

const _enc = new TextEncoder();
function encLen(s) { return _enc.encode(s).length; }

// ToUnicode CMap — чтобы поиск/копирование текста из PDF давало юникод
function toUnicodeCMap(F) {
  let s = `/CIDInit /ProcSet findresource begin\n12 dict begin\nbegincmap\n/CMapName /Adobe-Identity-UCS def\n/CMapType 2 def\n1 begincodespacerange\n<0000> <FFFF>\nendcodespacerange\n`;
  const pairs = Object.entries(F.cp).map(([cp, gid]) => `<${Number(gid).toString(16).padStart(4, "0")}> <${Number(cp).toString(16).toUpperCase().padStart(4, "0")}>`);
  for (let i = 0; i < pairs.length; i += 100) {
    s += `${Math.min(100, pairs.length - i)} beginbfchar\n${pairs.slice(i, i + 100).join("\n")}\nendbfchar\n`;
  }
  s += `endcmap\nCMapName currentdict /CMap defineresource pop\nend\nend`;
  return s;
}

// ---------- Скачивание файла ----------

export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.rel = "noopener";
  document.body.appendChild(a);

  let ok = false;
  try {
    a.click();
    ok = true;
  } catch (err) {
    console.warn("download click failed:", err);
  }
  // Фallback 1: IE / старый Edge — msSaveOrOpenBlob
  if (!ok && typeof window.navigator?.msSaveOrOpenBlob === "function") {
    try { window.navigator.msSaveOrOpenBlob(blob, filename); ok = true; } catch (e2) { void e2; }
  }
  // Фallback 2: data-URL + target=_blank (совместимо даже с очень старыми браузерами)
  if (!ok) {
    try {
      const reader = new FileReader();
      reader.onload = () => {
        a.href = String(reader.result);
        a.target = "_blank";
        a.click();
      };
      reader.readAsDataURL(blob);
    } catch (e3) {
      window.open(url, "_blank"); // крайний случай — открыть Blob в новой вкладке
    }
  }

  a.remove();
  // отзываем URL позже, чтобы успеть старым браузерам начать загрузку
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}
