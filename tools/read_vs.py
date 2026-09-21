import os

base = r"C:\Users\KEOVOIN-DESKTOP\g1-all-in-one-biz-tool"

print("########## validate-secrets.js ##########")
vs = os.path.join(base, "dist/apps/api/node_modules/@gauzy/core/src/lib/bootstrap/validate-secrets.js")
print(open(vs, encoding='utf-8', errors='ignore').read()[:6000])
