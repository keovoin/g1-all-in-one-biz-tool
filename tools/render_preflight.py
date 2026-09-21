import os, re, json
base = r"C:\Users\KEOVOIN-DESKTOP\g1-all-in-one-biz-tool"
api = os.path.join(base, "dist", "apps", "api")
nm = os.path.join(api, "node_modules")

if os.path.isdir(nm):
    tops = sorted(os.listdir(nm))
    print("DIST API node_modules top-level count:", len(tops))
    print("has better-sqlite3:", "better-sqlite3" in tops, "| has argon2:", "argon2" in tops)
    nodefiles = []
    for d, dirs, files in os.walk(nm):
        for f in files:
            if f.endswith(".node"):
                nodefiles.append(os.path.relpath(os.path.join(d, f), api))
    print(".node files:", nodefiles[:12] or "NONE")

s = open(os.path.join(api, "main.js"), encoding="utf8", errors="ignore").read()
reqs = set(re.findall(r'__webpack_require__\(\s*["\']([^"\']+)["\']', s))
bare = {r for r in reqs if not r.startswith(".") and not r.startswith("node:") and "/" not in r}
print("\nBARE module requires in main.js:", len(bare))
print(sorted(bare))

print("\n--- secret scan ---")
pats = ["sk-", "rdr_", "ghp_", "xai-", "vllm", "Bearer", "api_key", "apikey", "JWT_SECRET", "qwen"]
for root in ["dist/apps/api", "dist/apps/gauzy"]:
    hits = {}
    for d, dirs, files in os.walk(os.path.join(base, root)):
        for f in files:
            p = os.path.join(d, f)
            try:
                if os.path.getsize(p) > 20_000_000:
                    continue
                data = open(p, "rb").read().decode("utf8", "ignore")
                for pat in pats:
                    if pat in data:
                        hits.setdefault(pat, []).append(os.path.relpath(p, base))
            except Exception:
                pass
    if hits:
        for pat, files in hits.items():
            print(root, "::", repr(pat), "in", len(files), "files:", files[:4])
    else:
        print(root, ":: clean")

pj = json.load(open(os.path.join(base, "package.json")))
print("\nworkspaces:", pj.get("workspaces"))
deps = pj.get("dependencies", {})
print("root native deps:", [d for d in deps if d in ("better-sqlite3", "argon2", "sqlite3", "sharp", "canvas")])
