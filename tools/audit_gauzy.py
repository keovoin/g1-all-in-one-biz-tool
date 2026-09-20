#!/usr/bin/env python3
# audit_gauzy.py — enumerate USER-VISIBLE 'Gauzy' string occurrences (vs internal identifiers)
import os, re, json

ROOT = r"C:\Users\KEOVOIN-DESKTOP\g1-all-in-one-biz-tool"

def strings_with(pattern_re, files, label):
    print("=" * 8, label, "=" * 8)
    for f in files:
        try:
            s = open(f, encoding='utf-8', errors='ignore').read()
        except OSError:
            continue
        for m in pattern_re.finditer(s):
            ctx = s[max(0, m.start() - 70):m.end() + 70].replace('\n', ' ')
            print(f"  {os.path.relpath(f, ROOT)}\n    ...{ctx}...")

API = os.path.join(ROOT, "dist/apps/api/node_modules/@gauzy")
files = []
for dirpath, dirnames, filenames in os.walk(API):
    if 'plugin-ai' in dirpath or 'email' in dirpath or 'seeds' in dirpath:
        for fn in filenames:
            if fn.endswith('.js'):
                files.append(os.path.join(dirpath, fn))

pat = re.compile(r"[\"'`][^\"'`\n]{0,200}Gauzy[^\"'`\n]{0,200}[\"'`]")
hits = []
for f in files:
    s = open(f, encoding='utf-8', errors='ignore').read()
    for m in pat.finditer(s):
        frag = m.group(0)
        # skip require/import module strings + internal names
        if '@gauzy/' in frag:
            continue
        hits.append((f, frag))
print(f"quoted string literals containing 'Gauzy' (excluding @gauzy/ imports): {len(hits)}")
seen = set()
for f, frag in hits:
    key = frag[:120]
    if key in seen:
        continue
    seen.add(key)
    print(f"  [{os.path.relpath(f, ROOT)[:80]}]\n    {frag[:200]}")
