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

export const SKILLS = [
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
export const SKILL_BY_NAME = Object.fromEntries(SKILLS.map((s) => [s.name, s]));

// Группировка по категориям (для отображения полного списка навыков)
export const SKILL_GROUPS = SKILLS.reduce((acc, s) => {
  (acc[s.group] ||= []).push(s);
  return acc;
}, {});
