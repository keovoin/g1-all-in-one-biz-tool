import os, re, json

base = r"C:\Users\KEOVOIN-DESKTOP\g1-all-in-one-biz-tool"
closure = json.load(open(os.path.join(base, "tools/render_closure.json")))
# closure is list of [name, version]
d = {}
for item in closure:
    if isinstance(item, (list, tuple)) and len(item) >= 2:
        d[item[0]] = item[1]
    elif isinstance(item, dict):
        for k, v in item.items():
            d[k] = v
    else:
        d[item] = None

print("closure size:", len(d))
for key in ["better-sqlite3", "bcrypt", "@mikro-orm/better-sqlite", "typescript", "sharp"]:
    print(f"  {key}: {d.get(key)}")

# any @gauzy (local) or file: refs that would break an npm install?
local = [k for k in d if k.startswith("@gauzy/")]
file_refs = [k for k in d if (d.get(k) or "").startswith("file:")]
print("local @gauzy in closure:", local)
print("file: refs:", file_refs)

# write runtime package.json
runtime = {
    "name": "sastra-api-runtime",
    "private": True,
    "version": "1.0.0",
    "description": "Render runtime deps for prebuilt Sastra API (generated)",
    "dependencies": {k: (d[k] if d[k] not in (None, "") else "*") for k in sorted(d)}
}
out = os.path.join(base, "tools/render_runtime_package.json")
json.dump(runtime, open(out, "w"), indent=2)
print("wrote", out, "deps:", len(runtime["dependencies"]))
