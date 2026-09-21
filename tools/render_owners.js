#!/usr/bin/env node
// render_owners.js — get owner id + check existing service names
const fs = require('fs');
const path = require('path');
const TOKEN = fs.readFileSync(path.join(process.env.USERPROFILE, 'render_token.txt'), 'utf8').trim();
const H = { Authorization: 'Bearer ' + TOKEN, Accept: 'application/json' };
(async () => {
  let r = await fetch('https://api.render.com/v1/owners', { headers: H });
  const j = await r.json();
  console.log('OWNERS:', r.status);
  for (const o of j) console.log(' -', o.id, o.type, o.name);
  r = await fetch('https://api.render.com/v1/services?limit=100', { headers: H });
  const s = await r.json();
  console.log('SERVICES:', r.status, Array.isArray(s) ? s.length : JSON.stringify(s).slice(0,200));
  if (Array.isArray(s)) for (const it of s) console.log(' *', it.service && it.service.name, it.service && it.service.id);
})();
