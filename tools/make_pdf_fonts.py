# ============================================================
# Подготовка шрифтов для PDF-экспорта (js/exporters.js).
#
# Что делает:
#   1) берёт DejaVu Sans / DejaVu Sans Bold (TrueType, свободная лицензия);
#   2) субсеттирует до нужного набора символов (кириллица + латиница
#      + « » — · № … и т.д.) — файл получается маленьким;
#   3) перегоняет в unitsPerEm = 1000 без хинтинга и вытаскивает:
#        - массивы точек контуров (абсолютные координаты fontTools),
#          смещённые на +1000 по y (TTF рисует «вверх ногами»
#          относительно системы координат PDF);
#        - advance'ы из hmtx;
#   4) пишет js/pdf-fonts.js — обычный ES-модуль с константой PDF_FONTS,
#      который экспортёр превращает в встроенный Type 42 шрифт на лету.
#
# Использование:  python3 tools/make_pdf_fonts.py
# После правки любого исходного модуля пересоберите бандл: node tools/bundle.mjs
# ============================================================
import os
import sys

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")

try:
    from fontTools.ttLib import TTFont
    from fontTools.subset import Subsetter, Options
except ImportError:
    sys.exit("Нужен пакет fonttools: pip install fonttools")

SRC_REG = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
SRC_BOLD = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"

# Набор символов, которые могут встретиться в листе персонажа.
CHARS = set(
    "\n"  # не рисуется, но пусть будет
    " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`"
    "abcdefghijklmnopqrstuvwxyz{|}~"
    "\u00a0\u00ab\u00bb\u00b7\u00d7\u00a9"
    "\u2013\u2014\u2018\u2019\u201c\u201d\u2026\u2116\u25cf\u25a0\u2022"
)
for o in range(0x410, 0x44F + 1):  # весь блок кириллицы (А-Я а-я ё включён ниже)
    CHARS.add(chr(o))
CHARS.add("\u0401")  # Ё


def build(path):
    f = TTFont(path)

    opt = Options()
    opt.drop_tables = ["DSIG", "FFTM", "GPOS", "GSUB", "GDEF", "kern",
                       "morx", "feat", "bsln", "hdmx", "LTSH", "VDMX",
                       "hntx", "vhea", "vmtx", "prep", "cvt ", "fpgm"]
    opt.hinting = False          # убираем инструкции — глифы пересобираются чище
    opt.recalc_bounds = True
    opt.notdef_outline = True
    sub = Subsetter(options=opt)
    sub.populate(unicodes=[ord(c) for c in CHARS])
    sub.subset(f)

    # масштабирование координат: unitsPerEm -> 1000 (масштаб метрик PDF)
    upm = f["head"].unitsPerEm
    sc = 1000.0 / upm

    glyf = f["glyf"]
    hmtx = f["hmtx"]
    cmap = f.getBestCmap()
    names = f.getGlyphOrder()

    codepoints = {}
    outlines = {}
    advances = {}
    bbox = [0, 0, 0, 0]  # xMin yMin xMax yMax в unitPerEm=1000, уже со сдвигом +1000

    def add_pt(x, y):
        bbox[0] = min(bbox[0], x)
        bbox[1] = min(bbox[1], y)
        bbox[2] = max(bbox[2], x)
        bbox[3] = max(bbox[3], y)

    name2gid = {n: i for i, n in enumerate(names)}

    def flatten_outline(gname, depth=0):
        """Возвращает (coords, endPts, flags); композиты разворачиваются
        в простые контуры (иначе PDF Type 42 обязан рендерить компоненты,
        а нам нужен один универсальный формат)."""
        gl = glyf[gname]
        nc = getattr(gl, "numberOfContours", 0)
        if depth > 8:
            return [], [], []
        if nc >= 0:
            if nc == 0:
                return [], [], []
            return list(gl.coordinates), [int(e) + 1 for e in gl.endPtsOfContours], list(gl.flags)
        C, E, F = [], [], []
        for comp in gl.components:
            cx, ce, cf = flatten_outline(comp.glyphName, depth + 1)
            m = getattr(comp, "transformation", None) or (1, 0, 0, 1, comp.x, comp.y)
            a, b, cc, d, tx, ty = m
            off = len(C)
            for (x, y) in cx:
                nx = round(a * x + cc * y + tx)
                ny = round(b * x + d * y + ty)
                C.append((nx, ny))
                add_pt(nx, ny + 1000)
            E.extend(off + e for e in ce)
            F.extend(cf)
        return C, E, F

    for code, gname in sorted(cmap.items()):
        gid = name2gid.get(gname)
        if code > 0xFFFF or gid is None:
            continue
        codepoints[code] = gid
        advances[gid] = int(round(hmtx[gname][0] * sc))
        coords, ends, fl = flatten_outline(gname)
        pts = [[round(x * sc), round(y * sc + 1000)] for x, y in coords]  # инверсия TTF->PDF
        flags = [1 if (fv & 0x01) else 0 for fv in fl]
        for p in pts:
            add_pt(p[0], p[1])
        outlines[gid] = {"pts": pts, "flags": flags, "ends": ends}

    used = sorted(set(codepoints.values()))
    remap = {g: i for i, g in enumerate(used)}
    out_cp = {c: remap[g] for c, g in codepoints.items()}
    out_adv = {remap[g]: w for g, w in advances.items() if g in remap}
    out_gl = {remap[g]: outlines[g] for g in used}
    asc = int(round(f["hhea"].ascent * sc))
    desc = int(round(f["hhea"].descent * sc))
    return {"cp": out_cp, "adv": out_adv, "gl": out_gl,
            "asc": asc, "desc": desc, "bbox": bbox, "ng": len(used)}


def fmt_num(n):
    n = round(float(n), 1)
    return str(int(n)) if n == int(n) else repr(n)


def emit_font(var, d):
    lines = []
    lines.append("const %s = {" % var)
    # codepoints: {код: glyphId}
    cp_items = ",".join("%d:%d" % (c, g) for c, g in sorted(d["cp"].items()))
    lines.append("  cp:{%s}," % cp_items)
    adv_items = ",".join("%d:%d" % (g, w) for g, w in sorted(d["adv"].items()))
    lines.append("  adv:{%s}," % adv_items)
    lines.append("  asc:%d,desc:%d,bbox:[%s]," % (
        d["asc"], d["desc"], ",".join(fmt_num(v) for v in d["bbox"])))
    lines.append("  ng:%d," % d["ng"])
    lines.append("  glyphs:[")
    for gid in range(d["ng"]):
        g = d["gl"].get(gid, {"pts": [], "flags": [], "ends": []})
        pts = "[" + ",".join("[%s,%s]" % (fmt_num(x), fmt_num(y)) for x, y in g["pts"]) + "]"
        fl = "[" + ",".join(str(v) for v in g["flags"]) + "]"
        en = "[" + ",".join(str(v) for v in g["ends"]) + "]"
        lines.append("{p:%s,f:%s,e:%s}%s" % (pts, fl, en, "," if gid < d["ng"] - 1 else ""))
    lines.append("]")
    lines.append("};")
    return "\n".join(lines)


def main():
    reg = build(SRC_REG)
    bold = build(SRC_BOLD)

    out = []
    out.append("// ============================================================")
    out.append("// ШРИФТЫ ДЛЯ PDF-ЭКСПОРТА — ГЕНЕРИРУЕМЫЙ ФАЙЛ, НЕ РЕДАКТИРОВАТЬ!")
    out.append("//")
    out.append("// Источник: DejaVu Sans / DejaVu Sans Bold (свободная лицензия")
    out.append("// Bitstream Vera) — субсеты только нужных символов (кириллица +")
    out.append("// латиница), unitsPerEm = 1000, координаты уже инвертированы под")
    out.append("// систему координат PDF (+1000 по y). Экспортёр (js/exporters.js)")
    out.append("// собирает из этих данных встроенный Type 42 шрифт «на лету»,")
    out.append("// поэтому в PDF корректно отображается русские тексты без")
    out.append("// транслитерации и без внешних файлов шрифтов.")
    out.append("//")
    out.append("// Пересборка: python3 tools/make_pdf_fonts.py")
    out.append("// ============================================================")
    out.append("")
    out.append("/* eslint-disable */")
    out.append("")
    out.append(emit_font("REG_FONT", reg))
    out.append("")
    out.append(emit_font("BOLD_FONT", bold))
    out.append("")
    out.append("export const PDF_FONTS = { reg: REG_FONT, bold: BOLD_FONT };")
    out.append("")

    dest = os.path.join(ROOT, "js", "pdf-fonts.js")
    with open(dest, "w", encoding="utf-8") as fh:
        fh.write("\n".join(out))
    print("OK: %s (%d строк, глифов: reg=%d bold=%d)" % (
        dest, len(out), reg["ng"], bold["ng"]))


if __name__ == "__main__":
    main()
