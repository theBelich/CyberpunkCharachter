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
// ЖИЗНЕННЫЙ ПУТЬ — генерация / выбор по предыстории
// Пункты общие для всех ролей; варианты («прошлый образ жизни»)
// подобраны под конкретную роль и её предысторию из Core Rulebook
// (стр. 74–77). Если у роли нет своих вариантов — берётся общий
// список (role: null). Бросок 1d10 → вариант из таблицы d10.
// ------------------------------------------------------------
const LIFEPATH_FIELDS = [
  { key: "home",      label: "Дом",                 icon: "🏚️" },
  { key: "event",     label: "Значимое событие",    icon: "💥" },
  { key: "trouble",   label: "Проблемы",            icon: "⚠️" },
  { key: "trait",     label: "Черта личности",      icon: "🎭" },
  { key: "contacts",  label: "Контакты",            icon: "🤝" },
  { key: "goal",      label: "Цель",                icon: "🎯" }
];

const LIFEPATH_OPTIONS = {
  home: [
    { role: null,        text: "трущобы Уэстсайда" },
    { role: null,        text: "пригород Бадландс" },
    { role: null,        text: "община кочевников на окраине города" },
    { role: null,        text: "корпоративный квартал Пиквика" },
    { role: null,        text: "плавучий дом в доках Уотчтотера" },
    { role: "Solo",      text: "казармы частной военной компании за городом" },
    { role: "Solo",      text: "съёмная комнатушка рядом с участком наёмников" },
    { role: "Netrunner", text: "затенённая серверная в подвале сетевой фермы" },
    { role: "Netrunner", text: "арендованный кокон-капсула в нет-кафе" },
    { role: "Rockerboy", text: "закулисная комната захудалого клуба «Восход»" },
    { role: "Rockerboy", text: "коммуна музыкантов в Старом Японском квартале" },
    { role: "Nomad",     text: "фургон в стойбище клана у дальней дороги" },
    { role: "Nomad",     text: "лагерь клана на свалке за пределами города" },
    { role: "Fixer",     text: "квартира над баром, где «все всё знают»" },
    { role: "Fixer",     text: "офис-контору в деловом районе Хейвуда" },
    { role: "Tech",      text: "мастерскую-гараж в промышленном Сироу Виллидж" },
    { role: "Tech",      text: "жилой фургон у свалки запчастей" },
    { role: "Medtech",   text: "служебное жильё при клинике КорпСек" },
    { role: "Medtech",   text: "подпольную аптеку-клинику в трущобах" },
    { role: "Exec",      text: "элитные апартаменты корпоративного сегмента" },
    { role: "Exec",      text: "закрытый жилой комплекс корпорации" },
    { role: "Media",     text: "редакцию медиа-холдинга в центре города" },
    { role: "Media",     text: "студию самодел-вещателя на чердаке" },
    { role: "Lawman",    text: "казармы при полицейском участке" },
    { role: "Lawman",    text: "дом в спокойном районе служащих NCPD" },
    { role: "Solo",      text: "полигон отряда «Грозовых птиц» в муссонных землях" },
    { role: "Netrunner", text: "пустующий дата-центр под Старым Чинатауном" },
    { role: "Rockerboy", text: "тур-фургон, что год за годом колесят по Найт-Сити" },
    { role: "Nomad",     text: "караван-стойбище у границы штата" },
    { role: "Fixer",     text: "съёмную конспиративную квартиру без контракта" },
    { role: "Tech",      text: "нефтевышку-скват со станками и хламом" },
    { role: "Medtech",   text: "полевой медпункт ополчения Лиги свободных штатов" },
    { role: "Exec",      text: "резиденцию за КПП корпоративного анклава" },
    { role: "Media",     text: "передвижную студию прямо в гуще событий" },
    { role: "Lawman",    text: "дом родителей, куда наведываешься только по выходным" }
  ],
  event: [
    { role: null,        text: "четвёртая корпоративная война" },
    { role: null,        text: "пожар в Найт-Сити" },
    { role: null,        text: "эпидемия киберпсихоза" },
    { role: null,        text: "зачистка банд" },
    { role: null,        text: "прорыв Кокпита" },
    { role: "Solo",      text: "бой, в котором полежал весь твой отряд" },
    { role: "Solo",      text: "контракт, после которого тебя отмели из компании" },
    { role: "Netrunner", text: "обвал Сети во время Прорыва, убивший сотни диверов" },
    { role: "Netrunner", text: "взлом чёрного ICE, оставивший тебя на грани смерти" },
    { role: "Rockerboy", text: "последний концерт группы, развалившейся на сцене" },
    { role: "Rockerboy", text: "восстание фанатов, подавленное КорпСек" },
    { role: "Nomad",     text: "гибель отца на трассе — клан отвернулся от тебя" },
    { role: "Nomad",     text: "раскол клана из-за сделки с чужаками" },
    { role: "Fixer",     text: "крах большой сделки, стоивший тебе репутации" },
    { role: "Fixer",     text: "война банд за твои территории" },
    { role: "Tech",      text: "авария твоего же изобретения, покалечившая людей" },
    { role: "Tech",      text: "пожар на складе корпорации, в котором ты спас соседей" },
    { role: "Medtech",   text: "триаж после прорыва Кокпита, изменивший твой взгляд на жизнь" },
    { role: "Medtech",   text: "вспышку киберпсихоза в твоей клинике" },
    { role: "Exec",      text: "кадровую чистку, съевшую половину твоего отдела" },
    { role: "Exec",      text: "утечку данных, за которую поплатился твой наставник" },
    { role: "Media",     text: "репортаж, из-за которого тебя вышвырнули из редакции" },
    { role: "Media",     text: "цензуру сюжета, который мог бы остановить войну" },
    { role: "Lawman",    text: "дело о коррупции внутри NCPD, стоившее напарнику жизни" },
    { role: "Lawman",    text: "мятеж в блок-блоке, после которого ты ушёл со службы" },
    { role: "Solo",      text: "зачистку трущоб, где ты впервые взял в руки оружие" },
    { role: "Netrunner", text: "первый успешный пролом корпоративного Даркнет-узла" },
    { role: "Rockerboy", text: "выступление на площади, собравшее тысячи голосов" },
    { role: "Nomad",     text: "переход через границу под обстрелом корпоративных дронов" },
    { role: "Fixer",     text: "смерть твоего ментора — и наследство его контактов" },
    { role: "Tech",      text: "утилизацию военного лома, давшую старт твоей карьере" },
    { role: "Medtech",   text: "экспериментальный имплант, спасший тебе жизнь" },
    { role: "Exec",      text: "перевод в найт-ситский филиал в разгар войны" },
    { role: "Media",     text: "публикацию списков погибших, сделавшую тебя известным" },
    { role: "Lawman",    text: "перестрелку у «Afterlife», после которой ты дал присягу заново" }
  ],
  trouble: [
    { role: null,        text: "долг фиксеру" },
    { role: null,        text: "розыск корпорации" },
    { role: null,        text: "зависимость от чипов" },
    { role: null,        text: "предательство близкого человека" },
    { role: null,        text: "метка банды" },
    { role: "Solo",      text: "шрам и контракт, из-за которых тебя узнают на улицах" },
    { role: "Solo",      text: "встряхивающий синдром после слишком многих боёв" },
    { role: "Netrunner", text: "обугленный мозг после перегрузки в Сети" },
    { role: "Netrunner", text: "долг за кибердеку перед очень терпеливым кредитором" },
    { role: "Rockerboy", text: "голос, который подводит тебя в самый неподходящий момент" },
    { role: "Rockerboy", text: "славу, из-за которой тебя не оставляют в покое фанаты и охотники" },
    { role: "Nomad",     text: "кровную месть между кланами" },
    { role: "Nomad",     text: "прописку в чёрном списке всех КПП города" },
    { role: "Fixer",     text: "сорванный контракт на огромные деньги" },
    { role: "Fixer",     text: "слишком длинные списки должников и кредиторов" },
    { role: "Tech",      text: "прототип, который кто-то очень хочет получить назад" },
    { role: "Tech",      text: "кредит под залог всей твоей мастерской" },
    { role: "Medtech",   text: "лицензию, отобранную корпоративной клиникой" },
    { role: "Medtech",   text: "пациента, умершего на твоём столе" },
    { role: "Exec",      text: "внутреннее расследование против тебя" },
    { role: "Exec",      text: "должность, за которую соперники готовы убить" },
    { role: "Media",     text: "иск о диффамации от корпорации" },
    { role: "Media",     text: "компромат на тебя у того, кого ты копал" },
    { role: "Lawman",    text: "подозрение в связях с бандой" },
    { role: "Lawman",    text: "ордер на тебя за приказ, в котором ты отказал" },
    { role: "Solo",      text: "психологический порог: ещё один срыв — и киберпсихоз" },
    { role: "Netrunner", text: "ловушку-чёрный ICE, оставившую след в твоей психике" },
    { role: "Rockerboy", text: "бывшего продюсера с правами на твои песни" },
    { role: "Nomad",     text: "больного ребёнка, ради лечения которого нужны деньги" },
    { role: "Fixer",     text: "понимающего слишком много свидетеля" },
    { role: "Tech",      text: "украденные чертежи твоей лучшей работы" },
    { role: "Medtech",   text: "дефицит стима и медикаментов в твоей клинике" },
    { role: "Exec",      text: "внебрачного ребёнка в Найт-Сити" },
    { role: "Media",     text: "источник, который теперь считает тебя предателем" },
    { role: "Lawman",    text: "журнал дел, которые ты вёл в обход начальства" }
  ],
  trait: [
    { role: null,        text: "циничный прагматик" },
    { role: null,        text: "верный до конца" },
    { role: null,        text: "одержимый справедливостью" },
    { role: null,        text: "азартный авантюрист" },
    { role: null,        text: "замкнутый профессионал" },
    { role: "Solo",      text: "хладнокровие перед лицом огня" },
    { role: "Solo",      text: "дисциплина, выжженная армейской муштрой" },
    { role: "Netrunner", text: "терпение охотника, ждущего жертву в Сети" },
    { role: "Netrunner", text: "паранойя: каждый узел может оказаться ловушкой" },
    { role: "Rockerboy", text: "бунт как образ мысли" },
    { role: "Rockerboy", text: "харизма, зажигающая толпу с полувзгляда" },
    { role: "Nomad",     text: "семья и клан выше любых законов" },
    { role: "Nomad",     text: "дорога важнее любой точки на карте" },
    { role: "Fixer",     text: "улыбка и долгая память на услуги" },
    { role: "Fixer",     text: "словесная дуэль вместо огневой" },
    { role: "Tech",      text: "любая поломка — личный вызов" },
    { role: "Tech",      text: "руки чище, чем совесть" },
    { role: "Medtech",   text: "клятву не бросать раненых не нарушаешь" },
    { role: "Medtech",   text: "хладнокровие скальпеля посреди хаоса" },
    { role: "Exec",      text: "вежливость как броня" },
    { role: "Exec",      text: "цифры и отчёты вместо чувств" },
    { role: "Media",     text: "нюх на правду, какой бы она ни была" },
    { role: "Media",     text: "камера впереди совести" },
    { role: "Lawman",    text: "закон буквенный, не духовный" },
    { role: "Lawman",    text: "код молчания в отделении" },
    { role: "Solo",      text: "профессионализм: контракт святое" },
    { role: "Netrunner", text: "цифровой аскетизм: мир реален меньше Сети" },
    { role: "Rockerboy", text: "громче всех — значит ближе к истине" },
    { role: "Nomad",     text: "гостеприимство костра для каждого попутчика" },
    { role: "Fixer",     text: "нейтральность до последней эдди" },
    { role: "Tech",      text: "вера в железо сильнее веры в людей" },
    { role: "Medtech",   text: "усталость ангела на поле боя" },
    { role: "Exec",      text: "лояльность корпорации превыше родных" },
    { role: "Media",     text: "вопрос-нож: режешь им каждую беседу" },
    { role: "Lawman",    text: "значок помнишь, даже когда снял форму" }
  ],
  contacts: [
    { role: null,        text: "информатор в полиции" },
    { role: null,        text: "бармен из «Afterlife»" },
    { role: null,        text: "контрабандист из портов" },
    { role: null,        text: "нетраннер-наставник" },
    { role: null,        text: "полеовой медик" },
    { role: "Solo",      text: "офицер вербовки ЧВК «Микрон-Индастриз»" },
    { role: "Solo",      text: "старый сержант, держащий очередь на контракты" },
    { role: "Netrunner", text: "владелец нет-кафе с «чистой» линией" },
    { role: "Netrunner", text: "торговец кодеками на чёрном рынке Даркнета" },
    { role: "Rockerboy", text: "звукарь легендарного клуба «Восход»" },
    { role: "Rockerboy", text: "диджей пиратской радиостанции LPFM" },
    { role: "Nomad",     text: "диспетчер грузов на дальних маршрутах" },
    { role: "Nomad",     text: "вожак соседнего клана, обязанный тебе кровью" },
    { role: "Fixer",     text: "посредник картеля «О'Тул»" },
    { role: "Fixer",     text: "секретарша корпоративного юриста" },
    { role: "Tech",      text: "владелец ломбарда запчастей в Сироу" },
    { role: "Tech",      text: "инженер-перебежчик с завода Militech" },
    { role: "Medtech",   text: "фельдшер скорой, закрывающий глаза на «серых» пациентов" },
    { role: "Medtech",   text: "фармацевт, торгующий стимом из-под прилавка" },
    { role: "Exec",      text: "помощник вице-президента филиала" },
    { role: "Exec",      text: "корпоративный аудитор с договорными интересами" },
    { role: "Media",     text: "продюсер новостного канала KJJK" },
    { role: "Media",     text: "хактивист-видеографщик из подполья" },
    { role: "Lawman",    text: "детектив из отдела по тяжким" },
    { role: "Lawman",    text: "прокурор, ведущий «нужные» дела" },
    { role: "Solo",      text: "медик подпольной клиники для наёмников" },
    { role: "Netrunner", text: "брокер данных с безупречной анонимностью" },
    { role: "Rockerboy", text: "менеджер тура с деньгами «на чёрный день»" },
    { role: "Nomad",     text: "механик-самоделкин с золотыми руками" },
    { role: "Fixer",     text: "легендарный фиксер-ветеран на пенсии" },
    { role: "Tech",      text: "контрабандист военных комплектующих" },
    { role: "Medtech",   text: "киберврач, ставящий импланты без лицензии" },
    { role: "Exec",      text: "дворецкий особняка, слышавший слишком много" },
    { role: "Media",     text: "фотограф таблоида, вечно в долгу у тебя" },
    { role: "Lawman",    text: "коп-одиночка, которому можно позвонить ночью" }
  ],
  goal: [
    { role: null,        text: "выйти из тени и стать легендой" },
    { role: null,        text: "найти того, кто предал семью" },
    { role: null,        text: "сорвать контракт корпорации" },
    { role: null,        text: "сколотить состояние и уйти на юг" },
    { role: null,        text: "пережить 2046-й" },
    { role: "Solo",      text: "собрать собственный отряд и диктовать цену контрактам" },
    { role: "Solo",      text: "закрыть последний контракт и уйти живым" },
    { role: "Netrunner", text: "пробиться в Даркнет и найти то, что скрыли корпорации" },
    { role: "Netrunner", text: "отмыть своё имя в Сети после ложного взлома" },
    { role: "Rockerboy", text: "собрать стадион и спеть песню, которая изменит всё" },
    { role: "Rockerboy", text: "разжечь восстание одним только словом и рифом" },
    { role: "Nomad",     text: "собрать рассеянный клан обратно на большую дорогу" },
    { role: "Nomad",     text: "провезти груз через все КПП и вернуть себе имя" },
    { role: "Fixer",     text: "стать главным фиксером Найт-Сити" },
    { role: "Fixer",     text: "провернуть сделку, после которой долги простят сами" },
    { role: "Tech",      text: "построить машину, которую невозможно украсть" },
    { role: "Tech",      text: "открыть мастерскую, куда пускают даже уличных крыс" },
    { role: "Medtech",   text: "построить бесплатную клинику для трущоб" },
    { role: "Medtech",   text: "найти лекарство от последствий киберпсихоза" },
    { role: "Exec",      text: "дослужиться до совета директоров" },
    { role: "Exec",      text: "уволиться в собственное дело и дышать свободно" },
    { role: "Media",     text: "опубликовать правду, которую прячут все корпорации" },
    { role: "Media",     text: "вернуться в большое радио со своим шоу" },
    { role: "Lawman",    text: "доказать коррупцию в собственных рядах" },
    { role: "Lawman",    text: "получить значок детектива и вести свои дела" },
    { role: "Solo",      text: "найти того, кто сдал твой отряд" },
    { role: "Netrunner", text: "создать сеть-убежище для таких, как ты" },
    { role: "Rockerboy", text: "записать альбом, который переживёт тебя" },
    { role: "Nomad",     text: "увести семью из-под удара корпоративных зачистщиков" },
    { role: "Fixer",     text: "сыграть на оперение две враждующие стороны" },
    { role: "Tech",      text: "восстановить довоенный прототип по крупицам" },
    { role: "Medtech",   text: "вернуть лицензию и право работать при свете дня" },
    { role: "Exec",      text: "вывести из корпорации компромат на себя" },
    { role: "Media",     text: "заставить замолчать тех, кто платит за ложь" },
    { role: "Lawman",    text: "закрыть дело, которое сломало твоего напарника" }
  ]
};

// Все варианты поля, подходящие данной роли (свои + общие)
function lifepathOptionsFor(fieldKey, roleName) {
  const all = LIFEPATH_OPTIONS[fieldKey] || [];
  return all.filter((o) => !o.role || o.role === roleName);
}

// Один пункт пути: результат броска 1d10 и текст варианта
function rollLifepathItem(field, roleName) {
  const options = lifepathOptionsFor(field.key, roleName);
  const roll = options.length ? d10() : null;
  const idx = options.length ? ((roll - 1) % options.length) : 0;
  const opt = options[idx] || null;
  return { key: field.key, label: field.label, icon: field.icon, roll, value: opt ? opt.text : "—" };
}

// Случайный жизненный путь целиком (по предыстории роли)
function rollLifepath(roleName) {
  return LIFEPATH_FIELDS.map((f) => rollLifepathItem(f, roleName));
}

// Текстовое резюме пути — для note и подсказок
function lifepathSummary(lp) {
  return lp.map((x) => `${x.label}: ${x.value}`).join(" · ");
}

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
    // Жизненный путь: случайная генерация по предыстории выбранной роли
    lifepath: rollLifepath(roleData.role),
    gear: GEAR_BY_ROLE[roleData.role] || GEAR_BY_ROLE.default,
    cash: 100 + Math.floor(Math.random() * 900) * 5
  };
  current = c;
  renderSheet(c);
  toast(`${c.name} «${c.nick}» — ${c.roleRu} создан (${METHODS[method].name})`);
  return c;
}

// ------------------------------------------------------------
// ЖИЗНЕННЫЙ ПУТЬ — панели «Случайно» / «Выбрать»
// «Сгенерировать» — бросок 1d10 по таблице вариантов предыстории
// роли; «Выбрать вручную» — свой вариант для каждого пункта пути.
// ------------------------------------------------------------
let lpEditorOpen = false;

// Сохранить/обновить жизненный путь текущего персонажа
function applyLifepath(lp, msg) {
  if (!current) { toast("Сначала создайте персонажа!"); return; }
  current.lifepath = lp;
  renderSheet(current);
  if (msg) toast(msg);
}

// Случайная генерация пути по предыстории роли персонажа
function generateLifepath() {
  if (!current) return toast("Сначала создайте персонажа!");
  applyLifepath(rollLifepath(current.role), "Жизненный путь сгенерирован по предыстории роли");
}

// Ручная панель выбора: на каждый пункт — выпадающий список подходящих
// роли вариантов + кнопка «🎲» (переброс одного пункта) и общая кнопка
// «Применить».
function toggleLpEditor(force) {
  if (!current) { toast("Сначала создайте персонажа!"); return; }
  lpEditorOpen = force ?? !lpEditorOpen;
  const box = $("lp-editor");
  if (!box) return;
  if (!lpEditorOpen) { box.classList.add("hidden"); return; }
  box.classList.remove("hidden");
  renderLpEditor();
}

function renderLpEditor() {
  const box = $("lp-editor");
  if (!box || !current) return;
  const roleName = current.role;
  box.innerHTML = `
    <h3 class="lp-editor-title">Выбор жизненного пути (по предыстории роли «${current.roleRu}»)</h3>
    <div class="lp-steps">
      ${LIFEPATH_FIELDS.map((f, i) => {
        const options = lifepathOptionsFor(f.key, roleName);
        const cur = current.lifepath.find((x) => x.key === f.key);
        const curVal = cur ? cur.value : "";
        const inList = options.some((o) => o.text === curVal);
        return `
          <div class="lp-step" data-lp="${i}">
            <div class="lp-step-label">${f.icon} ${f.label}${cur && cur.roll ? ` <span class="roll">(бросок: ${cur.roll})</span>` : ""}</div>
            <select class="lp-pick" data-key="${f.key}" aria-label="Выбор: ${f.label}">
              ${!inList && curVal ? `<option value="${curVal}" selected>${curVal} (своё)</option>` : ""}
              ${options.map((o) =>
                `<option value="${o.text}" ${o.text === curVal ? "selected" : ""}>${o.text}</option>`).join("")}
            </select>
            <button type="button" class="btn tiny lp-reroll" data-key="${f.key}"
                    title="Перебросить этот пункт (1d10)">🎲 Бросить</button>
          </div>`;
      }).join("")}
    </div>
    <div class="gen-row">
      <button type="button" class="btn primary" id="btn-lp-apply">Применить выбор</button>
      <button type="button" class="btn" id="btn-lp-roll-all">🎲 Случайно всем пунктам</button>
    </div>`;

  box.querySelectorAll("select.lp-pick").forEach((sel) => {
    sel.addEventListener("change", () => {
      const item = current.lifepath.find((x) => x.key === sel.dataset.key);
      if (item) { item.value = sel.value; item.roll = null; }
    });
  });
  box.querySelectorAll("button.lp-reroll").forEach((btn) => {
    btn.addEventListener("click", () => {
      const f = LIFEPATH_FIELDS.find((x) => x.key === btn.dataset.key);
      const rolled = rollLifepathItem(f, current.role);
      const item = current.lifepath.find((x) => x.key === f.key) || current.lifepath[LIFEPATH_FIELDS.indexOf(f)];
      Object.assign(item, rolled);
      renderLpEditor();
      toast(`${f.label}: ${rolled.value} (выпало ${rolled.roll})`);
    });
  });
  $("btn-lp-apply")?.addEventListener("click", () => {
    applyLifepath(current.lifepath, "Жизненный путь обновлён: " + lifepathSummary(current.lifepath));
  });
  $("btn-lp-roll-all")?.addEventListener("click", () => {
    current.lifepath = rollLifepath(current.role);
    renderLpEditor();
    toast("Все пункты переброшены случайно");
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
// Отрисовка листа
// ------------------------------------------------------------
function renderSheet(c) {
  $("ch-name").textContent = `${c.name} «${c.nick}»`;
  $("ch-role").textContent = c.roleRu;
  $("ch-realname").textContent = c.name;
  $("ch-age").textContent = c.age + " лет";
  $("ch-style").textContent = c.style;
  $("ch-method").textContent = c.methodName;

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

  // Жизненный путь: значения + результат броска 1d10 (если пункт выпал случайно)
  $("lifepath").innerHTML = c.lifepath
    .map((lp) => `
      <div class="lp-row">
        <span class="lp-icon">${lp.icon}</span>
        <span>
          <small>${lp.label}:${lp.roll ? ` <b class="lp-roll">(1d10 = ${lp.roll})</b>` : ""}</small>
          <p>${lp.value}</p>
        </span>
      </div>`)
    .join("") + `<p class="small muted" style="margin-top:8px;">${c.note}</p>`;

  $("gear-list").innerHTML = c.gear.map((g) => `<li>${g}</li>`).join("");
  $("ch-cash").textContent = c.cash.toLocaleString("ru-RU") + " эдди";
}

// ------------------------------------------------------------
// Таблица навыков: название | характеристика | редактируемый уровень | сумма (уровень + характеристика)
// ------------------------------------------------------------
const SKILL_MIN = 0, SKILL_MAX = 10;

function skillRowHtml(s, i, c) {
  const stat = skillStat(s.name);
  const statVal = c.stats[stat];
  const sum = (typeof statVal === "number" ? statVal : 0) + s.level;
  return `
    <tr class="${s.level === 0 ? "zero" : ""}" data-skill="${i}">
      <td>${skillRu(s.name)}</td>
      <td class="attr-tag" title="${STAT_RU[stat] || stat}">${stat}</td>
      <td class="lvl">
        <input type="number" class="lvl-input" min="${SKILL_MIN}" max="${SKILL_MAX}" step="1"
               value="${s.level}" aria-label="Уровень навыка: ${skillRu(s.name)}" />
      </td>
      <td class="mod">${sum}</td>
    </tr>`;
}

function renderSkillsTable(c) {
  const body = $("skills-body");
  // ВАЖНО: рисуем ВСЕ навыки из справочника data/skills.js (навыки роли —
  // с распределёнными уровнями, остальные — с уровнем 0). Индекс навыка
  // фиксируется ДО сортировки (через map((s, i) => ({ s, i }))), чтобы строки
  // не терялись и уровень правился у нужного навыка. Сортировка
  // «по убыванию уровня» — только визуальная (стабильная).
  const rows = c.skills.map((s, i) => ({ s, i })).sort((a, b) => b.s.level - a.s.level || a.i - b.i);
  // Группируем отсортированные строки по категориям навыков (Core Rulebook, стр. 82–85)
  const byGroup = new Map();
  for (const r of rows) {
    const g = SKILL_BY_NAME[r.s.name]?.group || "Прочее";
    if (!byGroup.has(g)) byGroup.set(g, []);
    byGroup.get(g).push(r);
  }
  body.innerHTML = [...byGroup.entries()]
    .map(([g, list]) =>
      `<tr class="skill-group"><td colspan="4">${GROUP_RU[g] || g} <span class="cnt">(${list.length})</span></td></tr>` +
      list.map(({ s, i }) => skillRowHtml(s, i, c)).join("")
    )
    .join("");

  // при изменении уровня — обновляем данные персонажа и пересобираем таблицу
  body.querySelectorAll("input.lvl-input").forEach((inp) => {
    inp.addEventListener("change", () => {
      const idx = Number(inp.closest("tr").dataset.skill);
      let v = Math.round(Number(inp.value));
      if (!Number.isFinite(v)) v = SKILL_MIN;
      v = Math.max(SKILL_MIN, Math.min(SKILL_MAX, v));
      current.skills[idx].level = v;
      inp.value = v;
      renderSkillsTable(current);
    });
  });
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
}

// Если DOM уже готов — запускаем сразу; иначе ждём DOMContentLoaded
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
