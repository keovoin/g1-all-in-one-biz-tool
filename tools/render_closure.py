"""Compute the exact runtime dependency closure for the built API + its @gauzy packages.
Walks require()/import specifiers from dist/apps/api (main.js + node_modules/@gauzy/**),
resolving bare specifiers to the root node_modules, until closure. Prints the package
list (name@version) + total size.
"""
import os, re, json, sys

base = r"C:\Users\KEOVOIN-DESKTOP\g1-all-in-one-biz-tool"
root_nm = os.path.join(base, "node_modules")
api_dist = os.path.join(base, "dist", "apps", "api")

RE_BARE = re.compile(r'''(?:require\s*\(\s*["']([A-Za-z0-9@._/-]+)["']\s*\)|from\s+["']([A-Za-z0-9@._/-]+)["'])''')
RE_EXPORTS = re.compile(r'''["']([A-Za-z0-9@._/-]+)["']\s*:\s*["']\./''')

required = {}  # pkgname -> (version, abs_path)

def pkg_dir(name):
    """Resolve a bare specifier to its package directory under root_nm."""
    if name.startswith("."):
        return None
    # scoped
    if name.startswith("@"):
        parts = name.split("/")
        cand = os.path.join(root_nm, parts[0], parts[1]) if len(parts) >= 2 else os.path.join(root_nm, parts[0])
        if os.path.isdir(cand):
            return cand
        return None
    cand = os.path.join(root_nm, name)
    if os.path.isdir(cand):
        return cand
    return None

def pkg_name_of(d):
    # find the nearest package.json above d
    cur = d
    for _ in range(8):
        pj = os.path.join(cur, "package.json")
        if os.path.isfile(pj):
            try:
                data = json.load(open(pj, encoding="utf8", errors="ignore"))
                return data.get("name")
            except Exception:
                pass
        cur = os.path.dirname(cur)
    return None

def iter_js_files(start):
    stack = [start]
    while stack:
        d = stack.pop()
        try:
            entries = os.listdir(d)
        except OSError:
            continue
        for e in entries:
            p = os.path.join(d, e)
            try:
                if os.path.isdir(p):
                    if e == ".bin":
                        continue
                    stack.append(p)
                elif e.endswith((".js", ".mjs", ".cjs")):
                    yield p
            except OSError:
                pass

queue = []
# entry points: main.js + all @gauzy package dirs
queue.append(os.path.join(api_dist, "main.js"))
gauzy_nm = os.path.join(api_dist, "node_modules", "@gauzy")
for g in os.listdir(gauzy_nm):
    queue.append(os.path.join(gauzy_nm, g))

seen_files = set()
MAX_FILES = 60000
files_scanned = 0

# We process file-by-file; package set grows
pkg_stack = [os.path.join(api_dist, "main.js")]
# simpler: BFS over files
file_queue = [os.path.join(api_dist, "main.js")]
# plus all js in gauzy packages (they are the "entry" runtime code)
for g in os.listdir(gauzy_nm):
    for f in iter_js_files(os.path.join(gauzy_nm, g)):
        file_queue.append(f)

required_pkgs = {"@gauzy/*": ("dist", gauzy_nm)}  # marker

while file_queue and files_scanned < MAX_FILES:
    f = file_queue.pop(0)
    if f in seen_files:
        continue
    seen_files.add(f)
    files_scanned += 1
    try:
        size = os.path.getsize(f)
        if size > 3_000_000:
            continue
        data = open(f, "rb").read().decode("utf8", "ignore")
    except OSError:
        continue
    bare = set()
    for m in RE_BARE.finditer(data):
        spec = m.group(1) or m.group(2)
        if spec and not spec.startswith("."):
            bare.add(spec)
    for spec in bare:
        d = pkg_dir(spec)
        if not d:
            continue
        name = pkg_name_of(d) or (spec.split("/")[1] if spec.startswith("@") and len(spec.split("/")) > 1 else spec)
        if name in required_pkgs:
            continue
        pj = os.path.join(d, "package.json")
        ver = "?"
        if os.path.isfile(pj):
            try:
                ver = json.load(open(pj, encoding="utf8", errors="ignore")).get("version", "?")
            except Exception:
                pass
        required_pkgs[name] = (ver, d)
        # queue its js files
        for gf in iter_js_files(d):
            if gf not in seen_files:
                file_queue.append(gf)

out = {k: v[0] for k, v in required_pkgs.items() if k != "@gauzy/*"}
print("files scanned:", files_scanned)
print("packages required:", len(out))
total = 0
for name, (ver, d) in [(k, v) for k, v in required_pkgs.items() if k != "@gauzy/*"]:
    try:
        for dp, dn, fn in os.walk(d):
            for x in fn:
                try:
                    total += os.path.getsize(os.path.join(dp, x))
                except OSError:
                    pass
    except OSError:
        pass
print("total bytes: %.1f MB" % (total / 1048576))
json.dump(sorted(out.items()), open(os.path.join(base, "tools", "render_closure.json"), "w"), indent=0)
print("wrote tools/render_closure.json")
# native .node files inside closure
node_files = []
for name, (ver, d) in [(k, v) for k, v in required_pkgs.items() if k != "@gauzy/*"]:
    for dp, dn, fn in os.walk(d):
        for x in fn:
            if x.endswith(".node"):
                node_files.append(os.path.relpath(os.path.join(dp, x), root_nm))
print("NATIVE .node in closure:")
for n in sorted(set(node_files)):
    print("  ", n)
