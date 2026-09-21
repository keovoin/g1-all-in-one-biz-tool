#!/usr/bin/env bash
# Build the render-deploy branch: commit dist + runtime package + Dockerfile
set -e
cd /c/Users/KEOVOIN-DESKTOP/g1-all-in-one-biz-tool
export PATH="/c/tools/node-v24.11.1-win-x64:$PATH"

echo "== branch =="
git checkout -B render-deploy
echo "== add (force past .gitignore) =="
git add -f --sparse dist package.deploy.json Dockerfile.render apps/api/data/gauzy.sqlite3 2>/dev/null || git add -f dist package.deploy.json Dockerfile.render apps/api/data/gauzy.sqlite3
git add tools/render_entrypoint.sh tools/serve_web_render.js tools/render_runtime_package.json tools/gen_runtime_pkg.py tools/render_closure.json
echo "== index count =="
git diff --cached --name-only | wc -l
echo "== commit =="
git commit -q --no-verify -m "Sastra: render-deploy branch (prebuilt dist + runtime deps + Dockerfile)"
echo "== largest staged files =="
git ls-tree -r -l --name-only HEAD | head -0
git ls-tree -r -l HEAD | sort -k4 -rn | head -8 | awk '{printf "%.1fMB %s\n", $4/1024, $5}'
echo "== done =="
