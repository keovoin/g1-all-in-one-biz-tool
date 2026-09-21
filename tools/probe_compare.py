from playwright.sync_api import sync_playwright
import sys

def probe(url):
    out = []
    with sync_playwright() as p:
        b = p.chromium.launch()
        pg = b.new_page()
        def on_resp(r):
            if '/api/' in r.url:
                out.append((r.status, r.url))
        pg.on("response", on_resp)
        pg.goto(url, wait_until="domcontentloaded", timeout=60000)
        pg.wait_for_timeout(20000)
        txt = pg.evaluate("() => document.body.innerText.slice(0,150)")
        b.close()
    print("URL:", url)
    for s, u in out:
        print("  ", s, u[:120])
    print("  BODY:", txt.replace("\n", " / ")[:150])

probe("http://127.0.0.1:4200/auth/login")
print("=" * 40)
probe("https://sastra-biz.onrender.com/auth/login")
