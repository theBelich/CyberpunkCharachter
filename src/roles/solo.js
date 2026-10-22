// ============================================================
// РОЛЬ: Solo (Соло) — Cyberpunk RED
// Источник: Data/Cyberpunk Red Core Rulebook v1.25.pdf, стр. 74–77 (таблицы характеристик)
// ============================================================

export const solo = {
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
};
