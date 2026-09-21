"""AUDIT: every require/import package name referenced by the built API must be in the
runtime closure (or be a node: builtin / @gauzy workspace pkg). Any gap = broken deploy."""
import os, re, json

base = r"C:\Users\KEOVOIN-DESKTOP\g1-all-in-one-biz-tool"
api = os.path.join(base, "dist", "apps", "api")
closure = set(n for n, v in json.load(open(os.path.join(base, "tools", "render_closure.json"))))

# top-level packages present inside dist (webpack output + anything else)
dist_nm = os.path.join(api, "node_modules")
dist_top = set(os.listdir(dist_nm)) if os.path.isdir(dist_nm) else set()

REQ = re.compile(r"""(?:require\s*\(\s*|from\s+|import\s*\(\s*)['"]([a-zA-Z@][^'"]*)['"]""")
SUB = re.compile(r"""[^'"\w]require\s*\(\s*['"]([^'"]+)['"]\s*\)""")

names = set()
checked = 0
for root, dn, fn in os.walk(api):
    dn[:] = [d for d in dn if d not in (".git",)]
    for f in fn:
        if not f.endswith(".js"):
            continue
        p = os.path.join(root, f)
        try:
            s = open(p, encoding="utf-8", errors="ignore").read()
        except OSError:
            continue
        checked += 1
        for m in list(REQ.finditer(s)) + list(SUB.finditer(s)):
            spec = m.group(1)
            if spec.startswith(("node:", "./", "../")):
                continue
            if spec.startswith("@gauzy/"):
                continue  # workspace pkg, present in dist
            names.add(spec.split("/")[0] if not spec.startswith("@") else "/".join(spec.split("/")[:2]))

missing = sorted(n for n in names if n not in closure)
print("js files scanned:", checked)
print("distinct external package names referenced:", len(names))
print("closure size:", len(closure))
print("IN DIST NM (top-level):", len(dist_top), "of which NOT in closure:", len(dist_top - closure))
print("\nMISSING FROM CLOSURE (would 500 at runtime):")
for n in missing:
    print("  !", n)
print("\nMISSING done.")
