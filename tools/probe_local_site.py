from playwright.sync_api import sync_playwright

results = []
with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page()
    def on_req(r):
        if '/api' in r.url or 'authenticated' in r.url or 'languages' in r.url:
            results.append(r.url)
    pg.on("request", on_req)
    pg.goto("http://127.0.0.1:4200/auth/login", wait_until="domcontentloaded", timeout=30000)
    pg.wait_for_timeout(15000)
    for u in results:
        print("REQ:", u)
    b.close()
