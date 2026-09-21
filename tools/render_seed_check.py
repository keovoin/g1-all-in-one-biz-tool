import os, re

base = r"C:\Users\KEOVOIN-DESKTOP\g1-all-in-one-biz-tool"

# 1) Where is admin@ever.co / seed admin created? What password?
print("=== files containing admin@ever.co (dist) ===")
found = []
for root, dirs, files in os.walk(os.path.join(base, "dist/apps/api")):
    for f in files:
        if f.endswith('.js'):
            p = os.path.join(root, f)
            try:
                if 'admin@ever.co' in open(p, encoding='utf-8', errors='ignore').read():
                    found.append(p.replace(base, ''))
            except OSError:
                pass
print(found[:10])

if found:
    p = os.path.join(base, found[0])
    s = open(p, encoding='utf-8', errors='ignore').read()
    i = s.find('admin@ever.co')
    print("\n=== seed admin ctx (email) ===")
    print(s[max(0, i - 800):i + 400].replace('\n', ' '))

# 2) bootstrap gating of seed
boot = os.path.join(base, "dist/apps/api/node_modules/@gauzy/core/src/lib/bootstrap/index.js")
v = open(boot, encoding='utf-8', errors='ignore').read()
i = v.find('seedDBIfEmpty')
print("\n=== bootstrap seed gating ctx ===")
print(v[max(0, i - 1200):i + 100].replace('\n', ' '))

# 3) isDist check in database.js
db = os.path.join(base, "dist/apps/api/node_modules/@gauzy/config/src/lib/database.js")
d = open(db, encoding='utf-8', errors='ignore').read()
i = d.find('isDist')
print("\n=== isDist ctx ===")
print(d[max(0, i - 300):i + 400].replace('\n', ' '))
