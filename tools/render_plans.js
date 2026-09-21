#!/usr/bin/env node
// render_plans.js — discover deployable plans + current services via Render API v1
const fs = require('fs');
const path = require('path');
const TOKEN = fs.readFileSync(path.join(process.env.USERPROFILE, 'render_token.txt'), 'utf8').trim();
const H = { Authorization: 'Bearer ' + TOKEN, Accept: 'application/json' };
(async () => {
  // list services we already have
  let r = await fetch('https://api.render.com/v1/services?limit=100', { headers: H });
  let t = await r.json();
  console.log('SERVICES:', r.status);
  for (const s of (t.services || [])) console.log(' -', s.service.name, s.service.id, s.service.type);

  // clouds/projects (need ownerId for create)
  r = await fetch('https://api.render.com/v1/clouds', { headers: H });
  t = await r.json();
  console.log('CLOUDS:', r.status, JSON.stringify(t).slice(0, 400));

  // plans endpoint
  r = await fetch('https://api.render.com/v1/plans', { headers: H });
  console.log('PLANS HTTP', r.status);
  const body = await r.text();
  try { const j = JSON.parse(body); console.log(JSON.stringify(j, null, 1).slice(0, 3000)); } catch { console.log(body.slice(0, 500)); }
})();
