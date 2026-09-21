"""Final literal-level checks for the deploy entrypoint patches."""
import os, re

base = r"C:\Users\KEOVOIN-DESKTOP\g1-all-in-one-biz-tool"
webdir = os.path.join(base, "dist/apps/gauzy")
apidir = os.path.join(base, "dist/apps/api")

print("=== 1. web bundle literals ===")
for f in os.listdir(webdir):
    if not f.endswith(".js"):
        continue
    s = open(os.path.join(webdir, f), encoding="utf-8", errors="ignore").read()
    for lit in ["http://localhost:3000", "http://localhost:4200", '.gauzy.co"']:
        n = s.count(lit)
        if n:
            i = s.find(lit)
            print(f"  {f}: {lit!r} x{n}  e.g. ...{s[max(0,i-90):i+60]!r}...")

print("\n=== 2. window._env override present? ===")
f0 = [f for f in os.listdir(webdir) if f.startswith("main.") and f.endswith(".js")][0]
s = open(os.path.join(webdir, f0), encoding="utf-8", errors="ignore").read()
for k in ["window._env", "_env.api", "COOKIE_DOMAIN"]:
    i = s.find(k)
    print(f"  {k!r} @ {i}: ", s[max(0, i-150):i+200].replace("\n", " ") if i >= 0 else "NOT FOUND")

print("\n=== 3. API-side cookie domain usage ===")
hits = 0
for root, dn, fn in os.walk(os.path.join(apidir, "node_modules", "@gauzy")):
    for f in fn:
        if not f.endswith(".js"):
            continue
        try:
            s = open(os.path.join(root, f), encoding="utf-8", errors="ignore").read()
        except OSError:
            continue
        if "COOKIE_DOMAIN" in s or "cookieDomain" in s:
            rel = os.path.relpath(os.path.join(root, f), apidir)
            for m in list(re.finditer(r"COOKIE_DOMAIN|cookieDomain", s))[:3]:
                i = m.start()
                print(f"  {rel} :: {s[max(0,i-100):i+120]!r}")
            hits += 1
            if hits > 6:
                break
    if hits > 6:
        break
print("  (scan done)")

print("\n=== 4. demoCredentialConfig in environment.js ===")
s = open(os.path.join(apidir, "node_modules/@gauzy/config/src/lib/environments/environment.js"), encoding="utf-8").read()
i = s.find("demoCredentialConfig")
print(s[max(0, i-200):i+1200])

print("\n=== 5. sqlite path derivation in database.js ===")
s = open(os.path.join(apidir, "node_modules/@gauzy/config/src/lib/database.js"), encoding="utf-8").read()
for k in ["sqlitePath", "gaauzy.sqlite", ".sqlite3", "DB_PATH", "path.join(process.cwd()"]:
    i = s.find(k)
    if i >= 0:
        print(f"  {k!r} :: {s[max(0,i-250):i+250]!r}")

print("\n=== 6. LOCAL file storage path ===")
s = open(os.path.join(apidir, "node_modules/@gauzy/config/src/lib/environments/environment.js"), encoding="utf-8").read()
for k in ["FILE_PROVIDER", "localUploads", "uploads", "publicPath", "storagePath"]:
    i = s.find(k)
    if i >= 0:
        print(f"  {k!r} :: {s[max(0,i-100):i+200]!r}")
