/* ============================================================
   ВЫЧИСЛЯЕМЫЕ ЗНАЧЕНИЯ И МОДИФИКАТОРЫ
   Модуль данных Cyberpunk RED (часть таблиц книги игрока).
   ============================================================ */

/* Общий объект CPR: в браузере он уже создан js/data.js (global);
   в Node — регистрируется там же через globalThis. */
/* Общий объект CPR: в браузере это глобальная переменная, созданная одним
   из модулей src/*.js; в vm-тестах — общая лексическая область скриптов. */
if (typeof CPR === 'undefined') var CPR = (globalThis.CPR = globalThis.CPR || {});

/* ---------- ВЫЧИСЛЯЕМЫЕ ЗНАЧЕНИЯ ---------- */
CPR.DERIVED = [
  { key: 'body',   name: 'Тело (BODY)',        formula: p => p.attrs.co,                  note: 'Очки здоровья = BODY × 5' },
  { key: 'hits',   name: 'HP (Здоровье)',      formula: p => p.attrs.co * 5,              note: '' },
  { key: 'save',   name: 'Сохранение (SAVE)',  formula: p => p.attrs.cn,                  note: 'Спасбросы против токсинов и травм' },
  { key: 'dodge',  name: 'Уклонение (DODGE)',  formula: p => p.attrs.ref,                 note: 'Сложность уклонения и ближней защиты' },
  { key: 'death',  name: 'Смерть (DEATH)',     formula: p => Math.floor(p.attrs.co * 0.8),note: 'Порог мгновенной смерти' },
  { key: 'emp',    name: 'Эмпатия (EMP)',      formula: p => p.attrs.em,                  note: '' },
  { key: 'humane', name: 'Humanity',           formula: p => p.attrs.em * 10,             note: 'Максимум человечности; резерв = EMP×10 − потери' },
  { key: 'cyberl', name: 'Лимит имплантов',    formula: p => p.attrs.em * 10,             note: 'Порог киберпсихоза' },
  { key: 'luck',   name: 'Удача (LUCK)',       formula: p => p.attrs.lu,                  note: 'Очки удачи за сцену' },
  { key: 'run',    name: 'Бег (RUN)',          formula: p => p.attrs.d4,                  note: 'Клеток за действие передвижения' },
  { key: 'leap',   name: 'Прыжок (LEAP)',      formula: p => Math.ceil(p.attrs.d4 / 2),   note: 'Метров в прыжке' },
];


/* ---------- МОДИФИКАТОРЫ (для отображения) ---------- */
CPR.MODLABELS = ['−2', '−1', '+0', '+1', '+2', '+3'];

/* категории навыков для вывода */
CPR.TYPE_LABELS = {
  combat: 'Боевые навыки',
  combatglitch: 'Боевые / Глитч',
  stl: 'Стильные навыки',
  move: 'Навыки передвижения',
  att: 'Навыки внимания',
  inf: 'Навыки влияния',
  tech: 'Технические навыки',
};

if (typeof module !== 'undefined') module.exports = CPR;
