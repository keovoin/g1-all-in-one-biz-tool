from playwright.sync_api import sync_playwright

errs = []
api = []
with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport={"width": 1280, "height": 800})
    pg.on("console", lambda m: errs.append((m.type, m.text[:200])) if m.type in ("error", "warning") else None)
    pg.on("pageerror", lambda e: errs.append(("PAGEERROR", str(e)[:300])))
    pg.on("requestfailed", lambda r: api.append(("FAILED", r.url[:120], r.failure and r.failure.error_text)))
    def on_resp(r):
        if '/api' in r.url and 'googleapis' not in r.url:
            api.append((r.status, r.url[:120]))
    pg.on("response", on_resp)
    pg.goto("http://127.0.0.1:4200/auth/login", wait_until="domcontentloaded", timeout=90000)
    pg.wait_for_timeout(25000)
    # check state: skeleton present? inputs present?
    st = pg.evaluate("""() => ({
        inputs: document.querySelectorAll('input').length,
        buttons: document.querySelectorAll('button').length,
        skel: document.querySelectorAll('ngx-skeleton, .placeholder, [class*=skeleton]').length,
        bodyLen: document.body.innerHTML.length,
        hash: location.href
    })""")
    print("STATE:", st)
    print("--- CONSOLE ---")
    for t, m in errs[:25]: print(f"  [{t}] {m}")
    print("--- API/NET ---")
    for a in api[:25]: print("  ", a)
    pg.screenshot(path="C:/Users/KEOVOIN-DESKTOP/AppData/Local/Temp/sastra_state.png")
    b.close()
