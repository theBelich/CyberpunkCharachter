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


export const CONSUMABLES = {
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
