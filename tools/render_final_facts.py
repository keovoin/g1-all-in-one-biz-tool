import os, re
base = r"C:\Users\KEOVOIN-DESKTOP\g1-all-in-one-biz-tool"

# 1) Web bundle: find the cookie-setting code and how COOKIE_DOMAIN is used
webmain = os.path.join(base, "dist/apps/gauzy/main.37238f23688eaf88.js")
s = open(webmain, encoding='utf-8', errors='ignore').read()
i = s.find('document.cookie')
print("=== web document.cookie ctx ===")
print(s[max(0, i - 900):i + 300].replace('\n', ' '))

# 2) Seed: admin email/password env var names
seed = os.path.join(base, "dist/apps/api/node_modules/@gauzy/core/src/lib/core/seeds/seed-data.service.js")
t = open(seed, encoding='utf-8', errors='ignore').read()
for m in re.finditer(r'DEMO_SUPER_ADMIN_[A-Z_]+|SUPER_ADMIN_[A-Z_]+', t):
    pass
envs = sorted(set(re.findall(r'process\.env\.([A-Z0-9_]+)', t)))
print("\n=== seed-data.service env vars ===")
print(envs)
i = t.find('admin@ever.co')
if i >= 0:
    print("=== admin email ctx ===")
    print(t[max(0, i - 500):i + 200].replace('\n', ' '))

# 3) seedDBIfEmpty call + gating
app = os.path.join(base, "dist/apps/api/node_modules/@gauzy/core/src/lib/app/app.service.js")
u = open(app, encoding='utf-8', errors='ignore').read()
i = u.find('seedDBIfEmpty')
print("\n=== app.service seedDBIfEmpty ctx ===")
print(u[max(0, i - 700):i + 300].replace('\n', ' '))

# 4) DEMO gating on seed in bootstrap
boot = os.path.join(base, "dist/apps/api/node_modules/@gauzy/core/src/lib/bootstrap/index.js")
v = open(boot, encoding='utf-8', errors='ignore').read()
for kw in ['seedDBIfEmpty', 'DEMO']:
    idx = 0
    n = 0
    while True:
        idx = v.find(kw, idx)
        if idx < 0 or n >= 4:
            break
        if kw == 'DEMO' and not re.match(r'DEMO[A-Z_]', v[idx:]):
            idx += 1
            continue
        print(f"=== bootstrap {kw} ===")
        print(v[max(0, idx - 300):idx + 200].replace('\n', ' '))
        idx += len(kw)
        n += 1

# 5) main.js: listen + prefix
main = os.path.join(base, "dist/apps/api/main.js")
w = open(main, encoding='utf-8', errors='ignore').read()
i = w.find('.listen(')
print("\n=== main.js listen ctx ===")
print(w[max(0, i - 500):i + 200].replace('\n', ' '))
i = w.find('globalPrefix')
print("\n=== main.js globalPrefix ctx ===")
print(w[max(0, i - 200):i + 200].replace('\n', ' ') if i >= 0 else "none")
