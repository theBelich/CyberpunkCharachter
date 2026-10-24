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
// Каталог киберимплантов (данные PDF-таблиц) — используется для распознавания
// имплантов в инвентаре (список «Импланты») и для магазина.
import { CYBERWARE } from "../src/shops/cyberware.js";
// Каталог оружия и брони (Core Rulebook, стр. 340–350) — источник данных
// для выбора активного оружия / активной брони и справочных SP и урона.
import { WEAPONS } from "../src/shops/weapons.js";

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

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

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
    empMax: gen.stats.EMP,
    skills: buildFullSkillList(rollSkills(roleData)),
    // Жизненный путь: ручной выбор (если заполнен) или случайная генерация
    lifepath: buildLifepathOnCreate(roleData.role),
    gear: GEAR_BY_ROLE[roleData.role] || GEAR_BY_ROLE.default,
    cash: 100 + Math.floor(Math.random() * 900) * 5,
    // Заметки игрока: черновик из поля справа (или сохранённые по ключу персонажа)
    notes: (() => {
      const ta = $("inp-notes");
      return (ta && ta.value.trim()) ? ta.value : notesGet(`${NOTES_LS_KEY}:${(id.name || "").trim().toLowerCase()}:${roleData.role}`);
    })()
  };
  current = c;
  loadNotes();   // показать в поле заметки нового персонажа
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
    <h3 class="lp-editor-title">Жизненный путь · роль «${escapeHtml(roleRu)}» ${current ? "" : "(предпросмотр до создания)"}
      <span class="small muted">по книге: «Roll 1d10 or choose one» — бросай кубик или выбирай сам</span></h3>
    <div class="lp-steps">
      ${LIFEPATH_FIELDS.map((f, i) => {
        const options = lifepathOptionsFor(f.key, roleName);
        const cur = items.find((x) => x.key === f.key);
        const curVal = cur ? cur.value : "";
        const inList = options.includes(curVal);
        const dice = lifepathDice(f, roleName);
        const diceLbl = f.count ? `кол-во: 1d10−7 (мин. 0), затем [1d${dice}]` : `1d${dice}`;
        const safeCurVal = escapeHtml(curVal || "");
        return `
          <div class="lp-step" data-lp="${i}">
            <div class="lp-step-label">${f.icon} ${escapeHtml(f.label)} <span class="dice-tag">[${escapeHtml(diceLbl)}]</span>${cur && cur.roll ? ` <span class="roll">(выпало ${cur.roll})</span>` : ""}</div>
            <select class="lp-pick" data-key="${f.key}" aria-label="Выбор: ${escapeHtml(f.label)}">
              <option value="" ${!curVal ? "selected" : ""}>— выбрать —</option>
              ${!inList && curVal ? `<option value="${safeCurVal}" selected>${safeCurVal} (своё)</option>` : ""}
              ${options.map((o) =>
                `<option value="${escapeHtml(o)}" ${o === curVal ? "selected" : ""}>${escapeHtml(o)}</option>`).join("")}
            </select>
            <button type="button" class="btn tiny lp-reroll" data-key="${f.key}"
                    title="Перебросить этот пункт (${escapeHtml(diceLbl)})">🎲 Бросить</button>
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
  if (key === "EMP") {
    current.empMax = clamped;
    current.hum = clamped * 10;
  }
  current.stats.EMP = Math.floor(current.hum / 10);

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
  if (!Number.isFinite(c.empMax)) {
    c.empMax = Math.max(Number(c.stats.EMP) || 0, Math.ceil((Number(c.hum) || 0) / 10));
  }
  const empMax = c.empMax;
  const humanityMax = empMax * 10;
  c.hum = Math.max(0, Math.min(Number(c.hum) || 0, humanityMax));
  c.stats.EMP = Math.floor(c.hum / 10);

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
  const currentEmp = Math.floor(c.hum / 10);
  $("d-hum").textContent = `${c.hum} / ${humanityMax}`;
  $("d-emp").textContent = `${currentEmp} / ${empMax}`;
  $("d-move").textContent = c.stats.MOVE;

  renderSkillsTable(c);

  // Жизненный путь: значения + результат броска (1d10 / 1d6 — как в книге;
  // у пунктов «Друзья/Враги/Трагическая любовь» книга сначала бросает количество)
  $("lifepath").innerHTML = c.lifepath
    .map((lp) => `
      <div class="lp-row">
        <span class="lp-icon">${escapeHtml(lp.icon || "")}</span>
        <span>
          <small>${escapeHtml(lp.label || "")}:${lp.roll ? ` <b class="lp-roll">(1d${lp.dice || 10} = ${lp.roll})</b>` : ""}</small>
          <p>${escapeHtml(lp.value || "")}</p>
        </span>
      </div>`)
    .join("") + `<p class="small muted" style="margin-top:8px;">${escapeHtml(c.note || "")}</p>`;

  // Инвентарь: строки могут быть текстом (снаряжение роли / старые сохранения)
  // или объектом { name, cost, implant? } — предметы, купленные в магазине.
  // Киберимпланты (флаг implant:true, ставится при покупке в магазине
  // «Киберимпланты») выделены в отдельный список под названием «Импланты».
  const gearItemHtml = (g, index) => {
    const isObj = g && typeof g === "object";
    const label = isObj ? g.name : g;
    const safeLabel = escapeHtml(label ?? "");
    const kind = classifyGearItem(g, c);
    const stats = kind ? baseStatsFor(kind, label) : {};
    const damage = kind === "weapon" ? (isObj ? g.damage : "") || stats.damage || "" : "";
    const sp = kind === "armor" ? (isObj && g.sp != null ? g.sp : stats.sp) : "";
    const cost = isObj && Number.isFinite(Number(g.cost)) ? Number(g.cost) : "";
    const activeKey = kind === "armor" ? c.activeArmor : c.activeWeapon;
    const isActive = !!kind && ((isObj && g.active) || activeKey === label);
    // пометка активного предмета (только одно оружие и одна броня могут быть активны)
    const activeTag = isObj && g.active
      ? ` <b class="gear-active-tag">${g.weapon ? "⚔️ активно" : g.armor ? "🛡️ активна" : "★ активно"}</b>` : "";
    return `<li class="gear-row">
      <span class="gear-item-name">${safeLabel}${activeTag}</span>
      <span class="gear-damage" aria-label="Урон, количество кубов">${damage ? escapeHtml(damage) : "—"}</span>
      <span class="gear-sp" aria-label="SP брони">${sp !== "" && sp != null ? escapeHtml(sp) : "—"}</span>
      <span class="gear-cost" aria-label="Цена">${cost !== "" ? `${cost.toLocaleString("ru-RU")} eb` : "—"}</span>
      <span class="gear-actions">
        ${kind ? `<button class="btn tiny ghost gear-equip-btn" type="button" data-gear-index="${index}" data-gear-kind="${kind}" title="${kind === "armor" ? "Назначить активной бронёй" : "Назначить активным оружием"}" ${isActive ? "disabled" : ""}>${isActive ? "Активно" : "Назначить"}</button>` : ""}
        <button class="btn tiny ghost gear-edit-btn" type="button" data-gear-index="${index}" aria-label="Редактировать ${safeLabel}">✎</button>
      </span>
      <form class="gear-edit-form" data-gear-index="${index}" hidden>
        <label>Название<input name="name" type="text" maxlength="100" required value="${escapeHtml(label ?? "")}"></label>
        <label>Цена, eb<input name="cost" type="number" min="0" step="1" value="${cost}"></label>
        ${kind === "weapon" ? `<label>Урон (кубы)<input name="damage" type="text" maxlength="24" placeholder="например, 2d6" value="${escapeHtml(damage)}"></label>` : ""}
        ${kind === "armor" ? `<label>SP брони<input name="sp" type="number" min="0" step="0.1" value="${sp ?? ""}"></label>` : ""}
        <div class="gear-edit-actions">
          <button class="btn tiny primary" type="submit">Сохранить</button>
          <button class="btn tiny ghost gear-edit-cancel" type="button">Отмена</button>
        </div>
      </form>
    </li>`;
  };
  const implants = c.gear.filter(isImplantGear);
  const otherGear = c.gear.map((g, index) => ({ g, index })).filter(({ g }) => !isImplantGear(g));
  $("gear-list").innerHTML = otherGear.length
    ? otherGear.map(({ g, index }) => gearItemHtml(g, index)).join("")
    : `<li class="muted">${implants.length ? "Нет обычного снаряжения." : "Нет данных — персонаж ещё не создан."}</li>`;
  $("implants-count").textContent = `(${implants.length})`;
  $("implants-list").innerHTML = c.gear.map((g, index) => ({ g, index }))
    .filter(({ g }) => isImplantGear(g))
    .map(({ g, index }) => gearItemHtml(g, index)).join("");
  $("implants-empty").hidden = implants.length > 0;
  renderLoadout(c); // активное оружие / активная броня (панель «Экипировка»)
  $("ch-cash").value = c.cash;
  $("ch-cash").disabled = false;
  $("inp-gear-name").disabled = false;
  $("inp-gear-cost").disabled = false;
  $("manual-gear-form").querySelector("button[type='submit']").disabled = false;
}

function addManualGear() {
  if (!current) { toast("Сначала создайте персонажа!"); return; }
  const nameInput = $("inp-gear-name");
  const costInput = $("inp-gear-cost");
  const name = nameInput.value.trim();
  if (!name) { toast("Введите название снаряжения."); nameInput.focus(); return; }

  const costText = costInput.value.trim();
  const cost = costText === "" ? null : Number(costText);
  if (cost !== null && (!Number.isInteger(cost) || cost < 0)) {
    toast("Цена должна быть неотрицательным целым числом.");
    costInput.focus();
    return;
  }

  if (!Array.isArray(current.gear)) current.gear = [];
  const item = { name, custom: true };
  if (cost !== null) item.cost = Math.round(cost);
  current.gear.push(item);
  renderSheet(current);
  saveDraft();
  nameInput.value = "";
  costInput.value = "";
  nameInput.focus();
  toast("Снаряжение добавлено.");
}

function initGearEditing() {
  ["gear-list", "implants-list"].forEach((id) => {
    const list = $(id);
    if (!list) return;
    list.addEventListener("click", (event) => {
      const equipButton = event.target.closest(".gear-equip-btn");
      if (equipButton && current) {
        setActiveFromInventory(equipButton.dataset.gearKind, Number(equipButton.dataset.gearIndex));
        return;
      }
      const editButton = event.target.closest(".gear-edit-btn");
      if (editButton) {
        const row = editButton.closest(".gear-row");
        const form = row?.querySelector(".gear-edit-form");
        if (!form) return;
        row.classList.add("is-editing");
        form.hidden = false;
        form.querySelector('[name="name"]')?.focus();
        return;
      }
      if (event.target.closest(".gear-edit-cancel")) {
        const form = event.target.closest(".gear-edit-form");
        form.hidden = true;
        form.closest(".gear-row")?.classList.remove("is-editing");
      }
    });
    list.addEventListener("submit", (event) => {
      const form = event.target.closest(".gear-edit-form");
      if (!form) return;
      event.preventDefault();
      if (!current || !form.reportValidity()) return;
      const index = Number(form.dataset.gearIndex);
      const oldItem = current.gear[index];
      if (!oldItem) return;
      const oldName = typeof oldItem === "object" ? oldItem.name : oldItem;
      const kind = classifyGearItem(oldItem, current);
      const name = form.querySelector('[name="name"]').value.trim();
      const costValue = form.querySelector('[name="cost"]').value.trim();
      const cost = costValue === "" ? null : Number(costValue);
      if (!name) {
        toast("Введите название предмета.");
        return;
      }
      if (cost !== null && (!Number.isInteger(cost) || cost < 0)) {
        toast("Цена должна быть неотрицательным целым числом.");
        return;
      }

      const item = typeof oldItem === "object" ? { ...oldItem } : { name: oldName };
      item.name = name;
      if (cost === null) delete item.cost;
      else item.cost = cost;
      if (kind === "weapon") {
        item.weapon = true;
        const damage = form.querySelector('[name="damage"]')?.value.trim();
        if (damage) item.damage = damage;
        else delete item.damage;
      } else if (kind === "armor") {
        item.armor = true;
        const spValue = form.querySelector('[name="sp"]')?.value.trim();
        if (spValue === "") delete item.sp;
        else {
          const sp = Number(spValue);
          if (!Number.isFinite(sp) || sp < 0) {
            toast("SP брони должно быть неотрицательным числом.");
            return;
          }
          item.sp = sp;
        }
      }
      current.gear[index] = item;
      if (current.activeWeapon === oldName) current.activeWeapon = name;
      if (current.activeArmor === oldName) current.activeArmor = name;
      renderSheet(current);
      saveDraft();
      toast("Предмет обновлён.");
    });
  });
}

// -------------------------------------------------------------
// Импланты — отдельный список на листе персонажа (под инвентарём).
// Попадает туда любой предмет, купленный в магазине киберимплантов:
// при покупке в запись инвентаря добавляется флаг implant:true.
// -------------------------------------------------------------
const IMPLANT_KEYWORDS = [
  "оптика", "аудитор", "усилитель голоса", "фильтр", "датчик", "термальн",
  "анти-вспышк", "детектор", "телефон", "рекордер", "видео", "нейровар",
  "сокет", "браунер", "чипвар", "тракер", "гидра-г", "скальпель", "кулаки",
  "бронированн", "кости", "мышц", "сухожили", "легки", "печень", "желудок",
  "кожа", "кровь", "стайлер", "хром", "шипы", "пластины", "биомонитор",
  "химскин", "эм-ти", "эмп-нит", "нарни", "уровни", "глаза", "руки",
];
// базовое снаряжение ролей (строки GEAR_BY_ROLE) не должно ошибочно попасть
// в список имплантов по ключевым словам — оно явно перечислено здесь
const BASE_GEAR_TEXTS = new Set(Object.values(GEAR_BY_ROLE).flat());

function isImplantGear(g) {
  if (!g || typeof g !== "object") return false;   // обычные строки — не импланты
  if (g.implant) return true;                      // куплено в магазине киберимплантов
  // fallback для сохранений, сделанных до появления флага: название из
  // каталога CYBERWARE («Русское (English Name)») или известный ключевой термин
  const nm = String(g.name || "").toLowerCase();
  const en = (nm.match(/\(([^)]+)\)/) || [])[1] || nm;
  const inCatalog = CYBERWARE.groups.some((gr) => gr.items.some((it) => it.name.toLowerCase() === en.trim()));
  if (inCatalog) return true;
  return !BASE_GEAR_TEXTS.has(g.name) && IMPLANT_KEYWORDS.some((k) => nm.includes(k));
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
    <div class="skill-chip${s.level === 0 ? " zero" : ""}" data-skill="${escapeHtml(s.name)}"
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
      layoutSkillGroups(true); // высота карточки изменилась — перелистываем колонки
    });
  });

  // при изменении уровня — обновляем данные персонажа и пересобираем таблицу
  body.querySelectorAll("input.lvl-input").forEach((inp) => {
    inp.addEventListener("change", () => {
      const skillName = inp.closest("[data-skill]")?.dataset.skill;
      const skill = current.skills.find((s) => s.name === skillName);
      if (!skill) return;
      let v = Math.round(Number(inp.value));
      if (!Number.isFinite(v)) v = SKILL_MIN;
      v = Math.max(SKILL_MIN, Math.min(SKILL_MAX, v));
      skill.level = v;
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
const SG_MIN_COL_WIDTH = 260; // минимальная ширина колонки
let sgResizeObserver = null;
let sgMeasureEl = null;   // скрытый клон-измеритель (вне потока — не влияет на размеры страницы)
let sgMeasureKey = "";    // «отпечаток» последней измерённой конфигурации
let sgLastLayoutKey = "";// «отпечаток» последней ПРИМЕНЁННОЙ раскладки (защита от циклов)

function skillGroupCards(body) {
  return [...body.children].filter((el) => el.classList && el.classList.contains("skill-group-card"));
}

// «Отпечаток» состояния листа для раскладчика: ширина контейнера + порядок
// групп + свёрнутые группы + уровни всех умений. Если отпечаток не изменился
// — раскладка уже корректна, повторять её (и тем более гонять ResizeObserver
// по кругу) незачем. Это главная защита от «бесконечного изменения размера
// страницы»: перерасчёт порождает изменение min-height только когда реально
// изменились данные или ширина.
function sgStateKey(width) {
  const body = $("skills-body");
  let s = "w" + Math.round(width);
  for (const c of skillGroupCards(body)) {
    s += "|" + c.dataset.group + (c.classList.contains("collapsed") ? "C" : "");
    s += ":" + [...c.querySelectorAll(".lvl-input")].map((i) => i.value).join(",");
  }
  return s;
}

// Честная высота карточки при заданной ширине колонки. ВАЖНО: измеряем не саму
// карточку (её временный перевод в position:static растягивал бы документ и
// вызывал новые resize-события — круг «измерил → страница выросла → снова
// измерил»), а её точный клон в скрытом контейнере фиксированной ширины. Клон
// лежит вне потока (position:fixed, visibility:hidden, height:0) — на размеры
// страницы не влияет вообще.
function sgHonestHeight(el, colWidth) {
  if (!sgMeasureEl) {
    sgMeasureEl = document.createElement("div");
    sgMeasureEl.className = "skill-groups sg-measure";
    sgMeasureEl.setAttribute("aria-hidden", "true");
    document.body.appendChild(sgMeasureEl);
  }
  const key = el.dataset.group + "@" + colWidth + (el.classList.contains("collapsed") ? "C" : "");
  let clone;
  if (sgMeasureKey !== key) {
    sgMeasureEl.style.width = colWidth + "px";
    sgMeasureEl.innerHTML = "";
    clone = el.cloneNode(true);
    clone.removeAttribute("style");
    clone.classList.add("sg-clone");
    sgMeasureEl.appendChild(clone);
    sgMeasureKey = key;
  } else {
    clone = sgMeasureEl.firstChild;
  }
  return clone.getBoundingClientRect().height;
}

let sgPendingFrame = 0;

function applySkillGroupsLayout(force) {
  const body = $("skills-body");
  if (!body) return;
  const cards = skillGroupCards(body);
  if (!cards.length) return;

  const cs = getComputedStyle(body);
  const gap = parseFloat(cs.getPropertyValue("--sg-gap")) || 14;
  const width = body.clientWidth;
  if (!width) return;

  // Защита от «бесконечного изменения размера страницы»: если состояние
  // листа (ширина/порядок групп/свёрнутые/уровни) не менялось с момента
  // последней применённой раскладки — ничего не пересчитываем. Это гасит
  // любые петли ResizeObserver ↔ MutationObserver ↔ min-height.
  const key = sgStateKey(width);
  if (!force && key === sgLastLayoutKey) return;
  sgLastLayoutKey = key;

  const cols = Math.max(1, Math.floor((width + gap) / (SG_MIN_COL_WIDTH + gap)));
  const colW = Math.floor((width - gap * (cols - 1)) / cols);
  body.style.setProperty("--sg-cols", String(cols)); // для отладки/внешних стилей

  // честные высоты в ширине колонки (клон-измеритель вне потока)
  const heights = new Map();
  for (const c of cards) heights.set(c, sgHonestHeight(c, colW));

  // жадный masonry: каждая карточка — в самую короткую колонку.
  // Порядок расстановки — от самой ВЫСОКОЙ карточки к самой низкой (LPT):
  // так «хвост» из пустоты внизу колонок сокращается до высоты одной
  // последней карточки, а не разницы между первой и последней по книге.
  const byHeight = [...cards].sort((a, b) => heights.get(b) - heights.get(a));
  const colH = new Array(cols).fill(0);
  const placed = []; // {card, x, y, h}
  for (const card of byHeight) {
    let col = 0;
    for (let c = 1; c < cols; c++) if (colH[c] < colH[col]) col = c;
    const h = heights.get(card);
    placed.push({ card, x: col * (colW + gap), y: colH[col], h });
    colH[col] += h + gap;
  }

  // применяем координаты (единая модель: left/top/width из JS). Никаких
  // transform-анимаций и временных изменений потока: единственный источник
  // геометрии — CSS-переменные карточек, поэтому layout идемпотентен и не
  // порождает resize-шторм (именно он «бесконечно менял размер страницы»
  // при открытии файла напрямую, без сервера).
  body.classList.add("sg-ready"); // CSS-фallback «стопки» больше не нужен
  for (const p of placed) {
    p.card.style.setProperty("--sg-w", `${colW}px`);
    p.card.style.setProperty("--sg-x", `${p.x}px`);
    p.card.style.setProperty("--sg-y", `${p.y}px`);
  }
  const totalH = Math.max(...colH.map((h) => h - gap), 0);
  // min-height ставим ТОЛЬКО когда значение реально изменилось > чем на 1px —
  // каждое лишнее присваивание снова будит ResizeObserver по высоте
  const curMin = parseFloat(body.style.minHeight) || 0;
  if (Math.abs(curMin - totalH) > 1) body.style.minHeight = `${totalH}px`;
}

function layoutSkillGroups(force) {
  if (sgPendingFrame) cancelAnimationFrame(sgPendingFrame);
  sgPendingFrame = requestAnimationFrame(() => {
    sgPendingFrame = 0;
    applySkillGroupsLayout(force);
  });
}

// Инициализация один раз: наблюдатель за шириной контейнера навыков.
// Наблюдаем ТОЛЬКО ширину (height игнорируем): высота задаётся самой
// раскладкой, и реакция на неё создала бы бесконечный цикл перерасчётов.
function setupSkillGroupsMasonry() {
  const body = $("skills-body");
  if (!body) return;

  let sgLastW = -1;
  sgResizeObserver = new ResizeObserver((entries) => {
    let w = -1;
    for (const e of entries) {
      if (e.target === body) { w = Math.round(e.contentRect.width); break; }
    }
    if (w < 0) return;             // событие от карточки — игнорируем
    if (w === sgLastW) return;     // ширина не менялась — ничего не делаем
    sgLastW = w;
    layoutSkillGroups();
  });
  sgResizeObserver.observe(body);

  // перерисовка листа (смена роли/импорта) добавляет новые карточки —
  // раскладываем заново принудительно
  const mo = new MutationObserver(() => layoutSkillGroups(true));
  mo.observe(body, { childList: true });

  layoutSkillGroups(true);
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
// Быстрое сохранение текущего персонажа в localStorage без дублей
// (используется после покупок, экипировки и правок — изменения не теряются)
function saveDraft() {
  if (!current) return;
  try {
    const list = loadSaved().filter((c) => !(c && c.name === current.name && c.role === current.role));
    list.unshift(current);
    localStorage.setItem(LS_KEY, JSON.stringify(list.slice(0, 20)));
  } catch { /* приватный режим */ }
}

function saveCharacter() {
  if (!current) return toast("Сначала создайте персонажа!");
  // Актуализируем заметки из поля перед сохранением
  const ta = $("inp-notes");
  if (ta) current.notes = ta.value;
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
        <span><b>${escapeHtml(c.name || "")} «${escapeHtml(c.nick || "")}»</b><small>${escapeHtml(c.roleRu || "")} · ${escapeHtml(c.methodName || "")}</small></span>
        <span class="saved-actions">
          <button class="btn tiny" data-load="${i}">Открыть</button>
          <button class="btn tiny danger" data-del="${i}">✕</button>
        </span>
      </div>`)
    .join("");
  box.querySelectorAll("[data-load]").forEach((b) =>
    b.addEventListener("click", () => {
      current = loadSaved()[Number(b.dataset.load)];
      renderSheet(current);
      loadNotes();   // заметки открытого персонажа — в поле справа
    }));
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
    // заметки всегда актуальны на момент экспорта
    const taN = $("inp-notes");
    if (taN) current.notes = taN.value;
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
// ЗАМЕТКИ ИГРОКА — правая колонка (aside.notes-col)
// Хранятся в localStorage: отдельно по каждому персонажу
// (ключ cp-red-notes:<имя>:<роль>) и как общий «черновик»
// (cp-red-notes:draft), чтобы записи не терялись между листами.
// При сохранении/экспорте персонажа текст попадает в c.notes.
// ------------------------------------------------------------
const NOTES_LS_KEY = "cp-red-notes";
let notesSaveTimer = null;

function notesDraftKey() { return `${NOTES_LS_KEY}:draft`; }
function notesCharKey(c) {
  if (!c) return notesDraftKey();
  return `${NOTES_LS_KEY}:${(c.name || "").trim().toLowerCase()}:${c.role || ""}`;
}
function notesGet(key) { try { return localStorage.getItem(key) || ""; } catch { return ""; } }
function notesSet(key, val) { try { localStorage.setItem(key, val); } catch { /* приватный режим */ } }

function updateNotesStatus() {
  const el = $("notes-status");
  if (!el) return;
  const ta = $("inp-notes");
  const text = ta ? ta.value : "";
  const words = (text.trim().match(/\S+/g) || []).length;
  el.textContent = text.trim()
    ? `${words} слов · ${text.length} симв.`
    : "Пусто";
}

// Загрузить заметки в поле: сначала для текущего персонажа,
// если у него их нет — общий черновик
function loadNotes() {
  const ta = $("inp-notes");
  if (!ta) return;
  let text = current ? (current.notes || notesGet(notesCharKey(current))) : "";
  if (!text && current) text = notesGet(notesCharKey(current));
  if (!text) text = notesGet(notesDraftKey());
  ta.value = text || "";
  updateNotesStatus();
}

// Автосохранение с небольшой задержкой (debounce 400 мс)
function saveNotesSoon() {
  const ta = $("inp-notes");
  if (!ta) return;
  const text = ta.value;
  if (current) current.notes = text;         // прикреплена к персонажу в памяти
  clearTimeout(notesSaveTimer);
  notesSaveTimer = setTimeout(() => {
    notesSet(notesDraftKey(), text);          // общий черновик
    if (current && text) notesSet(notesCharKey(current), text);
    updateNotesStatus();
  }, 400);
}

function initNotes() {
  const ta = $("inp-notes");
  if (!ta) return;
  loadNotes();
  ta.addEventListener("input", saveNotesSoon);
  $("btn-notes-clear")?.addEventListener("click", () => {
    if (ta.value.trim() && !confirm("Очистить все заметки?")) return;
    ta.value = "";
    if (current) current.notes = "";
    notesSet(notesDraftKey(), "");
    if (current) notesSet(notesCharKey(current), "");
    updateNotesStatus();
    toast("Заметки очищены");
  });
  $("btn-toggle-notes")?.addEventListener("click", () => setNotesOpen(true));
  $("btn-close-notes")?.addEventListener("click", () => setNotesOpen(false));
  $("notes-col")?.querySelector(".notes-backdrop")?.addEventListener("click", () => setNotesOpen(false));
  syncNotesVisibility();
  window.addEventListener("resize", syncNotesVisibility);
}

function setNotesOpen(open) {
  const mobile = window.matchMedia("(max-width: 900px)").matches;
  document.body.classList.toggle("notes-open", mobile && open);
  syncNotesVisibility();
  if (mobile && open) $("inp-notes")?.focus();
  else if (mobile) $("btn-toggle-notes")?.focus();
}

function syncNotesVisibility() {
  const mobile = window.matchMedia("(max-width: 900px)").matches;
  if (!mobile) document.body.classList.remove("notes-open");
  const open = mobile && document.body.classList.contains("notes-open");
  $("btn-toggle-notes")?.setAttribute("aria-expanded", String(open));
  $("notes-col")?.setAttribute("aria-hidden", String(mobile && !open));
}

function initSheetTabs() {
  const tabs = [...document.querySelectorAll(".sheet-tab")];
  const activate = (tab, focus = false) => {
    const selected = tab.dataset.tab;
    tabs.forEach((item) => {
      const active = item === tab;
      item.classList.toggle("active", active);
      item.setAttribute("aria-selected", String(active));
      item.tabIndex = active ? 0 : -1;
    });
    document.querySelectorAll(".tab-content").forEach((panel) => {
      const active = panel.id === `panel-${selected}`;
      panel.hidden = !active;
      panel.classList.toggle("hidden", !active);
    });
    if (focus) tab.focus();
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => activate(tab));
    tab.addEventListener("keydown", (event) => {
      let nextIndex = index;
      if (event.key === "ArrowRight") nextIndex = (index + 1) % tabs.length;
      else if (event.key === "ArrowLeft") nextIndex = (index - 1 + tabs.length) % tabs.length;
      else if (event.key === "Home") nextIndex = 0;
      else if (event.key === "End") nextIndex = tabs.length - 1;
      else return;
      event.preventDefault();
      activate(tabs[nextIndex], true);
    });
  });
}

function initHeaderMenu() {
  const menu = $("head-more");
  if (!menu) return;
  menu.open = false;

  menu.querySelector(".head-more-menu")?.addEventListener("click", (event) => {
    if (event.target.closest("button")) menu.open = false;
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menu.open) {
      menu.open = false;
      menu.querySelector("summary")?.focus();
    }
  });
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
// Панель генерации персонажа: скрытие / показ кнопкой «Генерация».
// Состояние запоминается в localStorage, есть горячая клавиша Ctrl+B.
// ------------------------------------------------------------
const CONTROLS_LS_KEY = "cp-red-controls-hidden";

function controlsGetHidden() {
  try { return localStorage.getItem(CONTROLS_LS_KEY) === "1"; } catch { return false; }
}

function applyControlsVisibility(hidden) {
  document.body.classList.toggle("controls-hidden", hidden);
  const btn = $("btn-toggle-controls");
  if (btn) {
    btn.textContent = "Генерация";
    btn.setAttribute("aria-expanded", String(!hidden));
    btn.title = hidden
      ? "Показать панель генерации персонажа (Ctrl+B)"
      : "Скрыть панель генерации персонажа (Ctrl+B)";
  }
}

function toggleControlsPanel() {
  const hidden = !document.body.classList.contains("controls-hidden");
  applyControlsVisibility(hidden);
  try { localStorage.setItem(CONTROLS_LS_KEY, hidden ? "1" : "0"); } catch { /* приватный режим */ }
}

function initControlsToggle() {
  applyControlsVisibility(controlsGetHidden()); // восстанавливаем состояние после перезагрузки
  $("btn-toggle-controls")?.addEventListener("click", toggleControlsPanel);
}

// ------------------------------------------------------------
// Магазины: кнопка «Открыть магазин» и модальное окно выбора
// Данные — src/shops/*.js (SHOPS), таблицы Core Rulebook, Night Market Appendix
// ------------------------------------------------------------
let shopCurrent = null; // выбранный магазин (объект из SHOPS)

function openShopModal() {
  const m = $("shop-modal");
  if (!m) return;
  renderShopPicker();
  showShopCatalog(false);
  m.classList.remove("hidden");
  document.body.classList.add("shop-open");
}

function closeShopModal() {
  const m = $("shop-modal");
  if (!m) return;
  m.classList.add("hidden");
  document.body.classList.remove("shop-open");
  shopCurrent = null;
}

function showShopCatalog(show) {
  $("shop-picker")?.classList.toggle("hidden", show);
  $("shop-catalog")?.classList.toggle("hidden", !show);
}

// Шаг 1: пять карточек магазинов на выбор
function renderShopPicker() {
  const wrap = $("shop-cards");
  if (!wrap) return;
  wrap.innerHTML = SHOPS.map((s, i) => `
    <button class="shop-card" type="button" data-shop-id="${s.id}">
      <span class="shop-card-icon">${s.icon || "🏪"}</span>
      <span class="shop-card-num">${i + 1})</span>
      <span class="shop-card-title">${s.ru}</span>
      <span class="shop-card-en">${s.en}</span>
      <span class="shop-card-hint muted small">${s.hint || ""}</span>
      <span class="shop-card-count muted small">${s.groups.reduce((n, g) => n + g.items.length, 0)} товаров</span>
    </button>`).join("");
  wrap.querySelectorAll(".shop-card").forEach((btn) => {
    btn.addEventListener("click", () => {
      shopCurrent = SHOPS.find((s) => s.id === btn.dataset.shopId) || null;
      if (shopCurrent) { renderShopCatalog(shopCurrent); showShopCatalog(true); }
    });
  });
}

// Шаг 2: каталог выбранного магазина (группы + товары из PDF-таблиц).
// Покупки списывают цену с наличных и добавляют товар в инвентарь;
// если валюты не хватает — кнопка заблокирована (disabled).
function canAfford(cost) {
  return !!current && Number(current.cash) >= Number(cost);
}

function buyShopItem(item, shop) {
  if (!current) { toast("Сначала создайте персонажа!"); return; }
  const cost = Number(item.cost) || 0;
  if (!canAfford(cost)) { toast(`Недостаточно эдди: нужно ${cost.toLocaleString("ru-RU")}, есть ${Number(current.cash).toLocaleString("ru-RU")}`); return; }
  current.cash -= cost;
  const name = `${item.ru || item.name}${item.name && item.ru ? ` (${item.name})` : ""}`;
  const entry = { name, cost };
  let humanityLoss = 0;
  if (shop.id === "cyberware") {
    entry.implant = true;
    humanityLoss = Math.max(0, Number(item.hl) || 0);
    entry.humanityLoss = humanityLoss;
    current.hum = Math.max(0, current.hum - humanityLoss);
    current.stats.EMP = Math.floor(current.hum / 10);
  }
  if (shop.id === "weapons") {
    if (item.damage) {
      entry.weapon = true;
      entry.damage = item.damage;
    } else if (item.sp != null) {
      entry.armor = true;
      entry.sp = Number(item.sp);
    }
  }
  if (!Array.isArray(current.gear)) current.gear = [];
  current.gear.push(entry);
  renderSheet(current);           // обновляем лист: наличные + инвентарь
  saveDraft();                    // покупки не должны теряться между визитами
  renderShopCatalog(shopCurrent); // перерисовываем кнопки (могла закончиться валюта)
  const lossNote = humanityLoss ? ` · −${humanityLoss} ЧЕЛ.` : "";
  toast(`Куплено: ${item.ru || item.name} — −${cost.toLocaleString("ru-RU")} eb${lossNote} (остаток ${Number(current.cash).toLocaleString("ru-RU")} eb)`);
}

function renderShopCatalog(shop) {
  $("shop-crumb-name").textContent = `${shop.icon || ""} ${shop.ru}`;
  $("shop-src").textContent = shop.src || "";
  const tierRu = { Cheap: "дёшево", Everyday: "обычно", Premium: "премиум", Expensive: "дорого", Illicit: "нелегально" };
  $("shop-groups").innerHTML = shop.groups.map((g) => `
    <section class="shop-group">
      <h3 class="shop-group-title">${g.title}</h3>
      <div class="shop-items">
        ${g.items.map((it) => `
          <div class="shop-item">
            <div class="shop-item-main">
              <span class="shop-item-name">${it.ru || it.name}${it.name && it.ru ? ` <small class="muted">(${it.name})</small>` : ""}</span>
              <span class="shop-item-meta muted small">
                ${it.tier ? `«${tierRu[it.tier] || it.tier}»` : ""}${it.install ? ` · установка: ${it.install}` : ""}${it.hl ? ` · −${it.hl} HL` : ""}${it.unit ? ` · ${it.unit}` : ""} · стр. ${it.page}
              </span>
              ${it.desc ? `<span class="shop-item-desc muted small">${it.desc}</span>` : ""}
            </div>
            <div class="shop-item-side">
              <span class="shop-item-cost">${Number(it.cost).toLocaleString("ru-RU")} eb</span>
              ${it.kind !== "chart" ? `<button class="btn tiny shop-buy-btn" type="button" data-item-key="${g.title}|||${it.name}"
                  ${canAfford(it.cost) ? "" : "disabled title=\"Недостаточно эдди\""}>💸 Купить</button>` : ""}
            </div>
          </div>`).join("")}
      </div>
    </section>`).join("");

  // Навешиваем обработчики на кнопки покупки (делегирование через dataset)
  $("shop-groups").querySelectorAll(".shop-buy-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const [groupTitle, itemName] = btn.dataset.itemKey.split("|||");
      const group = shop.groups.find((x) => x.title === groupTitle);
      const item = group?.items.find((x) => x.name === itemName);
      if (item) buyShopItem(item, shop);
    });
  });
}

// ------------------------------------------------------------
// Активное оружие и активная броня (панель «Экипировка»)
//   • только ОДНО оружие и ОДНА броня могут быть активны;
//   • данные — таблица оружия и брони Core Rulebook (стр. 340–350),
//     src/shops/weapons.js: у оружия указываем урон (damage),
//     у брони — SP (stoppage points) из Master Armor List (стр. 350);
//   • пользователь может указать свой SP брони и свой урон оружия
//     (клик по чипу значения → поле ввода);
//   • выбранное предмет добавляется в инвентарь с флагом weapon/armor.
// ------------------------------------------------------------

// группы WEAPONS, которые считаются оружием (не аксессуары и не броня)
const WEAPON_GROUP_TITLES = ["Ближний бой (Melee Weapons)", "Дальний бой (Ranged Weapons)", "Экзотическое оружие (Exotic Weapons)"];
const ARMOR_GROUP_TITLE = "Броня (Master Armor List)";
const weaponCatalogItems = () => WEAPONS.groups.filter((g) => WEAPON_GROUP_TITLES.includes(g.title)).flatMap((g) => g.items);
const armorCatalogItems = () => (WEAPONS.groups.find((g) => g.title === ARMOR_GROUP_TITLE)?.items || []);

// базовые характеристики по названиям каталога (для строк снаряжения ролей)
const WEAPON_BASE_BY_NAME = new Map(weaponCatalogItems().map((it) => [it.name.toLowerCase(), it]));
const ARMOR_BASE_BY_NAME = new Map(armorCatalogItems().map((it) => [it.name.toLowerCase(), it]));

// строки стартового снаряжения ролей, похожие на оружие/броню (fallback-распознавание)
const ROLE_GEAR_WEAPON_HINTS = {
  Solo:      { damage: "2d6" },  // пистоль-пулемёт Malorian Arms 2045
  Rockerboy: { damage: "2d6" },  // пистолет Cyberpunk Arms Centurion
  Nomad:     { damage: "5d6" },  // винтовка
  Fixer:     { damage: "2d6" },  // дипломатичный пистолет
  Tech:      { damage: "5d6" },  // дробовик
  Medtech:   { damage: "2d6" },  // пистолет-пулемёт для охраны
  Exec:      { damage: "2d6" },  // компактный пистолет
  Lawman:    { damage: "2d6" },  // служебный пистолет Hornet
};
const ROLE_GEAR_ARMOR_HINTS = {
  default:   { sp: 11 }, // Light Bodyshell ≈ Light Armorjack (стр. 350)
  Solo:      { sp: 13 }, // бронежилет Kiroshka+3
  Netrunner: { sp: 7 },  // тонкий бронежилет ≈ Kevlar®
  Nomad:     { sp: 4 },  // бронированный фургон (косвенно)
  Lawman:    { sp: 13 }, // броня Police Issue ≈ Heavy Armorjack
  Media:     { sp: 11 }, // легковой бронированный жилет
};
const ROLE_GEAR_WEAPON_ITEMS = {
  Solo: GEAR_BY_ROLE.Solo[0], Rockerboy: GEAR_BY_ROLE.Rockerboy[3],
  Nomad: GEAR_BY_ROLE.Nomad[2], Fixer: GEAR_BY_ROLE.Fixer[0],
  Tech: GEAR_BY_ROLE.Tech[3], Medtech: GEAR_BY_ROLE.Medtech[3],
  Exec: GEAR_BY_ROLE.Exec[2], Lawman: GEAR_BY_ROLE.Lawman[0],
};
const ROLE_GEAR_ARMOR_ITEMS = {
  default: GEAR_BY_ROLE.default[1], Solo: GEAR_BY_ROLE.Solo[1],
  Netrunner: GEAR_BY_ROLE.Netrunner[3], Nomad: GEAR_BY_ROLE.Nomad[0],
  Media: GEAR_BY_ROLE.Media[3], Lawman: GEAR_BY_ROLE.Lawman[3],
};

const normGearName = (s) => String(s || "").toLowerCase().replace(/[«»"'’]/g, "").replace(/\s+/g, " ").trim();
const isWeaponGear = (g) => !!(g && typeof g === "object" && g.weapon);
const isArmorGear = (g) => !!(g && typeof g === "object" && g.armor);

// распознавание оружия/брони в инвентаре: флаг → совпадение с каталогом
// (по полному или короткому названию) → ключевые слова / строки снаряжения ролей
function classifyGearItem(g, c) {
  if (!g) return null;
  const name = typeof g === "string" ? g : String(g.name || "");
  if (typeof g === "object") {
    if (g.weapon) return "weapon";
    if (g.armor) return "armor";
  }
  const nm = normGearName(name);
  // полное имя предмета магазина: «Русское (English)» — английская часть точно из каталога
  const en = (nm.match(/\(([^)]+)\)\s*$/) || [])[1] || "";
  const hitCatalog = (map) => map.has(nm) || (en && map.has(en.trim()));
  if (hitCatalog(ARMOR_BASE_BY_NAME)) return "armor";
  if (hitCatalog(WEAPON_BASE_BY_NAME)) return "weapon";
  // fallback для сохранений до появления флагов: ключевые слова
  if (/оружие|пистолет|пистоль|винтовк|дробовик|пулемёт|автомат|бластер|ружь|карабин/.test(nm)) return "weapon";
  if (/брон|жилет|armor|кевлар|kevlar|flak|пластин/.test(nm)) return "armor";
  // строковое снаряжение роли — по справочной таблице GEAR_BY_ROLE
  if (typeof g === "string" && Array.isArray(c?.gear) && c.gear.includes(g)) {
    const roleKey = Object.keys(GEAR_BY_ROLE).find((k) => k !== "default" && GEAR_BY_ROLE[k].includes(g));
    if (roleKey && ROLE_GEAR_WEAPON_ITEMS[roleKey] === g) return "weapon";
    if (roleKey && ROLE_GEAR_ARMOR_ITEMS[roleKey] === g) return "armor";
    if (!roleKey && ROLE_GEAR_ARMOR_ITEMS.default === g) return "armor";
    if (nm.includes("нож")) return "weapon"; // «боевой нож» есть у нескольких ролей
  }
  return null;
}

// найти запись инвентаря по названию (полное или короткое)
function findGearByName(c, name) {
  const nm = normGearName(name);
  return c.gear.find((g) => g && typeof g === "object" && normGearName(g.name) === nm);
}

// базовые (справочные) характеристики предмета: данные магазина → подсказки ролей
function baseStatsFor(kind, name) {
  const nm = normGearName(name);
  const en = (nm.match(/\(([^)]+)\)\s*$/) || [])[1] || "";
  const map = kind === "armor" ? ARMOR_BASE_BY_NAME : WEAPON_BASE_BY_NAME;
  const cat = map.get(nm) || map.get(en.trim());
  if (cat) return kind === "armor" ? { sp: cat.sp } : { damage: cat.damage };
  if (Array.isArray(current?.gear) && current.gear.includes(name)) {
    const roleKey = Object.keys(GEAR_BY_ROLE).find((k) => k !== "default" && GEAR_BY_ROLE[k].includes(name));
    if (roleKey) {
      if (kind === "armor" && ROLE_GEAR_ARMOR_HINTS[roleKey]) return ROLE_GEAR_ARMOR_HINTS[roleKey];
      if (kind === "weapon" && ROLE_GEAR_WEAPON_HINTS[roleKey]) return ROLE_GEAR_WEAPON_HINTS[roleKey];
    }
  }
  return {};
}

// активный предмет + его характеристики (свои значения пользователя приоритетны)
function getActiveItem(c, kind) {
  if (!c) return null;
  const key = kind === "armor" ? "activeArmor" : "activeWeapon";
  const flag = kind === "armor" ? "armor" : "weapon";
  let item = c[key] ? findGearByName(c, c[key]) : null;
  if (!item || !item[flag]) {
    item = c.gear.find((g) => g && typeof g === "object" && g[flag]) || null;
  }
  if (!item) return null;
  const base = baseStatsFor(kind, item.name);
  return kind === "armor"
    ? { item, sp: Number.isFinite(Number(item.sp)) ? Number(item.sp) : (Number.isFinite(Number(base.sp)) ? Number(base.sp) : null) }
    : { item, damage: item.damage || base.damage || "" };
}

// панель «Экипировка» на листе персонажа
function renderLoadout(c) {
  const box = $("loadout-box");
  if (!box) return;
  const hasChar = !!c;
  const w = hasChar ? getActiveItem(c, "weapon") : null;
  const a = hasChar ? getActiveItem(c, "armor") : null;
  $("active-weapon-name").textContent = w ? w.item.name : (hasChar ? "не выбрано" : "—");
  $("active-armor-name").textContent = a ? a.item.name : (hasChar ? "не выбрана" : "—");
  const dmgEl = $("active-weapon-dmg"), spEl = $("active-armor-sp");
  dmgEl.textContent = w ? `урон ${w.damage || "?"}` : "—";
  dmgEl.classList.toggle("editable", !!w);
  spEl.textContent = a ? `SP ${a.sp ?? "?"}` : "—";
  spEl.classList.toggle("editable", !!a);
  $("btn-change-weapon").disabled = !hasChar;
  $("btn-change-armor").disabled = !hasChar;
}

// клик по чипу «урон …» / «SP …» — пользователь может указать своё значение
function editActiveStat(kind) {
  if (!current) return toast("Сначала создайте персонажа!");
  const act = getActiveItem(current, kind);
  if (!act) return toast(kind === "armor" ? "Сначала выберите активную броню." : "Сначала выберите активное оружие.");
  const curVal = kind === "armor" ? (act.sp ?? "") : (act.damage || "");
  const promptText = kind === "armor"
    ? "SP активной брони (число, например 13):"
    : "Урон активного оружия (например 2d6+1 или «3d6»):";
  const val = window.prompt(promptText, String(curVal));
  if (val === null) return;
  const s = val.trim();
  if (!s) return toast("Значение не изменено (пустой ввод).");
  if (kind === "armor") {
    const n = Number(s.replace(",", "."));
    if (!Number.isFinite(n) || n < 0) return toast("SP должно быть числом (например 13).");
    act.item.sp = Math.round(n * 10) / 10;
  } else {
    act.item.damage = s.slice(0, 24);
  }
  renderSheet(current);
  saveDraft();
  toast(`${kind === "armor" ? "SP брони" : "Урон оружия"} обновлено: ${kind === "armor" ? "SP " + act.item.sp : act.item.damage}`);
}

// модальное окно выбора: kind = "weapon" | "armor"
let loadoutKind = null;

function openLoadoutModal(kind) {
  if (!current) { toast("Сначала создайте персонажа!"); return; }
  loadoutKind = kind;
  const m = $("loadout-modal");
  if (!m) return;
  $("loadout-crumb-name").textContent = kind === "armor" ? "🛡️ Активная броня" : "⚔️ Активное оружие";
  $("loadout-hint").textContent = kind === "armor"
    ? "Активной может быть только одна броня. SP указано из Master Armor List (стр. 350)."
    : "Активным может быть только одно оружие. Урон указан из таблиц оружия (стр. 340–349).";
  renderLoadoutChoices();
  m.classList.remove("hidden");
  document.body.classList.add("shop-open");
}

function closeLoadoutModal() {
  $("loadout-modal")?.classList.add("hidden");
  // класс блокировки прокрутки снимаем, если больше не открыто ни одно модальное окно
  const anyOpen = [$("shop-modal"), $("loadout-modal")]
    .some((m) => m && !m.classList.contains("hidden"));
  if (!anyOpen) document.body.classList.remove("shop-open");
  loadoutKind = null;
}

function renderLoadoutChoices() {
  const kind = loadoutKind;
  if (!kind || !current) return;
  const catalog = kind === "armor" ? armorCatalogItems() : weaponCatalogItems();
  const inv = current.gear
    .map((g, i) => ({ g, i }))
    .filter(({ g }) => classifyGearItem(g, current) === kind);
  const tierRu = { Cheap: "дёшево", Everyday: "обычно", Premium: "премиум", Expensive: "дорого", Illicit: "нелегально", Luxury: "роскошь", "Very Expensive": "очень дорого", Costly: "затратно" };
  const statOf = (it) => kind === "armor"
    ? (Number.isFinite(Number(it.sp)) ? `SP ${it.sp}` : "")
    : (it.damage ? `урон ${it.damage}` : "");
  const groups = [
    {
      title: kind === "armor" ? "✔ Из вашего инвентаря" : "✔ Из вашего инвентаря",
      items: inv.map(({ g, i }) => {
        const base = baseStatsFor(kind, g.name);
        const st = kind === "armor"
          ? (Number.isFinite(Number(g.sp)) ? `SP ${g.sp}` : (base.sp != null ? `SP ${base.sp} (из книги)` : "SP не указан"))
          : (g.damage || base.damage || "урон не указан");
        return {
          label: typeof g === "string" ? g : g.name, sub: st, cost: 0, page: "",
          active: !!g[kind], buy: false, idx: i,
        };
      }),
    },
    {
      title: kind === "armor" ? "Каталог брони (Core Rulebook, стр. 350)" : "Каталог оружия (Core Rulebook, стр. 340–349)",
      items: catalog.map((it, ci) => ({
        label: `${it.ru || it.name}${it.name && it.ru ? ` (${it.name})` : ""}`,
        sub: [statOf(it), it.penalty && it.penalty !== "нет" ? `штраф: ${it.penalty}` : ""].filter(Boolean).join(" · "),
        cost: Number(it.cost) || 0, page: it.page,
        active: false, buy: true, catalogItem: it,
      })),
    },
  ];

  $("loadout-groups").innerHTML = groups.map((gr) => `
    <section class="shop-group">
      <h3 class="shop-group-title">${gr.title}</h3>
      <div class="shop-items">
        ${gr.items.length ? gr.items.map((row, ri) => `
          <div class="shop-item${row.active ? " shop-item-active" : ""}">
            <div class="shop-item-main">
              <span class="shop-item-name">${row.label}${row.active ? ` <b class="loadout-active-tag">активно</b>` : ""}</span>
              <span class="shop-item-meta muted small">${row.sub}${row.page ? ` · стр. ${row.page}` : ""}</span>
            </div>
            <div class="shop-item-side">
              ${row.buy ? `<span class="shop-item-cost">${row.cost.toLocaleString("ru-RU")} eb</span>` : ""}
              ${row.active
                ? `<button class="btn tiny ghost" type="button" data-lo-unset="${ri}">✕ Снять</button>`
                : row.buy
                  ? `<button class="btn tiny shop-buy-btn" type="button" data-lo-catalog="${ri}"
                       ${canAfford(row.cost) ? "" : "disabled title=\"Недостаточно эдди\""}>${row.cost > 0 ? "💸 Купить и надеть" : "Надеть"}</button>`
                  : `<button class="btn tiny shop-buy-btn" type="button" data-lo-wear="${row.idx}">✔ Надеть</button>`}
            </div>
          </div>`).join("")
        : `<p class="muted small" style="padding:8px 12px;">В инвентаре пока нет ${kind === "armor" ? "брони" : "оружия"} — выберите из каталога ниже.</p>`}
      </div>
    </section>`).join("");

  // обработчики (делегирование через dataset)
  const wrap = $("loadout-groups");
  const catalogGroup = groups[1].items;
  wrap.querySelectorAll("[data-lo-wear]").forEach((btn) => btn.addEventListener("click", () => {
    setActiveFromInventory(loadoutKind, Number(btn.dataset.loWear));
  }));
  wrap.querySelectorAll("[data-lo-unset]").forEach((btn) => btn.addEventListener("click", () => {
    unsetActive(loadoutKind);
  }));
  wrap.querySelectorAll("[data-lo-catalog]").forEach((btn) => btn.addEventListener("click", () => {
    buyAndEquip(catalogGroup[Number(btn.dataset.loCatalog)]?.catalogItem);
  }));
}

// сделать активным предмет, уже лежащий в инвентаре (индекс c.gear)
function setActiveFromInventory(kind, idx) {
  const g = current.gear[idx];
  if (!g) return;
  if (typeof g === "string") {
    // строка снаряжения роли → превращаем в объект с флагом, сохраняя текст
    current.gear[idx] = { name: g, cost: 0, [kind]: true };
  } else {
    g[kind] = true;
  }
  afterEquip(kind, typeof g === "string" ? g : g.name);
}

// покупка товара из каталога и немедленная экипировка (цена списывается с наличных)
function buyAndEquip(item) {
  if (!current || !item) return;
  const kind = loadoutKind;
  const cost = Number(item.cost) || 0;
  if (!canAfford(cost)) { toast(`Недостаточно эдди: нужно ${cost.toLocaleString("ru-RU")}, есть ${Number(current.cash).toLocaleString("ru-RU")}`); return; }
  current.cash -= cost;
  const entry = {
    name: `${item.ru || item.name}${item.name && item.ru ? ` (${item.name})` : ""}`,
    cost,
    [kind]: true,
  };
  if (kind === "armor") entry.sp = Number(item.sp); else entry.damage = item.damage || "";
  if (!Array.isArray(current.gear)) current.gear = [];
  current.gear.push(entry);
  afterEquip(kind, entry.name, cost);
}

// снять статус активного с всех предметов данного типа, кроме одного (или ни с какого)
function clearActiveFlags(kind, exceptName) {
  for (const g of current.gear) {
    if (g && typeof g === "object" && g[kind] && normGearName(g.name) !== normGearName(exceptName || "")) {
      delete g.active;
    }
  }
}

function afterEquip(kind, name, cost) {
  const key = kind === "armor" ? "activeArmor" : "activeWeapon";
  current[key] = name;
  // единственность: активный предмет данного типа — ровно один
  clearActiveFlags(kind, name);
  const worn = findGearByName(current, name);
  if (worn) worn.active = true;
  renderSheet(current);
  saveDraft();
  if ($("loadout-modal") && !$("loadout-modal").classList.contains("hidden")) renderLoadoutChoices();
  toast(cost
    ? `Куплено и надето: ${name} — −${cost.toLocaleString("ru-RU")} eb`
    : `Надето: ${name}`);
}

function unsetActive(kind) {
  const key = kind === "armor" ? "activeArmor" : "activeWeapon";
  const act = getActiveItem(current, kind);
  if (act?.item) delete act.item.active;
  current[key] = null;
  renderSheet(current);
  saveDraft();
  renderLoadoutChoices();
  toast(kind === "armor" ? "Активная броня снята." : "Активное оружие убрано.");
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
    current.empMax = buyStats.EMP;
    current.hum = buyStats.EMP * 10;
    current.note = current.baseNote;
    renderSheet(current); // пересобираем лист, включая сумму «уровень + характеристика» у навыков
    toast("Характеристики обновлены");
  });

  $("btn-save").addEventListener("click", saveCharacter);
  $("btn-print").addEventListener("click", () => window.print());
  $("manual-gear-form").addEventListener("submit", (e) => {
    e.preventDefault();
    addManualGear();
  });
  $("ch-cash").addEventListener("change", () => {
    if (!current) return;
    const cash = Number($("ch-cash").value);
    if (!Number.isInteger(cash) || cash < 0) {
      toast("Баланс должен быть неотрицательным целым числом.");
      renderSheet(current);
      return;
    }
    current.cash = cash;
    renderSheet(current);
    saveDraft();
    toast("Баланс обновлён.");
  });

  // Скрытие/показ панели генерации персонажа
  initControlsToggle();

  // Магазин: кнопка в шапке открывает модальное окно выбора магазина
  $("btn-shop")?.addEventListener("click", openShopModal);
  $("shop-back")?.addEventListener("click", () => showShopCatalog(false));
  // закрытие: крестик, клик по затемнению, кнопки с data-shop-close, Esc
  document.querySelectorAll("[data-shop-close]").forEach((el) =>
    el.addEventListener("click", closeShopModal));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !$("shop-modal")?.classList.contains("hidden")) closeShopModal();
    if (e.key === "Escape" && !$("loadout-modal")?.classList.contains("hidden")) closeLoadoutModal();
    if (e.key === "Escape" && document.body.classList.contains("notes-open")) setNotesOpen(false);
  });

  // Экипировка: активное оружие / активная броня (кнопки «Сменить», клик по SP/урону)
  $("btn-change-weapon")?.addEventListener("click", () => openLoadoutModal("weapon"));
  $("btn-change-armor")?.addEventListener("click", () => openLoadoutModal("armor"));
  $("active-weapon-dmg")?.addEventListener("click", () => editActiveStat("weapon"));
  $("active-armor-sp")?.addEventListener("click", () => editActiveStat("armor"));
  document.querySelectorAll("[data-loadout-close]").forEach((el) =>
    el.addEventListener("click", closeLoadoutModal));

  // Горячая клавиша Ctrl+B — скрыть/показать панель генерации (не срабатывает в полях ввода)
  document.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key.toLowerCase() === "b") {
      const t = e.target;
      const typing = t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT" || t.isContentEditable);
      if (typing) return;
      e.preventDefault();
      toggleControlsPanel();
    }
  });

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
  initGearEditing();
  initSheetTabs();
  initHeaderMenu();
  initNotes();   // поле заметок игрока (правая колонка)
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
