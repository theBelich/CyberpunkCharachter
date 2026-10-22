// 4) БАКАЛЕЯ (Food & Drink) — Core Rulebook, стр. 331–332, 338–339, 351, 376

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


export const GROCERY = {
  id: "grocery",
  ru: "Бакалея",
  en: "Food & Grocery",
  icon: "🍜",
  src: "Core Rulebook, стр. 331–332 (Vendits / Bodegas), 338–339 (Night Market · Food and Drugs), 351 (Master Gear List), 376 (Services)",
  hint: "Всё днём напролёт: вендиты (стр. 331) и круглосуточные бадеги (стр. 332). Цены — по книжным таблицам.",
  groups: [
    {
      title: "Из вендита / бадеги (упакованное)",
      items: [
        { name: "Ramen Noodles", ru: "Лапша рамен (вендит)", cost: 10, tier: "Cheap", page: "331",
          note: "Типичная еда из вендита (строка «1d10 Food», цена 10–100eb)." },
        { name: "Pizza", ru: "Пицца (вендит)", cost: 20, tier: "Everyday", page: "331",
          note: "Горячая пицца из автомата — одна из самых частых позиций вендита." },
        { name: "Hamburgers", ru: "Гамбургер (вендит)", cost: 20, tier: "Everyday", page: "331",
          note: "Синтетическая котлета в булке; в бадеге бывает «как настоящее мясо»." },
        { name: "Smash (can)", ru: "Smash в банке", cost: 10, tier: "Cheap", page: "331",
          note: "Жёлтая шипучая пена в жестяной банке — продаётся везде (см. также «Расходники»)." },
        { name: "Sushi", ru: "Суши (вендит)", cost: 50, tier: "Costly", page: "331",
          note: "Вакуумная упаковка риса и рыбы; свежая порция дороже." },
        { name: "Hot Meat", ru: "«Горячее мясо» (вендит)", cost: 50, tier: "Costly", page: "331",
          note: "Разогретая мясная порция неизвестного происхождения — уличный деликатес." },
        { name: "1 kg Bag of Kibble", ru: "Киббл, пакет 1 кг", cost: 10, tier: "Cheap", page: "331",
          note: "Пакет сухих вафель/гранул на одну порцию; отличается от собачьего корма только вкусом «чизбургер»." },
        { name: "Canned Coffee", ru: "Кофе в банке", cost: 10, tier: "Cheap", page: "331",
          note: "Банка холодного кофе с кофеиновой дозой." },
        { name: "Canned Juice", ru: "Сок в банке", cost: 10, tier: "Cheap", page: "331",
          note: "Фруктовый сок из концентрата." },
        { name: "Canned Soft Drink", ru: "Газировка в банке", cost: 10, tier: "Cheap", page: "331",
          note: "Сладкая газировка; в бадегах стоит у кассы отдельным рядком." },
        { name: "Canned Goods", ru: "Консервы (общий вид)", cost: 10, tier: "Cheap", page: "338",
          note: "Строка «Canned Goods» ночного рынка: любая консервированная еда." },
        { name: "Packaged Goods", ru: "Фасованные продукты", cost: 10, tier: "Cheap", page: "338",
          note: "Упакованные снеки, крекеры, соевые чипсы." },
        { name: "Frozen Goods", ru: "Заморозка", cost: 10, tier: "Cheap", page: "338",
          note: "Пакеты замороженной еды — держатся только при наличии морозильника." },
        { name: "Bags of Grain", ru: "Мешок зерна", cost: 20, tier: "Everyday", page: "338",
          note: "Сырое зерно: база для похлёбки или перепродажи." },
        { name: "Kibble Pack", ru: "Kibble Pack (одна порция)", cost: 10, tier: "Cheap", page: "351",
          note: "Фольгированный пакет сухих cereal-вафель на один приём пищи; бренд только по номеру." },
        { name: "MRE", ru: "Армейский сухой паёк (MRE)", cost: 10, tier: "Cheap", page: "351",
          note: "Самонагревающийся мешок: добавить воду, щёлкнуть клапан — горячая еда через 2 минуты." },
        { name: "Food Stick", ru: "Пищевой брусок", cost: 10, tier: "Cheap", page: "351",
          note: "Зернистый сухой батончик одного из (мерзких) вкусов — один приём пищи." },
        { name: "Bag of Prepak", ru: "Пакет prepak-еды", cost: 20, tier: "Everyday", page: "339",
          note: "Прессованная готовая еда в упаковке — самый дешёвый способ не голодать." }
      ]
    },
    {
      title: "Свежее и живое (бадега / ночной рынок)",
      items: [
        { name: "Live Chicken", ru: "Живая курица", cost: 50, tier: "Costly", page: "339",
          note: "Птица на убой — редкая роскошь настоящего мяса." },
        { name: "Live Fish", ru: "Живая рыба", cost: 50, tier: "Costly", page: "339",
          note: "Продаётся в ведре с водой; дешевле размороженной, но требует готовки." },
        { name: "Live Pigs", ru: "Поросята", cost: 100, tier: "Premium", page: "339",
          note: "Живой поросёнок: мясо, но нужен уход и место." },
        { name: "Fresh Fruits", ru: "Свежие фрукты", cost: 50, tier: "Costly", page: "339",
          note: "Настоящие фрукты — признак достатка." },
        { name: "Fresh Vegetables", ru: "Свежие овощи", cost: 50, tier: "Costly", page: "339",
          note: "Овощи с гидрофермы или каравана поставщиков." },
        { name: "Root Vegetables", ru: "Корнеплоды", cost: 20, tier: "Everyday", page: "339",
          note: "Картофель, репа, свёкла — самая доступная настоящая еда." },
        { name: "Exotic Fruits", ru: "Экзотические фрукты", cost: 100, tier: "Premium", page: "339",
          note: "Манго, питахайя и прочие чудеса оранжерей." },
        { name: "Exotic Vegetables", ru: "Экзотические овощи", cost: 100, tier: "Premium", page: "339",
          note: "Редкие сорта овощей для гурманов и корпоративных столовых." },
        { name: "Soy Milk", ru: "Соевое молоко", cost: 10, tier: "Cheap", page: "332",
          note: "Картон соевого молока — классика бадеги («отправьте игроков за соевым молоком»)." }
      ]
    },
    {
      title: "Напитки и заведения (стр. 339, 376)",
      items: [
        { name: "Poor Quality Alcohol", ru: "Пьянь низшего сорта", cost: 10, tier: "Cheap", page: "339",
          note: "Самогон «на троих» из подсобки бадеги; ДV на стойкость пригодится." },
        { name: "Alcohol", ru: "Алкоголь (обычный)", cost: 20, tier: "Everyday", page: "339",
          note: "Бутылка крепкого из обычного отдела." },
        { name: "Excellent Quality Alcohol", ru: "Хорошой выдержки алкоголь", cost: 100, tier: "Premium", page: "339",
          note: "Настоящий алкоголь — подарок, который не стыдно принести в гости." },
        { name: "Drink, Dive Bar", ru: "Бокал в грязном баре", cost: 10, tier: "Cheap", page: "376",
          note: "Услуга заведения: кружка разбавленного пива." },
        { name: "Drink, Good Bar", ru: "Бокал в хорошем баре", cost: 10, tier: "Cheap", page: "376",
          note: "Приличная выпивка в приличном месте." },
        { name: "Drink, Excellent Bar", ru: "Бокал в отличном баре", cost: 20, tier: "Everyday", page: "376",
          note: "Коктейль с настоящим спиртом и льдом." },
        { name: "Drink, Executive Bar", ru: "Бокал в корпоративном баре", cost: 50, tier: "Costly", page: "376",
          note: "Бар с охраной, дресс-кодом и ценами для менеджеров." },
        { name: "Restaurant Meal, Fast Food", ru: "Еда в фастфуде", cost: 10, tier: "Cheap", page: "376",
          note: "Быстрый перекус у прилавка." },
        { name: "Restaurant Meal, Good", ru: "Обед в хорошем ресторане", cost: 20, tier: "Everyday", page: "376",
          note: "Садитесь и ешьте — входит в образ жизни Generic Prepak." },
        { name: "Restaurant Meal, Excellent", ru: "Ужин в отличном ресторане", cost: 50, tier: "Costly", page: "376",
          note: "Полноценный ужин с обслуживанием." },
        { name: "Restaurant Meal, World Class", ru: "Ресторан мирового класса", cost: 500, tier: "Expensive", page: "376",
          note: "Столик в лучшем зале Найт-Сити — часть образа жизни Fresh Food." },
        { name: "Taxi", ru: "Такси", cost: 20, tier: "Everyday", page: "376",
          note: "Поездка по городу; водилы торгуются и берут за риск." }
      ]
    }
  ]
};
