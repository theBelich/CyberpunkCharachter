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


export const CLOTHING = {
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
