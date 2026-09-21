import os, re

base = r"C:\Users\KEOVOIN-DESKTOP\g1-all-in-one-biz-tool"

# 1) LOCAL file provider storage path (uploads) — which env var / default
print("=== local file storage provider ===")
hits = []
for root, dirs, files in os.walk(os.path.join(base, "dist/apps/api/node_modules/@gauzy/common")):
    for f in files:
        if f.endswith('.js'):
            p = os.path.join(root, f)
            try:
                s = open(p, encoding='utf-8', errors='ignore').read()
            except OSError:
                continue
            if 'uploads' in s or 'localFileStorage' in s or 'FILE_STORAGE' in s:
                hits.append(p)
for p in hits[:5]:
    print("##", p.replace(base, ''))
    s = open(p, encoding='utf-8', errors='ignore').read()
    for kw in ['uploads', 'FILE_STORAGE_PATH', 'localFileStorage', 'publicPath', 'storage']:
        for m in list(re.finditer(kw, s))[:3]:
            print("   >", s[max(0, m.start()-120):m.start()+160].replace('\n', ' '))
    print()

# 2) exact COOKIE_DOMAIN literal in built web (count + context)
print("=== COOKIE_DOMAIN literal in web ===")
s = open(os.path.join(base, "dist/apps/gauzy/main.37238f23688eaf88.js"), encoding='utf-8', errors='ignore').read()
n = s.count('COOKIE_DOMAIN:".gauzy.co"')
print("count of COOKIE_DOMAIN:\".gauzy.co\":", n)
i = s.find('COOKIE_DOMAIN:".gauzy.co"')
print(s[max(0, i-120):i+120].replace('\n', ' '))

# 3) any other baked localhost in web (all chunks)
print("\n=== localhost refs in ALL web chunks ===")
import glob
for f in glob.glob(os.path.join(base, "dist/apps/gauzy/*.js")):
    t = open(f, encoding='utf-8', errors='ignore').read()
    c = t.count('localhost:3000') + t.count('localhost:4200')
    if c:
        print(os.path.basename(f), c)
print("scan done")

# 4) does dist/apps/api have its own package.json (for npm rebuild context)?
print("\n=== dist/apps/api package.json? ===")
print(os.path.exists(os.path.join(base, "dist/apps/api/package.json")))
print(os.path.exists(os.path.join(base, "dist/apps/api/node_modules/.package-lock.json")))
