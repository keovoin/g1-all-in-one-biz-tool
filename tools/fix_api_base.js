// fix_api_base.js — correct the double-prefix API base in built web dist
// Root cause: patch_dist_local replaced "http://localhost:3000" -> "/api" in the
// baked environment. The bundle's interceptor does `API_BASE_URL + url` for any url
// starting with "/api", producing "/api/api/..." (404). For a same-origin deployment
// (web + /api proxy on one host) the base must be "".
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '../dist/apps/gauzy');
const FROM = 'let e="/api",i="http://localhost:4200"';
const TO = 'let e="",i=location.origin';
let hits = 0;
for (const f of fs.readdirSync(ROOT).filter(x => x.endsWith('.js'))) {
  const p = path.join(ROOT, f);
  const s = fs.readFileSync(p, 'utf8');
  if (s.includes(FROM)) {
    fs.writeFileSync(p, s.split(FROM).join(TO));
    hits++;
    console.log('fixed:', f);
  }
}
if (!hits) {
  // fallback: search any chunk still carrying the localhost:4200 base default
  for (const f of fs.readdirSync(ROOT).filter(x => x.endsWith('.js'))) {
    const s = fs.readFileSync(path.join(ROOT, f), 'utf8');
    const i = s.indexOf('let e="/api"');
    if (i >= 0) console.log('NOTE pattern variant in', f, ':', s.slice(i, i + 60));
  }
}
console.log('files changed:', hits);
