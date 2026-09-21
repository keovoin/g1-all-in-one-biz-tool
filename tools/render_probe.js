#!/usr/bin/env node
// render_probe.js — find correct API endpoints + account ids
const fs = require('fs');
const path = require('path');
const TOKEN = fs.readFileSync(path.join(process.env.USERPROFILE || process.env.HOME, 'render_token.txt'), 'utf8').trim();

async function api(method, url, body) {
  const res = await fetch('https://api.render.com' + url, {
    method,
    headers: { Authorization: 'Bearer ' + TOKEN, 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined
  });
  const text = await res.text();
  let json = null;
  try { json = JSON.parse(text); } catch (e) {}
  return { status: res.status, json, text };
}

(async () => {
  // spec
  const spec = JSON.parse(fs.readFileSync(path.join(process.env.USERPROFILE || process.env.HOME, 'render_openapi.json'), 'utf8'));
  const paths = Object.keys(spec.paths);
  console.log('== relevant paths ==');
  console.log(paths.filter(p => /service|team|instance|disk|environment/i.test(p)).join('\n'));
  console.log('\n== try /services ==');
  const r1 = await api('GET', '/services');
  console.log('GET /services ->', r1.status, r1.text.slice(0, 600));
})();
