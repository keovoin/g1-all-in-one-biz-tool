# Capture product screenshots for the Sastra group landing page
from playwright.sync_api import sync_playwright
import os

OUT = r"C:\Users\KEOVOIN-DESKTOP\sastra-group-site\assets"
os.makedirs(OUT, exist_ok=True)

SHOTS = [
    ("khinvite", "https://www.khinvite.com", True),        # wait for hero anim
    ("tvercv", "https://www.tvercv.com", True),
    ("urdrama", "https://urdrama.com", True),
    ("khfinder", "https://khfinder.com", True),
    ("biztool", "https://sastra-biz.onrender.com/auth/login", True),
]

with sync_playwright() as p:
    b = p.chromium.launch()
    for name, url, full in SHOTS:
        try:
            pg = b.new_page(viewport={"width": 1440, "height": 900}, device_scale_factor=2)
            pg.goto(url, wait_until="networkidle", timeout=60000)
            pg.wait_for_timeout(3500)
            # scroll through to trigger reveal animations, then back to top
            h = pg.evaluate("document.body.scrollHeight")
            for y in range(0, min(h, 4000), 700):
                pg.evaluate(f"window.scrollTo(0,{y})")
                pg.wait_for_timeout(250)
            pg.evaluate("window.scrollTo(0,0)")
            pg.wait_for_timeout(900)
            pg.screenshot(path=os.path.join(OUT, f"{name}.png"))
            print("OK", name, url)
            pg.close()
        except Exception as e:
            print("FAIL", name, str(e)[:160])
    # mobile shot of khinvite for the phone-frame motif
    try:
        ctx = b.new_context(viewport={"width": 390, "height": 844}, device_scale_factor=2, is_mobile=True)
        pg = ctx.new_page()
        pg.goto("https://www.khinvite.com", wait_until="networkidle", timeout=60000)
        pg.wait_for_timeout(3000)
        pg.screenshot(path=os.path.join(OUT, "khinvite-mobile.png"))
        print("OK mobile khinvite")
    except Exception as e:
        print("FAIL mobile", str(e)[:160])
    b.close()
