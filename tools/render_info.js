#!/usr/bin/env node
// render_info.js — /v1 endpoints (base is https://api.render.com/v1)
const fs = require('fs');
const path = require('path');
const TOKEN = fs.readFileSync(path.join(process.env.USERPROFILE || process.env.HOME, 'render_token.txt'), 'utf8').trim();

async function api(method, url, body) {
  const res = await fetch('https://api.render.com/v1' + url, {
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
  const services = await api('GET', '/services');
  console.log('services:', services.status);
  if (Array.isArray(services.json)) {
    for (const s of services.json) console.log('  ', s.name, '| id:', s.id, '| owner:', s.ownerId, '| plan:', (s.envVars || []).length && '', (s.plan || s.serviceDetails || {}).plan || '');
  } else console.log(services.text.slice(0, 400));

  const types = await api('GET', '/instance-types');
  console.log('\ninstance-types:', types.status);
  if (Array.isArray(types.json)) {
    for (const t of types.json) {
      console.log('  ', t.name || t.id, '|', t.planType || '', '| $' + (t.price || '?') + '/mo', '|', t.specifications && t.specifications.memoryInGb + 'GB RAM');
    }
  } else console.log(types.text.slice(0, 800));
})();
