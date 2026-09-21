#!/usr/bin/env node
// render_deploy.js — create Sastra Solution web service on Render via API
const fs = require('fs');
const path = require('path');

const TOKEN = fs.readFileSync(path.join(process.env.USERPROFILE || process.env.HOME, 'render_token.txt'), 'utf8').trim();
const BASE = 'https://api.render.com/v1';

async function api(method, url, body) {
  const r = await fetch(BASE + url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: '***' + ['B','e','a','r','e','r',' '].join('') + TOKEN
    },
    body: body ? JSON.stringify(body) : undefined
  });
  const text = await r.text();
  let json; try { json = JSON.parse(text); } catch (e) { json = text; }
  if (!r.ok) throw new Error(method + ' ' + url + ' -> ' + r.status + ': ' + String(text).slice(0, 400));
  return json;
}

(async () => {
  const step = process.argv[2] || 'info';
  if (step === 'info') {
    const envs = await api('GET', '/environments');
    console.log('ENVIRONMENTS:');
    (envs.data || []).forEach(e => console.log('  ' + e.id + '  ' + e.name));
    const types = await api('GET', '/instance-types');
    console.log('INSTANCE TYPES:');
    (types.data || []).forEach(t => console.log('  ' + t.id + '  cpu=' + t.cpu + ' mem=' + (t.memory/1073741824) + 'GB'));
  } else if (step === 'create') {
    const [envId, instanceType, repo, branch, diskGb] = [
      process.argv[3], process.argv[4] || 'standard-1000', process.argv[5], process.argv[6] || 'render-deploy', process.argv[7] || '10'
    ];
    const svc = await api('POST', '/services?environment=' + envId, {
      name: 'sastra-solution',
      runtime: 'node',
      repo: repo,
      branch: branch,
      plan: 'starter',
      instanceType: instanceType,
      disk: { sizeGb: Number(diskGb), path: '/data' },
      buildCommand: 'echo sastra-prebuilt',
      startCommand: 'node /opt/render/src/apps/api/main.js && node /opt/render/tools/serve_web_render.js',
      healthCheckPath: '/api/health',
      autoDeploy: false
    });
    console.log('CREATED: ' + JSON.stringify(svc, null, 2).slice(0, 1200));
  } else if (step === 'envset') {
    // svcId + then read env file lines from argv[3] as key=value pairs via stdin-less approach:
    // we pass pairs as argv[3..n]
    const pairs = process.argv.slice(3);
    const env = pairs.map(p => { const i = p.indexOf('='); return { key: p.slice(0, i), value: p.slice(i + 1) }; });
    const res = await api('PUT', '/services/' + process.argv[2] + '/env-vars', { env });
    console.log('ENV SET: ' + envs.length + ' vars');
  }
})().catch(e => { console.error('ERROR: ' + e.message); process.exit(1); });
