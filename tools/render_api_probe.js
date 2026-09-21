#!/usr/bin/env node
// render_api_probe.js — discover the API shape + account
const fs = require('fs');
const path = require('path');
const TOKEN = fs.readFileSync(path.join(process.env.USERPROFILE,'render_token.txt'),'utf8').trim();
const H = { Authorization: 'Bearer ' + TOKEN, Accept: 'application/json', 'User-Agent': 'hermes-deploy' };
(async () => {
  const tries = ['/v1/services','/v1/teams','/v1/disk-mappings','/v1/instances?environmentType=starter'];
  for (const p of tries) {
    try {
      const r = await fetch('https://api.render.com' + p, { headers: H });
      const t = await r.text();
      console.log('=== ' + p + ' -> ' + r.status + ' (' + t.length + 'b)');
      if (r.status === 200) console.log(t.slice(0, 1200));
      else if (t) console.log(t.slice(0, 300));
    } catch (e) { console.log(p, 'ERR', e.message); }
  }
})();
