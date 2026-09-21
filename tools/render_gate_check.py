import os, re

base = r"C:\Users\KEOVOIN-DESKTOP\g1-all-in-one-biz-tool"

def show(path, kws, width=220, maxhits=3):
    p = os.path.join(base, path)
    if not os.path.exists(p):
        print("!! missing:", p)
        return
    s = open(p, encoding='utf-8', errors='ignore').read()
    for kw in kws:
        i = 0
        n = 0
        while n < maxhits:
            i = s.find(kw, i)
            if i < 0:
                break
            print(f"### {path} :: {kw}")
            print(s[max(0, i - width // 2):i + width].replace('\n', ' '))
            i += len(kw)
            n += 1
        if n == 0:
            print(f"### {path} :: {kw} -> NOT FOUND")

# 1) The production secret gate
print("===== validate-secrets.js =====")
show('dist/apps/api/node_modules/@gauzy/core/src/lib/bootstrap/validate-secrets.js',
     ['published', 'default', 'JWT_SECRET', 'DEMO_SUPER'], width=400, maxhits=2)

# 2) Seed admin credentials: env var names
print("\n===== seed admin credentials =====")
envjs = 'dist/apps/api/node_modules/@gauzy/config/src/lib/environments/environment.js'
s = open(os.path.join(base, envjs), encoding='utf-8', errors='ignore').read()
i = s.find('admin@ever.co')
print(s[max(0, i - 800):i + 400].replace('\n', ' '))
