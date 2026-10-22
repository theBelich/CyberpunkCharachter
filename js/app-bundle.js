// ============================================================
// Cyberpunk RED — генератор персонажей: ЕДИНСТВЕННЫЙ скрипт страницы.
//
// Почему один файл и без ES-модулей: <script type="module"> в Chrome
// запрещает загружать модули по протоколу file:// (CORS-политика),
// поэтому страница, открытая двойным кликом, «не работала». Здесь весь
// код — обычный (classic) скрипт: он работает и по file://, и по http(s)://
// во всех браузерах (Chrome, Firefox, Safari, Edge, Opera).
//
// Собран автоматически из исходных модулей — НЕ РЕДАКТИРУЙТЕ ВРУЧНУЮ.
// Исходники: src/roles/*.js, data/skills.js, js/exporters.js, js/app.js.
// Пересборка: node tools/bundle.mjs
// ============================================================

"use strict";

/* ------------------------------------------------------------
   [1] РОЛИ — src/roles/*.js (Core Rulebook, стр. 74–77)
   ------------------------------------------------------------ */
const ROLE_DATA = {
  solo: {
  role: "Solo",
  statsOrder: ["INT","REF","DEX","TECH","COOL","WILL","LUCK","MOVE","BODY","EMP"],
  // Метод #1 «Streetrat» (шаблоны): бросок 1d10 → берём строку таблицы
  statTemplates: [
    { roll: 1,  INT: 6, REF: 7, DEX: 7, TECH: 3, COOL: 8, WILL: 6, LUCK: 5, MOVE: 5, BODY: 6, EMP: 5 },
    { roll: 2,  INT: 7, REF: 8, DEX: 6, TECH: 3, COOL: 6, WILL: 6, LUCK: 7, MOVE: 5, BODY: 6, EMP: 6 },
    { roll: 3,  INT: 5, REF: 8, DEX: 7, TECH: 4, COOL: 7, WILL: 7, LUCK: 6, MOVE: 7, BODY: 8, EMP: 5 },
    { roll: 4,  INT: 5, REF: 8, DEX: 6, TECH: 4, COOL: 6, WILL: 7, LUCK: 6, MOVE: 5, BODY: 7, EMP: 6 },
    { roll: 5,  INT: 6, REF: 6, DEX: 7, TECH: 5, COOL: 7, WILL: 6, LUCK: 7, MOVE: 6, BODY: 8, EMP: 4 },
    { roll: 6,  INT: 7, REF: 7, DEX: 6, TECH: 5, COOL: 7, WILL: 6, LUCK: 6, MOVE: 7, BODY: 7, EMP: 5 },
    { roll: 7,  INT: 7, REF: 7, DEX: 6, TECH: 5, COOL: 6, WILL: 7, LUCK: 7, MOVE: 6, BODY: 6, EMP: 6 },
    { roll: 8,  INT: 7, REF: 8, DEX: 7, TECH: 5, COOL: 6, WILL: 6, LUCK: 5, MOVE: 6, BODY: 8, EMP: 4 },
    { roll: 9,  INT: 7, REF: 7, DEX: 6, TECH: 4, COOL: 6, WILL: 6, LUCK: 6, MOVE: 5, BODY: 6, EMP: 5 },
    { roll: 10, INT: 6, REF: 6, DEX: 8, TECH: 5, COOL: 6, WILL: 6, LUCK: 5, MOVE: 6, BODY: 6, EMP: 5 }
  ],
  // Метод #2 «Edgerunner»: список навыков роли (86 очков, мин 2 / макс 6; базовые ≥2)
  skills: [
    "Athletics","Brawling","Concentration","Conversation","Education","Evasion",
    "First Aid","Human Perception","Language (Streetslang)","Local Expert (Your Home)",
    "Perception","Persuasion","Stealth",
    "Autofire (x2)","Handgun","Interrogation","Melee Weapon","Resist Torture/Drugs",
    "Shoulder Arms","Tactics"
  ]
},
  netrunner: {
  role: "Netrunner",
  statsOrder: ["INT","REF","DEX","TECH","COOL","WILL","LUCK","MOVE","BODY","EMP"],
  // Метод #1 «Streetrat» (шаблоны): бросок 1d10 → берём строку таблицы
  statTemplates: [
    { roll: 1,  INT: 5, REF: 8, DEX: 7, TECH: 7, COOL: 7, WILL: 4, LUCK: 8, MOVE: 7, BODY: 7, EMP: 4 },
    { roll: 2,  INT: 5, REF: 6, DEX: 7, TECH: 5, COOL: 8, WILL: 3, LUCK: 8, MOVE: 7, BODY: 5, EMP: 5 },
    { roll: 3,  INT: 5, REF: 6, DEX: 8, TECH: 6, COOL: 6, WILL: 4, LUCK: 7, MOVE: 6, BODY: 7, EMP: 4 },
    { roll: 4,  INT: 5, REF: 7, DEX: 7, TECH: 7, COOL: 7, WILL: 5, LUCK: 8, MOVE: 6, BODY: 5, EMP: 5 },
    { roll: 5,  INT: 5, REF: 8, DEX: 8, TECH: 5, COOL: 7, WILL: 3, LUCK: 7, MOVE: 5, BODY: 5, EMP: 6 },
    { roll: 6,  INT: 6, REF: 6, DEX: 6, TECH: 7, COOL: 8, WILL: 4, LUCK: 7, MOVE: 7, BODY: 6, EMP: 6 },
    { roll: 7,  INT: 6, REF: 6, DEX: 6, TECH: 7, COOL: 6, WILL: 5, LUCK: 7, MOVE: 7, BODY: 7, EMP: 6 },
    { roll: 8,  INT: 5, REF: 7, DEX: 8, TECH: 6, COOL: 8, WILL: 4, LUCK: 8, MOVE: 5, BODY: 7, EMP: 4 },
    { roll: 9,  INT: 7, REF: 6, DEX: 7, TECH: 7, COOL: 6, WILL: 3, LUCK: 6, MOVE: 5, BODY: 6, EMP: 5 },
    { roll: 10, INT: 7, REF: 8, DEX: 6, TECH: 6, COOL: 6, WILL: 4, LUCK: 7, MOVE: 7, BODY: 5, EMP: 6 }
  ],
  // Метод #2 «Edgerunner»: список навыков роли (86 очков, мин 2 / макс 6; базовые ≥2)
  skills: [
    "Athletics","Brawling","Concentration","Conversation","Education","Evasion",
    "First Aid","Human Perception","Language (Streetslang)","Local Expert (Your Home)",
    "Perception","Persuasion","Stealth",
    "Basic Tech","Conceal/Reveal Object","Cryptography","Cybertech",
    "Electronics/Security Tech (x2)","Handgun","Library Search"
  ]
},
  rockerboy: {
  role: "Rockerboy",
  statsOrder: ["INT","REF","DEX","TECH","COOL","WILL","LUCK","MOVE","BODY","EMP"],
  // Метод #1 «Streetrat» (шаблоны): бросок 1d10 → берём строку таблицы
  statTemplates: [
    { roll: 1,  INT: 7, REF: 6, DEX: 6, TECH: 5, COOL: 6, WILL: 8, LUCK: 7, MOVE: 7, BODY: 3, EMP: 8 },
    { roll: 2,  INT: 3, REF: 7, DEX: 7, TECH: 7, COOL: 7, WILL: 6, LUCK: 7, MOVE: 7, BODY: 5, EMP: 8 },
    { roll: 3,  INT: 4, REF: 5, DEX: 7, TECH: 7, COOL: 6, WILL: 6, LUCK: 7, MOVE: 7, BODY: 5, EMP: 8 },
    { roll: 4,  INT: 4, REF: 5, DEX: 7, TECH: 7, COOL: 6, WILL: 8, LUCK: 7, MOVE: 6, BODY: 3, EMP: 8 },
    { roll: 5,  INT: 3, REF: 7, DEX: 7, TECH: 7, COOL: 6, WILL: 8, LUCK: 6, MOVE: 5, BODY: 4, EMP: 7 },
    { roll: 6,  INT: 5, REF: 6, DEX: 7, TECH: 5, COOL: 7, WILL: 8, LUCK: 5, MOVE: 7, BODY: 3, EMP: 7 },
    { roll: 7,  INT: 5, REF: 6, DEX: 6, TECH: 7, COOL: 7, WILL: 8, LUCK: 7, MOVE: 6, BODY: 3, EMP: 6 },
    { roll: 8,  INT: 5, REF: 7, DEX: 7, TECH: 5, COOL: 6, WILL: 6, LUCK: 6, MOVE: 6, BODY: 4, EMP: 8 },
    { roll: 9,  INT: 3, REF: 5, DEX: 5, TECH: 6, COOL: 7, WILL: 8, LUCK: 7, MOVE: 5, BODY: 5, EMP: 7 },
    { roll: 10, INT: 4, REF: 5, DEX: 6, TECH: 5, COOL: 8, WILL: 8, LUCK: 7, MOVE: 6, BODY: 4, EMP: 7 }
  ],
  // Метод #2 «Edgerunner»: список навыков роли (86 очков, мин 2 / макс 6; базовые ≥2)
  skills: [
    "Athletics","Brawling","Concentration","Conversation","Education","Evasion",
    "First Aid","Human Perception","Language (Streetslang)","Local Expert (Your Home)",
    "Perception","Persuasion","Stealth",
    "Composition","Handgun","Melee Weapon","Personal Grooming","Play Instrument (choose 1)",
    "Streetwise","Wardrobe & Style"
  ]
},
  nomad: {
  role: "Nomad",
  statsOrder: ["INT","REF","DEX","TECH","COOL","WILL","LUCK","MOVE","BODY","EMP"],
  // Метод #1 «Streetrat» (шаблоны): бросок 1d10 → берём строку таблицы
  statTemplates: [
    { roll: 1,  INT: 6, REF: 6, DEX: 8, TECH: 3, COOL: 6, WILL: 7, LUCK: 6, MOVE: 6, BODY: 6, EMP: 4 },
    { roll: 2,  INT: 5, REF: 7, DEX: 6, TECH: 5, COOL: 8, WILL: 8, LUCK: 8, MOVE: 7, BODY: 5, EMP: 4 },
    { roll: 3,  INT: 5, REF: 8, DEX: 6, TECH: 3, COOL: 8, WILL: 7, LUCK: 6, MOVE: 5, BODY: 6, EMP: 5 },
    { roll: 4,  INT: 5, REF: 8, DEX: 7, TECH: 4, COOL: 8, WILL: 6, LUCK: 7, MOVE: 7, BODY: 7, EMP: 5 },
    { roll: 5,  INT: 6, REF: 6, DEX: 6, TECH: 3, COOL: 6, WILL: 7, LUCK: 6, MOVE: 7, BODY: 7, EMP: 4 },
    { roll: 6,  INT: 7, REF: 6, DEX: 8, TECH: 4, COOL: 6, WILL: 7, LUCK: 6, MOVE: 5, BODY: 6, EMP: 5 },
    { roll: 7,  INT: 6, REF: 7, DEX: 8, TECH: 4, COOL: 6, WILL: 6, LUCK: 7, MOVE: 5, BODY: 7, EMP: 5 },
    { roll: 8,  INT: 5, REF: 7, DEX: 8, TECH: 3, COOL: 8, WILL: 6, LUCK: 7, MOVE: 5, BODY: 5, EMP: 5 },
    { roll: 9,  INT: 6, REF: 7, DEX: 6, TECH: 4, COOL: 8, WILL: 6, LUCK: 6, MOVE: 6, BODY: 6, EMP: 6 },
    { roll: 10, INT: 5, REF: 6, DEX: 7, TECH: 4, COOL: 7, WILL: 8, LUCK: 7, MOVE: 7, BODY: 7, EMP: 4 }
  ],
  // Метод #2 «Edgerunner»: список навыков роли (86 очков, мин 2 / макс 6; базовые ≥2)
  skills: [
    "Athletics","Brawling","Concentration","Conversation","Education","Evasion",
    "First Aid","Human Perception","Language (Streetslang)","Local Expert (Your Home)",
    "Perception","Persuasion","Stealth",
    "Animal Handling","Drive Land Vehicle","Handgun","Melee Weapon","Tracking",
    "Trading","Wilderness Survival"
  ]
},
  fixer: {
  role: "Fixer",
  statsOrder: ["INT","REF","DEX","TECH","COOL","WILL","LUCK","MOVE","BODY","EMP"],
  // Метод #1 «Streetrat» (шаблоны): бросок 1d10 → берём строку таблицы
  statTemplates: [
    { roll: 1,  INT: 8, REF: 5, DEX: 7, TECH: 4, COOL: 6, WILL: 5, LUCK: 8, MOVE: 5, BODY: 5, EMP: 8 },
    { roll: 2,  INT: 8, REF: 5, DEX: 5, TECH: 5, COOL: 6, WILL: 7, LUCK: 8, MOVE: 7, BODY: 5, EMP: 7 },
    { roll: 3,  INT: 6, REF: 6, DEX: 6, TECH: 4, COOL: 5, WILL: 6, LUCK: 8, MOVE: 6, BODY: 3, EMP: 8 },
    { roll: 4,  INT: 7, REF: 7, DEX: 5, TECH: 5, COOL: 7, WILL: 6, LUCK: 7, MOVE: 7, BODY: 5, EMP: 8 },
    { roll: 5,  INT: 8, REF: 6, DEX: 6, TECH: 3, COOL: 6, WILL: 5, LUCK: 8, MOVE: 7, BODY: 5, EMP: 6 },
    { roll: 6,  INT: 8, REF: 7, DEX: 5, TECH: 5, COOL: 6, WILL: 7, LUCK: 7, MOVE: 5, BODY: 3, EMP: 6 },
    { roll: 7,  INT: 8, REF: 6, DEX: 6, TECH: 5, COOL: 6, WILL: 5, LUCK: 6, MOVE: 7, BODY: 5, EMP: 8 },
    { roll: 8,  INT: 6, REF: 6, DEX: 7, TECH: 4, COOL: 7, WILL: 6, LUCK: 7, MOVE: 7, BODY: 4, EMP: 7 },
    { roll: 9,  INT: 8, REF: 7, DEX: 7, TECH: 5, COOL: 5, WILL: 5, LUCK: 7, MOVE: 6, BODY: 5, EMP: 7 },
    { roll: 10, INT: 6, REF: 5, DEX: 6, TECH: 5, COOL: 5, WILL: 6, LUCK: 8, MOVE: 6, BODY: 4, EMP: 7 }
  ],
  // Метод #2 «Edgerunner»: список навыков роли (86 очков, мин 2 / макс 6; базовые ≥2)
  skills: [
    "Athletics","Brawling","Concentration","Conversation","Education","Evasion",
    "First Aid","Human Perception","Language (Streetslang)","Local Expert (Your Home)",
    "Perception","Persuasion","Stealth",
    "Bribery","Business","Forgery","Handgun",
    "Pick Lock","Streetwise","Trading"
  ]
},
  tech: {
  role: "Tech",
  statsOrder: ["INT","REF","DEX","TECH","COOL","WILL","LUCK","MOVE","BODY","EMP"],
  // Метод #1 «Streetrat» (шаблоны): бросок 1d10 → берём строку таблицы
  statTemplates: [
    { roll: 1,  INT: 6, REF: 7, DEX: 7, TECH: 8, COOL: 4, WILL: 4, LUCK: 5, MOVE: 5, BODY: 7, EMP: 6 },
    { roll: 2,  INT: 7, REF: 6, DEX: 6, TECH: 7, COOL: 5, WILL: 3, LUCK: 7, MOVE: 7, BODY: 5, EMP: 5 },
    { roll: 3,  INT: 8, REF: 6, DEX: 5, TECH: 7, COOL: 5, WILL: 4, LUCK: 7, MOVE: 7, BODY: 5, EMP: 7 },
    { roll: 4,  INT: 7, REF: 8, DEX: 7, TECH: 8, COOL: 4, WILL: 4, LUCK: 6, MOVE: 5, BODY: 6, EMP: 7 },
    { roll: 5,  INT: 6, REF: 6, DEX: 7, TECH: 6, COOL: 4, WILL: 3, LUCK: 7, MOVE: 7, BODY: 6, EMP: 6 },
    { roll: 6,  INT: 8, REF: 7, DEX: 5, TECH: 6, COOL: 3, WILL: 3, LUCK: 7, MOVE: 6, BODY: 6, EMP: 7 },
    { roll: 7,  INT: 8, REF: 6, DEX: 7, TECH: 8, COOL: 4, WILL: 4, LUCK: 7, MOVE: 6, BODY: 7, EMP: 6 },
    { roll: 8,  INT: 8, REF: 8, DEX: 7, TECH: 8, COOL: 5, WILL: 4, LUCK: 6, MOVE: 5, BODY: 6, EMP: 6 },
    { roll: 9,  INT: 6, REF: 6, DEX: 7, TECH: 8, COOL: 3, WILL: 3, LUCK: 5, MOVE: 7, BODY: 7, EMP: 7 },
    { roll: 10, INT: 8, REF: 8, DEX: 5, TECH: 6, COOL: 4, WILL: 4, LUCK: 6, MOVE: 5, BODY: 6, EMP: 6 }
  ],
  // Метод #2 «Edgerunner»: список навыков роли (86 очков, мин 2 / макс 6; базовые ≥2)
  skills: [
    "Athletics","Brawling","Concentration","Conversation","Education","Evasion",
    "First Aid","Human Perception","Language (Streetslang)","Local Expert (Your Home)",
    "Perception","Persuasion","Stealth",
    "Basic Tech","Cybertech","Electronics/Security Tech (x2)","Land Vehicle Tech",
    "Shoulder Arms","Science (choose 1)","Weaponstech"
  ]
},
  medtech: {
  role: "Medtech",
  statsOrder: ["INT","REF","DEX","TECH","COOL","WILL","LUCK","MOVE","BODY","EMP"],
  // Метод #1 «Streetrat» (шаблоны): бросок 1d10 → берём строку таблицы
  statTemplates: [
    { roll: 1,  INT: 7, REF: 5, DEX: 6, TECH: 7, COOL: 5, WILL: 3, LUCK: 8, MOVE: 5, BODY: 5, EMP: 7 },
    { roll: 2,  INT: 6, REF: 7, DEX: 7, TECH: 7, COOL: 4, WILL: 4, LUCK: 6, MOVE: 7, BODY: 7, EMP: 7 },
    { roll: 3,  INT: 6, REF: 5, DEX: 5, TECH: 8, COOL: 5, WILL: 3, LUCK: 8, MOVE: 5, BODY: 7, EMP: 8 },
    { roll: 4,  INT: 8, REF: 7, DEX: 6, TECH: 8, COOL: 3, WILL: 5, LUCK: 6, MOVE: 6, BODY: 5, EMP: 7 },
    { roll: 5,  INT: 6, REF: 7, DEX: 5, TECH: 7, COOL: 5, WILL: 5, LUCK: 8, MOVE: 7, BODY: 6, EMP: 8 },
    { roll: 6,  INT: 8, REF: 5, DEX: 5, TECH: 8, COOL: 5, WILL: 5, LUCK: 6, MOVE: 6, BODY: 5, EMP: 6 },
    { roll: 7,  INT: 8, REF: 6, DEX: 5, TECH: 8, COOL: 5, WILL: 4, LUCK: 8, MOVE: 5, BODY: 7, EMP: 7 },
    { roll: 8,  INT: 6, REF: 5, DEX: 7, TECH: 7, COOL: 3, WILL: 5, LUCK: 8, MOVE: 5, BODY: 5, EMP: 8 },
    { roll: 9,  INT: 6, REF: 6, DEX: 7, TECH: 7, COOL: 5, WILL: 4, LUCK: 6, MOVE: 6, BODY: 5, EMP: 6 },
    { roll: 10, INT: 8, REF: 7, DEX: 6, TECH: 6, COOL: 3, WILL: 4, LUCK: 8, MOVE: 7, BODY: 6, EMP: 7 }
  ],
  // Метод #2 «Edgerunner»: список навыков роли (86 очков, мин 2 / макс 6; базовые ≥2)
  skills: [
    "Athletics","Brawling","Concentration","Conversation","Education","Evasion",
    "First Aid","Human Perception","Language (Streetslang)","Local Expert (Your Home)",
    "Perception","Persuasion","Stealth",
    "Basic Tech","Cybertech","Deduction","Paramedic","Resist Torture/Drugs",
    "Science (choose 1)","Shoulder Arms"
  ]
},
  exec: {
  role: "Exec",
  statsOrder: ["INT","REF","DEX","TECH","COOL","WILL","LUCK","MOVE","BODY","EMP"],
  // Метод #1 «Streetrat» (шаблоны): бросок 1d10 → берём строку таблицы
  statTemplates: [
    { roll: 1,  INT: 8, REF: 5, DEX: 5, TECH: 3, COOL: 8, WILL: 6, LUCK: 6, MOVE: 5, BODY: 5, EMP: 7 },
    { roll: 2,  INT: 8, REF: 6, DEX: 6, TECH: 4, COOL: 7, WILL: 6, LUCK: 7, MOVE: 7, BODY: 5, EMP: 7 },
    { roll: 3,  INT: 8, REF: 7, DEX: 6, TECH: 3, COOL: 8, WILL: 6, LUCK: 7, MOVE: 6, BODY: 4, EMP: 5 },
    { roll: 4,  INT: 8, REF: 5, DEX: 7, TECH: 5, COOL: 6, WILL: 5, LUCK: 6, MOVE: 5, BODY: 5, EMP: 7 },
    { roll: 5,  INT: 7, REF: 7, DEX: 6, TECH: 5, COOL: 8, WILL: 5, LUCK: 7, MOVE: 7, BODY: 5, EMP: 6 },
    { roll: 6,  INT: 5, REF: 7, DEX: 7, TECH: 3, COOL: 6, WILL: 7, LUCK: 6, MOVE: 5, BODY: 5, EMP: 7 },
    { roll: 7,  INT: 6, REF: 6, DEX: 7, TECH: 5, COOL: 8, WILL: 7, LUCK: 6, MOVE: 7, BODY: 4, EMP: 6 },
    { roll: 8,  INT: 6, REF: 7, DEX: 7, TECH: 3, COOL: 7, WILL: 5, LUCK: 7, MOVE: 5, BODY: 5, EMP: 7 },
    { roll: 9,  INT: 7, REF: 6, DEX: 7, TECH: 5, COOL: 7, WILL: 5, LUCK: 7, MOVE: 6, BODY: 5, EMP: 5 },
    { roll: 10, INT: 7, REF: 7, DEX: 5, TECH: 5, COOL: 8, WILL: 6, LUCK: 6, MOVE: 7, BODY: 4, EMP: 7 }
  ],
  // Метод #2 «Edgerunner»: список навыков роли (86 очков, мин 2 / макс 6; базовые ≥2)
  skills: [
    "Athletics","Brawling","Concentration","Conversation","Education","Evasion",
    "First Aid","Human Perception","Language (Streetslang)","Local Expert (Your Home)",
    "Perception","Persuasion","Stealth",
    "Accounting","Bureaucracy","Business","Deduction","Handgun",
    "Lip Reading","Personal Grooming"
  ]
},
  media: {
  role: "Media",
  statsOrder: ["INT","REF","DEX","TECH","COOL","WILL","LUCK","MOVE","BODY","EMP"],
  // Метод #1 «Streetrat» (шаблоны): бросок 1d10 → берём строку таблицы
  statTemplates: [
    { roll: 1,  INT: 6, REF: 6, DEX: 5, TECH: 5, COOL: 8, WILL: 7, LUCK: 5, MOVE: 7, BODY: 5, EMP: 7 },
    { roll: 2,  INT: 8, REF: 7, DEX: 7, TECH: 3, COOL: 6, WILL: 6, LUCK: 6, MOVE: 5, BODY: 6, EMP: 8 },
    { roll: 3,  INT: 6, REF: 7, DEX: 7, TECH: 5, COOL: 6, WILL: 8, LUCK: 5, MOVE: 5, BODY: 5, EMP: 7 },
    { roll: 4,  INT: 6, REF: 5, DEX: 7, TECH: 5, COOL: 6, WILL: 7, LUCK: 5, MOVE: 5, BODY: 6, EMP: 6 },
    { roll: 5,  INT: 6, REF: 6, DEX: 7, TECH: 4, COOL: 8, WILL: 7, LUCK: 6, MOVE: 7, BODY: 5, EMP: 8 },
    { roll: 6,  INT: 7, REF: 5, DEX: 5, TECH: 4, COOL: 8, WILL: 7, LUCK: 6, MOVE: 7, BODY: 5, EMP: 8 },
    { roll: 7,  INT: 8, REF: 5, DEX: 6, TECH: 3, COOL: 7, WILL: 6, LUCK: 6, MOVE: 5, BODY: 6, EMP: 7 },
    { roll: 8,  INT: 6, REF: 5, DEX: 6, TECH: 5, COOL: 6, WILL: 8, LUCK: 6, MOVE: 6, BODY: 7, EMP: 8 },
    { roll: 9,  INT: 7, REF: 7, DEX: 5, TECH: 4, COOL: 6, WILL: 7, LUCK: 6, MOVE: 5, BODY: 6, EMP: 7 },
    { roll: 10, INT: 7, REF: 6, DEX: 6, TECH: 3, COOL: 7, WILL: 6, LUCK: 7, MOVE: 6, BODY: 7, EMP: 6 }
  ],
  // Метод #2 «Edgerunner»: список навыков роли (86 очков, мин 2 / макс 6; базовые ≥2)
  skills: [
    "Athletics","Brawling","Concentration","Conversation","Education","Evasion",
    "First Aid","Human Perception","Language (Streetslang)","Local Expert (Your Home)",
    "Perception","Persuasion","Stealth",
    "Bribery","Composition","Deduction","Handgun","Library Search",
    "Lip Reading","Photography/Film"
  ]
},
  lawman: {
  role: "Lawman",
  statsOrder: ["INT","REF","DEX","TECH","COOL","WILL","LUCK","MOVE","BODY","EMP"],
  // Метод #1 «Streetrat» (шаблоны): бросок 1d10 → берём строку таблицы
  statTemplates: [
    { roll: 1,  INT: 5, REF: 6, DEX: 7, TECH: 5, COOL: 7, WILL: 8, LUCK: 5, MOVE: 6, BODY: 5, EMP: 6 },
    { roll: 2,  INT: 6, REF: 6, DEX: 6, TECH: 5, COOL: 6, WILL: 8, LUCK: 5, MOVE: 7, BODY: 5, EMP: 5 },
    { roll: 3,  INT: 5, REF: 7, DEX: 7, TECH: 7, COOL: 6, WILL: 7, LUCK: 5, MOVE: 5, BODY: 7, EMP: 6 },
    { roll: 4,  INT: 6, REF: 6, DEX: 7, TECH: 6, COOL: 6, WILL: 8, LUCK: 5, MOVE: 7, BODY: 7, EMP: 6 },
    { roll: 5,  INT: 6, REF: 6, DEX: 7, TECH: 6, COOL: 7, WILL: 7, LUCK: 6, MOVE: 5, BODY: 5, EMP: 6 },
    { roll: 6,  INT: 7, REF: 6, DEX: 5, TECH: 5, COOL: 7, WILL: 8, LUCK: 5, MOVE: 6, BODY: 7, EMP: 4 },
    { roll: 7,  INT: 7, REF: 8, DEX: 7, TECH: 5, COOL: 6, WILL: 8, LUCK: 7, MOVE: 6, BODY: 5, EMP: 4 },
    { roll: 8,  INT: 5, REF: 6, DEX: 6, TECH: 5, COOL: 6, WILL: 8, LUCK: 5, MOVE: 7, BODY: 6, EMP: 4 },
    { roll: 9,  INT: 7, REF: 7, DEX: 5, TECH: 5, COOL: 7, WILL: 7, LUCK: 6, MOVE: 5, BODY: 5, EMP: 6 },
    { roll: 10, INT: 6, REF: 6, DEX: 5, TECH: 6, COOL: 8, WILL: 7, LUCK: 5, MOVE: 7, BODY: 6, EMP: 6 }
  ],
  // Метод #2 «Edgerunner»: список навыков роли (86 очков, мин 2 / макс 6; базовые ≥2)
  skills: [
    "Athletics","Brawling","Concentration","Conversation","Education","Evasion",
    "First Aid","Human Perception","Language (Streetslang)","Local Expert (Your Home)",
    "Perception","Persuasion","Stealth",
    "Autofire","Criminology","Deduction","Handgun",
    "Interrogation","Shoulder Arms","Tracking"
  ]
}};

/* ------------------------------------------------------------
   [2] НАВЫКИ — data/skills.js (справочник, Core Rulebook стр. 82–85)
   ------------------------------------------------------------ */
// ============================================================
// СПРАВОЧНИК НАВЫКОВ — Cyberpunk RED (полный список из книги правил)
// Источник: Data/Cyberpunk Red Core Rulebook v1.25.pdf, стр. 82–85
//   («Skill Definitions»: Awareness, Body, Control, Education,
//     Fighting, Performance, Ranged Weapons, Social, Technique)
// Здесь перечислены все навыки игры (базовые варианты названий + отдельные
// записи с множителями «(x2)» / выбором «(choose 1)» из файлов ролей):
//   name    — англоязычное имя навыка (как в файлах ролей src/roles/*.js)
//   ru      — русское название для отображения на листе
//   stat    — характеристика, используемая при проверке этого навыка
//   group   — группа навыков по книге правил
//   basic   — true у базовых навыков (есть у всех персонажей, стартовый уровень 2)
// Список навыков конкретного персонажа формируется из выбранной роли
// (файлы src/roles/*.js), а названия и связки «навык → характеристика» — отсюда.
// ============================================================

const SKILLS = [
  // --- Awareness (Восприятие) ---
  { name: "Concentration",              ru: "Концентрация",                 stat: "WILL", group: "Awareness" },
  { name: "Conceal/Reveal Object",      ru: "Спрятать / найти предмет",     stat: "INT",  group: "Awareness" },
  { name: "Lip Reading",                ru: "Чтение по губам",              stat: "INT",  group: "Awareness" },
  { name: "Perception",                 ru: "Внимательность",               stat: "INT",  group: "Awareness", basic: true },
  { name: "Tracking",                   ru: "Слежение",                     stat: "INT",  group: "Awareness" },

  // --- Body (Тело) ---
  { name: "Athletics",                  ru: "Атлетика",                     stat: "DEX",  group: "Body", basic: true },
  { name: "Contortionist",              ru: "Гимнастика (гибкость)",        stat: "DEX",  group: "Body" },
  { name: "Dance",                      ru: "Танцы",                        stat: "DEX",  group: "Body" },
  { name: "Endurance",                  ru: "Выносливость",                 stat: "WILL", group: "Body" },
  { name: "Resist Torture/Drugs",       ru: "Стойкость (пытки/наркотики)",  stat: "WILL", group: "Body" },
  { name: "Stealth",                    ru: "Скрытность",                   stat: "DEX",  group: "Body", basic: true },

  // --- Control (Управление) ---
  { name: "Drive Land Vehicle",         ru: "Вождение (наземный транспорт)", stat: "REF", group: "Control" },
  { name: "Pilot Air Vehicle (x2)",     ru: "Пилотирование воздушного транспорта (x2)", stat: "REF", group: "Control" },
  { name: "Pilot Sea Vehicle",          ru: "Пилотирование водного транспорта", stat: "REF", group: "Control" },
  { name: "Riding",                     ru: "Верховая езда",                stat: "REF",  group: "Control" },

  // --- Education (Образование) ---
  { name: "Accounting",                 ru: "Бухгалтерия",                  stat: "INT",  group: "Education" },
  { name: "Animal Handling",            ru: "Обращение с животными",        stat: "INT",  group: "Education" },
  { name: "Bureaucracy",                ru: "Бюрократия",                   stat: "INT",  group: "Education" },
  { name: "Business",                   ru: "Бизнес",                       stat: "INT",  group: "Education" },
  { name: "Composition",                ru: "Композиция",                   stat: "INT",  group: "Education" },
  { name: "Criminology",                ru: "Криминалистика",               stat: "INT",  group: "Education" },
  { name: "Cryptography",               ru: "Криптография",                 stat: "INT",  group: "Education" },
  { name: "Deduction",                  ru: "Дедукция",                     stat: "INT",  group: "Education" },
  { name: "Education",                  ru: "Образование",                  stat: "INT",  group: "Education", basic: true },
  { name: "Gamble",                     ru: "Азартные игры",                stat: "INT",  group: "Education" },
  { name: "Language",                   ru: "Язык",                         stat: "INT",  group: "Education" },
  { name: "Language (Streetslang)",     ru: "Язык (уличный жаргон)",        stat: "INT",  group: "Education", basic: true },
  { name: "Library Search",             ru: "Поиск в библиотеке / сети",    stat: "INT",  group: "Education" },
  { name: "Local Expert",               ru: "Знаток местности",             stat: "INT",  group: "Education" },
  { name: "Local Expert (Your Home)",   ru: "Знаток местности (дом)",       stat: "INT",  group: "Education", basic: true },
  { name: "Science",                    ru: "Наука",                        stat: "INT",  group: "Education" },
  { name: "Science (choose 1)",         ru: "Наука (выберите 1)",           stat: "INT",  group: "Education" },
  { name: "Tactics",                    ru: "Тактика",                      stat: "INT",  group: "Education" },
  { name: "Wilderness Survival",        ru: "Выживание в дикой природе",    stat: "INT",  group: "Education" },

  // --- Fighting (Бой) ---
  { name: "Brawling",                   ru: "Рукопашный бой",               stat: "DEX",  group: "Fighting", basic: true },
  { name: "Evasion",                    ru: "Изворотливость",               stat: "DEX",  group: "Fighting", basic: true },
  { name: "Martial Arts (x2)",          ru: "Единоборства (x2)",            stat: "DEX",  group: "Fighting" },
  { name: "Melee Weapon",               ru: "Холодное оружие",              stat: "DEX",  group: "Fighting" },

  // --- Performance (Выступление) ---
  { name: "Acting",                     ru: "Актёрство",                    stat: "COOL", group: "Performance" },
  { name: "Play Instrument",            ru: "Игра на инструменте",          stat: "TECH", group: "Performance" },
  { name: "Play Instrument (choose 1)", ru: "Игра на инструменте (выберите 1)", stat: "TECH", group: "Performance" },

  // --- Ranged Weapons (Стрельба) ---
  { name: "Archery",                    ru: "Стрельба из лука",             stat: "REF",  group: "Ranged Weapons" },
  { name: "Autofire",                   ru: "Автогон",                      stat: "REF",  group: "Ranged Weapons" },
  { name: "Autofire (x2)",              ru: "Автогон (x2)",                 stat: "REF",  group: "Ranged Weapons" },
  { name: "Handgun",                    ru: "Пистолеты",                    stat: "REF",  group: "Ranged Weapons" },
  { name: "Heavy Weapons (x2)",         ru: "Тяжёлое оружие (x2)",          stat: "REF",  group: "Ranged Weapons" },
  { name: "Shoulder Arms",              ru: "Длинноствольное оружие",       stat: "REF",  group: "Ranged Weapons" },

  // --- Social (Социальные) ---
  { name: "Bribery",                    ru: "Подкуп",                       stat: "COOL", group: "Social" },
  { name: "Conversation",               ru: "Обходительность",              stat: "EMP",  group: "Social", basic: true },
  { name: "Human Perception",           ru: "Чутьё на людей",               stat: "EMP",  group: "Social", basic: true },
  { name: "Interrogation",              ru: "Допрос",                       stat: "COOL", group: "Social" },
  { name: "Persuasion",                 ru: "Убедительность",               stat: "COOL", group: "Social", basic: true },
  { name: "Personal Grooming",          ru: "Уход за собой",                stat: "COOL", group: "Social" },
  { name: "Streetwise",                 ru: "Уличное чутьё",                stat: "COOL", group: "Social" },
  { name: "Trading",                    ru: "Торговля",                     stat: "COOL", group: "Social" },
  { name: "Wardrobe & Style",           ru: "Гардероб и стиль",             stat: "COOL", group: "Social" },

  // --- Technique (Техника) ---
  { name: "Air Vehicle Tech",           ru: "Техника воздушного транспорта", stat: "TECH", group: "Technique" },
  { name: "Basic Tech",                 ru: "Базовые технологии",           stat: "TECH", group: "Technique" },
  { name: "Cybertech",                  ru: "Кибертехника",                 stat: "TECH", group: "Technique" },
  { name: "Demolitions (x2)",           ru: "Подрывное дело (x2)",          stat: "TECH", group: "Technique" },
  { name: "Electronics/Security Tech",  ru: "Электроника / охранная техника", stat: "TECH", group: "Technique" },
  { name: "Electronics/Security Tech (x2)", ru: "Электроника / охранная техника (x2)", stat: "TECH", group: "Technique" },
  { name: "First Aid",                  ru: "Первая помощь",                stat: "TECH", group: "Technique", basic: true },
  { name: "Forgery",                    ru: "Подделка документов",          stat: "TECH", group: "Technique" },
  { name: "Land Vehicle Tech",          ru: "Техника наземного транспорта", stat: "TECH", group: "Technique" },
  { name: "Paint/Draw/Sculpt",          ru: "Рисование / живопись / скульптура", stat: "TECH", group: "Technique" },
  { name: "Paramedic",                  ru: "Скорая помощь",                stat: "TECH", group: "Technique" },
  { name: "Paramedic (x2)",             ru: "Скорая помощь (x2)",           stat: "TECH", group: "Technique" },
  { name: "Photography/Film",           ru: "Фото / видео",                 stat: "TECH", group: "Technique" },
  { name: "Pick Lock",                  ru: "Вскрытие замков",              stat: "TECH", group: "Technique" },
  { name: "Pick Pocket",                ru: "Карманные кражи",              stat: "TECH", group: "Technique" },
  { name: "Sea Vehicle Tech",           ru: "Техника водного транспорта",   stat: "TECH", group: "Technique" },
  { name: "Weaponstech",                ru: "Оружейное дело",               stat: "TECH", group: "Technique" }
];

// Быстрый доступ: имя навыка → запись справочника
const SKILL_BY_NAME = Object.fromEntries(SKILLS.map((s) => [s.name, s]));

// Группировка по категориям (для отображения полного списка навыков)
const SKILL_GROUPS = SKILLS.reduce((acc, s) => {
  (acc[s.group] ||= []).push(s);
  return acc;
}, {});


// ============================================================
// РОЛЕВЫЕ СПОСОБНОСТИ (Role Abilities) — Cyberpunk RED
// Источник: Data/Cyberpunk Red Core Rulebook v1.25.pdf,
// раздел «Getting It Done» — роли и их способности (стр. 144–163).
// name / nameEn — название способности по книге;
// text — перевод описания способности из книги игрока;
// page — страница печатного издания (для сноски на листе).
// ============================================================

const ROLE_ABILITIES = {
  Solo: {
    name: "Боевое чутьё",
    nameEn: "Combat Awareness",
    page: "146",
    text: "Способность роли Соло. Когда начинается бой (до броска Инициативы), в любое время вне боя или действием в бою Соло может распределить очки своей способности «Боевое чутьё» между приёмами: Защита от урона (уменьшает первый полученный урон раунда), Исключение промаха (игнорирует критические провалы при атаке), Реакция инициативы (+1 к броскам Инициативы за очко), Точная атака (бонус к точности атак) и Поиск слабости (замечает уязвимые места противника). Если Соло не меняет распределение, прежние значения сохраняются."
  },
  Netrunner: {
    name: "Интерфейс",
    nameEn: "Interface",
    page: "147",
    text: "Способность роли Нетраннера. «Интерфейс» позволяет работать в Сети: ранг способности определяет количество сетевых действий (NET Actions) за ход (ранги 1–3 — 2 действия, 4–6 — 3, 7–9 — 4, 10 — 5) и открывает набор умений Интерфейса: Чёрный ход (взлом паролей и защит Архитектуры), Маскировка (скрыть свои действия до выхода), Управление (контроль подключённых к Архитектуре систем), Ай-Ди (узнать, что найденные данные собой представляют и сколько стоят), Проводник (получить «карту» Архитектуры), Сканер (найти расположение систем в зоне), Скольжение (уйти от преследующего Чёрного ЛЁДА), Вирус (заложить вирус в ядре Архитектуры), Разряд (Zap) — базовая атака нетраннера против программ и других нетраннеров."
  },
  Rockerboy: {
    name: "Харизматическое воздействие",
    nameEn: "Charismatic Impact",
    page: "144",
    text: "Способность роли Рокербоя. Рокербой влияет на людей одной силой личности — это может быть музыка, поэзия, искусство, танец или просто физическое присутствие (рокер или вождь культа). Воздействие работает только на Поклонников (Fans): вне боя можно превратить незнакомого человека в поклонника броском Харизматического воздействия + 1d10 против СЛ 8 для одного человека, СЛ 10 для небольшой группы (до 6) или СЛ 12 для большой толпы. Ранг способности определяет площадки, где вы можете выступать, и силу влияния на поклонников — от маленькой услуги («купи выпить») до фанатов, готовых рисковать ради вас."
  },
  Nomad: {
    name: "Мото",
    nameEn: "Moto",
    page: "161",
    text: "Способность роли Кочевника. Главное отличие кочевника от остальных — у него лучше машины. «Мото» даёт Кочевнику доступ к транспорту пака и умение обращаться с ним: с ростом ранга способности персонаж получает новые средства передвижения (от мотоцикла и бронированного фургона до грузовиков, боевой техники и вертолётов) и всё лучше ими управляет. При повышении ранга роли Кочевник выбирает: получить новое транспортное средство бесплатно (или почти бесплатно) либо усилить навыки вождения и обслуживания техники."
  },
  Fixer: {
    name: "Оператор",
    nameEn: "Operator",
    page: "159",
    text: "Способность роли Фиксера. Фиксеры знают, как достать что угодно на чёрном рынке, и умеют договариваться с кем угодно. «Оператор» даёт Фиксеру связи и контакты: чем выше ранг, тем более редкие, дорогие и нелегальные товары он может найти, тем более серьёзных людей обязан ему услуга́ми и тем выгоднее сделки проходит через него. Способность также позволяет получать долю с сделок, которые вы устраиваете между другими сторонами."
  },
  Tech: {
    name: "Мастер",
    nameEn: "Maker",
    page: "147",
    text: "Способность роли Технаря. Тех может чинить, улучшать, модифицировать, создавать и изобретать новые предметы. При каждом повышении ранга «Мастера» Тех получает 1 очко в двух специальных направлениях на выбор: Полевая экспертиза (быстрый ремонт и импровизация в поле), Экспертиза улучшений (апгрейды предметов), Экспертиза производства (изготовление предметов с нуля) и Экспертиза изобретений (создание совершенно новых устройств). Проверки делаются TECH + соответствующий навык TECH-группы + ранг специализации + 1d10 против СЛ, зависящей от ценовой категории предмета."
  },
  Medtech: {
    name: "Медицина",
    nameEn: "Medicine",
    page: "149",
    text: "Способность роли Медтехника. Медтехники держат живыми тех, кто должен быть мёртв, — в Время Краски они скорее механики, чем врачи, ведь пациенты часто больше машина, чем человек. При повышении ранга «Медицины» Медтехник распределяет очки между тремя специализациями: Хирургия (каждое очко даёт +2 к навыку Хирургии; лечение тяжелейших критических ранений, имплантация киберимплантов), Фармацевтика (создание и применение медицинских препаратов — Stim, Speedheal, Antibiotic и др.) и Криосистемы (эксплуатация крионных установок). Навыки Хирургия и Медицинская техника доступны только Медтехникам через эту способность."
  },
  Exec: {
    name: "Командная работа",
    nameEn: "Teamwork",
    page: "153",
    text: "Способность роли Корпората. Как и настоящий корпоративный руководитель, Корпорат собирает команду, которая помогает ему достигать целей — законных или нет, насколько позволяет мораль. На ранге 1 «Командной работы» Корпорат получает подписной бонус: костюм Businesswear (пиджак, верх, низ и обувь), обозначающий элиту бизнеса, а также доступ к ресурсам компании: персоналу, информации, транспорту и влиянию внутри корпорации. Рост ранга увеличивает число и качество подчинённых и расширяет привилегии — вплоть до особняка в Executive Zone или пентхауса в Корпоративном зале."
  },
  Media: {
    name: "Кредит доверия",
    nameEn: "Credibility",
    page: "151",
    text: "Способность роли Журналиста. Журналист не только убеждает аудиторию в том, что публикует, — чем выше его кредит доверия, тем шире аудитория и доступ к источникам. Медиа также «в курсе всего» и пассивно ловит слухи: если вы не полностью офлайн, минимум дважды в неделю ГМ тайно бросает Кредит доверия + 1d10, и если проверка превышает СЛ из таблицы слухов, журналист получает самый ценный из доступных слухов. Ранг способности определяет аудиторию, убедительность материалов и масштаб последствий ваших публикаций — от локальных сплетен до падения мегакорпораций."
  },
  Lawman: {
    name: "Подкрепление",
    nameEn: "Backup",
    page: "158",
    text: "Способность роли Законника. У Законников есть то, чего нет у остальных обитателей Найт-Сити, — коллеги с жетонами. «Подкрепление» позволяет звать на помощь отряд служивых: чем выше ранг способности, тем быстрее, многочисленнее и лучше вооружён прибывший отряд (от патруля с пистолетами до спецназа SWAT, бронетехники и авиации). Законник также пользуется служебными полномочиями: доступом к базам данных, ордерами и уважением (или страхом) гражданских."
  }
};

/* ------------------------------------------------------------
   [2a] МАГАЗИНЫ — src/shops/*.js (Core Rulebook, Night Market Appendix)
   ------------------------------------------------------------ */
// 1) КИБЕРМАСТЕРСКАЯ (Cyberware) — Core Rulebook, стр. 358–367
//    hl — потеря Человечности (Humanity Loss).
//    install: Mall — молл/уличная био-мастерская, Clinic — клиника риппердока,
//             Hospital — госпиталь, Chipware — сокет чипвары.

// ДАННЫЕ МАГАЗИНОВ — Cyberpunk RED
// Источник: Data/Cyberpunk Red Core Rulebook v1.25.pdf,
//   «Night Market Appendix» (стр. 340–376) и раздел
//   «The New Street Economy» (стр. 336–377).
// Формат записей:
//   name / ru  — английское название по книге и перевод для отображения
//   cost       — цена в эдди (eb)
//   tier       — градация стоимости по книге (Cheap / Everyday / Costly / …)
//   page       — страница печатного издания (Core Rulebook)
//   note       — краткое описание механики из таблиц книги
//   damage / mag / rof / hands / conceal / skill — оружие (стр. 340–341)
//   sp / penalty                                 — броня (стр. 350)
//   hl / install                                 — киберимпланты (стр. 358–367)
//   size                                         — одежда: Bottoms/Top/Jacket/Footwear/…
//   kind                                         — расходники: ammo / battery / chip / drug
//   unit                                         — единица продажи патронов (10 шт. или 1 шт.)
// ============================================================


const CYBERWARE = {
    id: "cyberware",
    ru: "Киберимпланты",
    en: "Cyberware",
    icon: "🦾",
    src: "Core Rulebook, стр. 358–367 (Night Market Appendix · Cyberware)",
    hint: "Устанавливается у риппердока; каждая имплант снимает очки Человечности (HL).",
    groups: [
      {
        title: "Фешенвар (Fashionware)",
        items: [
          { name: "Biomonitor", ru: "Биомонитор", cost: 100, tier: "Premium", install: "Mall", hl: 0, page: "358",
            note: "Подкожный имплант: постоянный светодиодный дисплей пульса, температуры, дыхания, уровня сахара; можно связать с Агентом." },
          { name: "Chemskin", ru: "Хемскин (умная кожа)", cost: 100, tier: "Premium", install: "Mall", hl: 0, page: "358",
            note: "Красители и пигменты, навсегда меняющие оттенок кожи; реакция на температуру и гормоны. С Techhair даёт +2 к Личному уходу." },
          { name: "EMP Threading", ru: "ЭМП-нити", cost: 10, tier: "Cheap", install: "Mall", hl: 0, page: "358",
            note: "Тонкие серебряные линии-«схемы» по всему телу.Заявленной защиты от ЭМИ нет — но выглядит круто." },
          { name: "Light Tattoo", ru: "Светотатуировка", cost: 100, tier: "Premium", install: "Mall", hl: 0, page: "358",
            note: "Подкожные светящиеся пластины — цветные тату под кожей. Три и более установки дают +2 к Стилю и одежде." },
          { name: "Shift Tacts", ru: "Сменные линзы (Shift Tacts)", cost: 100, tier: "Premium", install: "Mall", hl: 0, page: "358",
            note: "Имплантируемые линзы с меняющимся цветом и узором (реакция на температуру/гормоны)." },
          { name: "Skinwatch", ru: "Скинвотч", cost: 100, tier: "Premium", install: "Mall", hl: 0, page: "359",
            note: "Подкожный имплант: время и дата светятся через кожу." },
          { name: "Techhair", ru: "Техволосы", cost: 100, tier: "Premium", install: "Mall", hl: 0, page: "359",
            note: "Искусственные волосы с подсветкой цвета; удлинение/втягивание, реакция на температуру и гормоны." }
        ]
      },
      {
        title: "Нейровар (Neuralware) · база: Neural Link",
        items: [
          { name: "Neural Link", ru: "Нейролинк", cost: 500, tier: "Expensive", install: "Clinic", hl: 7, page: "359",
            note: "Проводная искусственная нервная система — основа Нейровара. 5 слотов опций; нужен для Subdermal Grip." },
          { name: "Braindance Recorder", ru: "Рекордер брейнденса", cost: 500, tier: "Expensive", install: "Clinic", hl: 7, page: "359",
            note: "Опция нейровара: запись брейденса на Memory Chip или связанный Агент. Требует Neural Link." },
          { name: "Chipware Socket", ru: "Сокет чипвары", cost: 500, tier: "Expensive", install: "Clinic", hl: 7, page: "359",
            note: "Разъём на затылке для быстрой установки одного чипа чипвары (установка — действие). Требует Neural Link." },
          { name: "Interface Plugs", ru: "Интерфейсные разъёмы", cost: 500, tier: "Expensive", install: "Clinic", hl: 7, page: "359",
            note: "Разъёмы на запястьях/голове: подключение к смартганам, кибердекам, тяжёлой технике, управление транспортом без рук. Требует Neural Link." },
          { name: "Kerenzikov", ru: "Керензиков", cost: 500, tier: "Expensive", install: "Clinic", hl: 14, page: "359",
            note: "Постоянный спидвар: +2 к броскам Инициативы. Одновременно можно иметь только один спидвар. Требует Neural Link." },
          { name: "Sandevistan", ru: "Сандевистан", cost: 500, tier: "Expensive", install: "Clinic", hl: 7, page: "359",
            note: "Спидвар короткого действия: +3 к Инициативе в течение минуты (действие), затем перезарядка час. Требует Neural Link." },
          { name: "Chemical Analyzer (chipware)", ru: "Химанализатор (чипвара)", cost: 500, tier: "Expensive", install: "Chipware", hl: 3, page: "359",
            note: "Чипвара: точный химический состав веществ действием. Требует Chipware Socket." },
          { name: "Memory Chip (chipware)", ru: "Чип памяти (чипвара)", cost: 10, tier: "Cheap", install: "Chipware", hl: 0, page: "359",
            note: "Стандарт хранения данных; установка в Chipware Socket." },
          { name: "Olfactory Boost (chipware)", ru: "Усиление обоняния (чипвара)", cost: 100, tier: "Premium", install: "Chipware", hl: 7, page: "359",
            note: "Позволяет использовать Слежение по запаху. Требует Chipware Socket." },
          { name: "Pain Editor (chipware)", ru: "Редактор боли (чипвара)", cost: 1000, tier: "Very Expensive", install: "Chipware", hl: 14, page: "360",
            note: "Отключает болевые рецепторы: игнорирует состояние «Тяжело ранен». Требует Chipware Socket." },
          { name: "Skill Chip (chipware)", ru: "Чип навыка (чипвара)", cost: 500, tier: "Expensive", install: "Chipware", hl: 7, page: "360",
            note: "Даёт навык на уровне +3 (если он не выучен выше). Чипы для навыков (x2) — 1000eb. Требует Chipware Socket." },
          { name: "Tactile Boost (chipware)", ru: "Усиление осязания (чипвара)", cost: 100, tier: "Premium", install: "Chipware", hl: 7, page: "360",
            note: "Рука на поверхности чувствует движение в радиусе 20 м. Требует Chipware Socket." }
        ]
      },
      {
        title: "Кибероптика (Cyberoptics) · база: Cybereye",
        items: [
          { name: "Cybereye", ru: "Киберглаз", cost: 100, tier: "Premium", install: "Clinic", hl: 7, page: "360",
            note: "Искусственный глаз вместо мясного. 3 слота опций Киберглаза; часть опций ставится парой в оба глаза." },
          { name: "Anti-Dazzle", ru: "Защита от ослепления", cost: 100, tier: "Premium", install: "Mall", hl: 2, page: "360",
            note: "Иммунитет к вспышкам (в т.ч. светошумовым). Требует два Киберглаза, ставится парой." },
          { name: "Chyron", ru: "Хирон (подэкран)", cost: 100, tier: "Premium", install: "Mall", hl: 2, page: "360",
            note: "Мини-экран в поле зрения: сообщения и видео с другой электроники. Требует Cybereye." },
          { name: "Color Shift", ru: "Смена цвета глаза", cost: 100, tier: "Premium", install: "Mall", hl: 2, page: "360",
            note: "Косметика: неограниченная смена цвета и узора радужки действием. Требует Cybereye." },
          { name: "Dartgun (eye)", ru: "Дартиган в глазу", cost: 500, tier: "Expensive", install: "Clinic", hl: 2, page: "360",
            note: "Спрятанный в Киберглазе экзотический Дартиган, 1 выстрел. Требует Cybereye, занимает 3 слота." },
          { name: "Image Enhance", ru: "Улучшение изображения", cost: 500, tier: "Expensive", install: "Mall", hl: 3, page: "360",
            note: "+2 к Внимательности, Чтению по губам и Поиску предметов при проверках со зрением. Пара, два Киберглаза." },
          { name: "Low Light / Infrared / UV", ru: "Ночной режим (ИК / УФ)", cost: 500, tier: "Expensive", install: "Mall", hl: 3, page: "360",
            note: "Штрафы темноты, дыма и тумана = 0; различает тёплое мясо и холодный металл. Пара, по 2 слота на глаз." },
          { name: "MicroOptics", ru: "Микрооптика", cost: 100, tier: "Premium", install: "Clinic", hl: 2, page: "361",
            note: "Микроскоп в глазу: увеличение до 400×. Требует Cybereye." },
          { name: "MicroVideo", ru: "Микрокамера", cost: 500, tier: "Expensive", install: "Clinic", hl: 2, page: "361",
            note: "Камера в глазу пишет видео и звук на чип памяти или в Агент. Требует Cybereye, 2 слота." },
          { name: "Radiation Detector", ru: "Детектор радиации", cost: 1000, tier: "Very Expensive", install: "Clinic", hl: 3, page: "361",
            note: "Показывает уровень радиации в радиусе 100 м синим свечением над источником. Требует Cybereye." },
          { name: "Targeting Scope", ru: "Прицельная сетка", cost: 500, tier: "Expensive", install: "Clinic", hl: 3, page: "361",
            note: "+1 к проверке при прицельном выстреле. Не суммируется. Требует Cybereye." },
          { name: "TeleOptics", ru: "Телеоптика", cost: 500, tier: "Expensive", install: "Clinic", hl: 3, page: "361",
            note: "Видит детали до 800 м; +1 к атаке одиночным выстрелом на дистанции 51+ м. Не складывается с оптикой Снайпинг. Требует Cybereye." },
          { name: "Virtuality", ru: "Виртуалити", cost: 100, tier: "Premium", install: "Mall", hl: 2, page: "361",
            note: "Проекция образов киберпространства поверх реального вида. Пара, два Киберглаза." }
        ]
      },
      {
        title: "Кибернаудика (Cyberaudio) · база: Cyberaudio Suite",
        items: [
          { name: "Cyberaudio Suite", ru: "Комплект кибернауки", cost: 500, tier: "Expensive", install: "Clinic", hl: 7, page: "361",
            note: "Невидимый комплект во внутреннем черепе; 3 слота опций. Не более одного комплекта." },
          { name: "Amplified Hearing", ru: "Усиленный слух", cost: 100, tier: "Premium", install: "Mall", hl: 3, page: "361",
            note: "+2 к Внимательности на слуховых проверках. Требует Cyberaudio Suite." },
          { name: "Audio Recorder", ru: "Аудиорекордер", cost: 100, tier: "Premium", install: "Clinic", hl: 2, page: "361",
            note: "Пишет звук на чип памяти или в Агент. Требует Cyberaudio Suite." },
          { name: "Bug Detector", ru: "Детектор жучков", cost: 100, tier: "Premium", install: "Mall", hl: 2, page: "361",
            note: "Сигналит в 2 м от прослушки. Требует Cyberaudio Suite." },
          { name: "Homing Tracer", ru: "Трекер-маяк", cost: 100, tier: "Premium", install: "Clinic", hl: 2, page: "361",
            note: "Ведёт связанный маяк до 1 мили; маяк в комплекте, замена 50eb. Требует Cyberaudio Suite." },
          { name: "Internal Agent", ru: "Внутренний Агент", cost: 100, tier: "Premium", install: "Mall", hl: 3, page: "362",
            note: "Полноценный Агент, управляемый голосом; чип памяти извлечь без операции нельзя. Требует Cyberaudio Suite." },
          { name: "Level Damper", ru: "Шумодампер", cost: 100, tier: "Premium", install: "Mall", hl: 2, page: "362",
            note: "Иммунитет к оглушению громким звуком (флешбанги и пр.). Требует Cyberaudio Suite." },
          { name: "Radio Communicator", ru: "Радиосвязь", cost: 100, tier: "Premium", install: "Mall", hl: 2, page: "362",
            note: "Связь по радио на 1 милю. Требует Cyberaudio Suite." },
          { name: "Radio Scanner / Music Player", ru: "Радиосканер / плеер", cost: 50, tier: "Costly", install: "Clinic", hl: 2, page: "362",
            note: "Сканирует все радиодиапазоны в миле, играет музыку из Data Pool или с чипа. Требует Cyberaudio Suite." },
          { name: "Radar Detector", ru: "Радар-детектор", cost: 500, tier: "Expensive", install: "Clinic", hl: 2, page: "362",
            note: "Сигналит при активном радаре в 100 м. Требует Cyberaudio Suite." },
          { name: "Scrambler / Descrambler", ru: "Скремблер / дескремблер", cost: 100, tier: "Premium", install: "Mall", hl: 2, page: "362",
            note: "Шифрование переговоров; дескремблер в комплекте. Требует Cyberaudio Suite." },
          { name: "Voice Stress Analyzer", ru: "Анализатор стресса голоса", cost: 100, tier: "Premium", install: "Mall", hl: 3, page: "362",
            note: "+2 к Человеческой проницательности и Допросу; минутный режим детектора лжи действием. Требует Cyberaudio Suite." }
        ]
      },
      {
        title: "Внутренний кибервар (Internal Body Cyberware)",
        items: [
          { name: "AudioVox", ru: "АудиВокс", cost: 500, tier: "Expensive", install: "Clinic", hl: 3, page: "362",
            note: "Вокальный синтезатор: +2 к Актёрской игре и к Игре на инструменте во время пения." },
          { name: "Contraceptive Implant", ru: "Контрацептивный имплант", cost: 10, tier: "Cheap", install: "Mall", hl: 0, page: "362",
            note: "Имплант против нежелательной беременности." },
          { name: "Enhanced Antibodies", ru: "Усиленные антитела", cost: 500, tier: "Expensive", install: "Mall", hl: 2, page: "362",
            note: "После стабилизации: отдых восстанавливает 2×BODY очков HP в день до полного здоровья." },
          { name: "Cybersnake", ru: "Киберзмея", cost: 1000, tier: "Very Expensive", install: "Hospital", hl: 14, page: "363",
            note: "Щупальце-оружие в горле/пищеводе: очень тяжёлое ближнее оружие (4d6, ROF 1), скрывается без проверки." },
          { name: "Gills", ru: "Жабры", cost: 1000, tier: "Very Expensive", install: "Hospital", hl: 7, page: "363",
            note: "Позволяют дышать под водой." },
          { name: "Grafted Muscle and Bone Lace", ru: "Нарощенные мышцы и костный плетень", cost: 1000, tier: "Very Expensive", install: "Hospital", hl: 14, page: "363",
            note: "+2 к BODY (влияет на HP, порог ранения и спасбросок смерти); установки складываются, BODY выше 10 не поднимает." },
          { name: "Independent Air Supply", ru: "Автономный запас воздуха", cost: 1000, tier: "Very Expensive", install: "Hospital", hl: 2, page: "363",
            note: "30 минут воздуха; перезаправка час или замена баллона за 50eb (действие)." },
          { name: "Midnight Lady™ Sexual Implant", ru: "Midnight Lady™ (секс-имплант)", cost: 100, tier: "Premium", install: "Clinic", hl: 7, page: "364",
            note: "«Будь Венерой, будь огнём. Будь желанием.»" },
          { name: "Mr. Studd™ Sexual Implant", ru: "Mr. Studd™ (секс-имплант)", cost: 100, tier: "Premium", install: "Clinic", hl: 7, page: "364",
            note: "«Всю ночь, каждую ночь. И они никогда не узнают.»" },
          { name: "Nasal Filters", ru: "Носовые фильтры", cost: 100, tier: "Premium", install: "Clinic", hl: 2, page: "364",
            note: "Иммунитет к ядовитым газам и парам; отключаются без действия." },
          { name: "Radar / Sonar Implant", ru: "Радар / сонар", cost: 1000, tier: "Very Expensive", install: "Clinic", hl: 7, page: "364",
            note: "Сканирует местность в 50 м (в т.ч. под водой) на новые угрозы; ГМ подаёт сигнал о движущемся объекте." },
          { name: "Toxin Binders", ru: "Связыватели токсинов", cost: 100, tier: "Premium", install: "Clinic", hl: 2, page: "364",
            note: "+2 к Стойкости (пытки/наркотики). Не суммируется." },
          { name: "Vampyres", ru: "Вампирсы (клыки)", cost: 500, tier: "Expensive", install: "Clinic", hl: 14, page: "364",
            note: "Клыки: отличное лёгкое ближнее оружие (1d6, ROF 2), прячется без проверки; отсек для флакона яда/биотоксина с нанесением без проверки." }
        ]
      },
      {
        title: "Внешний кибервар (External Body Cyberware)",
        items: [
          { name: "Hidden Holster", ru: "Скрытая кобура", cost: 500, tier: "Expensive", install: "Clinic", hl: 7, page: "364",
            note: "Кобура в теле: оружие, способное прятаться, скрывается без проверки и достаётся без действия." },
          { name: "Skin Weave", ru: "Кожаное плетение (SP7)", cost: 500, tier: "Expensive", install: "Hospital", hl: 7, page: "364",
            note: "Тело и голова в броне SP7; наномашинки восстанавливают 1 SP за день естественного лечения." },
          { name: "Subdermal Armor", ru: "Подкожная броня (SP11)", cost: 1000, tier: "Very Expensive", install: "Hospital", hl: 14, page: "364",
            note: "Тело и голова в броне SP11; наномашинки ремонтируют по 1 SP за день отдыха." },
          { name: "Subdermal Pocket", ru: "Подкожный карман", cost: 100, tier: "Premium", install: "Clinic", hl: 3, page: "364",
            note: "Полость 5×10 см с застёжкой Realskinn™; содержимое прячется без проверки." }
        ]
      },
      {
        title: "Киберконечности (Cyberlimbs) · база: Cyberarm / Cyberleg",
        items: [
          { name: "Cyberarm", ru: "Киберрука", cost: 500, tier: "Expensive", install: "Hospital", hl: 7, page: "364",
            note: "Замена руки; 4 слота опций, стандартная кисть в комплекте (без HL и слота)." },
          { name: "Standard Hand", ru: "Стандартная кисть", cost: 100, tier: "Premium", install: "Clinic", hl: 2, page: "364",
            note: "Выглядит как обычная кисть; слот Киберруки не занимает." },
          { name: "Big Knucks", ru: "Биг Накс (биты на костяшках)", cost: 100, tier: "Premium", install: "Clinic", hl: 3, page: "364",
            note: "Бронированные костяшки: среднее ближнее оружие (2d6, ROF 2), прячется без проверки; рука занята оружием." },
          { name: "Cyberdeck (in Cyberarm)", ru: "Кибердека в руке", cost: 500, tier: "Expensive", install: "Clinic", hl: 3, page: "364",
            note: "Дека в Киберруке: +1 постоянный слот дека; демонтаж убивает деку. Требует дека от владельца, Cyberarm, 3 слота; нужны Interface Plugs и Neural Link." },
          { name: "Grapple Hand", ru: "Кисть с гарпуном", cost: 100, tier: "Premium", install: "Clinic", hl: 3, page: "365",
            note: "Ракетный захват до 30 м по прочному укрытию; трос держит 2× массы тела, 10 HP; штраф лазанья снимается. Требует Cyberarm." },
          { name: "Medscanner (Cyberarm)", ru: "Медсканер в руке", cost: 500, tier: "Expensive", install: "Clinic", hl: 7, page: "365",
            note: "+2 к Первой помощи и Парамедику. Требует Cyberarm, 2 слота; не суммируется." },
          { name: "Popup Grenade Launcher", ru: "Выдвижной гранатомёт", cost: 500, tier: "Expensive", install: "Clinic", hl: 7, page: "365",
            note: "Однозарядный ручный гранатомёт в Киберруке; прячется и выезжает без действий. Требует Cyberarm, 2 слота." },
          { name: "Popup Melee Weapon", ru: "Выдвижное ближнее оружие", cost: 500, tier: "Expensive", install: "Clinic", hl: 7, page: "365",
            note: "Лёгкое/среднее/тяжёлое одноручное оружие в Киберруке: прячется без проверки, достаётся без действия. Требует Cyberarm, 2 слота." },
          { name: "Popup Shield", ru: "Выдвижной щит", cost: 500, tier: "Expensive", install: "Clinic", hl: 7, page: "365",
            note: "Пуленепробиваемый щит внутри Киберруки; достаётся/убирается без действия. Требует Cyberarm, 3 слота." },
          { name: "Popup Ranged Weapon", ru: "Выдвижное дальнее оружие", cost: 500, tier: "Expensive", install: "Clinic", hl: 7, page: "365",
            note: "Одноручное дальнобойное оружие владельца в Киберруке; прячется без проверки. Требует Cyberarm, 2 слота." },
          { name: "Quick Change Mount", ru: "Быстросъёмное крепление", cost: 100, tier: "Premium", install: "Clinic", hl: 7, page: "365",
            note: "Киберрука ставится и снимается действием; повторная установка своей руки HL не даёт. Требует Cyberarm." },
          { name: "Rippers", ru: "Рипперы (когти)", cost: 500, tier: "Expensive", install: "Clinic", hl: 3, page: "365",
            note: "Выдвишные carboglass ногти: среднее ближнее оружие (2d6, ROF 2). Можно единственная импланта мясной руки." },
          { name: "Scratchers", ru: "Скрэтчеры (ногти)", cost: 100, tier: "Premium", install: "Mall", hl: 2, page: "366",
            note: "Carboglass ногти: лёгкое ближнее оружие (1d6, ROF 2), прячутся без проверки." },
          { name: "Shoulder Cam", ru: "Плечевая камера", cost: 500, tier: "Expensive", install: "Clinic", hl: 7, page: "366",
            note: "Выдвижная камера в плече пишет независимо от владельца. Требует Cyberarm, 2 слота." },
          { name: "Slice 'N Dice", ru: "Слайс энд Дайс (монофиламент)", cost: 500, tier: "Expensive", install: "Clinic", hl: 3, page: "366",
            note: "Моноволоконный кнут в большом пальце: среднее ближнее оружие (2d6, ROF 2)." },
          { name: "Subdermal Grip", ru: "Подкожный хват", cost: 100, tier: "Premium", install: "Clinic", hl: 3, page: "366",
            note: "Пластина под ладонью для смартганов; альтернатива Interface Plugs. Требует Neural Link, занимает слот нейровара." },
          { name: "Techscanner (Cyberarm)", ru: "Тексканер в руке", cost: 500, tier: "Expensive", install: "Clinic", hl: 7, page: "366",
            note: "+2 к Базовой технике, Кибертехнике, техникам транспорта, Электронике/безопасности и Оружейнику. Требует Cyberarm, 2 слота." },
          { name: "Tool Hand", ru: "Рука-инструмент", cost: 100, tier: "Premium", install: "Clinic", hl: 3, page: "366",
            note: "В пальцах отвёртки, ключи, дрель — Техинструмент всегда с вами." },
          { name: "Wolvers", ru: "Волверс (лезвия в костяшках)", cost: 500, tier: "Expensive", install: "Clinic", hl: 7, page: "366",
            note: "Выдвишные carboglass когти: тяжёлое ближнее оружие (3d6, ROF 2), прячутся без проверки." },
          { name: "Cyberleg", ru: "Кибернога", cost: 100, tier: "Premium", install: "Hospital", hl: 3, page: "366",
            note: "Замена ноги; 3 слота опций, стандартная стопа в комплекте (без HL и слота)." },
          { name: "Standard Foot", ru: "Стандартная стопа", cost: 100, tier: "Premium", install: "Clinic", hl: 2, page: "366",
            note: "Выглядит как обычная стопа; слот Киберноги не занимает." },
          { name: "Grip Foot", ru: "Сцепная стопа", cost: 500, tier: "Expensive", install: "Clinic", hl: 3, page: "367",
            note: "Тракционная подошва: снимает штраф движения при лазании. Две Киберноги, ставится парой." },
          { name: "Jump Booster", ru: "Прыжковые бустеры", cost: 500, tier: "Expensive", install: "Clinic", hl: 3, page: "367",
            note: "Гидравлика в ногах: снимает штраф прыжка. Две Киберноги, 2 слота, пара." },
          { name: "Skate Foot", ru: "Стопа-ролики", cost: 500, tier: "Expensive", install: "Clinic", hl: 3, page: "367",
            note: "Встроенные роликовые коньки: +6 м к скорости при беге. Две Киберноги, пара." },
          { name: "Talon Foot", ru: "Стопа с когтем", cost: 500, tier: "Expensive", install: "Clinic", hl: 3, page: "367",
            note: "Лезвие в стопе: лёгкое ближнее оружие; прячется без проверки." },
          { name: "Web Foot", ru: "Лыжная стопа (перепонки)", cost: 500, tier: "Expensive", install: "Clinic", hl: 3, page: "367",
            note: "Перепонки между пальцами: снимает штраф плавания. Две Киберноги, пара." },
          { name: "Hardened Shielding", ru: "Защищённая схема конечности", cost: 1000, tier: "Very Expensive", install: "Clinic", hl: 3, page: "367",
            note: "Киберконечность и её опции не отключаются ЭМИ и эффектами программ. Требует Cyberarm или Cyberleg." },
          { name: "Plastic Covering", ru: "Пластиковое покрытие", cost: 100, tier: "Premium", install: "Mall", hl: 0, page: "367",
            note: "Полимерное покрытие конечности в любых цветах и узорах; слот не занимает." },
          { name: "Realskinn™ Covering", ru: "Покрытие Realskinn™", cost: 500, tier: "Expensive", install: "Mall", hl: 0, page: "367",
            note: "Искусственная кожа на киберконечность; слот не занимает." },
          { name: "Superchrome® Covering", ru: "Покрытие Superchrome®", cost: 1000, tier: "Very Expensive", install: "Mall", hl: 0, page: "367",
            note: "Зеркальный металлический корпус: +2 к Стилю и одежде (один раз); слот не занимает." }
        ]
      },
      {
        title: "БОРГвар (Borgware)",
        items: [
          { name: "Artificial Shoulder Mount", ru: "Искусственное плечевое крепление", cost: 1000, tier: "Very Expensive", install: "Hospital", hl: 14, page: "367",
            note: "Позволяет смонтировать ещё 2 Киберруки под первой парой. Не более одного крепления." },
          { name: "Implanted Linear Frame ∑ (Sigma)", ru: "Вживаемый линейный каркас Σ (Sigma)", cost: 1000, tier: "Very Expensive", install: "Hospital", hl: 14, page: "367",
            note: "Усиленный скелет: BODY становится 12 (меняет HP и спасбросок смерти), выше 13 не растёт. Требует BODY 6 и Grafted Muscle and Bone Lace." },
          { name: "Implanted Linear Frame ß (Beta)", ru: "Вживаемый линейный каркас ß (Beta)", cost: 5000, tier: "Luxury", install: "Hospital", hl: 14, page: "367",
            note: "Мощнейший скелет: BODY становится 14 (меняет HP и спасбросок), выше 15 не растёт. Требует BODY 8 и двух Grafted Muscle and Bone Lace." },
          { name: "MultiOptic Mount", ru: "Крепление мультиоптики", cost: 1000, tier: "Very Expensive", install: "Hospital", hl: 14, page: "367",
            note: "До 5 дополнительных Киберглаза. Киберглаза покупаются отдельно. Не более одного крепления." },
          { name: "Sensor Array", ru: "Сенсорная решётка («уши кролика»)", cost: 1000, tier: "Very Expensive", install: "Clinic", hl: 14, page: "367",
            note: "Две антенны: до 5 дополнительных опций кибернауки без слотов. Требует Cyberaudio Suite; не более одной решётки." }
        ]
      }
    ]
  };


// 2) ОРУЖЕЙНЫЙ МАГАЗИН (Weapons & Armor) — Core Rulebook, стр. 340–350
//    melee: damage / hands / rof / conceal
//    ranged: damage / mag (магазин) / rof / hands / conceal / skill

// ДАННЫЕ МАГАЗИНОВ — Cyberpunk RED
// Источник: Data/Cyberpunk Red Core Rulebook v1.25.pdf,
//   «Night Market Appendix» (стр. 340–376) и раздел
//   «The New Street Economy» (стр. 336–377).
// Формат записей:
//   name / ru  — английское название по книге и перевод для отображения
//   cost       — цена в эдди (eb)
//   tier       — градация стоимости по книге (Cheap / Everyday / Costly / …)
//   page       — страница печатного издания (Core Rulebook)
//   note       — краткое описание механики из таблиц книги
//   damage / mag / rof / hands / conceal / skill — оружие (стр. 340–341)
//   sp / penalty                                 — броня (стр. 350)
//   hl / install                                 — киберимпланты (стр. 358–367)
//   size                                         — одежда: Bottoms/Top/Jacket/Footwear/…
//   kind                                         — расходники: ammo / battery / chip / drug
//   unit                                         — единица продажи патронов (10 шт. или 1 шт.)
// ============================================================


const WEAPONS = {
    id: "weapons",
    ru: "Оружие",
    en: "Weapons & Armor",
    icon: "🔫",
    src: "Core Rulebook, стр. 340–350 (Melee / Ranged / Attachments / Exotic / Armor)",
    hint: "У каждого неэкзотического дальнобойного оружия 3 слота под аксессуары; качество меняет цену (см. «Качество оружия», стр. 342).",
    groups: [
      {
        title: "Ближний бой (Melee Weapons)",
        items: [
          { name: "Light Melee Weapon", ru: "Лёгкое ближнее оружие (нож, томагавк)", cost: 50, tier: "Costly", page: "340",
            damage: "1d6", hands: "различно", rof: 2, conceal: true,
            note: "Боевой нож, томагавк. Скрытое ношение — возможно." },
          { name: "Medium Melee Weapon", ru: "Среднее ближнее оружие (бита, мачете)", cost: 50, tier: "Costly", page: "340",
            damage: "2d6", hands: "различно", rof: 2, conceal: false,
            note: "Бейсбольная бита, лом, мачете." },
          { name: "Heavy Melee Weapon", ru: "Тяжёлое ближнее оружие (меч, труба)", cost: 100, tier: "Premium", page: "340",
            damage: "3d6", hands: "различно", rof: 2, conceal: false,
            note: "Свинцовая труба, меч, бита с шипами." },
          { name: "Very Heavy Melee Weapon", ru: "Очень тяжёлое ближнее оружие", cost: 500, tier: "Expensive", page: "340",
            damage: "4d6", hands: "различно", rof: 1, conceal: false,
            note: "Бензопила, кувалда, лопасти вертолёта, нагината." }
        ]
      },
      {
        title: "Дальний бой (Ranged Weapons)",
        items: [
          { name: "Medium Pistol", ru: "Средний пистолет", cost: 50, tier: "Costly", page: "341",
            damage: "2d6", mag: "12 (M Pistol)", rof: 2, hands: 1, conceal: true, skill: "Handgun",
            note: "Примеры: Dai Lung Streetmaster (плохое), Federated Arms X-9mm (стандарт), Militech «Avenger» (отличное)." },
          { name: "Heavy Pistol", ru: "Тяжёлый пистолет", cost: 100, tier: "Premium", page: "341",
            damage: "3d6", mag: "8 (H Pistol)", rof: 2, hands: 1, conceal: true, skill: "Handgun",
            note: "Mustang Arms «Mark III», Nova «Cityhunter»." },
          { name: "Very Heavy Pistol", ru: "Очень тяжёлый пистолет", cost: 100, tier: "Premium", page: "341",
            damage: "4d6", mag: "8 (VH Pistol)", rof: 1, hands: 1, conceal: false, skill: "Handgun",
            note: "Federated Arms «Super Chief», Sternmeyer P-35, Militech «Boomer Buster»." },
          { name: "SMG", ru: "Пистолет-пулемёт", cost: 100, tier: "Premium", page: "341",
            damage: "2d6", mag: "30 (M Pistol)", rof: 1, hands: 1, conceal: true, skill: "Handgun",
            note: "Одиночный огонь; автоогонь (3) и заградительный огонь — особые режимы." },
          { name: "Heavy SMG", ru: "Тяжёлый ПП", cost: 100, tier: "Premium", page: "341",
            damage: "3d6", mag: "40 (H Pistol)", rof: 1, hands: 1, conceal: false, skill: "Handgun",
            note: "Sternmeyer SMG-21, Militech «Viper»; автоогонь (3), заградительный огонь." },
          { name: "Shotgun", ru: "Дробовик", cost: 500, tier: "Expensive", page: "341",
            damage: "5d6", mag: "4 (Slug)", rof: 1, hands: 2, conceal: false, skill: "Shoulder Arms",
            note: "GunMart «Home Defender», Arasaka «Rapid Assault», Militech «Bulldog»; патроны — shotgun shell." },
          { name: "Assault Rifle", ru: "Штурмовая винтовка", cost: 500, tier: "Expensive", page: "341",
            damage: "5d6", mag: "25 (Rifle)", rof: 1, hands: 2, conceal: false, skill: "Shoulder Arms",
            note: "Militech «Ronin» / «Dragon»; автоогонь (4), заградительный огонь." },
          { name: "Sniper Rifle", ru: "Снайперская винтовка", cost: 500, tier: "Expensive", page: "341",
            damage: "5d6", mag: "4 (Rifle)", rof: 1, hands: 2, conceal: false, skill: "Shoulder Arms",
            note: "GunMart «Snipe-Star», Nomad «Long Rifle», Arasaka WSSA." },
          { name: "Bows & Crossbows", ru: "Луки и арбалеты", cost: 100, tier: "Premium", page: "341",
            damage: "4d6", mag: "— (стрелы)", rof: 1, hands: 2, conceal: false, skill: "Archery",
            note: "GunMart «Sherwood»/«Hunter», Eagletech «Tomcat», «Bearcat», «Striker», «Scorpion»; боеприпас — стрелы." },
          { name: "Grenade Launcher", ru: "Гранатомёт", cost: 500, tier: "Expensive", page: "341",
            damage: "6d6", mag: "2 (Grenade)", rof: 1, hands: 2, conceal: false, skill: "Heavy Weapons",
            note: "Towa Type-G, Militech «Mini-Grenade», Tsunami Arms Type-18; взрывной урон." },
          { name: "Rocket Launcher", ru: "Ракетница", cost: 500, tier: "Expensive", page: "341",
            damage: "8d6", mag: "1 (Rocket)", rof: 1, hands: 2, conceal: false, skill: "Heavy Weapons",
            note: "Towa Type-R, Militech «Urban» / «Hotshot»; взрывной урон." }
        ]
      },
      {
        title: "Аксессуары для оружия (Weapon Attachments · 3 слота)",
        items: [
          { name: "Bayonet", ru: "Штык", cost: 100, tier: "Premium", page: "343",
            note: "Плечевое оружие становится лёгким ближним; скрыть под одеждой нельзя." },
          { name: "Drum Magazine", ru: "Барабанный магазин", cost: 500, tier: "Expensive", page: "343",
            note: "Магазин по строке «Drum» таблицы Clip Chart; один магазин на оружие; не прячется." },
          { name: "Extended Magazine", ru: "Расширенный магазин", cost: 100, tier: "Premium", page: "343",
            note: "Магазин по строке «Extended»; один за раз; не прячется." },
          { name: "Grenade Launcher Underbarrel", ru: "Подствольный гранатомёт", cost: 500, tier: "Expensive", page: "343",
            note: "2 слота; оружие работает как гранатомёт с 1 гранатой; не прячется." },
          { name: "Infrared Nightvision Scope", ru: "Инфракрасный ночной прицел", cost: 500, tier: "Expensive", page: "343",
            note: "Штрафы темноты/дыма/тумана = 0; различает живое и металл." },
          { name: "Shotgun Underbarrel", ru: "Подствольный дробовик", cost: 500, tier: "Expensive", page: "343",
            note: "2 слота; работает как дробовик с 2 патронами; не прячется." },
          { name: "Smartgun Link", ru: "Смартган-линк", cost: 500, tier: "Expensive", page: "344",
            note: "2 слота; +1 к стрельбе из смартгана; требует Neural Link и Interface Plugs или Subdermal Grip." },
          { name: "Sniping Scope", ru: "Снайперский прицел", cost: 100, tier: "Premium", page: "343",
            note: "Детали до 800 м; +1 к одиночному/прицельному выстрелу на 51+ м; не складывается с TeleOptics." }
        ]
      },
      {
        title: "Экзотическое оружие (Exotic Weapons)",
        items: [
          { name: "Air Pistol", ru: "Пневматический пистолет", cost: 100, tier: "Premium", page: "347",
            note: "Экзотический средний пистолет: красочные шары (0 урона; кислота снимает 1 SP), критические ранения невозможны." },
          { name: "Battleglove", ru: "Боевая перчатка", cost: 1000, tier: "Very Expensive", page: "347",
            note: "3 слота опций Киберруки; надевание/снятие — действие; опции руки под перчаткой недоступны; не прячется." },
          { name: "Constitution Arms Hurricane", ru: "Constitution Arms «Hurricane»", cost: 5000, tier: "Luxury", page: "348",
            note: "Экзотический дробовик ROF 2, барабан 16; прицельные выстрелы невозможны; перезарядка 2 действия; требует BODY 11 (или турель)." },
          { name: "Dartgun", ru: "Дартиган", cost: 100, tier: "Premium", page: "348",
            note: "Экзотический очень тяжёлый пистолет: только нестандартные стрелы, магазин 8." },
          { name: "Flamethrower", ru: "Огнемёт", cost: 500, tier: "Expensive", page: "348",
            note: "Экзотический дробовик (Heavy Weapons); только зажигательные патроны; цель горит: 4 HP в конце хода; без критических ранений и прицельных." },
          { name: "Kendachi Mono-Three", ru: "Kendachi Mono-Three", cost: 5000, tier: "Luxury", page: "348",
            note: "Отличное двуручное очень тяжёлое ближнее оружие; с биометрическим ключом пробивает броню ниже SP11." },
          { name: "Malorian Arms 3516", ru: "Malorian Arms 3516", cost: 10000, tier: "Super Luxury", page: "348",
            note: "Отличный экзотический очень тяжёлый пистолет: 5d6, встроенный Smartgun Link; редчайший трофей." },
          { name: "Microwaver", ru: "Микровейвер", cost: 500, tier: "Expensive", page: "348",
            note: "Экзотический очень тяжёлый пистолет: DV15 Cybertech иначе 2 импланта/электронных устройства отключаются на минуту; батареи бесплатны (8 выстрелов, запасная 50eb)." },
          { name: "Militech \"Cowboy\" U-56", ru: "Militech «Cowboy» U-56", cost: 5000, tier: "Luxury", page: "349",
            note: "Экзотический гранатомёт ROF 2, магазин 4, любые гранаты; перезарядка 2 действия; BODY 11." },
          { name: "Rhinemetall EMG-86 Railgun", ru: "Rhinemetall EMG-86 (рельсотрон)", cost: 5000, tier: "Luxury", page: "349",
            note: "Экзотическая штурмовая винтовка (Heavy Weapons), 4 заряда; пробивает броню ниже SP11; без автоогня и прицельных; BODY 11." },
          { name: "Shrieker", ru: "Шрикер", cost: 500, tier: "Expensive", page: "349",
            note: "Экзотический очень тяжёлый пистолет: DV15 Resist Torture/Drugs иначе повреждённое ухо; без звука — сам получает травму уха; батареи 8 выстрелов." },
          { name: "Stun Baton", ru: "Шок-дубинка", cost: 100, tier: "Premium", page: "349",
            note: "Одноручное среднее ближнее оружие: ниже 1 HP цель впадает в бессознательное состояние; без критических ранений, броня не аблатится." },
          { name: "Stun Gun", ru: "Шокер", cost: 100, tier: "Premium", page: "349",
            note: "Экзотический тяжёлый пистолет: тот же нелетальный эффект; батарея на 8 выстрелов (запасная 50eb)." },
          { name: "Tsunami Arms Helix", ru: "Tsunami Arms Helix", cost: 5000, tier: "Luxury", page: "349",
            note: "Экзотическая винтовка только автоогня (40 патронов, расход 20 за очередь); урон 2d6 × превышение DV (до 5); BODY 11." }
        ]
      },
      {
        title: "Броня (Master Armor List)",
        items: [
          { name: "Leathers", ru: "Кожаная броня", cost: 20, tier: "Everyday", page: "350", sp: 4, penalty: "нет",
            note: "Тонкая кожа с усилением на плечах, бёдрах и животе — выбор кочевников и байкеров." },
          { name: "Kevlar®", ru: "Кевлар®", cost: 50, tier: "Costly", page: "350", sp: 7, penalty: "нет",
            note: "Любая форма: одежда, жилеты, костюмы и даже бикини." },
          { name: "Light Armorjack", ru: "Лёгкий armorjack", cost: 100, tier: "Premium", page: "350", sp: 11, penalty: "нет",
            note: "Кевлар + пластиковые сетки в ткани; отлично против высокоскоростных пуль." },
          { name: "Bodyweight Suit", ru: "Костюм Bodyweight", cost: 1000, tier: "Very Expensive", page: "350", sp: 11, penalty: "нет",
            note: "Облегающий костюм с armorgel: носится и на тело, и на голову (две локации SP11); есть место под кибердеку и поддержка Interface Plugs; +1 слот Hardware связанной деке." },
          { name: "Medium Armorjack", ru: "Средний armorjack", cost: 100, tier: "Premium", page: "350", sp: 12, penalty: "−2 REF, DEX, MOVE",
            note: "Пластиковые пластины и усиленный кевлар — типичная уличная защита." },
          { name: "Heavy Armorjack", ru: "Тяжёлый armorjack", cost: 500, tier: "Expensive", page: "350", sp: 13, penalty: "−2 REF, DEX, MOVE",
            note: "Самый плотный armorjack: пластик + слои кевлара и сеток." },
          { name: "Flak", ru: "Flak («дробь»)", cost: 500, tier: "Expensive", page: "350", sp: 15, penalty: "−4 REF, DEX, MOVE",
            note: "Жилет и штаны с металлическими пластинами против взрывчатки и автоматных калибров." },
          { name: "Metalgear®", ru: "Metalgear®", cost: 5000, tier: "Luxury", page: "350", sp: 18, penalty: "−4 REF, DEX, MOVE",
            note: "Металлопластиковые плиты на сетчатом комбинезоне: держит почти всё, но вас легче попасть." },
          { name: "Bulletproof Shield", ru: "Пуленепробиваемый щит", cost: 100, tier: "Premium", page: "350", sp: 10, penalty: "занята одна рука",
            note: "Прозрачный поликарбонатный щит (10 HP, см. правила укрытий, стр. 183)." }
        ]
      }
    ]
  };


// 3) РАСХОДНИКИ (боеприпасы, батареи, чипы, наркотики)
//    Core Rulebook, стр. 344–347, 348–349, 351–355, 357–358

// ДАННЫЕ МАГАЗИНОВ — Cyberpunk RED
// Источник: Data/Cyberpunk Red Core Rulebook v1.25.pdf,
//   «Night Market Appendix» (стр. 340–376) и раздел
//   «The New Street Economy» (стр. 336–377).
// Формат записей:
//   name / ru  — английское название по книге и перевод для отображения
//   cost       — цена в эдди (eb)
//   tier       — градация стоимости по книге (Cheap / Everyday / Costly / …)
//   page       — страница печатного издания (Core Rulebook)
//   note       — краткое описание механики из таблиц книги
//   damage / mag / rof / hands / conceal / skill — оружие (стр. 340–341)
//   sp / penalty                                 — броня (стр. 350)
//   hl / install                                 — киберимпланты (стр. 358–367)
//   size                                         — одежда: Bottoms/Top/Jacket/Footwear/…
//   kind                                         — расходники: ammo / battery / chip / drug
//   unit                                         — единица продажи патронов (10 шт. или 1 шт.)
// ============================================================


const CONSUMABLES = {
  id: "consumables",
  ru: "Расходники",
  en: "Ammunition & Consumables",
  icon: "📦",
  src: "Core Rulebook, стр. 344–347 (Clip Chart · Ammunition), 348–349 (батареи), 351–355 (Master Gear List)",
  hint: "Патроны (кроме гранат и ракет) продаются пачками по 10 штук; у каждого оружия свой тип боеприпаса.",
  groups: [
    {
      title: "Боеприпасы (Ammunition)",
      items: [
        { name: "Basic Ammunition", ru: "Обычные патроны", cost: 10, tier: "Cheap", unit: "за 10 шт.", kind: "ammo", page: "345",
          note: "Стандартные патроны для оружия; типы: Medium/Heavy/Very Heavy Pistol, Rifle, Slug, Shotgun Shell, Arrow, Grenade, Rocket. Гранаты и ракеты — поштучно." },
        { name: "Armor-Piercing Ammunition", ru: "Бронебойные патроны", cost: 100, tier: "Premium", unit: "за 10 шт.", kind: "ammo", page: "345",
          note: "Все типы, кроме shotgun shell. Снимают с брони 2 SP вместо 1. Для гранат и ракет это базовый уровень." },
        { name: "Biotoxin Ammunition", ru: "Патроны с биотоксином", cost: 500, tier: "Expensive", unit: "за 10 шт.", kind: "ammo", page: "345",
          note: "Только стрелы и гранаты: урон 0, цель проходит DV15 Стойкость (пытки/наркотики) иначе 3d6 прямо по HP без абляции брони." },
        { name: "EMP Ammunition", ru: "ЭМИ-патроны", cost: 500, tier: "Expensive", unit: "за 10 шт.", kind: "ammo", page: "345",
          note: "Только гранаты: DV15 Кибертехника иначе 2 импланта или носимой электроники отключаются на минуту." },
        { name: "Expansive Ammunition", ru: "Экспансивные патроны", cost: 100, tier: "Premium", unit: "за 10 шт.", kind: "ammo", page: "345",
          note: "Стрелы, пули и slug: при критическом ранении «Инородное тело» цель кидает таблицу критических ранений ещё раз." },
        { name: "Flashbang Ammunition", ru: "Светошумовые патроны", cost: 100, tier: "Premium", unit: "за 10 шт.", kind: "ammo", page: "346",
          note: "Только гранаты: DV15 Стойкость иначе повреждённые глаз и ухо на минуту (без бонусного урона)." },
        { name: "Incendiary Ammunition", ru: "Зажигательные патроны", cost: 100, tier: "Premium", unit: "за 10 шт.", kind: "ammo", page: "346",
          note: "Стрелы, пули, гранаты и shotgun shell: урон прошёл сквозь броню — цель горит, 2 HP в конце хода, пока не потушит себя действием." },
        { name: "Poison Ammunition", ru: "Отравленные патроны", cost: 100, tier: "Premium", unit: "за 10 шт.", kind: "ammo", page: "346",
          note: "Только стрелы и гранаты: DV13 Стойкость иначе 2d6 прямо по HP без абляции брони." },
        { name: "Rubber Ammunition", ru: "Резиновые патроны", cost: 10, tier: "Cheap", unit: "за 10 шт.", kind: "ammo", page: "346",
          note: "Стрелы, пули и slug: не вызывают критических ранений, не снимают SP, цель не опускается ниже 1 HP." },
        { name: "Sleep Ammunition", ru: "Снотворные патроны", cost: 500, tier: "Expensive", unit: "за 10 шт.", kind: "ammo", page: "346",
          note: "Только стрелы и гранаты: DV13 Стойкость иначе цель лежит без сознания минуту (или пока не разбудят)." },
        { name: "Smart Ammunition", ru: "Умные патроны", cost: 500, tier: "Expensive", unit: "за 10 шт.", kind: "ammo", page: "346",
          note: "Стрелы, пули и ракеты; нужна импланта «Прицельная сетка» (Targeting Scope). Промах на 4 и меньше получает второй шанс попасть (+10 к d10)." },
        { name: "Smoke Ammunition", ru: "Дымовые патроны", cost: 50, tier: "Costly", unit: "за 10 шт.", kind: "ammo", page: "347",
          note: "Только гранаты: дым 10×10 м на минуту, обычный штраф −4." },
        { name: "Teargas Ammunition", ru: "Слезоточивые патроны", cost: 50, tier: "Costly", unit: "за 10 шт.", kind: "ammo", page: "347",
          note: "Только гранаты: DV13 Стойкость иначе повреждённый глаз на минуту (без бонусного урона)." }
      ]
    },
    {
      title: "Магазины и клипы (Clip Chart, стр. 344)",
      items: [
        { name: "Medium Pistol Clip", ru: "Medium Pistol: Standard / Extended / Drum", cost: 0, tier: "—", kind: "chart", page: "344",
          note: "12 / 18 / 36 патронов." },
        { name: "Heavy Pistol Clip", ru: "Heavy Pistol: Standard / Extended / Drum", cost: 0, tier: "—", kind: "chart", page: "344",
          note: "8 / 14 / 28 патронов." },
        { name: "Very Heavy Pistol Clip", ru: "Very Heavy Pistol: Standard / Extended / Drum", cost: 0, tier: "—", kind: "chart", page: "344",
          note: "8 / 14 / 28 патронов." },
        { name: "SMG Clip", ru: "SMG: Standard / Extended / Drum", cost: 0, tier: "—", kind: "chart", page: "344",
          note: "30 / 40 / 50 патронов." },
        { name: "Heavy SMG Clip", ru: "Heavy SMG: Standard / Extended / Drum", cost: 0, tier: "—", kind: "chart", page: "344",
          note: "40 / 50 / 60 патронов." },
        { name: "Shotgun Clip", ru: "Shotgun: Standard / Extended / Drum", cost: 0, tier: "—", kind: "chart", page: "344",
          note: "4 / 8 / 16 патронов." },
        { name: "Assault Rifle Clip", ru: "Assault Rifle: Standard / Extended / Drum", cost: 0, tier: "—", kind: "chart", page: "344",
          note: "25 / 35 / 45 патронов." },
        { name: "Sniper Rifle Clip", ru: "Sniper Rifle: Standard / Extended / Drum", cost: 0, tier: "—", kind: "chart", page: "344",
          note: "4 / 8 / 12 патронов." },
        { name: "Grenade Launcher Clip", ru: "Grenade Launcher: Standard / Extended / Drum", cost: 0, tier: "—", kind: "chart", page: "344",
          note: "2 / 4 / 6 гранат." },
        { name: "Rocket Launcher Clip", ru: "Rocket Launcher: Standard / Extended / Drum", cost: 0, tier: "—", kind: "chart", page: "344",
          note: "1 / 2 / 3 ракеты." }
      ]
    },
    {
      title: "Батареи, чипы и прочее (стр. 348–349, 351–355)",
      items: [
        { name: "Battery Pack (rechargeable)", ru: "Аккумуляторный блок (8 выстрелов)", cost: 50, tier: "Costly", kind: "battery", page: "348",
          note: "Для Микровейвера, Шрикера и Шокера: 1 час зарядки, запасной блок 50eb." },
        { name: "Memory Chip", ru: "Чип памяти", cost: 10, tier: "Cheap", kind: "chip", page: "351",
          note: "Тонкие пластины легированного пластика для данных любого вида; ёмкость зависит от модели." },
        { name: "Linked Tracer (replacement)", ru: "Сменный маяк-трейсер", cost: 50, tier: "Costly", kind: "gear", page: "354",
          note: "Запасной маяк для Homing Tracer (размером с пуговицу)." },
        { name: "Cryopump Refill (per charge)", ru: "Заправка криопомпы (1 заряд)", cost: 50, tier: "Costly", kind: "gear", page: "353",
          note: "Один заряд криожидкости = один человек в стазисе до недели." },
        { name: "Independent Air Supply Tank", ru: "Баллон автономного воздуха", cost: 50, tier: "Costly", kind: "gear", page: "363",
          note: "Сменный полный баллон для импланта Independent Air Supply (замена — действие)." },
        { name: "Vial of Poison", ru: "Флакон яда", cost: 100, tier: "Premium", kind: "chemical", page: "351",
          note: "Наносится на лёгкое ближнее оружие действием: 30 минут DV13 Стойкость иначе 2d6 прямо по HP." },
        { name: "Vial of Biotoxin", ru: "Флакон биотоксина", cost: 500, tier: "Expensive", kind: "chemical", page: "351",
          note: "Наносится на лёгкое ближнее оружие действием: 30 минут DV15 Стойкость иначе 3d6 прямо по HP." }
      ]
    },
    {
      title: "Уличные наркотики (Street Drugs, стр. 357–358)",
      items: [
        { name: "Black Lace", ru: "Black Lace («чёрное золото») · доза", cost: 50, tier: "Costly", kind: "drug", page: "357",
          note: "24 часа: игнорирует состояние «Тяжело ранен»; −2 ЧЕЛОВЕЧНОСТИ (вернутся, если нет вторичного эффекта). Вторичный эффект DV17: привыкание, −2 REF вне действия." },
        { name: "Blue Glass", ru: "Blue Glass · доза", cost: 20, tier: "Everyday", kind: "drug", page: "357",
          note: "4 часа: ГМ периодически ловит вас «на флэшах» — пропуск действия за ход. DV15: привыкание; у зависимого первичный эффект даёт иммунитет к «флэшам»." },
        { name: "Boost", ru: "Boost · доза", cost: 50, tier: "Costly", kind: "drug", page: "357",
          note: "24 часа: +2 к INT (может превышать 8). DV17: привыкание, −2 INT вне действия." },
        { name: "Smash", ru: "Smash · доза", cost: 10, tier: "Cheap", kind: "drug", page: "357",
          note: "4 часа: жёлтая пена из банки, +2 к Танцам, Гимнастике, Разговору, Человеческой проницательности, Убеждению и Актёрской игре. DV15: привыкание и −2 тех же навыков." },
        { name: "Synthcoke", ru: "Synthcoke · доза", cost: 20, tier: "Everyday", kind: "drug", page: "358",
          note: "4 часа: +1 REF (может превышать 8) плюс параноидальные идеи. DV15: привыкание, −2 REF вне действия." }
      ]
    }
  ]
};


// 4) БАКАЛЕЯ (Food & Drink) — Core Rulebook, стр. 331–332, 338–339, 351, 376

// ДАННЫЕ МАГАЗИНОВ — Cyberpunk RED
// Источник: Data/Cyberpunk Red Core Rulebook v1.25.pdf,
//   «Night Market Appendix» (стр. 340–376) и раздел
//   «The New Street Economy» (стр. 336–377).
// Формат записей:
//   name / ru  — английское название по книге и перевод для отображения
//   cost       — цена в эдди (eb)
//   tier       — градация стоимости по книге (Cheap / Everyday / Costly / …)
//   page       — страница печатного издания (Core Rulebook)
//   note       — краткое описание механики из таблиц книги
//   damage / mag / rof / hands / conceal / skill — оружие (стр. 340–341)
//   sp / penalty                                 — броня (стр. 350)
//   hl / install                                 — киберимпланты (стр. 358–367)
//   size                                         — одежда: Bottoms/Top/Jacket/Footwear/…
//   kind                                         — расходники: ammo / battery / chip / drug
//   unit                                         — единица продажи патронов (10 шт. или 1 шт.)
// ============================================================


const GROCERY = {
  id: "grocery",
  ru: "Бакалея",
  en: "Food & Grocery",
  icon: "🍜",
  src: "Core Rulebook, стр. 331–332 (Vendits / Bodegas), 338–339 (Night Market · Food and Drugs), 351 (Master Gear List), 376 (Services)",
  hint: "Всё днём напролёт: вендиты (стр. 331) и круглосуточные бадеги (стр. 332). Цены — по книжным таблицам.",
  groups: [
    {
      title: "Из вендита / бадеги (упакованное)",
      items: [
        { name: "Ramen Noodles", ru: "Лапша рамен (вендит)", cost: 10, tier: "Cheap", page: "331",
          note: "Типичная еда из вендита (строка «1d10 Food», цена 10–100eb)." },
        { name: "Pizza", ru: "Пицца (вендит)", cost: 20, tier: "Everyday", page: "331",
          note: "Горячая пицца из автомата — одна из самых частых позиций вендита." },
        { name: "Hamburgers", ru: "Гамбургер (вендит)", cost: 20, tier: "Everyday", page: "331",
          note: "Синтетическая котлета в булке; в бадеге бывает «как настоящее мясо»." },
        { name: "Smash (can)", ru: "Smash в банке", cost: 10, tier: "Cheap", page: "331",
          note: "Жёлтая шипучая пена в жестяной банке — продаётся везде (см. также «Расходники»)." },
        { name: "Sushi", ru: "Суши (вендит)", cost: 50, tier: "Costly", page: "331",
          note: "Вакуумная упаковка риса и рыбы; свежая порция дороже." },
        { name: "Hot Meat", ru: "«Горячее мясо» (вендит)", cost: 50, tier: "Costly", page: "331",
          note: "Разогретая мясная порция неизвестного происхождения — уличный деликатес." },
        { name: "1 kg Bag of Kibble", ru: "Киббл, пакет 1 кг", cost: 10, tier: "Cheap", page: "331",
          note: "Пакет сухих вафель/гранул на одну порцию; отличается от собачьего корма только вкусом «чизбургер»." },
        { name: "Canned Coffee", ru: "Кофе в банке", cost: 10, tier: "Cheap", page: "331",
          note: "Банка холодного кофе с кофеиновой дозой." },
        { name: "Canned Juice", ru: "Сок в банке", cost: 10, tier: "Cheap", page: "331",
          note: "Фруктовый сок из концентрата." },
        { name: "Canned Soft Drink", ru: "Газировка в банке", cost: 10, tier: "Cheap", page: "331",
          note: "Сладкая газировка; в бадегах стоит у кассы отдельным рядком." },
        { name: "Canned Goods", ru: "Консервы (общий вид)", cost: 10, tier: "Cheap", page: "338",
          note: "Строка «Canned Goods» ночного рынка: любая консервированная еда." },
        { name: "Packaged Goods", ru: "Фасованные продукты", cost: 10, tier: "Cheap", page: "338",
          note: "Упакованные снеки, крекеры, соевые чипсы." },
        { name: "Frozen Goods", ru: "Заморозка", cost: 10, tier: "Cheap", page: "338",
          note: "Пакеты замороженной еды — держатся только при наличии морозильника." },
        { name: "Bags of Grain", ru: "Мешок зерна", cost: 20, tier: "Everyday", page: "338",
          note: "Сырое зерно: база для похлёбки или перепродажи." },
        { name: "Kibble Pack", ru: "Kibble Pack (одна порция)", cost: 10, tier: "Cheap", page: "351",
          note: "Фольгированный пакет сухих cereal-вафель на один приём пищи; бренд только по номеру." },
        { name: "MRE", ru: "Армейский сухой паёк (MRE)", cost: 10, tier: "Cheap", page: "351",
          note: "Самонагревающийся мешок: добавить воду, щёлкнуть клапан — горячая еда через 2 минуты." },
        { name: "Food Stick", ru: "Пищевой брусок", cost: 10, tier: "Cheap", page: "351",
          note: "Зернистый сухой батончик одного из (мерзких) вкусов — один приём пищи." },
        { name: "Bag of Prepak", ru: "Пакет prepak-еды", cost: 20, tier: "Everyday", page: "339",
          note: "Прессованная готовая еда в упаковке — самый дешёвый способ не голодать." }
      ]
    },
    {
      title: "Свежее и живое (бадега / ночной рынок)",
      items: [
        { name: "Live Chicken", ru: "Живая курица", cost: 50, tier: "Costly", page: "339",
          note: "Птица на убой — редкая роскошь настоящего мяса." },
        { name: "Live Fish", ru: "Живая рыба", cost: 50, tier: "Costly", page: "339",
          note: "Продаётся в ведре с водой; дешевле размороженной, но требует готовки." },
        { name: "Live Pigs", ru: "Поросята", cost: 100, tier: "Premium", page: "339",
          note: "Живой поросёнок: мясо, но нужен уход и место." },
        { name: "Fresh Fruits", ru: "Свежие фрукты", cost: 50, tier: "Costly", page: "339",
          note: "Настоящие фрукты — признак достатка." },
        { name: "Fresh Vegetables", ru: "Свежие овощи", cost: 50, tier: "Costly", page: "339",
          note: "Овощи с гидрофермы или каравана поставщиков." },
        { name: "Root Vegetables", ru: "Корнеплоды", cost: 20, tier: "Everyday", page: "339",
          note: "Картофель, репа, свёкла — самая доступная настоящая еда." },
        { name: "Exotic Fruits", ru: "Экзотические фрукты", cost: 100, tier: "Premium", page: "339",
          note: "Манго, питахайя и прочие чудеса оранжерей." },
        { name: "Exotic Vegetables", ru: "Экзотические овощи", cost: 100, tier: "Premium", page: "339",
          note: "Редкие сорта овощей для гурманов и корпоративных столовых." },
        { name: "Soy Milk", ru: "Соевое молоко", cost: 10, tier: "Cheap", page: "332",
          note: "Картон соевого молока — классика бадеги («отправьте игроков за соевым молоком»)." }
      ]
    },
    {
      title: "Напитки и заведения (стр. 339, 376)",
      items: [
        { name: "Poor Quality Alcohol", ru: "Пьянь низшего сорта", cost: 10, tier: "Cheap", page: "339",
          note: "Самогон «на троих» из подсобки бадеги; ДV на стойкость пригодится." },
        { name: "Alcohol", ru: "Алкоголь (обычный)", cost: 20, tier: "Everyday", page: "339",
          note: "Бутылка крепкого из обычного отдела." },
        { name: "Excellent Quality Alcohol", ru: "Хорошой выдержки алкоголь", cost: 100, tier: "Premium", page: "339",
          note: "Настоящий алкоголь — подарок, который не стыдно принести в гости." },
        { name: "Drink, Dive Bar", ru: "Бокал в грязном баре", cost: 10, tier: "Cheap", page: "376",
          note: "Услуга заведения: кружка разбавленного пива." },
        { name: "Drink, Good Bar", ru: "Бокал в хорошем баре", cost: 10, tier: "Cheap", page: "376",
          note: "Приличная выпивка в приличном месте." },
        { name: "Drink, Excellent Bar", ru: "Бокал в отличном баре", cost: 20, tier: "Everyday", page: "376",
          note: "Коктейль с настоящим спиртом и льдом." },
        { name: "Drink, Executive Bar", ru: "Бокал в корпоративном баре", cost: 50, tier: "Costly", page: "376",
          note: "Бар с охраной, дресс-кодом и ценами для менеджеров." },
        { name: "Restaurant Meal, Fast Food", ru: "Еда в фастфуде", cost: 10, tier: "Cheap", page: "376",
          note: "Быстрый перекус у прилавка." },
        { name: "Restaurant Meal, Good", ru: "Обед в хорошем ресторане", cost: 20, tier: "Everyday", page: "376",
          note: "Садитесь и ешьте — входит в образ жизни Generic Prepak." },
        { name: "Restaurant Meal, Excellent", ru: "Ужин в отличном ресторане", cost: 50, tier: "Costly", page: "376",
          note: "Полноценный ужин с обслуживанием." },
        { name: "Restaurant Meal, World Class", ru: "Ресторан мирового класса", cost: 500, tier: "Expensive", page: "376",
          note: "Столик в лучшем зале Найт-Сити — часть образа жизни Fresh Food." },
        { name: "Taxi", ru: "Такси", cost: 20, tier: "Everyday", page: "376",
          note: "Поездка по городу; водилы торгуются и берут за риск." }
      ]
    }
  ]
};


// 5) ОДЕЖДА И ФЕШЕН (Fashion) — Core Rulebook, стр. 356 + Style & Glamour (стр. 116)

// ДАННЫЕ МАГАЗИНОВ — Cyberpunk RED
// Источник: Data/Cyberpunk Red Core Rulebook v1.25.pdf,
//   «Night Market Appendix» (стр. 340–376) и раздел
//   «The New Street Economy» (стр. 336–377).
// Формат записей:
//   name / ru  — английское название по книге и перевод для отображения
//   cost       — цена в эдди (eb)
//   tier       — градация стоимости по книге (Cheap / Everyday / Costly / …)
//   page       — страница печатного издания (Core Rulebook)
//   note       — краткое описание механики из таблиц книги
//   damage / mag / rof / hands / conceal / skill — оружие (стр. 340–341)
//   sp / penalty                                 — броня (стр. 350)
//   hl / install                                 — киберимпланты (стр. 358–367)
//   size                                         — одежда: Bottoms/Top/Jacket/Footwear/…
//   kind                                         — расходники: ammo / battery / chip / drug
//   unit                                         — единица продажи патронов (10 шт. или 1 шт.)
// ============================================================


const CLOTHING = {
  id: "clothing",
  ru: "Одежда",
  en: "Clothing & Fashion",
  icon: "🧥",
  src: "Core Rulebook, стр. 356 (Fashion), 116 (Style & Glamour Cyberware), 339 (ночной рынок · Clothing and Fashionware)",
  hint: "Каждая модная линия покупается по предметам: низ, верх, куртка, обувь, украшения, зеркальные очки, очки, линзы, головные уборы.",
  groups: [
    {
      title: "Модные линии (Fashion, стр. 356)",
      items: [
        { name: "Bag Lady Chic", ru: "Bag Lady Chic — «бомжатский шик»", cost: 10, tier: "Cheap", size: "все предметы", page: "356",
          tags: "Homeless · Ragged · Vagrant",
          note: "Цены по строке таблицы: Top/Hats/Glasses 10eb, остальное 20eb, Jacket/Footwear 20eb." },
        { name: "Gang Colors", ru: "Gang Colors — «цветa банды»", cost: 20, tier: "Everyday", size: "все предметы", page: "356",
          tags: "Dangerous · Violent · Rebellious",
          note: "Bottoms/Jacket/Jewelry/Mirrorshades 50eb, Top/Footwear/Hats 20eb, Glasses/Contacts 10eb." },
        { name: "Generic Chic", ru: "Generic Chic — «стандартный шик»", cost: 20, tier: "Everyday", size: "все предметы", page: "356",
          tags: "Standard · Colorful · Modular",
          note: "Bottoms/Jacket/Jewelry/Mirrorshades 50eb, Top/Footwear/Hats 20eb, Glasses/Contacts 10eb." },
        { name: "Bohemian", ru: "Bohemian — «бохо»", cost: 20, tier: "Everyday", size: "все предметы", page: "356",
          tags: "Folksy · Retro · Free Spirited",
          note: "Top 20eb; Bottoms/Jacket/Footwear/Jewelry/Mirrorshades/Glasses 50eb; Hats 10eb." },
        { name: "Leisurewear", ru: "Leisurewear — «спортивный стиль»", cost: 20, tier: "Everyday", size: "все предметы", page: "356",
          tags: "Comfort · Agility · Athleticism",
          note: "Top 20eb; Bottoms/Jacket/Jewelry/Mirrorshades 100eb; Footwear/Glasses/Hats 50eb; Contacts 50eb." },
        { name: "Nomad Leathers", ru: "Nomad Leathers — «кожа кочевников»", cost: 20, tier: "Everyday", size: "все предметы", page: "356",
          tags: "Western · Rugged · Tribal",
          note: "Top 20eb; Bottoms/Jacket/Footwear/Jewelry/Mirrorshades 100eb; Glasses 50eb; Hats 20eb; Contacts 100eb." },
        { name: "Asia Pop", ru: "Asia Pop — «японский поп»", cost: 20, tier: "Everyday", size: "все предметы", page: "356",
          tags: "Bright · Costume-like · Youthful",
          note: "Top 20eb; всё остальное (Bottoms, Jacket, Footwear, Jewelry, Mirrorshades, Glasses, Hats, Contacts) 100eb." },
        { name: "Urban Flash", ru: "Urban Flash — «городской блеск»", cost: 20, tier: "Everyday", size: "все предметы", page: "356",
          tags: "Flashy · Technological · Streetwear",
          note: "Top 20eb; всё остальное 100eb." },
        { name: "Businesswear", ru: "Businesswear — «деловой стиль»", cost: 50, tier: "Costly", size: "все предметы", page: "356",
          tags: "Leadership · Presence · Authority",
          note: "Top 50eb; Bottoms/Jacket/Footwear/Jewelry/Glasses/Hats/Contacts 500eb; Mirrorshades 5000eb." },
        { name: "High Fashion", ru: "High Fashion — «высокая мода»", cost: 500, tier: "Expensive", size: "все предметы", page: "356",
          tags: "Exclusive · Designer · Couture",
          note: "Top 500eb; Bottoms/Jacket/Footwear/Jewelry/Glasses/Hats/Contacts 1000eb; Mirrorshades 50000eb." }
      ]
    },
    {
      title: "Предметы одежды (по строкам таблицы, стр. 356)",
      items: [
        { name: "Bottoms", ru: "Низ (брюки, юбка)", cost: 20, tier: "Everyday", size: "Bottoms", page: "356",
          note: "От 10eb (Bag Lady) до 1000eb (High Fashion)." },
        { name: "Top", ru: "Верх (футболка, рубашка)", cost: 20, tier: "Everyday", size: "Top", page: "356",
          note: "Самая дешёвая позиция почти во всех линиях: 10–500eb." },
        { name: "Jacket", ru: "Куртка / пиджак", cost: 20, tier: "Everyday", size: "Jacket", page: "356",
          note: "От 20eb до 5000eb (Businesswear) и 50000eb (High Fashion)." },
        { name: "Footwear", ru: "Обувь", cost: 20, tier: "Everyday", size: "Footwear", page: "356",
          note: "От 10eb до 1000eb." },
        { name: "Jewelry", ru: "Украшения", cost: 10, tier: "Cheap", size: "Jewelry", page: "356",
          note: "От 10eb до 5000eb." },
        { name: "Mirrorshades", ru: "Зеркальные очки", cost: 10, tier: "Cheap", size: "Mirrorshades", page: "356",
          note: "От 10eb до 50000eb за пару." },
        { name: "Glasses", ru: "Очки (корригирующие)", cost: 10, tier: "Cheap", size: "Glasses", page: "356",
          note: "От 10eb до 5000eb; есть Smart Glasses (500eb) — см. «Расходники»/«Кибервар»." },
        { name: "Contact Lenses", ru: "Контактные линзы", cost: 10, tier: "Cheap", size: "Contact Lenses", page: "356",
          note: "От 10eb до 5000eb." },
        { name: "Hats", ru: "Головные уборы", cost: 10, tier: "Cheap", size: "Hats", page: "356",
          note: "От 10eb до 5000eb." }
      ]
    },
    {
      title: "Стиль и гламур (Style & Glamour Cyberware, стр. 116)",
      items: [
        { name: "Biomonitor", ru: "Биомонитор (фешенвар)", cost: 100, tier: "Premium", page: "116",
          note: "Светодиодный дисплей состояния тела под кожей — можно связать с Агентом." },
        { name: "Chemskin", ru: "Хемскин (фешенвар)", cost: 100, tier: "Premium", page: "116",
          note: "Стойкие пигменты кожи: от маскировки дефектов до неоново-зелёного окраса." },
        { name: "EMP Threading", ru: "ЭМП-нити (фешенвар)", cost: 10, tier: "Cheap", page: "116",
          note: "Серебряные «дорожки» по телу: чисто косметика." },
        { name: "Light Tattoo", ru: "Светотатуировка (фешенвар)", cost: 100, tier: "Premium", page: "116",
          note: "Подкожные светящиеся рисунки; большие работы требуют нескольких установок." },
        { name: "Shift Tacts", ru: "Shift Tacts (фешенвар)", cost: 100, tier: "Premium", page: "116",
          note: "Линзы с меняющимся цветом и узором." },
        { name: "Skinwatch", ru: "Skinwatch (фешенвар)", cost: 100, tier: "Premium", page: "116",
          note: "Циферблат времени и даты прямо под кожей." },
        { name: "Techhair", ru: "Techhair (фешенвар)", cost: 100, tier: "Premium", page: "116",
          note: "Искусственные светящиеся волосы с мотором." },
        { name: "Plastic Covering", ru: "Пластиковое покрытие киберконечности", cost: 100, tier: "Premium", page: "367",
          note: "Цветное полимерное покрытие — слот не занимает." },
        { name: "Realskinn™ Covering", ru: "Покрытие Realskinn™", cost: 500, tier: "Expensive", page: "367",
          note: "Искусственная кожа для киберконечности." },
        { name: "Superchrome® Covering", ru: "Покрытие Superchrome®", cost: 1000, tier: "Very Expensive", page: "367",
          note: "Зеркальный хром: +2 к Стилю и одежде." },
        { name: "Personal CarePak", ru: "Набор ухода за собой (CarePak)", cost: 20, tier: "Everyday", page: "351",
          note: "Зубная щётка с пастой, салфетки для всего тела, депиляционная паста, расчёска." },
        { name: "Glow Paint", ru: "Светящаяся краска", cost: 20, tier: "Everyday", page: "351",
          note: "Баллончик фотолюминесцентной краски — для отметок и тегов." }
      ]
    }
  ]
};


// Порядок: 1) cyberware, 2) оружие, 3) расходники, 4) бакалея, 5) одежда.
const SHOPS = [CYBERWARE, WEAPONS, CONSUMABLES, GROCERY, CLOTHING];

/* ------------------------------------------------------------
   [3] ШРИФТЫ PDF — js/pdf-fonts.js (генерируется tools/make_pdf_fonts.py)
   ------------------------------------------------------------ */
// ============================================================
// ШРИФТЫ ДЛЯ PDF-ЭКСПОРТА — ГЕНЕРИРУЕМЫЙ ФАЙЛ, НЕ РЕДАКТИРОВАТЬ!
//
// Источник: DejaVu Sans / DejaVu Sans Bold (свободная лицензия
// Bitstream Vera) — субсеты только нужных символов (кириллица +
// латиница), unitsPerEm = 1000, координаты уже инвертированы под
// систему координат PDF (+1000 по y). Экспортёр (js/exporters.js)
// собирает из этих данных встроенный Type 42 шрифт «на лету»,
// поэтому в PDF корректно отображается русские тексты без
// транслитерации и без внешних файлов шрифтов.
//
// Пересборка: python3 tools/make_pdf_fonts.py
// ============================================================

/* eslint-disable */

const REG_FONT = {
  cp:{32:0,33:1,34:2,35:3,36:4,37:5,38:6,39:7,40:8,41:9,42:10,43:11,44:12,45:13,46:14,47:15,48:16,49:17,50:18,51:19,52:20,53:21,54:22,55:23,56:24,57:25,58:26,59:27,60:28,61:29,62:30,63:31,64:32,65:33,66:34,67:35,68:36,69:37,70:38,71:39,72:40,73:41,74:42,75:43,76:44,77:45,78:46,79:47,80:48,81:49,82:50,83:51,84:52,85:53,86:54,87:55,88:56,89:57,90:58,91:59,92:60,93:61,94:62,95:63,96:64,97:65,98:66,99:67,100:68,101:69,102:70,103:71,104:72,105:73,106:74,107:75,108:76,109:77,110:78,111:79,112:80,113:81,114:82,115:83,116:84,117:85,118:86,119:87,120:88,121:89,122:90,123:91,124:92,125:93,126:94,160:95,169:96,171:97,183:98,187:99,215:100,1025:101,1040:102,1041:103,1042:104,1043:105,1044:106,1045:107,1046:108,1047:109,1048:110,1049:111,1050:112,1051:113,1052:114,1053:115,1054:116,1055:117,1056:118,1057:119,1058:120,1059:121,1060:122,1061:123,1062:124,1063:125,1064:126,1065:127,1066:128,1067:129,1068:130,1069:131,1070:132,1071:133,1072:134,1073:135,1074:136,1075:137,1076:138,1077:139,1078:140,1079:141,1080:142,1081:143,1082:144,1083:145,1084:146,1085:147,1086:148,1087:149,1088:150,1089:151,1090:152,1091:153,1092:154,1093:155,1094:156,1095:157,1096:158,1097:159,1098:160,1099:161,1100:162,1101:163,1102:164,1103:165,8211:166,8212:167,8216:168,8217:169,8220:170,8221:171,8226:172,8230:173,8470:174,9632:175,9679:176},
  adv:{0:318,1:401,2:460,3:838,4:636,5:950,6:780,7:275,8:390,9:390,10:500,11:838,12:318,13:361,14:318,15:337,16:636,17:636,18:636,19:636,20:636,21:636,22:636,23:636,24:636,25:636,26:337,27:337,28:838,29:838,30:838,31:531,32:1000,33:684,34:686,35:698,36:770,37:632,38:575,39:775,40:752,41:295,42:295,43:656,44:557,45:863,46:748,47:787,48:603,49:787,50:695,51:635,52:611,53:732,54:684,55:989,56:685,57:611,58:685,59:390,60:337,61:390,62:838,63:500,64:500,65:613,66:635,67:550,68:635,69:615,70:352,71:635,72:634,73:278,74:278,75:579,76:278,77:974,78:634,79:612,80:635,81:635,82:411,83:521,84:392,85:634,86:592,87:818,88:592,89:592,90:525,91:636,92:337,93:636,94:838,95:318,96:1000,97:612,98:318,99:612,100:838,101:632,102:684,103:686,104:686,105:610,106:781,107:632,108:1077,109:641,110:748,111:748,112:710,113:752,114:863,115:752,116:787,117:752,118:603,119:698,120:611,121:609,122:861,123:685,124:776,125:686,126:1069,127:1094,128:833,129:882,130:686,131:698,132:1080,133:695,134:613,135:617,136:589,137:525,138:691,139:615,140:901,141:532,142:650,143:650,144:604,145:639,146:754,147:654,148:612,149:654,150:635,151:550,152:583,153:592,154:855,155:592,156:681,157:591,158:915,159:942,160:707,161:790,162:589,163:549,164:842,165:602,166:500,167:1000,168:318,169:318,170:518,171:518,172:590,173:1000,174:1040,175:945,176:873},
  asc:928,desc:-236,bbox:[-52,0,1606,2901],
  ng:177,
  glyphs:[
{p:[],f:[],e:[]},
{p:[[151,1124],[250,1124],[250,1000],[151,1000],[151,1729],[250,1729],[250,1409],[240,1235],[161,1235],[151,1409]],f:[1,1,1,1,1,1,1,1,1,1],e:[4,10]},
{p:[[179,1729],[179,1458],[96,1458],[96,1729],[364,1729],[364,1458],[281,1458],[281,1729]],f:[1,1,1,1,1,1,1,1],e:[4,8]},
{p:[[511,1440],[369,1440],[328,1277],[471,1277],[438,1718],[387,1515],[530,1515],[581,1718],[659,1718],[609,1515],[761,1515],[761,1440],[590,1440],[550,1277],[705,1277],[705,1202],[531,1202],[480,1000],[402,1000],[452,1202],[309,1202],[259,1000],[180,1000],[231,1202],[77,1202],[77,1277],[249,1277],[290,1440],[133,1440],[133,1515],[309,1515],[359,1718]],f:[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],e:[4,32]},
{p:[[338,853],[289,853],[289,1000],[237,1001],[135,1023],[83,1045],[83,1133],[133,1102],[235,1070],[289,1069],[289,1292],[181,1310],[83,1394],[83,1467],[83,1546],[189,1638],[289,1645],[289,1760],[338,1760],[338,1646],[383,1645],[468,1629],[509,1616],[509,1531],[468,1551],[383,1574],[338,1576],[338,1367],[449,1350],[553,1262],[553,1186],[553,1104],[442,1008],[338,1001],[289,1376],[289,1576],[232,1570],[173,1518],[173,1475],[173,1433],[228,1386],[338,1282],[338,1071],[400,1079],[463,1133],[463,1177],[463,1220],[403,1271]],f:[1,1,1,0,0,1,1,0,0,1,1,0,0,1,0,0,1,1,1,1,0,0,1,1,0,0,1,1,0,0,1,0,0,1,1,1,0,0,1,0,0,1,1,0,0,1,0,0],e:[34,41,48]},
{p:[[727,1321],[685,1321],[636,1249],[636,1184],[636,1121],[685,1048],[727,1048],[769,1048],[817,1121],[817,1184],[817,1248],[769,1321],[727,1383],[804,1383],[895,1275],[895,1184],[895,1093],[804,986],[727,986],[649,986],[558,1093],[558,1184],[558,1276],[649,1383],[223,1680],[181,1680],[133,1607],[133,1544],[133,1479],[181,1407],[223,1407],[266,1407],[314,1479],[314,1544],[314,1607],[265,1680],[664,1742],[742,1742],[286,986],[208,986],[223,1742],[300,1742],[392,1635],[392,1544],[392,1452],[301,1345],[223,1345],[146,1345],[55,1452],[55,1544],[55,1635],[146,1742]],f:[1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,1,1,1,1,0,0,1,0,0,1,0,0,1,0,0],e:[12,24,36,40,52]},
{p:[[243,1392],[199,1353],[157,1274],[157,1231],[157,1160],[261,1065],[339,1065],[385,1065],[466,1096],[502,1127],[312,1447],[560,1193],[589,1236],[621,1335],[624,1391],[715,1391],[709,1327],[658,1201],[613,1139],[749,1000],[626,1000],[556,1072],[505,1028],[394,986],[330,986],[212,986],[63,1120],[63,1225],[63,1288],[128,1397],[194,1446],[170,1477],[146,1538],[146,1567],[146,1646],[254,1742],[344,1742],[385,1742],[465,1725],[507,1707],[507,1618],[464,1641],[387,1665],[354,1665],[303,1665],[239,1611],[239,1568],[239,1543],[268,1493]],f:[1,0,0,1,0,0,1,0,0,1,1,1,0,0,1,1,0,0,1,1,1,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,1,0,0,1,0,0,1,0,0],e:[10,49]},
{p:[[179,1729],[179,1458],[96,1458],[96,1729]],f:[1,1,1,1],e:[4]},
{p:[[310,1759],[245,1646],[181,1427],[181,1314],[181,1201],[245,980],[310,868],[232,868],[159,983],[86,1205],[86,1314],[86,1423],[158,1644],[232,1759]],f:[1,0,0,1,0,0,1,1,0,0,1,0,0,1],e:[14]},
{p:[[80,1759],[158,1759],[231,1644],[304,1423],[304,1314],[304,1205],[231,983],[158,868],[80,868],[145,980],[209,1201],[209,1314],[209,1427],[145,1646]],f:[1,1,0,0,1,0,0,1,1,0,0,1,0,0],e:[14]},
{p:[[470,1609],[295,1514],[470,1419],[442,1371],[278,1470],[278,1286],[222,1286],[222,1470],[58,1371],[30,1419],[205,1514],[30,1609],[58,1657],[222,1558],[222,1742],[278,1742],[278,1558],[442,1657]],f:[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],e:[18]},
{p:[[460,1627],[460,1355],[732,1355],[732,1272],[460,1272],[460,1000],[378,1000],[378,1272],[106,1272],[106,1355],[378,1355],[378,1627]],f:[1,1,1,1,1,1,1,1,1,1,1,1],e:[12]},
{p:[[117,1124],[220,1124],[220,1040],[140,884],[77,884],[117,1040]],f:[1,1,1,1,1,1],e:[6]},
{p:[[49,1314],[312,1314],[312,1234],[49,1234]],f:[1,1,1,1],e:[4]},
{p:[[107,1124],[210,1124],[210,1000],[107,1000]],f:[1,1,1,1],e:[4]},
{p:[[254,1729],[337,1729],[83,907],[0,907]],f:[1,1,1,1],e:[4]},
{p:[[318,1664],[242,1664],[165,1514],[165,1364],[165,1214],[242,1064],[318,1064],[395,1064],[471,1214],[471,1364],[471,1514],[395,1664],[318,1742],[440,1742],[570,1548],[570,1364],[570,1180],[440,986],[318,986],[195,986],[66,1180],[66,1364],[66,1548],[195,1742]],f:[1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0],e:[12,24]},
{p:[[124,1083],[285,1083],[285,1639],[110,1604],[110,1694],[284,1729],[383,1729],[383,1083],[544,1083],[544,1000],[124,1000]],f:[1,1,1,1,1,1,1,1,1,1,1],e:[11]},
{p:[[192,1083],[536,1083],[536,1000],[73,1000],[73,1083],[129,1141],[323,1337],[348,1365],[396,1418],[433,1492],[433,1528],[433,1586],[352,1659],[286,1659],[240,1659],[137,1627],[78,1594],[78,1694],[138,1718],[241,1742],[284,1742],[397,1742],[532,1629],[532,1534],[532,1489],[499,1409],[454,1354],[442,1340],[311,1205]],f:[1,1,1,1,1,0,0,1,0,0,1,0,0,1,0,0,1,1,0,0,1,0,0,1,0,0,1,0,0],e:[29]},
{p:[[406,1393],[477,1378],[556,1282],[556,1212],[556,1104],[408,986],[271,986],[225,986],[128,1004],[76,1022],[76,1117],[117,1093],[215,1069],[268,1069],[361,1069],[458,1142],[458,1212],[458,1276],[368,1349],[287,1349],[202,1349],[202,1430],[291,1430],[364,1430],[441,1488],[441,1543],[441,1599],[361,1659],[287,1659],[247,1659],[154,1642],[98,1623],[98,1711],[154,1727],[252,1742],[296,1742],[408,1742],[539,1640],[539,1553],[539,1493],[470,1409]],f:[1,0,0,1,0,0,1,0,0,1,1,0,0,1,0,0,1,0,0,1,1,1,1,0,0,1,0,0,1,0,0,1,1,0,0,1,0,0,1,0,0],e:[41]},
{p:[[378,1643],[129,1254],[378,1254],[352,1729],[476,1729],[476,1254],[580,1254],[580,1172],[476,1172],[476,1000],[378,1000],[378,1172],[49,1172],[49,1267]],f:[1,1,1,1,1,1,1,1,1,1,1,1,1,1],e:[3,14]},
{p:[[108,1729],[495,1729],[495,1646],[198,1646],[198,1467],[220,1475],[263,1482],[284,1482],[406,1482],[549,1348],[549,1234],[549,1116],[402,986],[269,986],[223,986],[128,1001],[77,1017],[77,1116],[121,1092],[215,1069],[267,1069],[352,1069],[450,1158],[450,1234],[450,1310],[352,1399],[267,1399],[228,1399],[149,1381],[108,1363]],f:[1,1,1,1,1,0,0,1,0,0,1,0,0,1,0,0,1,1,0,0,1,0,0,1,0,0,1,0,0,1],e:[30]},
{p:[[330,1404],[264,1404],[186,1313],[186,1234],[186,1155],[264,1064],[330,1064],[396,1064],[474,1155],[474,1234],[474,1313],[396,1404],[526,1713],[526,1623],[489,1641],[413,1659],[376,1659],[278,1659],[175,1527],[168,1394],[197,1437],[284,1482],[336,1482],[446,1482],[573,1349],[573,1234],[573,1122],[440,986],[330,986],[204,986],[70,1180],[70,1364],[70,1537],[234,1742],[372,1742],[409,1742],[485,1728]],f:[1,0,0,1,0,0,1,0,0,1,0,0,1,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0],e:[12,37]},
{p:[[82,1729],[551,1729],[551,1687],[286,1000],[183,1000],[432,1646],[82,1646]],f:[1,1,1,1,1,1,1],e:[7]},
{p:[[318,1346],[248,1346],[167,1271],[167,1205],[167,1139],[248,1064],[318,1064],[388,1064],[469,1140],[469,1205],[469,1271],[389,1346],[219,1388],[156,1404],[85,1491],[85,1553],[85,1641],[209,1742],[318,1742],[427,1742],[551,1641],[551,1553],[551,1491],[480,1404],[417,1388],[488,1372],[568,1275],[568,1205],[568,1099],[438,986],[318,986],[197,986],[68,1099],[68,1205],[68,1275],[148,1372],[183,1544],[183,1487],[254,1424],[318,1424],[381,1424],[453,1487],[453,1544],[453,1601],[381,1664],[318,1664],[254,1664],[183,1601]],f:[1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0],e:[12,36,48]},
{p:[[110,1015],[110,1105],[147,1087],[223,1069],[260,1069],[357,1069],[460,1200],[468,1334],[439,1292],[353,1247],[300,1247],[190,1247],[63,1379],[63,1494],[63,1606],[196,1742],[306,1742],[433,1742],[566,1548],[566,1364],[566,1191],[402,986],[264,986],[227,986],[151,1000],[306,1324],[373,1324],[450,1415],[450,1494],[450,1573],[373,1664],[306,1664],[240,1664],[162,1573],[162,1494],[162,1415],[240,1324]],f:[1,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0],e:[25,37]},
{p:[[117,1124],[220,1124],[220,1000],[117,1000],[117,1517],[220,1517],[220,1393],[117,1393]],f:[1,1,1,1,1,1,1,1],e:[4,8]},
{p:[[117,1517],[220,1517],[220,1393],[117,1393],[117,1124],[220,1124],[220,1040],[140,884],[77,884],[117,1040]],f:[1,1,1,1,1,1,1,1,1,1],e:[4,10]},
{p:[[732,1492],[228,1313],[732,1135],[732,1046],[106,1273],[106,1354],[732,1581]],f:[1,1,1,1,1,1,1],e:[7]},
{p:[[106,1454],[732,1454],[732,1372],[106,1372],[106,1255],[732,1255],[732,1172],[106,1172]],f:[1,1,1,1,1,1,1,1],e:[4,8]},
{p:[[106,1492],[106,1581],[732,1354],[732,1273],[106,1046],[106,1135],[609,1313]],f:[1,1,1,1,1,1,1],e:[7]},
{p:[[191,1124],[290,1124],[290,1000],[191,1000],[287,1196],[194,1196],[194,1271],[194,1320],[221,1384],[265,1426],[309,1469],[337,1495],[362,1541],[362,1565],[362,1608],[298,1662],[245,1662],[207,1662],[119,1628],[72,1595],[72,1687],[118,1715],[212,1742],[262,1742],[352,1742],[461,1647],[461,1570],[461,1533],[426,1466],[382,1424],[339,1382],[316,1359],[297,1333],[293,1321],[290,1311],[287,1281],[287,1256]],f:[1,1,1,1,1,1,1,0,0,1,1,0,0,1,0,0,1,0,0,1,1,0,0,1,0,0,1,0,0,1,1,0,0,1,0,0,1],e:[4,37]},
{p:[[372,1262],[372,1192],[441,1113],[502,1113],[562,1113],[631,1193],[631,1262],[631,1331],[561,1411],[501,1411],[442,1411],[372,1331],[638,1116],[609,1079],[533,1043],[483,1043],[399,1043],[294,1165],[294,1262],[294,1360],[399,1482],[483,1482],[533,1482],[609,1445],[638,1408],[638,1472],[708,1472],[708,1113],[779,1124],[860,1232],[860,1319],[860,1371],[829,1463],[798,1502],[747,1566],[601,1634],[515,1634],[455,1634],[345,1602],[298,1571],[221,1521],[135,1359],[135,1265],[135,1188],[191,1052],[244,1000],[295,949],[430,896],[507,896],[570,896],[691,938],[742,978],[786,924],[725,876],[581,826],[507,826],[417,826],[256,890],[194,951],[131,1012],[66,1173],[66,1265],[66,1354],[132,1515],[194,1576],[257,1638],[422,1704],[514,1704],[618,1704],[795,1619],[855,1541],[892,1493],[930,1381],[930,1321],[930,1192],[775,1044],[638,1041]],f:[1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,1,1,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1],e:[12,77]},
{p:[[342,1632],[208,1269],[476,1269],[286,1729],[398,1729],[676,1000],[573,1000],[507,1187],[178,1187],[112,1000],[8,1000]],f:[1,1,1,1,1,1,1,1,1,1,1],e:[3,11]},
{p:[[197,1348],[197,1081],[355,1081],[435,1081],[511,1147],[511,1215],[511,1283],[435,1348],[355,1348],[197,1648],[197,1428],[343,1428],[415,1428],[486,1482],[486,1538],[486,1593],[415,1648],[343,1648],[98,1729],[350,1729],[463,1729],[585,1635],[585,1549],[585,1482],[522,1403],[462,1393],[535,1377],[615,1278],[615,1204],[615,1106],[482,1000],[360,1000],[98,1000]],f:[1,1,1,0,0,1,0,0,1,1,1,1,0,0,1,0,0,1,1,1,0,0,1,0,0,1,0,0,1,0,0,1,1],e:[9,18,33]},
{p:[[644,1673],[644,1569],[594,1615],[481,1661],[418,1661],[293,1661],[160,1508],[160,1364],[160,1220],[293,1067],[418,1067],[481,1067],[594,1113],[644,1159],[644,1056],[592,1021],[477,986],[412,986],[247,986],[56,1188],[56,1364],[56,1540],[247,1742],[412,1742],[478,1742],[593,1708]],f:[1,1,0,0,1,0,0,1,0,0,1,0,0,1,1,0,0,1,0,0,1,0,0,1,0,0],e:[26]},
{p:[[197,1648],[197,1081],[316,1081],[467,1081],[607,1218],[607,1365],[607,1512],[467,1648],[316,1648],[98,1729],[301,1729],[513,1729],[711,1553],[711,1365],[711,1177],[512,1000],[301,1000],[98,1000]],f:[1,1,1,0,0,1,0,0,1,1,1,0,0,1,0,0,1,1],e:[9,18]},
{p:[[98,1729],[559,1729],[559,1646],[197,1646],[197,1430],[544,1430],[544,1347],[197,1347],[197,1083],[568,1083],[568,1000],[98,1000]],f:[1,1,1,1,1,1,1,1,1,1,1,1],e:[12]},
{p:[[98,1729],[517,1729],[517,1646],[197,1646],[197,1431],[486,1431],[486,1348],[197,1348],[197,1000],[98,1000]],f:[1,1,1,1,1,1,1,1,1,1],e:[10]},
{p:[[595,1104],[595,1300],[434,1300],[434,1381],[693,1381],[693,1068],[636,1027],[498,986],[420,986],[249,986],[56,1186],[56,1364],[56,1542],[249,1742],[420,1742],[491,1742],[620,1707],[674,1673],[674,1568],[619,1614],[496,1661],[428,1661],[294,1661],[160,1512],[160,1364],[160,1216],[294,1067],[428,1067],[480,1067],[562,1085]],f:[1,1,1,1,1,1,0,0,1,0,0,1,0,0,1,0,0,1,1,0,0,1,0,0,1,0,0,1,0,0],e:[30]},
{p:[[98,1729],[197,1729],[197,1430],[555,1430],[555,1729],[654,1729],[654,1000],[555,1000],[555,1347],[197,1347],[197,1000],[98,1000]],f:[1,1,1,1,1,1,1,1,1,1,1,1],e:[12]},
{p:[[98,1729],[197,1729],[197,1000],[98,1000]],f:[1,1,1,1],e:[4]},
{p:[[98,1729],[197,1729],[197,1051],[197,919],[97,800],[-14,800],[-52,800],[-52,883],[-21,883],[44,883],[98,956],[98,1051]],f:[1,1,1,0,0,1,1,1,1,0,0,1],e:[12]},
{p:[[98,1729],[197,1729],[197,1421],[524,1729],[651,1729],[289,1389],[677,1000],[547,1000],[197,1351],[197,1000],[98,1000]],f:[1,1,1,1,1,1,1,1,1,1,1],e:[11]},
{p:[[98,1729],[197,1729],[197,1083],[552,1083],[552,1000],[98,1000]],f:[1,1,1,1,1,1],e:[6]},
{p:[[98,1729],[245,1729],[431,1233],[618,1729],[765,1729],[765,1000],[669,1000],[669,1640],[481,1140],[382,1140],[194,1640],[194,1000],[98,1000]],f:[1,1,1,1,1,1,1,1,1,1,1,1,1],e:[13]},
{p:[[98,1729],[231,1729],[554,1119],[554,1729],[650,1729],[650,1000],[517,1000],[194,1610],[194,1000],[98,1000]],f:[1,1,1,1,1,1,1,1,1,1],e:[10]},
{p:[[394,1662],[287,1662],[160,1502],[160,1364],[160,1226],[287,1066],[394,1066],[501,1066],[627,1226],[627,1364],[627,1502],[501,1662],[394,1742],[547,1742],[731,1537],[731,1364],[731,1191],[547,986],[394,986],[240,986],[56,1191],[56,1364],[56,1537],[240,1742]],f:[1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0],e:[12,24]},
{p:[[197,1648],[197,1374],[321,1374],[390,1374],[465,1445],[465,1511],[465,1577],[390,1648],[321,1648],[98,1729],[321,1729],[443,1729],[569,1618],[569,1511],[569,1403],[443,1293],[321,1293],[197,1293],[197,1000],[98,1000]],f:[1,1,1,0,0,1,0,0,1,1,1,0,0,1,0,0,1,1,1,1],e:[9,20]},
{p:[[394,1662],[287,1662],[160,1502],[160,1364],[160,1226],[287,1066],[394,1066],[501,1066],[627,1226],[627,1364],[627,1502],[501,1662],[532,1013],[662,871],[543,871],[435,988],[419,987],[402,986],[394,986],[240,986],[56,1191],[56,1364],[56,1537],[240,1742],[394,1742],[547,1742],[731,1537],[731,1364],[731,1237],[629,1056]],f:[1,0,0,1,0,0,1,0,0,1,0,0,1,1,1,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0],e:[12,30]},
{p:[[444,1342],[476,1331],[536,1261],[566,1199],[666,1000],[560,1000],[467,1187],[431,1260],[363,1308],[304,1308],[197,1308],[197,1000],[98,1000],[98,1729],[321,1729],[446,1729],[569,1625],[569,1519],[569,1450],[505,1359],[197,1648],[197,1389],[321,1389],[392,1389],[465,1455],[465,1519],[465,1583],[392,1648],[321,1648]],f:[1,0,0,1,1,1,1,0,0,1,1,1,1,1,1,0,0,1,0,0,1,1,1,0,0,1,0,0,1],e:[20,29]},
{p:[[535,1705],[535,1609],[479,1636],[379,1662],[333,1662],[252,1662],[165,1600],[165,1542],[165,1494],[223,1444],[304,1429],[364,1417],[474,1396],[579,1290],[579,1201],[579,1095],[437,986],[300,986],[248,986],[131,1009],[69,1032],[69,1134],[129,1100],[244,1066],[300,1066],[384,1066],[476,1132],[476,1194],[476,1248],[410,1308],[335,1323],[275,1335],[165,1357],[66,1451],[66,1534],[66,1631],[202,1742],[322,1742],[373,1742],[479,1724]],f:[1,1,0,0,1,0,0,1,0,0,1,1,0,0,1,0,0,1,0,0,1,1,0,0,1,0,0,1,0,0,1,1,0,0,1,0,0,1,0,0],e:[40]},
{p:[[-3,1729],[614,1729],[614,1646],[355,1646],[355,1000],[256,1000],[256,1646],[-3,1646]],f:[1,1,1,1,1,1,1,1],e:[8]},
{p:[[87,1729],[186,1729],[186,1286],[186,1169],[271,1066],[366,1066],[461,1066],[546,1169],[546,1286],[546,1729],[645,1729],[645,1274],[645,1131],[504,986],[366,986],[228,986],[87,1131],[87,1274]],f:[1,1,1,0,0,1,0,0,1,1,1,1,0,0,1,0,0,1],e:[18]},
{p:[[286,1000],[8,1729],[111,1729],[342,1115],[573,1729],[676,1729],[398,1000]],f:[1,1,1,1,1,1,1],e:[7]},
{p:[[33,1729],[133,1729],[286,1113],[439,1729],[550,1729],[703,1113],[856,1729],[956,1729],[773,1000],[649,1000],[495,1633],[340,1000],[216,1000]],f:[1,1,1,1,1,1,1,1,1,1,1,1,1],e:[13]},
{p:[[63,1729],[169,1729],[350,1458],[532,1729],[638,1729],[404,1379],[654,1000],[548,1000],[343,1310],[136,1000],[30,1000],[290,1389]],f:[1,1,1,1,1,1,1,1,1,1,1,1],e:[12]},
{p:[[-2,1729],[104,1729],[306,1429],[507,1729],[613,1729],[355,1347],[355,1000],[256,1000],[256,1347]],f:[1,1,1,1,1,1,1,1,1],e:[9]},
{p:[[56,1729],[629,1729],[629,1654],[168,1083],[640,1083],[640,1000],[45,1000],[45,1075],[506,1646],[56,1646]],f:[1,1,1,1,1,1,1,1,1,1],e:[10]},
{p:[[86,1760],[293,1760],[293,1690],[176,1690],[176,938],[293,938],[293,868],[86,868]],f:[1,1,1,1,1,1,1,1],e:[8]},
{p:[[83,1729],[337,907],[254,907],[0,1729]],f:[1,1,1,1],e:[4]},
{p:[[304,1760],[304,868],[97,868],[97,938],[214,938],[214,1690],[97,1690],[97,1760]],f:[1,1,1,1,1,1,1,1],e:[8]},
{p:[[467,1729],[732,1457],[634,1457],[419,1650],[204,1457],[106,1457],[371,1729]],f:[1,1,1,1,1,1,1],e:[7]},
{p:[[510,834],[510,764],[-10,764],[-10,834]],f:[1,1,1,1],e:[4]},
{p:[[179,1800],[317,1617],[242,1617],[83,1800]],f:[1,1,1,1],e:[4]},
{p:[[343,1275],[234,1275],[150,1225],[150,1165],[150,1117],[213,1061],[267,1061],[342,1061],[432,1167],[432,1255],[432,1275],[522,1312],[522,1000],[432,1000],[432,1083],[401,1033],[310,986],[243,986],[159,986],[60,1080],[60,1159],[60,1251],[184,1345],[306,1345],[432,1345],[432,1354],[432,1416],[351,1484],[277,1484],[230,1484],[141,1461],[100,1439],[100,1522],[149,1541],[242,1560],[286,1560],[405,1560],[522,1437]],f:[1,0,0,1,0,0,1,0,0,1,1,1,1,1,1,0,0,1,0,0,1,0,0,1,1,1,0,0,1,0,0,1,1,0,0,1,0,0],e:[11,38]},
{p:[[487,1273],[487,1372],[405,1485],[334,1485],[263,1485],[181,1372],[181,1273],[181,1174],[263,1061],[334,1061],[405,1061],[487,1174],[181,1464],[209,1513],[296,1560],[356,1560],[456,1560],[580,1402],[580,1273],[580,1144],[456,986],[356,986],[296,986],[209,1033],[181,1082],[181,1000],[91,1000],[91,1760],[181,1760]],f:[1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,1,1,1,1],e:[12,29]},
{p:[[488,1526],[488,1442],[450,1463],[373,1484],[334,1484],[247,1484],[150,1373],[150,1273],[150,1173],[247,1062],[334,1062],[373,1062],[450,1083],[488,1104],[488,1021],[450,1003],[370,986],[324,986],[201,986],[55,1141],[55,1273],[55,1407],[202,1560],[330,1560],[372,1560],[451,1543]],f:[1,1,0,0,1,0,0,1,0,0,1,0,0,1,1,0,0,1,0,0,1,0,0,1,0,0],e:[26]},
{p:[[454,1464],[454,1760],[544,1760],[544,1000],[454,1000],[454,1082],[426,1033],[339,986],[279,986],[180,986],[55,1144],[55,1273],[55,1402],[180,1560],[279,1560],[339,1560],[426,1513],[148,1273],[148,1174],[229,1061],[301,1061],[372,1061],[454,1174],[454,1273],[454,1372],[372,1485],[301,1485],[229,1485],[148,1372]],f:[1,1,1,1,1,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0],e:[17,29]},
{p:[[562,1296],[562,1252],[149,1252],[155,1159],[255,1062],[344,1062],[396,1062],[493,1087],[541,1113],[541,1028],[493,1007],[391,986],[339,986],[208,986],[55,1138],[55,1268],[55,1402],[200,1560],[323,1560],[434,1560],[562,1418],[472,1322],[471,1396],[391,1484],[324,1484],[249,1484],[159,1399],[152,1322]],f:[1,1,1,0,0,1,0,0,1,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1],e:[21,28]},
{p:[[371,1760],[371,1685],[285,1685],[237,1685],[199,1646],[199,1595],[199,1547],[347,1547],[347,1477],[199,1477],[199,1000],[109,1000],[109,1477],[23,1477],[23,1547],[109,1547],[109,1585],[109,1676],[194,1760],[286,1760]],f:[1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1],e:[20]},
{p:[[454,1280],[454,1377],[374,1485],[301,1485],[229,1485],[148,1377],[148,1280],[148,1183],[229,1075],[301,1075],[374,1075],[454,1183],[544,1068],[544,928],[420,792],[292,792],[245,792],[161,806],[121,821],[121,908],[161,887],[238,866],[278,866],[366,866],[454,958],[454,1052],[454,1096],[426,1048],[339,1000],[279,1000],[178,1000],[55,1153],[55,1280],[55,1407],[178,1560],[279,1560],[339,1560],[426,1512],[454,1464],[454,1547],[544,1547]],f:[1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,1,0,0,1,0,0,1,1,0,0,1,0,0,1,0,0,1,0,0,1,1,1],e:[12,41]},
{p:[[549,1330],[549,1000],[459,1000],[459,1327],[459,1405],[398,1482],[338,1482],[265,1482],[181,1389],[181,1309],[181,1000],[91,1000],[91,1760],[181,1760],[181,1462],[213,1511],[301,1560],[358,1560],[452,1560],[549,1443]],f:[1,1,1,1,0,0,1,0,0,1,1,1,1,1,1,0,0,1,0,0],e:[20]},
{p:[[94,1547],[184,1547],[184,1000],[94,1000],[94,1760],[184,1760],[184,1646],[94,1646]],f:[1,1,1,1,1,1,1,1],e:[4,8]},
{p:[[94,1547],[184,1547],[184,990],[184,886],[104,792],[16,792],[-18,792],[-18,868],[6,868],[57,868],[94,916],[94,990],[94,1760],[184,1760],[184,1646],[94,1646]],f:[1,1,1,0,0,1,1,1,1,0,0,1,1,1,1,1],e:[12,16]},
{p:[[91,1760],[181,1760],[181,1311],[449,1547],[564,1547],[274,1291],[576,1000],[459,1000],[181,1267],[181,1000],[91,1000]],f:[1,1,1,1,1,1,1,1,1,1,1],e:[11]},
{p:[[94,1760],[184,1760],[184,1000],[94,1000]],f:[1,1,1,1],e:[4]},
{p:[[520,1442],[554,1502],[647,1560],[711,1560],[796,1560],[889,1440],[889,1330],[889,1000],[799,1000],[799,1327],[799,1406],[743,1482],[686,1482],[616,1482],[535,1389],[535,1309],[535,1000],[445,1000],[445,1327],[445,1406],[389,1482],[331,1482],[262,1482],[181,1389],[181,1309],[181,1000],[91,1000],[91,1547],[181,1547],[181,1462],[212,1512],[298,1560],[357,1560],[417,1560],[500,1500]],f:[1,0,0,1,0,0,1,1,1,1,0,0,1,0,0,1,1,1,1,0,0,1,0,0,1,1,1,1,1,1,0,0,1,0,0],e:[35]},
{p:[[549,1330],[549,1000],[459,1000],[459,1327],[459,1405],[398,1482],[338,1482],[265,1482],[181,1389],[181,1309],[181,1000],[91,1000],[91,1547],[181,1547],[181,1462],[213,1511],[301,1560],[358,1560],[452,1560],[549,1443]],f:[1,1,1,1,0,0,1,0,0,1,1,1,1,1,1,0,0,1,0,0],e:[20]},
{p:[[306,1484],[234,1484],[150,1371],[150,1273],[150,1175],[233,1062],[306,1062],[378,1062],[462,1175],[462,1273],[462,1370],[378,1484],[306,1560],[423,1560],[557,1408],[557,1273],[557,1139],[423,986],[306,986],[188,986],[55,1139],[55,1273],[55,1408],[188,1560]],f:[1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0],e:[12,24]},
{p:[[181,1082],[181,792],[91,792],[91,1547],[181,1547],[181,1464],[209,1513],[296,1560],[356,1560],[456,1560],[580,1402],[580,1273],[580,1144],[456,986],[356,986],[296,986],[209,1033],[487,1273],[487,1372],[405,1485],[334,1485],[263,1485],[181,1372],[181,1273],[181,1174],[263,1061],[334,1061],[405,1061],[487,1174]],f:[1,1,1,1,1,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0],e:[17,29]},
{p:[[148,1273],[148,1174],[229,1061],[301,1061],[372,1061],[454,1174],[454,1273],[454,1372],[372,1485],[301,1485],[229,1485],[148,1372],[454,1082],[426,1033],[339,986],[279,986],[180,986],[55,1144],[55,1273],[55,1402],[180,1560],[279,1560],[339,1560],[426,1513],[454,1464],[454,1547],[544,1547],[544,792],[454,792]],f:[1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,1,1,1,1],e:[12,29]},
{p:[[411,1463],[396,1472],[360,1480],[339,1480],[263,1480],[181,1381],[181,1288],[181,1000],[91,1000],[91,1547],[181,1547],[181,1462],[209,1512],[300,1560],[365,1560],[375,1560],[397,1558],[411,1555]],f:[1,0,0,1,0,0,1,1,1,1,1,1,0,0,1,0,0,1],e:[18]},
{p:[[443,1531],[443,1446],[405,1465],[323,1485],[279,1485],[212,1485],[145,1444],[145,1403],[145,1372],[193,1336],[265,1320],[296,1313],[392,1292],[472,1218],[472,1151],[472,1075],[352,986],[246,986],[202,986],[107,1003],[54,1020],[54,1113],[104,1087],[201,1061],[248,1061],[312,1061],[380,1104],[380,1144],[380,1181],[331,1220],[247,1238],[216,1245],[132,1263],[58,1335],[58,1399],[58,1476],[167,1560],[268,1560],[318,1560],[406,1545]],f:[1,1,0,0,1,0,0,1,0,0,1,1,0,0,1,0,0,1,0,0,1,1,0,0,1,0,0,1,0,0,1,1,0,0,1,0,0,1,0,0],e:[40]},
{p:[[183,1702],[183,1547],[368,1547],[368,1477],[183,1477],[183,1180],[183,1113],[220,1075],[276,1075],[368,1075],[368,1000],[276,1000],[172,1000],[93,1078],[93,1180],[93,1477],[27,1477],[27,1547],[93,1547],[93,1702]],f:[1,1,1,1,1,1,0,0,1,1,1,1,0,0,1,1,1,1,1,1],e:[20]},
{p:[[85,1216],[85,1547],[175,1547],[175,1219],[175,1142],[235,1064],[296,1064],[369,1064],[453,1157],[453,1237],[453,1547],[543,1547],[543,1000],[453,1000],[453,1084],[420,1034],[334,986],[277,986],[183,986],[85,1103],[311,1560]],f:[1,1,1,1,0,0,1,0,0,1,1,1,1,1,1,0,0,1,0,0,1],e:[20,21]},
{p:[[30,1547],[125,1547],[296,1088],[467,1547],[562,1547],[357,1000],[235,1000]],f:[1,1,1,1,1,1,1],e:[7]},
{p:[[42,1547],[132,1547],[244,1120],[356,1547],[462,1547],[574,1120],[686,1547],[776,1547],[633,1000],[527,1000],[409,1448],[291,1000],[185,1000]],f:[1,1,1,1,1,1,1,1,1,1,1,1,1],e:[13]},
{p:[[549,1547],[351,1281],[559,1000],[453,1000],[294,1215],[135,1000],[29,1000],[241,1286],[47,1547],[153,1547],[298,1352],[443,1547]],f:[1,1,1,1,1,1,1,1,1,1,1,1],e:[12]},
{p:[[322,949],[284,852],[211,792],[151,792],[79,792],[79,867],[132,867],[169,867],[210,902],[235,968],[251,1009],[30,1547],[125,1547],[296,1119],[467,1547],[562,1547]],f:[1,0,0,1,1,1,1,0,0,1,1,1,1,1,1,1],e:[16]},
{p:[[55,1547],[482,1547],[482,1465],[144,1072],[482,1072],[482,1000],[43,1000],[43,1082],[381,1475],[55,1475]],f:[1,1,1,1,1,1,1,1,1,1],e:[10]},
{p:[[511,907],[511,837],[481,837],[359,837],[277,909],[277,1017],[277,1134],[277,1208],[224,1264],[155,1264],[125,1264],[125,1334],[155,1334],[225,1334],[277,1390],[277,1463],[277,1580],[277,1688],[359,1760],[481,1760],[511,1760],[511,1690],[478,1690],[409,1690],[367,1647],[367,1578],[367,1457],[367,1380],[323,1311],[269,1299],[323,1286],[367,1216],[367,1140],[367,1019],[367,950],[409,907],[478,907]],f:[1,1,1,0,0,1,1,0,0,1,1,1,1,0,0,1,1,0,0,1,1,1,1,0,0,1,1,0,0,1,0,0,1,1,0,0,1],e:[37]},
{p:[[210,1764],[210,764],[127,764],[127,1764]],f:[1,1,1,1],e:[4]},
{p:[[125,907],[159,907],[228,907],[269,949],[269,1019],[269,1140],[269,1216],[313,1286],[367,1299],[313,1311],[269,1380],[269,1457],[269,1578],[269,1647],[228,1690],[159,1690],[125,1690],[125,1760],[156,1760],[277,1760],[359,1688],[359,1580],[359,1463],[359,1390],[412,1334],[481,1334],[511,1334],[511,1264],[481,1264],[412,1264],[359,1208],[359,1134],[359,1017],[359,909],[277,837],[156,837],[125,837]],f:[1,1,0,0,1,1,0,0,1,0,0,1,1,0,0,1,1,1,1,0,0,1,1,0,0,1,1,1,1,0,0,1,1,0,0,1,1],e:[37]},
{p:[[732,1399],[732,1312],[681,1273],[593,1240],[546,1240],[492,1240],[421,1269],[416,1271],[413,1272],[410,1273],[402,1276],[327,1306],[281,1306],[238,1306],[154,1269],[106,1228],[106,1315],[157,1354],[245,1387],[292,1387],[346,1387],[417,1358],[422,1356],[425,1355],[429,1354],[436,1351],[511,1321],[557,1321],[599,1321],[682,1358]],f:[1,1,0,0,1,0,1,0,1,0,1,0,1,0,0,1,1,0,0,1,0,1,0,1,0,1,0,1,0,0],e:[30]},
{p:[],f:[],e:[]},
{p:[[500,1725],[574,1725],[703,1671],[756,1618],[809,1565],[862,1437],[862,1362],[862,1288],[809,1160],[756,1107],[703,1054],[574,1000],[500,1000],[426,1000],[297,1054],[244,1107],[191,1160],[138,1288],[138,1362],[138,1437],[191,1565],[244,1618],[297,1671],[426,1725],[500,1675],[436,1675],[326,1629],[280,1583],[234,1537],[187,1425],[187,1362],[187,1299],[234,1188],[280,1142],[326,1096],[436,1050],[500,1050],[564,1050],[675,1096],[721,1142],[767,1188],[812,1298],[812,1362],[812,1427],[766,1538],[721,1583],[675,1629],[564,1675],[646,1555],[646,1492],[614,1508],[550,1524],[518,1524],[445,1524],[364,1438],[364,1362],[364,1284],[447,1199],[523,1199],[554,1199],[614,1214],[646,1231],[646,1169],[613,1155],[546,1141],[512,1141],[407,1141],[284,1260],[284,1362],[284,1464],[407,1582],[512,1582],[548,1582],[614,1568]],f:[1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,1,0,0,1,0,0,1,0,0,1,0,0,1,1,0,0,1,0,0,1,0,0,1,0,0],e:[24,48,74]},
{p:[[518,1517],[518,1424],[371,1293],[518,1162],[518,1069],[289,1273],[289,1313],[306,1517],[306,1424],[159,1293],[306,1162],[306,1069],[77,1273],[77,1313]],f:[1,1,1,1,1,1,1,1,1,1,1,1,1,1],e:[7,14]},
{p:[[107,1409],[210,1409],[210,1285],[107,1285]],f:[1,1,1,1],e:[4]},
{p:[[94,1517],[323,1313],[323,1273],[94,1069],[94,1162],[241,1293],[94,1424],[306,1517],[535,1313],[535,1273],[306,1069],[306,1162],[453,1293],[306,1424]],f:[1,1,1,1,1,1,1,1,1,1,1,1,1,1],e:[7,14]},
{p:[[701,1537],[478,1313],[701,1090],[643,1031],[419,1255],[195,1031],[137,1090],[360,1313],[137,1537],[195,1596],[419,1372],[643,1596]],f:[1,1,1,1,1,1,1,1,1,1,1,1],e:[12]},
{p:[[98,1729],[559,1729],[559,1646],[197,1646],[197,1430],[544,1430],[544,1347],[197,1347],[197,1083],[568,1083],[568,1000],[98,1000],[373,1913],[472,1913],[472,1814],[373,1814],[182,1913],[281,1913],[281,1814],[182,1814]],f:[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],e:[12,16,20]},
{p:[[342,1632],[208,1269],[476,1269],[286,1729],[398,1729],[676,1000],[573,1000],[507,1187],[178,1187],[112,1000],[8,1000]],f:[1,1,1,1,1,1,1,1,1,1,1],e:[3,11]},
{p:[[511,1214],[511,1282],[435,1348],[355,1348],[197,1348],[197,1081],[355,1081],[435,1081],[511,1147],[564,1729],[564,1648],[197,1648],[197,1429],[360,1429],[482,1429],[615,1323],[615,1214],[615,1106],[487,1000],[360,1000],[98,1000],[98,1729]],f:[1,0,0,1,1,1,1,0,0,1,1,1,1,1,0,0,1,0,0,1,1,1],e:[9,22]},
{p:[[197,1348],[197,1081],[355,1081],[435,1081],[511,1147],[511,1215],[511,1283],[435,1348],[355,1348],[197,1648],[197,1428],[343,1428],[415,1428],[486,1482],[486,1538],[486,1593],[415,1648],[343,1648],[98,1729],[350,1729],[463,1729],[585,1635],[585,1549],[585,1482],[522,1403],[462,1393],[535,1377],[615,1278],[615,1204],[615,1106],[482,1000],[360,1000],[98,1000]],f:[1,1,1,0,0,1,0,0,1,1,1,1,0,0,1,0,0,1,1,1,0,0,1,0,0,1,0,0,1,0,0,1,1],e:[9,18,33]},
{p:[[98,1000],[98,1729],[552,1729],[552,1646],[197,1646],[197,1000]],f:[1,1,1,1,1,1],e:[6]},
{p:[[228,1083],[550,1083],[550,1646],[313,1646],[313,1542],[313,1299],[259,1137],[248,1104],[84,1083],[149,1114],[168,1172],[215,1323],[215,1591],[215,1729],[649,1729],[649,1083],[732,1083],[732,843],[649,843],[649,1000],[132,1000],[132,843],[49,843],[49,1083]],f:[1,1,1,1,1,0,1,0,1,0,1,0,1,1,1,1,1,1,1,1,1,1,1,1],e:[8,24]},
{p:[[98,1729],[559,1729],[559,1646],[197,1646],[197,1430],[544,1430],[544,1347],[197,1347],[197,1083],[568,1083],[568,1000],[98,1000]],f:[1,1,1,1,1,1,1,1,1,1,1,1],e:[12]},
{p:[[489,1729],[588,1729],[588,1369],[921,1729],[1041,1729],[774,1441],[1058,1000],[955,1000],[714,1375],[588,1239],[588,1000],[489,1000],[489,1239],[363,1375],[123,1000],[20,1000],[303,1441],[37,1729],[156,1729],[489,1369]],f:[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],e:[20]},
{p:[[286,1742],[406,1742],[558,1640],[558,1553],[558,1493],[489,1409],[425,1393],[496,1378],[575,1282],[575,1212],[575,1100],[402,986],[286,986],[226,986],[87,1018],[66,1032],[66,1133],[141,1090],[223,1069],[284,1069],[375,1069],[477,1139],[477,1212],[477,1276],[387,1349],[292,1349],[192,1349],[192,1430],[295,1430],[383,1430],[460,1488],[460,1543],[460,1599],[380,1659],[284,1659],[218,1659],[173,1647],[73,1610],[73,1706],[128,1726],[244,1742]],f:[1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,1,0,0,1,0,0,1,0,0,1,1,1,1,0,0,1,0,0,1,0,0,1,1,0,0],e:[41]},
{p:[[650,1729],[650,1000],[554,1000],[554,1610],[231,1000],[98,1000],[98,1729],[194,1729],[194,1119],[517,1729]],f:[1,1,1,1,1,1,1,1,1,1],e:[10]},
{p:[[650,1729],[650,1000],[554,1000],[554,1610],[231,1000],[98,1000],[98,1729],[194,1729],[194,1119],[517,1729],[217,1928],[274,1928],[281,1902],[329,1874],[370,1874],[410,1874],[457,1901],[465,1928],[522,1928],[518,1870],[439,1810],[370,1810],[299,1810],[222,1870]],f:[1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,0,0,1,1,0,0,1,0,0],e:[10,24]},
{p:[[98,1729],[197,1729],[197,1369],[549,1729],[676,1729],[394,1441],[690,1000],[583,1000],[330,1375],[197,1239],[197,1000],[98,1000]],f:[1,1,1,1,1,1,1,1,1,1,1,1],e:[12]},
{p:[[41,1000],[41,1083],[147,1106],[177,1186],[220,1312],[220,1605],[220,1729],[653,1729],[653,1000],[555,1000],[555,1646],[318,1646],[318,1556],[318,1280],[268,1151],[220,1027]],f:[1,1,0,1,0,1,1,1,1,1,1,1,1,0,1,0],e:[16]},
{p:[[98,1729],[245,1729],[431,1233],[618,1729],[765,1729],[765,1000],[669,1000],[669,1640],[481,1140],[382,1140],[194,1640],[194,1000],[98,1000]],f:[1,1,1,1,1,1,1,1,1,1,1,1,1],e:[13]},
{p:[[98,1729],[197,1729],[197,1430],[555,1430],[555,1729],[654,1729],[654,1000],[555,1000],[555,1347],[197,1347],[197,1000],[98,1000]],f:[1,1,1,1,1,1,1,1,1,1,1,1],e:[12]},
{p:[[394,1662],[287,1662],[160,1502],[160,1364],[160,1226],[287,1066],[394,1066],[501,1066],[627,1226],[627,1364],[627,1502],[501,1662],[394,1742],[547,1742],[731,1537],[731,1364],[731,1191],[547,986],[394,986],[240,986],[56,1191],[56,1364],[56,1537],[240,1742]],f:[1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0],e:[12,24]},
{p:[[654,1729],[654,1000],[555,1000],[555,1646],[197,1646],[197,1000],[98,1000],[98,1729]],f:[1,1,1,1,1,1,1,1],e:[8]},
{p:[[197,1648],[197,1374],[321,1374],[390,1374],[465,1445],[465,1511],[465,1577],[390,1648],[321,1648],[98,1729],[321,1729],[443,1729],[569,1618],[569,1511],[569,1403],[443,1293],[321,1293],[197,1293],[197,1000],[98,1000]],f:[1,1,1,0,0,1,0,0,1,1,1,0,0,1,0,0,1,1,1,1],e:[9,20]},
{p:[[644,1673],[644,1569],[594,1615],[481,1661],[418,1661],[293,1661],[160,1508],[160,1364],[160,1220],[293,1067],[418,1067],[481,1067],[594,1113],[644,1159],[644,1056],[592,1021],[477,986],[412,986],[247,986],[56,1188],[56,1364],[56,1540],[247,1742],[412,1742],[478,1742],[593,1708]],f:[1,1,0,0,1,0,0,1,0,0,1,0,0,1,1,0,0,1,0,0,1,0,0,1,0,0],e:[26]},
{p:[[-3,1729],[614,1729],[614,1646],[355,1646],[355,1000],[256,1000],[256,1646],[-3,1646]],f:[1,1,1,1,1,1,1,1],e:[8]},
{p:[[320,1088],[310,1064],[294,1045],[255,1000],[133,1000],[95,1000],[95,1083],[126,1083],[184,1083],[207,1096],[220,1104],[229,1125],[251,1177],[17,1729],[123,1729],[304,1301],[486,1729],[592,1729]],f:[1,0,1,0,1,1,1,1,0,1,0,1,1,1,1,1,1,1],e:[18]},
{p:[[381,1579],[275,1569],[163,1470],[163,1374],[163,1277],[275,1178],[381,1168],[480,1168],[586,1178],[698,1277],[698,1374],[698,1470],[586,1569],[480,1579],[381,1087],[227,1098],[59,1244],[59,1374],[59,1503],[227,1650],[381,1661],[381,1729],[480,1729],[480,1661],[635,1650],[802,1504],[802,1374],[802,1244],[635,1098],[480,1087],[480,1000],[381,1000]],f:[1,0,0,1,0,0,1,1,0,0,1,0,0,1,1,0,0,1,0,0,1,1,1,1,0,0,1,0,0,1,1,1],e:[7,14,32]},
{p:[[63,1729],[169,1729],[350,1458],[532,1729],[638,1729],[404,1379],[654,1000],[548,1000],[343,1310],[136,1000],[30,1000],[290,1389]],f:[1,1,1,1,1,1,1,1,1,1,1,1],e:[12]},
{p:[[654,1000],[98,1000],[98,1729],[197,1729],[197,1083],[555,1083],[555,1729],[654,1729],[654,1083],[737,1083],[737,843],[654,843]],f:[1,1,1,1,1,1,1,1,1,1,1,1],e:[12]},
{p:[[488,1000],[488,1299],[285,1299],[194,1299],[85,1413],[85,1529],[85,1729],[184,1729],[184,1537],[184,1459],[244,1382],[305,1382],[488,1382],[488,1729],[587,1729],[587,1000]],f:[1,1,1,0,0,1,1,1,1,0,0,1,1,1,1,1],e:[16]},
{p:[[584,1083],[873,1083],[873,1729],[971,1729],[971,1000],[98,1000],[98,1729],[197,1729],[197,1083],[485,1083],[485,1729],[584,1729]],f:[1,1,1,1,1,1,1,1,1,1,1,1],e:[12]},
{p:[[971,1000],[98,1000],[98,1729],[197,1729],[197,1083],[485,1083],[485,1729],[584,1729],[584,1083],[873,1083],[873,1729],[971,1729],[971,1083],[1054,1083],[1054,843],[971,843]],f:[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],e:[16]},
{p:[[245,1000],[245,1646],[29,1646],[29,1729],[343,1729],[343,1429],[506,1429],[629,1429],[762,1323],[762,1214],[762,1106],[629,1000],[506,1000],[658,1214],[658,1282],[619,1315],[581,1348],[501,1348],[343,1348],[343,1081],[501,1081],[580,1081],[619,1114],[658,1147]],f:[1,1,1,1,1,1,1,0,0,1,0,0,1,1,0,1,0,1,1,1,1,0,1,0],e:[13,24]},
{p:[[511,1214],[511,1282],[473,1315],[435,1348],[355,1348],[197,1348],[197,1081],[355,1081],[435,1081],[473,1114],[511,1147],[98,1729],[197,1729],[197,1429],[360,1429],[482,1429],[615,1323],[615,1214],[615,1106],[482,1000],[360,1000],[98,1000],[686,1729],[784,1729],[784,1000],[686,1000]],f:[1,0,1,0,1,1,1,1,0,1,0,1,1,1,1,0,0,1,0,0,1,1,1,1,1,1],e:[11,22,26]},
{p:[[511,1214],[511,1282],[473,1315],[435,1348],[355,1348],[197,1348],[197,1081],[355,1081],[435,1081],[473,1114],[511,1147],[98,1729],[197,1729],[197,1429],[360,1429],[482,1429],[615,1323],[615,1214],[615,1106],[482,1000],[360,1000],[98,1000]],f:[1,0,1,0,1,1,1,1,0,1,0,1,1,1,1,0,0,1,0,0,1,1],e:[11,22]},
{p:[[54,1159],[157,1067],[282,1067],[411,1067],[527,1206],[538,1322],[148,1322],[148,1405],[538,1405],[527,1522],[411,1661],[282,1661],[157,1661],[54,1569],[54,1673],[156,1742],[288,1742],[452,1742],[642,1540],[642,1364],[642,1188],[452,986],[288,986],[158,986],[54,1056]],f:[1,0,1,0,0,1,1,1,1,0,0,1,0,1,1,0,1,0,0,1,0,0,1,0,1],e:[25]},
{p:[[687,1662],[579,1662],[516,1582],[453,1502],[453,1364],[453,1226],[516,1146],[579,1066],[687,1066],[794,1066],[856,1146],[919,1226],[919,1364],[919,1502],[856,1582],[794,1662],[350,1406],[357,1542],[445,1643],[533,1742],[687,1742],[840,1742],[932,1640],[1023,1537],[1023,1364],[1023,1191],[932,1089],[840,986],[687,986],[533,986],[445,1086],[357,1186],[350,1323],[202,1323],[202,1000],[103,1000],[103,1729],[202,1729],[202,1406]],f:[1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,1,1,1,1,1,1],e:[16,39]},
{p:[[201,1519],[201,1455],[273,1389],[345,1389],[498,1389],[498,1648],[345,1648],[273,1648],[201,1583],[66,1000],[266,1319],[217,1332],[92,1414],[92,1519],[92,1620],[219,1729],[345,1729],[597,1729],[597,1000],[498,1000],[498,1308],[366,1308],[174,1000]],f:[1,0,0,1,1,1,1,0,0,1,1,0,0,1,0,0,1,1,1,1,1,1,1],e:[9,23]},
{p:[[343,1275],[234,1275],[150,1225],[150,1165],[150,1117],[213,1061],[267,1061],[342,1061],[432,1167],[432,1255],[432,1275],[522,1312],[522,1000],[432,1000],[432,1083],[401,1033],[310,986],[243,986],[159,986],[60,1080],[60,1159],[60,1251],[184,1345],[306,1345],[432,1345],[432,1354],[432,1416],[351,1484],[277,1484],[230,1484],[141,1461],[100,1439],[100,1522],[149,1541],[242,1560],[286,1560],[405,1560],[522,1437]],f:[1,0,0,1,0,0,1,0,0,1,1,1,1,1,1,0,0,1,0,0,1,0,0,1,1,1,0,0,1,0,0,1,1,0,0,1,0,0],e:[11,38]},
{p:[[311,1560],[428,1560],[562,1408],[562,1273],[562,1139],[428,986],[311,986],[193,986],[63,1134],[60,1273],[57,1385],[55,1443],[55,1463],[55,1541],[83,1599],[127,1689],[281,1767],[410,1768],[470,1769],[496,1777],[521,1706],[497,1696],[475,1695],[353,1687],[292,1683],[254,1661],[157,1604],[148,1529],[145,1502],[208,1560],[311,1484],[239,1484],[155,1371],[155,1273],[155,1175],[238,1062],[311,1062],[383,1062],[467,1175],[467,1273],[467,1370],[383,1484]],f:[1,0,0,1,0,0,1,0,0,1,1,0,1,0,1,0,0,1,0,1,1,0,1,1,0,1,0,1,1,0,1,0,0,1,0,0,1,0,0,1,0,0],e:[30,42]},
{p:[[181,1252],[181,1072],[309,1072],[370,1072],[435,1118],[435,1162],[435,1206],[370,1252],[309,1252],[181,1475],[181,1324],[299,1324],[350,1324],[414,1364],[414,1400],[414,1437],[350,1475],[299,1475],[91,1547],[305,1547],[401,1547],[504,1477],[504,1412],[504,1361],[452,1302],[400,1295],[462,1283],[530,1209],[530,1153],[530,1080],[417,1000],[313,1000],[91,1000]],f:[1,1,1,0,0,1,0,0,1,1,1,1,0,0,1,0,0,1,1,1,0,0,1,0,0,1,0,0,1,0,0,1,1],e:[9,18,33]},
{p:[[91,1000],[91,1547],[477,1547],[477,1475],[181,1475],[181,1000]],f:[1,1,1,1,1,1],e:[6]},
{p:[[216,1072],[477,1072],[477,1475],[288,1475],[288,1407],[288,1206],[230,1098],[86,1072],[130,1091],[150,1133],[198,1236],[198,1443],[198,1547],[567,1547],[567,1072],[639,1072],[639,862],[567,862],[567,1000],[124,1000],[124,862],[52,862],[52,1072]],f:[1,1,1,1,1,0,1,1,0,1,0,1,1,1,1,1,1,1,1,1,1,1,1],e:[7,23]},
{p:[[562,1296],[562,1252],[149,1252],[155,1159],[255,1062],[344,1062],[396,1062],[493,1087],[541,1113],[541,1028],[493,1007],[391,986],[339,986],[208,986],[55,1138],[55,1268],[55,1402],[200,1560],[323,1560],[434,1560],[562,1418],[472,1322],[471,1396],[391,1484],[324,1484],[249,1484],[159,1399],[152,1322]],f:[1,1,1,0,0,1,0,0,1,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1],e:[21,28]},
{p:[[406,1547],[495,1547],[495,1290],[734,1547],[838,1547],[642,1336],[867,1000],[771,1000],[586,1276],[495,1178],[495,1000],[406,1000],[406,1178],[314,1276],[130,1000],[34,1000],[259,1336],[62,1547],[167,1547],[406,1290]],f:[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],e:[20]},
{p:[[345,1295],[405,1283],[473,1212],[473,1159],[473,1075],[347,986],[230,986],[191,986],[109,1000],[65,1013],[65,1097],[100,1079],[183,1061],[228,1061],[302,1061],[384,1115],[384,1159],[384,1202],[311,1254],[244,1254],[172,1254],[172,1329],[248,1329],[304,1329],[370,1372],[370,1406],[370,1438],[302,1482],[244,1482],[209,1482],[131,1470],[83,1456],[83,1537],[131,1549],[214,1561],[251,1561],[347,1561],[458,1484],[458,1415],[458,1370],[399,1307]],f:[1,0,0,1,0,0,1,0,0,1,1,0,0,1,0,0,1,0,0,1,1,1,1,0,0,1,0,0,1,0,0,1,1,0,0,1,0,0,1,0,0],e:[41]},
{p:[[559,1547],[559,1000],[470,1000],[470,1439],[206,1000],[91,1000],[91,1547],[180,1547],[180,1109],[443,1547]],f:[1,1,1,1,1,1,1,1,1,1],e:[10]},
{p:[[559,1547],[559,1000],[470,1000],[470,1439],[206,1000],[91,1000],[91,1547],[180,1547],[180,1109],[443,1547],[172,1760],[230,1760],[235,1723],[283,1687],[325,1687],[367,1687],[414,1723],[420,1760],[478,1760],[473,1690],[396,1620],[325,1620],[254,1620],[177,1690]],f:[1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,0,0,1,1,0,0,1,0,0],e:[10,24]},
{p:[[91,1547],[180,1547],[180,1290],[434,1547],[544,1547],[335,1335],[571,1000],[470,1000],[276,1276],[180,1178],[180,1000],[91,1000]],f:[1,1,1,1,1,1,1,1,1,1,1,1],e:[12]},
{p:[[37,1000],[37,1075],[126,1088],[153,1150],[187,1236],[187,1458],[187,1547],[556,1547],[556,1000],[466,1000],[466,1475],[276,1475],[276,1421],[276,1210],[233,1115],[188,1014]],f:[1,1,0,1,0,1,1,1,1,1,1,1,1,0,1,0],e:[16]},
{p:[[91,1547],[222,1547],[377,1181],[533,1547],[664,1547],[664,1000],[573,1000],[573,1461],[422,1105],[333,1105],[181,1461],[181,1000],[91,1000]],f:[1,1,1,1,1,1,1,1,1,1,1,1,1],e:[13]},
{p:[[91,1547],[181,1547],[181,1324],[473,1324],[473,1547],[563,1547],[563,1000],[473,1000],[473,1252],[181,1252],[181,1000],[91,1000]],f:[1,1,1,1,1,1,1,1,1,1,1,1],e:[12]},
{p:[[306,1484],[234,1484],[150,1371],[150,1273],[150,1175],[233,1062],[306,1062],[378,1062],[462,1175],[462,1273],[462,1370],[378,1484],[306,1560],[423,1560],[557,1408],[557,1273],[557,1139],[423,986],[306,986],[188,986],[55,1139],[55,1273],[55,1408],[188,1560]],f:[1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0],e:[12,24]},
{p:[[563,1547],[563,1000],[473,1000],[473,1475],[181,1475],[181,1000],[91,1000],[91,1547]],f:[1,1,1,1,1,1,1,1],e:[8]},
{p:[[181,1082],[181,792],[91,792],[91,1547],[181,1547],[181,1464],[209,1513],[296,1560],[356,1560],[456,1560],[580,1402],[580,1273],[580,1144],[456,986],[356,986],[296,986],[209,1033],[487,1273],[487,1372],[405,1485],[334,1485],[263,1485],[181,1372],[181,1273],[181,1174],[263,1061],[334,1061],[405,1061],[487,1174]],f:[1,1,1,1,1,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0],e:[17,29]},
{p:[[488,1526],[488,1442],[450,1463],[373,1484],[334,1484],[247,1484],[150,1373],[150,1273],[150,1173],[247,1062],[334,1062],[373,1062],[450,1083],[488,1104],[488,1021],[450,1003],[370,986],[324,986],[201,986],[55,1141],[55,1273],[55,1407],[202,1560],[330,1560],[372,1560],[451,1543]],f:[1,1,0,0,1,0,0,1,0,0,1,0,0,1,1,0,0,1,0,0,1,0,0,1,0,0],e:[26]},
{p:[[29,1547],[553,1547],[553,1475],[335,1475],[335,1000],[247,1000],[247,1475],[29,1475]],f:[1,1,1,1,1,1,1,1],e:[8]},
{p:[[322,949],[284,852],[211,792],[151,792],[79,792],[79,867],[132,867],[169,867],[210,902],[235,968],[251,1009],[30,1547],[125,1547],[296,1119],[467,1547],[562,1547]],f:[1,0,0,1,1,1,1,0,0,1,1,1,1,1,1,1],e:[16]},
{p:[[148,1273],[148,1158],[219,1061],[279,1061],[327,1061],[382,1143],[382,1403],[327,1485],[279,1485],[219,1485],[148,1388],[382,792],[382,1070],[354,1024],[291,986],[250,986],[168,986],[55,1137],[55,1271],[55,1405],[168,1560],[250,1560],[291,1560],[354,1523],[382,1477],[382,1729],[473,1729],[473,1477],[500,1523],[564,1560],[605,1560],[687,1560],[800,1405],[800,1271],[800,1137],[687,986],[605,986],[564,986],[500,1024],[473,1070],[473,792],[707,1273],[707,1388],[636,1485],[576,1485],[528,1485],[473,1403],[473,1143],[528,1061],[576,1061],[636,1061],[707,1158]],f:[1,0,0,1,0,1,1,0,1,0,0,1,1,0,0,1,0,0,1,0,0,1,0,0,1,1,1,1,0,0,1,0,0,1,0,0,1,0,0,1,1,1,0,0,1,0,1,1,0,1,0,0],e:[11,41,52]},
{p:[[549,1547],[351,1281],[559,1000],[453,1000],[294,1215],[135,1000],[29,1000],[241,1286],[47,1547],[153,1547],[298,1352],[443,1547]],f:[1,1,1,1,1,1,1,1,1,1,1,1],e:[12]},
{p:[[563,1000],[91,1000],[91,1547],[181,1547],[181,1072],[473,1072],[473,1547],[563,1547],[563,1072],[635,1072],[635,862],[563,862]],f:[1,1,1,1,1,1,1,1,1,1,1,1],e:[12]},
{p:[[410,1000],[410,1230],[243,1230],[168,1230],[118,1276],[73,1318],[73,1408],[73,1547],[163,1547],[163,1417],[163,1359],[188,1331],[214,1302],[265,1302],[410,1302],[410,1547],[500,1547],[500,1000]],f:[1,1,1,0,1,0,1,1,1,1,0,1,0,1,1,1,1,1],e:[18]},
{p:[[502,1072],[734,1072],[734,1547],[824,1547],[824,1000],[91,1000],[91,1547],[181,1547],[181,1072],[412,1072],[412,1547],[502,1547]],f:[1,1,1,1,1,1,1,1,1,1,1,1],e:[12]},
{p:[[824,1000],[91,1000],[91,1547],[181,1547],[181,1072],[412,1072],[412,1547],[502,1547],[502,1072],[734,1072],[734,1547],[824,1547],[824,1072],[896,1072],[896,862],[824,862]],f:[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],e:[16]},
{p:[[430,1324],[535,1324],[647,1244],[647,1162],[647,1080],[535,1000],[430,1000],[208,1000],[208,1475],[30,1475],[30,1547],[298,1547],[298,1324],[426,1252],[298,1252],[298,1072],[426,1072],[488,1072],[552,1118],[552,1162],[552,1206],[488,1252]],f:[1,0,0,1,0,0,1,1,1,1,1,1,1,1,1,1,1,0,0,1,0,0],e:[13,22]},
{p:[[611,1547],[701,1547],[701,1000],[611,1000],[656,1560],[435,1162],[435,1206],[371,1252],[309,1252],[181,1252],[181,1072],[309,1072],[371,1072],[435,1118],[91,1547],[181,1547],[181,1324],[313,1324],[417,1324],[530,1244],[530,1162],[530,1080],[417,1000],[313,1000],[91,1000]],f:[1,1,1,1,1,1,0,0,1,1,1,1,0,0,1,1,1,1,0,0,1,0,0,1,1],e:[4,5,14,25]},
{p:[[435,1162],[435,1206],[371,1252],[309,1252],[181,1252],[181,1072],[309,1072],[371,1072],[435,1118],[91,1547],[181,1547],[181,1324],[313,1324],[417,1324],[530,1244],[530,1162],[530,1080],[417,1000],[313,1000],[91,1000]],f:[1,0,0,1,1,1,1,0,0,1,1,1,1,0,0,1,0,0,1,1],e:[9,20]},
{p:[[55,1104],[132,1062],[209,1062],[281,1062],[383,1146],[393,1252],[115,1252],[115,1324],[390,1324],[384,1375],[306,1484],[209,1484],[134,1484],[55,1442],[55,1526],[132,1560],[213,1560],[341,1560],[488,1405],[488,1273],[488,1141],[345,986],[219,986],[127,986],[55,1021]],f:[1,0,1,0,0,1,1,1,1,0,0,1,0,1,1,0,1,0,0,1,0,0,1,0,1],e:[25]},
{p:[[536,1484],[464,1484],[380,1371],[380,1273],[380,1175],[463,1062],[536,1062],[608,1062],[692,1175],[692,1273],[692,1370],[608,1484],[288,1329],[297,1421],[419,1560],[536,1560],[653,1560],[787,1408],[787,1273],[787,1139],[653,986],[536,986],[418,986],[290,1133],[286,1254],[184,1254],[184,1000],[94,1000],[94,1547],[184,1547],[184,1329]],f:[1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,1,1,1,1,1,1],e:[12,31]},
{p:[[185,1389],[185,1349],[247,1303],[305,1303],[426,1303],[426,1475],[305,1475],[247,1475],[185,1430],[57,1000],[224,1240],[167,1252],[92,1319],[92,1389],[92,1468],[197,1547],[303,1547],[517,1547],[517,1000],[426,1000],[426,1231],[314,1231],[153,1000]],f:[1,0,0,1,1,1,1,0,0,1,1,0,0,1,0,0,1,1,1,1,1,1,1],e:[9,23]},
{p:[[49,1309],[451,1309],[451,1239],[49,1239]],f:[1,1,1,1],e:[4]},
{p:[[49,1309],[951,1309],[951,1239],[49,1239]],f:[1,1,1,1],e:[4]},
{p:[[188,1489],[85,1489],[85,1573],[165,1729],[228,1729],[188,1573]],f:[1,1,1,1,1,1],e:[6]},
{p:[[127,1729],[230,1729],[230,1655],[150,1499],[87,1499],[127,1655]],f:[1,1,1,1,1,1],e:[6]},
{p:[[188,1489],[85,1489],[85,1573],[165,1729],[228,1729],[188,1573],[388,1489],[285,1489],[285,1573],[365,1729],[428,1729],[388,1573]],f:[1,1,1,1,1,1,1,1,1,1,1,1],e:[6,12]},
{p:[[125,1729],[228,1729],[228,1645],[148,1489],[85,1489],[125,1645],[325,1729],[428,1729],[428,1645],[348,1489],[285,1489],[325,1645]],f:[1,1,1,1,1,1,1,1,1,1,1,1],e:[6,12]},
{p:[[150,1372],[150,1433],[234,1516],[296,1516],[356,1516],[440,1433],[440,1372],[440,1311],[356,1227],[295,1227],[234,1227],[150,1311]],f:[1,0,0,1,0,0,1,0,0,1,0,0],e:[12]},
{p:[[448,1124],[552,1124],[552,1000],[448,1000],[781,1124],[885,1124],[885,1000],[781,1000],[115,1124],[219,1124],[219,1000],[115,1000]],f:[1,1,1,1,1,1,1,1,1,1,1,1],e:[4,8,12]},
{p:[[26,1000],[26,1083],[98,1083],[98,1135],[98,1729],[231,1729],[554,1119],[554,1594],[554,1656],[631,1729],[722,1729],[722,1646],[650,1646],[650,1594],[650,1000],[517,1000],[194,1610],[194,1135],[194,1073],[117,1000],[728,1304],[728,1371],[798,1464],[849,1464],[899,1464],[969,1371],[969,1304],[969,1236],[899,1143],[849,1143],[798,1143],[728,1236],[796,1304],[796,1266],[824,1215],[849,1215],[873,1215],[901,1266],[901,1304],[901,1342],[873,1392],[849,1392],[824,1392],[796,1342],[728,1000],[728,1060],[969,1060],[969,1000]],f:[1,1,0,1,1,1,1,1,0,0,1,1,0,1,1,1,1,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,1,1,1],e:[20,32,44,48]},
{p:[[91,877],[91,1643],[854,1643],[854,877]],f:[1,1,1,1],e:[4]},
{p:[[55,1259],[55,1361],[106,1450],[157,1538],[246,1589],[334,1641],[437,1641],[539,1641],[627,1589],[716,1538],[767,1450],[818,1361],[818,1259],[818,1157],[767,1068],[716,979],[627,928],[539,877],[437,877],[334,877],[246,928],[157,979],[106,1068],[55,1157]],f:[1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0],e:[24]}
]
};

const BOLD_FONT = {
  cp:{32:0,33:1,34:2,35:3,36:4,37:5,38:6,39:7,40:8,41:9,42:10,43:11,44:12,45:13,46:14,47:15,48:16,49:17,50:18,51:19,52:20,53:21,54:22,55:23,56:24,57:25,58:26,59:27,60:28,61:29,62:30,63:31,64:32,65:33,66:34,67:35,68:36,69:37,70:38,71:39,72:40,73:41,74:42,75:43,76:44,77:45,78:46,79:47,80:48,81:49,82:50,83:51,84:52,85:53,86:54,87:55,88:56,89:57,90:58,91:59,92:60,93:61,94:62,95:63,96:64,97:65,98:66,99:67,100:68,101:69,102:70,103:71,104:72,105:73,106:74,107:75,108:76,109:77,110:78,111:79,112:80,113:81,114:82,115:83,116:84,117:85,118:86,119:87,120:88,121:89,122:90,123:91,124:92,125:93,126:94,160:95,169:96,171:97,183:98,187:99,215:100,1025:101,1040:102,1041:103,1042:104,1043:105,1044:106,1045:107,1046:108,1047:109,1048:110,1049:111,1050:112,1051:113,1052:114,1053:115,1054:116,1055:117,1056:118,1057:119,1058:120,1059:121,1060:122,1061:123,1062:124,1063:125,1064:126,1065:127,1066:128,1067:129,1068:130,1069:131,1070:132,1071:133,1072:134,1073:135,1074:136,1075:137,1076:138,1077:139,1078:140,1079:141,1080:142,1081:143,1082:144,1083:145,1084:146,1085:147,1086:148,1087:149,1088:150,1089:151,1090:152,1091:153,1092:154,1093:155,1094:156,1095:157,1096:158,1097:159,1098:160,1099:161,1100:162,1101:163,1102:164,1103:165,8211:166,8212:167,8216:168,8217:169,8220:170,8221:171,8226:172,8230:173,8470:174,9632:175,9679:176},
  adv:{0:348,1:456,2:521,3:838,4:696,5:1002,6:872,7:306,8:457,9:457,10:523,11:838,12:380,13:415,14:380,15:365,16:696,17:696,18:696,19:696,20:696,21:696,22:696,23:696,24:696,25:696,26:400,27:400,28:838,29:838,30:838,31:580,32:1000,33:774,34:762,35:734,36:830,37:683,38:683,39:821,40:837,41:372,42:372,43:775,44:637,45:995,46:837,47:850,48:733,49:850,50:770,51:720,52:682,53:812,54:774,55:1103,56:771,57:724,58:725,59:457,60:365,61:457,62:838,63:500,64:500,65:675,66:716,67:593,68:716,69:678,70:435,71:716,72:712,73:343,74:343,75:665,76:343,77:1042,78:712,79:687,80:716,81:716,82:493,83:595,84:478,85:712,86:652,87:924,88:645,89:652,90:582,91:712,92:365,93:712,94:838,95:348,96:1000,97:646,98:380,99:646,100:838,101:683,102:774,103:762,104:762,105:637,106:891,107:683,108:1224,109:710,110:837,111:837,112:817,113:831,114:995,115:837,116:850,117:837,118:733,119:734,120:682,121:771,122:992,123:771,124:928,125:808,126:1235,127:1326,128:939,129:1036,130:762,131:734,132:1174,133:770,134:675,135:698,136:633,137:522,138:808,139:678,140:995,141:581,142:701,143:701,144:679,145:732,146:817,147:691,148:687,149:691,150:716,151:593,152:580,153:652,154:992,155:645,156:741,157:687,158:1062,159:1105,160:751,161:904,162:632,163:593,164:972,165:642,166:500,167:1000,168:380,169:380,170:657,171:657,172:639,173:1000,174:1203,175:945,176:873},
  asc:928,desc:-236,bbox:[-56,0,1934,2899],
  ng:177,
  glyphs:[
{p:[],f:[],e:[]},
{p:[[140,1729],[316,1729],[316,1449],[291,1245],[165,1245],[140,1449],[140,1174],[316,1174],[316,1000],[140,1000]],f:[1,1,1,1,1,1,1,1,1,1],e:[6,10]},
{p:[[426,1729],[426,1458],[310,1458],[310,1729],[211,1729],[211,1458],[95,1458],[95,1729]],f:[1,1,1,1,1,1,1,1],e:[4,8]},
{p:[[445,1718],[398,1530],[527,1530],[574,1718],[682,1718],[635,1530],[770,1530],[770,1426],[609,1426],[575,1292],[714,1292],[714,1187],[550,1187],[503,1000],[395,1000],[442,1187],[313,1187],[266,1000],[157,1000],[204,1187],[68,1187],[68,1292],[228,1292],[262,1426],[124,1426],[124,1530],[289,1530],[336,1718],[500,1426],[371,1426],[337,1292],[466,1292]],f:[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],e:[28,32]},
{p:[[388,853],[309,853],[309,1000],[248,1002],[133,1025],[79,1045],[79,1173],[135,1144],[250,1113],[309,1111],[309,1263],[293,1266],[176,1287],[78,1375],[78,1457],[78,1544],[198,1643],[309,1647],[309,1760],[388,1760],[388,1649],[437,1645],[535,1628],[584,1615],[584,1491],[535,1512],[438,1535],[388,1537],[388,1397],[404,1394],[528,1375],[628,1283],[628,1194],[628,1104],[509,1008],[388,1001],[309,1408],[309,1536],[274,1534],[233,1500],[233,1474],[233,1445],[271,1413],[388,1249],[388,1113],[431,1114],[473,1146],[473,1178],[473,1211],[434,1244]],f:[1,1,1,0,0,1,1,0,0,1,1,1,0,0,1,0,0,1,1,1,1,0,0,1,1,0,0,1,1,1,0,0,1,0,0,1,1,1,0,0,1,0,0,1,1,0,0,1,0,0],e:[36,43,50]},
{p:[[775,1301],[740,1301],[702,1241],[702,1185],[702,1129],[740,1069],[775,1069],[810,1069],[847,1129],[847,1185],[847,1241],[810,1301],[775,1383],[866,1383],[970,1277],[970,1185],[970,1093],[866,986],[775,986],[684,986],[579,1093],[579,1185],[579,1277],[684,1383],[327,986],[219,986],[675,1742],[783,1742],[227,1742],[318,1742],[422,1636],[422,1544],[422,1452],[318,1345],[227,1345],[136,1345],[32,1452],[32,1544],[32,1636],[136,1742],[227,1660],[192,1660],[154,1600],[154,1544],[154,1488],[192,1427],[227,1427],[262,1427],[300,1488],[300,1544],[300,1600],[262,1660]],f:[1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,1,1,1,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0],e:[12,24,28,40,52]},
{p:[[390,1484],[590,1264],[616,1298],[643,1383],[645,1437],[797,1437],[790,1348],[735,1209],[687,1157],[830,1000],[623,1000],[575,1053],[524,1019],[411,986],[347,986],[219,986],[60,1121],[60,1228],[60,1299],[130,1409],[209,1461],[188,1487],[169,1539],[169,1567],[169,1646],[293,1742],[396,1742],[440,1742],[537,1728],[589,1714],[589,1578],[543,1602],[461,1624],[422,1624],[384,1624],[343,1595],[343,1569],[343,1552],[367,1510],[293,1363],[261,1340],[229,1282],[229,1247],[229,1191],[312,1112],[370,1112],[403,1112],[459,1132],[484,1152]],f:[1,1,0,0,1,1,0,0,1,1,1,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1],e:[39,49]},
{p:[[211,1729],[211,1458],[95,1458],[95,1729]],f:[1,1,1,1],e:[4]},
{p:[[377,868],[232,868],[157,989],[86,1206],[86,1313],[86,1420],[158,1639],[232,1759],[377,1759],[314,1643],[252,1422],[252,1314],[252,1206],[314,984]],f:[1,1,0,0,1,0,0,1,1,0,0,1,0,0],e:[14]},
{p:[[80,868],[143,984],[205,1206],[205,1314],[205,1422],[143,1643],[80,1759],[225,1759],[299,1639],[371,1420],[371,1313],[371,1206],[300,989],[225,868]],f:[1,0,0,1,0,0,1,1,0,0,1,0,0,1],e:[14]},
{p:[[503,1594],[342,1510],[503,1425],[466,1356],[303,1446],[303,1278],[220,1278],[220,1446],[57,1356],[20,1425],[183,1510],[20,1594],[57,1663],[220,1574],[220,1742],[303,1742],[303,1574],[466,1663]],f:[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],e:[18]},
{p:[[477,1627],[477,1371],[732,1371],[732,1256],[477,1256],[477,1000],[361,1000],[361,1256],[106,1256],[106,1371],[361,1371],[361,1627]],f:[1,1,1,1,1,1,1,1,1,1,1,1],e:[12]},
{p:[[102,1189],[278,1189],[278,1040],[157,858],[53,858],[102,1040]],f:[1,1,1,1,1,1],e:[6]},
{p:[[54,1359],[361,1359],[361,1217],[54,1217]],f:[1,1,1,1],e:[4]},
{p:[[102,1189],[278,1189],[278,1000],[102,1000]],f:[1,1,1,1],e:[4]},
{p:[[257,1729],[365,1729],[108,907],[0,907]],f:[1,1,1,1],e:[4]},
{p:[[460,1365],[460,1502],[409,1614],[348,1614],[288,1614],[236,1502],[236,1365],[236,1227],[288,1114],[348,1114],[408,1114],[460,1227],[648,1364],[648,1183],[492,986],[348,986],[204,986],[48,1183],[48,1364],[48,1545],[204,1742],[348,1742],[492,1742],[648,1545]],f:[1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0],e:[12,24]},
{p:[[117,1130],[283,1130],[283,1601],[113,1566],[113,1694],[282,1729],[461,1729],[461,1130],[627,1130],[627,1000],[117,1000]],f:[1,1,1,1,1,1,1,1,1,1,1],e:[11]},
{p:[[288,1138],[609,1138],[609,1000],[79,1000],[79,1138],[345,1373],[381,1405],[415,1467],[415,1500],[415,1551],[346,1614],[289,1614],[245,1614],[141,1576],[81,1539],[81,1699],[145,1720],[269,1742],[328,1742],[459,1742],[604,1627],[604,1524],[604,1464],[542,1361],[444,1275]],f:[1,1,1,1,1,1,0,0,1,0,0,1,0,0,1,1,0,0,1,0,0,1,0,0,1],e:[25]},
{p:[[466,1393],[540,1374],[616,1280],[616,1207],[616,1099],[450,986],[291,986],[235,986],[122,1004],[67,1022],[67,1167],[120,1141],[224,1114],[274,1114],[349,1114],[428,1166],[428,1214],[428,1264],[347,1315],[267,1315],[192,1315],[192,1436],[271,1436],[342,1436],[411,1480],[411,1526],[411,1568],[344,1614],[282,1614],[237,1614],[144,1593],[98,1573],[98,1711],[154,1727],[263,1742],[316,1742],[458,1742],[599,1649],[599,1555],[599,1491],[532,1410]],f:[1,0,0,1,0,0,1,0,0,1,1,0,0,1,0,0,1,0,0,1,1,1,1,0,0,1,0,0,1,0,0,1,1,0,0,1,0,0,1,0,0],e:[41]},
{p:[[368,1574],[162,1269],[368,1269],[337,1729],[546,1729],[546,1269],[650,1269],[650,1133],[546,1133],[546,1000],[368,1000],[368,1133],[45,1133],[45,1294]],f:[1,1,1,1,1,1,1,1,1,1,1,1,1,1],e:[3,14]},
{p:[[106,1729],[573,1729],[573,1591],[256,1591],[256,1478],[277,1484],[321,1490],[344,1490],[478,1490],[626,1357],[626,1238],[626,1120],[464,986],[321,986],[259,986],[137,1010],[77,1034],[77,1182],[137,1148],[244,1114],[291,1114],[359,1114],[438,1181],[438,1238],[438,1295],[359,1362],[291,1362],[250,1362],[159,1341],[106,1319]],f:[1,1,1,1,1,0,0,1,0,0,1,0,0,1,0,0,1,1,0,0,1,0,0,1,0,0,1,0,0,1],e:[30]},
{p:[[362,1360],[312,1360],[263,1296],[263,1232],[263,1168],[312,1104],[362,1104],[412,1104],[461,1168],[461,1232],[461,1296],[412,1360],[594,1710],[594,1575],[548,1597],[466,1618],[427,1618],[343,1618],[249,1525],[241,1433],[273,1457],[349,1481],[393,1481],[505,1481],[642,1350],[642,1244],[642,1127],[489,986],[360,986],[218,986],[62,1178],[62,1354],[62,1535],[244,1741],[403,1741],[453,1741],[548,1726]],f:[1,0,0,1,0,0,1,0,0,1,0,0,1,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0],e:[12,37]},
{p:[[67,1729],[616,1729],[616,1623],[332,1000],[149,1000],[418,1591],[67,1591]],f:[1,1,1,1,1,1,1],e:[7]},
{p:[[348,1326],[295,1326],[239,1269],[239,1215],[239,1161],[295,1104],[348,1104],[400,1104],[456,1161],[456,1215],[456,1269],[400,1326],[211,1388],[145,1408],[77,1491],[77,1553],[77,1646],[215,1742],[348,1742],[480,1742],[618,1646],[618,1553],[618,1491],[550,1408],[484,1388],[558,1368],[634,1275],[634,1205],[634,1097],[490,986],[348,986],[206,986],[61,1097],[61,1205],[61,1275],[137,1368],[255,1534],[255,1491],[303,1444],[348,1444],[392,1444],[440,1491],[440,1534],[440,1578],[392,1624],[348,1624],[303,1624],[255,1577]],f:[1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0],e:[12,36,48]},
{p:[[100,1016],[100,1151],[145,1130],[227,1109],[267,1109],[351,1109],[445,1202],[453,1294],[420,1270],[345,1245],[301,1245],[189,1245],[52,1375],[52,1482],[52,1600],[205,1741],[333,1741],[476,1741],[632,1549],[632,1373],[632,1192],[449,986],[290,986],[239,986],[145,1001],[332,1367],[381,1367],[431,1431],[431,1495],[431,1559],[381,1623],[332,1623],[283,1623],[233,1559],[233,1495],[233,1431],[283,1367]],f:[1,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0],e:[25,37]},
{p:[[112,1547],[288,1547],[288,1358],[112,1358],[112,1189],[288,1189],[288,1000],[112,1000]],f:[1,1,1,1,1,1,1,1],e:[4,8]},
{p:[[112,1189],[288,1189],[288,1040],[167,858],[63,858],[112,1040],[112,1547],[288,1547],[288,1358],[112,1358]],f:[1,1,1,1,1,1,1,1,1,1],e:[6,10]},
{p:[[732,1475],[261,1313],[732,1152],[732,1030],[106,1256],[106,1371],[732,1597]],f:[1,1,1,1,1,1,1],e:[7]},
{p:[[106,1482],[732,1482],[732,1367],[106,1367],[106,1260],[732,1260],[732,1144],[106,1144]],f:[1,1,1,1,1,1,1,1],e:[4,8]},
{p:[[106,1475],[106,1597],[732,1371],[732,1256],[106,1030],[106,1152],[577,1313]],f:[1,1,1,1,1,1,1],e:[7]},
{p:[[346,1246],[170,1246],[170,1270],[170,1310],[202,1372],[254,1420],[285,1448],[313,1474],[339,1519],[339,1541],[339,1575],[292,1614],[250,1614],[210,1614],[119,1581],[69,1549],[69,1702],[128,1723],[226,1742],[271,1742],[390,1742],[515,1645],[515,1552],[515,1504],[477,1428],[431,1385],[400,1357],[367,1327],[346,1290],[346,1268],[170,1174],[346,1174],[346,1000],[170,1000]],f:[1,1,1,0,0,1,1,0,0,1,0,0,1,0,0,1,1,0,0,1,0,0,1,0,0,1,1,0,0,1,1,1,1,1],e:[30,34]},
{p:[[406,1263],[406,1203],[457,1134],[501,1134],[544,1134],[596,1204],[596,1263],[596,1322],[544,1391],[500,1391],[457,1391],[406,1322],[606,1116],[591,1082],[526,1043],[483,1043],[399,1043],[294,1165],[294,1262],[294,1360],[399,1482],[483,1482],[526,1482],[591,1443],[606,1408],[606,1472],[708,1472],[708,1134],[769,1143],[838,1241],[838,1318],[838,1367],[810,1452],[781,1488],[734,1547],[595,1612],[514,1612],[458,1612],[354,1582],[310,1553],[238,1505],[157,1354],[157,1265],[157,1192],[209,1065],[259,1016],[308,968],[434,918],[506,918],[567,918],[690,964],[734,1003],[786,924],[725,876],[581,826],[507,826],[417,826],[256,890],[194,951],[131,1012],[66,1173],[66,1265],[66,1354],[132,1515],[194,1576],[255,1637],[419,1703],[507,1703],[616,1703],[795,1620],[855,1541],[892,1493],[929,1381],[929,1320],[929,1188],[770,1041],[625,1041],[606,1041]],f:[1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,1,1,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,1],e:[12,78]},
{p:[[534,1133],[240,1133],[194,1000],[5,1000],[275,1729],[499,1729],[769,1000],[580,1000],[287,1268],[487,1268],[387,1558]],f:[1,1,1,1,1,1,1,1,1,1,1],e:[8,11]},
{p:[[384,1447],[428,1447],[474,1486],[474,1524],[474,1562],[428,1601],[384,1601],[280,1601],[280,1447],[390,1128],[447,1128],[504,1176],[504,1224],[504,1271],[447,1319],[390,1319],[280,1319],[280,1128],[565,1390],[625,1373],[692,1278],[692,1209],[692,1104],[549,1000],[404,1000],[92,1000],[92,1729],[374,1729],[526,1729],[662,1637],[662,1536],[662,1483],[612,1408]],f:[1,0,0,1,0,0,1,1,1,1,0,0,1,0,0,1,1,1,1,0,0,1,0,0,1,1,1,1,0,0,1,0,0],e:[9,18,33]},
{p:[[670,1040],[618,1013],[506,986],[445,986],[263,986],[50,1189],[50,1364],[50,1539],[263,1742],[445,1742],[506,1742],[618,1715],[670,1688],[670,1537],[618,1573],[516,1606],[460,1606],[359,1606],[244,1477],[244,1364],[244,1251],[359,1122],[460,1122],[516,1122],[618,1155],[670,1191]],f:[1,0,0,1,0,0,1,0,0,1,0,0,1,1,0,0,1,0,0,1,0,0,1,0,0,1],e:[26]},
{p:[[280,1587],[280,1142],[347,1142],[462,1142],[584,1256],[584,1365],[584,1474],[463,1587],[347,1587],[92,1729],[290,1729],[456,1729],[619,1682],[677,1625],[728,1576],[778,1447],[778,1365],[778,1283],[728,1153],[677,1104],[618,1047],[454,1000],[290,1000],[92,1000]],f:[1,1,1,0,0,1,0,0,1,1,1,0,0,1,0,0,1,0,0,1,0,0,1,1],e:[9,24]},
{p:[[92,1729],[599,1729],[599,1587],[280,1587],[280,1451],[580,1451],[580,1309],[280,1309],[280,1142],[610,1142],[610,1000],[92,1000]],f:[1,1,1,1,1,1,1,1,1,1,1,1],e:[12]},
{p:[[92,1729],[599,1729],[599,1587],[280,1587],[280,1451],[580,1451],[580,1309],[280,1309],[280,1000],[92,1000]],f:[1,1,1,1,1,1,1,1,1,1],e:[10]},
{p:[[747,1054],[677,1020],[525,986],[445,986],[263,986],[50,1189],[50,1364],[50,1540],[267,1742],[455,1742],[528,1742],[661,1715],[720,1688],[720,1537],[659,1572],[539,1606],[478,1606],[366,1606],[244,1480],[244,1364],[244,1248],[361,1122],[469,1122],[499,1122],[549,1129],[569,1137],[569,1279],[454,1279],[454,1405],[747,1405]],f:[1,0,0,1,0,0,1,0,0,1,0,0,1,1,0,0,1,0,0,1,0,0,1,0,0,1,1,1,1,1],e:[30]},
{p:[[92,1729],[280,1729],[280,1451],[557,1451],[557,1729],[745,1729],[745,1000],[557,1000],[557,1309],[280,1309],[280,1000],[92,1000]],f:[1,1,1,1,1,1,1,1,1,1,1,1],e:[12]},
{p:[[92,1729],[280,1729],[280,1000],[92,1000]],f:[1,1,1,1],e:[4]},
{p:[[92,1729],[280,1729],[280,1071],[280,935],[132,800],[-18,800],[-56,800],[-56,942],[-27,942],[32,942],[92,1007],[92,1071]],f:[1,1,1,0,0,1,1,1,1,0,0,1],e:[12]},
{p:[[92,1729],[280,1729],[280,1463],[551,1729],[769,1729],[418,1384],[805,1000],[570,1000],[280,1287],[280,1000],[92,1000]],f:[1,1,1,1,1,1,1,1,1,1,1],e:[11]},
{p:[[92,1729],[280,1729],[280,1142],[610,1142],[610,1000],[92,1000]],f:[1,1,1,1,1,1],e:[6]},
{p:[[92,1729],[331,1729],[497,1339],[664,1729],[903,1729],[903,1000],[725,1000],[725,1533],[557,1140],[438,1140],[270,1533],[270,1000],[92,1000]],f:[1,1,1,1,1,1,1,1,1,1,1,1,1],e:[13]},
{p:[[92,1729],[302,1729],[567,1229],[567,1729],[745,1729],[745,1000],[535,1000],[270,1500],[270,1000],[92,1000]],f:[1,1,1,1,1,1,1,1,1,1],e:[10]},
{p:[[425,1606],[339,1606],[244,1479],[244,1364],[244,1249],[339,1122],[425,1122],[511,1122],[606,1249],[606,1364],[606,1479],[511,1606],[425,1742],[601,1742],[800,1541],[800,1364],[800,1187],[601,986],[425,986],[250,986],[50,1187],[50,1364],[50,1541],[250,1742]],f:[1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0],e:[12,24]},
{p:[[92,1729],[404,1729],[543,1729],[692,1605],[692,1491],[692,1376],[543,1253],[404,1253],[280,1253],[280,1000],[92,1000],[280,1593],[280,1389],[384,1389],[438,1389],[498,1442],[498,1491],[498,1540],[438,1593],[384,1593]],f:[1,1,0,0,1,0,0,1,1,1,1,1,1,1,0,0,1,0,0,1],e:[11,20]},
{p:[[445,987],[430,987],[250,987],[50,1186],[50,1364],[50,1541],[250,1742],[425,1742],[602,1742],[800,1543],[800,1364],[800,1241],[695,1063],[596,1018],[743,854],[564,854],[425,1606],[339,1606],[244,1479],[244,1364],[244,1247],[337,1122],[425,1122],[511,1122],[606,1249],[606,1364],[606,1479],[511,1606]],f:[1,1,0,0,1,0,0,1,0,0,1,0,0,1,1,1,1,0,0,1,0,0,1,0,0,1,0,0],e:[16,28]},
{p:[[359,1406],[418,1406],[469,1450],[469,1500],[469,1550],[418,1593],[359,1593],[280,1593],[280,1406],[280,1276],[280,1000],[92,1000],[92,1729],[379,1729],[523,1729],[657,1632],[657,1528],[657,1456],[587,1363],[517,1341],[556,1332],[617,1270],[648,1207],[750,1000],[550,1000],[461,1181],[434,1236],[379,1276],[333,1276]],f:[1,0,0,1,0,0,1,1,1,1,1,1,1,1,0,0,1,0,0,1,0,0,1,1,1,1,0,0,1],e:[9,29]},
{p:[[599,1706],[599,1552],[539,1579],[425,1606],[374,1606],[307,1606],[242,1569],[242,1530],[242,1500],[286,1468],[343,1456],[423,1440],[544,1416],[647,1316],[647,1224],[647,1104],[504,986],[357,986],[288,986],[148,1012],[78,1038],[78,1197],[148,1160],[278,1122],[339,1122],[400,1122],[466,1163],[466,1201],[466,1235],[421,1272],[355,1287],[282,1303],[173,1327],[72,1429],[72,1516],[72,1625],[212,1742],[344,1742],[404,1742],[531,1724]],f:[1,1,0,0,1,0,0,1,0,0,1,1,0,0,1,0,0,1,0,0,1,1,0,0,1,0,0,1,0,0,1,1,0,0,1,0,0,1,0,0],e:[40]},
{p:[[5,1729],[677,1729],[677,1587],[435,1587],[435,1000],[247,1000],[247,1587],[5,1587]],f:[1,1,1,1,1,1,1,1],e:[8]},
{p:[[92,1729],[280,1729],[280,1292],[280,1202],[339,1124],[406,1124],[473,1124],[532,1202],[532,1292],[532,1729],[720,1729],[720,1292],[720,1137],[565,986],[406,986],[247,986],[92,1137],[92,1292]],f:[1,1,1,0,0,1,0,0,1,1,1,1,0,0,1,0,0,1],e:[18]},
{p:[[5,1729],[194,1729],[387,1191],[580,1729],[769,1729],[499,1000],[275,1000]],f:[1,1,1,1,1,1,1],e:[7]},
{p:[[30,1729],[210,1729],[336,1199],[461,1729],[642,1729],[767,1199],[893,1729],[1072,1729],[900,1000],[683,1000],[551,1554],[420,1000],[203,1000]],f:[1,1,1,1,1,1,1,1,1,1,1,1,1],e:[13]},
{p:[[498,1372],[751,1000],[555,1000],[385,1249],[216,1000],[19,1000],[272,1372],[29,1729],[225,1729],[385,1494],[544,1729],[741,1729]],f:[1,1,1,1,1,1,1,1,1,1,1,1],e:[12]},
{p:[[-10,1729],[196,1729],[362,1469],[528,1729],[734,1729],[456,1307],[456,1000],[268,1000],[268,1307]],f:[1,1,1,1,1,1,1,1,1],e:[9]},
{p:[[56,1729],[669,1729],[669,1615],[278,1142],[680,1142],[680,1000],[45,1000],[45,1114],[436,1587],[56,1587]],f:[1,1,1,1,1,1,1,1,1,1],e:[10]},
{p:[[86,1760],[389,1760],[389,1650],[252,1650],[252,978],[389,978],[389,868],[86,868]],f:[1,1,1,1,1,1,1,1],e:[8]},
{p:[[257,907],[0,1729],[108,1729],[365,907]],f:[1,1,1,1],e:[4]},
{p:[[371,868],[68,868],[68,978],[205,978],[205,1650],[68,1650],[68,1760],[371,1760]],f:[1,1,1,1,1,1,1,1],e:[8]},
{p:[[479,1729],[737,1457],[619,1457],[419,1604],[219,1457],[101,1457],[359,1729]],f:[1,1,1,1,1,1,1],e:[7]},
{p:[[500,857],[500,764],[0,764],[0,857]],f:[1,1,1,1],e:[4]},
{p:[[184,1800],[322,1616],[226,1616],[46,1800]],f:[1,1,1,1],e:[4]},
{p:[[329,1246],[274,1246],[219,1209],[219,1173],[219,1140],[264,1102],[303,1102],[353,1102],[420,1173],[420,1226],[420,1246],[596,1312],[596,1000],[420,1000],[420,1081],[385,1031],[297,986],[234,986],[149,986],[43,1085],[43,1164],[43,1260],[175,1350],[317,1350],[420,1350],[420,1364],[420,1405],[354,1444],[285,1444],[229,1444],[132,1421],[91,1399],[91,1532],[147,1546],[260,1560],[317,1560],[465,1560],[596,1443]],f:[1,0,0,1,0,0,1,0,0,1,1,1,1,1,1,0,0,1,0,0,1,0,0,1,1,1,0,0,1,0,0,1,1,0,0,1,0,0],e:[11,38]},
{p:[[375,1113],[431,1113],[490,1195],[490,1273],[490,1351],[431,1433],[375,1433],[319,1433],[259,1351],[259,1273],[259,1195],[319,1113],[259,1467],[295,1515],[383,1560],[440,1560],[541,1560],[671,1399],[671,1273],[671,1146],[541,986],[440,986],[383,986],[295,1031],[259,1079],[259,1000],[84,1000],[84,1760],[259,1760]],f:[1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,1,1,1,1],e:[12,29]},
{p:[[526,1530],[526,1387],[490,1412],[418,1435],[380,1435],[307,1435],[225,1350],[225,1273],[225,1196],[307,1111],[380,1111],[421,1111],[495,1135],[526,1159],[526,1016],[485,1001],[400,986],[358,986],[210,986],[43,1138],[43,1273],[43,1408],[210,1560],[358,1560],[401,1560],[484,1545]],f:[1,1,0,0,1,0,0,1,0,0,1,0,0,1,1,0,0,1,0,0,1,0,0,1,0,0],e:[26]},
{p:[[456,1467],[456,1760],[632,1760],[632,1000],[456,1000],[456,1079],[420,1031],[333,986],[276,986],[175,986],[45,1146],[45,1273],[45,1399],[175,1560],[276,1560],[333,1560],[420,1515],[341,1113],[397,1113],[456,1195],[456,1273],[456,1351],[397,1433],[341,1433],[285,1433],[226,1351],[226,1273],[226,1195],[285,1113]],f:[1,1,1,1,1,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0],e:[17,29]},
{p:[[630,1275],[630,1225],[221,1225],[228,1164],[304,1102],[372,1102],[427,1102],[543,1135],[604,1168],[604,1033],[542,1010],[418,986],[356,986],[208,986],[43,1137],[43,1273],[43,1407],[205,1560],[346,1560],[475,1560],[630,1405],[450,1333],[450,1383],[392,1444],[345,1444],[294,1444],[231,1387],[223,1333]],f:[1,1,1,0,0,1,0,0,1,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1],e:[21,28]},
{p:[[444,1760],[444,1645],[347,1645],[310,1645],[281,1618],[281,1585],[281,1547],[430,1547],[430,1422],[281,1422],[281,1000],[106,1000],[106,1422],[19,1422],[19,1547],[106,1547],[106,1585],[106,1674],[206,1760],[310,1760]],f:[1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1],e:[20]},
{p:[[456,1093],[420,1045],[333,1000],[276,1000],[176,1000],[45,1158],[45,1280],[45,1402],[176,1559],[276,1559],[333,1559],[420,1514],[456,1466],[456,1547],[632,1547],[632,1055],[632,923],[465,784],[307,784],[256,784],[160,800],[112,816],[112,952],[158,926],[246,900],[290,900],[376,900],[456,975],[456,1055],[341,1433],[287,1433],[226,1353],[226,1280],[226,1205],[285,1127],[341,1127],[396,1127],[456,1207],[456,1280],[456,1353],[396,1433]],f:[1,0,0,1,0,0,1,0,0,1,0,0,1,1,1,1,0,0,1,0,0,1,1,0,0,1,0,0,1,1,0,0,1,0,0,1,0,0,1,0,0],e:[29,41]},
{p:[[634,1333],[634,1000],[458,1000],[458,1054],[458,1254],[458,1326],[452,1379],[444,1392],[434,1409],[398,1428],[376,1428],[321,1428],[259,1344],[259,1269],[259,1000],[84,1000],[84,1760],[259,1760],[259,1467],[298,1515],[387,1560],[441,1560],[536,1560],[634,1444]],f:[1,1,1,1,1,0,0,1,0,0,1,0,0,1,1,1,1,1,1,0,0,1,0,0],e:[24]},
{p:[[84,1547],[259,1547],[259,1000],[84,1000],[84,1760],[259,1760],[259,1617],[84,1617]],f:[1,1,1,1,1,1,1,1],e:[4,8]},
{p:[[84,1547],[259,1547],[259,1010],[259,900],[153,784],[53,784],[-33,784],[-33,899],[-3,899],[47,899],[84,944],[84,1010],[84,1760],[259,1760],[259,1617],[84,1617]],f:[1,1,1,0,0,1,1,1,1,0,0,1,1,1,1,1],e:[12,16]},
{p:[[84,1760],[259,1760],[259,1346],[460,1547],[663,1547],[396,1296],[684,1000],[472,1000],[259,1228],[259,1000],[84,1000]],f:[1,1,1,1,1,1,1,1,1,1,1],e:[11]},
{p:[[84,1760],[259,1760],[259,1000],[84,1000]],f:[1,1,1,1],e:[4]},
{p:[[591,1456],[624,1507],[715,1560],[770,1560],[864,1560],[963,1444],[963,1333],[963,1000],[787,1000],[787,1285],[788,1292],[788,1305],[788,1318],[788,1376],[754,1428],[716,1428],[666,1428],[612,1346],[611,1269],[611,1000],[435,1000],[435,1285],[435,1376],[404,1428],[364,1428],[313,1428],[259,1346],[259,1269],[259,1000],[83,1000],[83,1547],[259,1547],[259,1467],[291,1513],[375,1560],[425,1560],[481,1560],[568,1505]],f:[1,0,0,1,0,0,1,1,1,1,0,0,1,0,0,1,0,0,1,1,1,1,0,0,1,0,0,1,1,1,1,1,1,0,0,1,0,0],e:[38]},
{p:[[634,1333],[634,1000],[458,1000],[458,1054],[458,1255],[458,1326],[452,1379],[444,1392],[434,1409],[398,1428],[376,1428],[321,1428],[259,1344],[259,1269],[259,1000],[84,1000],[84,1547],[259,1547],[259,1467],[298,1515],[387,1560],[441,1560],[536,1560],[634,1444]],f:[1,1,1,1,1,0,0,1,0,0,1,0,0,1,1,1,1,1,1,0,0,1,0,0],e:[24]},
{p:[[344,1435],[286,1435],[225,1352],[225,1273],[225,1194],[286,1111],[344,1111],[401,1111],[462,1194],[462,1273],[462,1352],[401,1435],[344,1560],[485,1560],[644,1408],[644,1273],[644,1138],[485,986],[344,986],[203,986],[43,1138],[43,1273],[43,1408],[203,1560]],f:[1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0],e:[12,24]},
{p:[[259,1079],[259,792],[84,792],[84,1547],[259,1547],[259,1467],[295,1515],[383,1560],[440,1560],[541,1560],[671,1399],[671,1273],[671,1146],[541,986],[440,986],[383,986],[295,1031],[375,1433],[319,1433],[259,1351],[259,1273],[259,1195],[319,1113],[375,1113],[431,1113],[490,1195],[490,1273],[490,1351],[431,1433]],f:[1,1,1,1,1,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0],e:[17,29]},
{p:[[341,1433],[285,1433],[226,1351],[226,1273],[226,1195],[285,1113],[341,1113],[397,1113],[456,1195],[456,1273],[456,1351],[397,1433],[456,1079],[420,1031],[333,986],[276,986],[175,986],[45,1146],[45,1273],[45,1399],[175,1559],[276,1559],[333,1559],[420,1514],[456,1466],[456,1547],[632,1547],[632,792],[456,792]],f:[1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,1,1,1,1],e:[12,29]},
{p:[[490,1398],[467,1409],[422,1419],[399,1419],[332,1419],[259,1333],[259,1252],[259,1000],[84,1000],[84,1547],[259,1547],[259,1457],[292,1511],[380,1560],[441,1560],[450,1560],[470,1559],[490,1556]],f:[1,0,0,1,0,0,1,1,1,1,1,1,0,0,1,0,0,1],e:[18]},
{p:[[511,1530],[511,1397],[455,1420],[351,1444],[304,1444],[254,1444],[206,1419],[206,1393],[206,1372],[243,1350],[290,1344],[321,1340],[455,1323],[548,1245],[548,1161],[548,1074],[419,986],[291,986],[237,986],[121,1003],[60,1020],[60,1153],[112,1127],[222,1102],[279,1102],[330,1102],[382,1130],[382,1158],[382,1182],[346,1205],[293,1211],[262,1215],[146,1229],[52,1309],[52,1389],[52,1476],[171,1560],[294,1560],[342,1560],[449,1545]],f:[1,1,0,0,1,0,0,1,0,0,1,1,0,0,1,0,0,1,0,0,1,1,0,0,1,0,0,1,0,0,1,1,0,0,1,0,0,1,0,0],e:[40]},
{p:[[275,1702],[275,1547],[455,1547],[455,1422],[275,1422],[275,1190],[275,1152],[305,1125],[350,1125],[440,1125],[440,1000],[290,1000],[187,1000],[100,1086],[100,1190],[100,1422],[13,1422],[13,1547],[100,1547],[100,1702]],f:[1,1,1,1,1,1,0,0,1,1,1,1,0,0,1,1,1,1,1,1],e:[20]},
{p:[[78,1213],[78,1547],[254,1547],[254,1492],[254,1448],[253,1313],[253,1291],[253,1225],[260,1167],[268,1154],[279,1137],[313,1118],[336,1118],[391,1118],[453,1202],[453,1277],[453,1547],[628,1547],[628,1000],[453,1000],[453,1079],[414,1031],[325,986],[272,986],[177,986],[78,1102]],f:[1,1,1,1,0,0,1,0,0,1,0,0,1,0,0,1,1,1,1,1,1,0,0,1,0,0],e:[26]},
{p:[[15,1547],[190,1547],[326,1169],[462,1547],[637,1547],[422,1000],[230,1000]],f:[1,1,1,1,1,1,1],e:[7]},
{p:[[35,1547],[205,1547],[297,1170],[389,1547],[535,1547],[627,1174],[719,1547],[889,1547],[745,1000],[554,1000],[462,1376],[370,1000],[179,1000]],f:[1,1,1,1,1,1,1,1,1,1,1,1,1],e:[13]},
{p:[[222,1280],[25,1547],[210,1547],[322,1385],[435,1547],[620,1547],[423,1281],[630,1000],[445,1000],[322,1173],[200,1000],[15,1000]],f:[1,1,1,1,1,1,1,1,1,1,1,1],e:[12]},
{p:[[12,1547],[187,1547],[334,1176],[459,1547],[634,1547],[404,948],[369,857],[277,784],[201,784],[100,784],[100,899],[155,899],[199,899],[240,927],[251,964],[256,979]],f:[1,1,1,1,1,1,0,0,1,1,1,1,0,0,1,1],e:[16]},
{p:[[57,1547],[534,1547],[534,1425],[246,1125],[534,1125],[534,1000],[45,1000],[45,1122],[333,1422],[57,1422]],f:[1,1,1,1,1,1,1,1,1,1],e:[10]},
{p:[[587,947],[587,837],[481,837],[375,837],[277,923],[277,1017],[277,1111],[277,1184],[224,1241],[155,1241],[125,1241],[125,1350],[155,1350],[224,1350],[277,1407],[277,1480],[277,1580],[277,1674],[375,1760],[481,1760],[587,1760],[587,1650],[553,1650],[484,1650],[443,1607],[443,1538],[443,1457],[443,1380],[399,1311],[345,1299],[399,1286],[443,1216],[443,1140],[443,1059],[443,989],[484,947],[553,947]],f:[1,1,1,0,0,1,1,0,0,1,1,1,1,0,0,1,1,0,0,1,1,1,1,0,0,1,1,0,0,1,0,0,1,1,0,0,1],e:[37]},
{p:[[238,1764],[238,764],[127,764],[127,1764]],f:[1,1,1,1],e:[4]},
{p:[[125,947],[159,947],[228,947],[269,989],[269,1059],[269,1140],[269,1216],[313,1286],[367,1299],[313,1311],[269,1380],[269,1457],[269,1538],[269,1607],[228,1650],[159,1650],[125,1650],[125,1760],[231,1760],[337,1760],[435,1674],[435,1580],[435,1480],[435,1407],[488,1350],[557,1350],[587,1350],[587,1241],[557,1241],[488,1241],[435,1184],[435,1111],[435,1017],[435,923],[337,837],[231,837],[125,837]],f:[1,1,0,0,1,1,0,0,1,0,0,1,1,0,0,1,1,1,1,0,0,1,1,0,0,1,1,1,1,0,0,1,1,0,0,1,1],e:[37]},
{p:[[732,1415],[732,1296],[680,1257],[593,1223],[546,1223],[494,1223],[424,1251],[417,1254],[413,1256],[410,1257],[402,1260],[327,1290],[281,1290],[238,1290],[154,1252],[106,1212],[106,1331],[158,1370],[245,1404],[292,1404],[344,1404],[414,1375],[421,1373],[425,1371],[428,1370],[436,1367],[511,1337],[557,1337],[599,1337],[682,1374]],f:[1,1,0,0,1,0,1,0,1,0,1,0,1,0,0,1,1,0,0,1,0,1,0,1,0,1,0,1,0,0],e:[30]},
{p:[],f:[],e:[]},
{p:[[646,1550],[646,1445],[618,1463],[564,1480],[536,1480],[481,1480],[419,1417],[419,1362],[419,1306],[480,1244],[536,1244],[567,1244],[624,1262],[646,1279],[646,1175],[614,1164],[550,1153],[520,1153],[417,1153],[293,1267],[293,1362],[293,1457],[417,1571],[520,1571],[554,1571],[616,1561],[500,1650],[441,1650],[339,1607],[297,1565],[254,1522],[212,1421],[212,1362],[212,1303],[254,1202],[297,1159],[339,1117],[441,1075],[500,1075],[560,1075],[661,1117],[703,1159],[746,1202],[788,1303],[788,1362],[788,1421],[746,1522],[703,1565],[660,1608],[559,1650],[500,1725],[574,1725],[703,1671],[756,1618],[809,1565],[862,1437],[862,1362],[862,1288],[809,1160],[756,1107],[703,1054],[574,1000],[500,1000],[426,1000],[297,1054],[244,1107],[191,1160],[138,1288],[138,1362],[138,1437],[191,1565],[244,1618],[297,1671],[426,1725]],f:[1,1,0,0,1,0,0,1,0,0,1,0,0,1,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0],e:[26,50,74]},
{p:[[318,1519],[318,1401],[175,1293],[318,1185],[318,1067],[77,1247],[77,1338],[552,1519],[552,1401],[409,1293],[552,1185],[552,1067],[311,1247],[311,1338]],f:[1,1,1,1,1,1,1,1,1,1,1,1,1,1],e:[7,14]},
{p:[[102,1442],[278,1442],[278,1253],[102,1253]],f:[1,1,1,1],e:[4]},
{p:[[328,1519],[569,1338],[569,1247],[328,1067],[328,1185],[471,1293],[328,1401],[94,1519],[334,1338],[334,1247],[94,1067],[94,1185],[237,1293],[94,1401]],f:[1,1,1,1,1,1,1,1,1,1,1,1,1,1],e:[7,14]},
{p:[[713,1525],[501,1313],[713,1102],[631,1020],[419,1231],[207,1020],[125,1102],[337,1313],[125,1525],[207,1607],[419,1395],[631,1607]],f:[1,1,1,1,1,1,1,1,1,1,1,1],e:[12]},
{p:[[181,1927],[296,1927],[296,1807],[181,1807],[374,1927],[489,1927],[489,1807],[374,1807],[92,1729],[599,1729],[599,1587],[280,1587],[280,1451],[580,1451],[580,1309],[280,1309],[280,1142],[610,1142],[610,1000],[92,1000]],f:[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],e:[4,8,20]},
{p:[[534,1133],[240,1133],[194,1000],[5,1000],[275,1729],[499,1729],[769,1000],[580,1000],[287,1268],[487,1268],[387,1558]],f:[1,1,1,1,1,1,1,1,1,1,1],e:[8,11]},
{p:[[390,1128],[449,1128],[476,1150],[504,1174],[504,1219],[504,1264],[476,1287],[450,1309],[390,1309],[280,1309],[280,1128],[404,1000],[92,1000],[92,1729],[643,1729],[643,1587],[280,1587],[280,1451],[404,1451],[542,1451],[621,1394],[692,1342],[692,1225],[692,1109],[621,1057],[542,1000]],f:[1,0,1,0,1,0,1,0,1,1,1,1,1,1,1,1,1,1,1,0,1,0,1,0,1,0],e:[11,26]},
{p:[[384,1447],[428,1447],[474,1486],[474,1524],[474,1562],[428,1601],[384,1601],[280,1601],[280,1447],[390,1128],[447,1128],[504,1176],[504,1224],[504,1271],[447,1319],[390,1319],[280,1319],[280,1128],[565,1390],[625,1373],[692,1278],[692,1209],[692,1104],[549,1000],[404,1000],[92,1000],[92,1729],[374,1729],[526,1729],[662,1637],[662,1536],[662,1483],[612,1408]],f:[1,0,0,1,0,0,1,1,1,1,0,0,1,0,0,1,1,1,1,0,0,1,0,0,1,1,1,1,0,0,1,0,0],e:[9,18,33]},
{p:[[92,1000],[92,1729],[610,1729],[610,1587],[280,1587],[280,1000]],f:[1,1,1,1,1,1],e:[6]},
{p:[[336,1142],[540,1142],[540,1587],[382,1587],[382,1542],[382,1230],[115,1142],[166,1176],[194,1275],[194,1591],[194,1729],[728,1729],[728,1142],[831,1142],[831,843],[688,843],[688,1000],[202,1000],[202,843],[60,843],[60,1142]],f:[1,1,1,1,1,0,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1],e:[6,21]},
{p:[[92,1729],[599,1729],[599,1587],[280,1587],[280,1451],[580,1451],[580,1309],[280,1309],[280,1142],[610,1142],[610,1000],[92,1000]],f:[1,1,1,1,1,1,1,1,1,1,1,1],e:[12]},
{p:[[15,1000],[313,1437],[46,1729],[244,1729],[518,1428],[518,1729],[706,1729],[706,1428],[980,1729],[1178,1729],[911,1437],[1209,1000],[1002,1000],[793,1307],[706,1212],[706,1000],[518,1000],[518,1212],[431,1307],[222,1000]],f:[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],e:[20]},
{p:[[494,1393],[568,1374],[645,1280],[645,1207],[645,1099],[479,986],[305,986],[233,986],[119,1004],[66,1022],[66,1167],[119,1141],[223,1114],[297,1114],[377,1114],[457,1166],[457,1214],[457,1264],[375,1315],[281,1315],[191,1315],[191,1436],[285,1436],[370,1436],[439,1480],[439,1526],[439,1568],[372,1614],[306,1614],[236,1614],[116,1590],[83,1573],[83,1711],[115,1722],[259,1742],[305,1742],[465,1742],[627,1649],[627,1555],[627,1491],[560,1410]],f:[1,0,0,1,0,0,1,0,0,1,1,0,0,1,0,0,1,0,0,1,1,1,1,0,0,1,0,0,1,0,0,1,1,0,0,1,0,0,1,0,0],e:[41]},
{p:[[745,1729],[745,1000],[567,1000],[567,1500],[302,1000],[92,1000],[92,1729],[270,1729],[270,1229],[535,1729]],f:[1,1,1,1,1,1,1,1,1,1],e:[10]},
{p:[[745,1729],[745,1000],[567,1000],[567,1500],[302,1000],[92,1000],[92,1729],[270,1729],[270,1229],[535,1729],[238,1927],[308,1927],[318,1897],[365,1868],[402,1868],[439,1868],[486,1897],[497,1927],[566,1927],[559,1864],[475,1798],[402,1798],[330,1798],[246,1864]],f:[1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,0,0,1,1,0,0,1,0,0],e:[10,24]},
{p:[[92,1729],[280,1729],[280,1428],[574,1729],[787,1729],[497,1434],[803,1000],[596,1000],[376,1311],[280,1212],[280,1000],[92,1000]],f:[1,1,1,1,1,1,1,1,1,1,1,1],e:[12]},
{p:[[46,1000],[46,1142],[170,1156],[220,1317],[220,1591],[220,1729],[739,1729],[739,1000],[551,1000],[551,1587],[408,1587],[408,1542],[408,1275],[313,1027]],f:[1,1,0,0,1,1,1,1,1,1,1,1,0,0],e:[14]},
{p:[[92,1729],[331,1729],[497,1339],[664,1729],[903,1729],[903,1000],[725,1000],[725,1533],[557,1140],[438,1140],[270,1533],[270,1000],[92,1000]],f:[1,1,1,1,1,1,1,1,1,1,1,1,1],e:[13]},
{p:[[92,1729],[280,1729],[280,1451],[557,1451],[557,1729],[745,1729],[745,1000],[557,1000],[557,1309],[280,1309],[280,1000],[92,1000]],f:[1,1,1,1,1,1,1,1,1,1,1,1],e:[12]},
{p:[[425,1606],[339,1606],[244,1479],[244,1364],[244,1249],[339,1122],[425,1122],[511,1122],[606,1249],[606,1364],[606,1479],[511,1606],[425,1742],[601,1742],[800,1541],[800,1364],[800,1187],[601,986],[425,986],[250,986],[50,1187],[50,1364],[50,1541],[250,1742]],f:[1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0],e:[12,24]},
{p:[[745,1729],[745,1000],[557,1000],[557,1587],[280,1587],[280,1000],[92,1000],[92,1729]],f:[1,1,1,1,1,1,1,1],e:[8]},
{p:[[92,1729],[404,1729],[543,1729],[692,1605],[692,1491],[692,1376],[543,1253],[404,1253],[280,1253],[280,1000],[92,1000],[280,1593],[280,1389],[384,1389],[438,1389],[498,1442],[498,1491],[498,1540],[438,1593],[384,1593]],f:[1,1,0,0,1,0,0,1,1,1,1,1,1,1,0,0,1,0,0,1],e:[11,20]},
{p:[[670,1040],[618,1013],[506,986],[445,986],[263,986],[50,1189],[50,1364],[50,1539],[263,1742],[445,1742],[506,1742],[618,1715],[670,1688],[670,1537],[618,1573],[516,1606],[460,1606],[359,1606],[244,1477],[244,1364],[244,1251],[359,1122],[460,1122],[516,1122],[618,1155],[670,1191]],f:[1,0,0,1,0,0,1,0,0,1,0,0,1,1,0,0,1,0,0,1,0,0,1,0,0,1],e:[26]},
{p:[[5,1729],[677,1729],[677,1587],[435,1587],[435,1000],[247,1000],[247,1587],[5,1587]],f:[1,1,1,1,1,1,1,1],e:[8]},
{p:[[455,1121],[435,1080],[406,1053],[348,1000],[182,1000],[147,1000],[147,1142],[199,1142],[268,1142],[284,1176],[288,1183],[291,1190],[29,1729],[225,1729],[387,1397],[544,1729],[741,1729]],f:[1,0,1,0,1,1,1,1,0,1,0,1,1,1,1,1,1],e:[17]},
{p:[[244,1372],[244,1298],[320,1233],[402,1226],[402,1518],[320,1511],[244,1445],[748,1372],[748,1445],[672,1511],[590,1518],[590,1226],[672,1233],[748,1298],[402,1729],[590,1729],[590,1657],[769,1642],[941,1508],[941,1372],[941,1235],[769,1102],[590,1087],[590,1000],[402,1000],[402,1087],[223,1102],[50,1235],[50,1372],[50,1508],[223,1642],[402,1657]],f:[1,0,0,1,1,0,0,1,0,0,1,1,0,0,1,1,1,0,0,1,0,0,1,1,1,1,0,0,1,0,0,1],e:[7,14,32]},
{p:[[498,1372],[751,1000],[555,1000],[385,1249],[216,1000],[19,1000],[272,1372],[29,1729],[225,1729],[385,1494],[544,1729],[741,1729]],f:[1,1,1,1,1,1,1,1,1,1,1,1],e:[12]},
{p:[[726,1000],[92,1000],[92,1729],[280,1729],[280,1142],[557,1142],[557,1729],[745,1729],[745,1142],[868,1142],[868,843],[726,843]],f:[1,1,1,1,1,1,1,1,1,1,1,1],e:[12]},
{p:[[528,1000],[528,1278],[273,1278],[181,1278],[81,1393],[81,1505],[81,1729],[269,1729],[269,1595],[269,1479],[305,1420],[351,1420],[528,1420],[528,1729],[716,1729],[716,1000]],f:[1,1,1,0,0,1,1,1,1,0,0,1,1,1,1,1],e:[16]},
{p:[[711,1142],[955,1142],[955,1729],[1143,1729],[1143,1000],[92,1000],[92,1729],[280,1729],[280,1142],[523,1142],[523,1729],[711,1729]],f:[1,1,1,1,1,1,1,1,1,1,1,1],e:[12]},
{p:[[1143,1142],[1266,1142],[1266,843],[1124,843],[1124,1000],[92,1000],[92,1729],[280,1729],[280,1142],[523,1142],[523,1729],[711,1729],[711,1142],[955,1142],[955,1729],[1143,1729]],f:[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],e:[16]},
{p:[[588,1128],[647,1128],[702,1174],[702,1219],[702,1264],[647,1309],[588,1309],[478,1309],[478,1128],[290,1587],[49,1587],[49,1729],[478,1729],[478,1451],[602,1451],[740,1451],[890,1342],[890,1225],[890,1109],[740,1000],[602,1000],[290,1000]],f:[1,0,0,1,0,0,1,1,1,1,1,1,1,1,1,0,0,1,0,0,1,1],e:[9,22]},
{p:[[390,1128],[449,1128],[476,1150],[504,1174],[504,1219],[504,1264],[476,1287],[450,1309],[390,1309],[280,1309],[280,1128],[692,1225],[692,1109],[621,1057],[542,1000],[404,1000],[92,1000],[92,1729],[280,1729],[280,1451],[404,1451],[542,1451],[621,1394],[692,1342],[756,1729],[944,1729],[944,1000],[756,1000]],f:[1,0,1,0,1,0,1,0,1,1,1,1,0,1,0,1,1,1,1,1,1,0,1,0,1,1,1,1],e:[11,24,28]},
{p:[[390,1128],[449,1128],[476,1150],[504,1174],[504,1219],[504,1264],[476,1287],[450,1309],[390,1309],[280,1309],[280,1128],[692,1225],[692,1109],[621,1057],[542,1000],[404,1000],[92,1000],[92,1729],[280,1729],[280,1451],[404,1451],[542,1451],[621,1394],[692,1342]],f:[1,0,1,0,1,0,1,0,1,1,1,1,0,1,0,1,1,1,1,1,1,0,1,0],e:[11,24]},
{p:[[64,1191],[165,1122],[270,1122],[375,1122],[474,1234],[482,1293],[154,1293],[154,1435],[482,1435],[474,1494],[375,1606],[270,1606],[165,1606],[64,1537],[64,1688],[168,1742],[289,1742],[471,1742],[684,1539],[684,1189],[471,986],[289,986],[168,986],[64,1040]],f:[1,0,1,0,0,1,1,1,1,0,0,1,0,1,1,0,1,0,0,0,0,1,0,1],e:[24]},
{p:[[373,1435],[387,1558],[478,1650],[568,1742],[744,1742],[919,1742],[1119,1541],[1119,1364],[1119,1187],[919,986],[744,986],[568,986],[478,1078],[387,1170],[373,1293],[280,1293],[280,1000],[92,1000],[92,1729],[280,1729],[280,1435],[744,1606],[658,1606],[563,1479],[563,1364],[563,1249],[658,1122],[744,1122],[830,1122],[925,1249],[925,1364],[925,1479],[830,1606]],f:[1,0,1,0,1,0,0,1,0,0,1,0,1,0,1,1,1,1,1,1,1,1,0,0,1,0,0,1,0,0,1,0,0],e:[21,33]},
{p:[[286,1500],[286,1450],[337,1406],[396,1406],[490,1406],[490,1593],[396,1593],[337,1593],[286,1550],[64,1000],[246,1310],[208,1331],[98,1436],[98,1508],[98,1618],[232,1729],[376,1729],[678,1729],[678,1000],[490,1000],[490,1276],[426,1276],[264,1000]],f:[1,0,0,1,1,1,1,0,0,1,1,0,0,1,0,0,1,1,1,1,1,1,1],e:[9,23]},
{p:[[329,1246],[274,1246],[219,1209],[219,1173],[219,1140],[264,1102],[303,1102],[353,1102],[420,1173],[420,1226],[420,1246],[596,1312],[596,1000],[420,1000],[420,1081],[385,1031],[297,986],[234,986],[149,986],[43,1085],[43,1164],[43,1260],[175,1350],[317,1350],[420,1350],[420,1364],[420,1405],[354,1444],[285,1444],[229,1444],[132,1421],[91,1399],[91,1532],[147,1546],[260,1560],[317,1560],[465,1560],[596,1443]],f:[1,0,0,1,0,0,1,0,0,1,1,1,1,1,1,0,0,1,0,0,1,0,0,1,1,1,0,0,1,0,0,1,1,0,0,1,0,0],e:[11,38]},
{p:[[54,1303],[50,1385],[43,1417],[43,1450],[43,1546],[71,1608],[124,1724],[193,1747],[251,1767],[491,1786],[515,1788],[543,1792],[582,1684],[545,1674],[354,1658],[271,1650],[237,1627],[180,1588],[176,1516],[248,1560],[355,1560],[497,1560],[655,1408],[655,1273],[655,1138],[497,986],[355,986],[214,986],[54,1138],[54,1273],[54,1292],[355,1435],[297,1435],[236,1352],[236,1273],[236,1194],[297,1111],[355,1111],[413,1111],[473,1194],[473,1273],[473,1352],[413,1435]],f:[1,1,0,1,0,1,0,1,0,1,0,1,1,0,1,0,1,0,1,0,1,0,0,1,0,0,1,0,0,1,0,1,0,0,1,0,0,1,0,0,1,0,0],e:[31,43]},
{p:[[341,1341],[372,1341],[403,1366],[403,1390],[403,1415],[372,1439],[341,1439],[259,1439],[259,1341],[347,1109],[386,1109],[425,1140],[425,1171],[425,1201],[386,1231],[347,1231],[259,1231],[259,1109],[84,1547],[334,1547],[456,1547],[565,1478],[565,1402],[565,1362],[525,1306],[487,1292],[536,1279],[589,1208],[589,1157],[589,1078],[475,1000],[358,1000],[84,1000]],f:[1,0,0,1,0,0,1,1,1,1,0,0,1,0,0,1,1,1,1,1,0,0,1,0,0,1,0,0,1,0,0,1,1],e:[9,18,33]},
{p:[[84,1000],[84,1547],[499,1547],[499,1439],[259,1439],[259,1000]],f:[1,1,1,1,1,1],e:[6]},
{p:[[85,1125],[141,1144],[188,1267],[188,1443],[188,1547],[661,1547],[661,1125],[751,1125],[751,862],[626,862],[626,1000],[181,1000],[181,862],[56,862],[56,1125],[486,1422],[363,1422],[363,1407],[363,1228],[322,1125],[486,1125]],f:[1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1],e:[15,21]},
{p:[[630,1275],[630,1225],[221,1225],[228,1164],[304,1102],[372,1102],[427,1102],[543,1135],[604,1168],[604,1033],[542,1010],[418,986],[356,986],[208,986],[43,1137],[43,1273],[43,1407],[205,1560],[346,1560],[475,1560],[630,1405],[450,1333],[450,1383],[392,1444],[345,1444],[294,1444],[231,1387],[223,1333]],f:[1,1,1,0,0,1,0,0,1,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1],e:[21,28]},
{p:[[15,1000],[262,1325],[34,1547],[225,1547],[410,1367],[410,1547],[585,1547],[585,1367],[770,1547],[961,1547],[733,1325],[980,1000],[800,1000],[629,1224],[585,1181],[585,1000],[410,1000],[410,1181],[366,1224],[195,1000]],f:[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],e:[20]},
{p:[[141,1341],[221,1341],[292,1341],[345,1372],[345,1394],[345,1444],[229,1444],[133,1444],[74,1410],[74,1537],[163,1560],[268,1560],[391,1560],[504,1490],[504,1417],[504,1320],[397,1295],[518,1265],[518,1155],[518,1071],[385,986],[243,986],[137,986],[49,1013],[49,1148],[158,1102],[223,1102],[294,1102],[358,1141],[358,1165],[358,1233],[218,1233],[141,1233]],f:[1,1,0,0,1,0,1,0,1,1,0,1,0,0,1,0,1,0,1,0,0,1,0,1,1,0,1,0,0,1,0,1,1],e:[33]},
{p:[[617,1547],[617,1000],[442,1000],[442,1291],[266,1000],[84,1000],[84,1547],[259,1547],[259,1256],[435,1547]],f:[1,1,1,1,1,1,1,1,1,1],e:[10]},
{p:[[617,1547],[617,1000],[442,1000],[442,1291],[266,1000],[84,1000],[84,1547],[259,1547],[259,1256],[435,1547],[187,1765],[256,1765],[262,1730],[310,1694],[351,1694],[391,1694],[439,1730],[445,1765],[515,1765],[512,1694],[427,1620],[351,1620],[274,1620],[189,1694]],f:[1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,0,0,1,1,0,0,1,0,0],e:[10,24]},
{p:[[84,1547],[259,1547],[259,1362],[454,1547],[645,1547],[412,1325],[664,1000],[483,1000],[308,1226],[259,1179],[259,1000],[84,1000]],f:[1,1,1,1,1,1,1,1,1,1,1,1],e:[12]},
{p:[[55,1000],[55,1125],[142,1143],[161,1200],[176,1243],[176,1458],[176,1547],[648,1547],[648,1000],[474,1000],[474,1422],[351,1422],[351,1404],[351,1189],[317,1127],[249,1000]],f:[1,1,0,1,0,1,1,1,1,1,1,1,1,0,1,0],e:[16]},
{p:[[84,1547],[285,1547],[408,1273],[531,1547],[733,1547],[733,1000],[559,1000],[559,1310],[466,1105],[352,1105],[259,1310],[259,1000],[84,1000]],f:[1,1,1,1,1,1,1,1,1,1,1,1,1],e:[13]},
{p:[[84,1547],[259,1547],[259,1339],[432,1339],[432,1547],[607,1547],[607,1000],[432,1000],[432,1231],[259,1231],[259,1000],[84,1000]],f:[1,1,1,1,1,1,1,1,1,1,1,1],e:[12]},
{p:[[344,1435],[286,1435],[225,1352],[225,1273],[225,1194],[286,1111],[344,1111],[401,1111],[462,1194],[462,1273],[462,1352],[401,1435],[344,1560],[485,1560],[644,1408],[644,1273],[644,1138],[485,986],[344,986],[203,986],[43,1138],[43,1273],[43,1408],[203,1560]],f:[1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0],e:[12,24]},
{p:[[607,1547],[607,1000],[432,1000],[432,1422],[259,1422],[259,1000],[84,1000],[84,1547]],f:[1,1,1,1,1,1,1,1],e:[8]},
{p:[[259,1079],[259,792],[84,792],[84,1547],[259,1547],[259,1467],[295,1515],[383,1560],[440,1560],[541,1560],[671,1399],[671,1273],[671,1146],[541,986],[440,986],[383,986],[295,1031],[375,1433],[319,1433],[259,1351],[259,1273],[259,1195],[319,1113],[375,1113],[431,1113],[490,1195],[490,1273],[490,1351],[431,1433]],f:[1,1,1,1,1,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0],e:[17,29]},
{p:[[526,1530],[526,1387],[490,1412],[418,1435],[380,1435],[307,1435],[225,1350],[225,1273],[225,1196],[307,1111],[380,1111],[421,1111],[495,1135],[526,1159],[526,1016],[485,1001],[400,986],[358,986],[210,986],[43,1138],[43,1273],[43,1408],[210,1560],[358,1560],[401,1560],[484,1545]],f:[1,1,0,0,1,0,0,1,0,0,1,0,0,1,1,0,0,1,0,0,1,0,0,1,0,0],e:[26]},
{p:[[4,1547],[575,1547],[575,1439],[377,1439],[377,1000],[203,1000],[203,1439],[4,1439]],f:[1,1,1,1,1,1,1,1],e:[8]},
{p:[[12,1547],[187,1547],[334,1176],[459,1547],[634,1547],[404,948],[369,857],[277,784],[201,784],[100,784],[100,899],[155,899],[199,899],[240,927],[251,964],[256,979]],f:[1,1,1,1,1,1,0,0,1,1,1,1,0,0,1,1],e:[16]},
{p:[[327,1433],[295,1433],[236,1351],[236,1273],[236,1195],[295,1113],[327,1113],[379,1113],[409,1149],[409,1397],[379,1433],[409,1760],[583,1760],[583,1524],[635,1560],[706,1560],[807,1560],[937,1399],[937,1273],[937,1146],[807,986],[706,986],[635,986],[583,1021],[583,792],[409,792],[409,1021],[357,986],[286,986],[185,986],[55,1146],[55,1273],[55,1399],[185,1560],[286,1560],[357,1560],[409,1524],[666,1433],[613,1433],[583,1397],[583,1149],[613,1113],[666,1113],[697,1113],[756,1195],[756,1273],[756,1351],[697,1433]],f:[1,0,0,1,0,0,1,0,1,1,0,1,1,1,0,1,0,0,1,0,0,1,0,1,1,1,1,0,1,0,0,1,0,0,1,0,1,1,0,1,1,0,1,0,0,1,0,0],e:[11,37,48]},
{p:[[222,1280],[25,1547],[210,1547],[322,1385],[435,1547],[620,1547],[423,1281],[630,1000],[445,1000],[322,1173],[200,1000],[15,1000]],f:[1,1,1,1,1,1,1,1,1,1,1,1],e:[12]},
{p:[[573,862],[573,1000],[84,1000],[84,1547],[259,1547],[259,1125],[432,1125],[432,1547],[607,1547],[607,1125],[698,1125],[698,862]],f:[1,1,1,1,1,1,1,1,1,1,1,1],e:[12]},
{p:[[398,1000],[398,1211],[219,1211],[146,1211],[64,1298],[64,1383],[64,1547],[239,1547],[239,1450],[239,1363],[268,1319],[305,1319],[398,1319],[398,1547],[573,1547],[573,1000]],f:[1,1,1,0,0,1,1,1,1,0,0,1,1,1,1,1],e:[16]},
{p:[[615,1125],[797,1125],[797,1547],[972,1547],[972,1000],[84,1000],[84,1547],[259,1547],[259,1125],[440,1125],[440,1547],[615,1547]],f:[1,1,1,1,1,1,1,1,1,1,1,1],e:[12]},
{p:[[938,1000],[84,1000],[84,1547],[259,1547],[259,1125],[440,1125],[440,1547],[615,1547],[615,1125],[797,1125],[797,1547],[972,1547],[972,1125],[1062,1125],[1062,862],[938,862]],f:[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],e:[16]},
{p:[[470,1109],[509,1109],[548,1140],[548,1171],[548,1201],[509,1231],[470,1231],[382,1231],[382,1109],[207,1000],[207,1439],[20,1439],[20,1547],[382,1547],[382,1339],[481,1339],[592,1339],[711,1258],[711,1080],[591,1000],[481,1000]],f:[1,0,0,1,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1],e:[9,21]},
{p:[[648,1547],[823,1547],[823,1000],[648,1000],[425,1171],[425,1202],[405,1217],[386,1231],[347,1231],[259,1231],[259,1109],[347,1109],[386,1109],[405,1125],[425,1140],[84,1547],[259,1547],[259,1339],[358,1339],[469,1339],[528,1299],[588,1258],[588,1169],[588,1080],[528,1040],[469,1000],[358,1000],[84,1000]],f:[1,1,1,1,1,0,1,0,1,1,1,1,0,1,0,1,1,1,1,0,1,0,1,0,1,0,1,1],e:[4,15,28]},
{p:[[425,1171],[425,1202],[405,1217],[386,1231],[347,1231],[259,1231],[259,1109],[347,1109],[386,1109],[405,1125],[425,1140],[84,1547],[259,1547],[259,1339],[358,1339],[469,1339],[528,1299],[588,1258],[588,1169],[588,1080],[528,1040],[469,1000],[358,1000],[84,1000]],f:[1,0,1,0,1,1,1,1,0,1,0,1,1,1,1,0,1,0,1,0,1,0,1,1],e:[11,24]},
{p:[[131,1324],[362,1324],[356,1360],[286,1435],[137,1435],[67,1387],[67,1530],[150,1560],[235,1560],[383,1560],[550,1408],[550,1138],[383,986],[235,986],[149,986],[67,1016],[67,1159],[130,1111],[208,1111],[284,1111],[357,1184],[363,1226],[131,1226]],f:[1,1,0,0,0,1,1,0,1,0,0,0,0,1,0,1,1,0,1,0,0,1,1],e:[23]},
{p:[[84,1547],[259,1547],[259,1328],[330,1328],[340,1421],[413,1491],[486,1560],[628,1560],[769,1560],[928,1408],[928,1273],[928,1138],[769,986],[628,986],[486,986],[413,1056],[340,1126],[331,1220],[259,1220],[259,1000],[84,1000],[628,1435],[570,1435],[509,1352],[509,1273],[509,1194],[570,1111],[628,1111],[685,1111],[746,1194],[746,1273],[746,1352],[685,1435]],f:[1,1,1,1,0,1,0,1,0,0,1,0,0,1,0,1,0,1,1,1,1,1,0,0,1,0,0,1,0,0,1,0,0],e:[21,33]},
{p:[[239,1374],[239,1339],[277,1308],[322,1308],[385,1308],[385,1440],[322,1440],[277,1440],[239,1410],[31,1000],[174,1234],[132,1258],[71,1341],[71,1393],[71,1471],[176,1547],[293,1547],[560,1547],[560,1000],[385,1000],[385,1200],[323,1200],[201,1000]],f:[1,0,0,1,1,1,1,0,0,1,1,0,0,1,0,0,1,1,1,1,1,1,1],e:[9,23]},
{p:[[54,1337],[446,1337],[446,1211],[54,1211]],f:[1,1,1,1],e:[4]},
{p:[[54,1337],[946,1337],[946,1211],[54,1211]],f:[1,1,1,1],e:[4]},
{p:[[269,1418],[103,1418],[103,1557],[214,1729],[318,1729],[269,1557]],f:[1,1,1,1,1,1],e:[6]},
{p:[[112,1729],[278,1729],[278,1590],[167,1418],[63,1418],[112,1590]],f:[1,1,1,1,1,1],e:[6]},
{p:[[516,1418],[350,1418],[350,1556],[461,1729],[565,1729],[516,1556],[269,1418],[103,1418],[103,1557],[214,1729],[318,1729],[269,1557]],f:[1,1,1,1,1,1,1,1,1,1,1,1],e:[6,12]},
{p:[[141,1729],[307,1729],[307,1590],[196,1418],[92,1418],[141,1590],[388,1729],[554,1729],[554,1589],[443,1418],[339,1418],[388,1589]],f:[1,1,1,1,1,1,1,1,1,1,1,1],e:[6,12]},
{p:[[144,1372],[144,1408],[170,1472],[195,1496],[221,1521],[284,1547],[320,1547],[355,1547],[419,1521],[444,1496],[469,1471],[495,1408],[495,1372],[495,1336],[469,1272],[444,1247],[419,1222],[355,1196],[319,1196],[283,1196],[220,1222],[195,1247],[170,1272],[144,1336]],f:[1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0],e:[24]},
{p:[[745,1189],[921,1189],[921,1000],[745,1000],[79,1189],[255,1189],[255,1000],[79,1000],[412,1189],[588,1189],[588,1000],[412,1000]],f:[1,1,1,1,1,1,1,1,1,1,1,1],e:[4,8,12]},
{p:[[1026,1448],[970,1448],[940,1394],[940,1293],[970,1238],[1026,1238],[1056,1293],[1056,1394],[92,1729],[302,1729],[567,1229],[567,1562],[567,1660],[657,1729],[803,1729],[803,1621],[761,1621],[745,1591],[745,1562],[745,1000],[535,1000],[270,1500],[270,1167],[270,1069],[180,1000],[34,1000],[34,1108],[76,1108],[92,1138],[92,1167],[926,1522],[1071,1522],[1154,1427],[1154,1261],[1071,1165],[926,1165],[843,1261],[843,1427],[843,1098],[1154,1098],[1154,1000],[843,1000]],f:[0,0,0,0,0,0,0,0,1,1,1,1,0,0,1,1,0,0,1,1,1,1,1,0,0,1,1,0,0,1,0,0,0,0,0,0,0,0,1,1,1,1],e:[8,30,38,42]},
{p:[[91,877],[91,1643],[854,1643],[854,877]],f:[1,1,1,1],e:[4]},
{p:[[55,1157],[55,1361],[157,1538],[334,1641],[539,1641],[716,1538],[818,1361],[818,1157],[716,979],[539,877],[334,877],[157,979]],f:[0,0,0,0,0,0,0,0,0,0,0,0],e:[12]}
]
};

const PDF_FONTS = { reg: REG_FONT, bold: BOLD_FONT };

/* ------------------------------------------------------------
   [4] ЭКСПОРТ/ИМПОРТ — js/exporters.js (.xlsx / .pdf / .json)
   ------------------------------------------------------------ */
// ============================================================
// ЭКСПОРТ ЛИСТА ПЕРСОНАЖА — .xlsx / .pdf / .json
// Всё работает на стороне клиента, без сервера и без внешних
// библиотек (файлы формируются «вручную» по спецификациям):
//   .json — сериализация персонажа + schemaVersion (как Data/ExportExample.json)
//   .xlsx — OOXML-архив: ZIP stored (без сжатия) + CRC-32
//   .pdf  — PDF 1.7 в стиле интерфейса приложения (тёмный фон, неон)
//           со встроенными TrueType-шрифтами (кириллица без транслитерации)
// Скачивание — через Blob + <a download> (поддерживается во всех
// современных браузерах: Chrome, Firefox, Safari, Edge, Opera).
// ============================================================


// ---------- Низкоуровневые утилиты ----------

function crc32(bytes) {
  let c, table = crc32.table;
  if (!table) {
    table = crc32.table = new Uint32Array(256);
    for (let n = 0; n < 256; n++) {
      c = n;
      for (let k = 0; k < 8; k++) c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
      table[n] = c >>> 0;
    }
  }
  let crc = 0xffffffff;
  for (let i = 0; i < bytes.length; i++) crc = table[(crc ^ bytes[i]) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

// ZIP-архив без сжатия (метод stored) — максимально совместимый способ
// собрать .xlsx: Excel, LibreOffice, Google Sheets читают его корректно.
function zipStore(entries) {
  const enc = new TextEncoder();
  const files = entries.map((e) => ({ name: enc.encode(e.name), data: typeof e.data === "string" ? enc.encode(e.data) : e.data }));
  const chunks = [], central = [];
  let offset = 0;

  for (const f of files) {
    const crc = crc32(f.data);
    const local = new DataView(new ArrayBuffer(30));
    local.setUint32(0, 0x04034b50, true);
    local.setUint16(4, 20, true);            // version needed
    local.setUint16(6, 0, true);             // flags
    local.setUint16(8, 0, true);             // method = stored
    local.setUint16(10, 0, true);            // mod time
    local.setUint16(12, 0x21, true);         // mod date (2026-01-01)
    local.setUint32(14, crc, true);
    local.setUint32(18, f.data.length, true);
    local.setUint32(22, f.data.length, true);
    local.setUint16(26, f.name.length, true);
    local.setUint16(28, 0, true);
    chunks.push(new Uint8Array(local.buffer), f.name, f.data);

    const cen = new DataView(new ArrayBuffer(46));
    cen.setUint32(0, 0x02014b50, true);
    cen.setUint16(4, 20, true);
    cen.setUint16(6, 20, true);
    cen.setUint16(8, 0, true);
    cen.setUint16(10, 0, true);              // method = stored
    cen.setUint16(12, 0, true);
    cen.setUint16(14, 0x21, true);
    cen.setUint32(16, crc, true);
    cen.setUint32(20, f.data.length, true);
    cen.setUint32(24, f.data.length, true);
    cen.setUint16(28, f.name.length, true);
    cen.setUint32(42, offset, true);         // relative offset of local header
    central.push(new Uint8Array(cen.buffer), f.name);

    offset += 30 + f.name.length + f.data.length;
  }

  const centralSize = central.reduce((a, b) => a + b.length, 0);
  const eocd = new DataView(new ArrayBuffer(22));
  eocd.setUint32(0, 0x06054b50, true);
  eocd.setUint16(8, files.length, true);
  eocd.setUint16(10, files.length, true);
  eocd.setUint32(12, centralSize, true);
  eocd.setUint32(16, offset, true);

  return new Blob([...chunks, ...central, new Uint8Array(eocd.buffer)], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
}

function xmlEsc(s) {
  return String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

function colLetter(n) { // 1 → A, 27 → AA
  let s = "";
  while (n > 0) { const m = (n - 1) % 26; s = String.fromCharCode(65 + m) + s; n = Math.floor((n - 1) / 26); }
  return s;
}

// ---------- Сбор текстовых данных листа ----------

function buildSheetData(c, dict) {
  const ru = dict.skillRu, statRu = dict.STAT_RU;
  const rows = c.skills.map((s, i) => ({ s, i })).sort((a, b) => b.s.level - a.s.level || a.i - b.i);
  return {
    title: `Cyberpunk RED — ${c.name} «${c.nick}»`,
    identity: [
      ["Имя", c.name], ["Псевдоним", c.nick], ["Возраст", `${c.age} лет`],
      ["Роль", c.roleRu], ["Стиль", c.style], ["Способ создания", c.methodName]
    ],
    derived: [
      ["Бодрость (HP)", `${c.hp} / ${c.hp}`],
      ["Тяжело ранен (порог)", Math.ceil(c.hp / 2)],
      ["Спасбросок от смерти", c.stats.BODY],
      ["Человечность (HUM)", c.hum],
      ["Скорость (MOVE)", c.stats.MOVE],
      ["Наличные (эдди)", c.cash]
    ],
    stats: c.statsOrder.map((k) => [k, statRu[k] || k, c.stats[k]]),
    skills: rows.map(({ s }) => {
      const st = ru.statOf(s.name);
      return [ru.nameOf(s.name), st, ru.statName(st), s.level, (typeof c.stats[st] === "number" ? c.stats[st] : 0) + s.level];
    }),
    lifepath: c.lifepath.map((lp) => [lp.label, lp.value]),
    gear: c.gear.slice(),
    note: c.note
  };
}

// ---------- Экспорт в JSON ----------

function exportJSON(c) {
  const payload = {
    schemaVersion: 1,
    app: "cyberpunk-red-character-generator",
    exportedAt: new Date().toISOString(),
    character: c
  };
  return new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
}

// ---------- Импорт из JSON ----------
// Принимает как полный экспорт этого приложения ({ schemaVersion, character }),
// так и «голый» объект персонажа. Возвращает валидированный объект с
// заполненными служебными полями; при ошибке — бросает Error с текстом для toast.
function parseImportedJSON(text) {
  let obj;
  try { obj = JSON.parse(text); } catch { throw new Error("Файл не является корректным JSON"); }
  const c = (obj && typeof obj === "object" && obj.character) ? obj.character : obj;
  if (!c || typeof c !== "object") throw new Error("В файле нет данных персонажа");
  if (!c.name || !c.stats || !Array.isArray(c.skills)) throw new Error("Не хватает полей: name / stats / skills");
  // заполняем недостающие служебные поля, чтобы лист отрисовался корректно
  c.roleRu ||= c.role || "—";
  c.nick ||= "";
  c.age ||= 20;
  c.style ||= "—";
  c.methodName ||= `Способ №${c.method || "?"}`;
  c.note ||= "Импортирован из файла";
  c.statsOrder ||= Object.keys(c.stats);
  c.hp ??= calcHPFromStats(c);
  c.hum ??= (c.stats.EMP || 0) * 10;
  c.cash ??= 0;
  c.lifepath ||= [];
  // старые/импортированные записи пути без ключей пунктов — дополняем по порядку,
  // чтобы панель «Выбрать вручную» корректно работала и с импортированными листами
  if (typeof LIFEPATH_FIELDS !== "undefined") {
    c.lifepath.forEach((lp, i) => {
      const f = LIFEPATH_FIELDS[i];
      if (f) { lp.key ||= f.key; lp.label ||= f.label; lp.icon ||= f.icon; }
    });
  }
  c.gear ||= [];
  return c;
}

function calcHPFromStats(c) {
  return 10 + Math.ceil(((c.stats.BODY || 0) + (c.stats.WILL || 0)) / 2) * 5;
}

// ---------- Экспорт в XLSX ----------

function sheetXml(rows) {
  let body = "";
  rows.forEach((r, ri) => {
    body += `<row r="${ri + 1}">`;
    r.forEach((val, ci) => {
      const isNum = typeof val === "number" && Number.isFinite(val);
      body += `<c r="${colLetter(ci + 1)}${ri + 1}"${isNum ? "" : ' t="inlineStr"'}>` +
        (isNum ? `<v>${val}</v>` : `<is><t>${xmlEsc(val)}</t></is>`) + `</c>`;
    });
    body += `</row>`;
  });
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetData>${body}</sheetData></worksheet>`;
}

function exportXLSX(data) {
  const S = (title, rows) => ({ title, rows });
  const sheets = [
    S("Персонаж", [
      ["Лист персонажа — Cyberpunk RED"], [],
      ...data.identity, [],
      ["Производные характеристики"], ...data.derived, [],
      ["Примечание о создании"], [data.note]
    ]),
    S("Характеристики", [["Абр.", "Название", "Значение"], ...data.stats]),
    S("Навыки", [["Навык", "Хар-ка", "Название хар-ки", "Уровень", "Ур.+хар-ка"], ...data.skills]),
    S("Жизненный путь", [["Пункт", "Значение"], ...data.lifepath]),
    S("Снаряжение", [["Предмет"], ...data.gear.map((g) => [g])])
  ];

  const wbSheets = sheets.map((s, i) =>
    `<sheet name="${xmlEsc(s.title)}" sheetId="${i + 1}" r:id="rId${i + 1}"/>`).join("");
  const wbRels = sheets.map((_, i) =>
    `<Relationship Id="rId${i + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${i + 1}.xml"/>`).join("");
  const ctOverrides = sheets.map((_, i) =>
    `<Override PartName="/xl/worksheets/sheet${i + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`).join("");

  const entries = [
    { name: "[Content_Types].xml", data: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>${ctOverrides}</Types>` },
    { name: "_rels/.rels", data: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>` },
    { name: "xl/workbook.xml", data: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets>${wbSheets}</sheets></workbook>` },
    { name: "xl/_rels/workbook.xml.rels", data: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${wbRels}</Relationships>` },
    ...sheets.map((s, i) => ({ name: `xl/worksheets/sheet${i + 1}.xml`, data: sheetXml(s.rows) }))
  ];

  return zipStore(entries);
}

// ---------- Экспорт в PDF ----------
// Полноценный PDF 1.7, визуально повторяющий оформление страницы
// (css/style.css): тёмный фон Найт-Сити с неоновой сеткой, красная
// шапка CYBERPUNK/RED, жёлтые/циановые заголовки секций, карточки
// панелей со скруглением и рамкой. Шрифты DejaVu Sans/Bold встраиваются
// как TrueType (Type 42) из js/pdf-fonts.js — поэтому кириллица
// отображается нативно, без транслитерации.
//
// Формат страницы подобран под чтение на телефоне: узкая «книжная»
// полоса (как экран смартфона), одна колонка, крупный кегль, щедрые
// отступы — при 100% масштабе страница заполняет экран без мелкого
// текста и горизонтальной прокрутки.

// Палитра — те же значения, что CSS-переменные :root в css/style.css
const CP = {
  red: "#ff003c", redDeep: "#b3002a", cyan: "#00e5ff", yellow: "#fcee0a",
  bg: "#0b0b10", panel: "#14141c", panel2: "#1b1b26", line: "#2a2a3a",
  text: "#e8e8f0", muted: "#9a9ab0"
};

// Страница «под телефон»: пропорции близки к экрану смартфона,
// масштабирование «по ширине» даёт комфортный размер текста.
const PG = { W: 360, H: 640, M: 14 };

// ---------- Цветовые утилиты ----------
function hexRgb(h) {
  const n = parseInt(h.slice(1), 16);
  return [(n >> 16 & 255) / 255, n >> 8 & 255, n & 255];
}
function mix(a, b, t) {
  const A = hexRgb(a), B = hexRgb(b);
  return `rgb(${A.map((v, i) => (v + (B[i] - v) * t).toFixed(4)).join(" ")})`;
}

// ---------- Встраивание TrueType (Type 42) ----------
// Собирает минимальный валидный TTF (head/hhea/maxp/cvt /hmtx/cmap/loca/glyf)
// из данных js/pdf-fonts.js (генерируются tools/make_pdf_fonts.py).
function buildTTF(F) {
  const ng = F.ng;
  const gidOf = (cp) => (cp >= 0 && cp <= 0xFFFF ? (F.cp[String(cp)] ?? 0) : 0);

  // --- глифы: флаги on-curve -> биты 0/1, координаты delta-кодированием ---
  const glyfParts = [];
  let locaOff = 0;
  const locaOffsets = [0];
  for (let gid = 0; gid < ng; gid++) {
    const g = F.glyphs[gid];
    let bytes = [];
    if (g && g.p && g.p.length) {
      const nc = g.e.length;
      const last = g.p.length - 1;
      const ends = g.e.map((e) => e - 1);
      const flagsArr = [];
      let prevX = 0, prevY = 0;
      const xs = [], ys = [];
      for (let i = 0; i <= last; i++) {
        const x = g.p[i][0], y = g.p[i][1];
        const dx = x - prevX, dy = y - prevY;
        prevX = x; prevY = y;
        xs.push(dx); ys.push(dy);
        let fl = g.f[i] ? 1 : 0;
        if (dx === 0) fl |= 2; else if (dx >= -255 && dx <= 255) fl |= 4;
        if (dy === 0) fl |= 8; else if (dy >= -255 && dy <= 255) fl |= 16;
        flagsArr.push(fl);
      }
      // упаковка флагов: одинаковые подряд -> repeat
      const flagBytes = [];
      for (let i = 0; i <= last;) {
        const fl = flagsArr[i];
        let rep = 0;
        while (i + 1 + rep <= last && flagsArr[i + 1 + rep] === fl && rep < 255) rep++;
        flagBytes.push(fl);
        if (rep) { flagBytes.push(rep); i += rep + 1; } else i++;
      }
      const coordBytes = [];
      for (let i = 0; i <= last; i++) {
        const fl = flagsArr[i];
        if (fl & 2) { if (!(fl & 4)) coordBytes.push(0); }
        else if (fl & 4) coordBytes.push(xs[i] & 0xff);
        else { coordBytes.push(xs[i] >> 8 & 0xff); coordBytes.push(xs[i] & 0xff); }
      }
      for (let i = 0; i <= last; i++) {
        const fl = flagsArr[i];
        if (fl & 8) { if (!(fl & 16)) coordBytes.push(0); }
        else if (fl & 16) coordBytes.push(ys[i] & 0xff);
        else { coordBytes.push(ys[i] >> 8 & 0xff); coordBytes.push(ys[i] & 0xff); }
      }
      const head = new Uint8Array(10 + nc * 2);
      const dv = new DataView(head.buffer);
      dv.setInt16(0, nc, false);
      dv.setInt16(2, 0, false); dv.setInt16(4, 0, false);   // xMin/yMin
      dv.setInt16(6, 0, false); dv.setInt16(8, 0, false);   // xMax/yMax (viewer их не требует)
      ends.forEach((e, k) => dv.setUint16(10 + k * 2, e, false));
      bytes = [...head, ...flagBytes, 0, 0, ...coordBytes]; // 4 байта padding после флагов
    }
    while (bytes.length % 4) bytes.push(0);
    glyfParts.push(new Uint8Array(bytes));
    locaOff += bytes.length;
    locaOffsets.push(locaOff);
  }

  const u16 = (arr, off, v) => { arr[off] = v >> 8 & 0xff; arr[off + 1] = v & 0xff; };
  const u32 = (arr, off, v) => { arr[off] = v >>> 24 & 0xff; arr[off + 1] = v >>> 16 & 0xff; arr[off + 2] = v >>> 8 & 0xff; arr[off + 3] = v & 0xff; };
  const i16 = (arr, off, v) => u16(arr, off, v < 0 ? v + 0x10000 : v);

  const head = new Uint8Array(54);
  i16(head, 4, 1); i16(head, 6, 0); u32(head, 8, 0x5F0F3CF5);
  head.set([0, 1, 0, 0], 12);                 // magicKey
  u16(head, 18, 1);                            // indexToLocFormat: long
  i16(head, 36, 2);                            // macStyle: bold bit handled per-font
  u16(head, 44, 1000);                         // unitsPerEm
  // dataRange 16..20 = 0, glyphDataFormat 34 = 0

  const hhea = new Uint8Array(36);
  i16(hhea, 4, F.asc); i16(hhea, 6, F.desc); i16(hhea, 8, 0);
  u16(hhea, 10, 600);                          // advanceWidthMax
  u16(hhea, 34, ng);                           // numberOfHMetrics

  const maxp = new Uint8Array(32);
  u16(maxp, 4, 1); u16(maxp, 6, ng);

  const cvt = new Uint8Array(4);               // fallback для ppem-масштабирования

  const hmtx = new Uint8Array(ng * 4);
  for (let gid = 0; gid < ng; gid++) {
    u16(hmtx, gid * 4, F.adv[String(gid)] ?? 0);
    u16(hmtx, gid * 4 + 2, 0);                 // lsb = 0 (валидно, просто нетошно)
  }

  // cmap format 4: по одному сегменту на непрерывный диапазон gid'ов
  // (субсет DejaVu даёт связные блоки ASCII / Latin-1 / кириллица / punct)
  const codes = Object.keys(F.cp).map(Number).filter((cc) => cc > 0).sort((a, b) => a - b);
  const segs = [];
  for (const cc of codes) {
    const gid = F.cp[String(cc)];
    const last = segs[segs.length - 1];
    if (last && cc === last.end + 1 && gid === last.deltas[last.deltas.length - 1] + 1) last.end = cc;
    else segs.push({ start: cc, end: cc, deltas: [gid - cc] });
  }
  segs.push({ start: 0xFFFF, end: 0xFFFF, deltas: [1] });
  const segCount = segs.length;
  const searchRange = 2 ** Math.floor(Math.log2(segCount)) * 2;
  const entrySelector = Math.floor(Math.log2(searchRange / 2));
  const rangeShift = segCount * 2 - searchRange;
  const cmapLen = 14 + segCount * 8 + 2;
  const cmap = new Uint8Array(cmapLen);
  const cmv = new DataView(cmap.buffer);
  cmv.setUint16(0, 0, false); cmv.setUint16(2, 1, false);   // version, numTables
  cmv.setUint16(4, 3, false); cmv.setUint16(6, 0, false);   // platform Windows, BMP
  cmv.setUint16(8, 12 + cmapLen, false);                     // offset subtable
  cmv.setUint16(10, 4, false);                               // format 4
  cmv.setUint16(12, cmapLen, false);                         // length
  cmv.setUint16(14, 0, false);                               // language
  cmv.setUint16(16, segCount * 2, false);                    // segCountX2
  cmv.setUint16(18, searchRange, false);
  cmv.setUint16(20, entrySelector, false);
  cmv.setUint16(22, rangeShift, false);
  let p = 24;
  for (const s of segs) { cmv.setUint16(p, s.end, false); p += 2; }
  cmv.setUint16(p, 0, false); p += 2;                        // reservedPad
  for (const s of segs) { cmv.setUint16(p, s.start, false); p += 2; }
  for (const s of segs) { cmv.setUint16(p, ((s.deltas[0] % 0x10000) + 0x10000) % 0x10000, false); p += 2; }
  for (const s of segs) { cmv.setUint16(p, 0, false); p += 2; } // idRangeOffset

  const loca = new Uint8Array((ng + 1) * 4);
  for (let i = 0; i <= ng; i++) u32(loca, i * 4, locaOffsets[i]);

  const glyfLen = glyfParts.reduce((a, g) => a + g.length, 0);
  const tables = [
    { tag: "head", data: head }, { tag: "hhea", data: hhea }, { tag: "maxp", data: maxp },
    { tag: "cvt ", data: cvt }, { tag: "hmtx", data: hmtx }, { tag: "cmap", data: cmap },
    { tag: "loca", data: loca }, { tag: "glyf", data: (() => { const all = new Uint8Array(glyfLen); let o = 0; for (const g of glyfParts) { all.set(g, o); o += g.length; } return all; })() }
  ];

  // сортировка по тегу (требование спецификации к порядку таблиц)
  tables.sort((a, b) => (a.tag < b.tag ? -1 : a.tag > b.tag ? 1 : 0));

  const numTables = tables.length;
  const headerLen = 12 + numTables * 16;
  let bodyLen = 0;
  const recs = tables.map((t) => {
    const len = t.data.length;
    const pad = (4 - (len % 4)) % 4;
    const off = headerLen + bodyLen;
    bodyLen += len + pad;
    return { ...t, off, len, pad };
  });
  const out = new Uint8Array(headerLen + bodyLen);
  const ov = new DataView(out.buffer);
  ov.setUint32(0, 0x00010000, false);
  ov.setUint16(4, numTables, false);
  let sr = 16; while (sr * 2 <= numTables * 16) sr *= 2;
  ov.setUint16(6, Math.log2(sr / 16), false);
  ov.setUint16(8, sr, false);
  ov.setUint16(10, numTables * 16 - sr, false);
  let cursor = headerLen;
  for (const r of recs) {
    for (let i = 0; i < 4; i++) out[cursor + i] = r.tag.charCodeAt(i);
    u32(out, cursor + 4, 0); // checksum (viewers не проверяют)
    u32(out, cursor + 8, r.off);
    u32(out, cursor + 12, r.len);
    cursor += 16;
  }
  for (const r of recs) { out.set(r.data, r.off); cursor = r.off + r.len + r.pad; }
  return { bytes: out, gidOf };
}

// Объекты PDF-файла: dict — словарь объекта/стрима; если data задан,
// объект оформляется как потоковый (stream ... endstream).
class PdfDoc {
  constructor() { this.objs = []; }
  add(dict, data) { this.objs.push({ dict, data }); return this.objs.length; }
  set(id, dict) { this.objs[id - 1] = { dict, data: null }; }
  assemble() {
    const chunks = [];
    let len = 0;
    const enc = new TextEncoder();
    const pushPart = (p) => { const b = typeof p === "string" ? enc.encode(p) : p; chunks.push(b); len += b.length; };
    pushPart("%PDF-1.7\n%\xE2\xE3\xCF\xD3\n");
    const offsets = [];
    this.objs.forEach((o, i) => {
      offsets.push(len);
      pushPart(`${i + 1} 0 obj\n`);
      if (o.data !== undefined && o.data !== null) {
        pushPart(o.dict + "\nstream\n");
        pushPart(o.data);
        pushPart("\nendstream\n");
      } else {
        pushPart(o.dict + "\n");
      }
      pushPart("endobj\n");
    });
    const xrefPos = len;
    let xr = `xref\n0 ${this.objs.length + 1}\n0000000000 65535 f \n`;
    for (const off of offsets) xr += String(off).padStart(10, "0") + " 00000 n \n";
    pushPart(xr);
    pushPart(`trailer\n<< /Size ${this.objs.length + 1} /Root ${this.catalogId} 0 R /Info ${this.infoId} 0 R >>\nstartxref\n${xrefPos}\n%%EOF`);
    return new Blob(chunks, { type: "application/pdf" });
  }
}

// ---------- Текст: измерение и перенос по словам ----------
function measure(str, font, size) {
  let w = 0;
  for (const ch of str) {
    const cp = ch.codePointAt(0);
    const gid = font.gidOf(cp);
    w += (font.F.adv[String(gid)] ?? 0);
  }
  return w / 1000 * size;
}
function wrapText(str, font, size, maxW) {
  const words = String(str ?? "").split(/\s+/).filter(Boolean);
  const lines = [];
  let cur = "";
  for (const wd of words) {
    const cand = cur ? cur + " " + wd : wd;
    if (!cur || measure(cand, font, size) <= maxW) cur = cand;
    else { lines.push(cur); cur = wd; }
  }
  if (cur) lines.push(cur);
  return lines.length ? lines : [""];
}

// ---------- Рисование страниц (content-операторы) ----------
function escStr(s) {
  return s.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function drawPanel(ops, x, yTop, w, h, fillHex, strokeHex) {
  const r = 8, top = yTop, bot = yTop - h;
  const k = 0.5523 * r; // константа аппроксимации четверти окружности кубическим Безье
  ops.push(`q ${hexRgb(fillHex).join(" ")} rg${strokeHex ? ` ${hexRgb(strokeHex).join(" ")} RG 1 w` : ""}`);
  ops.push(`${x + r} ${top} m`);
  ops.push(`${x + w - r} ${top} l`);
  ops.push(`${x + w - r + k} ${top} ${x + w} ${top - r + k} ${x + w} ${top - r} c`);
  ops.push(`${x + w} ${bot + r} l`);
  ops.push(`${x + w} ${bot + r - k} ${x + w - r + k} ${bot} ${x + w - r} ${bot} c`);
  ops.push(`${x + r} ${bot} l`);
  ops.push(`${x + r - k} ${bot} ${x} ${bot + r - k} ${x} ${bot + r} c`);
  ops.push(`${x} ${top - r} l`);
  ops.push(`${x} ${top - r + k} ${x + r - k} ${top} ${x + r} ${top} c`);
  ops.push(strokeHex ? "B" : "f");
  ops.push("Q");
}

function drawChip(ops, cx, cy, label, font, textColor, fillHex) {
  const size = 8.5;
  const tw = measure(label, font, size);
  const w = tw + 12, h = 15;
  const x = cx - w / 2, y = cy - h / 2;
  drawPanel(ops, x, y + h, w, h, fillHex, CP.line);
  ops.push(`BT /F1 ${size} Tf ${hexRgb(textColor).join(" ")} rg ${(cx - tw / 2).toFixed(2)} ${(cy - size * 0.3).toFixed(2)} Td (${escStr(label)}) Tj ET`);
}

// ---------- Основной экспортёр ----------
function exportPDF(c, dict) {
  const GROUP_RU = dict.GROUP_RU || {};
  const skillRu = (n) => (dict.SKILL_BY_NAME?.[n]?.ru) || n;
  const skillStat = (n) => (dict.SKILL_BY_NAME?.[n]?.stat) || "—";
  const statRu = (s) => dict.STAT_RU?.[s] || s;

  // Шрифты: собираем встраиваемые TTF из данных js/pdf-fonts.js
  const R = buildTTF(PDF_FONTS.reg);  R.F = PDF_FONTS.reg;
  const B = buildTTF(PDF_FONTS.bold); B.F = PDF_FONTS.bold;

  const W = PG.W, H = PG.H, M = PG.M;
  const CW = W - 2 * M; // ширина контента
  const pagesOps = [];
  let ops = null, y = 0;

  // фон + неоновая сетка (как .bg-grid в css/style.css)
  const pageDecor = () => {
    const o = [`q ${hexRgb(CP.bg).join(" ")} rg 0 0 ${W} ${H} re f Q`];
    o.push(`q 0.4 w`);
    for (let gy = 42; gy < H; gy += 42) o.push(`0.05 0.30 0.32 RG 0 ${gy} m ${W} ${gy} l S`);
    for (let gx = 42; gx < W; gx += 42) o.push(`0.32 0.02 0.08 RG ${gx} 0 m ${gx} ${H} l S`);
    o.push(`Q`);
    return o;
  };
  const newPage = () => {
    if (ops) pagesOps.push(ops);
    ops = pageDecor();
    y = H - 68;
  };
  const ensure = (need) => { if (y - need < 36) newPage(); };

  newPage();

  // ---- Шапка (как .app-head: CYBERPUNK красным + RED жёлтым) ----
  ops.push(`q ${hexRgb(CP.panel).join(" ")} rg 0 ${H - 52} ${W} 52 re f Q`);
  ops.push(`0.165 0.165 0.228 RG 1 w 0 ${(H - 52.5).toFixed(1)} m ${W} ${(H - 52.5).toFixed(1)} l S`);
  ops.push(`BT /F2 17 Tf ${hexRgb(CP.red).join(" ")} rg ${M} ${H - 33} Td (CYBERPUNK) Tj ET`);
  ops.push(`BT /F2 17 Tf ${hexRgb(CP.yellow).join(" ")} rg ${(M + measure("CYBERPUNK ", B, 17) + 6).toFixed(2)} ${H - 33} Td (RED) Tj ET`);
  ops.push(`BT /F1 8.5 Tf ${hexRgb(CP.muted).join(" ")} rg ${M} ${H - 46} Td (${escStr("Лист персонажа · Найт-Сити 2045")}) Tj ET`);

  // ---- Имя / роль ----
  ensure(46);
  drawPanel(ops, M, y, CW, 44, CP.panel2, CP.line);
  ops.push(`BT /F2 14 Tf ${hexRgb(CP.text).join(" ")} rg ${M + 10} ${y - 19} Td (${escStr(`${c.name}${c.nick ? ` «${c.nick}»` : ""}`)}) Tj ET`);
  ops.push(`BT /F1 9.5 Tf ${hexRgb(CP.cyan).join(" ")} rg ${M + 10} ${y - 34} Td (${escStr(`${dict.ROLE_RU?.[c.role] || c.role} · ${c.methodName || ""}`)}) Tj ET`);
  ops.push(`BT /F2 9.5 Tf ${hexRgb(CP.yellow).join(" ")} rg ${(W - M - 10 - measure(`${c.age} лет`, B, 9.5)).toFixed(2)} ${y - 19} Td (${escStr(`${c.age} лет`)}) Tj ET`);
  y -= 54;

  // ---- Карточка секции (заголовок с цветной полосой слева) ----
  const section = (title, accent) => {
    ensure(48);
    y -= 6;
    drawPanel(ops, M, y, CW, 18, CP.panel, CP.line);
    ops.push(`q ${hexRgb(accent).join(" ")} rg ${M} ${y - 18} 3 18 re f Q`);
    ops.push(`BT /F2 10.5 Tf ${hexRgb(accent).join(" ")} rg ${M + 9} ${y - 12.5} Td (${escStr(title.toUpperCase())}) Tj ET`);
    y -= 26;
  };
  const kv = (label, value, opts = {}) => {
    ensure(16);
    const size = opts.size || 9.5;
    ops.push(`BT /F1 ${size} Tf ${hexRgb(CP.muted).join(" ")} rg ${M + 8} ${(y - size).toFixed(2)} Td (${escStr(label)}) Tj ET`);
    const lw = measure(label + "  ", R, size);
    const lines = wrapText(value, B, size, CW - 16 - lw);
    lines.forEach((ln, i) => {
      ops.push(`BT /F2 ${size} Tf ${hexRgb(opts.color || CP.text).join(" ")} rg ${(M + 8 + lw).toFixed(2)} ${(y - size - i * (size + 2)).toFixed(2)} Td (${escStr(ln)}) Tj ET`);
    });
    y -= lines.length * (size + 2) + 3;
  };

  // ---- Личность ----
  section("Личность", CP.cyan);
  kv("Стиль:", c.style || "—");
  kv("Наличные:", `${c.cash} эдди`, { color: CP.yellow });
  if (c.note) {
    ensure(20);
    const nl = wrapText(c.note, R, 8.5, CW - 16);
    y -= 2;
    nl.forEach((ln) => {
      ops.push(`BT /F1 8.5 Tf ${hexRgb(CP.muted).join(" ")} rg ${M + 8} ${(y - 8.5).toFixed(2)} Td (${escStr(ln)}) Tj ET`);
      y -= 10.5;
    });
  }

  // ---- Характеристики: панель 2×N + чипы производных ----
  section("Характеристики", CP.yellow);
  const order = c.statsOrder || Object.keys(c.stats);
  const colW = (CW - 16) / 2;
  const cellH = 30;
  const half = Math.ceil(order.length / 2);
  const panelH = half * cellH + 8;
  ensure(panelH + 8);
  drawPanel(ops, M, y, CW, panelH, CP.panel, CP.line);
  order.forEach((k, idx) => {
    const col = idx < half ? 0 : 1;
    const rowI = idx < half ? idx : idx - half;
    const cx = M + 8 + col * colW;
    const cy = y - 4 - rowI * cellH;
    ops.push(`BT /F2 13 Tf ${hexRgb(CP.red).join(" ")} rg ${cx.toFixed(2)} ${(cy - 12).toFixed(2)} Td (${escStr(k)}) Tj ET`);
    ops.push(`BT /F1 7.5 Tf ${hexRgb(CP.muted).join(" ")} rg ${(cx + measure(k, B, 13) + 4).toFixed(2)} ${(cy - 12).toFixed(2)} Td (${escStr(statRu(k))}) Tj ET`);
    const vs = String(c.stats[k]);
    ops.push(`BT /F2 15 Tf ${hexRgb(CP.text).join(" ")} rg ${(cx + colW - 26 - measure(vs, B, 15)).toFixed(2)} ${(cy - 13).toFixed(2)} Td (${escStr(vs)}) Tj ET`);
    if (rowI < half - 1) ops.push(`0.165 0.165 0.228 RG 0.6 w ${cx.toFixed(2)} ${(cy - cellH + 6).toFixed(2)} m ${(cx + colW - 8).toFixed(2)} ${(cy - cellH + 6).toFixed(2)} l S`);
  });
  y -= panelH + 10;

  // Чипы производных (HP / тяжело ранен / смерть / HUM / MOVE)
  const chips = [
    [`HP ${c.hp}/${c.hp}`, CP.red],
    [`тяжело ранен ${Math.ceil(c.hp / 2)}`, CP.yellow],
    [`смерть ${c.stats.BODY}`, CP.red],
    [`HUM ${c.hum}`, CP.cyan],
    [`MOVE ${c.stats.MOVE}`, CP.cyan]
  ];
  {
    const chipLines = [[]];
    let lineW = 0;
    for (const item of chips) {
      const cw = measure(item[0], B, 8.5) + 12 + 5;
      if (lineW + cw > CW && chipLines[chipLines.length - 1].length) { chipLines.push([]); lineW = 0; }
      chipLines[chipLines.length - 1].push(item);
      lineW += cw;
    }
    for (const ln of chipLines) {
      ensure(20);
      let cxp = M + 4;
      for (const [label, col] of ln) {
        const cw = measure(label, B, 8.5) + 12;
        drawChip(ops, cxp + cw / 2, y - 8, label, B, col, CP.panel2);
        cxp += cw + 5;
      }
      y -= 20;
    }
    y -= 6;
  }

  // ---- Навыки: группировка + строки «уровень | навык [хар] + хар = сумма» ----
  section("Навыки", CP.cyan);
  const byGroup = {};
  const sorted = c.skills.map((s, i) => ({ s, i })).sort((a, b) => b.s.level - a.s.level || a.i - b.i);
  for (const { s } of sorted) {
    const g = dict.SKILL_BY_NAME?.[s.name]?.group || "Прочие";
    (byGroup[g] ||= []).push(s);
  }
  for (const [g, list] of Object.entries(byGroup)) {
    ensure(20);
    ops.push(`BT /F2 8.5 Tf ${hexRgb(CP.yellow).join(" ")} rg ${M + 6} ${(y - 9).toFixed(2)} Td (${escStr((GROUP_RU[g] || g).toUpperCase() + ` — ${list.length}`)}) Tj ET`);
    y -= 14;
    for (const s of list) {
      const st = skillStat(s.name);
      const sv = typeof c.stats[st] === "number" ? c.stats[st] : 0;
      const sum = String(sv + s.level);
      const lv = String(s.level);
      ensure(17);
      // правый блок: cyan level | muted "+sv =" | yellow/white sum
      const sumW = measure(sum, B, 9), addW = measure(`+ ${sv} = `, R, 8), lvW = measure(lv, B, 9);
      const rx = W - M - 6;
      ops.push(`BT /F2 9 Tf ${hexRgb(sv + s.level >= 10 ? CP.yellow : CP.text).join(" ")} rg ${(rx - sumW).toFixed(2)} ${(y - 9).toFixed(2)} Td (${escStr(sum)}) Tj ET`);
      ops.push(`BT /F1 8 Tf ${hexRgb(CP.muted).join(" ")} rg ${(rx - sumW - addW - 3).toFixed(2)} ${(y - 8.5).toFixed(2)} Td (${escStr(`+ ${sv} = `)}) Tj ET`);
      ops.push(`BT /F2 9 Tf ${hexRgb(CP.cyan).join(" ")} rg ${(rx - sumW - addW - lvW - 16).toFixed(2)} ${(y - 9).toFixed(2)} Td (${escStr(lv)}) Tj ET`);
      // название навыка (с truncation по ширине)
      const nameW = rx - sumW - addW - lvW - 30 - (M + 6);
      let nm = skillRu(s.name);
      if (measure(nm, R, 9) > nameW) {
        while (nm.length > 2 && measure(nm + "…", R, 9) > nameW) nm = nm.slice(0, -1);
        nm += "…";
      }
      ops.push(`BT /F1 9 Tf ${hexRgb(CP.text).join(" ")} rg ${M + 6} ${(y - 9).toFixed(2)} Td (${escStr(nm)}) Tj ET`);
      const stTag = `[${st}]`;
      ops.push(`BT /F1 7.5 Tf ${hexRgb(CP.muted).join(" ")} rg ${(M + 6 + measure(nm, R, 9) + 4).toFixed(2)} ${(y - 8.5).toFixed(2)} Td (${escStr(stTag)}) Tj ET`);
      y -= 15;
    }
    y -= 4;
  }

  // ---- Жизненный путь ----
  if (c.lifepath?.length) {
    section("Жизненный путь", CP.yellow);
    for (const lp of c.lifepath) kv(lp.label + ":", lp.value || "—");
  }

  // ---- Снаряжение ----
  if (c.gear?.length) {
    section("Снаряжение", CP.red);
    for (const g of c.gear) {
      const lines = wrapText(g, R, 9, CW - 30);
      lines.forEach((ln, i) => {
        ensure(13);
        if (i === 0) ops.push(`BT /F1 9 Tf ${hexRgb(CP.cyan).join(" ")} rg ${M + 6} ${(y - 9).toFixed(2)} Td (\u2022) Tj ET`);
        ops.push(`BT /F1 9 Tf ${hexRgb(CP.text).join(" ")} rg ${M + 18} ${(y - 9).toFixed(2)} Td (${escStr(ln)}) Tj ET`);
        y -= 12;
      });
      y -= 2;
    }
  }

  pagesOps.push(ops);
  const total = pagesOps.length;

  // нижние колонтитулы (номер страницы — как на телефоне удобно листать)
  pagesOps.forEach((po, i) => {
    po.push(`0.165 0.165 0.228 RG 1 w ${M} 30 m ${W - M} 30 l S`);
    po.push(`BT /F1 7.5 Tf ${hexRgb(CP.muted).join(" ")} rg ${M} 18 Td (${escStr(`Cyberpunk RED · ${c.name} · стр. ${i + 1} из ${total}`)}) Tj ET`);
  });

  // ---- Сборка PDF ----
  const doc = new PdfDoc();
  const catalogId = doc.add(null); doc.catalogId = catalogId;
  const pagesId = doc.add(null);
  const infoId = doc.add(`<< /Title (${escStr(`Cyberpunk RED — ${c.name} «${c.nick}»`)}) /Producer (cyberpunk-red-character-generator) /CreationDate (D:${datePdf()}) >>`);
  doc.infoId = infoId;

  const fontObj = (name, ttf) => {
    const fileId = doc.add(`<< /Length ${ttf.bytes.length} /Length1 ${ttf.bytes.length} >>`, ttf.bytes);
    const tuId = doc.add(`<< /Length ${(() => { const s = toUnicodeCMap(ttf.F); return encLen(s); })() } >>`, toUnicodeCMap(ttf.F));
    const wArr = [];
    for (let gid = 0; gid < ttf.F.ng; gid++) wArr.push(ttf.F.adv[String(gid)] ?? 0);
    return doc.add(`<< /Type /Font /Subtype /Type42 /BaseFont /${name} /FirstChar 0 /LastChar ${wArr.length - 1} /Widths [${wArr.join(" ")}] /FontDescriptor << /Type /FontDescriptor /FontName /${name} /Flags 32 /FontBBox [-100 -236 1606 1901] /ItalicAngle 0 /Ascent 928 /Descent -236 /CapHeight 729 /StemV 90 /FontFile2 ${fileId} 0 R >> /ToUnicode ${tuId} 0 R >>`);
  };
  const f1Id = fontObj("DejaVuSans", R);
  const f2Id = fontObj("DejaVuSans-Bold", B);

  const pageIds = [];
  pagesOps.forEach((po) => {
    const content = po.join("\n");
    const cid = doc.add(`<< /Length ${encLen(content)} >>`, content);
    const pid = doc.add(`<< /Type /Page /Parent ${pagesId} 0 R /MediaBox [0 0 ${W} ${H}] /Resources << /Font << /F1 ${f1Id} 0 R /F2 ${f2Id} 0 R >> >> /Contents ${cid} 0 R >>`);
    pageIds.push(pid);
  });

  doc.set(catalogId, `<< /Type /Catalog /Pages ${pagesId} 0 R /ViewerPreferences << /FitWindow true >> /Lang (ru) >>`);
  doc.set(pagesId, `<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(" ")}] /Count ${pageIds.length} >>`);

  return doc.assemble();
}

function datePdf() {
  const d = new Date(), p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}`;
}

const _enc = new TextEncoder();
function encLen(s) { return _enc.encode(s).length; }

// ToUnicode CMap — чтобы поиск/копирование текста из PDF давало юникод
function toUnicodeCMap(F) {
  let s = `/CIDInit /ProcSet findresource begin\n12 dict begin\nbegincmap\n/CMapName /Adobe-Identity-UCS def\n/CMapType 2 def\n1 begincodespacerange\n<0000> <FFFF>\nendcodespacerange\n`;
  const pairs = Object.entries(F.cp).map(([cp, gid]) => `<${Number(gid).toString(16).padStart(4, "0")}> <${Number(cp).toString(16).toUpperCase().padStart(4, "0")}>`);
  for (let i = 0; i < pairs.length; i += 100) {
    s += `${Math.min(100, pairs.length - i)} beginbfchar\n${pairs.slice(i, i + 100).join("\n")}\nendbfchar\n`;
  }
  s += `endcmap\nCMapName currentdict /CMap defineresource pop\nend\nend`;
  return s;
}

// ---------- Скачивание файла ----------

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.rel = "noopener";
  document.body.appendChild(a);

  let ok = false;
  try {
    a.click();
    ok = true;
  } catch (err) {
    console.warn("download click failed:", err);
  }
  // Фallback 1: IE / старый Edge — msSaveOrOpenBlob
  if (!ok && typeof window.navigator?.msSaveOrOpenBlob === "function") {
    try { window.navigator.msSaveOrOpenBlob(blob, filename); ok = true; } catch (e2) { void e2; }
  }
  // Фallback 2: data-URL + target=_blank (совместимо даже с очень старыми браузерами)
  if (!ok) {
    try {
      const reader = new FileReader();
      reader.onload = () => {
        a.href = String(reader.result);
        a.target = "_blank";
        a.click();
      };
      reader.readAsDataURL(blob);
    } catch (e3) {
      window.open(url, "_blank"); // крайний случай — открыть Blob в новой вкладке
    }
  }

  a.remove();
  // отзываем URL позже, чтобы успеть старым браузерам начать загрузку
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

/* ------------------------------------------------------------
   [5] ПРИЛОЖЕНИЕ — js/app.js (генерация, отрисовка, UI)
   ------------------------------------------------------------ */
// ============================================================
// Cyberpunk RED — генератор персонажей (лист + 3 способа создания)
// Данные: Data/Cyberpunk Red Core Rulebook v1.25.pdf
//   Способ №1 «Уличная крыса» (Streetrats)      — стр. 73–77
//   Способ №2 «Эджраннер» (Edgerunners)         — стр. 77
//   Способ №3 «Полный пакет» (Complete Packages)— стр. 78
// Роли, таблицы шаблонов характеристик и списки навыков: src/roles/*.js
// Справочник навыков (названия и связка «навык → характеристика»): data/skills.js
// ============================================================


const ROLES = Object.values(ROLE_DATA);

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
      layoutSkillGroups(true); // высота карточки изменилась — перелистываем колонки
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
