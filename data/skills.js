// ============================================================
// СПРАВОЧНИК НАВЫКОВ — Cyberpunk RED
// Источник: Data/Cyberpunk Red Core Rulebook v1.25.pdf (стр. 86–93)
// Здесь перечислены ВСЕ навыки, которые встречаются в ролях (src/roles/*.js):
//   name  — англоязычное имя навыка (как в файлах ролей)
//   ru    — русское название для отображения на листе
//   stat  — характеристика, используемая при проверке этого навыка
// Список навыков конкретного персонажа формируется из выбранной роли
// (файлы src/roles/*.js), а названия и связки «навык → характеристика» — отсюда.
// ============================================================

export const SKILLS = [
  // --- Базовые навыки (есть у всех ролей) ---
  { name: "Athletics",                  ru: "Атлетика",                       stat: "BODY" },
  { name: "Brawling",                   ru: "Рукопашный бой",                 stat: "COOL" },
  { name: "Concentration",              ru: "Концентрация",                   stat: "INT"  },
  { name: "Conversation",               ru: "Обходительность",                stat: "EMP"  },
  { name: "Education",                  ru: "Образование",                    stat: "INT"  },
  { name: "Evasion",                    ru: "Изворотливость",                 stat: "DEX"  },
  { name: "First Aid",                  ru: "Первая помощь",                  stat: "INT"  },
  { name: "Human Perception",           ru: "Чутьё на людей",                 stat: "EMP"  },
  { name: "Language (Streetslang)",     ru: "Язык (уличный жаргон)",          stat: "INT"  },
  { name: "Local Expert (Your Home)",   ru: "Знаток местности (дом)",         stat: "INT"  },
  { name: "Perception",                 ru: "Внимательность",                 stat: "INT"  },
  { name: "Persuasion",                 ru: "Убедительность",                 stat: "EMP"  },
  { name: "Stealth",                    ru: "Скрытность",                     stat: "DEX"  },

  // --- Боевые / военные ---
  { name: "Autofire",                   ru: "Автогон",                        stat: "REF"  },
  { name: "Autofire (x2)",              ru: "Автогон (x2)",                   stat: "REF"  },
  { name: "Handgun",                    ru: "Пистолеты",                      stat: "REF"  },
  { name: "Interrogation",              ru: "Допрос",                         stat: "INT"  },
  { name: "Melee Weapon",               ru: "Холодное оружие",                stat: "REF"  },
  { name: "Resist Torture/Drugs",       ru: "Стойкость (пытки/наркотики)",    stat: "WILL" },
  { name: "Shoulder Arms",              ru: "Длинноствольное оружие",         stat: "REF"  },
  { name: "Tactics",                    ru: "Тактика",                        stat: "INT"  },

  // --- Технические ---
  { name: "Basic Tech",                 ru: "Базовые технологии",             stat: "TECH" },
  { name: "Conceal/Reveal Object",      ru: "Спрятать / найти предмет",       stat: "INT"  },
  { name: "Cryptography",               ru: "Криптография",                   stat: "INT"  },
  { name: "Cybertech",                  ru: "Кибертехника",                   stat: "TECH" },
  { name: "Electronics/Security Tech (x2)", ru: "Электроника / охранная техника (x2)", stat: "TECH" },
  { name: "Land Vehicle Tech",          ru: "Техника наземного транспорта",   stat: "TECH" },
  { name: "Library Search",             ru: "Поиск в библиотеке / сети",      stat: "INT"  },
  { name: "Science (choose 1)",         ru: "Наука (выберите 1)",             stat: "INT"  },
  { name: "Weaponstech",                ru: "Оружейное дело",                 stat: "TECH" },

  // --- Уличные / социальные ---
  { name: "Animal Handling",            ru: "Обращение с животными",          stat: "EMP"  },
  { name: "Drive Land Vehicle",         ru: "Вождение (наземный транспорт)",  stat: "REF"  },
  { name: "Tracking",                   ru: "Слежение",                       stat: "INT"  },
  { name: "Trading",                    ru: "Торговля",                       stat: "INT"  },
  { name: "Wilderness Survival",        ru: "Выживание в дикой природе",      stat: "INT"  },
  { name: "Streetwise",                 ru: "Уличное чутьё",                  stat: "INT"  },
  { name: "Bribery",                    ru: "Подкуп",                         stat: "COOL" },
  { name: "Forgery",                    ru: "Подделка документов",            stat: "TECH" },
  { name: "Pick Lock",                  ru: "Вскрытие замков",                stat: "TECH" },

  // --- Медицинские / научные ---
  { name: "Deduction",                  ru: "Дедукция",                       stat: "INT"  },
  { name: "Paramedic",                  ru: "Скорая помощь",                  stat: "TECH" },

  // --- Корпоративные / медийные ---
  { name: "Accounting",                 ru: "Бухгалтерия",                    stat: "INT"  },
  { name: "Bureaucracy",                ru: "Бюрократия",                     stat: "INT"  },
  { name: "Business",                   ru: "Бизнес",                         stat: "INT"  },
  { name: "Lip Reading",                ru: "Чтение по губам",                stat: "INT"  },
  { name: "Photography/Film",           ru: "Фото / видео",                   stat: "TECH" },

  // --- Творческие / имиджевые ---
  { name: "Composition",                ru: "Композиция",                     stat: "INT"  },
  { name: "Personal Grooming",          ru: "Уход за собой",                  stat: "TECH" },
  { name: "Play Instrument (choose 1)", ru: "Игра на инструменте (выберите 1)", stat: "DEX" },
  { name: "Wardrobe & Style",           ru: "Гардероб и стиль",               stat: "TECH" },

  // --- Полицейские ---
  { name: "Criminology",                ru: "Криминалистика",                 stat: "INT"  }
];

// Быстрый доступ: имя навыка → запись справочника
export const SKILL_BY_NAME = Object.fromEntries(SKILLS.map((s) => [s.name, s]));
