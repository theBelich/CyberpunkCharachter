// ============================================================
// Cyberpunk RED — генератор персонажей (лист + 3 способа создания)
// Данные: Data/Cyberpunk Red Core Rulebook v1.25.pdf
//   Способ №1 «Уличная крыса» (Streetrats)      — стр. 73–77
//   Способ №2 «Эджраннер» (Edgerunners)         — стр. 77
//   Способ №3 «Полный пакет» (Complete Packages)— стр. 78
// Роли, таблицы шаблонов характеристик и списки навыков: src/roles/*.js
// Справочник навыков (названия и связка «навык → характеристика»): data/skills.js
// ============================================================

import { solo } from "../src/roles/solo.js";
import { netrunner } from "../src/roles/netrunner.js";
import { rockerboy } from "../src/roles/rockerboy.js";
import { nomad } from "../src/roles/nomad.js";
import { fixer } from "../src/roles/fixer.js";
import { tech } from "../src/roles/tech.js";
import { medtech } from "../src/roles/medtech.js";
import { exec } from "../src/roles/exec.js";
import { media } from "../src/roles/media.js";
import { lawman } from "../src/roles/lawman.js";
import { SKILLS, SKILL_BY_NAME, SKILL_GROUPS } from "../data/skills.js";
import { ROLE_ABILITIES } from "../data/role-abilities.js";
import { buildSheetData, exportJSON, exportXLSX, exportPDF, downloadBlob, parseImportedJSON } from "./exporters.js";

const ROLES = [solo, netrunner, rockerboy, nomad, fixer, tech, medtech, exec, media, lawman];

// ------------------------------------------------------------
// Русские названия
// ------------------------------------------------------------
const ROLE_RU = {
  Solo: "Соло", Netrunner: "Нетраннер", Rockerboy: "Рокербой", Nomad: "Кочевник",
  Fixer: "Фиксер", Tech: "Технарь", Medtech: "Медтехник", Exec: "Корпорат",
  Media: "Журналист", Lawman: "Законник"
};

const STAT_RU = {
  INT: "Интеллект", REF: "Рефлексы", DEX: "Ловкость", TECH: "Техника", COOL: "Самообладание",
  WILL: "Воля", LUCK: "Удача", MOVE: "Скорость", BODY: "Телосложение", EMP: "Эмпатия"
};

// Русские названия групп навыков (Skill Definitions, Core Rulebook стр. 82–85)
const GROUP_RU = {
  Awareness: "Восприятие", Body: "Тело", Control: "Управление", Education: "Образование",
  Fighting: "Бой", Performance: "Выступление", "Ranged Weapons": "Стрельба",
  Social: "Социальные", Technique: "Техника"
};

// Русское название навыка берётся из справочника data/skills.js
const skillRu = (s) => SKILL_BY_NAME[s]?.ru || s;
// Характеристика, используемая в проверке навыка (data/skills.js)
const skillStat = (s) => SKILL_BY_NAME[s]?.stat || "—";

// ------------------------------------------------------------
// Случайные данные для оформления листа (в духе правил)
// ------------------------------------------------------------
const NAMES = ["Ви","Джекс","Люси","Рейвен","Мирко","Таня","Диего","Нокс","Арсени","Кагами",
  "Шепот","Кузьма","Виктор","Марлоу","Скарлет","Отец","Заяц","Гризли","Неон","Призма"];
const NICKS = ["Призрак","Кобра","Искра","Ворон","Стальная","Гроза","Тень","Джаз","Ржавый","Лезвие","Фантом","Циклон"];
const STYLES = ["неон и хром", "рваный гранж", "строгий корпоративный крой", "панк-латка на куртке",
  "тактические разгрузки", "яркая безумная раскраска", "кожа, шипы, цепи", "дождевые пончо и маски"];

// ------------------------------------------------------------
// ЖИЗНЕННЫЙ ПУТЬ (Cyberpunk RED Core Rulebook, «Tales from the Street», стр. 43–52)
// Механика книги: «Roll 1d10 or choose one» — каждый пункт можно
// вытянуть кубиком ИЛИ выбрать вручную. Пункты личных данных:
// культурное происхождение, личность, одежда/причёска/особенность,
// что ценишь выше всего, отношение к людям, самый близкий человек,
// самая ценная вещь, происхождение семьи, окружение (детство),
// семейный кризис, друзья, враги, трагическая любовь, жизненные цели.
// Плюс роль-специфичный путь: «тип» роли (1d10 или 1d6 — см. таблицы
// конкретных ролей, стр. 53–67).
// Тексты вариантов — перевод таблиц книги.
// ------------------------------------------------------------
const LIFEPATH_FIELDS = [
  { key: "culture",     label: "Культурное происхождение", icon: "🌍", dice: 10 },
  { key: "personality", label: "Личность",                 icon: "🎭", dice: 10 },
  { key: "clothing",    label: "Стиль одежды",             icon: "👕", dice: 10 },
  { key: "hair",        label: "Причёска",                 icon: "💇", dice: 10 },
  { key: "affectation", label: "Отличительная черта",      icon: "📿", dice: 10 },
  { key: "value",       label: "Что ценишь выше всего",    icon: "⚖️", dice: 10 },
  { key: "people",      label: "Отношение к людям",        icon: "👥", dice: 10 },
  { key: "closePerson", label: "Самый близкий человек",    icon: "❤️", dice: 10 },
  { key: "valuable",    label: "Самая ценная вещь",        icon: "🔧", dice: 10 },
  { key: "family",      label: "Происхождение семьи",      icon: "🏠", dice: 10 },
  { key: "childhood",   label: "Окружение (детство)",      icon: "🧒", dice: 10 },
  { key: "crisis",      label: "Семейный кризис",          icon: "💥", dice: 10 },
  { key: "friends",     label: "Друзья",                   icon: "🤝", dice: 10, count: true },
  { key: "enemies",     label: "Враги",                    icon: "🗡️", dice: 10, count: true },
  { key: "love",        label: "Трагическая любовь",       icon: "💔", dice: 10, count: true },
  { key: "goal",        label: "Жизненные цели",           icon: "🎯", dice: 10 },
  { key: "roleType",    label: "Путь роли · тип",          icon: "🛤️", dice: 10, roleSpecific: true }
];

// Общие таблицы (для всех ролей). Индекс массива = выпавшему числу − 1.
const LIFEPATH_OPTIONS = {
  culture: [
    "Североамериканец","Южно-/Центральноамериканец","Западноевропеец","Восточноевропеец",
    "Ближний Восток / Северная Африка","Чернокожий африканец (Африка к югу от Сахары)","Южноазиатский",
    "Юго-восточный азиат","Восточноазиатский","Океания / тихоокеанский островитянин"
  ],
  personality: [
    "Застенчивый и скрытный","Бунтарский, антисоциальный, агрессивный","Высокомерный, гордый, отстранённый",
    "Переменчивый, опрометчивый, своевольный","Привередливый, суетливый, нервный","Рассудительный и серьёзный",
    "Глноватый и легкомысленный","Хитрый и обманчивый","Интеллектуальный и отстранённый","Дружелюбный и общительный"
  ],
  clothing: [
    "Generic Chic (стандартное, яркое, модульное)","Leisurewear (удобство, подвижность, атлетизм)",
    "Urban Flash (броское, технологичное, уличное)","Businesswear (лидерство, присутствие, авторитет)",
    "High Fashion (эксклюзив, дизайнер, haute couture)","Bohemian (простонародное, ретро, свободное)",
    "Bag Lady Chic (бомжатское, рваное, бродяжье)","Gang Colors (опасное, агрессивное, бунтарское)",
    "Nomad Leathers (вестерн, грубое, племенное)","Asia Pop (яркое, костюмоподобное, молодёжное)"
  ],
  hair: [
    "Ирокез","Длинные и лохматые","Короткие и торчащие","Дикие, во все стороны","Лысый","В полоску",
    "Дикие цвета","Опрятные и короткие","Короткие и кудрявые","Длинные и прямые"
  ],
  affectation: [
    "Татуировки","Зеркальные очки","Ритуальные шрамы","Перчатки с шипами","Кольцо в носу",
    "Пирсинг языка или иной","Странные ногтевые импланты","Ботинки или каблуки с шипами",
    "Перчатки без пальцев","Странные линзы"
  ],
  value: [
    "Деньги","Честь","Данное слово","Честность","Знание","Месть","Любовь","Власть","Семья","Дружба"
  ],
  people: [
    "Держусь нейтрально.","Держусь нейтрально.","Нравится почти каждый.","Ненавижу почти всех.",
    "Люди — инструмент. Используй ради своих целей, затем выбрасывай.","Каждый человек — ценная личность.",
    "Люди — препятствия, которые надо уничтожить, если они мне мешают.","Люди ненадёжны. Никому не доверяй.",
    "Выжгите их всех, пусть тараканы наследят землю.","Люди прекрасны!"
  ],
  closePerson: [
    "Родитель","Брат или сестра","Возлюбленный(-ая)","Друг","Ты сам","Питомец","Учитель или наставник",
    "Публичная фигура","Личный герой","Никто"
  ],
  valuable: [
    "Оружие","Инструмент","Предмет одежды","Фотография","Книга или дневник","Запись",
    "Музыкальный инструмент","Ювелирное украшение","Игрушка","Письмо"
  ],
  family: [
    "Корпоративные элиты (Corporate Execs)","Корпоративные менеджеры (Corporate Managers)",
    "Корпоративные техники (Corporate Technicians)","Кочевой пак (Nomad Pack)",
    "«Семья» гангера (Ganger Family)","Бойцы зон боевых действий (Combat Zoners)",
    "Городские бездомные (Urban Homeless)","Крысы мегаструктур (Megastructure Warren Rats)",
    "Переселенцы-восстановители (Reclaimers)","Эджраннеры (Edgerunners)"
  ],
  childhood: [
    "Жизнь на улице без присмотра взрослых","Безопасная Корпоративная Зона за стеной от остального города",
    "Кочевой пак, кочующий с места на место","Кочевой пак с транспортными корнями (суда, самолёты, караваны)",
    "Приходящий в упадок, кошмарный район, который защищают от байкеров","Сердце Зонового Боя, развалины и сквоты",
    "Огромная «мегаструктура» под контролем корпорации или города","Руины покинутого города, занятые восстановителями",
    "Флотская нация (Drift Nation) — плавающий офшорный город","Корпоративный «звездоскрёб» — роскошь над толпой"
  ],
  crisis: [
    "Семья потеряла всё из-за предательства","Семья потеряла всё из-за плохого управления",
    "Семью сослали или иначе изгнали из родного дома/нации/корпорации","Семья в заключении, ты один сбежал",
    "Семья исчезла. Ты — единственный оставшийся её член","Семья убита, ты — единственный выживший",
    "Семья связана с долгосрочным заговором, организацией или сообществом (мафия, революционная группа)",
    "Семья рассеяна по свету из-за несчастного случая","Семья проклята родовой враждой, длящейся поколениями",
    "Ты наследник семейного долга; должен его отдать, прежде чем жить дальше"
  ],
  friends: [
    "Как старший брат/сестра для тебя","Как младший брат/сестра для тебя","Учитель или наставник",
    "Напарник или коллега","Бывшая возлюбленная","Старый враг","Как родитель для тебя",
    "Друг детства","Кто-то с улицы","Человек с общими интересами или целью"
  ],
  enemies: [
    "Бывший друг","Бывшая возлюбленная","Очутившийся в стороне родственник","Враг ещё с детства",
    "Человек, работающий на тебя","Человек, которому ты служишь","Партнёр или коллега",
    "Корпоративный исполнитель","Правительственный чиновник","Бустергангер"
  ],
  love: [
    "Возлюбленный(-ая) погиб в несчастливом случае","Возлюбленный(-ая) загадочно исчез",
    "Просто не срослось","Личная цель или вендетта встали между вами","Возлюбленного(-ую) похитили",
    "Возлюбленный(-ая) сошёл с ума или стал(а) киберпсихом","Возлюбленный(-ая) покончил(а) с собой",
    "Возлюбленный(-ая) был(а) убит(а) в драке","Соперник вытеснил тебя","Возлюбленный(-ая) в заключении или в изгнании"
  ],
  goal: [
    "Избавиться от дурной репутации","Обрести власть и контроль","Свалить с улиц любой ценой",
    "Причинять боль и страдания всем, кто перешёл тебе дорогу","Прожить прошлое заново и постараться забыть",
    "Найти ответственных за твою жалкую жизнь и заставить их заплатить","Забрать то, что по праву твоё",
    "Спасти (если возможно) кого-то из твоего прошлого — любимого или члена семьи",
    "Обрести славу и признание","Стать тем, кого боятся и уважают"
  ]
};

// Роль-специфичный путь (Role-Based Lifepaths, стр. 53–67).
// По книге первый вопрос — «What Kind of <Роль> are You?»:
// у Rockerboy/Medtech/Tech/Fixer/Exec — 1d10, у остальных — 1d6.
const ROLE_TYPE_TABLES = {
  Rockerboy: { dice: 10, options: [
    "Музыкант","Слэм-поэт","Уличный художник","Перформанс-художник","Комик","Оратор","Политик","Рэп-артист","DJ","Идору"
  ]},
  Solo: { dice: 6, options: [
    "Телохранитель","Уличная мышца на побегушках","Корпоративный силовик с побочными заказами",
    "Корпоративный или фриланс-агент чёрных операций","Местный мститель-наёмник","Ассасин / хитмен на побегушках"
  ]},
  Netrunner: { dice: 6, options: [
    "Фрилансер, взламывающий за деньги","Корпоративный «клонраннер» на хозяина",
    "Хактивист, вскрывающий системы и разоблачающий злодеев","Ломаешь системы просто ради фана",
    "Часть постоянной команды фрилансеров","Хакаешь для медиа, политика или законника по найму"
  ]},
  Tech: { dice: 10, options: [
    "Техник киберимплантов","Автомеханик","Мастер на все руки","Техник мелкой электроники",
    "Оружейник","Сумасшедший изобретатель","Механик роботов и дронов","Механик тяжёлой техники",
    "Сборщик-старатель","Судомеханик"
  ]},
  Medtech: { dice: 10, options: [
    "Хирург","Терапевт общего профиля","Травммедик Trauma Team","Психиатр","Терапевт киберпсихов",
    "Риппердок","Оператор криосистем","Фармацевт","Бодискальптор","Судебный патологоанатом"
  ]},
  Media: { dice: 6, options: [
    "Блогер","Писатель (книги)","Видеограф","Документалист","Репортёр-расследователь","Летописец улицы"
  ]},
  Exec: { dice: 10, options: [
    "Финансы","Медиа и коммуникации","Кибертехника и медицинские технологии","Фармацевтика и биотех",
    "Продукты, одежда и товары широкого потребления","Энергетика","Бытовая электроника и робототехника",
    "Корпоративные услуги","Потребительские сервисы","Недвижимость и строительство"
  ]},
  Lawman: { dice: 6, options: [
    "Гвардия / охрана","Стандартный патруль","Уголовное расследование","Спецназ (SWAT)","Мото-патруль","Внутренние дела (IA)"
  ]},
  Fixer: { dice: 10, options: [
    "Брокер сделок между враждующими бандами","Достаёшь редкие ресурсы для эксклюзивных клиентов",
    "Брокер услуг соло и технарей как агент","Поставляешь регулярный ресурс ночным рынкам (еда, медикаменты, наркотики)",
    "Достаёшь крайне нелегальный товар (уличные наркотики, военное оружие)","Снабжаешь техов и медиков запчастями и медикаментами",
    "Держишь несколько ночных рынков, но не владелец","Брокер контрактов на тяжёлую технику, военную технику и авиацию",
    "Брокер-скупщик у сборщиков, облавающих корпов и зоны боёв","Эксклюзивный агент медиа, рокербоя или кочевого пака"
  ]},
  Nomad: { dice: 10, options: [
    "Гоу-банда (Gogang)","Пассажирский транспорт","Чотоква/школа (кочевая школа-лекторий)","Странствующее шоу/карнавал",
    "Сезонные сельхозрабочие","Грузовой транспорт","Защита перевозок","Контрабанда","Наёмная армия","Строительная бригада"
  ]}
};

// Число граней кубика для пункта пути (1d10 или 1d6 — как в книге)
function dN(sides) { return 1 + Math.floor(Math.random() * sides); }

// Варианты выбора для пункта пути. Общие таблицы одинаковы для всех ролей;
// «Путь роли · тип» — таблица конкретного типа роли (стр. 53–67).
function lifepathOptionsFor(fieldKey, roleName) {
  if (fieldKey === "roleType") {
    const t = ROLE_TYPE_TABLES[roleName];
    return (t?.options || []).slice();
  }
  return (LIFEPATH_OPTIONS[fieldKey] || []).slice();
}

// Кубик для пункта: своя грань у roleType (Solo — 1d6, Rockerboy — 1d10),
// остальные пункты — 1d10.
function lifepathDice(field, roleName) {
  if (field.roleSpecific) return ROLE_TYPE_TABLES[roleName]?.dice || field.dice || 10;
  return field.dice || 10;
}

// Для пунктов Friends/Enemies/Love книга сначала бросает количество:
// «roll 1d10 and subtract 7 (minimum 0)».
function rollCount() { return Math.max(0, d10() - 7); }

// Один пункт пути: результат броска кубика и текст варианта
function rollLifepathItem(field, roleName) {
  const options = lifepathOptionsFor(field.key, roleName);
  const dice = lifepathDice(field, roleName);
  const base = { key: field.key, label: field.label, icon: field.icon, dice, roll: null, value: "—" };
  if (field.count) {
    const n = rollCount();
    if (!n) return { ...base, value: "Нет (бросок количества: 0)" };
    const picks = [];
    for (let i = 0; i < n; i++) picks.push(options[dN(dice) - 1]);
    return { ...base, value: `${n}: ${picks.join(", ")}` };
  }
  if (!options.length) return base;
  const roll = dN(dice);
  return { ...base, roll, value: options[(roll - 1) % options.length] };
}

// Случайный жизненный путь целиком (по механике Cyberpunk RED)
function rollLifepath(roleName) {
  return LIFEPATH_FIELDS.map((f) => rollLifepathItem(f, roleName));
}

// Текстовое резюме пути — для подсказок
function lifepathSummary(lp) {
  return lp.map((x) => `${x.label}: ${x.value}`).join(" · ");
}

// Все варианты поля, подходящие данной роли (свои + общие)
const GEAR_BY_ROLE = {
  default: ["кибердека нет (пока)", "броня Light Bodyshell", "комм", "нож", "аптечка первой помощи"],
  Solo: ["пистоль-пулемёт Malorian Arms 2045", "бронежилет Kiroshka+3", "травмы-набор", "нож-выживалка"],
  Netrunner: ["кибердека Militech Black ICE", "очки-дисплей", "кодеки", "тонкий бронежилет"],
  Rockerboy: ["электрогитара со встроенным усилителем", "комм-передатчик", "яркая куртка", "пистолет Cyberpunk Arms Centurion"],
  Nomad: ["бронированный фургон «Colt Mainframe»", "набор механика", "винтовка", "спальный мешок"],
  Fixer: ["дипломатичный пистолет", "сетка контактов", "сейф-крипта", "приличный костюм"],
  Tech: ["полный набор инструментов", "сварочный аппарат", "запчасти", "дробовик"],
  Medtech: ["хирургический набор", "медсканер", "стим-упаковка", "пистолет-пулемёт для охраны"],
  Exec: ["дорогой костюм Arasaka line", "планшет с доступом к базе", "компактный пистолет", "персональный водитель"],
  Media: ["видеоком и микрофон", "камера-дрон", "пропуск в пресс-пул", "легковой бронированный жилет"],
  Lawman: ["служебный пистолет Hornet", "дубинка", "наручники", "броня Police Issue", "рация"]
};

// ------------------------------------------------------------
// Утилиты
// ------------------------------------------------------------
const d10 = () => 1 + Math.floor(Math.random() * 10);
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const $ = (id) => document.getElementById(id);

// Бодрость по таблице Core Rulebook (стр. 79): HP = 10 + ceil((BODY+WILL)/2)*5
function calcHP(body, will) {
  return 10 + Math.ceil((body + will) / 2) * 5;
}

// Навыки роли: распределить очки по списку навыков (мин 2, макс 6)
function rollSkills(roleData) {
  const pool = 86, min = 2, max = 6;
  const skills = roleData.skills.map((name) => ({ name, level: min }));
  let left = pool - skills.length * min;
  while (left > 0) {
    const s = pick(skills);
    if (s.level < max) { s.level++; left--; }
    else if (skills.every((x) => x.level >= max)) break;
  }
  return skills;
}

// Полный список ВСЕХ навыков игры (data/skills.js): навыки персонажа,
// которых нет в его роли, получают уровень 0 — так на листе отображаются
// все навыки справочника, а не только профессиональные навыки роли.
const ALL_SKILL_NAMES = SKILLS.map((s) => s.name);

function buildFullSkillList(roleSkills) {
  const byName = Object.fromEntries(roleSkills.map((s) => [s.name, s]));
  return ALL_SKILL_NAMES.map((name) => byName[name] || { name, level: 0 });
}

// ------------------------------------------------------------
// ТРИ СПОСОБА СОЗДАНИЯ ХАРАКТЕРИСТИК (по Data/Cyberpunk RED PDF)
// ------------------------------------------------------------

// Способ №1 «Уличная крыса»: один бросок 1d10 → вся строка шаблона
function method1_Streetrat(roleData) {
  const roll = d10();
  const tpl = roleData.statTemplates.find((t) => t.roll === roll);
  const stats = {};
  roleData.statsOrder.forEach((k) => (stats[k] = tpl[k]));
  return { stats, note: `Бросок 1d10 = ${roll}, взята строка шаблона роли` };
}

// Способ №2 «Эджраннер»: отдельный бросок 1d10 на КАЖДУЮ характеристику,
// значение читается из столбца этой характеристики таблицы шаблонов
function method2_Edgerunner(roleData) {
  const stats = {}, rolls = {};
  roleData.statsOrder.forEach((k) => {
    const r = d10();
    rolls[k] = r;
    stats[k] = roleData.statTemplates.find((t) => t.roll === r)[k];
  });
  return { stats, note: "Броски по каждой характеристике: " + Object.entries(rolls).map(([k, v]) => `${k}:${v}`).join(" ") };
}

// Способ №3 «Полный пакет»: пул очков (62), мин 2 / макс 8
function method3_CompletePackage(roleData, points = 62) {
  const order = roleData.statsOrder;
  const stats = {};
  order.forEach((k) => (stats[k] = 2));
  let left = points - order.length * 2;
  while (left > 0) {
    const k = pick(order);
    if (stats[k] < 8) { stats[k]++; left--; }
    else if (order.every((x) => stats[x] >= 8)) break;
  }
  return { stats, note: `Распределено ${points} очков характеристик (мин 2 / макс 8)` };
}

const METHODS = {
  1: { name: "Способ №1 · Уличная крыса", fn: method1_Streetrat },
  2: { name: "Способ №2 · Эджраннер", fn: method2_Edgerunner },
  3: { name: "Способ №3 · Полный пакет", fn: method3_CompletePackage }
};

// ------------------------------------------------------------
// Создание персонажа целиком
// Пользовательские данные (имя / возраст / стиль) берутся из панели
// «Данные персонажа»; если поля пустые — значения выбираются случайно.
// ------------------------------------------------------------
let current = null;

function readIdentity() {
  const name = $("inp-name")?.value.trim() || "";
  const nick = $("inp-nick")?.value.trim() || "";
  const ageRaw = Number($("inp-age")?.value);
  const age = Number.isFinite(ageRaw) && ageRaw >= 15 && ageRaw <= 80 ? Math.round(ageRaw) : null;
  const style = $("sel-style")?.value || "";
  return { name, nick, age, style };
}

// Путь для нового персонажа: если пользователь что-то выбрал вручную
// в панели — берём его значения, недостающие пункты докидываем кубиками
function buildLifepathOnCreate(roleName) {
  if (!Object.values(lpManualPicks).some(Boolean)) return rollLifepath(roleName);
  return LIFEPATH_FIELDS.map((f) => {
    const val = lpManualPicks[f.key];
    if (val) return { key: f.key, label: f.label, icon: f.icon,
                      dice: lifepathDice(f, roleName), roll: null, value: val };
    return rollLifepathItem(f, roleName);
  });
}

function createCharacter(method, opts = {}) {
  const roleData = ROLES.find((r) => r.role === $("role-select").value) || solo;
  const gen = method === 3
    ? METHODS[3].fn(roleData, opts.points ?? Number($("rank-select")?.value || 62))
    : METHODS[method].fn(roleData);

  const id = readIdentity();

  const c = {
    created: Date.now(),
    method,
    methodName: METHODS[method].name,
    note: gen.note,
    role: roleData.role,
    roleRu: ROLE_RU[roleData.role] || roleData.role,
    name: id.name || pick(NAMES),
    nick: id.nick || pick(NICKS),
    age: id.age ?? (18 + Math.floor(Math.random() * 30)),
    style: id.style || pick(STYLES),
    stats: gen.stats,
    statsOrder: roleData.statsOrder,
    baseNote: gen.note,
    statEdits: 0,
    hp: calcHP(gen.stats.BODY, gen.stats.WILL),
    hum: gen.stats.EMP * 10,
    skills: buildFullSkillList(rollSkills(roleData)),
    // Жизненный путь: ручной выбор (если заполнен) или случайная генерация
    lifepath: buildLifepathOnCreate(roleData.role),
    gear: GEAR_BY_ROLE[roleData.role] || GEAR_BY_ROLE.default,
    cash: 100 + Math.floor(Math.random() * 900) * 5
  };
  current = c;
  lpManualPicks = {};   // черновик пути больше не нужен
  if (lpEditorOpen) renderLpEditor();
  renderSheet(c);
  toast(`${c.name} «${c.nick}» — ${c.roleRu} создан (${METHODS[method].name})`);
  return c;
}

// ------------------------------------------------------------
// ЖИЗНЕННЫЙ ПУТЬ — UI выбора: случайно или вручную по механике игры
// «🎲 Сгенерировать случайно» — броски кубиков по таблицам книги;
// «✍ Выбрать вручную» — панель, где для каждого пункта пути показаны
// варианты из таблицы ИМЕННО ВЫБРАННОЙ РОЛИ («Путь роли» — 1d6,
// остальные пункты — 1d10). Роль можно сменить и до создания персонажа.
// ------------------------------------------------------------
let lpEditorOpen = false;
let lpDraftRole = null;   // роль, выбранная в списке ролей (для предпросмотра пути)
let lpManualPicks = {};   // ручные выборы пользователя (пока персонаж не создан)

// Сохранить/обновить жизненный путь текущего персонажа
function applyLifepath(lp, msg) {
  if (!current) { toast("Сначала создайте персонажа!"); return; }
  current.lifepath = lp;
  renderSheet(current);
  if (msg) toast(msg);
}

// Случайная генерация пути по механике Cyberpunk RED
function generateLifepath() {
  if (!current) return toast("Сначала создайте персонажа!");
  applyLifepath(rollLifepath(current.role), "Жизненный путь сгенерирован по таблицам игры");
}

// Показать/скрыть панель ручного выбора
function toggleLpEditor(force) {
  lpEditorOpen = force ?? !lpEditorOpen;
  const box = $("lp-editor");
  if (!box) return;
  if (!lpEditorOpen) { box.classList.add("hidden"); return; }
  box.classList.remove("hidden");
  renderLpEditor();
}

// Текущий набор пунктов пути: у созданного персонажа — его путь,
// до создания — предпросмотр по выбранной в списке роли
function lifepathForEditor(roleName) {
  if (current) return current.lifepath;
  const items = LIFEPATH_FIELDS.map((f) => ({
    key: f.key, label: f.label, icon: f.icon, dice: lifepathDice(f, roleName),
    roll: null, value: lpManualPicks[f.key] || ""
  }));
  // если путь ещё не генерировали — один случайный предпросмотр
  if (!items.some((x) => x.value)) {
    const rolled = rollLifepath(roleName);
    rolled.forEach((r, i) => Object.assign(items[i], r));
  }
  return items;
}

function renderLpEditor() {
  const box = $("lp-editor");
  if (!box) return;
  const roleName = current ? current.role : ($("role-select")?.value || "Solo");
  const roleRu = current ? current.roleRu : (ROLE_RU[roleName] || roleName);
  const items = current ? current.lifepath : lifepathForEditor(roleName);
  box.innerHTML = `
    <h3 class="lp-editor-title">Жизненный путь · роль «${roleRu}» ${current ? "" : "(предпросмотр до создания)"}
      <span class="small muted">по книге: «Roll 1d10 or choose one» — бросай кубик или выбирай сам</span></h3>
    <div class="lp-steps">
      ${LIFEPATH_FIELDS.map((f, i) => {
        const options = lifepathOptionsFor(f.key, roleName);
        const cur = items.find((x) => x.key === f.key);
        const curVal = cur ? cur.value : "";
        const inList = options.includes(curVal);
        const dice = lifepathDice(f, roleName);
        const diceLbl = f.count ? `кол-во: 1d10−7 (мин. 0), затем [1d${dice}]` : `1d${dice}`;
        return `
          <div class="lp-step" data-lp="${i}">
            <div class="lp-step-label">${f.icon} ${f.label} <span class="dice-tag">[${diceLbl}]</span>${cur && cur.roll ? ` <span class="roll">(выпало ${cur.roll})</span>` : ""}</div>
            <select class="lp-pick" data-key="${f.key}" aria-label="Выбор: ${f.label}">
              <option value="" ${!curVal ? "selected" : ""}>— выбрать —</option>
              ${!inList && curVal ? `<option value="${curVal}" selected>${curVal} (своё)</option>` : ""}
              ${options.map((o) =>
                `<option value="${o}" ${o === curVal ? "selected" : ""}>${o}</option>`).join("")}
            </select>
            <button type="button" class="btn tiny lp-reroll" data-key="${f.key}"
                    title="Перебросить этот пункт (${diceLbl})">🎲 Бросить</button>
          </div>`;
      }).join("")}
    </div>
    <div class="gen-row">
      ${current
        ? `<button type="button" class="btn primary" id="btn-lp-apply">Применить выбор</button>`
        : `<button type="button" class="btn primary" id="btn-lp-use-draft">Использовать этот путь при создании</button>`}
      <button type="button" class="btn" id="btn-lp-roll-all">🎲 Случайно всем пунктам</button>
    </div>`;

  box.querySelectorAll("select.lp-pick").forEach((sel) => {
    sel.addEventListener("change", () => {
      if (current) {
        const item = current.lifepath.find((x) => x.key === sel.dataset.key);
        if (item) { item.value = sel.value; item.roll = null; }
      } else {
        lpManualPicks[sel.dataset.key] = sel.value;
      }
    });
  });
  box.querySelectorAll("button.lp-reroll").forEach((btn) => {
    btn.addEventListener("click", () => {
      const f = LIFEPATH_FIELDS.find((x) => x.key === btn.dataset.key);
      const rolled = rollLifepathItem(f, roleName);
      if (current) {
        const item = current.lifepath.find((x) => x.key === f.key) || current.lifepath[LIFEPATH_FIELDS.indexOf(f)];
        Object.assign(item, rolled);
        renderLpEditor();
        toast(`${f.label}: ${rolled.value} (выпало ${rolled.roll})`);
      } else {
        lpManualPicks[f.key] = rolled.value;
        renderLpEditor();
      }
    });
  });
  $("btn-lp-apply")?.addEventListener("click", () => {
    applyLifepath(current.lifepath, "Жизненный путь обновлён: " + lifepathSummary(current.lifepath));
  });
  $("btn-lp-use-draft")?.addEventListener("click", () => {
    toast("Путь учтён: осталось создать персонажа кнопкой внизу панели");
  });
  $("btn-lp-roll-all")?.addEventListener("click", () => {
    if (current) {
      current.lifepath = rollLifepath(current.role);
    } else {
      rollLifepath(roleName).forEach((r) => (lpManualPicks[r.key] = r.value));
    }
    renderLpEditor();
  });
}

// ------------------------------------------------------------
// Редактирование характеристик прямо на листе
// Значение каждой характеристики — числовое поле (1–10, как в Cyberpunk RED).
// При изменении пересчитываются производные (HP, Смерть/ранение, HUM, MOVE),
// обновляются суммы «уровень + характеристика» в таблице навыков и note о
// ручной правке.
// ------------------------------------------------------------
const STAT_MIN = 1, STAT_MAX = 10;

function applyStatChange(key, rawValue) {
  if (!current) return;
  const text = String(rawValue ?? "").trim();
  // некорректный ввод (пустая строка / не число) — оставляем текущее значение
  const num = text === "" || Number.isNaN(Number(text)) ? null : Math.round(Number(text));
  const v = num === null ? current.stats[key] : num;
  const clamped = Math.max(STAT_MIN, Math.min(STAT_MAX, v));
  current.stats[key] = clamped;

  // пересчёт производных величин
  current.hp = calcHP(current.stats.BODY, current.stats.WILL);
  current.hum = current.stats.EMP * 10;

  const baseNote = (current.baseNote ??= current.note || "");
  const edits = (current.statEdits = (current.statEdits || 0) + 1);
  current.note = `${baseNote} · вручную изменено характеристик: ${edits}`;

  renderSheet(current);
  toast(`${key} (${STAT_RU[key] || key}) = ${clamped}`);
}

// ------------------------------------------------------------
// Ролевая способность (Role Ability) — блок над характеристиками,
// сразу под именем и ролью. Текст берётся из data/role-abilities.js
// (перевод описаний из книги игрока, Core Rulebook, стр. 144–163).
// Клик по заголовку сворачивает/разворачивает описание; состояние
// хранится в localStorage, чтобы блок оставался скрытым между листами.
// ------------------------------------------------------------
const RA_LS_KEY = "cp-red-role-ability-collapsed";

function renderRoleAbility(c) {
  const ab = ROLE_ABILITIES[c.role] || null;
  const box = $("role-ability");
  if (!box) return;
  const nameEl = $("ra-name"), enEl = $("ra-en"),
        pageEl = $("ra-page"), textEl = $("ra-text"),
        toggle = $("role-ability-toggle");
  if (!ab) {
    nameEl.textContent = "—";
    enEl.textContent = "";
    pageEl.textContent = "—";
    textEl.textContent = "Создайте персонажа — здесь появится описание ролевой способности из книги игрока.";
    box.classList.add("hidden");
    return;
  }
  box.classList.remove("hidden");
  nameEl.textContent = `${ab.name} · ${c.roleRu}`;
  enEl.textContent = `(${ab.nameEn})`;
  pageEl.textContent = ab.page;
  textEl.textContent = ab.text;
  // состояние свёрнутости не теряется при перерисовке листа
  const collapsed = localStorage.getItem(RA_LS_KEY) === "1";
  textEl.classList.toggle("collapsed", collapsed);
  box.classList.toggle("is-collapsed", collapsed);
  toggle.setAttribute("aria-expanded", String(!collapsed));
}

// ------------------------------------------------------------
// Отрисовка листа
// ------------------------------------------------------------
function renderSheet(c) {
  $("ch-name").textContent = `${c.name} «${c.nick}»`;
  $("ch-role").textContent = c.roleRu;
  $("ch-realname").textContent = c.name;
  $("ch-age").textContent = c.age + " лет";
  $("ch-style").textContent = c.style;
  $("ch-method").textContent = c.methodName;

  // Ролевая способность — описание из книги игрока (Core Rulebook, стр. 144–163).
  // Блок находится над характеристиками, сразу под именем и ролью.
  renderRoleAbility(c);

  // Характеристики — редактируемые числовые поля (1–10). Значение хранится в
  // data-value, чтобы при пустом поле кнопки «−» / «+» отталкивались от него.
  $("stats-grid").innerHTML = c.statsOrder
    .map((k) => `
      <div class="stat">
        <div class="stat-abbr">${k}</div>
        <div class="stat-val stat-edit">
          <button type="button" class="stat-step dec" data-stat="${k}" data-delta="-1"
                  aria-label="Уменьшить ${STAT_RU[k] || k}">−</button>
          <input type="number" class="stat-input" data-stat="${k}" min="${STAT_MIN}" max="${STAT_MAX}" step="1"
                 value="${c.stats[k]}" data-value="${c.stats[k]}"
                 aria-label="${STAT_RU[k] || k} (${k})" title="Можно изменить: введите число или нажмите − / +" />
          <button type="button" class="stat-step inc" data-stat="${k}" data-delta="1"
                  aria-label="Увеличить ${STAT_RU[k] || k}">+</button>
        </div>
        <div class="stat-name">${STAT_RU[k] || k}</div>
      </div>`)
    .join("");

  const onStatEdit = (inp) => {
    applyStatChange(inp.dataset.stat, inp.value);
  };
  $("stats-grid").querySelectorAll("input.stat-input").forEach((inp) => {
    inp.addEventListener("change", () => onStatEdit(inp));
    // Enter применяет значение и убирает фокус (страница не перезагружается)
    inp.addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); inp.blur(); } });
  });
  $("stats-grid").querySelectorAll("button.stat-step").forEach((btn) => {
    btn.addEventListener("click", () => {
      const inp = $(`stats-grid`).querySelector(`input.stat-input[data-stat="${btn.dataset.stat}"]`);
      const base = Number(inp?.dataset.value ?? current?.stats[btn.dataset.stat] ?? STAT_MIN);
      applyStatChange(btn.dataset.stat, base + Number(btn.dataset.delta));
    });
  });

  $("d-hp").textContent = `${c.hp} / ${c.hp}`;
  $("d-sw").textContent = Math.ceil(c.hp / 2);
  $("d-ds").textContent = c.stats.BODY;
  $("d-hum").textContent = c.hum;
  $("d-move").textContent = c.stats.MOVE;

  renderSkillsTable(c);

  // Жизненный путь: значения + результат броска (1d10 / 1d6 — как в книге;
  // у пунктов «Друзья/Враги/Трагическая любовь» книга сначала бросает количество)
  $("lifepath").innerHTML = c.lifepath
    .map((lp) => `
      <div class="lp-row">
        <span class="lp-icon">${lp.icon}</span>
        <span>
          <small>${lp.label}:${lp.roll ? ` <b class="lp-roll">(1d${lp.dice || 10} = ${lp.roll})</b>` : ""}</small>
          <p>${lp.value}</p>
        </span>
      </div>`)
    .join("") + `<p class="small muted" style="margin-top:8px;">${c.note}</p>`;

  $("gear-list").innerHTML = c.gear.map((g) => `<li>${g}</li>`).join("");
  $("ch-cash").textContent = c.cash.toLocaleString("ru-RU") + " эдди";
}

// ------------------------------------------------------------
// Умения (навыки) персонажа — сетка карточек по группам навыков
// (Core Rulebook, стр. 82–85). Общие группировки сохранены:
// «Восприятие / Тело / Управление / Образование / Бой / Выступление /
// Стрельба / Социальные / Техника». Каждая группа — скруглённый
// прямоугольник-карточка; внутри — скруглённые квадратики умений
// (название | хар-ка | уровень | бонус ур.+хар-ка). Заголовок группы
// кликабельный — содержимое группы можно скрыть (состояние хранится
// в localStorage и применяется к любой перерисовке таблицы).
// ------------------------------------------------------------
const SKILL_MIN = 0, SKILL_MAX = 10;
const SG_LS_KEY = "cp-red-skill-groups-collapsed";

// множество свёрнутых групп навыков + сохранение состояния
let collapsedGroups = new Set();
try { collapsedGroups = new Set(JSON.parse(localStorage.getItem(SG_LS_KEY) || "[]")); } catch { /* пусто */ }
function saveCollapsedGroups() {
  try { localStorage.setItem(SG_LS_KEY, JSON.stringify([...collapsedGroups])); } catch { /* приватный режим */ }
}

// Одна карточка умения: название, тег характеристики, редактируемый уровень, сумма
function skillCardHtml(s, i, c) {
  const stat = skillStat(s.name);
  const statVal = c.stats[stat];
  const sum = (typeof statVal === "number" ? statVal : 0) + s.level;
  return `
    <div class="skill-chip${s.level === 0 ? " zero" : ""}" data-skill="${i}"
         title="${skillRu(s.name)} · ${STAT_RU[stat] || stat}">
      <span class="chip-name">${skillRu(s.name)}</span>
      <span class="chip-row">
        <span class="attr-tag" title="Характеристика проверки: ${STAT_RU[stat] || stat}">${stat}</span>
        <input type="number" class="lvl-input" min="${SKILL_MIN}" max="${SKILL_MAX}" step="1"
               value="${s.level}" aria-label="Уровень навыка: ${skillRu(s.name)}" />
        <span class="chip-sum" title="Уровень + характеристика">${sum}</span>
      </span>
    </div>`;
}

function renderSkillsTable(c) {
  const body = $("skills-body");
  // ВАЖНО: рисуем ВСЕ навыки из справочника data/skills.js (навыки роли —
  // с распределёнными уровнями, остальные — с уровнем 0). Индекс навыка
  // фиксируется ДО сортировки (через map((s, i) => ({ s, i }))), чтобы строки
  // не терялись и уровень правился у нужного навыка. Сортировка
  // «по убыванию уровня» — только визуальная (стабильная).
  const rows = c.skills.map((s, i) => ({ s, i })).sort((a, b) => b.s.level - a.s.level || a.i - b.i);
  // Группируем отсортированные строки по категориям навыков (общие группировки книги)
  const byGroup = new Map();
  for (const r of rows) {
    const g = SKILL_BY_NAME[r.s.name]?.group || "Прочее";
    if (!byGroup.has(g)) byGroup.set(g, []);
    byGroup.get(g).push(r);
  }
  // порядок групп — как в справочнике книги (GROUP_RU), неизвестные — в конце
  const groupOrder = Object.keys(GROUP_RU);
  const orderIdx = (g) => { const i = groupOrder.indexOf(g); return i === -1 ? 999 : i; };
  const ordered = [...byGroup.entries()].sort((a, b) => orderIdx(a[0]) - orderIdx(b[0]));

  body.innerHTML = ordered
    .map(([g, list]) => {
      const ru = GROUP_RU[g] || g;
      const isCollapsed = collapsedGroups.has(g);
      const top = list.filter(({ s }) => s.level > 0).slice(0, 3)
        .map(({ s }) => `${skillRu(s.name)} (${s.level})`).join(", ");
      return `
      <section class="skill-group-card${isCollapsed ? " collapsed" : ""}" data-group="${g}">
        <button type="button" class="skill-group-head" aria-expanded="${!isCollapsed}"
                title="Скрыть / показать содержимое группы «${ru}»">
          <span class="sg-title">${ru}</span>
          <span class="cnt">(${list.length})</span>
          <span class="sg-preview">${top}</span>
          <span class="collapse-arrow" aria-hidden="true">▾</span>
        </button>
        <div class="skill-grid">
          ${list.map(({ s, i }) => skillCardHtml(s, i, c)).join("")}
        </div>
      </section>`;
    })
    .join("");

  // заголовки групп: клик скрывает/показывает содержимое группы
  body.querySelectorAll(".skill-group-head").forEach((head) => {
    head.addEventListener("click", () => {
      const card = head.closest(".skill-group-card");
      const g = card.dataset.group;
      const nowCollapsed = !card.classList.contains("collapsed");
      card.classList.toggle("collapsed", nowCollapsed);
      head.setAttribute("aria-expanded", String(!nowCollapsed));
      if (nowCollapsed) collapsedGroups.add(g); else collapsedGroups.delete(g);
      saveCollapsedGroups();
      layoutSkillGroups(); // высота карточки изменилась — перелистываем колонки
    });
  });

  // при изменении уровня — обновляем данные персонажа и пересобираем таблицу
  body.querySelectorAll("input.lvl-input").forEach((inp) => {
    inp.addEventListener("change", () => {
      const idx = Number(inp.closest("[data-skill]").dataset.skill);
      let v = Math.round(Number(inp.value));
      if (!Number.isFinite(v)) v = SKILL_MIN;
      v = Math.max(SKILL_MIN, Math.min(SKILL_MAX, v));
      current.skills[idx].level = v;
      inp.value = v;
      renderSkillsTable(current);
    });
    // клик по полю ввода не должен «просвечивать» в заголовок группы
    inp.addEventListener("click", (e) => e.stopPropagation());
  });

  // пересчитываем masonry-раскладку после перерисовки групп
  layoutSkillGroups();
}

// ------------------------------------------------------------
// Masonry-раскладка карточек групп умений: сетка плавно занимает всё
// пространство без пустот («хвостов» внизу колонок) и без наездов.
//
// Единая модель координат (никаких колоночных CSS-потоков и span-эвристик):
//   * JS измеряет «честную» высоту каждой карточки в ширине колонки;
//   * распределяет карточки жадным masonry — каждая следующая кладётся в
//     самую короткую колонку (по сумме реальных высот + gap);
//   * выдаёт каждой карточке inline-координаты left/top и единую ширину
//     колонки (CSS-переменные --sg-x/--sg-y/--sg-w, карточки position:
//     absolute внутри .skill-groups);
//   * контейнер получает точную итоговую высоту min-height — страница не
//     «прыгает» при перерисовке;
//   * переезды анимируются FLIP-инверсией по transform (CSS-transition).
// Поскольку все позиции считаются из одной модели, карточки физически не
// могут пересечься, а жадное заполнение shortest-column не оставляет
// пустых «хвостов»: низ всех колонок выравнивается с точностью до одной
// карточки.
// ------------------------------------------------------------
const SG_MIN_COL_WIDTH = 300; // минимальная ширина колонки
let sgResizeObserver = null;

function skillGroupCards(body) {
  return [...body.children].filter((el) => el.classList && el.classList.contains("skill-group-card"));
}

// Честная высота карточки при заданной ширине колонки: временно выводим
// карточку из абсолютного позиционирования (position:static — она встанет в
// поток и не пересечётся с другими), фиксируем ширину колонки, убираем
// текущий transform (чтобы не замерять «на лету» анимированное положение)
// и измеряем элемент.
function sgHonestHeight(el, colWidth) {
  const prevStyle = el.getAttribute("style");
  el.style.cssText = `position: static; width: ${colWidth}px; margin-bottom: 0; transform: none; transition: none;`;
  void el.offsetHeight; // синхронный flush стиля перед измерением
  const h = el.getBoundingClientRect().height;
  if (prevStyle != null) el.setAttribute("style", prevStyle);
  else el.removeAttribute("style");
  return h;
}

// Порядок групп как в книге (ключи GROUP_RU) — используется в одноколоночной
// раскладке, где балансировка не нужна
function sgBookOrder(cards) {
  const order = Object.keys(GROUP_RU);
  const idx = (g) => { const i = order.indexOf(g); return i === -1 ? 999 : i; };
  return cards
    .map((c, i) => [c, i])
    .sort((a, b) => idx(a[0].dataset.group) - idx(b[0].dataset.group) || a[1] - b[1])
    .map(([c]) => c);
}

let sgPendingFrame = 0;

function applySkillGroupsLayout() {
  const body = $("skills-body");
  if (!body) return;
  const cards = skillGroupCards(body);
  if (!cards.length) return;

  const cs = getComputedStyle(body);
  const gap = parseFloat(cs.getPropertyValue("--sg-gap")) || 14;
  const width = body.clientWidth;
  if (!width) return;

  const cols = Math.max(1, Math.floor((width + gap) / (SG_MIN_COL_WIDTH + gap)));
  const colW = Math.floor((width - gap * (cols - 1)) / cols);
  body.style.setProperty("--sg-cols", String(cols)); // для отладки/внешних стилей

  // «First»: текущие визуальные позиции (для FLIP-инверсии). Если на
  // карточке ещё играет предыдущий переезд, берём её реальное положение из
  // кэса прошлой раскладки — иначе FLIP стартует «не оттуда, где глаз».
  const firstRect = new Map();
  for (const c of cards) {
    if (c.style.transform) {
      firstRect.set(c, c._sgLastRect || c.getBoundingClientRect());
    } else {
      firstRect.set(c, c.getBoundingClientRect());
    }
  }

  // честные высоты в ширине колонки
  const heights = new Map();
  for (const c of cards) heights.set(c, sgHonestHeight(c, colW));

  // одна колонка: порядок групп — как в книге
  const ordered = cols === 1 ? sgBookOrder(cards) : cards;

  // жадный masonry: каждая карточка — в самую короткую колонку
  const colH = new Array(cols).fill(0);
  const placed = []; // {card, x, y, h}
  for (const card of ordered) {
    let col = 0;
    for (let c = 1; c < cols; c++) if (colH[c] < colH[col]) col = c;
    const h = heights.get(card);
    placed.push({ card, x: col * (colW + gap), y: colH[col], h });
    colH[col] += h + gap;
  }

  // применяем координаты (единая модель: left/top/width из JS)
  body.classList.add("sg-ready"); // CSS-фallback «стопки» больше не нужен
  const baseTop = body.getBoundingClientRect().top;
  for (const p of placed) {
    p.card.style.setProperty("--sg-w", `${colW}px`);
    p.card.style.setProperty("--sg-x", `${p.x}px`);
    p.card.style.setProperty("--sg-y", `${p.y}px`);
    // кэс финальной геометрии (без учёта скролла) для следующего FLIP
    p.card._sgLastRect = new DOMRect(p.x, p.y + baseTop, colW, p.h);
  }
  body.style.minHeight = `${Math.max(...colH.map((h) => h - gap), 0)}px`;

  // FLIP «invert + play»: показываем карточки на СТАРЫХ местах и отпускаем
  // их через CSS-transition — плавный переезд без «телепорта».
  let moved = false;
  for (const p of placed) {
    const fr = firstRect.get(p.card);
    if (!fr) continue;
    const cur = p.card.getBoundingClientRect();
    const dx = Math.round(fr.left - cur.left);
    const dy = Math.round(fr.top - cur.top);
    if (Math.abs(dx) < 1 && Math.abs(dy) < 1) continue;
    moved = true;
    p.card.style.transition = "none";
    p.card.style.transform = `translate(${dx}px, ${dy}px)`;
  }
  if (moved) {
    void body.offsetHeight; // flush инвертированных позиций в этом же кадре
    requestAnimationFrame(() => {
      for (const p of placed) {
        if (!p.card.style.transform) continue;
        p.card.style.transition = "";
        p.card.style.transform = "";
      }
    });
  }
}

function layoutSkillGroups() {
  if (sgPendingFrame) cancelAnimationFrame(sgPendingFrame);
  sgPendingFrame = requestAnimationFrame(() => {
    sgPendingFrame = 0;
    applySkillGroupsLayout();
  });
}

// Инициализация один раз: наблюдатель за размерами контейнера и его карточек
function setupSkillGroupsMasonry() {
  const body = $("skills-body");
  if (!body) return;

  // наблюдатель за контейнером реагирует только на изменение ШИРИНЫ:
  // высота задаётся самой раскладкой (min-height), и реакция на неё
  // создала бы бесконечный цикл перерасчётов
  let sgLastW = -1;
  sgResizeObserver = new ResizeObserver((entries) => {
    const w = Math.round(entries[0].contentRect.width);
    if (w === sgLastW) return;
    sgLastW = w;
    layoutSkillGroups();
  });
  sgResizeObserver.observe(body);
  const mo = new MutationObserver((muts) => {
    for (const m of muts) {
      for (const n of m.addedNodes) {
        if (n.nodeType === 1 && n.classList && n.classList.contains("skill-group-card")) {
          sgResizeObserver.observe(n);
        }
      }
    }
    layoutSkillGroups();
  });
  mo.observe(body, { childList: true });
  skillGroupCards(body).forEach((c) => sgResizeObserver.observe(c));
  layoutSkillGroups();
}
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", setupSkillGroupsMasonry);
} else {
  setupSkillGroupsMasonry();
}

// ------------------------------------------------------------
// Панель «Полный пакет» (ручное распределение очков)
// ------------------------------------------------------------
let buyStats = {};

function openBuyPanel() {
  const roleData = ROLES.find((r) => r.role === $("role-select").value) || solo;
  const total = Number($("rank-select").value);
  buyStats = {};
  roleData.statsOrder.forEach((k) => (buyStats[k] = 2));
  // автораспределение остатка
  let left = total - roleData.statsOrder.length * 2;
  while (left > 0) {
    const k = pick(roleData.statsOrder);
    if (buyStats[k] < 8) { buyStats[k]++; left--; }
    else if (roleData.statsOrder.every((x) => buyStats[x] >= 8)) break;
  }
  renderBuyGrid(roleData, total);
  $("buy-box").classList.remove("hidden");
}

function renderBuyGrid(roleData, total) {
  const used = Object.values(buyStats).reduce((a, b) => a + b, 0);
  $("buy-grid").innerHTML = roleData.statsOrder
    .map((k) => `
      <div class="attr-cell">
        <span>${k} · ${STAT_RU[k]}</span>
        <select data-stat="${k}">
          ${Array.from({ length: 7 }, (_, i) => i + 2)
            .map((v) => `<option value="${v}" ${v === buyStats[k] ? "selected" : ""}>${v}</option>`)
            .join("")}
        </select>
      </div>`)
    .join("");
  $("buy-left").textContent = `Использовано: ${used} из ${total}. Осталось: ${total - used}`;
  $("buy-grid").querySelectorAll("select").forEach((sel) => {
    sel.addEventListener("change", () => {
      buyStats[sel.dataset.stat] = Number(sel.value);
      renderBuyGrid(roleData, Number($("rank-select").value));
    });
  });
}

// ------------------------------------------------------------
// Сохранение в localStorage
// ------------------------------------------------------------
const LS_KEY = "cp-red-characters";

function loadSaved() {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || "[]"); } catch { return []; }
}
function saveCharacter() {
  if (!current) return toast("Сначала создайте персонажа!");
  const list = loadSaved();
  list.unshift(current);
  localStorage.setItem(LS_KEY, JSON.stringify(list.slice(0, 20)));
  renderSaved();
  toast("Персонаж сохранён");
}
function renderSaved() {
  const list = loadSaved();
  const box = $("saved-list");
  if (!list.length) {
    box.innerHTML = '<p class="muted small">Пока пусто — создайте персонажа и нажмите «Сохранить».</p>';
    return;
  }
  box.innerHTML = list
    .map((c, i) => `
      <div class="saved-item">
        <span><b>${c.name} «${c.nick}»</b><small>${c.roleRu} · ${c.methodName}</small></span>
        <span class="saved-actions">
          <button class="btn tiny" data-load="${i}">Открыть</button>
          <button class="btn tiny danger" data-del="${i}">✕</button>
        </span>
      </div>`)
    .join("");
  box.querySelectorAll("[data-load]").forEach((b) =>
    b.addEventListener("click", () => { current = loadSaved()[Number(b.dataset.load)]; renderSheet(current); }));
  box.querySelectorAll("[data-del]").forEach((b) =>
    b.addEventListener("click", () => {
      const list = loadSaved();
      list.splice(Number(b.dataset.del), 1);
      localStorage.setItem(LS_KEY, JSON.stringify(list));
      renderSaved();
    }));
}

// ------------------------------------------------------------
// Экспорт / импорт персонажа (.xlsx / .pdf / .json)
// Работает полностью на стороне клиента; скачивание — Blob + <a download>,
// с запасными путями для старых браузеров (msSaveBlob, data-URL).
// ------------------------------------------------------------
function fileBaseName(c) {
  return ("cp-red-" + (c.name || "character") + "-" + (c.role || "")).replace(/[^\w\-]+/g, "_");
}

function doExport(fmt) {
  if (!current) return toast("Сначала создайте или откройте персонажа!");
  try {
    let blob, ext = fmt;
    if (fmt === "json") {
      blob = exportJSON(current);
    } else if (fmt === "xlsx") {
      blob = exportXLSX(buildSheetData(current, {
        STAT_RU,
        skillRu: { nameOf: skillRu, statOf: skillStat, statName: (s) => STAT_RU[s] || s }
      }));
    } else if (fmt === "pdf") {
      blob = exportPDF(current, { ROLE_RU, STAT_RU, SKILL_BY_NAME, GROUP_RU });
    }
    if (!blob) return toast("Неизвестный формат экспорта");
    downloadBlob(blob, `${fileBaseName(current)}.${ext}`);
    toast(`Экспорт в .${ext} выполнен`);
  } catch (e) {
    console.error(e);
    toast("Ошибка экспорта: " + (e?.message || e));
  }
}

function importFromJSONFile(file) {
  const finish = (c, msg) => {
    current = c;
    renderSheet(c);
    toast(msg);
  };
  // Путь 1: FileReader — поддерживается всеми современными браузерами
  if (typeof FileReader === "function") {
    const r = new FileReader();
    r.onload = () => {
      try { finish(parseImportedJSON(String(r.result)), `Персонаж «${current.name}» импортирован из JSON`); }
      catch (e) { toast("Ошибка импорта: " + e.message); }
    };
    r.onerror = () => toast("Не удалось прочитать файл");
    r.readAsText(file, "utf-8");
    return;
  }
  // Путь 2 (fallback для очень старых браузеров): input.value как data-URL
  try {
    const raw = String(file).split(",")[1];
    const text = (window.atob && typeof JSON !== "undefined")
      ? decodeURIComponent(escape(window.atob(raw)))
      : null;
    if (!text) throw new Error("Формат data-URL не распознан");
    finish(parseImportedJSON(text), `Персонаж «${current.name}» импортирован из JSON`);
  } catch (e) {
    toast("Ошибка импорта: " + e.message);
  }
}

// ------------------------------------------------------------
// Toast
// ------------------------------------------------------------
let toastTimer = null;
function toast(msg) {
  const t = $("toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 2600);
}

// ------------------------------------------------------------
// Инициализация
// ------------------------------------------------------------
function init() {
  // Защита: если скрипт выполнился до готовности DOM, ждём DOMContentLoaded
  if (!document.body || !$("role-select")) {
    document.addEventListener("DOMContentLoaded", init);
    return;
  }

  // Выпадающий список «Стиль» (панель «Данные персонажа»)
  const styleSel = $("sel-style");
  if (styleSel) {
    styleSel.innerHTML =
      `<option value="">— случайно —</option>` +
      STYLES.map((s) => `<option value="${s}">${s}</option>`).join("");
  }

  const sel = $("role-select");
  // Наполняем dropdown ролями; дополнительно добавляем option'ы разметкой
  // (fallback на случай, если JS не выполнится — тогда роли всё равно будут видны)
  ROLES.forEach((r) => {
    const label = `${ROLE_RU[r.role] || r.role} (${r.role})`;
    let opt = sel.querySelector(`option[value="${r.role}"]`);
    if (!opt) {
      opt = document.createElement("option");
      opt.value = r.role;
      sel.appendChild(opt);
    }
    opt.textContent = label;
  });
  sel.addEventListener("change", () => {
    const r = ROLES.find((x) => x.role === sel.value) || ROLES[0];
    if (!ROLES.some((x) => x.role === sel.value)) sel.value = r.role;
    $("role-info").innerHTML =
      `<p><b>Роль:</b> ${ROLE_RU[r.role]}</p>
       <p><b>Навыки роли (${r.skills.length}):</b> ${r.skills.map(skillRu).join(", ")}</p>
       <p class="muted">Таблица шаблонов: 10 строк × 10 характеристик (Core Rulebook, стр. 74–77).</p>`;
    if (!$("buy-box").classList.contains("hidden")) openBuyPanel();
    // при смене роли до создания персонажа сбрасываем черновик пути —
    // «Путь роли» зависит от таблицы выбранной роли
    if (!current) { lpManualPicks = {}; if (lpEditorOpen) renderLpEditor(); }
  });
  $("role-info").textContent = "Выберите роль — таблицы характеристик взяты из Core Rulebook (стр. 74–77).";

  // Три кнопки — три способа создания
  $("btn-method-1").addEventListener("click", () => createCharacter(1));
  $("btn-method-2").addEventListener("click", () => createCharacter(2));
  $("btn-method-3").addEventListener("click", () => {
    openBuyPanel();
    createCharacter(3); // стартовый автоматический вариант, затем можно подправить вручную
  });

  $("rank-select").addEventListener("change", openBuyPanel);
  $("btn-buy-auto").addEventListener("click", () => { openBuyPanel(); toast("Очки распределены автоматически"); });
  $("btn-buy-apply").addEventListener("click", () => {
    const total = Number($("rank-select").value);
    const used = Object.values(buyStats).reduce((a, b) => a + b, 0);
    if (used !== total) return toast(`Используйте ровно ${total} очков (сейчас ${used})`);
    if (!current) return toast("Сначала создайте персонажа способом №3");
    current.stats = { ...buyStats };
    current.baseNote = `«Полный пакет»: очки распределены вручную (${total} очков)`;
    current.statEdits = 0;
    current.hp = calcHP(buyStats.BODY, buyStats.WILL);
    current.hum = buyStats.EMP * 10;
    current.note = current.baseNote;
    renderSheet(current); // пересобираем лист, включая сумму «уровень + характеристика» у навыков
    toast("Характеристики обновлены");
  });

  $("btn-save").addEventListener("click", saveCharacter);
  $("btn-print").addEventListener("click", () => window.print());

  // Экспорт в .xlsx / .pdf / .json
  $("btn-export-xlsx")?.addEventListener("click", () => doExport("xlsx"));
  $("btn-export-pdf")?.addEventListener("click", () => doExport("pdf"));
  $("btn-export-json")?.addEventListener("click", () => doExport("json"));

  // Импорт из .json (работает и как drag&drop файла на страницу)
  const fileInput = $("inp-import-file");
  $("btn-import-json")?.addEventListener("click", () => {
    if (!fileInput) return;
    fileInput.value = "";
    fileInput.click();
  });
  fileInput?.addEventListener("change", () => {
    const f = fileInput.files && fileInput.files[0];
    if (f) importFromJSONFile(f);
  });
  document.addEventListener("dragover", (e) => e.preventDefault());
  document.addEventListener("drop", (e) => {
    e.preventDefault();
    const f = e.dataTransfer?.files?.[0];
    if (f && (/\.json$/i.test(f.name) || f.type === "application/json")) importFromJSONFile(f);
  });

  renderSaved();
  sel.dispatchEvent(new Event("change"));

  // Жизненный путь: сгенерировать случайно / выбрать вручную
  $("btn-lp-roll")?.addEventListener("click", generateLifepath);
  $("btn-lp-pick")?.addEventListener("click", () => toggleLpEditor());

  // Ролевая способность: клик по заголовку скрывает/показывает описание
  // (состояние запоминается в localStorage — см. renderRoleAbility)
  $("role-ability-toggle")?.addEventListener("click", () => {
    const box = $("role-ability"), textEl = $("ra-text");
    if (!box || !textEl || box.classList.contains("hidden")) return;
    const collapsed = !textEl.classList.contains("collapsed");
    textEl.classList.toggle("collapsed", collapsed);
    box.classList.toggle("is-collapsed", collapsed);
    $("role-ability-toggle").setAttribute("aria-expanded", String(!collapsed));
    try { localStorage.setItem(RA_LS_KEY, collapsed ? "1" : "0"); } catch { /* приватный режим */ }
  });
}

// Если DOM уже готов — запускаем сразу; иначе ждём DOMContentLoaded
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
