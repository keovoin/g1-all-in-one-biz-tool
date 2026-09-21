#!/usr/bin/env node
// render_instances.js — list instance types per environment (real pricing)
const fs = require('fs');
const path = require('path');
const TOKEN = fs.readFileSync(path.join(process.env.USERPROFILE, 'render_token.txt'), 'utf8').trim();
const H = { Authorization: 'Bearer ' + TOKEN, Accept: 'application/json' };
(async () => {
  for (const env of ['free', 'starter', 'standard']) {
    try {
      const r = await fetch('https://api.render.com/v1/instances?environmentType=' + env, { headers: H });
      const t = await r.text();
      console.log('=== ' + env + ' -> ' + r.status + ' (' + t.length + 'b)');
      console.log(t.slice(0, 2500));
    } catch (e) { console.log(env, 'ERR', e.message); }
  }
})();
