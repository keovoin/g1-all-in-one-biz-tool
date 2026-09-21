from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport={"width": 1280, "height": 800})
    pg.goto("http://127.0.0.1:4200/auth/login", wait_until="domcontentloaded", timeout=60000)
    pg.wait_for_timeout(8000)
    inputs = pg.evaluate("""() => Array.from(document.querySelectorAll('input')).map(i => ({type:i.type, name:i.name||'', fc:i.getAttribute('formcontrolname')||'', ph:i.placeholder||'', visible: !!(i.offsetWidth||i.offsetHeight)}))""")
    print("INPUTS:", inputs)
    pg.screenshot(path="C:/Users/KEOVOIN-DESKTOP/AppData/Local/Temp/sastra_local_form.png")
    b.close()
