from playwright.sync_api import sync_playwright
import json, pathlib
errors = []
dl = []
with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport={"width":1280,"height":900})
    pg.on("pageerror", lambda e: errors.append(("pageerror", str(e))))
    pg.on("console", lambda m: errors.append(("console-"+m.type, m.text)) if m.type=="error" else None)
    pg.goto("file:///workspace/index.html")
    pg.wait_for_timeout(800)

    print("role-info:", pg.inner_text("#role-info")[:70].replace("\n"," "))
    print("style options:", pg.eval_on_selector_all("#sel-style option", "els=>els.length"))

    # 1. Генерация — способ №1
    pg.click("#btn-method-1"); pg.wait_for_timeout(300)
    name = pg.inner_text("#ch-name"); role = pg.inner_text("#ch-role")
    style = pg.inner_text("#ch-style"); hp = pg.inner_text("#d-hp")
    rows = pg.eval_on_selector_all("#skills-body tr", "els=>els.length")
    print("GEN1:", name, "|", role, "| стиль:", style, "| HP:", hp, "| строк навыков:", rows)

    # 2. Способ №2 и №3
    pg.click("#btn-method-2"); pg.wait_for_timeout(200)
    print("GEN2:", pg.inner_text("#ch-method"))
    pg.click("#btn-method-3"); pg.wait_for_timeout(200)
    print("GEN3:", pg.inner_text("#ch-method"), "| buy visible:", pg.eval_on_selector("#buy-box","e=>!e.classList.contains('hidden')"))

    # 3. Сводка о роли при смене роли
    pg.select_option("#role-select", "Netrunner"); pg.wait_for_timeout(200)
    ri = pg.inner_text("#role-info")
    print("ROLE SUMMARY:", ri[:100].replace("\n"," "))

    # 4. Экспорт json/xlsx/pdf — ловим скачанные файлы
    for fmt, sel in [("json","#btn-export-json"),("xlsx","#btn-export-xlsx"),("pdf","#btn-export-pdf")]:
        with pg.expect_download(timeout=5000) as di:
            pg.click(sel)
        d = di.value
        path = pathlib.Path("/tmp/dl_"+d.suggested_filename)
        d.save_as(path)
        print("EXPORT", fmt, "->", d.suggested_filename, path.stat().st_size, "bytes")

    # проверка содержимого json
    j = json.load(open("/tmp/dl_cp-red-"+name.split(' ')[0]+"-Netrunner.json" if False else [x for x in pathlib.Path('/tmp').glob('dl_*.json')][0]))
    print("JSON keys:", list(j.keys()), "| character.name:", j["character"]["name"])

    # 5. Импорт: Data/ExportExample.json через file input
    pg.set_input_files("#inp-import-file", "/workspace/Data/ExportExample.json")
    pg.wait_for_timeout(500)
    print("IMPORT toast:", pg.inner_text("#toast"))
    print("IMPORT sheet name:", pg.inner_text("#ch-name"))

    # 6. Сохранение + список сохранённых
    pg.click("#btn-save"); pg.wait_for_timeout(200)
    print("SAVED items:", pg.eval_on_selector_all("#saved-list .saved-item","els=>els.length"))

    # валидность pdf/xlsx
    head = open("/tmp/"+[x.name for x in pathlib.Path('/tmp').glob('dl_*.pdf')][0],'rb').read(8)
    print("PDF header:", head)
    headx = open("/tmp/"+[x.name for x in pathlib.Path('/tmp').glob('dl_*.xlsx')][0],'rb').read(4)
    print("XLSX magic:", headx)

    for t,m in errors: print(t, "::", m[:150])
    if not errors: print("NO CONSOLE ERRORS")
    b.close()
