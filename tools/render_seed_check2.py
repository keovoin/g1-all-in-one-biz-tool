import os, re

base = r"C:\Users\KEOVOIN-DESKTOP\g1-all-in-one-biz-tool"
envjs = os.path.join(base, "dist/apps/api/node_modules/@gauzy/config/src/lib/environments/environment.js")
s = open(envjs, encoding='utf-8', errors='ignore').read()

print("=== environment.js: seed/admin email + password env vars ===")
for kw in ['admin@ever.co', 'DEMO_SUPER_ADMIN', 'superAdminEmail', 'SEED', 'seed']:
    idx = 0
    n = 0
    while n < 5:
        idx = s.find(kw, idx)
        if idx < 0:
            break
        print(f">> {kw} ::", s[max(0, idx - 250):idx + 250].replace('\n', ' '))
        idx += len(kw)
        n += 1

# auth.service.js seed usage
auth = os.path.join(base, "dist/apps/api/node_modules/@gauzy/core/src/lib/auth/auth.service.js")
t = open(auth, encoding='utf-8', errors='ignore').read()
i = t.find('admin@ever.co')
print("\n=== auth.service.js admin@ever.co ctx ===")
print(t[max(0, i - 700):i + 300].replace('\n', ' '))

# validate-secrets.js: what it blocks
vs = os.path.join(base, "dist/apps/api/node_modules/@gauzy/core/src/lib/bootstrap/validate-secrets.js")
v = open(vs, encoding='utf-8', errors='ignore').read()
print("\n=== validate-secrets.js (first 1500 chars) ===")
print(v[:1500])
