/* ============================================================
   РОЛИ И АРХЕТИПЫ (9 ролей, 27 архетипов)
   Модуль данных Cyberpunk RED (часть таблиц книги игрока).
   ============================================================ */

/* Общий объект CPR: в браузере он уже создан js/data.js (global);
   в Node — регистрируется там же через globalThis. */
/* Общий объект CPR: в браузере это глобальная переменная, созданная одним
   из модулей src/*.js; в vm-тестах — общая лексическая область скриптов. */
if (typeof CPR === 'undefined') var CPR = (globalThis.CPR = globalThis.CPR || {});

/* ---------- РОЛИ И АРХЕТИПЫ (9 ролей, 27 архетипов) ----------
   Распределение атрибутов по книге игрока (Role Values):
   focus  — атрибуты роли: получают 6 + 5 (два значения 6 и 5)
   other  — остальные атрибуты: получают 4 очка; Удача (LU) всегда 2.
   rolePoints — очки ролевых навыков архетипа;
   typePoints — очки навыков типа (распределяются по категориям);
   extras — особые правила архетипа.
*/
CPR.ROLES = [
  {
    key: 'solo', name: 'Соло',
    roleStatLine: 'SOLO',
    archetypes: [
      { key: 'assassin',  name: 'Убийца',
        focus: ['ref','d4'], others: ['cs','cn','co','em','ia','re','tech','lu'],
        rolePoints: 11,
        skills: [['athletics',3],['awareness',2],['handguns',3],['melee',0]],
        typePoints: { combat: 9, stl: 2, move: 4, att: 3, inf: 2, tech: 3 },
        extras: ['Стартовая Брутальность +1 (макс. 6)', 'Оружие ближнего боя наносит +1 урона'] },
      { key: 'enforcer',  name: 'Главарь',
        focus: ['ref','co'], others: ['cs','cn','d4','em','ia','re','tech','lu'],
        rolePoints: 11,
        skills: [['athletics',3],['awareness',2],['heavyweapons',3],['unarmed',3]],
        typePoints: { combat: 9, stl: 2, move: 4, att: 3, inf: 2, tech: 3 },
        extras: ['Стартовая Брутальность +1 (макс. 6)', 'Носимая броня не снижает Ловкость'] },
      { key: 'gunfighter',name: 'Стрелок',
        focus: ['ref','cs'], others: ['cn','co','d4','em','ia','re','tech','lu'],
        rolePoints: 11,
        skills: [['athletics',3],['awareness',2],['rifles',3],['shotguns',3]],
        typePoints: { combat: 9, stl: 2, move: 4, att: 3, inf: 2, tech: 3 },
        extras: ['Стартовая Брутальность +1 (макс. 6)', '+1 к урону дальнобойного оружия'] },
    ]
  },
  {
    key: 'netrunner', name: 'Нетраннер',
    roleStatLine: 'NETRUNNER',
    archetypes: [
      { key: 'brainiac', name: 'Гений',
        focus: ['ia','ref'], others: ['cs','cn','co','d4','em','re','tech','lu'],
        rolePoints: 11,
        skills: [['awareness',2],['demolition',3],['electronics',3],['programming',3]],
        typePoints: { combat: 3, stl: 2, move: 2, att: 3, inf: 2, tech: 9 },
        extras: ['+1 к макс. глубине Сети', 'Тау-атаки наносят +1 урона'] },
      { key: 'ghoul', name: 'Гуль',
        focus: ['ia','cn'], others: ['cs','co','d4','em','ref','re','tech','lu'],
        rolePoints: 11,
        skills: [['awareness',2],['cybercraft',3],['electronics',3],['programming',3]],
        typePoints: { combat: 3, stl: 2, move: 2, att: 3, inf: 2, tech: 9 },
        extras: ['Иммунитет к токсинам и болезням', 'Не может получать некоторые социальные модификаторы'] },
      { key: 'ripperdoc', name: 'Риппердок',
        focus: ['ia','tech'], others: ['cs','cn','co','d4','em','ref','lu','re'],
        rolePoints: 11,
        skills: [['firstaid',3],['medtech',3],['electronics',3],['programming',2]],
        typePoints: { combat: 3, stl: 2, move: 2, att: 3, inf: 2, tech: 9 },
        extras: ['Устанавливает импланты себе и другим', 'Стоимость киберимплантов −20%'] },
    ]
  },
  {
    key: 'rockerboy', name: 'Роккербой',
    roleStatLine: 'ROCKERBOY',
    archetypes: [
      { key: 'edgerunner', name: 'Пограничник',
        focus: ['ref','em'], others: ['cs','cn','co','d4','ia','re','tech','lu'],
        rolePoints: 11,
        skills: [['athletics',3],['performing',3],['playinginst',3],['style',2]],
        typePoints: { combat: 4, stl: 9, move: 3, att: 2, inf: 6, tech: 2 },
        extras: ['Владение Хайпом: лечит союзников выступлением'] },
      { key: 'rockstar', name: 'Рок-звезда',
        focus: ['em','cs'], others: ['cn','co','d4','ia','ref','re','tech','lu'],
        rolePoints: 11,
        skills: [['performing',4],['playinginst',4],['style',3],['fashion',0]],
        typePoints: { combat: 4, stl: 9, move: 3, att: 2, inf: 6, tech: 2 },
        extras: ['+1 к силе влияния на публику'] },
      { key: 'solomus', name: 'Соло-музыкант',
        focus: ['em','d4'], others: ['cs','cn','co','ia','ref','re','tech','lu'],
        rolePoints: 11,
        skills: [['performing',3],['playinginst',4],['sneaking',2],['style',2]],
        typePoints: { combat: 4, stl: 9, move: 3, att: 2, inf: 6, tech: 2 },
        extras: ['Выступает в одиночку, заменяя целую группу'] },
    ]
  },
  {
    key: 'cop', name: 'Коп',
    roleStatLine: 'COP',
    archetypes: [
      { key: 'dictator', name: 'Диктатор',
        focus: ['ia','re'], others: ['cs','cn','co','d4','em','ref','tech','lu'],
        rolePoints: 11,
        skills: [['command',3],['crim',3],['indepth',2],['persuasion',3]],
        typePoints: { combat: 5, stl: 2, move: 3, att: 5, inf: 6, tech: 3 },
        extras: ['+1 к макс. уровню Авторитета'] },
      { key: 'legal eagle', name: 'Юрист',
        focus: ['ia','em'], others: ['cs','cn','co','d4','ref','re','tech','lu'],
        rolePoints: 11,
        skills: [['corpo',3],['education',3],['indepth',3],['lying',2]],
        typePoints: { combat: 5, stl: 2, move: 3, att: 5, inf: 6, tech: 3 },
        extras: ['Знает законы Найт-Сити наизусть'] },
      { key: 'peacekeeper', name: 'Миротворец',
        focus: ['ia','ref'], others: ['cs','cn','co','d4','em','re','tech','lu'],
        rolePoints: 11,
        skills: [['awareness',3],['handguns',3],['unarmed',3],['firstaid',2]],
        typePoints: { combat: 5, stl: 2, move: 3, att: 5, inf: 6, tech: 3 },
        extras: ['Носит жетон: гражданские подчиняются чаще'] },
    ]
  },
  {
    key: 'corporate', name: 'Корпор',
    roleStatLine: 'CORPORATE',
    archetypes: [
      { key: 'exec', name: 'Иерарх',
        focus: ['ia','re'], others: ['cs','cn','co','d4','em','ref','tech','lu'],
        rolePoints: 11,
        skills: [['command',3],['corpo',3],['education',2],['persuasion',3]],
        typePoints: { combat: 4, stl: 4, move: 3, att: 4, inf: 9, tech: 3 },
        extras: ['+1 к макс. уровню Авторитета'] },
      { key: 'fixer', name: 'Фиксер',
        focus: ['cs','ia'], others: ['cn','co','d4','em','ref','re','tech','lu'],
        rolePoints: 11,
        skills: [['connection',3],['haggle',3],['streetwise',3],['lying',2]],
        typePoints: { combat: 4, stl: 4, move: 3, att: 4, inf: 9, tech: 3 },
        extras: ['−20% к ценам на чёрном рынке'] },
      { key: 'maker', name: 'Мейкер',
        focus: ['ia','tech'], others: ['cs','cn','co','d4','em','ref','lu','re'],
        rolePoints: 11,
        skills: [['corpo',3],['engineering',3],['trading',3],['basictech',2]],
        typePoints: { combat: 4, stl: 4, move: 3, att: 4, inf: 9, tech: 3 },
        extras: ['Может производить товары своей корпорации'] },
    ]
  },
  {
    key: 'medic', name: 'Медик',
    roleStatLine: 'MEDIC',
    archetypes: [
      { key: 'bandana', name: 'Банда́на',
        focus: ['em','tech'], others: ['cs','cn','co','d4','ia','ref','lu','re'],
        rolePoints: 11,
        skills: [['firstaid',4],['medtech',3],['awareness',2],['streetwise',2]],
        typePoints: { combat: 3, stl: 2, move: 3, att: 4, inf: 4, tech: 9 },
        extras: ['Лечит на ходу, в перестрелке'] },
      { key: 'chirurgeon', name: 'Хирург',
        focus: ['d4','tech'], others: ['cs','cn','co','em','ia','ref','lu','re'],
        rolePoints: 11,
        skills: [['firstaid',3],['medtech',4],['electronics',2],['programming',2]],
        typePoints: { combat: 3, stl: 2, move: 3, att: 4, inf: 4, tech: 9 },
        extras: ['Операции проходят успешнее (+2)'] },
      { key: 'trauma', name: 'Травма-команда',
        focus: ['cn','tech'], others: ['cs','co','d4','em','ia','ref','lu','re'],
        rolePoints: 11,
        skills: [['firstaid',4],['medtech',3],['athletics',2],['piloting',2]],
        typePoints: { combat: 3, stl: 2, move: 3, att: 4, inf: 4, tech: 9 },
        extras: ['Действует в зоне боевых действий без штрафов'] },
    ]
  },
  {
    key: 'tinker', name: 'Тинкер',
    roleStatLine: 'TINKER',
    archetypes: [
      { key: 'garagehand', name: 'Гаражник',
        focus: ['d4','tech'], others: ['cs','cn','co','em','ia','ref','lu','re'],
        rolePoints: 11,
        skills: [['basictech',3],['electronics',3],['engineering',3],['safecracking',2]],
        typePoints: { combat: 3, stl: 2, move: 4, att: 3, inf: 2, tech: 10 },
        extras: ['+2 к проверкам починки техники'] },
      { key: 'inventor', name: 'Изобретатель',
        focus: ['ia','tech'], others: ['cs','cn','co','d4','em','ref','lu','re'],
        rolePoints: 11,
        skills: [['engineering',4],['electronics',3],['programming',2],['indepth',2]],
        typePoints: { combat: 3, stl: 2, move: 4, att: 3, inf: 2, tech: 10 },
        extras: ['Может изобретать новые устройства'] },
      { key: 'profiteer', name: 'Профитер',
        focus: ['cs','tech'], others: ['cn','co','d4','em','ia','ref','lu','re'],
        rolePoints: 11,
        skills: [['haggle',3],['trading',4],['streetwise',2],['basictech',2]],
        typePoints: { combat: 3, stl: 2, move: 4, att: 3, inf: 2, tech: 10 },
        extras: ['Продаёт свои изделия с наценкой ×2'] },
    ]
  },
  {
    key: 'nomad', name: 'Кочевник',
    roleStatLine: 'NOMAD',
    archetypes: [
      { key: 'bagman', name: 'Контрабандист',
        focus: ['cs','d4'], others: ['cn','co','em','ia','ref','re','tech','lu'],
        rolePoints: 11,
        skills: [['piloting',3],['sneaking',3],['awareness',2],['haggle',3]],
        typePoints: { combat: 4, stl: 2, move: 9, att: 4, inf: 4, tech: 3 },
        extras: ['Группа знает все тайники на дорогах'] },
      { key: 'caver', name: 'Пещерник',
        focus: ['cn','ref'], others: ['cs','co','d4','em','ia','re','tech','lu'],
        rolePoints: 11,
        skills: [['athletics',3],['demolition',3],['heavyweapons',2],['survival',3]],
        typePoints: { combat: 4, stl: 2, move: 9, att: 4, inf: 4, tech: 3 },
        extras: ['Живёт под землёй, привык к тесноте'] },
      { key: 'roadwarrior', name: 'Дорожный воин',
        focus: ['ref','d4'], others: ['cs','cn','co','em','ia','re','tech','lu'],
        rolePoints: 11,
        skills: [['motorcycles',4],['piloting',3],['rifles',2],['unarmed',2]],
        typePoints: { combat: 4, stl: 2, move: 9, att: 4, inf: 4, tech: 3 },
        extras: ['+2 к атакам из движущегося транспорта'] },
    ]
  },
  {
    key: 'scav', name: 'Мародёр',
    roleStatLine: 'SCAV',
    archetypes: [
      { key: 'bughunter', name: 'Охотник на жуков',
        focus: ['cn','d4'], others: ['cs','co','em','ia','ref','re','tech','lu'],
        rolePoints: 11,
        skills: [['athletics',3],['demolition',2],['sneaking',3],['firstaid',3]],
        typePoints: { combat: 6, stl: 2, move: 5, att: 4, inf: 2, tech: 5 },
        extras: ['Ищет биомассу и съедобное в Пустошах'] },
      { key: 'forager', name: 'Собиратель',
        focus: ['ia','cn'], others: ['cs','co','d4','em','ref','re','tech','lu'],
        rolePoints: 11,
        skills: [['awareness',3],['survival',3],['streetwise',2],['trading',3]],
        typePoints: { combat: 6, stl: 2, move: 5, att: 4, inf: 2, tech: 5 },
        extras: ['Находит полезные вещи там, где другие видят мусор'] },
      { key: 'raider', name: 'Рейдер',
        focus: ['ref','cn'], others: ['cs','co','d4','em','ia','re','tech','lu'],
        rolePoints: 11,
        skills: [['athletics',3],['handguns',3],['melee',3],['intimidate',2]],
        typePoints: { combat: 6, stl: 2, move: 5, att: 4, inf: 2, tech: 5 },
        extras: ['Запугивает жертв рейдов автоматически'] },
    ]
  },
];

if (typeof module !== 'undefined') module.exports = CPR;
