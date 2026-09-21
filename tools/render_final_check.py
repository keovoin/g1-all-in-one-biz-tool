"""Final preflight: web bundle API base, API prefix, root nm inventory, lockfile registries."""
import os, re, json, glob

base = r"C:\Users\KEOVOIN-DESKTOP\g1-all-in-one-biz-tool"
web = os.path.join(base, "dist", "apps", "gauzy")
api = os.path.join(base, "dist", "apps", "api")

# 1. web bundle API base
print("=== WEB BUNDLE: localhost / API base refs ===")
seen = set()
for f in glob.glob(os.path.join(web, "*.js")):
    try:
        s = open(f, encoding="utf-8", errors="ignore").read()
    except Exception:
        continue
    for m in re.finditer(r"https?://localhost:\d+[^\"']{0,30}", s):
        ctx = s[max(0, m.start()-60):m.start()+60].replace("\n", " ")
        k = ctx[:50]
        if k not in seen:
            seen.add(k)
            print(f"  {os.path.basename(f)}: ...{ctx}...")
    for m in re.finditer(r"API_BASE_URL[^,;]{0,80}", s):
        ctx = s[m.start():m.start()+100].replace("\n", " ")
        k = ctx[:60]
        if k not in seen:
            seen.add(k)
            print(f"  {os.path.basename(f)}: {ctx}")

# 2. API global prefix
print("=== API globalPrefix ===")
s = open(os.path.join(api, "main.js"), encoding="utf-8", errors="ignore").read()
for m in list(re.finditer(r"globalPrefix[^,;]{0,60}", s))[:6]:
    print("  ", s[m.start():m.start()+80].replace("\n", " "))

# 3. root node_modules top-level inventory
print("=== ROOT node_modules top-level ===")
nm = os.path.join(base, "node_modules")
names = []
symlinked = []
for n in os.listdir(nm):
    if n.startswith(".") or n == ".bin":
        continue
    p = os.path.join(nm, n)
    if os.path.islink(p):
        symlinked.append(n)
        continue
    if n.startswith("@"):
        for sub in os.listdir(p):
            names.append(f"{n}/{sub}")
    else:
        names.append(n)
print("  top-level real dirs:", len(names), "symlinks (workspaces):", len(symlinked))
print("  symlinks sample:", symlinked[:10])

# 4. lockfile registries
print("=== yarn.lock registries ===")
hosts = {}
for line in open(os.path.join(base, "yarn.lock"), encoding="utf-8", errors="ignore"):
    if line.startswith("\t"):
        m = re.search(r"https://([^/]+)/", line)
        if m:
            hosts[m.group(1)] = hosts.get(m.group(1), 0) + 1
print("  ", hosts)

# 5. local sqlite size
db = os.path.join(base, "apps", "api", "data", "gauzy.sqlite3")
if os.path.exists(db):
    print("=== local sqlite:", round(os.path.getsize(db)/1e6, 1), "MB ===")
