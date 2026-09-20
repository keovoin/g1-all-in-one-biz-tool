// scan_gauzy_strings.js — list QUOTED string literals containing 'Gauzy' (case-sensitive)
// in web bundle chunks; identifiers/paths are ignored.
const fs = require('fs');
const path = require('path');
const ROOTS = [
  ['web', 'C:/Users/KEOVOIN-DESKTOP/g1-all-in-one-biz-tool/dist/apps/gauzy'],
];
const pat = /(["'`])((?:[^"'`\\]|\\.){0,150}Gauzy(?:[^"'`\\]|\\.){0,150})\1/g;
for (const [label, root] of ROOTS) {
  const files = fs.readdirSync(root).filter(f => f.endsWith('.js') || f.endsWith('.html') || f.endsWith('.json') || f.endsWith('.css'));
  let total = 0;
  for (const f of files) {
    const s = fs.readFileSync(path.join(root, f), 'utf8');
    let m; const found = [];
    while ((m = pat.exec(s))) {
      if (m[2].includes('@gauzy/') || m[2].startsWith('./')) continue;
      found.push(m[2]);
    }
    if (found.length) {
      console.log(`## ${label}/${f} (${found.length})`);
      for (const x of [...new Set(found)].slice(0, 12)) console.log('   ', JSON.stringify(x).slice(0, 180));
      total += found.length;
    }
  }
  console.log('TOTAL', label, total);
}
