#!/usr/bin/env node
/**
 * verify_agent_task.js — proves the EXACT in-app flow:
 * 1) user asks "create a task ..." in AI chat
 * 2) server streams tool-approval-request (what the UI renders as Approve/Reject)
 * 3) user clicks Approve -> UI re-sends the message with approval: approved=true
 * 4) server executes create_task -> task exists in the DB
 *
 * Run: node tools/verify_agent_task.js "Task title to create"
 */
const path = require('path');
const API = 'http://127.0.0.1:3000/api';
const EMAIL = process.env.SASTRA_EMAIL || 'admin@ever.co';
const PASS = process.env.SASTRA_PASSWORD || 'admin';
const Database = require('better-sqlite3');
const db = new Database(path.join(__dirname, '../apps/api/data/gauzy.sqlite3'), { readonly: true });
const orgId = db.prepare('SELECT uo.organizationId FROM user u JOIN user_organization uo ON uo.userId=u.id WHERE u.email=? AND uo.isActive=1').get(EMAIL).organizationId;
db.close();

let tok, tenantId;

async function sse(path, body) {
  const res = await fetch(API + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${tok}`, 'tenant-id': tenantId },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`POST ${path} -> ${res.status}: ${(await res.text()).slice(0, 300)}`);
  const text = await res.text();
  const out = [];
  for (const line of text.split('\n')) {
    if (line.startsWith('data: ')) {
      let j; try { j = JSON.parse(line.slice(6)); } catch { continue; }
      out.push(j);
    }
  }
  return out;
}

(async () => {
  const title = process.argv[2] || 'VERIFIED IN-APP FLOW TEST - safe to delete';
  const login = await (await fetch(API + '/auth/login', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: EMAIL, password: PASS, loginProvider: 'login' }),
  })).json();
  tok = login.token; tenantId = login.user.tenantId;

  console.log('STEP 1: user types "Create a task: ' + title + '" in the AI chat');
  const ev1 = await sse('/ai-chat/', {
    messages: [{ id: 'u1', role: 'user', parts: [{ type: 'text', text: `Create a task titled "${title}", status open.` }] }],
    providerId: 'openai-compatible', modelId: 'Qwen3.8-27B',
  });
  const ap = ev1.find(e => e.type === 'tool-approval-request');
  const ta = ev1.find(e => e.type === 'tool-input-available');
  if (!ap || !ta) { console.log('✗ no approval request in stream:', JSON.stringify(ev1.map(e => e.type))); process.exit(1); }
  console.log('STEP 2: server asks for approval (UI shows Approve/Reject)   approvalId=' + ap.approvalId);

  console.log('STEP 3: user clicks APPROVE (UI re-sends with approval: approved=true)');
  const ev2 = await sse('/ai-chat/', {
    messages: [
      { id: 'u1', role: 'user', parts: [{ type: 'text', text: `Create a task titled "${title}", status open.` }] },
      {
        id: 'a1', role: 'assistant',
        parts: [{
          type: 'tool-create_task', toolName: 'create_task', toolCallId: ta.toolCallId,
          state: 'approval-responded', input: ta.input,
          approval: { id: ap.approvalId, approved: true },
        }],
      },
    ],
    providerId: 'openai-compatible', modelId: 'Qwen3.8-27B',
  });
  const tr = ev2.find(e => e.type === 'tool-output-available' || e.type === 'tool-result');
  const fin = ev2.find(e => e.type === 'finish');
  console.log('STEP 4: tool executed ->', tr ? JSON.stringify(tr.output ?? tr).slice(0, 220) : '(events: ' + ev2.map(e => e.type).join(',') + ')');
  console.log('        stream finished, reason =', fin && fin.finishReason);

  console.log('STEP 5: verify task exists in the DB');
  const r = await (await fetch(API + '/tasks/pagination?take=10&where[organizationId]=' + orgId, {
    headers: { Authorization: `Bearer ${tok}`, 'tenant-id': tenantId },
  })).json();
  const items = r.items || r.data || [];
  const hit = items.find(t => t.title === title);
  if (hit) console.log(`VERIFIED: task #${hit.number} "${hit.title}" [${hit.status}] exists (id ${hit.id})`);
  else { console.log('✗ task NOT found. current tasks:'); items.forEach(t => console.log('   #' + t.number, t.title)); process.exit(1); }
})().catch(e => { console.error('✗', e.message); process.exit(1); });
