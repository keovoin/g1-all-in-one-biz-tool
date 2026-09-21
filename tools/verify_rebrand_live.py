from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport={"width": 1280, "height": 800})
    pg.goto("https://sastra-biz.onrender.com/auth/login", wait_until="domcontentloaded", timeout=90000)
    pg.wait_for_timeout(8000)
    pg.fill('input[name="email"]', 'admin@ever.co')
    pg.fill('input[name="password"]', 'admin')
    pg.click('button[type="submit"]')
    pg.wait_for_timeout(10000)
    print("URL:", pg.url)
    body = pg.evaluate("() => document.body.innerText.replace(/\\n+/g,' | ').slice(0,400)")
    print("BODY:", body)
    # check for Gauzy anywhere in rendered DOM
    gauzy = pg.evaluate("() => (document.body.innerText.match(/[Gg]auzy/g)||[]).length")
    print("GAUZY IN VISIBLE TEXT:", gauzy)
    title = pg.title()
    print("TITLE:", title)
    pg.screenshot(path="C:/Users/KEOVOIN-DESKTOP/AppData/Local/Temp/sastra_rebrand_dash.png")
    b.close()
