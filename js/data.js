/* ============================================================
   CYBERPUNK RED — игровые данные (по книге игрока, COREBOOK)
   Таблицы вынесены в модули папки src/:
     attributes · skills · roles · backgrounds · lifepath · gear
     derived · presets
   Этот файл собирает всё в единый объект CPR.
   Язык данных: русский (как в русской редакции книги игрока).
   ============================================================ */

/* Общий объект CPR. Таблицы вынесены в модули папки src/ — они пишут
   прямо в этот объект. В браузере src/*.js подключаются раньше этого файла
   (см. index.html) и создают CPR сами; здесь он только достраивается. */
/* Таблицы живут в src/*.js и пишут прямо в этот объект.
   В браузере они подключаются раньше (см. index.html), поэтому CPR уже
   существует; в Node (тесты) подгружаем их через require. */
var CPR = (typeof CPR !== 'undefined' && CPR) || (globalThis.CPR = globalThis.CPR || {});

if (typeof require !== 'undefined' && typeof module !== 'undefined') {
  globalThis.CPR = CPR;
  require('../src/attributes'); require('../src/skills'); require('../src/roles');
  require('../src/backgrounds'); require('../src/lifepath'); require('../src/gear');
  require('../src/derived'); require('../src/presets');
  CPR = globalThis.CPR;
}

/* доп. навык, встречающийся в описаниях архетипов */
CPR.SKILLS.push({ key: 'survival', name: 'Выживание', attr: 'ia', type: 'att' });
CPR.SKILLS.push({ key: 'melee',    name: 'Ближний бой', attr: 'ref', type: 'combat' });

/* убрать «заглушку» из Тинкера */
CPR.ROLES.forEach(r => { r.archetypes = r.archetypes.filter(a => !a.skip); });

if (typeof module !== 'undefined') module.exports = CPR;
