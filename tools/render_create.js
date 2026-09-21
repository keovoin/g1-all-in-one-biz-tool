#!/usr/bin/env node
// render_create.js — create the Sastra Solution web service from the render-deploy branch
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const TOKEN = fs.readFileSync(path.join(process.env.USERPROFILE, 'render_token.txt'), 'utf8').trim();
const H = { Authorization: 'Bearer ' + TOKEN, 'Content-Type': 'application/json', Accept: 'application/json' };

// pull real AI key + base URL from the working-tree .env.local (never printed)
const envTxt = fs.readFileSync(path.join(process.env.USERPROFILE, 'g1-all-in-one-biz-tool', '.env.local'), 'utf8');
const get = (k) => (envTxt.match(new RegExp('^' + k + '=(.*)$', 'm')) || [])[1] || '';
const OPENAI_BASE = get('OPENAI_COMPATIBLE_BASE_URL');
const OPENAI_KEY = get('OPENAI_COMPATIBLE_API_KEY');
if (!OPENAI_BASE || !OPENAI_KEY) { console.log('MISSING AI env in .env.local'); process.exit(1); }

const rnd = () => crypto.randomBytes(32).toString('hex');

const env = [
  { key: 'NODE_ENV', value: 'production' },
  { key: 'API_HOST', value: '0.0.0.0' },
  { key: 'API_PORT', value: '3000' },
  { key: 'DEMO', value: 'false' },
  { key: 'DB_TYPE', value: 'better-sqlite3' },
  { key: 'DB_ORM', value: 'typeorm' },
  { key: 'DB_LOGGING', value: 'false' },
  { key: 'REDIS_ENABLED', value: 'false' },
  { key: 'JWT_SECRET', value: rnd() },
  { key: 'JWT_REFRESH_TOKEN_SECRET', value: rnd() },
  { key: 'JWT_VERIFICATION_TOKEN_SECRET', value: rnd() },
  { key: 'EXPRESS_SESSION_SECRET', value: rnd() },
  { key: 'JWT_REFRESH_TOKEN_EXPIRATION_TIME', value: '86400' },
  { key: 'OPENAI_COMPATIBLE_BASE_URL', value: OPENAI_BASE },
  { key: 'OPENAI_COMPATIBLE_API_KEY', value: OPENAI_KEY },
  { key: 'GAUZY_AI_CHAT_ENABLED', value: get('GAUZY_AI_CHAT_ENABLED') || 'true' },
  { key: 'GAUZY_AI_CHAT_DEFAULT_PROVIDER', value: get('GAUZY_AI_CHAT_DEFAULT_PROVIDER') || 'openai-compatible' },
  { key: 'GAUZY_AI_CHAT_DEFAULT_MODEL', value: get('GAUZY_AI_CHAT_DEFAULT_MODEL') || 'Qwen3.8-27B' },
  { key: 'TZ', value: 'Asia/Phnom_Penh' }
];

(async () => {
  const body = {
    type: 'web_service',
    name: 'sastra-biz',
    ownerId: 'tea-daf577qd0e5s73as0qq0',
    plan: 'starter',
    region: 'singapore',
    repo: 'https://github.com/keovoin/g1-all-in-one-biz-tool',
    branch: 'render-deploy',
    autoDeploy: 'yes',
    envVars: env,
    serviceDetails: {
      runtime: 'docker',
      envSpecificDetails: { dockerfilePath: 'Dockerfile.render', dockerContext: './' },
      healthCheckPath: '/'
    }
  };
  const r = await fetch('https://api.render.com/v1/services', { method: 'POST', headers: H, body: JSON.stringify(body) });
  const t = await r.text();
  console.log('HTTP', r.status);
  try {
    const j = JSON.parse(t);
    console.log('serviceId:', j.service && j.service.id);
    console.log('url:', j.serviceDetails && j.serviceDetails.url);
    fs.writeFileSync(path.join(process.env.USERPROFILE, 'sastra_render_svc.json'), JSON.stringify(j, null, 2));
  } catch { console.log(t.slice(0, 800)); }
})();
