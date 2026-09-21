from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport={"width": 1280, "height": 800})
    pg.goto("http://127.0.0.1:4200/auth/login", wait_until="domcontentloaded", timeout=60000)
    pg.wait_for_timeout(6000)
    pg.fill('input[name="email"]', 'admin@ever.co', timeout=15000)
    pg.fill('input[name="password"]', 'admin', timeout=15000)
    pg.click('button[type="submit"]', timeout=15000)
    pg.wait_for_timeout(12000)
    print("URL:", pg.url)
    print("TITLE:", pg.title())
    body = pg.evaluate("() => document.body.innerText.replace(/\\n+/g,' | ').slice(0,300)")
    print("BODY:", body)
    pg.screenshot(path="C:/Users/KEOVOIN-DESKTOP/AppData/Local/Temp/sastra_local_logged.png")
    b.close()
