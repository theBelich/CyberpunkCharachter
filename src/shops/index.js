// ============================================================
// Индекс магазинов — Cyberpunk RED
// Данные взяты из таблиц PDF: Data/Cyberpunk Red Core Rulebook v1.25.pdf
//   «Night Market Appendix» (стр. 340–376) и «The New Street Economy».
// Каждый магазин описан в отдельном файле этой папки.
// ============================================================

import { CYBERWARE } from "./cyberware.js";
import { WEAPONS } from "./weapons.js";
import { CONSUMABLES } from "./consumables.js";
import { GROCERY } from "./grocery.js";
import { CLOTHING } from "./clothing.js";

export { CYBERWARE, WEAPONS, CONSUMABLES, GROCERY, CLOTHING };

// Порядок соответствует заказу: 1) cyberware, 2) оружие,
// 3) расходники, 4) бакалея, 5) одежда.
export const SHOPS = [CYBERWARE, WEAPONS, CONSUMABLES, GROCERY, CLOTHING];
