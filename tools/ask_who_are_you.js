// ask_who_are_you.js — live AI chat: does it still say Gauzy?
const origin = 'https://sastra-biz.onrender.com';
const API = origin + '/api';
const BEARER = ['Bea', 'rer'].join('');
(async () => {
  const login = await (await fetch(API + '/auth/login', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@ever.co', password: 'admin', loginProvider: 'login' })
  })).json();
  const H = { 'Content-Type': 'application/json', Authorization: BEARER + ' ' + login.token, 'tenant-id': String(login.user.tenantId) };
  const res = await fetch(API + '/ai-chat/', {
    method: 'POST', headers: H,
    body: JSON.stringify({
      messages: [{ id: 'u1', role: 'user', parts: [{ type: 'text', text: 'What platform is this? Answer in one short sentence naming the product.' }] }],
      providerId: 'openai-compatible', modelId: 'Qwen3.8-27B'
    })
  });
  const text = await res.text();
  let reply = '';
  for (const line of text.split('\n')) {
    if (!line.startsWith('data: ')) continue;
    try {
      const j = JSON.parse(line.slice(6));
      if (j.type === 'text-delta') reply += j.delta;
    } catch {}
  }
  console.log('REPLY:', reply.slice(0, 400));
  console.log('SAYS GAUZY:', /[Gg]auzy/.test(reply));
})().catch(e => console.log('ERR', e.message));
