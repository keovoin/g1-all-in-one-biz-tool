import os, re

base = r"C:\Users\KEOVOIN-DESKTOP\g1-all-in-one-biz-tool"
s = open(os.path.join(base, "dist/apps/gauzy/main.37238f23688eaf88.js"), encoding='utf-8', errors='ignore').read()

# The cookie reader i(p) / writer E(p, opts) are exported as {Ri:()=>i, Yj:()=>E} from module 25369.
# Find who imports module 25369 and calls Ri/Yj, and with what cookie names.
print("=== module 25369 import sites ===")
for m in re.finditer(r't\(25369\)', s):
    ctx = s[m.start()-150:m.start()+250]
    print(">>", ctx.replace('\n', ' ')[:380])
    print('---')

# direct call patterns with a string arg
print("=== Ri(\"...\") / Yj(\"...\") calls (cookie names) ===")
for m in re.finditer(r'\b[Rr]i\(\s*["\']([a-zA-Z0-9_-]{1,30})["\']', s):
    print("reader cookie:", m.group(1))
for m in re.finditer(r'\b[Yy]j\(\s*["\']([a-zA-Z0-9_-]{1,30})["\']', s):
    print("writer cookie:", m.group(1))

# Also: how does the app store the auth token? localStorage?
print("=== localStorage keys ===")
names = set(re.findall(r'localStorage\.getItem\(["\']([a-zA-Z0-9_-]{2,40})', s))
names |= set(re.findall(r'localStorage\.setItem\(["\']([a-zA-Z0-9_-]{2,40})', s))
print(sorted(names)[:30])
