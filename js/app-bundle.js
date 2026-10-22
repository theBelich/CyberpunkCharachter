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

/* ------------------------------------------------------------
   [3] ЭКСПОРТ/ИМПОРТ — js/exporters.js (.xlsx / .pdf / .json)
   ------------------------------------------------------------ */
// ============================================================
// ЭКСПОРТ ЛИСТА ПЕРСОНАЖА — .xlsx / .pdf / .json
// Всё работает на стороне клиента, без сервера и без внешних
// библиотек (файлы формируются «вручную» по спецификациям):
//   .json — сериализация персонажа + schemaVersion (как Data/ExportExample.json)
//   .xlsx — OOXML-архив: ZIP stored (без сжатия) + CRC-32
//   .pdf  — PDF 1.4: заголовок, страницы, каталог, оглавление (xref), trailer
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
// Формируется простой PDF 1.4: текст пишется встроенным шрифтом
// Helvetica-Bold (WinAnsi) — латиница (роль, аббревиатуры характеристик,
// названия навыков) отображается во всех viewers. Кириллица при печати
// заменяется на латинскую транслитерацию, чтобы файл оставался валидным
// без встраивания внешних шрифтов. Для кириллического оформления
// используйте кнопку «Печать» (Ctrl+P → «Сохранить как PDF»).

// Транслитерация кириллицы в латиницу — чтобы PDF-файл (встроенные
// шрифты Type1 без юникода) оставался читаемым во всех viewers.
const TRANSLIT = {
  а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e", ж: "zh", з: "z", и: "i", й: "y",
  к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r", с: "s", т: "t", у: "u", ф: "f",
  х: "kh", ц: "ts", ч: "ch", ш: "sh", щ: "sch", ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya",
  "«": '"', "»": '"', "—": "-", "–": "-", "·": "*", "…": "...", "№": "No"
};

function toLatin(s) {
  return String(s ?? "").split("").map((ch) => {
    if (/[\x20-\x7E]/.test(ch)) return ch;
    const low = ch.toLowerCase();
    const t = TRANSLIT[low];
    if (t === undefined) return "?";
    return ch === low ? t : t.split("").map((x) => x.toUpperCase()).join("");
  }).join("").replace(/\?+/g, " ").replace(/\s+/g, " ").trim();
}

function sanitizeLatin(s) {
  return toLatin(s);
}

function pdfText(s) {
  return String(s).replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function exportPDF(c, dict) {
  const W = 595, H = 842; // A4 in points
  const pages = [];      // каждая страница — массив строк content-операторов
  let ops = [], y = H - 60;

  const newPageIfNeeded = (need = 20) => {
    if (y - need < 50) { pages.push(ops.join("\n")); ops = []; y = H - 60; }
  };
  const text = (str, x, size, colorOp, bold) => {
    ops.push(`BT /F${bold ? "2" : "1"} ${size} Tf ${colorOp} ${x} ${y.toFixed(1)} Td (${pdfText(str)}) Tj ET`);
  };
  const line = () => { ops.push(`0.85 w 0.8 G 50 ${(y + 4).toFixed(1)} m ${W - 50} ${(y + 4).toFixed(1)} l S`); };
  const heading = (str) => { newPageIfNeeded(40); y -= 16; text(sanitizeLatin(str), 50, 13, "0 0 0 rg", true); line(); y -= 14; };
  const row = (str, indent = 60, size = 10) => { newPageIfNeeded(14); text(sanitizeLatin(str), indent, size, "0.15 0.15 0.15 rg"); y -= 14; };

  // Заголовок
  text("CYBERPUNK RED - CHARACTER SHEET", 50, 18, "0.8 0 0.15 rg", true); y -= 24;
  heading("Identity");
  row(`Name: ${c.name}    Nick: ${c.nick}    Age: ${c.age}`);
  row(`Role: ${c.role} (${toLatin(dict.ROLE_RU[c.role] || c.role)})    Method: #${c.method}    Style: ${toLatin(c.style)}`);
  row(`Cash: ${c.cash} eddies`);

  heading("Stats");
  const st = c.statsOrder.map((k) => `${k}:${c.stats[k]}`).join("   ");
  row(st, 60, 11);
  heading("Derived");
  row(`HP: ${c.hp}/${c.hp}    Heavy injury: ${Math.ceil(c.hp / 2)}    Death save: ${c.stats.BODY}    Humanity: ${c.hum}    Move: ${c.stats.MOVE}`);

  heading("Skills (level | level+stat)");
  const rows = c.skills.map((s, i) => ({ s, i })).sort((a, b) => b.s.level - a.s.level || a.i - b.i);
  for (const { s } of rows) {
    const statK = dict.SKILL_BY_NAME[s.name]?.stat || "";
    const sv = typeof c.stats[statK] === "number" ? c.stats[statK] : 0;
    row(`${s.name} [${statK}]  lvl ${s.level}  sum ${sv + s.level}`);
  }

  heading("Life Path");
  for (const lp of c.lifepath) row(`${sanitizeLatin(lp.label)}: ${sanitizeLatin(lp.value)}`.replace(/^(.*:)\s*\?+/, "$1 see sheet"));

  heading("Gear");
  for (const g of c.gear) row(sanitizeLatin(g));

  pages.push(ops.join("\n"));

  // Сборка PDF-объектов
  const objs = []; // 1..N
  const push = (s) => { objs.push(s); return objs.length; };
  const catalogId = push(null);
  const pagesId = push(null);
  const font1Id = push(`<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>`);
  const font2Id = push(`<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>`);
  const pageIds = [], contentIds = [];
  for (let i = 0; i < pages.length; i++) {
    const stream = pages[i];
    pageIds.push(push(null));
    contentIds.push(push(`<< /Length ${new TextEncoder().encode(stream).length} >>\nstream\n${stream}\nendstream`));
  }
  objs[catalogId - 1] = `<< /Type /Catalog /Pages ${pagesId} 0 R >>`;
  objs[pagesId - 1] = `<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(" ")}] /Count ${pageIds.length} >>`;
  pageIds.forEach((id, i) => {
    objs[id - 1] = `<< /Type /Page /Parent ${pagesId} 0 R /MediaBox [0 0 ${W} ${H}] /Resources << /Font << /F1 ${font1Id} 0 R /F2 ${font2Id} 0 R >> >> /Contents ${contentIds[i]} 0 R >>`;
  });

  const enc = new TextEncoder();
  let pdf = "%PDF-1.4\n%\xe2\xe3\xcf\xd3\n";
  const offsets = [];
  objs.forEach((body, i) => {
    offsets.push(enc.encode(pdf).length);
    pdf += `${i + 1} 0 obj\n${body}\nendobj\n`;
  });
  const xrefPos = enc.encode(pdf).length;
  pdf += `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n`;
  for (const off of offsets) pdf += String(off).padStart(10, "0") + " 00000 n \n";
  pdf += `trailer\n<< /Size ${objs.length + 1} /Root ${catalogId} 0 R >>\nstartxref\n${xrefPos}\n%%EOF`;

  return new Blob([pdf], { type: "application/pdf" });
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
   [4] ПРИЛОЖЕНИЕ — js/app.js (генерация, отрисовка, UI)
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
    hp: calcHP(gen.stats.BODY, gen.stats.WILL),
    hum: gen.stats.EMP * 10,
    skills: buildFullSkillList(rollSkills(roleData)),
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

  renderSkillsTable(c);

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
      blob = exportPDF(current, { ROLE_RU, SKILL_BY_NAME });
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
    current.hp = calcHP(buyStats.BODY, buyStats.WILL);
    current.hum = buyStats.EMP * 10;
    current.note = `«Полный пакет»: очки распределены вручную (${total} очков)`;
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
}

// Если DOM уже готов — запускаем сразу; иначе ждём DOMContentLoaded
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
