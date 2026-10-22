import asyncio, json
from playwright.async_api import async_playwright

CHECK_JS = """
() => {
  const body = document.getElementById('skills-body');
  if (!body) return {err: 'no body'};
  const cards = [...body.children].filter(e => e.classList.contains('skill-group-card'));
  const rects = cards.map(c => {
    const r = c.getBoundingClientRect();
    return {g: c.dataset.group, left: r.left, right: r.right, top: r.top, bottom: r.bottom};
  });
  // overlaps (visual rects)
  const overlaps = [];
  for (let i=0;i<rects.length;i++) for (let j=i+1;j<rects.length;j++) {
    const a=rects[i], b=rects[j];
    const ox = Math.min(a.right,b.right)-Math.max(a.left,b.left);
    const oy = Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top);
    if (ox>1 && oy>1) overlaps.push([a.g,b.g,Math.round(ox),Math.round(oy)]);
  }
  // gaps between consecutive cards in same column
  const gaps = [];
  const sortedByCol = {};
  for (const r of rects) {
    const k = Math.round(r.left);
    (sortedByCol[k]=sortedByCol[k]||[]).push(r);
  }
  for (const k of Object.keys(sortedByCol)) {
    const list = sortedByCol[k].sort((a,b)=>a.top-b.top);
    for (let i=1;i<list.length;i++) gaps.push(Math.round(list[i].top - list[i-1].bottom));
  }
  // bottoms per column & container
  const colBottoms = Object.entries(sortedByCol).map(([k,l]) => Math.max(...l.map(r=>r.bottom)));
  const contBottom = body.getBoundingClientRect().bottom;
  const maxBottom = Math.max(...rects.map(r=>r.bottom));
  return {
    cols: getComputedStyle(body).columnCount,
    n: rects.length,
    overlaps,
    minGap: Math.min(...gaps),
    maxGap: Math.max(gaps),
    colSpread: Math.round(Math.max(...colBottoms) - Math.min(...colBottoms)),
    tailBelowCards: Math.round(contBottom - maxBottom),
  };
}
"""

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={"width":1400,"height":900})
        errors = []
        page.on("pageerror", lambda e: errors.append(str(e)))
        await page.goto("http://localhost:8077/index.html")
        await page.wait_for_timeout(600)
        # создать персонажа через реальный UI: выбрать роль и нажать «Способ №1»
        await page.select_option("#role-select", "Solo")
        await page.click("#btn-method-1")
        await page.wait_for_timeout(900)
        widths = [1400, 1200, 1000, 850, 700, 520, 380, 1400]
        for w in widths:
            await page.set_viewport_size({"width": w, "height": 900})
            await page.wait_for_timeout(700)
            res = await page.evaluate(CHECK_JS)
            print(f"W={w}", json.dumps(res, ensure_ascii=False))
        # collapse some groups
        heads = page.locator("#skills-body .skill-group-head")
        n = await heads.count()
        for i in range(0, n, 2):
            await heads.nth(i).click()
            await page.wait_for_timeout(120)
        await page.wait_for_timeout(800)
        res = await page.evaluate(CHECK_JS)
        print("COLLAPSED:", json.dumps(res, ensure_ascii=False))
        # expand all again
        heads = page.locator("#skills-body .skill-group-head")
        n = await heads.count()
        for i in range(n):
            await heads.nth(i).click()
            await page.wait_for_timeout(60)
        await page.wait_for_timeout(800)
        res = await page.evaluate(CHECK_JS)
        print("EXPANDED:", json.dumps(res, ensure_ascii=False))
        # change role
        await page.select_option("#role-select", "Nomad")
        await page.wait_for_timeout(900)
        res = await page.evaluate(CHECK_JS)
        print("ROLE NOMAD:", json.dumps(res, ensure_ascii=False))
        print("PAGE ERRORS:", errors)
        await browser.close()

asyncio.run(main())
