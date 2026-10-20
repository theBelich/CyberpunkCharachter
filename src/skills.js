/* ============================================================
   НАВЫКИ
   Модуль данных Cyberpunk RED (часть таблиц книги игрока).
   ============================================================ */

/* Общий объект CPR: в браузере он уже создан js/data.js (global);
   в Node — регистрируется там же через globalThis. */
/* Общий объект CPR: в браузере это глобальная переменная, созданная одним
   из модулей src/*.js; в vm-тестах — общая лексическая область скриптов. */
if (typeof CPR === 'undefined') var CPR = (globalThis.CPR = globalThis.CPR || {});

/* ---------- НАВЫКИ ----------
   type: combat | combatglitch | stl | move | att | inf | tech
*/
CPR.SKILLS = [
  // Боевые навыки
  { key: 'athletics',    name: 'Атлетика',                        attr: 'ref',  type: 'combat' },
  { key: 'heavyweapons', name: 'Тяжёлое оружие',                  attr: 'ref',  type: 'combat' },
  { key: 'handguns',     name: 'Пистолеты',                       attr: 'ref',  type: 'combat' },
  { key: 'longblades',   name: 'Длинноклинковое оружие',          attr: 'ref',  type: 'combat' },
  { key: 'rifles',       name: 'Винтовки и штурмовое оружие',     attr: 'ref',  type: 'combat' },
  { key: 'shotguns',     name: 'Дробовики',                       attr: 'ref',  type: 'combat' },
  { key: 'unarmed',      name: 'Без оружия',                      attr: 'ref',  type: 'combat' },
  { key: 'sneaking',     name: 'Скрытность',                      attr: 'ref',  type: 'combat' },
  // Боевые / глитч-навыки
  { key: 'antitech',     name: 'Антитеха',                        attr: 'tech', type: 'combatglitch' },
  { key: 'demolition',   name: 'Подрывное дело',                  attr: 'tech', type: 'combatglitch' },
  // Стильные навыки
  { key: 'fashion',      name: 'Мода',                            attr: 'em',   type: 'stl' },
  { key: 'makeup',       name: 'Грим',                            attr: 'em',   type: 'stl' },
  { key: 'playinginst',  name: 'Игра на муз. инструменте',        attr: 'em',   type: 'stl' },
  { key: 'performing',   name: 'Выступление',                     attr: 'em',   type: 'stl' },
  { key: 'style',        name: 'Стиль',                           attr: 'em',   type: 'stl' },
  // Навыки передвижения
  { key: 'bicycling',    name: 'Езда на велосипеде',              attr: 'ref',  type: 'move' },
  { key: 'motorcycles',  name: 'Мотоциклы',                       attr: 'ref',  type: 'move' },
  { key: 'piloting',     name: 'Пилотирование',                   attr: 'ref',  type: 'move' },
  { key: 'riding',       name: 'Верховая езда',                   attr: 'ref',  type: 'move' },
  { key: 'skating',      name: 'Ролики/скейтборд',                attr: 'ref',  type: 'move' },
  // Навыки внимания
  { key: 'awareness',    name: 'Внимательность',                  attr: 'ia',   type: 'att' },
  { key: 'citytalk',     name: 'Слухи Найт-Сити',                 attr: 'ia',   type: 'att' },
  { key: 'crim',         name: 'Криминал',                        attr: 'ia',   type: 'att' },
  { key: 'corpo',        name: 'Корпорации',                      attr: 'ia',   type: 'att' },
  { key: 'media',        name: 'Медиа',                           attr: 'ia',   type: 'att' },
  // Навыки влияния
  { key: 'charm',        name: 'Обаяние',                         attr: 'em',   type: 'inf' },
  { key: 'command',      name: 'Командование',                    attr: 'em',   type: 'inf' },
  { key: 'connection',   name: 'Связи',                           attr: 'em',   type: 'inf' },
  { key: 'courier',      name: 'Курьер',                          attr: 'em',   type: 'inf' },
  { key: 'education',    name: 'Образование',                     attr: 'ia',   type: 'inf' },
  { key: 'haggle',       name: 'Торг',                            attr: 'em',   type: 'inf' },
  { key: 'indepth',      name: 'Профильные знания',               attr: 'ia',   type: 'inf' },
  { key: 'intimidate',   name: 'Запугивание',                     attr: 'em',   type: 'inf' },
  { key: 'streetwise',   name: 'Знание улиц',                     attr: 'ia',   type: 'inf' },
  { key: 'lying',        name: 'Ложь',                            attr: 'em',   type: 'inf' },
  { key: 'persuasion',   name: 'Убеждение',                       attr: 'em',   type: 'inf' },
  // Технические навыки
  { key: 'basictech',    name: 'Базовые технические',             attr: 'tech', type: 'tech' },
  { key: 'comcyber',     name: 'Связь и кибертехника',            attr: 'tech', type: 'tech' },
  { key: 'cybercraft',   name: 'Киберимпланты и оружие',          attr: 'tech', type: 'tech' },
  { key: 'electronics',  name: 'Электроника',                     attr: 'tech', type: 'tech' },
  { key: 'engineering',  name: 'Инженерное дело',                 attr: 'tech', type: 'tech' },
  { key: 'firstaid',     name: 'Первая помощь',                   attr: 'tech', type: 'tech' },
  { key: 'medtech',      name: 'Медицина',                        attr: 'tech', type: 'tech' },
  { key: 'polygraph',    name: 'Детектор лжи',                    attr: 'tech', type: 'tech' },
  { key: 'programming',  name: 'Программирование',                attr: 'tech', type: 'tech' },
  { key: 'safecracking', name: 'Вскрытие сейфов',                 attr: 'tech', type: 'tech' },
  { key: 'trading',      name: 'Торговля',                        attr: 'tech', type: 'tech' },
];

CPR.skillByKey = k => CPR.SKILLS.find(s => s.key === k);

if (typeof module !== 'undefined') module.exports = CPR;
