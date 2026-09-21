from playwright.sync_api import sync_playwright
import json

out = []
with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport={"width": 1280, "height": 800})
    def on_resp(r):
        if '/api/' in r.url and 'googleapis' not in r.url:
            out.append((r.status, r.url.replace('https://sastra-biz.onrender.com','').replace('http://127.0.0.1:4200','')))
    pg.on("response", on_resp)
    pg.goto("https://sastra-biz.onrender.com/auth/login", wait_until="domcontentloaded", timeout=90000)
    pg.wait_for_timeout(15000)
    print("BEFORE LOGIN:")
    for s,u in out: print("  ", s, u[:100])
    # find the email/password inputs (Angular form)
    try:
        pg.fill('input[type="email"], input[formcontrolname="email"]', 'admin@ever.co', timeout=20000)
        pg.fill('input[type="password"], input[formcontrolname="password"]', 'admin', timeout=20000)
        pg.screenshot(path="C:/Users/KEOVOIN-DESKTOP/AppData/Local/Temp/sastra_filled.png")
        pg.click('button[type="submit"]', timeout=20000)
        pg.wait_for_timeout(12000)
        print("URL AFTER SUBMIT:", pg.url)
        print("API CALLS AFTER LOGIN:")
        seen=set()
        for s,u in out:
            if u not in seen or s>=400: print("  ", s, u[:100]); seen.add(u)
        pg.screenshot(path="C:/Users/KEOVOIN-DESKTOP/AppData/Local/Temp/sastra_after_login.png")
    except Exception as e:
        print("form error:", e)
        pg.screenshot(path="C:/Users/KEOVOIN-DESKTOP/AppData/Local/Temp/sastra_err.png")
    b.close()
