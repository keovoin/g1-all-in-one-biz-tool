import { GauzyApiClient } from './gauzy-api-client';
/**
 * Curated server tools the embedded AI agent uses to call the Gauzy REST API
 * **as the requesting user**.
 *
 * Security model: the {@link GauzyApiClient} passed to {@link buildGauzyTools}
 * is pre-bound to the requesting user's own `Authorization` header, so every
 * call below goes through the exact same guards (RBAC, tenant + organization
 * isolation) as any other API client — these tools grant no extra privilege.
 * Mutating tools (see {@link GAUZY_TOOLS_REQUIRING_APPROVAL}) additionally
 * require explicit user approval, enforced via `toolApproval` in the chat
 * service — never here.
 *
 * Endpoint/param conventions were verified against the API controllers in
 * `packages/core` (mirroring `packages/mcp-server/src/lib/tools/*` where those
 * match the controllers):
 * - `BaseQueryDTO` endpoints (tasks, projects, employees, daily plans,
 *   invoices) take bracketed query params — `where[organizationId]=…`,
 *   `relations[0]=…`, `take`, `skip` — parsed server-side by the `qs`
 *   'extended' query parser (see `app.set('query parser', 'extended')` in
 *   `packages/core/src/lib/bootstrap`). NOTE: Gauzy's `CrudService.paginate`
 *   treats `skip` as a **1-based page number**, not a row offset.
 * - "data-JSON" endpoints (organization contacts, expenses, incomes, time-off
 *   requests) take a single `data` query param holding JSON
 *   `{ findInput, relations }` (parsed by `ParseJsonPipe`).
 * - Timer endpoints take flat query params / JSON bodies (`StartTimerDTO`,
 *   `StopTimerDTO`, `TimerStatusQueryDTO`).
 *
 * Result shaping: list responses are pruned to compact, chat-friendly items
 * (ids, names/titles, statuses, dates, amounts) and capped at the requested
 * `limit` — the model reads these results, so no huge nested relations.
 */
/** Server tool names that must never run without explicit user approval. */
export declare const GAUZY_TOOLS_REQUIRING_APPROVAL: string[];
/** Per-request defaults resolved from the RequestContext by the chat service. */
interface GauzyToolDefaults {
    organizationId?: string;
    tenantId?: string;
    employeeId?: string;
}
/**
 * Build the curated Gauzy server tools for one chat request.
 *
 * @param client   HTTP client pre-bound to the requesting user's Authorization header.
 * @param defaults Organization/tenant/employee defaults from the RequestContext.
 * @returns Tool map suitable for spreading into `streamText({ tools })`.
 */
export declare function buildGauzyTools(client: GauzyApiClient, defaults: GauzyToolDefaults): Promise<Record<string, unknown>>;
export {};
