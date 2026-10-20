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

/* Атрибуты по архетипу роли (ролевая таблица книги):
   focus → 6 и 5; others → 4; LU → 2 */
function attrsFromArchetype(arch) {
  const a = {};
  arch.focus.forEach((k, i) => a[k] = i === 0 ? 6 : 5);
  arch.others.forEach(k => a[k] = k === 'lu' ? 2 : 4);
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
    credits: bg.credits + 10 * d(10),
    gear: (CPR.STARTGEAR[role.key] || []).concat(bg.items || []),
    extras: arch.extras || [],
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
function genRandom() {
  // полностью случайный лист: роль, архетип, происхождение + жизненный путь на d6
  return makeCharacter({ method: 'random', lifepath: rollLifePath({}) });
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

function genLifePath(lpRolls) {
  // жизненный путь определяет роль через сводную таблицу: берём случайную роль,
  // но все этапы пути кидаются честно на d6
  const lp = rollLifePath(lpRolls);
  const c = makeCharacter({ method: 'lifepath', lifepath: lp });
  return c;
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
      <div class="method-badge" title="Способ создания">${methodLabel(char.method)}</div>
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
      <span>Метод: ${methodLabel(char.method)}</span>
    </footer>
  </article>`;
}

function methodLabel(m) {
  return m === 'random' ? '🎲 Случайно' : m === 'table' ? '📋 Ролевая таблица' : '🛤 Жизненный путь';
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

function buildTableControls() {
  const roleSel = $('#sel-role'), archSel = $('#sel-arch'), bgSel = $('#sel-bg');
  roleSel.innerHTML = CPR.ROLES.map(r => `<option value="${r.key}">${r.name}</option>`).join('');
  if (!roleSel.value) roleSel.value = CPR.ROLES[0].key; // fallback для нестандартных окружений
  function currentRole() {
    return CPR.ROLES.find(r => r.key === roleSel.value) || CPR.ROLES[0];
  }
  function fillArch() {
    const role = currentRole();
    archSel.innerHTML = role.archetypes.map(a => `<option value="${a.key}">${a.name}</option>`).join('');
    if (!role.archetypes.some(a => a.key === archSel.value)) archSel.value = role.archetypes[0].key;
    showArchInfo();
  }
  roleSel.onchange = fillArch;
  archSel.onchange = showArchInfo;
  bgSel.innerHTML = CPR.BACKGROUNDS.map(b => `<option value="${b.key}">${b.name}</option>`).join('');
  if (!CPR.BACKGROUNDS.some(b => b.key === bgSel.value)) bgSel.value = CPR.BACKGROUNDS[0].key;
  fillArch();

  function showArchInfo() {
    const { role, arch } = findRoleArchetype(currentRole().key, archSel.value);
    $('#arch-info').innerHTML = `
      <p><b>${role.name} — ${arch.name}.</b> Ключевые атрибуты:
      ${arch.focus.map(k => CPR.attrByKey(k).name).join(' и ')} → <b>6</b> и <b>5</b>;
      остальные → <b>4</b>, Удача → <b>2</b>.</p>
      <p class="muted small">Ролевые навыки: ${arch.skills.map(([k, v]) => `${CPR.skillByKey(k).name} +${v}`).join(', ') || '—'}.</p>
      <p class="muted small">Очки навыков по категориям: ${Object.entries(arch.typePoints).map(([t, p]) => `${CPR.TYPE_LABELS[t]}: ${p}`).join('; ')}.</p>`;
  }
}

function buildLPControls() {
  const box = $('#lp-steps');
  box.innerHTML = LP_STEPS.map(st => `
    <div class="lp-step" data-key="${st.key}">
      <div class="lp-step-label">${st.icon} ${st.label}</div>
      <div class="lp-step-value"><span class="roll">—</span><span class="text muted">не брошено</span></div>
      <button class="btn tiny" data-roll="${st.key}">Бросить d6</button>
    </div>`).join('');
  box.querySelectorAll('[data-roll]').forEach(b => {
    b.onclick = () => {
      const key = b.dataset.roll;
      const r = d(6);
      const txt = CPR.LIFEPATH[key][r - 1];
      const el = b.closest('.lp-step');
      el.querySelector('.roll').textContent = `d6 = ${r}`;
      el.querySelector('.text').textContent = txt;
      el.classList.add('rolled');
      window.__lp = window.__lp || {};
      window.__lp[key] = { roll: r, text: txt };
    };
  });
  $('#lp-all').onclick = () => {
    box.querySelectorAll('[data-roll]').forEach(b => b.onclick({}));
  };
}

function generate() {
  if (mode === 'random') {
    char = genRandom();
  } else if (mode === 'table') {
    char = genTable($('#sel-role').value, $('#sel-arch').value, $('#sel-bg').value);
  } else {
    const lp = rollLifePath(window.__lp || {});
    char = genLifePath(lp);
  }
  renderSheet();
  persistCurrent();
  toast('Персонаж создан (' + methodLabel(char.method) + ')');
}

function reroll() { generate(); }

/* синхронизация контролов с загруженным персонажем */
function syncManualControls() {
  if (!char) return;
  if (mode === 'table') {
    $('#sel-role').value = char.role;
    $('#sel-role').dispatchEvent(new Event('change'));
    $('#sel-arch').value = char.archetype;
    $('#sel-bg').value = char.background;
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
  buildLPControls();
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
