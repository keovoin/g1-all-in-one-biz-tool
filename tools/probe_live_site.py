# Live-site network probe: which requests hang / fail on render deploy
from playwright.sync_api import sync_playwright
import json, time

results = []
with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport={"width": 1280, "height": 800})
    def on_resp(r):
        results.append({"url": r.url.replace("https://sastra-biz.onrender.com", ""), "status": r.status, "ms": None})
    pg.on("response", on_resp)
    reqs = {}
    def on_req(r):
        reqs[r.url] = time.time()
    pg.on("request", on_req)
    pg.goto("https://sastra-biz.onrender.com/auth/login", wait_until="domcontentloaded", timeout=60000)
    # wait for network to settle / or 45s of skeleton
    done = pg.wait_for_function("() => !document.querySelector('body').innerText.match(/Loading/) && document.querySelectorAll('*').length > 0", timeout=45000) if False else None
    pg.wait_for_timeout(30000)
    # screenshot the state
    pg.screenshot(path="C:/Users/KEOVOIN-DESKTOP/AppData/Local/Temp/sastra_live.png")
    # find which requests never got responses
    pending = [u.replace("https://sastra-biz.onrender.com", "") for u in reqs if not any(x["url"] in u for x in results)]
    body_text = pg.evaluate("() => document.body.innerText.slice(0,200)")
    errs = pg.evaluate("() => window.__errs || []")
    print("RESPONSES:")
    for x in results[-40:]:
        print("  ", x["status"], x["url"][:110])
    print("PENDING (no response):")
    for u in pending[-20:]:
        print("  ", u[:110])
    print("BODY TEXT:", body_text[:200].replace("\n", " / "))
    b.close()
