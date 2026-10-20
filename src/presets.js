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
    role: 'solo', archetype: 'gunfighter', background: 'choomb',
    attrs: { ref: 6, d4: 5, cs: 4, cn: 4, co: 4, em: 4, ia: 4, re: 4, tech: 4, lu: 2 },
    skills: { handguns: 4, rifles: 2, athletics: 3, awareness: 2, sneaking: 4, streetwise: 4, crim: 2, intimidate: 2 },
    typePoints: { combat: 4, move: 2, att: 2, inf: 2, tech: 1 },
    lifepath: false,
    gear: ['Пистолет «Буль-дог» (28 патронов)', 'Кухонный нож', 'Коммьютер (б/у)', 'Куртка с капюшоном', 'Рюкзак'],
    credits: 350,
    extras: ['Ночевать в Найт-Сити умеете: первый бросок Знания улиц за сессию — без проверки'] },
  {
    key: 'edge', name: 'Эджраннер', icon: '⚡', tagline: 'Уличный раннер на готовом',
    desc: 'Готовый нетраннер с имплантами и надёжной командой: Нетраннер/Гений с кибердекой, интерфейсом и напарником-соло.',
    role: 'netrunner', archetype: 'brainiac', background: 'choomb',
    attrs: { ia: 6, ref: 5, cs: 4, cn: 4, co: 4, d4: 4, em: 4, re: 4, tech: 4, lu: 2 },
    skills: { programming: 4, electronics: 4, awareness: 3, comcyber: 3, cybercraft: 2, basictech: 2, streetwise: 3, connection: 2, crim: 2 },
    typePoints: { combat: 3, stl: 2, move: 2, att: 3, inf: 2, tech: 9 },
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
