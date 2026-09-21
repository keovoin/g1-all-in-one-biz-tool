import os, re

base = r"C:\Users\KEOVOIN-DESKTOP\g1-all-in-one-biz-tool"

# 1) WEB: how is the auth token sent? (Bearer header vs cookie)
web = os.path.join(base, "dist/apps/gauzy/main.37238f23688eaf88.js")
s = open(web, encoding='utf-8', errors='ignore').read()
i = s.find('Authorization')
print("=== web Authorization ctx ===")
print(s[max(0, i - 350):i + 250].replace('\n', ' '))
# cookie write
for m in list(re.finditer(r'document\.cookie\s*=\s*[^;]{0,120}', s))[:5]:
    print(">> cookie write:", m.group(0)[:140])
# token cookie name
for kw in ['"ga"','\'ga\'','accessToken','refreshToken']:
    j = s.find(kw)
    if j >= 0:
        print(">>", kw, "::", s[max(0, j - 100):j + 120].replace('\n', ' ')[:220])

# 2) SEED credential env var names (bundled config)
envjs = os.path.join(base, "dist/apps/api/node_modules/@gauzy/config/src/lib/environments/environment.js")
t = open(envjs, encoding='utf-8', errors='ignore').read()
print("\n=== DEMO_SUPER_ADMIN in environment.js ===")
for m in re.finditer(r'DEMO_SUPER_ADMIN_[A-Z_]+\s*:', t):
    print(">>", t[m.start():m.start() + 160].replace('\n', ' '))

# 3) DB path env var: DB_PATH vs DB_SQLITE_FILE_LOCATION
print("\n=== sqlite path env vars in database.js ===")
db = os.path.join(base, "dist/apps/api/node_modules/@gauzy/config/src/lib/database.js")
d = open(db, encoding='utf-8', errors='ignore').read()
for kw in ['DB_SQLITE_FILE_LOCATION', 'DB_PATH']:
    j = d.find(kw)
    print(">>", kw, "->", d[max(0, j - 120):j + 120].replace('\n', ' ') if j >= 0 else "NOT FOUND")

# 4) API listen port: PORT or API_PORT
main = os.path.join(base, "dist/apps/api/main.js")
mjs = open(main, encoding='utf-8', errors='ignore').read()
print("\n=== main.js listen port ===")
for m in re.finditer(r'\.listen\(([^)]{0,80})\)', mjs):
    print(">>", m.group(0)[:120])
for kw in ['API_PORT', 'process.env.PORT']:
    j = mjs.find(kw)
    print(">>", kw, "->", mjs[max(0, j - 80):j + 80].replace('\n', ' ') if j >= 0 else "NOT FOUND in main.js")

# 5) SERVER_URL / WEB_CLIENT_URL usage in api
print("\n=== SERVER_URL in api bundle ===")
for kw in ['SERVER_URL', 'WEB_CLIENT_URL']:
    j = mjs.find(kw)
    print(">>", kw, "->", mjs[max(0, j - 80):j + 100].replace('\n', ' ') if j >= 0 else "not in main.js")
