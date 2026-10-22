// ============================================================
// Пересборка единого скрипта страницы js/app-bundle.js из исходных
// ES-модулей (src/roles/*.js, data/skills.js, js/exporters.js, js/app.js).
//
// Зачем: Chrome запрещает загружать <script type="module"> по протоколу
// file:// (CORS), поэтому страница, открытая двойным кликом, не работает.
// Бандл — обычный (classic) скрипт без import/export, работает по file://
// и http(s):// в любом браузере.
//
// Использование:  node tools/bundle.mjs
// После правки ЛЮБОГО исходного модуля запускайте эту команду и коммитьте
// обновлённый js/app-bundle.js.
// ============================================================

import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

const ROLE_FILES = [
  "solo", "netrunner", "rockerboy", "nomad", "fixer",
  "tech", "medtech", "exec", "media", "lawman"
];

// Убираем import'ы и ключевое слово export — остаётся classic-скрипт.
function deModule(src) {
  return src
    .split("\n")
    .filter((l) => !/^\s*import\s.*from\s/.test(l))
    .join("\n")
    .replace(/^export\s+(const|let|var|function|class)\b/gm, "$1");
}

function read(rel) {
  return readFileSync(join(ROOT, rel), "utf8");
}

// ---------- [1] Роли: собираем объекты из src/roles/<name>.js ----------
const roleChunks = ROLE_FILES.map((r) => {
  const body = deModule(read(`src/roles/${r}.js`))
    // вырезаем объявление объекта роли (от "const <r> = {" до закрывающего "};")
    ;
  const start = body.indexOf(`const ${r} = {`);
  if (start === -1) throw new Error(`В src/roles/${r}.js не найден объект "${r}"`);
  let objText = body.slice(start + `const ${r} = `.length);
  // находим балансировку фигурных скобок
  let depth = 0, end = -1;
  for (let i = 0; i < objText.length; i++) {
    const ch = objText[i];
    if (ch === "{") depth++;
    else if (ch === "}") { depth--; if (depth === 0) { end = i + 1; break; } }
  }
  if (end === -1) throw new Error(`Не удалось найти конец объекта в src/roles/${r}.js`);
  return `  ${r}: ${objText.slice(0, end)}`;
});

// ---------- [2] Навыки: data/skills.js ----------
const skillsSrc = deModule(read("data/skills.js"));

// ---------- [3] Экспортёры: js/exporters.js ----------
const exportersSrc = deModule(read("js/exporters.js"));

// ---------- [3a] Данные шрифтов PDF: js/pdf-fonts.js ----------
const pdfFontsSrc = deModule(read("js/pdf-fonts.js"));

// ---------- [4] Приложение: js/app.js ----------
let appSrc = deModule(read("js/app.js"))
  // список ролей формируем из собранного ROLE_DATA вместо import'ов
  .replace(
    /^const ROLES = \[.*?\];/ms,
    "const ROLES = Object.values(ROLE_DATA);"
  );
// удаляем строки, оставшиеся от import-секции шапки (переносим её вручную)
appSrc = appSrc.replace(/^\s*\n+/, "\n");

const header = `// ============================================================
// Cyberpunk RED — генератор персонажей: ЕДИНСТВЕННЫЙ скрипт страницы.
//
// Почему один файл и без ES-модулей: <script type="module"> в Chrome
// запрещает загружать модули по протоколу file:// (CORS-политика),
// поэтому страница, открытая двойным кликом, «не работала». Здесь весь
// код — обычный (classic) скрипт: он работает и по file://, и по http(s)://
// во всех браузерах (Chrome, Firefox, Safari, Edge, Opera).
//
// Собран автоматически из исходных модулей — НЕ РЕДАКТИРУЙТЕ ВРУЧНУЮ.
// Исходники: src/roles/*.js, data/skills.js, js/exporters.js, js/app.js.
// Пересборка: node tools/bundle.mjs
// ============================================================

"use strict";
`;

const bundle = [
  header,
  `/* ------------------------------------------------------------
   [1] РОЛИ — src/roles/*.js (Core Rulebook, стр. 74–77)
   ------------------------------------------------------------ */
const ROLE_DATA = {
${roleChunks.join(",\n")}};
`,
  `/* ------------------------------------------------------------
   [2] НАВЫКИ — data/skills.js (справочник, Core Rulebook стр. 82–85)
   ------------------------------------------------------------ */
${skillsSrc.trim()}
`,
  `/* ------------------------------------------------------------
   [3] ШРИФТЫ PDF — js/pdf-fonts.js (генерируется tools/make_pdf_fonts.py)
   ------------------------------------------------------------ */
${pdfFontsSrc.trim()}
`,
  `/* ------------------------------------------------------------
   [4] ЭКСПОРТ/ИМПОРТ — js/exporters.js (.xlsx / .pdf / .json)
   ------------------------------------------------------------ */
${exportersSrc.trim()}
`,
  `/* ------------------------------------------------------------
   [5] ПРИЛОЖЕНИЕ — js/app.js (генерация, отрисовка, UI)
   ------------------------------------------------------------ */
${appSrc.trim()}
`].join("\n");

writeFileSync(join(ROOT, "js/app-bundle.js"), bundle, "utf8");
console.log("OK: js/app-bundle.js пересобран (" + bundle.split("\n").length + " строк)");
