#!/usr/bin/env node
/**
 * sastra_task.js — Sastra Solution task CLI (Telegram bridge)
 *
 * Usage (Node 24 required — no deps, uses global fetch):
 *   node tools/sastra_task.js list
 *   node tools/sastra_task.js projects
 *   node tools/sastra_task.js search <text>
 *   node tools/sastra_task.js create <title> [--project "Name"] [--priority high|urgent|medium|low]
 *                                   [--due 2026-09-25 | tomorrow | today | "in N days"]
 *                                   [--desc "..."]
 *   node tools/sastra_task.js delete <task-id | #N>
 *
 * Auth: logs in against the local API (127.0.0.1:3000) with the seeded
 * admin credentials (overridable via SASTRA_EMAIL / SASTRA_PASSWORD).
 * Org id: auto-detected from the local sqlite file, cached in
 * tools/sastra_task.config.json (override with SASTRA_ORG_ID).
 */
const fs = require('fs');
const path = require('path');

const REPO = path.resolve(__dirname, '..');
const API = process.env.SASTRA_API || 'http://127.0.0.1:3000/api';
const CONFIG = path.join(__dirname, 'sastra_task.config.json');

function loadDotEnv() {
  const p = path.join(REPO, '.env.local');
  if (!fs.existsSync(p)) return;
  for (const line of fs.readFileSync(p, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (m && !(m[1] in process.env)) {
      process.env[m[1]] = m[2].trim().replace(/^["']|["']$/g, '');
    }
  }
}
loadDotEnv();

const EMAIL = process.env.SASTRA_EMAIL || 'admin@ever.co';
const PASSWORD = process.env.SASTRA_PASSWORD || 'admin';

async function login() {
  const res = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD, loginProvider: 'login' }),
  });
  if (!res.ok) throw new Error(`login failed: ${res.status} ${await res.text()}`);
  const j = await res.json();
  return { token: j.token, tenantId: j.user.tenantId };
}

function orgIdFromDb() {
  try {
    const Database = require('better-sqlite3');
    const db = new Database(path.join(REPO, 'apps/api/data/gauzy.sqlite3'), { readonly: true });
    const row = db.prepare(`
      SELECT uo.organizationId FROM user u
      JOIN user_organization uo ON uo.userId = u.id
      WHERE u.email = ? AND uo.isActive = 1 LIMIT 1
    `).get(EMAIL);
    db.close();
    return row ? row.organizationId : null;
  } catch {
    return null;
  }
}

function getOrgId() {
  if (process.env.SASTRA_ORG_ID) return process.env.SASTRA_ORG_ID;
  try {
    const c = JSON.parse(fs.readFileSync(CONFIG, 'utf8'));
    if (c.orgId) return c.orgId;
  } catch {}
  const id = orgIdFromDb();
  if (id) fs.writeFileSync(CONFIG, JSON.stringify({ orgId: id }, null, 1));
  return id;
}

async function api(method, url, token, tenantId, body) {
  const res = await fetch(`${API}${url}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      'tenant-id': tenantId,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let j = null;
  try { j = JSON.parse(text); } catch {}
  if (!res.ok) throw new Error(`${method} ${url} -> ${res.status}: ${text.slice(0, 300)}`);
  return j;
}

function parseDue(s) {
  if (!s) return undefined;
  const d = new Date();
  const m = s.match(/^in (\d+) days?$/i);
  if (m) { d.setDate(d.getDate() + parseInt(m[1], 10)); return d.toISOString().slice(0, 10); }
  if (/^today$/i.test(s)) return d.toISOString().slice(0, 10);
  if (/^tomorrow$/i.test(s)) { d.setDate(d.getDate() + 1); return d.toISOString().slice(0, 10); }
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  const t = new Date(s);
  if (!isNaN(t)) return t.toISOString().slice(0, 10);
  throw new Error(`unparseable due date: ${s} (use YYYY-MM-DD, today, tomorrow, "in N days")`);
}

function prj(t) {
  return t.project ? ` [${t.project.name}]` : '';
}

function itemsOf(r) {
  return r.data || r.items || (Array.isArray(r) ? r : []);
}

async function main() {
  const [, , cmd, ...args] = process.argv;
  const { token, tenantId } = await login();

  if (cmd === 'create') {
    const opts = { title: null, project: null, priority: null, due: null, desc: null };
    let i = 0;
    while (i < args.length) {
      const a = args[i];
      if (a === '--project') opts.project = args[++i];
      else if (a === '--priority') opts.priority = args[++i];
      else if (a === '--due') opts.due = args[++i];
      else if (a === '--desc') opts.desc = args[++i];
      else if (!opts.title) opts.title = a;
      else throw new Error(`unexpected arg: ${a}`);
      i++;
    }
    if (!opts.title) throw new Error('usage: create <title> [--project X] [--priority high] [--due ...] [--desc ...]');

    let projectId;
    if (opts.project) {
      const orgId2 = getOrgId();
      const pj = await api('GET', `/organization-projects/pagination?take=25&where[organizationId]=${orgId2}`, token, tenantId);
      const hits = itemsOf(pj).filter(p => p.name.toLowerCase().includes(opts.project.toLowerCase()));
      if (!hits.length) {
        const all = itemsOf(pj).map(p => p.name).join(', ');
        throw new Error(`no project matching "${opts.project}". Available: ${all || '(none — create it in the UI first)'}`);
      }
      projectId = hits[0].id;
    }

    const orgId = getOrgId();
    if (!orgId) throw new Error('could not auto-detect org id (set SASTRA_ORG_ID)');

    const created = await api('POST', '/tasks', token, tenantId, {
      title: opts.title,
      ...(opts.desc ? { description: opts.desc } : {}),
      ...(projectId ? { projectId } : {}),
      ...(opts.priority ? { priority: opts.priority } : {}),
      ...(parseDue(opts.due) ? { dueDate: parseDue(opts.due) } : {}),
      status: 'open',
      organizationId: orgId,
    });
    console.log(`✓ TASK #${created.number} created`);
    console.log(`  id:    ${created.id}`);
    console.log(`  title: ${created.title}`);
    if (projectId) console.log(`  proj:  ${opts.project}`);
    if (opts.priority) console.log(`  prio:  ${opts.priority}`);
    if (created.dueDate) console.log(`  due:   ${String(created.dueDate).slice(0, 10)}`);
    return;
  }

  if (cmd === 'list' || cmd === 'search' || cmd === 'projects') {
    if (cmd === 'projects') {
      const orgId = getOrgId();
      const pj = await api('GET', `/organization-projects/pagination?take=50&where[organizationId]=${orgId}`, token, tenantId);
      const d = itemsOf(pj);
      if (!d.length) console.log('(no projects)');
      for (const p of d) console.log(`- ${p.id}  ${p.name}${p.status ? `  [${p.status}]` : ''}`);
      return;
    }
    const orgId = getOrgId();
    if (!orgId) throw new Error('could not auto-detect org id (set SASTRA_ORG_ID)');
    const q = cmd === 'search' ? `&where[title]=${encodeURIComponent(args.join(' '))}` : '';
    const r = await api('GET', `/tasks/pagination?take=30&where[organizationId]=${orgId}${q}`, token, tenantId);
    const d = itemsOf(r);
    if (!d.length) console.log('(no tasks)');
    for (const t of d) {
      const due = t.dueDate ? ` due ${String(t.dueDate).slice(0, 10)}` : '';
      console.log(`- #${t.number}  ${t.title}${prj(t)}  [${t.status}]${t.priority ? ` ${t.priority}` : ''}${due}`);
      console.log(`    id ${t.id}`);
    }
    return;
  }

  if (cmd === 'delete') {
    const sel = args[0];
    if (!sel) throw new Error('usage: delete <task-id | #N>');
    let id = sel;
    if (sel.startsWith('#')) {
      const orgId = getOrgId();
      if (!orgId) throw new Error('could not auto-detect org id (set SASTRA_ORG_ID)');
      const r = await api('GET', `/tasks/pagination?take=100&where[organizationId]=${orgId}`, token, tenantId);
      const hit = itemsOf(r).find(t => String(t.number) === sel.slice(1));
      if (!hit) throw new Error(`task #${sel.slice(1)} not found`);
      id = hit.id;
    }
    await api('DELETE', `/tasks/${id}`, token, tenantId);
    console.log(`✓ task deleted: ${id}`);
    return;
  }

  console.log('commands: list | projects | search <text> | create <title> [--project X] [--priority high] [--due ...] [--desc ...] | delete <id|#N>');
}

main().catch(e => { console.error('✗', e.message); process.exit(1); });
