
### 2026-09-19 — AI agent + Telegram task bridge
- Confirmed in-app AI agent tools: `create_task`/`start_timer`/`stop_timer` (approval-gated) + read tools (tasks, projects, employees, contacts, invoices, expenses, incomes, time-off). Proven live: agent parsed "due in 3 days"→2026-09-22, emitted `tool-approval-request`; task actually created (Task #1 "AI AGENT SELF-TEST" — still in DB, safe to delete in UI).
- Org scope: agent uses `user.lastOrganizationId` (injected by jwt.strategy.ts:114 per request; DB column null — don't "fix"). Real org for admin: `816d8b0b-2a9e-4eec-b2b6-b95fec79ce22` (from `user_organization` join).
- Built `tools/sastra_task.js` (Node 24, zero-dep): list / projects / search / create / delete. Tested all: created #2 → deleted #2 OK. Gotchas baked in: `/tasks/pagination` + `/organization-projects/pagination` REQUIRE `where[organizationId]`; response shape = `items`; login via seeded admin (SASTRA_EMAIL/PASSWORD override).
- Standing arrangement: user says "create a task X" in Telegram → I run the CLI → report task number.
