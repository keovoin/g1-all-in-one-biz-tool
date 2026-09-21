// rebrand_gauzy.js — replace user-visible "Gauzy" brand strings in BUILT artifacts
// (phrase-exact map; identifiers like GauzyApiClient / gauzy_* / @gauzy/* are untouched)
const fs = require('fs');
const path = require('path');
const ROOT = 'C:/Users/KEOVOIN-DESKTOP/g1-all-in-one-biz-tool';

const MAP = [
  // AI chat: system prompt + tool descriptions
  ['You are the Ever Gauzy assistant — an AI agent embedded in the Gauzy Open Business Management Platform',
   'You are the Sastra assistant — an AI agent embedded in the Sastra Open Business Management Platform'],
  ['using the gauzy_* tools', 'using the built-in platform tools'],
  ['List the Gauzy platform pages', 'List the Sastra platform pages'],
  ['Open a Gauzy platform page', 'Open a Sastra platform page'],
  ['Gauzy API ', 'Sastra API '],
  // email templates / sender identity
  ['Gauzy Web Site', 'Sastra Web Site'],
  ['Gauzy Platform(open-source)', 'Sastra Platform'],
  ['Gauzy Project', 'Sastra Project'],
  ['Gauzy Team', 'Sastra Team'],
  // web UI copy
  ['is requesting access to your Ever Gauzy account.', 'is requesting access to your Sastra account.'],
  ['own to Gauzy and pick your own mailbox name', 'own to Sastra and pick your own mailbox name'],
  ['The Gauzy backend builds its own system prompt', 'The Sastra backend builds its own system prompt'],
  ['Annex: Ever Gauzy', 'Annex: Sastra'],
  ['File is required for Gauzy Source.', 'File is required for Sastra Source.'],
  ['Ever Gauzy', 'Sastra Digital Innovation'],
  // desktop app names (Electron bundle labels baked into web env)
  ['Gauzy Desktop Timer', 'Sastra Desktop Timer'],
  ['Gauzy Desktop', 'Sastra Desktop'],
  ['Gauzy API Server', 'Sastra API Server'],
  ['Gauzy Server', 'Sastra Server'],
  ['Gauzy Agent', 'Sastra Agent'],
  ['Gauzy AI', 'Sastra AI'],
  // bare quoted label ("Gauzy" / 'Gauzy' / `Gauzy`)
  ['"Gauzy"', '"Sastra"'],
  ["'Gauzy'", "'Sastra'"],
];

function patchFile(p) {
  let s = fs.readFileSync(p, 'utf8');
  if (!s.includes('Gauzy')) return 0;
  const before = s;
  let n = 0;
  for (const [from, to] of MAP) {
    const c = s.split(from).length - 1;
    if (c) { s = s.split(from).join(to); n += c; }
  }
  if (s !== before) fs.writeFileSync(p, s);
  return n;
}

let total = 0, filesChanged = 0;
const targets = [];
// web chunks (flat)
const web = path.join(ROOT, 'dist/apps/gauzy');
for (const f of fs.readdirSync(web)) {
  if (/\.(js|html|json|css)$/.test(f)) targets.push(path.join(web, f));
}
// api compiled @gauzy packages (js only, no .map)
function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith('.js')) targets.push(p);
  }
}
walk(path.join(ROOT, 'dist/apps/api/node_modules/@gauzy'));

const report = [];
for (const t of targets) {
  const n = patchFile(t);
  if (n) { report.push([path.relative(ROOT, t), n]); total += n; filesChanged++; }
}
for (const [f, n] of report) console.log(`  ${n}x ${f}`);
console.log('TOTAL replacements:', total, 'in', filesChanged, 'files');
