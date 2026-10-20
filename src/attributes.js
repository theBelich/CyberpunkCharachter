/* ============================================================
   АТРИБУТЫ (9)
   Модуль данных Cyberpunk RED (часть таблиц книги игрока).
   ============================================================ */

/* Общий объект CPR: в браузере он уже создан js/data.js (global);
   в Node — регистрируется там же через globalThis. */
/* Общий объект CPR: в браузере это глобальная переменная, созданная одним
   из модулей src/*.js; в vm-тестах — общая лексическая область скриптов. */
if (typeof CPR === 'undefined') var CPR = (globalThis.CPR = globalThis.CPR || {});

/* ---------- АТРИБУТЫ (9) ---------- */
CPR.ATTRS = [
  { key: 'cs',  abbr: 'CS', name: 'Техника и связь' },   // Cool, Skill & Luck
  { key: 'cn',  abbr: 'CN', name: 'Выносливость' },      // Constitution
  { key: 'co',  abbr: 'CO', name: 'Сила' },              // Body
  { key: 'd4',  abbr: 'D4', name: 'Ловкость' },          // Dexterity
  { key: 'em',  abbr: 'EM', name: 'Эмпатия' },           // Empathy
  { key: 'ia',  abbr: 'IA', name: 'Интеллект' },         // Intelligence & Awareness
  { key: 'lu',  abbr: 'LU', name: 'Удача' },             // Luck
  { key: 'ref', abbr: 'REF', name: 'Реакция' },          // Reaction
  { key: 're',  abbr: 'RE', name: 'Решимость' },         // Resolve
  { key: 'tech', abbr: 'TECH', name: 'Техника' },        // Technique
];
CPR.attrByKey = k => CPR.ATTRS.find(a => a.key === k);

if (typeof module !== 'undefined') module.exports = CPR;
