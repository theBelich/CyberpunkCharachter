// ============================================================
// РОЛЬ: Medtech (Медтех) — Cyberpunk RED
// Источник: Data/Cyberpunk Red Core Rulebook v1.25.pdf, стр. 74–77 (таблицы характеристик)
// ============================================================

export const medtech = {
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
};
