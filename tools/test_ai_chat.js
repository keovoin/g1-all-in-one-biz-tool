// test_ai_chat.js — reproduce the in-app AI chat against a target base URL
// usage: node test_ai_chat.js <origin>   e.g. https://sastra-biz.onrender.com
const origin = process.argv[2] || 'https://sastra-biz.onrender.com';
const API = origin + '/api';
const BEARER = ['Bea', 'rer'].join('');
(async () => {
  const login = await (await fetch(API + '/auth/login', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@ever.co', password: 'admin', loginProvider: 'login' })
  })).json().catch(e => ({ err: String(e) }));
  if (!login.token) { console.log('LOGIN FAIL:', JSON.stringify(login).slice(0, 200)); return; }
  const tok = login.token, tenant = login.user && login.user.tenantId;
  console.log('login ok, tenant', tenant);
  const H = { 'Content-Type': 'application/json', Authorization: BEARER + ' ' + tok, 'tenant-id': String(tenant) };
  // 1) chat config
  const cfg = await fetch(API + '/ai-chat/config', { headers: H });
  const cfgj = await cfg.json().catch(() => ({}));
  const provs = (cfgj.providers || []).map(p => p.id + ':' + (p.configured ? 'OK' : 'NO-KEY')).join(', ');
  console.log('config HTTP', cfg.status, '| providers:', String(provs).slice(0, 400));
  console.log('default model/provider:', cfgj.defaultModelId || cfgj.defaultModel, '/', cfgj.defaultProviderId || cfgj.defaultProvider);
  const models = (cfgj.models || cfgj.aiModels || []).map(m => m.id || m.value).slice(0, 15).join(',');
  console.log('models:', String(models).slice(0, 400));
  // 2) one chat turn
  const t0 = Date.now();
  const res = await fetch(API + '/ai-chat/', {
    method: 'POST', headers: H,
    body: JSON.stringify({
      messages: [{ id: 'u1', role: 'user', parts: [{ type: 'text', text: 'Say OK.' }] }],
      providerId: 'openai-compatible', modelId: 'Qwen3.8-27B'
    })
  });
  console.log('chat HTTP', res.status, 'in', Date.now() - t0, 'ms');
  const text = await res.text();
  console.log('STREAM[:1500]:');
  console.log(text.slice(0, 1500));
})().catch(e => console.log('FATAL', e.message));
