import os, re, subprocess

D = r"C:\Users\KEOVOIN-DESKTOP\g1-all-in-one-biz-tool"
NEW = "Sastra Digital Innovation"

# 1) dist sweep (web chunks + index + i18n) — replace 'Sastra Solution' and 'Sastra Solution Group'
hits = 0
for root, dirs, files in os.walk(os.path.join(D, "dist", "apps", "gauzy")):
    dirs[:] = [x for x in dirs if x not in {"node_modules"}]
    for fn in files:
        if not fn.endswith((".js", ".json", ".html", ".css")):
            continue
        p = os.path.join(root, fn)
        try:
            s = open(p, encoding="utf-8").read()
        except (UnicodeDecodeError, OSError):
            continue
        c = s.count("Sastra Solution")
        if c:
            s = s.replace("Sastra Solution Group", NEW).replace("Sastra Solution", NEW)
            open(p, "w", encoding="utf-8").write(s)
            hits += c

# api dist too (email templates etc.)
for root, dirs, files in os.walk(os.path.join(D, "dist", "apps", "api")):
    dirs[:] = []
    for fn in files:
        if not fn.endswith((".js", ".json", ".html", ".md", ".txt", ".eml")):
            continue
        p = os.path.join(root, fn)
        try:
            s = open(p, encoding="utf-8").read()
        except (UnicodeDecodeError, OSError):
            continue
        c = s.count("Sastra Solution")
        if c:
            s = s.replace("Sastra Solution Group", NEW).replace("Sastra Solution", NEW)
            open(p, "w", encoding="utf-8").write(s)
            hits += c

# 2) tools mapping so future rebuilds rebrand to the new name
for t in (r"tools\rebrand_gauzy.js", r"tools\rebrand_source.js"):
    p = os.path.join(D, t)
    s = open(p, encoding="utf-8").read()
    s2 = s.replace("'Sastra Solution'", "'" + NEW + "'")
    if s2 != s:
        open(p, "w", encoding="utf-8").write(s2)

# 3) source sweep (branch render-deploy has the rebranded source; keep it consistent)
src = 0
for root, dirs, files in os.walk(D):
    dirs[:] = [x for x in dirs if x not in {".git", "node_modules", "dist", "shots", "data"}]
    for fn in files:
        if not fn.endswith((".ts", ".html", ".json", ".md", ".scss", ".css")):
            continue
        p = os.path.join(root, fn)
        try:
            s = open(p, encoding="utf-8").read()
        except (UnicodeDecodeError, OSError):
            continue
        if "Sastra Solution" in s and "is part of" not in s.split("Sastra Solution")[0][-200:]:
            s = s.replace("Sastra Solution Group", NEW).replace("Sastra Solution", NEW)
            open(p, "w", encoding="utf-8").write(s)
            src += 1

print("dist replaced:", hits, "| tools updated | source files:", src)
r = subprocess.run(["git", "-C", D, "status", "--porcelain"], capture_output=True, text=True, timeout=60)
print("git dirty files:", len(r.stdout.splitlines()))
