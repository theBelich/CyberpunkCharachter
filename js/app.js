/* ============================================================
   app.js — Cyberpunk RED: генератор листа персонажа
   Три способа создания (книга игрока):
     1. Случайно (Random)        — броски по таблицам книги
     2. По ролевой таблице (Point Buy / Role Table)
     3. По шагам (Life Path, кидается d6 по этапам пути)
   Экспорт: JSON и .xlsx. Сохранение/загрузка в localStorage.
   ============================================================ */
'use strict';

/* ---------- утилиты ---------- */
const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));
const rnd = n => Math.floor(Math.random() * n);
const d = sides => rnd(sides) + 1;
const pick = arr => arr[rnd(arr.length)];

const NAMES_FIRST_M = ['Рико','Виктор','Диего','Хуан','Мигель','Сэм','Курт','Олег','Танкреди','Жак','Бьёрн','Рафаэль'];
const NAMES_FIRST_F = ['Люси','Мисти','Роза','Кей','Ана','Ингрид','Наташа','Валентина','Чжэнь','Эльвира','Юлия','Кара'];
const NAMES_LAST = ['Волков','дель Амор','Танака','Ортис','Стройский','Мак-Кензи','Фадера','Нгуен','Романо','Вю','Ковач','Сантос'];
const NICKS = ['Призрак','Гроза','Искра','Лезвие','Тиран','Феникс','Кобра','Серый','Нуар','Стек','Пуля','Колибри','Ворон','Ядро'];

const LS_KEY = 'cpr_sheets_v1';

/* ---------- состояние ---------- */
let char = null;          // текущий лист персонажа
let mode = 'random';      // random | table | lifepath

/* ============================================================
   СОЗДАНИЕ ПЕРСОНАЖА
   ============================================================ */

function findRoleArchetype(roleKey, archKey) {
  const role = CPR.ROLES.find(r => r.key === roleKey) || CPR.ROLES[0];
  const arch = role.archetypes.find(a => a.key === archKey) || role.archetypes[0];
  return { role, arch };
}

/* Атрибуты по архетипу роли (шаблоны Streetrat Templates, стр. 74–77).
   В данных лежат средние значения колонок шаблона (вещественные числа);
   здесь они округляются до целых с сохранением суммы (метод наибольших
   остатков), а Удача поднимается минимум до 5 — как требует книга. */
const ATTR_KEYS = ['cs','cn','co','d4','em','ia','ref','re','tech','lu'];
function roundAttrsKeepingSum(src) {
  const keys = Object.keys(src);
  const target = Math.round(keys.reduce((s, k) => s + src[k], 0));
  const base = {}, rem = [];
  keys.forEach(k => {
    base[k] = Math.floor(src[k]);
    rem.push({ k, frac: src[k] - base[k] });
  });
  let left = target - keys.reduce((s, k) => s + base[k], 0);
  rem.sort((x, y) => y.frac - x.frac || (x.k === 'lu' ? -1 : y.k === 'lu' ? 1 : 0));
  for (let i = 0; left > 0 && i < rem.length; i++, left--) base[rem[i].k]++;
  return base;
}
function attrsFromArchetype(arch) {
  if (arch.attrs) {                       // данные из таблиц книги (roles.js)
    const a = roundAttrsKeepingSum(arch.attrs);
    if (a.lu < 5) {                       // правило COREBOOK: Luck ≥ 5
      const donor = ATTR_KEYS.filter(k => k !== 'lu')
        .sort((x, y) => a[y] - a[x] || ((src[y] ?? a[y]) - Math.ceil(src[y])) - ((src[x] ?? a[x]) - Math.ceil(src[x])))[0];
      // забираем единицу у атрибута, чьё дробное значение ближе всех к полу
      const byFrac = ATTR_KEYS.filter(k => k !== 'lu')
        .sort((x, y) => (Math.ceil(arch.attrs[x]) - arch.attrs[x]) - (Math.ceil(arch.attrs[y]) - arch.attrs[y]));
      const d = byFrac.find(k => a[k] > 2) || donor;
      a[d]--; a.lu++;
    }
    const out = {};
    ATTR_KEYS.forEach(k => out[k] = a[k] != null ? a[k] : 4);
    return out;
  }
  // резервная схема point-buy (если у архетипа нет attrs)
  const a = {};
  (arch.focus || []).forEach((k, i) => a[k] = i === 0 ? 6 : 5);
  (arch.others || []).forEach(k => a[k] = k === 'lu' ? 2 : 4);
  return a;
}

/* Стартовые навыки: роль (rolePoints) + тип (typePoints) + происхождение */
function baseSkills(arch, bg) {
  const skills = {};
  CPR.SKILLS.forEach(s => skills[s.key] = 0);
  // ролевые навыки архетипа
  (arch.skills || []).forEach(([k, v]) => { if (skills[k] !== undefined) skills[k] += v; });
  // очки типа: раздаём случайно по категории
  const byType = {};
  CPR.SKILLS.forEach(s => (byType[s.type] = byType[s.type] || []).push(s.key));
  Object.entries(arch.typePoints || {}).forEach(([type, pts]) => {
    let left = pts;
    const pool = (byType[type] || []).concat(type === 'tech' ? [] : []);
    while (left > 0 && pool.length) {
      const k = pick(pool);
      if (skills[k] < 10) { skills[k]++; left--; }
    }
  });
  // происхождение (+2 к четырём навыкам)
  (bg.skills || []).forEach(([k, v]) => { if (skills[k] !== undefined) skills[k] += v; });
  return skills;
}

/* Очки навыков для «ручного» распределения поверх базы */
function extraSkillPool(char) {
  // оставшиеся очки: 27 общих очков навыков уровня 1 вычитаем уже розданные
  const used = Object.values(char.skills).reduce((s, v) => s + v, 0);
  return Math.max(0, char.budget - used);
}

function makeCharacter(opts = {}) {
  const role = opts.role || pick(CPR.ROLES);
  const arch = opts.arch || pick(role.archetypes);
  const bg = opts.bg || pick(CPR.BACKGROUNDS);

  const first = opts.name || (pick([...NAMES_FIRST_M, ...NAMES_FIRST_F]));
  const last = opts.lastname || pick(NAMES_LAST);
  const nickname = opts.nickname || pick(NICKS);

  const attrs = opts.attrs || attrsFromArchetype(arch);
  const skills = opts.skills || baseSkills(arch, bg);

  const c = {
    meta: {
      name: first, lastname: last, nickname,
      age: opts.age || (15 + d(20)),
      gender: opts.gender || pick(['М', 'Ж']),
      style: opts.style || pick(['Неоновый хаос','Киберпанк-гранж','Уличный шик','Корп-минимализм','Пустошный техно']) ,
      lucky: opts.lucky || pick(['Нет','Да','Очень']),
    },
    role: role.key, archetype: arch.key, background: bg.key,
    attrs, skills,
    budget: (arch.rolePoints || 0) + Object.values(arch.typePoints || {}).reduce((a, b) => a + b, 0) + 8 /* происхождение */,
    lifepath: opts.lifepath || null,
    credits: opts.credits != null ? opts.credits : bg.credits + 10 * d(10),
    gear: opts.gear || (CPR.STARTGEAR[role.key] || []).concat(bg.items || []),
    extras: opts.extras || arch.extras || [],
    preset: opts.preset || null,
    created: new Date().toISOString(),
    method: opts.method || 'table',
  };
  recomputeDerived(c);
  return c;
}

function recomputeDerived(c) {
  c.derived = {};
  CPR.DERIVED.forEach(dd => {
    try { c.derived[dd.key] = typeof dd.formula === 'function' ? dd.formula(c) : dd.formula; }
    catch (e) { c.derived[dd.key] = 0; }
  });
}

/* ---------- способ 1: СЛУЧАЙНО ---------- */
function genRandom(picks = {}) {
  // полностью случайный лист: роль, архетип, происхождение + жизненный путь на d6;
  // если пользователь что-то выбрал из выпадающих списков — используем его выбор
  const opts = { method: 'random', lifepath: rollLifePath(picks.lifepath || {}) };
  if (picks.role || picks.arch) {
    const { role, arch } = findRoleArchetype(picks.role, picks.arch);
    opts.role = role; opts.arch = arch;
  }
  if (picks.bg) {
    const bg = CPR.BACKGROUNDS.find(b => b.key === picks.bg);
    if (bg) opts.bg = bg;
  }
  return makeCharacter(opts);
}

/* ---------- способ 2: ПО РОЛЕВОЙ ТАБЛИЦЕ (point buy) ---------- */
function genTable(roleKey, archKey, bgKey, manualAttrs, manualSkills, nameParts) {
  const { role, arch } = findRoleArchetype(roleKey, archKey);
  const bg = CPR.BACKGROUNDS.find(b => b.key === bgKey) || pick(CPR.BACKGROUNDS);
  const opts = {
    role, arch, bg, method: 'table',
    attrs: manualAttrs || undefined,
    skills: manualSkills || undefined,
  };
  if (nameParts) Object.assign(opts, nameParts);
  return makeCharacter(opts);
}

/* ---------- способ 3: ЖИЗНЕННЫЙ ПУТЬ (Life Path) ---------- */
const LP_STEPS = [
  { key: 'attitude', label: 'Отношение к жизни', icon: '🎭' },
  { key: 'somethingValued', label: 'То, что вы цените выше всего', icon: '💖' },
  { key: 'somethingFear', label: 'То, чего вы боитесь', icon: '😱' },
  { key: 'somethingLost', label: 'То, что вы потеряли', icon: '💔' },
  { key: 'somethingForce', label: 'То, что заставляет вас вставать по утрам', icon: '🔥' },
  { key: 'people', label: 'Важный человек в вашей жизни', icon: '👤' },
];

function rollLifePath(prev = {}) {
  const lp = { ...prev };
  for (const st of LP_STEPS) {
    if (!lp[st.key]) lp[st.key] = { roll: d(6), text: CPR.LIFEPATH[st.key][d(6) - 1] };
  }
  return lp;
}

function genLifePath(lpRolls, picks = {}) {
  // жизненный путь определяет роль через сводную таблицу: берём случайную роль
  // (или выбранную пользователем), но все этапы пути кидаются честно на d6
  const lp = rollLifePath(lpRolls);
  const opts = { method: 'lifepath', lifepath: lp };
  if (picks.role || picks.arch) {
    const { role, arch } = findRoleArchetype(picks.role, picks.arch);
    opts.role = role; opts.arch = arch;
  }
  if (picks.bg) {
    const bg = CPR.BACKGROUNDS.find(b => b.key === picks.bg);
    if (bg) opts.bg = bg;
  }
  return makeCharacter(opts);
}

/* ---------- ГОТОВЫЕ ВАРИАНТЫ (пресеты): уличная крыса / эджраннер / полный пакет ---------- */
function distributeTypePoints(skills, typePoints) {
  // раздаёт оставшиеся очки типа случайно по категории (как baseSkills)
  const byType = {};
  CPR.SKILLS.forEach(s => (byType[s.type] = byType[s.type] || []).push(s.key));
  Object.entries(typePoints || {}).forEach(([type, pts]) => {
    let left = pts;
    const pool = byType[type] || [];
    while (left > 0 && pool.length) {
      const k = pick(pool);
      if (skills[k] < 10) { skills[k]++; left--; }
    }
  });
  return skills;
}

function genPreset(key) {
  const p = CPR.PRESETS.find(x => x.key === key);
  if (!p) return null;

  // «Полный пакет»: полная процедура книги игрока —
  // случайные роль/архетип/происхождение, полные очки навыков и полный Жизненный путь на d6
  if (p.fullLifePath) {
    return makeCharacter({ method: 'preset', preset: p.key, lifepath: rollLifePath({}) });
  }

  const { role, arch } = findRoleArchetype(p.role, p.archetype);
  const bg = CPR.BACKGROUNDS.find(b => b.key === p.background) || CPR.BACKGROUNDS[0];

  // базовые навыки пакета + добор очков типа поверх них
  const skills = {};
  CPR.SKILLS.forEach(s => skills[s.key] = 0);
  Object.entries(p.skills || {}).forEach(([k, v]) => { if (skills[k] !== undefined) skills[k] = v; });
  distributeTypePoints(skills, p.typePoints);

  return makeCharacter({
    role, arch, bg,
    attrs: p.attrs ? { ...p.attrs } : undefined,
    skills,
    gear: p.gear ? [...p.gear] : undefined,
    extras: p.extras ? [...p.extras] : undefined,
    credits: p.credits != null ? p.credits : undefined,
    lifepath: p.lifepath ? rollLifePath({}) : null,
    method: 'preset', preset: p.key,
  });
}

/* ============================================================
   РЕНДЕР ЛИСТА
   ============================================================ */

function skillGroups(c) {
  const groups = {};
  CPR.SKILLS.forEach(s => {
    const g = s.type;
    (groups[g] = groups[g] || []).push(s);
  });
  return groups;
}

function renderSheet() {
  if (!char) return;
  recomputeDerived(char);
  const root = $('#sheet');
  const role = CPR.ROLES.find(r => r.key === char.role);
  const arch = role.archetypes.find(a => a.key === char.archetype);
  const bg = CPR.BACKGROUNDS.find(b => b.key === char.background);

  const attrCells = CPR.ATTRS.map(a => `
    <div class="stat">
      <div class="stat-abbr">${a.abbr}</div>
      <div class="stat-val">${char.attrs[a.key]}</div>
      <div class="stat-name">${a.name}</div>
    </div>`).join('');

  const groups = skillGroups(char);
  const skillBlocks = Object.entries(groups).map(([type, list]) => {
    const rows = list.map(s => {
      const lvl = char.skills[s.key] || 0;
      const attr = CPR.attrByKey(s.attr);
      return `<tr class="${lvl ? '' : 'zero'}">
        <td>${s.name}</td>
        <td class="attr-tag">${attr ? attr.abbr : ''}</td>
        <td class="lvl">${lvl}</td>
        <td class="mod">${lvl ? '+' + lvl : '—'}</td>
      </tr>`;
    }).join('');
    return `<section class="skill-group">
      <h3>${CPR.TYPE_LABELS[type]}</h3>
      <table class="skills"><thead><tr><th>Навык</th><th>Атр.</th><th>Ур.</th><th>Мод.</th></tr></thead>
      <tbody>${rows}</tbody></table>
    </section>`;
  }).join('');

  const derivedRows = CPR.DERIVED.map(dd =>
    `<div class="dstat"><span>${dd.name}</span><b>${char.derived[dd.key]}</b></div>`).join('');

  const lifePath = char.lifepath ? `
    <section class="panel lifepath">
      <h2>Жизненный путь</h2>
      ${LP_STEPS.map(st => {
        const e = char.lifepath[st.key];
        return `<div class="lp-row"><span class="lp-icon">${st.icon}</span>
          <div><small>${st.label} (d6: ${e ? e.roll : '—'})</small><p>${e ? e.text : ''}</p></div></div>`;
      }).join('')}
    </section>` : '';

  root.innerHTML = `
  <article class="sheet-card">
    <header class="sheet-head">
      <div>
        <div class="kicker">CYBERPUNK RED • лист персонажа • уровень 1</div>
        <h1>${char.meta.nickname ? `«${char.meta.nickname}»` : ''} ${char.meta.name} ${char.meta.lastname}</h1>
        <div class="head-meta">
          <span>${role.name} — ${arch.name}</span><i>•</i>
          <span>Происхождение: ${bg.name}</span><i>•</i>
          <span>${char.meta.age} лет • ${char.meta.gender}</span><i>•</i>
          <span>€$ ${char.credits}</span>
        </div>
        <div class="head-style">Стиль: ${char.meta.style} • Везучий: ${char.meta.lucky}</div>
      </div>
      <div class="method-badge" title="Способ создания">${creationLabel(char)}</div>
    </header>

    <section class="panel">
      <h2>Атрибуты</h2>
      <div class="stats-grid">${attrCells}</div>
    </section>

    <section class="panel">
      <h2>Производные значения</h2>
      <div class="derived-grid">${derivedRows}</div>
    </section>

    <section class="panel">
      <h2>Навыки</h2>
      <div class="skills-wrap">${skillBlocks}</div>
    </section>

    <section class="panel two-col">
      <div>
        <h2>Особенности роли</h2>
        <ul class="list">${char.extras.map(x => `<li>${x}</li>`).join('') || '<li>—</li>'}</ul>
        <h2>Снаряжение</h2>
        <ul class="list">${char.gear.map(g => `<li>${g}</li>`).join('')}</ul>
      </div>
      <div>
        <h2>Происхождение</h2>
        <p class="muted">${bg.desc}</p>
        <h2>Контакты и связи</h2>
        <p class="muted">Связи: ${(char.skills.connection || 0)} • Реноме: ${Math.ceil((char.skills.connection || 0) / 2)}</p>
      </div>
    </section>

    ${lifePath}

    <footer class="sheet-foot">
      <span>Создан: ${new Date(char.created).toLocaleString('ru-RU')}</span>
      <span>Метод: ${creationLabel(char)}</span>
    </footer>
  </article>`;
}

function methodLabel(m) {
  return m === 'random' ? '🎲 Случайно' : m === 'table' ? '📋 Ролевая таблица' : '🛤 Жизненный путь';
}

/* подпись варианта создания: пресет или базовый способ */
function creationLabel(c) {
  if (c.preset) {
    const p = CPR.PRESETS.find(x => x.key === c.preset);
    if (p) return `${p.icon} ${p.name}`;
  }
  return methodLabel(c.method);
}

/* ============================================================
   ЭКСПОРТ JSON / XLSX
   ============================================================ */

function exportJSON() {
  if (!char) return;
  const blob = new Blob([JSON.stringify(char, null, 2)], { type: 'application/json' });
  downloadBlob(blob, `${slug()}.json`);
}

function xlsxSheets(c) {
  const role = CPR.ROLES.find(r => r.key === c.role);
  const arch = role.archetypes.find(a => a.key === c.archetype);
  const bg = CPR.BACKGROUNDS.find(b => b.key === c.background);

  const head = [];
  head.push([{ v: `CYBERPUNK RED — ${c.meta.nickname ? `«${c.meta.nickname}», ` : ''}${c.meta.name} ${c.meta.lastname}`, s: 'title' }]);
  head.push([{ v: `${role.name} (${arch.name}) • Происхождение: ${bg.name} • €$ ${c.credits}`, s: 'subtitle' }]);
  head.push([]);
  head.push([{ v: 'АТРИБУТЫ', s: 'header' }, { v: 'ЗНАЧЕНИЕ', s: 'header' }]);
  CPR.ATTRS.forEach(a => head.push([a.name, { v: c.attrs[a.key], s: 'num' }]));
  head.push([]);
  head.push([{ v: 'ПРОИЗВОДНЫЕ', s: 'header' }, { v: '', s: 'header' }]);
  CPR.DERIVED.forEach(dd => head.push([dd.name, { v: c.derived[dd.key], s: 'num' }]));

  const sk = [[{ v: 'КАТЕГОРИЯ', s: 'header' }, { v: 'НАВЫК', s: 'header' }, { v: 'АТРИБУТ', s: 'header' }, { v: 'РАНГ', s: 'header' }, { v: 'МОДИФИКАТОР', s: 'header' }]];
  const groups = skillGroups(c);
  Object.entries(groups).forEach(([type, list]) => {
    list.forEach(s => {
      const lvl = c.skills[s.key] || 0;
      sk.push([CPR.TYPE_LABELS[type], s.name, (CPR.attrByKey(s.attr) || {}).abbr || '', { v: lvl, s: 'borderNum' }, lvl ? '+' + lvl : '—']);
    });
  });

  const misc = [
    [{ v: 'ОСОБЕННОСТИ РОЛИ', s: 'header' }],
    ...c.extras.map(x => [x]),
    [],
    [{ v: 'СНАРЯЖЕНИЕ', s: 'header' }],
    ...c.gear.map(g => [g]),
  ];
  if (c.lifepath) {
    misc.push([], [{ v: 'ЖИЗНЕННЫЙ ПУТЬ', s: 'header' }]);
    LP_STEPS.forEach(st => {
      const e = c.lifepath[st.key];
      if (e) misc.push([`${st.label}: ${e.text}`]);
    });
  }

  return [
    { name: 'Лист персонажа', rows: head, widths: [34, 12] },
    { name: 'Навыки', rows: sk, widths: [24, 34, 10, 8, 12] },
    { name: 'Прочее', rows: misc, widths: [60] },
  ];
}

function exportXLSX() {
  if (!char) return;
  const blob = XLSXLite.toBlob(xlsxSheets(char));
  downloadBlob(blob, `${slug()}.xlsx`);
}

function slug() {
  const base = `${char.meta.nickname || char.meta.name}-${char.meta.lastname}`
    .replace(/[«»"\s]+/g, '_').replace(/[^A-Za-zА-Яа-яЁё0-9_]/g, '');
  return 'cpr_' + (base || 'character');
}

function downloadBlob(blob, filename) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
}

/* ============================================================
   ХРАНИЛИЩЕ (localStorage)
   ============================================================ */

function loadStore() { try { return JSON.parse(localStorage.getItem(LS_KEY)) || []; } catch (e) { return []; } }
function saveStore(list) { localStorage.setItem(LS_KEY, JSON.stringify(list)); }

function persistCurrent() {
  if (!char) return;
  const list = loadStore();
  const idx = list.findIndex(s => s.created === char.created);
  if (idx >= 0) list[idx] = char; else list.unshift(char);
  saveStore(list.slice(0, 30));
  renderSavedList();
}

function renderSavedList() {
  const box = $('#saved-list');
  const list = loadStore();
  if (!list.length) { box.innerHTML = '<p class="muted small">Пока пусто. Создайте персонажа и нажмите «Сохранить».</p>'; return; }
  box.innerHTML = list.map((s, i) => {
    const role = CPR.ROLES.find(r => r.key === s.role);
    return `<div class="saved-item" data-i="${i}">
      <div><b>${s.meta.nickname ? `«${s.meta.nickname}» ` : ''}${s.meta.name}</b>
      <small>${role ? role.name : '?'} • ${new Date(s.created).toLocaleString('ru-RU')}</small></div>
      <div class="saved-actions">
        <button class="btn tiny" data-act="load">Открыть</button>
        <button class="btn tiny danger" data-act="del">✕</button>
      </div></div>`;
  }).join('');
  box.querySelectorAll('.saved-item').forEach(el => {
    el.querySelector('[data-act="load"]').onclick = () => {
      char = loadStore()[+el.dataset.i];
      syncManualControls();
      renderSheet(); toast('Лист загружен');
    };
    el.querySelector('[data-act="del"]').onclick = () => {
      const l = loadStore(); l.splice(+el.dataset.i, 1); saveStore(l); renderSavedList();
    };
  });
}

/* ============================================================
   UI: СПОСОБЫ ГЕНЕРАЦИИ
   ============================================================ */

function switchMode(m) {
  mode = m;
  $$('.mode-tab').forEach(t => t.classList.toggle('active', t.dataset.mode === m));
  $$('.mode-panel').forEach(p => p.classList.toggle('hidden', p.dataset.panel !== m));
}

/* ---------- универсальный набор связанных дропдаунов (роль → архетип) ---------- */
function wirePickPair(roleSel, archSel, initRoleKey, initArchKey) {
  roleSel.innerHTML = CPR.ROLES.map(r => `<option value="${r.key}">${r.name}</option>`).join('');
  function fillArch(keep) {
    const role = CPR.ROLES.find(r => r.key === roleSel.value) || CPR.ROLES[0];
    archSel.innerHTML = role.archetypes.map(a => `<option value="${a.key}">${a.name}</option>`).join('');
    if (keep && role.archetypes.some(a => a.key === keep)) archSel.value = keep;
  }
  if (initRoleKey && CPR.ROLES.some(r => r.key === initRoleKey)) roleSel.value = initRoleKey;
  else roleSel.value = CPR.ROLES[0].key; // fallback для нестандартных окружений
  fillArch(initArchKey);
  roleSel.onchange = () => fillArch();
}

function buildTableControls() {
  const roleSel = $('#sel-role'), archSel = $('#sel-arch'), bgSel = $('#sel-bg');
  wirePickPair(roleSel, archSel);
  bgSel.innerHTML = CPR.BACKGROUNDS.map(b => `<option value="${b.key}">${b.name}</option>`).join('');
  if (!CPR.BACKGROUNDS.some(b => b.key === bgSel.value)) bgSel.value = CPR.BACKGROUNDS[0].key;

  function currentRole() {
    return CPR.ROLES.find(r => r.key === roleSel.value) || CPR.ROLES[0];
  }
  function showArchInfo() {
    const { role, arch } = findRoleArchetype(currentRole().key, archSel.value);
    const def = attrsFromArchetype(arch);
    const attrLine = CPR.ATTRS.map(a => `${a.abbr} ${def[a.key]}`).join(' · ');
    $('#arch-info').innerHTML = `
      <p><b>${role.name} — ${arch.name}.</b>${role.ability ? ` Особость: <b>${role.ability}</b>.` : ''}</p>
      <p class="muted small">Атрибуты шаблона роли (стр. 74–77): ${attrLine}.</p>
      <p class="muted small">Ролевые навыки: ${(arch.skills || []).map(([k, v]) => `${(CPR.skillByKey(k) || {}).name || k} +${v}`).join(', ') || '—'}.</p>
      <p class="muted small">Очки навыков по категориям: ${Object.entries(arch.typePoints).map(([t, p]) => `${CPR.TYPE_LABELS[t]}: ${p}`).join('; ')}.</p>`;
  }
  // при смене роли/архетипа/происхождения — обновляем справку и ручные редакторы
  roleSel.onchange = () => { showArchInfo(); refreshManualEditors(); };
  archSel.onchange = () => { showArchInfo(); refreshManualEditors(); };
  bgSel.onchange = refreshManualEditors;
  showArchInfo();
}

/* ---------- другие панели: «Случайно» и «Жизненный путь» тоже с выбором ---------- */
function buildPickPanels() {
  wirePickPair($('#rnd-role'), $('#rnd-arch'));
  wirePickPair($('#lp-role'), $('#lp-arch'));
  [$('#rnd-bg'), $('#lp-bg')].forEach(bgSel => {
    bgSel.innerHTML = CPR.BACKGROUNDS.map(b => `<option value="${b.key}">${b.name}</option>`).join('');
    if (!CPR.BACKGROUNDS.some(b => b.key === bgSel.value)) bgSel.value = CPR.BACKGROUNDS[0].key;
  });
}

/* ---------- ручные атрибуты и навыки (способ 2, раскрывающийся блок) ---------- */
let manualAttrs = null;   // { key: value } | null — null значит «по таблице»
let manualSkills = null;  // { key: level } | null

function defaultAttrsForSelection() {
  const { arch } = findRoleArchetype($('#sel-role').value, $('#sel-arch').value);
  return attrsFromArchetype(arch);
}
function defaultSkillsForSelection() {
  const { arch } = findRoleArchetype($('#sel-role').value, $('#sel-arch').value);
  const bg = CPR.BACKGROUNDS.find(b => b.key === $('#sel-bg').value) || CPR.BACKGROUNDS[0];
  return baseSkills(arch, bg);
}

function buildManualEditors() {
  const attrBox = $('#attr-grid');
  attrBox.innerHTML = CPR.ATTRS.map(a => `
    <label class="attr-cell" title="${a.name}">
      <span>${a.abbr}</span>
      <select data-attr="${a.key}"></select>
    </label>`).join('');
  attrBox.querySelectorAll('[data-attr]').forEach(sel => {
    sel.innerHTML = [1,2,3,4,5,6,7,8,9,10].map(v => `<option value="${v}">${v}</option>`).join('');
    sel.onchange = () => { readManualAttrs(); updateSkillEditorHeads(); };
  });

  const skillBox = $('#skill-editor');
  skillBox.innerHTML = CPR.SKILLS.map(s => `
    <label class="skill-cell">
      <span class="skill-cell-name">${s.name} <i class="attr-tag">${(CPR.attrByKey(s.attr)||{}).abbr||''}</i></span>
      <select data-skill="${s.key}"></select>
    </label>`).join('');
  skillBox.querySelectorAll('[data-skill]').forEach(sel => {
    sel.innerHTML = Array.from({ length: 11 }, (_, v) => `<option value="${v}">${v}</option>`).join('');
    sel.onchange = readManualSkills;
  });
  refreshManualEditors();
}

function refreshManualEditors() {
  if (!$('#attr-grid') || !$('#attr-grid').children.length) return;
  const attrs = manualAttrs || defaultAttrsForSelection();
  Object.entries(attrs).forEach(([k, v]) => {
    const sel = $(`#attr-grid [data-attr="${k}"]`);
    if (sel) sel.value = String(Math.min(10, Math.max(1, v)));
  });
  const skills = manualSkills || defaultSkillsForSelection();
  Object.entries(skills).forEach(([k, v]) => {
    const sel = $(`#skill-editor [data-skill="${k}"]`);
    if (sel) sel.value = String(Math.min(10, Math.max(0, v)));
  });
  updateSkillEditorHeads();
}

function readManualAttrs() {
  const a = {};
  $$('#attr-grid [data-attr]').forEach(sel => { a[sel.dataset.attr] = +sel.value; });
  manualAttrs = a;
}
function readManualSkills() {
  const s = {};
  $$('#skill-editor [data-skill]').forEach(sel => { s[sel.dataset.skill] = +sel.value; });
  manualSkills = s;
}
function updateSkillEditorHeads() { /* запасная точка расширения */ }

function resetManualEditors() {
  manualAttrs = null; manualSkills = null;
  refreshManualEditors();
}

function buildLPControls() {
  const box = $('#lp-steps');
  box.innerHTML = LP_STEPS.map(st => `
    <div class="lp-step" data-key="${st.key}">
      <div class="lp-step-label">${st.icon} ${st.label}</div>
      <select class="lp-pick" data-pick="${st.key}" title="Выбрать вариант из таблицы"></select>
      <button class="btn tiny" data-roll="${st.key}">🎲 Бросить d6</button>
    </div>`).join('');
  // заполняем дропдауны вариантами таблиц жизненного пути (d6)
  box.querySelectorAll('[data-pick]').forEach(sel => {
    const key = sel.dataset.pick;
    sel.innerHTML = `<option value="">— не брошено —</option>` +
      CPR.LIFEPATH[key].map((t, i) => `<option value="${i + 1}">${i + 1}: ${t}</option>`).join('');
    sel.onchange = () => setLpStep(key, sel.value ? +sel.value : null, false);
  });
  box.querySelectorAll('[data-roll]').forEach(b => {
    b.onclick = () => {
      const key = b.dataset.roll;
      setLpStep(key, d(6), true);
    };
  });
  $('#lp-all').onclick = () => {
    box.querySelectorAll('[data-roll]').forEach(b => b.onclick({}));
  };
}

/* установить/бросить этап пути: roll=null сбрасывает этап */
function setLpStep(key, roll, isRandom) {
  const el = $(`#lp-steps .lp-step[data-key="${key}"]`);
  window.__lp = window.__lp || {};
  const sel = el.querySelector('[data-pick]');
  if (roll == null) {
    delete window.__lp[key];
    sel.value = '';
    el.classList.remove('rolled');
    return;
  }
  const txt = CPR.LIFEPATH[key][roll - 1];
  window.__lp[key] = { roll, text: txt };
  sel.value = String(roll);
  el.classList.add('rolled');
  if (isRandom) toast(`d6 = ${roll}`);
}

function picksFromControls(panelMode) {
  // собираем выбор пользователя из выпадающих списков активной панели
  if (panelMode === 'random') {
    return { role: $('#rnd-role').value, arch: $('#rnd-arch').value, bg: $('#rnd-bg').value };
  }
  if (panelMode === 'lifepath') {
    return { role: $('#lp-role').value, arch: $('#lp-arch').value, bg: $('#lp-bg').value };
  }
  return null;
}

function generate() {
  if (mode === 'random') {
    char = genRandom(Object.assign(picksFromControls('random'), { lifepath: window.__lp || {} }));
  } else if (mode === 'table') {
    char = genTable($('#sel-role').value, $('#sel-arch').value, $('#sel-bg').value,
      manualAttrs || undefined, manualSkills || undefined);
  } else {
    char = genLifePath(window.__lp || {}, picksFromControls('lifepath'));
  }
  renderSheet();
  persistCurrent();
  toast('Персонаж создан (' + creationLabel(char) + ')');
}

/* ---------- генерация по готовому варианту (пресету) ---------- */
let activePreset = null;

function generatePreset(key) {
  const p = CPR.PRESETS.find(x => x.key === key);
  if (!p) return;
  char = genPreset(key);
  activePreset = key;
  // пакет создан «под ключ» — ручной point-buy больше не активен
  manualAttrs = null; manualSkills = null;
  $$('.preset-card').forEach(c => c.classList.toggle('active', c.dataset.preset === key));
  renderSheet();
  persistCurrent();
  syncManualControls();
  toast('Вариант «' + p.name + '» создан');
}

function buildPresetControls() {
  const box = $('#preset-list');
  box.innerHTML = CPR.PRESETS.map(p => `
    <button class="preset-card" data-preset="${p.key}" type="button">
      <div class="preset-head">
        <span class="preset-icon">${p.icon}</span>
        <span class="preset-name">${p.name}</span>
        <span class="preset-tagline">${p.tagline}</span>
      </div>
      <p class="preset-desc">${p.desc}</p>
    </button>`).join('');
  box.querySelectorAll('.preset-card').forEach(el => {
    el.onclick = () => generatePreset(el.dataset.preset);
  });
}

function reroll() { generate(); }

/* синхронизация контролов с загруженным персонажем */
function syncManualControls() {
  if (!char) return;
  // панель «Ролевая таблица»
  $('#sel-role').value = char.role;
  $('#sel-role').dispatchEvent(new Event('change'));
  $('#sel-arch').value = char.archetype;
  $('#sel-bg').value = char.background;
  refreshManualEditors();
  // панели «Случайно» и «Жизненный путь»
  $('#rnd-role').value = char.role;
  $('#rnd-role').dispatchEvent(new Event('change'));
  $('#rnd-arch').value = char.archetype;
  $('#rnd-bg').value = char.background;
  $('#lp-role').value = char.role;
  $('#lp-role').dispatchEvent(new Event('change'));
  $('#lp-arch').value = char.archetype;
  $('#lp-bg').value = char.background;
  // отражаем Жизненный путь персонажа в дропдаунах этапов
  if (char.lifepath) {
    LP_STEPS.forEach(st => {
      const e = char.lifepath[st.key];
      if (e && e.roll) setLpStep(st.key, e.roll, false);
    });
  }
}

/* ---------- toasts ---------- */
let toastTimer = null;
function toast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2200);
}

/* ============================================================
   INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  buildTableControls();
  buildPickPanels();
  buildLPControls();
  buildManualEditors();
  buildPresetControls();
  renderSavedList();
  switchMode('random');
  generate();

  $$('.mode-tab').forEach(t => t.onclick = () => switchMode(t.dataset.mode));
  $('#btn-generate').onclick = generate;
  $('#btn-reroll').onclick = reroll;
  $('#btn-json').onclick = exportJSON;
  $('#btn-xlsx').onclick = exportXLSX;
  $('#btn-save').onclick = () => { persistCurrent(); toast('Сохранено в браузере'); };
});
