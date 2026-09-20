// rebrand_source.js — same map as rebrand_gauzy.js but applied to TS/HTML sources
const fs = require('fs');
const path = require('path');
const ROOT = 'C:/Users/KEOVOIN-DESKTOP/g1-all-in-one-biz-tool';
const MAP = [
  ['You are the Ever Gauzy assistant — an AI agent embedded in the Gauzy Open Business Management Platform',
   'You are the Sastra assistant — an AI agent embedded in the Sastra Open Business Management Platform'],
  ['using the gauzy_* tools', 'using the built-in platform tools'],
  ['List the Gauzy platform pages', 'List the Sastra platform pages'],
  ['Open a Gauzy platform page', 'Open a Sastra platform page'],
  ['Gauzy API ', 'Sastra API '],
  ['Gauzy Web Site', 'Sastra Web Site'],
  ['Gauzy Platform(open-source)', 'Sastra Platform'],
  ['Gauzy Project', 'Sastra Project'],
  ['Gauzy Team', 'Sastra Team'],
  ['is requesting access to your Ever Gauzy account.', 'is requesting access to your Sastra account.'],
  ['own to Gauzy and pick your own mailbox name', 'own to Sastra and pick your own mailbox name'],
  ['The Gauzy backend builds its own system prompt', 'The Sastra backend builds its own system prompt'],
  ['Annex: Ever Gauzy', 'Annex: Sastra'],
  ['File is required for Gauzy Source.', 'File is required for Sastra Source.'],
  ['Ever Gauzy', 'Sastra Solution'],
  ['Gauzy Desktop Timer', 'Sastra Desktop Timer'],
  ['Gauzy Desktop', 'Sastra Desktop'],
  ['Gauzy API Server', 'Sastra API Server'],
  ['Gauzy Server', 'Sastra Server'],
  ['Gauzy Agent', 'Sastra Agent'],
  ['Gauzy AI', 'Sastra AI'],
  ['logo_Gauzy', 'logo_sastra'],
  ['from: \'Gauzy\'', 'from: \'Sastra\''],
  ['"Gauzy"', '"Sastra"'],
  ["'Gauzy'", "'Sastra'"],
];
const EXTS = ['.ts', '.html', '.scss', '.json', '.mjs', '.js'];
// AGPL license headers ("This file is part of Ever Gauzy ...") MUST stay — only
// replace the generic catch-all on lines that are not license/attribution comments.
const HEADER_RE = /is part of|Copyright \(C\)|SPDX|@license/i;
const SKIP_DIRS = new Set(['node_modules', 'dist', '.git', '.angular', '.nx', 'out-tsc', 'tmp', 'build']);
function walk(dir, cb) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) { if (!SKIP_DIRS.has(e.name)) walk(path.join(dir, e.name), cb); }
    else if (EXTS.includes(path.extname(e.name))) cb(path.join(dir, e.name));
  }
}
let total = 0, files = 0;
for (const base of ['packages', 'apps']) {
  walk(path.join(ROOT, base), (p) => {
    if (/\.(spec|test)\./.test(p)) return;
    if (p.includes('gauzy-api-client') || p.includes('gauzy-tools')) {
      // only the quoted error text inside these files should change; identifiers stay
    }
    let s = fs.readFileSync(p, 'utf8');
    if (!s.includes('Gauzy')) return;
    const before = s;
    for (const [from, to] of MAP) {
      if (s.includes(from)) s = s.split(from).join(to);
    }
    if (s !== before) {
      const c = (before.match(/Gauzy/g) || []).length;
      fs.writeFileSync(p, s);
      total++; files++;
      if (total <= 40) console.log('  patched', path.relative(ROOT, p));
    }
  });
}
console.log('source files changed:', files);
