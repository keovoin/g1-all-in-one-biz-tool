#!/usr/bin/env node
// render_probe2.js — full-fidelity token + account probe
const fs = require('fs');
const path = require('path');
const TOKEN = fs.readFileSync(path.join(process.env.USERPROFILE, 'render_token.txt'), 'utf8').trim();
const H = { Authorization: 'Bearer ' + TOKEN, Accept: 'application/json', 'User-Agent': 'hermes-deploy' };
const BASE = 'https://api.render.com/v1';
(async () => {
  const eps = ['/user', '/services', '/teams'];
  for (const p of eps) {
    try {
      const r = await fetch(BASE + p, { headers: H });
      const t = await r.text();
      console.log('=== ' + p + ' -> ' + r.status + ' (' + t.length + 'b)');
      console.log(t.slice(0, 1500));
    } catch (e) { console.log(p, 'ERR', e.message); }
  }
})();
