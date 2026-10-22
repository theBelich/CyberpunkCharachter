// ============================================================
// ЭКСПОРТ ЛИСТА ПЕРСОНАЖА — .xlsx / .pdf / .json
// Всё работает на стороне клиента, без сервера и без внешних
// библиотек (файлы формируются «вручную» по спецификациям):
//   .json — сериализация персонажа + schemaVersion (как Data/ExportExample.json)
//   .xlsx — OOXML-архив: ZIP stored (без сжатия) + CRC-32
//   .pdf  — PDF 1.4: заголовок, страницы, каталог, оглавление (xref), trailer
// Скачивание — через Blob + <a download> (поддерживается во всех
// современных браузерах: Chrome, Firefox, Safari, Edge, Opera).
// ============================================================

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
      ["Человечность (HUM)", c.hum],
      ["Скорость (MOVE)", c.stats.MOVE],
      ["Наличные (эдди)", c.cash]
    ],
    stats: c.statsOrder.map((k) => [k, statRu[k] || k, c.stats[k]]),
    skills: rows.map(({ s }) => {
      const st = ru.statOf(s.name);
      return [ru.nameOf(s.name), st, ru.statName(st), s.level, (typeof c.stats[st] === "number" ? c.stats[st] : 0) + s.level];
    }),
    lifepath: c.lifepath.map((lp) => [lp.label, lp.value]),
    gear: c.gear.slice(),
    note: c.note
  };
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
  c.hum ??= (c.stats.EMP || 0) * 10;
  c.cash ??= 0;
  c.lifepath ||= [];
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
    S("Снаряжение", [["Предмет"], ...data.gear.map((g) => [g])])
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
// Формируется простой PDF 1.4: текст пишется встроенным шрифтом
// Helvetica-Bold (WinAnsi) — латиница (роль, аббревиатуры характеристик,
// названия навыков) отображается во всех viewers. Кириллица при печати
// заменяется на латинскую транслитерацию, чтобы файл оставался валидным
// без встраивания внешних шрифтов. Для кириллического оформления
// используйте кнопку «Печать» (Ctrl+P → «Сохранить как PDF»).

// Транслитерация кириллицы в латиницу — чтобы PDF-файл (встроенные
// шрифты Type1 без юникода) оставался читаемым во всех viewers.
const TRANSLIT = {
  а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e", ж: "zh", з: "z", и: "i", й: "y",
  к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r", с: "s", т: "t", у: "u", ф: "f",
  х: "kh", ц: "ts", ч: "ch", ш: "sh", щ: "sch", ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya",
  "«": '"', "»": '"', "—": "-", "–": "-", "·": "*", "…": "...", "№": "No"
};

function toLatin(s) {
  return String(s ?? "").split("").map((ch) => {
    if (/[\x20-\x7E]/.test(ch)) return ch;
    const low = ch.toLowerCase();
    const t = TRANSLIT[low];
    if (t === undefined) return "?";
    return ch === low ? t : t.split("").map((x) => x.toUpperCase()).join("");
  }).join("").replace(/\?+/g, " ").replace(/\s+/g, " ").trim();
}

function sanitizeLatin(s) {
  return toLatin(s);
}

function pdfText(s) {
  return String(s).replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

export function exportPDF(c, dict) {
  const W = 595, H = 842; // A4 in points
  const pages = [];      // каждая страница — массив строк content-операторов
  let ops = [], y = H - 60;

  const newPageIfNeeded = (need = 20) => {
    if (y - need < 50) { pages.push(ops.join("\n")); ops = []; y = H - 60; }
  };
  const text = (str, x, size, colorOp, bold) => {
    ops.push(`BT /F${bold ? "2" : "1"} ${size} Tf ${colorOp} ${x} ${y.toFixed(1)} Td (${pdfText(str)}) Tj ET`);
  };
  const line = () => { ops.push(`0.85 w 0.8 G 50 ${(y + 4).toFixed(1)} m ${W - 50} ${(y + 4).toFixed(1)} l S`); };
  const heading = (str) => { newPageIfNeeded(40); y -= 16; text(sanitizeLatin(str), 50, 13, "0 0 0 rg", true); line(); y -= 14; };
  const row = (str, indent = 60, size = 10) => { newPageIfNeeded(14); text(sanitizeLatin(str), indent, size, "0.15 0.15 0.15 rg"); y -= 14; };

  // Заголовок
  text("CYBERPUNK RED - CHARACTER SHEET", 50, 18, "0.8 0 0.15 rg", true); y -= 24;
  heading("Identity");
  row(`Name: ${c.name}    Nick: ${c.nick}    Age: ${c.age}`);
  row(`Role: ${c.role} (${toLatin(dict.ROLE_RU[c.role] || c.role)})    Method: #${c.method}    Style: ${toLatin(c.style)}`);
  row(`Cash: ${c.cash} eddies`);

  heading("Stats");
  const st = c.statsOrder.map((k) => `${k}:${c.stats[k]}`).join("   ");
  row(st, 60, 11);
  heading("Derived");
  row(`HP: ${c.hp}/${c.hp}    Heavy injury: ${Math.ceil(c.hp / 2)}    Death save: ${c.stats.BODY}    Humanity: ${c.hum}    Move: ${c.stats.MOVE}`);

  heading("Skills (level | level+stat)");
  const rows = c.skills.map((s, i) => ({ s, i })).sort((a, b) => b.s.level - a.s.level || a.i - b.i);
  for (const { s } of rows) {
    const statK = dict.SKILL_BY_NAME[s.name]?.stat || "";
    const sv = typeof c.stats[statK] === "number" ? c.stats[statK] : 0;
    row(`${s.name} [${statK}]  lvl ${s.level}  sum ${sv + s.level}`);
  }

  heading("Life Path");
  for (const lp of c.lifepath) row(`${sanitizeLatin(lp.label)}: ${sanitizeLatin(lp.value)}`.replace(/^(.*:)\s*\?+/, "$1 see sheet"));

  heading("Gear");
  for (const g of c.gear) row(sanitizeLatin(g));

  pages.push(ops.join("\n"));

  // Сборка PDF-объектов
  const objs = []; // 1..N
  const push = (s) => { objs.push(s); return objs.length; };
  const catalogId = push(null);
  const pagesId = push(null);
  const font1Id = push(`<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>`);
  const font2Id = push(`<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>`);
  const pageIds = [], contentIds = [];
  for (let i = 0; i < pages.length; i++) {
    const stream = pages[i];
    pageIds.push(push(null));
    contentIds.push(push(`<< /Length ${new TextEncoder().encode(stream).length} >>\nstream\n${stream}\nendstream`));
  }
  objs[catalogId - 1] = `<< /Type /Catalog /Pages ${pagesId} 0 R >>`;
  objs[pagesId - 1] = `<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(" ")}] /Count ${pageIds.length} >>`;
  pageIds.forEach((id, i) => {
    objs[id - 1] = `<< /Type /Page /Parent ${pagesId} 0 R /MediaBox [0 0 ${W} ${H}] /Resources << /Font << /F1 ${font1Id} 0 R /F2 ${font2Id} 0 R >> >> /Contents ${contentIds[i]} 0 R >>`;
  });

  const enc = new TextEncoder();
  let pdf = "%PDF-1.4\n%\xe2\xe3\xcf\xd3\n";
  const offsets = [];
  objs.forEach((body, i) => {
    offsets.push(enc.encode(pdf).length);
    pdf += `${i + 1} 0 obj\n${body}\nendobj\n`;
  });
  const xrefPos = enc.encode(pdf).length;
  pdf += `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n`;
  for (const off of offsets) pdf += String(off).padStart(10, "0") + " 00000 n \n";
  pdf += `trailer\n<< /Size ${objs.length + 1} /Root ${catalogId} 0 R >>\nstartxref\n${xrefPos}\n%%EOF`;

  return new Blob([pdf], { type: "application/pdf" });
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
