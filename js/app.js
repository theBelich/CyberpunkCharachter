// ============================================================
// Cyberpunk RED — генератор персонажей (лист + 3 способа создания)
// Данные: Data/Cyberpunk Red Core Rulebook v1.25.pdf
//   Способ №1 «Уличная крыса» (Streetrats)      — стр. 73–77
//   Способ №2 «Эджраннер» (Edgerunners)         — стр. 77
//   Способ №3 «Полный пакет» (Complete Packages)— стр. 78
// Роли и таблицы шаблонов: src/roles/*.js
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

const SKILL_RU = {
  "Athletics": "Атлетика", "Brawling": "Рукопашный бой", "Concentration": "Концентрация",
  "Conversation": "Обходительность", "Education": "Образование", "Evasion": "Изворотливость",
  "First Aid": "Первая помощь", "Human Perception": "Чутьё на людей",
  "Language (Streetslang)": "Язык (уличный жаргон)", "Local Expert (Your Home)": "Знаток местности (дом)",
  "Perception": "Внимательность", "Persuasion": "Убедительность", "Stealth": "Скрытность",
  "Autofire (x2)": "Автогон (x2)", "Handgun": "Пистолеты", "Interrogation": "Допрос",
  "Melee Weapon": "Холодное оружие", "Resist Torture/Drugs": "Стойкость (пытки/наркотики)",
  "Shoulder Arms": "Длинноствольное оружие", "Tactics": "Тактика",
  "Cryptography": "Криптография", "Cybertech": "Кибертехника", "Demolitions": "Подрывное дело",
  "Electronic Warfare": "Радиоэлектронная борьба", "Interface": "Интерфейс", "Netrunning": "Нетраннинг",
  "Research": "Исследования", "Sleaze": "Грязные трюки", "Broadcast": "Эфир",
  "Compose": "Композиция", "Play Instrument": "Игра на инструменте", "Sing": "Пение",
  "Style (Rockerboy)": "Стиль (рокербой)", "Animal Handling": "Обращение с животными",
  "Drive Land Vehicle": "Вождение (наземный транспорт)", "Tracking": "Слежение",
  "Trading": "Торговля", "Wilderness Survival": "Выживание в дикой природе",
  "Awareness": "Наблюдательность", "Bribery": "Подкуп", "Combat Training": "Боевая подготовка",
  "Crimery": "Криминал", "Forgery": "Подделка документов", "Knowledge (Fixing)": "Знания (фиксинг)",
  "Leadership": "Лидерство", "Networking": "Связи", "Biology": "Биология", "Chemistry": "Химия",
  "Diagnose": "Диагностика", "Medicine": "Медицина", "Pharmacology": "Фармакология",
  "Surgery": "Хирургия", "Treat Psychoactive Drugs": "Лечение психоактивных веществ",
  "Administer": "Администрирование", "Computer": "Компьютеры", "Corporate Politics": "Политика корпораций",
  "Creditsheet": "Кредитная карточка", "Demeanor (Exec)": "Манера держаться (корпорат)",
  "Endure Alcohol/Drugs": "Переносимость алкоголя/наркотиков", "Focus": "Сосредоточенность",
  "Intimidation": "Запугивание", "Polite": "Вежливость", "Routing": "Маршрутизация",
  "Research (Media)": "Исследования (журналист)", "Style (Media)": "Стиль (журналист)",
  "Write": "Тексты", "Artists' Lore": "Легенды об артистах", "Law": "Закон",
  "Street Cop": "Уличный коп", "Style (Cop)": "Стиль (коп)"
};

const skillRu = (s) => SKILL_RU[s] || s;

// ------------------------------------------------------------
// Случайные данные для оформления листа (в духе правил)
// ------------------------------------------------------------
const NAMES = ["Ви","Джекс","Люси","Рейвен","Мирко","Таня","Диего","Нокс","Арсени","Кагами",
  "Шепот","Кузьма","Виктор","Марлоу","Скарлет","Отец","Заяц","Гризли","Неон","Призма"];
const NICKS = ["Призрак","Кобра","Искра","Ворон","Стальная","Гроза","Тень","Джаз","Ржавый","Лезвие","Фантом","Циклон"];
const STYLES = ["неон и хром", "рваный гранж", "строгий корпоративный крой", "панк-латка на куртке",
  "тактические разгрузки", "яркая безумная раскраска", "кожа, шипы, цепи", "дождевые пончо и маски"];

const LIFE_PATH = [
  { label: "Дом", icon: "🏚️", items: ["трущобы Уэстсайда", "пригород Бадландс", "община кочевников", "корпоративный квартал Пиквика", "плавучий дом в доках"] },
  { label: "Значимое событие", icon: "💥", items: ["четвёртая корпоративная война", "пожар в Найт-Сити", "эпидемия киберпсихоза", "зачистка банд", "прорыв Кокпита"] },
  { label: "Проблемы", icon: "⚠️", items: ["долг фиксеру", "розыск корпорации", "зависимость от чипов", "предательство близкого человека", "метка банды"] },
  { label: "Черта личности", icon: "🎭", items: ["циничный прагматик", "верный до конца", "одержимый справедливостью", "азартный авантюрист", "замкнутый профессионал"] },
  { label: "Контакты", icon: "🤝", items: ["информатор в полиции", "бармен из «Afterlife»", "контрабандист из портов", "нетраннер-наставник", "полеовой медик"] },
  { label: "Цель", icon: "🎯", items: ["выйти из тени и стать легендой", "найти того, кто предал семью", "сорвать контракт корпорации", "сколотить состояние и уйти на юг", "пережить 2046-й"] }
];

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
// ------------------------------------------------------------
let current = null;

function createCharacter(method, opts = {}) {
  const roleData = ROLES.find((r) => r.role === $("role-select").value) || solo;
  const gen = method === 3
    ? METHODS[3].fn(roleData, opts.points ?? Number($("rank-select")?.value || 62))
    : METHODS[method].fn(roleData);

  const c = {
    created: Date.now(),
    method,
    methodName: METHODS[method].name,
    note: gen.note,
    role: roleData.role,
    roleRu: ROLE_RU[roleData.role] || roleData.role,
    name: pick(NAMES),
    nick: pick(NICKS),
    age: 18 + Math.floor(Math.random() * 30),
    style: pick(STYLES),
    stats: gen.stats,
    statsOrder: roleData.statsOrder,
    hp: calcHP(gen.stats.BODY, gen.stats.WILL),
    hum: gen.stats.EMP * 10,
    skills: rollSkills(roleData),
    lifepath: LIFE_PATH.map((lp) => ({ label: lp.label, icon: lp.icon, value: pick(lp.items) })),
    gear: GEAR_BY_ROLE[roleData.role] || GEAR_BY_ROLE.default,
    cash: 100 + Math.floor(Math.random() * 900) * 5
  };
  current = c;
  renderSheet(c);
  toast(`${c.name} «${c.nick}» — ${c.roleRu} создан (${METHODS[method].name})`);
  return c;
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

  $("stats-grid").innerHTML = c.statsOrder
    .map((k) => `
      <div class="stat">
        <div class="stat-abbr">${k}</div>
        <div class="stat-val">${c.stats[k]}</div>
        <div class="stat-name">${STAT_RU[k] || k}</div>
      </div>`)
    .join("");

  $("d-hp").textContent = `${c.hp} / ${c.hp}`;
  $("d-sw").textContent = Math.ceil(c.hp / 2);
  $("d-ds").textContent = c.stats.BODY;
  $("d-hum").textContent = c.hum;
  $("d-move").textContent = c.stats.MOVE;

  $("skills-body").innerHTML = c.skills
    .slice()
    .sort((a, b) => b.level - a.level)
    .map((s) => `<tr class="${s.level === 0 ? "zero" : ""}"><td>${skillRu(s.name)}</td><td class="lvl">${s.level}</td></tr>`)
    .join("");

  $("lifepath").innerHTML = c.lifepath
    .map((lp) => `
      <div class="lp-row">
        <span class="lp-icon">${lp.icon}</span>
        <span><small>${lp.label}:</small> <p>${lp.value}</p></span>
      </div>`)
    .join("") + `<p class="small muted" style="margin-top:8px;">${c.note}</p>`;

  $("gear-list").innerHTML = c.gear.map((g) => `<li>${g}</li>`).join("");
  $("ch-cash").textContent = c.cash.toLocaleString("ru-RU") + " эдди";
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
  const sel = $("role-select");
  sel.innerHTML = ROLES
    .map((r) => `<option value="${r.role}">${ROLE_RU[r.role] || r.role} (${r.role})</option>`)
    .join("");
  sel.addEventListener("change", () => {
    const r = ROLES.find((x) => x.role === sel.value);
    $("role-info").innerHTML =
      `<p><b>Роль:</b> ${ROLE_RU[r.role]}</p>
       <p><b>Навыки роли:</b> ${r.skills.map(skillRu).slice(0, 6).join(", ")}…</p>
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
    current.hp = calcHP(buyStats.BODY, buyStats.WILL);
    current.hum = buyStats.EMP * 10;
    current.note = `«Полный пакет»: очки распределены вручную (${total} очков)`;
    renderSheet(current);
    toast("Характеристики обновлены");
  });

  $("btn-save").addEventListener("click", saveCharacter);
  $("btn-print").addEventListener("click", () => window.print());

  renderSaved();
  sel.dispatchEvent(new Event("change"));
}

document.addEventListener("DOMContentLoaded", init);
