import os
base = r"C:\Users\KEOVOIN-DESKTOP\g1-all-in-one-biz-tool"

def size(p):
    t = 0
    n = 0
    for d, dn, fn in os.walk(p):
        for x in fn:
            try:
                t += os.path.getsize(os.path.join(d, x))
                n += 1
            except OSError:
                pass
    return t, n

targets = [
    ("dist/apps/gauzy", os.path.join(base, "dist/apps/gauzy")),
    ("dist/apps/api (all)", os.path.join(base, "dist/apps/api")),
    ("dist/apps/api/node_modules/@gauzy", os.path.join(base, "dist/apps/api/node_modules/@gauzy")),
    ("dist/apps/api/assets", os.path.join(base, "dist/apps/api/assets")),
    ("dist/apps/api/public", os.path.join(base, "dist/apps/api/public")),
]
for name, p in targets:
    if os.path.exists(p):
        t, n = size(p)
        print(f"{name}: {t/1048576:.1f} MB ({n} files)")
    else:
        print(f"{name}: MISSING")

# largest single files under dist
big = []
for d, dn, fn in os.walk(os.path.join(base, "dist")):
    for x in fn:
        p = os.path.join(d, x)
        try:
            s = os.path.getsize(p)
        except OSError:
            continue
        if s > 5_000_000:
            big.append((s, os.path.relpath(p, base)))
big.sort(reverse=True)
print("\nLargest files in dist:")
for s, p in big[:10]:
    print(f"  {s/1048576:.1f} MB  {p}")
