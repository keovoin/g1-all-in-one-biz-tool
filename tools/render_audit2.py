import os, re, json

base = r"C:\Users\KEOVOIN-DESKTOP\g1-all-in-one-biz-tool"
dist_api = os.path.join(base, "dist/apps/api")
dist_nm = os.path.join(dist_api, "node_modules")
closure = {n for (n, v) in json.load(open(os.path.join(base, "tools/render_closure.json")))}

BUILTIN = set(('assert','async_hooks','buffer','child_process','cluster','console','constants','crypto','dgram','dns','domain','events','fs','http','http2','https','inspector','module','net','os','path','perf_hooks','process','punycode','querystring','readline','repl','stream','string_decoder','sys','timers','tls','tty','url','util','v8','vm','wasi','worker_threads','zlib'))

REQ = re.compile(r"""require\(\s*['"]([^'"]+)['"]\s*\)""")
valid = re.compile(r'^(@[a-z0-9][\w.-]*/)?[a-z0-9][\w.-]*$')

missing = {}
scanned = 0
files = []
for root, dirs, fnames in os.walk(dist_api):
    dirs[:] = [d for d in dirs if d not in ('.git',)]
    for f in fnames:
        if f.endswith('.js'):
            files.append(os.path.join(root, f))

for f in files:
    scanned += 1
    try:
        s = open(f, encoding='utf-8', errors='ignore').read()
    except OSError:
        continue
    for m in REQ.finditer(s):
        spec = m.group(1)
        if not valid.match(spec):
            continue
        if spec.split('/')[0] in BUILTIN:
            continue
        name = spec.split('/')[0] if not spec.startswith('@') else '/'.join(spec.split('/')[:2])
        if name in closure:
            continue
        # is it physically in dist node_modules?
        if os.path.isdir(os.path.join(dist_nm, name)):
            continue
        missing[name] = missing.get(name, 0) + 1

print("scanned files:", scanned)
print("closure size:", len(closure))
print("MISSING (referenced, not in closure, not physically present):")
for n, c in sorted(missing.items()):
    print("  ", n, "x", c)
print("total missing names:", len(missing))
