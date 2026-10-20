/* ============================================================
   CYBERPUNK RED — игровые данные (по книге игрока, COREBOOK)
   Атрибуты, навыки, роли и архетипы, происхождения,
   жизненные пути, стартовые пакеты.
   Язык данных: русский (как в русской редакции книги игрока).
   ============================================================ */

const CPR = {};

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

/* доп. навык, встречающийся в описаниях архетипов */
CPR.SKILLS.push({ key: 'survival', name: 'Выживание', attr: 'ia', type: 'att' });
CPR.SKILLS.push({ key: 'melee',    name: 'Ближний бой', attr: 'ref', type: 'combat' });

/* убрать «заглушку» из Тинкера */
CPR.ROLES.forEach(r => { r.archetypes = r.archetypes.filter(a => !a.skip); });

/* ---------- ПРОИСХОЖДЕНИЯ (Background) — 8 вариантов, кидается d8 ---------- */
CPR.BACKGROUNDS = [
  { key: 'blackouts', name: 'Отключённый', desc: 'Вы пережили Великое Отключение и выросли в мире без электросетей.',
    skills: [['survival',2],['firstaid',2],['bicycling',2],['haggle',2]], credits: 550,
    items: ['Фонарик', 'Спальный мешок', 'Рюкзак'] },
  { key: 'boomer', name: 'Бумер', desc: 'Вы родились в Пустоши и всю жизнь колесяте по пыльным трактам.',
    skills: [['piloting',2],['motorcycles',2],['basictech',2],['awareness',2]], credits: 550,
    items: ['Канистра топлива', 'Аптечка', 'Гаечный набор'] },
  { key: 'choomb', name: 'Чумба из трущоб', desc: 'Вы выросли в гетто Найт-Сити и знаете цену каждой эдди.',
    skills: [['streetwise',2],['crim',2],['athletics',2],['intimidate',2]], credits: 550,
    items: ['Кухонный нож', 'Куртка с капюшоном', 'Поддельные документы'] },
  { key: 'corpo', name: 'Корпоративный отпрыск', desc: 'Вы росли за стеклянными стенами башни, в достатке и интригах.',
    skills: [['corpo',2],['education',2],['fashion',2],['persuasion',2]], credits: 550,
    items: ['Дорогой костюм', 'Планшет NetAccess', 'Персональный чип-код'] },
  { key: 'ent', name: 'Звезда шоу-бизнеса', desc: 'Ваш дом — сцена, а публика знает ваше имя.',
    skills: [['performing',2],['style',2],['makeup',2],['lying',2]], credits: 550,
    items: ['Сценический костюм', 'Гитара', 'Пачка писем от фанатов'] },
  { key: 'lantern', name: 'Из пригорода', desc: 'Вы выросли в спокойном пригороде, пока его не сожрали корпорации.',
    skills: [['connection',2],['education',2],['indepth',2],['piloting',2]], credits: 550,
    items: ['Семейные фотографии', 'Охотничий нож', 'Рабочий комбинезон'] },
  { key: 'nomadbg', name: 'Из племени кочевников', desc: 'Ваша семья — группа, а дорога — закон.',
    skills: [['piloting',2],['riding',2],['connection',2],['basictech',2]], credits: 550,
    items: ['Нож группы', 'Плед', 'Карта маршрутов'] },
  { key: 'street', name: 'Уличный ребёнок', desc: 'Улицы вырастили вас: воровство, драки, выживание.',
    skills: [['sneaking',2],['crim',2],['streetwise',2],['unarmed',2]], credits: 550,
    items: ['Сигареты', 'Перчатки без пальцев', 'Краденый медибринг'] },
];

/* ---------- ЖИЗНЕННЫЙ ПУТЬ (Life Path) — таблицы d6 ---------- */
CPR.LIFEPATH = {
  attitude: [
    'Циник: «Всем всё равно, кроме тех, кто платит»',
    'Идеалист: «Мир можно исправить, если постараться»',
    'Прагматик: «Делай что работает, думай потом»',
    'Нигилист: «Ничто не имеет значения»',
    'Романтик: «Каждый день — история, которую стоит рассказать»',
    'Параноик: «Все врут, и у всех есть цена»',
  ],
  somethingValued: [
    'Свобода делать что хочешь', 'Верные друзья и семья',
    'Деньги и власть', 'Уважение улицы',
    'Тихая жизнь без долгов', 'Слава и признание',
  ],
  somethingFear: [
    'Потерять контроль над собой', 'Оказаться одному в Пустоши',
    'Предательство близких', 'Пойти на службу к корпорации',
    'Потерять рассудок (киберпсихоз)', 'Скончаться в нищете и забвении',
  ],
  somethingLost: [
    'Дом, сожжённый во время Войны', 'Лучший друг, убитый на улице',
    'Работа и статус в корпорации', 'Семья, пропавшая в Пустоши',
    'Часть тела, заменённая имплантом', 'Любовь, продавшая вас',
  ],
  somethingForce: [
    'Месть тому, кто всё отнял', 'Искупление прошлой ошибки',
    'Защита последних близких', 'Доказать свою ценность миру',
    'Найти пропавшего(ую)', 'Выбраться из долговой ямы',
  ],
  people: [
    'Наставник, который всему научил', 'Заклятый враг, ищущий вас',
    'Любовь, оставшаяся в прошлом', 'Младший брат/сестра, за которым присматриваете',
    'Долговая служба у фиксера', 'Случайный свидетель вашего секрета',
  ],
};

/* ---------- СТАРТОВЫЕ ПАКЕТЫ ПО РОЛЯМ ---------- */
CPR.STARTGEAR = {
  solo:       ['Броня лёгкая (SP 10)', 'Пистолет с боеприпасами', 'Коммьютер', 'Нож', 'Куртка Соло'],
  netrunner:  ['Кибердека (доступ в Сеть)', 'Усилитель сигнала', 'Коммьютер', 'Лёгкая броня', 'Очки AR'],
  rockerboy:  ['Гитара или синтезатор', 'Костюм для выступлений', 'Коммьютер', 'Пистолет калибра .22', 'Фургон (совместно)'],
  cop:        ['Жетон', 'Пистолет «Чёрный единорог»', 'Наручники', 'Броня', 'Коммьютер', 'Дубинка'],
  corporate:  ['Дорогой костюм', 'Пистолет в кобуре', 'Коммьютер', 'Кредитная карточка корпы', 'Портфолио'],
  medic:      ['Полевая аптечка', 'Медибринг ×5', 'Коммьютер', 'Бронжилет', 'Фонарь-головной убор'],
  tinker:     ['Набор инструментов', 'Сварочный аппарат', 'Коммьютер', 'Канистра бензина', 'Ящик запчастей'],
  nomad:      ['Фургон группы', 'Взрывчатка C-4', 'Коммьютер', 'Броня', 'Канистры топлива'],
  scav:       ['Респиратор', 'Лом', 'Коммьютер', 'Рюкзак мародёра', 'Дрон-разведчик (б/у)'],
};

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

/* ============================================================
   ГОТОВЫЕ ПАКЕТЫ СОЗДАНИЯ ПЕРСОНАЖА (3 варианта)
   1. Уличная крыса — простой старт: чумба из трущоб, минимальный набор
   2. Эджраннер     — уличный раннер: Соло/Стрелок + кибердека и импланты
   3. Полный пакет  — максимальный стартовый комплект по всем таблицам книги
   ============================================================ */
CPR.PRESETS = [
  {
    key: 'rat', name: 'Уличная крыса', icon: '🐀', tagline: 'Простой старт с улицы',
    desc: 'Быстрый лист «с нуля»: чумба из трущоб, базовые атрибуты, минимум снаряжения. Как в совете книги игрока для новичков.',
    role: 'solo', archetype: 'gunfighter', background: 'choomb',
    attrs: { ref: 5, d4: 5, cs: 4, cn: 4, co: 4, em: 4, ia: 4, re: 4, tech: 3, lu: 2 },
    skills: { handguns: 4, rifles: 2, athletics: 3, awareness: 2, sneaking: 4, streetwise: 4, crim: 2, intimidate: 2 },
    typePoints: { combat: 4, move: 2, att: 2, inf: 2, tech: 1 },
    lifepath: false,
    gear: ['Пистолет «Буль-дог» (28 патронов)', 'Кухонный нож', 'Коммьютер (б/у)', 'Куртка с капюшоном', 'Рюкзак'],
    credits: 350,
    extras: ['Ночевать в Найт-Сити умеете: первый бросок Знания улиц за сессию — без проверки'] },
  {
    key: 'edge', name: 'Эджраннер', icon: '⚡', tagline: 'Уличный раннер на готовом',
    desc: 'Готовый боец с одним имплантом и проверенной командой: Соло/Стрелок с киберглазами, бронёй и напарником-нетраннером.',
    role: 'solo', archetype: 'gunfighter', background: 'street',
    attrs: { ref: 6, d4: 5, cs: 4, cn: 4, co: 4, em: 4, ia: 4, re: 4, tech: 4, lu: 2 },
    skills: { handguns: 5, rifles: 4, athletics: 3, awareness: 3, sneaking: 3, citytalk: 2, connection: 3, streetwise: 3, firstaid: 2 },
    typePoints: { combat: 5, stl: 2, move: 3, att: 3, inf: 3, tech: 2 },
    lifepath: true,
    gear: ['Винтовка «Мальстрём» Jackhammer (30 патронов)', 'Лёгкая броня (SP 13)', 'Кибероптика (очки AR)', 'Коммьютер', 'Медибринги ×3', 'Фургон (совместно с группой)'],
    credits: 750,
    extras: ['Стартовая Брутальность +1 (макс. 6)', '+1 к урону дальнобойного оружия', 'Напарник-нетраннер: один вызов на сессию'] },
  {
    key: 'full', name: 'Полный пакет', icon: '💼', tagline: 'Максимум по всем таблицам',
    desc: 'Персонаж по полной процедуре книги игрока: полный Жизненный путь на d6, все очки навыков, полное снаряжение роли и происхождения, эдди по таблице.',
    role: null, archetype: null, background: null,
    attrs: null, skills: {},
    typePoints: null,
    lifepath: true, fullLifePath: true,
    gear: null,
    credits: null,
    extras: null },
];

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
