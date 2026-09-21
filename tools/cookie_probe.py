import os, re
base = r"C:\Users\KEOVOIN-DESKTOP\g1-all-in-one-biz-tool"
apinm = os.path.join(base, "dist/apps/api/node_modules/@gauzy")
hits = []
for root, dirs, files in os.walk(apinm):
    for f in files:
        if not f.endswith('.js'):
            continue
        p = os.path.join(root, f)
        try:
            s = open(p, encoding='utf-8', errors='ignore').read()
        except OSError:
            continue
        for m in re.finditer(r"(res|response)\.cookie\(", s):
            ctx = s[m.start():m.start() + 260]
            hits.append((p.replace(base, ''), ctx.replace('\n', ' ')))
print("res.cookie() call sites:", len(hits))
for p, c in hits[:8]:
    print(">>", p.split('node_modules')[-1])
    print("   ", c[:240])
