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


export const WEAPONS = {
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
