from playwright.sync_api import sync_playwright

CHECK_JS = """() => {
  const body = document.getElementById('skills-body');
  const cards = [...body.children].filter(e => e.classList.contains('skill-group-card'));
  const rects = cards.map(c => {
    const r = c.getBoundingClientRect();
    return {g: c.dataset.group, left: Math.round(r.left), right: Math.round(r.right),
            top: Math.round(r.top), bottom: Math.round(r.bottom), h: Math.round(r.height)};
  });
  // пересечения любых двух карточек
  const overlaps = [];
  for (let i = 0; i < rects.length; i++)
    for (let j = i + 1; j < rects.length; j++) {
      const a = rects[i], b = rects[j];
      const ox = Math.min(a.right, b.right) - Math.max(a.left, b.left);
      const oy = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
      if (ox > 2 && oy > 2) overlaps.push([a.g, b.g, ox, oy]);
    }
  // пустоты: для каждой колонки — расстояние от низа последней карточки до общего дна
  const maxBottom = Math.max(...rects.map(r => r.bottom));
  const byLeft = {};
  for (const r of rects) { (byLeft[r.left] ||= []).push(r); }
  const tails = Object.entries(byLeft).map(([left, list]) => ({
    col: Number(left), tail: maxBottom - Math.max(...list.map(r => r.bottom)), n: list.length
  }));
  const cols = Number(getComputedStyle(body).getPropertyValue('--sg-cols'));
  return {cols, count: rects.length, overlaps, tails,
          containerH: Math.round(body.getBoundingClientRect().height), maxBottom};
}"""

def report(tag, res):
    print(f"--- {tag}: cols={res['cols']} cards={res['count']}")
    print("    overlaps:", res['overlaps'] or "NONE")
    tails = sorted(res['tails'], key=lambda t: -t['tail'])
    print("    tails (px below last card per column):", [(t['col'], t['tail']) for t in tails])
    ok = not res['overlaps'] and all(t['tail'] <= 40 for t in tails) and len(tails) == res['cols']
    print("    RESULT:", "PASS" if ok else "FAIL")
    return ok

all_ok = True
with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport={"width": 1500, "height": 950})
    errors = []
    pg.on("pageerror", lambda e: errors.append(str(e)))
    pg.goto("file:///workspace/index.html")
    pg.wait_for_timeout(600)
    pg.click("#btn-method-1")
    pg.wait_for_timeout(700)

    for w in [1500, 1100, 900, 700, 500, 350]:
        # реальное изменение размера окна — ResizeObserver срабатывает корректно
        pg.set_viewport_size({"width": w, "height": 950})
        pg.wait_for_timeout(800)
        all_ok &= report(f"viewport {w}px", pg.evaluate(CHECK_JS))

    # сворачиваем несколько групп и проверяем снова
    pg.set_viewport_size({"width": 1500, "height": 950})
    pg.wait_for_timeout(800)
    heads = pg.query_selector_all("#skills-body .skill-group-head")
    for h in heads[:3]:
        h.click()
        pg.wait_for_timeout(150)
    pg.wait_for_timeout(900)
    all_ok &= report("collapsed 3 groups @1500", pg.evaluate(CHECK_JS))

    # разворачиваем обратно
    for h in heads[:3]:
        h.click()
        pg.wait_for_timeout(150)
    pg.wait_for_timeout(900)
    all_ok &= report("expanded back @1500", pg.evaluate(CHECK_JS))

    # смена роли (полная перерисовка таблицы навыков)
    pg.select_option("#role-select", "Netrunner")
    pg.wait_for_timeout(1000)
    all_ok &= report("role change Netrunner @1500", pg.evaluate(CHECK_JS))

    # быстрая серия ресайзов — не должно остаться «в полёта»
    for w in [800, 1400, 600, 1200]:
        pg.set_viewport_size({"width": w, "height": 950})
        pg.wait_for_timeout(120)
    pg.wait_for_timeout(1200)
    all_ok &= report("after rapid resizes -> 1200", pg.evaluate(CHECK_JS))

    print("PAGE ERRORS:", errors or "none")
    print("ALL:", "PASS" if all_ok and not errors else "FAIL")
