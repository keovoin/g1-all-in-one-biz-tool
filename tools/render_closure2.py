"""Fast runtime-closure computation for the prebuilt gauzy API.
1. BFS over package.json 'dependencies' starting from dist/apps/api/node_modules/@gauzy/*
2. Grep all dist @gauzy JS + main.js for require("X") to catch undeclared runtime deps
3. Output: pinned name@version list + total size + native .node check
"""
import os, re, json

base = r"C:\Users\KEOVOIN-DESKTOP\g1-all-in-one-biz-tool"
root_nm = os.path.join(base, "node_modules")
gauzy_nm = os.path.join(base, "dist", "apps", "api", "node_modules", "@gauzy")

def pkg_meta(name):
    d = os.path.join(root_nm, *name.split("/"))
    pj = os.path.join(d, "package.json")
    if not os.path.isfile(pj):
        return None, None, d
    try:
        meta = json.load(open(pj, encoding="utf8", errors="ignore"))
    except Exception:
        return None, None, d
    return meta, os.path.getsize(os.path.dirname(pj)) if False else None, d

def dir_size(d):
    t = 0
    for dp, dn, fn in os.walk(d):
        for x in fn:
            try: t += os.path.getsize(os.path.join(dp, x))
            except OSError: pass
    return t

# --- 1. BFS over package.json deps (runtime deps only) ---
closure = {}  # name -> version
queue = []
for g in sorted(os.listdir(gauzy_nm)):
    d = os.path.join(gauzy_nm, g)
    if os.path.isdir(d):
        queue.append("@gauzy/" + g)

while queue:
    name = queue.pop()
    if name in closure:
        continue
    meta, _, d = pkg_meta(name)
    ver = meta.get("version", "?") if meta else "?"
    if name.startswith("@gauzy/"):
        ver = "dist"
    closure[name] = ver
    if meta and not name.startswith("@gauzy/"):
        for dep in (meta.get("dependencies") or {}):
            if dep not in closure:
                queue.append(dep)
        # peerDeps that are actually required at runtime (webpack externals) — skip, caught by grep

# --- 2. grep requires in dist @gauzy + main.js (catch undeclared) ---
RE_REQ = re.compile(r'''require\(\s*["']([A-Za-z0-9@._/-]+)["']\s*\)''')
specs = set()
count = 0
for root, dirs, files in os.walk(gauzy_nm):
    for f in files:
        if not f.endswith(".js"):
            continue
        count += 1
        p = os.path.join(root, f)
        if os.path.getsize(p) > 2_000_000:
            continue
        try:
            data = open(p, "rb").read().decode("utf8", "ignore")
        except OSError:
            continue
        for m in RE_REQ.finditer(data):
            s = m.group(1)
            if s.startswith(".") or s.startswith("node:"):
                continue
            specs.add(s)
mp = os.path.join(base, "dist", "apps", "api", "main.js")
data = open(mp, "rb").read().decode("utf8", "ignore")
for m in RE_REQ.finditer(data):
    s = m.group(1)
    if not s.startswith(".") and not s.startswith("node:"):
        specs.add(s)

print("dist js files scanned:", count)
# map spec -> package name (strip subpath)
extra = {}
for s in sorted(specs):
    if s.startswith("@"):
        pn = "/".join(s.split("/")[:2])
    else:
        pn = s.split("/")[0]
    if pn in closure:
        continue
    # resolve in root node_modules
    d = os.path.join(root_nm, *pn.split("/"))
    if not os.path.isdir(d):
        # maybe the spec itself is the package (no subpath) or scoped subpath
        d2 = os.path.join(root_nm, *s.split("/"))
        if os.path.isdir(d2):
            pn = s
            d = d2
        else:
            print("UNRESOLVED require:", s)
            continue
    try:
        ver = json.load(open(os.path.join(d, "package.json"), encoding="utf8", errors="ignore")).get("version", "?")
    except Exception:
        ver = "?"
    extra[pn] = ver
    closure[pn] = ver
    # its deps too
    meta, _, _ = pkg_meta(pn)
    if meta:
        for dep in (meta.get("dependencies") or {}):
            if dep not in closure:
                queue.append(dep)

# --- 3. report ---
total = 0
natives = []
for name, ver in closure.items():
    if name.startswith("@gauzy/"):
        continue
    d = os.path.join(root_nm, *name.split("/"))
    if os.path.isdir(d):
        total += dir_size(d)
        for dp, dn, fn in os.walk(d):
            for x in fn:
                if x.endswith(".node"):
                    natives.append(os.path.relpath(os.path.join(dp, x), root_nm))

print("total runtime packages:", len([n for n in closure if not n.startswith('@gauzy/')]))
print("total size: %.1f MB" % (total / 1048576))
print("NATIVE .node files (need linux build or prebuild):")
for n in sorted(set(natives)):
    print("  ", n)
json.dump({k: v for k, v in sorted(closure.items()) if not k.startswith("@gauzy/")},
          open(os.path.join(base, "tools", "render_closure.json"), "w"), indent=1)
print("wrote tools/render_closure.json")
