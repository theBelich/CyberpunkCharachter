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


export const CYBERWARE = {
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
