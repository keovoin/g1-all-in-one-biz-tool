"""FINAL preflight report for Render deploy -> writes tools/render_report.txt"""
import os, re, json

base = r"C:\Users\KEOVOIN-DESKTOP\g1-all-in-one-biz-tool"
out = []
def p(*a):
    out.append(" ".join(str(x) for x in a))

# 1. official web replacements.sed
try:
    p("=== 1. .deploy/webapp/replacements.sed ===")
    p(open(os.path.join(base, ".deploy/webapp/replacements.sed"), encoding="utf-8").read())
except Exception as e:
    p("sed file err:", e)

# 2. web bundle baked literals (exact text for sed)
webdir = os.path.join(base, "dist/apps/gauzy")
mainjs = [f for f in os.listdir(webdir) if f.startswith("main.") and f.endswith(".js")]
p("\n=== 2. web main bundles ===", mainjs)
for f in mainjs:
    s = open(os.path.join(webdir, f), encoding="utf-8", errors="ignore").read()
    p(f"--- {f} ({len(s)} chars)")
    for k in ["API_BASE_URL", "COOKIE_DOMAIN", "CLIENT_BASE_URL", "SERVER_URL", "GAUZY_CLOUD_APP", "PLATFORM_LOGO"]:
        idxs = [m.start() for m in re.finditer(re.escape(k), s)][:4]
        for i in idxs:
            p("  >", k, "::", s[max(0, i - 60):i + 80].replace("\n", " "))
    p("  ws-refs:", len(re.findall(r"new WebSocket|websocket", s)))

# 3. API cookie handling
p("\n=== 3. API cookie domain refs ===")
apidir = os.path.join(base, "dist/apps/api")
hits = 0
for root, dn, fn in os.walk(os.path.join(apidir, "node_modules", "@gauzy")):
    for f in fn:
        if not f.endswith(".js"):
            continue
        try:
            s = open(os.path.join(root, f), encoding="utf-8", errors="ignore").read()
        except OSError:
            continue
        for m in re.finditer(r"COOKIE_DOMAIN|cookieDomain|domain:\s*[\"'][^\"']*\.", s):
            i = m.start()
            p("  >", os.path.relpath(os.path.join(root, f), apidir), "::", s[max(0, i - 70):i + 90].replace("\n", " "))
            hits += 1
            if hits > 12:
                break
    if hits > 12:
        break
p("  (hits capped)")

# 4. seed defaults (email/password)
p("\n=== 4. seed data defaults ===")
seedp = os.path.join(apidir, "node_modules/@gauzy/core/src/lib/core/seeds/seed-data.service.js")
if os.path.exists(seedp):
    s = open(seedp, encoding="utf-8", errors="ignore").read()
    for k in ["admin@", "password", "Password", "DEMO_SUPER_ADMIN", "superAdmin"]:
        for m in list(re.finditer(re.escape(k), s))[:5]:
            i = m.start()
            p("  >", k, "::", s[max(0, i - 80):i + 100].replace("\n", " "))
else:
    p("  seed-data.service.js not at expected path; searching...")
    for root, dn, fn in os.walk(os.path.join(apidir, "node_modules/@gauzy")):
        for f in fn:
            if "seed" in f.lower() and f.endswith(".js"):
                p("  found:", os.path.relpath(os.path.join(root, f), apidir))

# 5. patches dir
p("\n=== 5. patches/ ===")
pd = os.path.join(base, "patches")
if os.path.isdir(pd):
    for f in sorted(os.listdir(pd)):
        p("  patch:", f)
        try:
            txt = open(os.path.join(pd, f), encoding="utf-8").read()
            p("   lines:", len(txt.splitlines()))
            p("   " + txt[:600].replace("\n", "\n   "))
        except Exception as e:
            p("   read err", e)
else:
    p("  NO patches/ dir")

# 6. .env.local key names only (NEVER values)
p("\n=== 6. .env.local key names ===")
evp = os.path.join(base, ".env.local")
if os.path.exists(evp):
    for line in open(evp, encoding="utf-8"):
        line = line.strip()
        if line and not line.startswith("#") and "=" in line:
            p("  key:", line.split("=", 1)[0])

# 7. closure stats
c = json.load(open(os.path.join(base, "tools/render_closure.json"), encoding="utf-8"))
p("\n=== 7. runtime closure ===", "count:", len(c))
tot = 0
names = set()
for n, v in c:
    names.add(n.split("/")[0] if not n.startswith("@") else "/".join(n.split("/")[:2]))
p("   distinct top-level:", len(names))

open(os.path.join(base, "tools/render_report.txt"), "w", encoding="utf-8").write("\n".join(out))
print("report written:", len(out), "lines")
