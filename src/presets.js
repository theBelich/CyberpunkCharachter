/* ============================================================
   ГОТОВЫЕ ВАРИАНТЫ СОЗДАНИЯ ПЕРСОНАЖА
   Модуль данных Cyberpunk RED (часть таблиц книги игрока).
   ============================================================ */

/* Общий объект CPR: в браузере он уже создан js/data.js (global);
   в Node — регистрируется там же через globalThis. */
/* Общий объект CPR: в браузере это глобальная переменная, созданная одним
   из модулей src/*.js; в vm-тестах — общая лексическая область скриптов. */
if (typeof CPR === 'undefined') var CPR = (globalThis.CPR = globalThis.CPR || {});

/* ============================================================
   ГОТОВЫЕ ПАКЕТЫ СОЗДАНИЯ ПЕРСОНАЖА (3 варианта)
   1. Уличная крыса — простой старт: чумба-соло из трущоб, минимальный набор
   2. Эджраннер     — нетраннер-раннер: Нетраннер/Гений + кибердека и импланты
   3. Полный пакет  — максимальный стартовый комплект по всем таблицам книги
   ============================================================ */
CPR.PRESETS = [
  {
    key: 'rat', name: 'Уличная крыса', icon: '🐀', tagline: 'Простой старт с улицы',
    desc: 'Быстрый лист «с нуля»: Чумба из трущоб, базовые атрибуты, минимум снаряжения. Как советует книга игрока для новичков.',
    role: 'solo', archetype: 'hitman', background: 'choomb',
    attrs: { ref: 7, d4: 7, cs: 6, cn: 6, co: 6, em: 6, ia: 6, re: 7, tech: 5, lu: 6 },
    skills: { handguns: 4, melee: 4, rifles: 4, sneaking: 4, awareness: 2, athletics: 2, streetwise: 4, crim: 2, intimidate: 2 },
    typePoints: { combat: 8, stl: 2, move: 4, att: 4, inf: 2, tech: 4 },
    lifepath: false,
    gear: ['Пистолет «Буль-дог» (28 патронов)', 'Кухонный нож', 'Коммьютер (б/у)', 'Куртка с капюшоном', 'Рюкзак'],
    credits: 350,
    extras: ['Ночевать в Найт-Сити умеете: первый бросок Знания улиц за сессию — без проверки'] },
  {
    key: 'edge', name: 'Эджраннер', icon: '⚡', tagline: 'Уличный раннер на готовом',
    desc: 'Готовый нетраннер с имплантами и надёжной командой: Нетраннер/Фриланс-раннер с кибердекой, интерфейсом и напарником-соло.',
    role: 'netrunner', archetype: 'freelancerunner', background: 'choomb',
    attrs: { ia: 6, ref: 6, cs: 7, cn: 5, co: 6, d4: 7, em: 5, re: 6, tech: 7, lu: 7 },
    skills: { programming: 4, electronics: 4, awareness: 3, comcyber: 4, cybercraft: 2, basictech: 2, streetwise: 3, connection: 4, crim: 2 },
    typePoints: { combat: 4, stl: 2, move: 2, att: 4, inf: 2, tech: 14 },
    lifepath: true,
    gear: ['Кибердека Militech Tek-Deka MkIV', 'Интерфейс Neurosim (подключён к Сети)', 'Усилитель сигнала', 'Коммьютер', 'Лёгкая броня (SP 10)', 'Очки AR', 'Медибринги ×3'],
    credits: 550,
    extras: ['+1 к макс. глубине Сети', 'Тау-атаки наносят +1 урона', 'Напарник-соло: один вызов на сессию'] },
  {
    key: 'full', name: 'Полный пакет', icon: '💼', tagline: 'Максимум по всем таблицам',
    desc: 'Персонаж по полной процедуре книги игрока: полный Жизненный путь на d6, все очки навыков, полное снаряжение роли и происхождения, эдди по таблице.',
    role: null, archetype: null, background: null,
    attrs: null, skills: {},
    typePoints: null,
    lifepath: true, fullLifePath: true,
    gear: null,
    credits: null,
    extras: null },
];

if (typeof module !== 'undefined') module.exports = CPR;
