// Re-apply local-run patches to dist/apps/gauzy after a fresh build:
// 1) Replace hardcoded http://localhost:3000 with relative /api (works from any origin)
// 2) Report any remaining app.gauzy.co / gauzy.co register links
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '../dist/apps/gauzy');

let totalReplaced = 0;
function patchFile(file) {
  const before = fs.readFileSync(file, 'utf-8');
  const after = before.split('http://localhost:3000').join('/api');
  if (before !== after) {
    const n = before.split('http://localhost:3000').length - 1;
    fs.writeFileSync(file, after);
    totalReplaced += n;
    console.log(`  patched ${n}x: ${path.relative(ROOT, file)}`);
  }
}

const jsFiles = fs.readdirSync(ROOT).filter((f) => f.endsWith('.js'));
console.log('Patching localhost:3000 -> /api ...');
for (const f of jsFiles) patchFile(path.join(ROOT, f));
// main.*.js chunks too
for (const f of fs.readdirSync(ROOT)) {
  if (/^main\..*\.js$/.test(f)) patchFile(path.join(ROOT, f));
}
console.log(`Total replacements: ${totalReplaced}`);

console.log('\nRemaining external gauzy links (register/signup only matter):');
let leaks = 0;
for (const f of jsFiles) {
  const s = fs.readFileSync(path.join(ROOT, f), 'utf-8');
  const m = s.match(/https?:\/\/[a-z0-9./_-]*gauzy[a-z0-9./_-]*/g) || [];
  const reg = m.filter((u) => /register|sign|auth/i.test(u));
  if (reg.length) {
    leaks += reg.length;
    console.log(`  ${f}: ${[...new Set(reg)].join(', ')}`);
  }
}
console.log(leaks ? `REGISTER LEAKS REMAINING: ${leaks}` : 'No register/sign-up links to gauzy remain. OK');
