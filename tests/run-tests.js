#!/usr/bin/env node
/* ============================================================
   Тесты генератора Cyberpunk RED (Node + DOM-заглушка).
   Проверяют 3 готовых варианта создания персонажа:
     1. Уличная крыса  2. Эджраннер  3. Полный пакет
   а также базовые способы, экспорт JSON/XLSX и целостность данных.
   Запуск: npm test
   ============================================================ */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
let failures = 0;
function ok(cond, msg) {
  if (cond) console.log('  ✔ ' + msg);
  else { failures++; console.error('  ✘ ' + msg); }
}

/* ---------- минимальная DOM-заглушка ---------- */
function makeEl() {
  const el = {
    innerHTML: '', textContent: '', value: '', style: {}, dataset: {},
    classList: { add() {}, remove() {}, toggle() {}, contains() { return false; } },
    appendChild() {}, remove() {}, click() {},
    addEventListener() {}, dispatchEvent() {},
    querySelector() { return makeEl(); },
    querySelectorAll() { return []; },
    setAttribute() {}, getAttribute() { return null; },
    onclick: null,
  };
  return el;
}
const documentStub = {
  createElement: () => makeEl(),
  querySelector: () => makeEl(),
  querySelectorAll: () => [],
  addEventListener: () => {},
  body: makeEl(),
};
const store = {};
const localStorageStub = {
  getItem: k => (k in store ? store[k] : null),
  setItem: (k, v) => { store[k] = String(v); },
  removeItem: k => { delete store[k]; },
};
class BlobStub {
  constructor(parts) { this.parts = parts; }
}
const sandbox = {
  document: documentStub, localStorage: localStorageStub, Blob: BlobStub,
  URL: { createObjectURL: () => 'blob:x', revokeObjectURL: () => {} },
  setTimeout: (fn) => fn && undefined, clearTimeout: () => {},
  console, module: undefined, window: {},
  TextEncoder, TextDecoder, Uint8Array, ArrayBuffer,
  navigator: { userAgent: 'node' },
};
sandbox.window = sandbox;
vm.createContext(sandbox);

function run(file) {
  let code = fs.readFileSync(path.join(ROOT, file), 'utf8');
  // в браузерном режиме скрипты делят один глоб scope; в vm-контексте
  // top-level const не попадает в sandbox — оборачиваем и экспортируем вручную
  if (file === 'js/data.js')    code += '\n;globalThis.__X = { CPR };\n';
  if (file === 'js/xlsx-lite.js') code += '\n;globalThis.__X = { ...globalThis.__X, XLSXLite };\n';
  if (file === 'js/app.js') code += '\n;globalThis.__X = { ...globalThis.__X, genPreset, genRandom, genTable, genLifePath, rollLifePath, xlsxSheets, makeCharacter, recomputeDerived };\n';
  vm.runInContext(code, sandbox, { filename: file });
}

run('js/data.js');
run('js/xlsx-lite.js');
run('js/app.js');

const CPR = sandbox.__X.CPR;
const genPreset = sandbox.__X.genPreset;
const genRandom = sandbox.__X.genRandom;
const genTable = sandbox.__X.genTable;
const genLifePath = sandbox.__X.genLifePath;
const rollLifePath = sandbox.__X.rollLifePath;
const xlsxSheets = sandbox.__X.xlsxSheets;
const XLSXLite = sandbox.__X.XLSXLite;

console.log('\n== Целостность данных ==');
ok(CPR.ROLES.length === 9, `9 ролей в книге игрока (факт: ${CPR.ROLES.length})`);
ok(CPR.ROLES.every(r => r.archetypes.length === 3), 'у каждой роли 3 архетипа');
ok(CPR.BACKGROUNDS.length === 8, '8 происхождений');
ok(CPR.PRESETS.length === 3, '3 готовых варианта создания');
{
  const keys = new Set(CPR.SKILLS.map(s => s.key));
  let bad = [];
  CPR.PRESETS.forEach(p => Object.keys(p.skills || {}).forEach(k => { if (!keys.has(k)) bad.push(p.key + ':' + k); }));
  ok(bad.length === 0, 'все навыки пресетов существуют ' + (bad.length ? '(плохие: ' + bad + ')' : ''));
}

console.log('\n== Вариант 1: Уличная крыса ==');
{
  const c = genPreset('rat');
  ok(!!c, 'персонаж создан');
  ok(c.role === 'solo' && c.archetype === 'gunfighter', 'Соло / Стрелок');
  ok(c.background === 'choomb', 'происхождение «Чумба из трущоб»');
  ok(c.attrs.ref === 6 && c.attrs.lu === 2, 'фокус REF=6, LU=2 (правило книги)');
  ok(c.skills.handguns >= 4, 'Пистолеты ≥ 4 (' + c.skills.handguns + ')');
  ok(!c.lifepath, 'без Жизненного пути (быстрый старт)');
  ok(c.gear.length >= 5 && c.credits === 350, 'минимальное снаряжение и €$ 350');
  ok(c.derived.hits === c.attrs.co * 5, 'HP = CO×5');
  ok(c.method === 'preset' && c.preset === 'rat', 'метка варианта сохранена');
}

console.log('\n== Вариант 2: Эджраннер ==');
{
  const c = genPreset('edge');
  ok(!!c, 'персонаж создан');
  ok(c.role === 'netrunner' && c.archetype === 'brainiac', 'Нетраннер / Гений');
  ok(c.attrs.ia === 6 && c.attrs.ref === 5 && c.attrs.lu === 2, 'фокус IA=6, REF=5, LU=2');
  ok(c.skills.programming >= 4 && c.skills.electronics >= 4, 'Программирование и Электроника ≥ 4');
  ok(!!c.lifepath, 'краткий Жизненный путь присутствует');
  ok(c.gear.some(g => /дека/i.test(g)), 'в снаряжении есть кибердека');
  ok(c.extras.some(x => /глубине Сети/.test(x)), 'особенность нетраннера (+глубина Сети)');
  ok(c.derived.hits === c.attrs.co * 5 && c.derived.humane === c.attrs.em * 10, 'производные значения рассчитаны (HP, Humanity)');
}

console.log('\n== Вариант 3: Полный пакет ==');
{
  const c = genPreset('full');
  ok(!!c, 'персонаж создан');
  const role = CPR.ROLES.find(r => r.key === c.role);
  ok(!!role, 'случайная роль корректна: ' + c.role);
  ok(role.archetypes.some(a => a.key === c.archetype), 'архетип принадлежит роли');
  ok(!!c.lifepath && Object.keys(c.lifepath).length === 6, 'полный Жизненный путь (6 этапов на d6)');
  const lpOk = Object.values(c.lifepath).every(e => e.roll >= 1 && e.roll <= 6 && typeof e.text === 'string' && e.text.length > 0);
  ok(lpOk, 'каждый этап — бросок d6 с текстом из таблицы');
  ok(Object.values(c.skills).some(v => v > 0), 'навыки розданы');
  ok(c.gear.length > 0 && c.credits > 0, 'снаряжение роли + эдди по таблице');
}

console.log('\n== Базовые способы создания ==');
{
  const r = genRandom();
  ok(r.method === 'random' && !!r.lifepath, '🎲 Случайно: роль+путь кидаются');
  const t = genTable('corporate', 'exec', 'corpo');
  ok(t.role === 'corporate' && t.archetype === 'exec' && t.background === 'corpo', '📋 Ролевая таблица уважает выбор');
  ok(t.attrs.lu === 2, 'LU=2 при point-buy');
  const lp = genLifePath(rollLifePath({}));
  ok(lp.method === 'lifepath' && Object.keys(lp.lifepath).length === 6, '🛤 Жизненный путь: 6 этапов');
}

console.log('\n== Экспорт JSON ==');
{
  const c = genPreset('edge');
  const json = JSON.stringify(c);
  const back = JSON.parse(json);
  ok(back.role === 'netrunner' && back.attrs.ia === 6, 'сериализация/десериализация без потерь');
}

console.log('\n== Экспорт XLSX ==');
{
  const c = genPreset('full');
  const sheets = xlsxSheets(c);
  ok(sheets.length === 3, 'три листа: персонаж / навыки / прочее');
  const blob = XLSXLite.toBlob(sheets);
  const buf = Buffer.from(blob.parts[0] !== undefined ? blob.parts[0] : blob.parts);
  ok(buf.slice(0, 2).toString() === 'PK', 'файл — валидный ZIP (сигнатура PK)');
  ok(buf.length > 2000, 'размер файла правдоподобен (' + buf.length + ' байт)');
  fs.writeFileSync(path.join(__dirname, 'example.xlsx'), buf);
  console.log('  → записан tests/example.xlsx');
}

console.log('\n' + (failures ? `ПРОВАЛЕНО ТЕСТОВ: ${failures}` : 'ВСЕ ТЕСТЫ ПРОЙДЕНЫ ✅'));
process.exit(failures ? 1 : 0);
