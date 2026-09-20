"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GAUZY_TOOLS_REQUIRING_APPROVAL = void 0;
exports.buildGauzyTools = buildGauzyTools;
const common_1 = require("@nestjs/common");
const zod_1 = require("zod");
const esm_loader_1 = require("../esm-loader");
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
exports.GAUZY_TOOLS_REQUIRING_APPROVAL = ['create_task', 'start_timer', 'stop_timer'];
const logger = new common_1.Logger('AiChatGauzyTools');
/** Max items ever returned to the model from a list tool. */
const MAX_LIMIT = 50;
const DEFAULT_LIMIT = 10;
/* ------------------------------------------------------------------ */
/* Shared zod fragments                                               */
/* ------------------------------------------------------------------ */
const PageSchema = zod_1.z.number().int().min(1).optional().describe('Page number for pagination (1-based, default 1)');
const LimitSchema = zod_1.z
    .number()
    .int()
    .min(1)
    .max(MAX_LIMIT)
    .optional()
    .describe(`Number of items per page (default ${DEFAULT_LIMIT}, max ${MAX_LIMIT})`);
const RelationsSchema = zod_1.z
    .array(zod_1.z.string())
    .optional()
    .describe('Extra relations to include (rarely needed — sensible defaults are applied)');
const TaskStatusSchema = zod_1.z
    .enum(['backlog', 'open', 'in-progress', 'ready-for-review', 'in-review', 'blocked', 'done', 'completed', 'cancelled'])
    .optional()
    .describe('Filter by task status');
const TaskPrioritySchema = zod_1.z
    .enum(['urgent', 'high', 'medium', 'low'])
    .optional()
    .describe('Filter by task priority');
const TaskSizeSchema = zod_1.z
    .enum(['x-large', 'large', 'medium', 'small', 'tiny'])
    .optional()
    .describe('Task size');
const TimerSourceSchema = zod_1.z
    .enum(['BROWSER', 'DESKTOP', 'MOBILE', 'UPWORK', 'HUBSTAFF', 'TEAMS', 'BROWSER_EXTENSION', 'CLOC'])
    .optional()
    .describe("Source of the timer (default 'BROWSER')");
/* ------------------------------------------------------------------ */
/* Helpers                                                            */
/* ------------------------------------------------------------------ */
/**
 * Merge the request defaults into an organization/tenant scope object —
 * same pattern as the MCP tools' `authManager.getDefaultParams()` merge.
 * Throws when no organization is available (caught by `runTool`).
 */
function requireScope(defaults) {
    if (!defaults.organizationId) {
        throw new Error('Organization ID not available. Please ensure you are logged in and have an organization.');
    }
    return {
        organizationId: defaults.organizationId,
        ...(defaults.tenantId ? { tenantId: defaults.tenantId } : {})
    };
}
/** `'user.name'` → `'where[user][name]'` (qs 'extended' bracket syntax). */
function toWhereKey(path) {
    return 'where' + path.split('.').map((part) => `[${part}]`).join('');
}
/**
 * Build a flat query record for `BaseQueryDTO`-style endpoints using
 * bracketed keys (`where[...]`, `relations[N]`) so the API's qs 'extended'
 * parser reconstructs the nested objects/arrays server-side.
 */
function buildBaseQuery(where, options = {}) {
    const query = {};
    for (const [path, value] of Object.entries(where)) {
        if (value === undefined || value === null || value === '')
            continue;
        query[toWhereKey(path)] = value;
    }
    (options.relations ?? []).forEach((relation, index) => {
        query[`relations[${index}]`] = relation;
    });
    if (options.take !== undefined) {
        query['take'] = options.take;
    }
    if (options.page !== undefined) {
        // Gauzy's CrudService.paginate computes the row offset as
        // take * (skip - 1) — i.e. `skip` is a 1-based page number.
        query['skip'] = options.page;
    }
    return query;
}
/** Clamp the model-provided limit into [1, MAX_LIMIT]. */
function clampLimit(limit) {
    return Math.max(1, Math.min(limit ?? DEFAULT_LIMIT, MAX_LIMIT));
}
/** Drop undefined/null/empty-array values so tool results stay compact. */
function compact(record) {
    const result = {};
    for (const [key, value] of Object.entries(record)) {
        if (value === undefined || value === null)
            continue;
        if (Array.isArray(value) && value.length === 0)
            continue;
        result[key] = value;
    }
    return result;
}
/** Display name for an employee/user-shaped entity. */
function personName(entity) {
    if (!entity)
        return undefined;
    const user = entity.user ?? entity;
    const name = user.name || [user.firstName, user.lastName].filter(Boolean).join(' ');
    return name || user.email || undefined;
}
/** Normalize an API list response (`{ items, total }` or bare array). */
function asList(response) {
    if (Array.isArray(response))
        return { items: response };
    if (response && Array.isArray(response.items))
        return { items: response.items, total: response.total };
    return { items: response ? [response] : [] };
}
/** Prune a list response to `limit` chat-friendly items plus a total. */
function pruneList(response, limit, prune) {
    const { items, total } = asList(response);
    return {
        total: typeof total === 'number' ? total : items.length,
        items: items.slice(0, limit).map(prune)
    };
}
/**
 * Run a tool body, converting any failure into a `{ error }` result the
 * model can read and recover from (tools must not throw into the stream).
 */
async function runTool(name, fn) {
    try {
        return await fn();
    }
    catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        logger.warn(`Tool ${name} failed: ${message}`);
        return { error: message };
    }
}
/* ------------------------------------------------------------------ */
/* Result pruners                                                     */
/* ------------------------------------------------------------------ */
const pruneTask = (task) => compact({
    id: task.id,
    number: task.taskNumber ?? task.number,
    title: task.title,
    status: task.status,
    priority: task.priority,
    size: task.size,
    issueType: task.issueType,
    dueDate: task.dueDate,
    estimate: task.estimate,
    projectId: task.projectId,
    project: task.project?.name,
    members: Array.isArray(task.members) ? task.members.map(personName).filter(Boolean) : undefined
});
const pruneProject = (project) => compact({
    id: project.id,
    name: project.name,
    code: project.code,
    billing: project.billing,
    currency: project.currency,
    budget: project.budget,
    startDate: project.startDate,
    endDate: project.endDate,
    membersCount: Array.isArray(project.members) ? project.members.length : undefined
});
const pruneEmployee = (employee) => compact({
    id: employee.id,
    name: personName(employee),
    email: employee.user?.email,
    isActive: employee.isActive,
    isTrackingEnabled: employee.isTrackingEnabled,
    startedWorkOn: employee.startedWorkOn
});
const pruneContact = (contact) => compact({
    id: contact.id,
    name: contact.name,
    contactType: contact.contactType,
    primaryEmail: contact.primaryEmail,
    primaryPhone: contact.primaryPhone
});
const pruneDailyPlan = (plan) => compact({
    id: plan.id,
    date: plan.date,
    status: plan.status,
    workTimePlanned: plan.workTimePlanned,
    tasks: Array.isArray(plan.tasks)
        ? plan.tasks.map((task) => compact({ id: task.id, title: task.title, status: task.status }))
        : undefined
});
const pruneTimeLog = (log) => compact({
    id: log.id,
    startedAt: log.startedAt,
    stoppedAt: log.stoppedAt,
    duration: log.duration,
    isRunning: log.isRunning,
    isBillable: log.isBillable,
    description: log.description,
    taskId: log.taskId,
    task: log.task?.title,
    projectId: log.projectId,
    project: log.project?.name,
    source: log.source
});
const pruneInvoice = (invoice) => compact({
    id: invoice.id,
    invoiceNumber: invoice.invoiceNumber,
    invoiceDate: invoice.invoiceDate,
    dueDate: invoice.dueDate,
    status: invoice.status,
    paid: invoice.paid,
    currency: invoice.currency,
    totalValue: invoice.totalValue,
    contact: invoice.toContact?.name
});
const pruneExpense = (expense) => compact({
    id: expense.id,
    amount: expense.amount,
    currency: expense.currency,
    valueDate: expense.valueDate,
    category: expense.category?.name,
    purpose: expense.purpose,
    notes: expense.notes,
    vendor: expense.vendor?.name,
    project: expense.project?.name,
    employee: personName(expense.employee)
});
const pruneIncome = (income) => compact({
    id: income.id,
    amount: income.amount,
    currency: income.currency,
    valueDate: income.valueDate,
    notes: income.notes,
    isBonus: income.isBonus,
    client: income.client?.name,
    employee: personName(income.employee)
});
const pruneTimeOff = (request) => compact({
    id: request.id,
    status: request.status,
    description: request.description,
    startDate: request.start ?? request.startDate,
    endDate: request.end ?? request.endDate,
    requestDate: request.requestDate,
    isHoliday: request.isHoliday,
    policy: request.policy?.name,
    employees: Array.isArray(request.employees) ? request.employees.map(personName).filter(Boolean) : undefined
});
/**
 * Mirror of the MCP tasks tool's `convertDateFields`: parse a date string,
 * silently dropping invalid values instead of sending garbage to the API.
 */
function toIsoDate(value) {
    if (!value)
        return undefined;
    const parsed = Date.parse(value);
    return isNaN(parsed) ? undefined : new Date(parsed).toISOString();
}
/* ------------------------------------------------------------------ */
/* Tool factory                                                       */
/* ------------------------------------------------------------------ */
/**
 * Build the curated Gauzy server tools for one chat request.
 *
 * @param client   HTTP client pre-bound to the requesting user's Authorization header.
 * @param defaults Organization/tenant/employee defaults from the RequestContext.
 * @returns Tool map suitable for spreading into `streamText({ tools })`.
 */
async function buildGauzyTools(client, defaults) {
    const { tool } = await (0, esm_loader_1.loadAiSdk)();
    return {
        /* ------------------------- Tasks ------------------------- */
        get_my_tasks: tool({
            description: 'Get the tasks assigned to the current user (the person you are chatting with). ' +
                'Returns compact task summaries: id, title, status, priority, due date, project.',
            inputSchema: zod_1.z.object({
                status: TaskStatusSchema,
                page: PageSchema,
                limit: LimitSchema,
                relations: RelationsSchema
            }),
            execute: ({ status, page, limit, relations }) => runTool('get_my_tasks', async () => {
                const scope = requireScope(defaults);
                const take = clampLimit(limit);
                const response = await client.get('/api/tasks/me', buildBaseQuery({ ...scope, ...(status ? { status } : {}) }, { relations: relations ?? ['project'], take, page: page ?? 1 }));
                return pruneList(response, take, pruneTask);
            })
        }),
        search_tasks: tool({
            description: "Search tasks in the current user's organization (acting as that user, so only tasks they may " +
                'see are returned). `search` matches the task title (partial, case-insensitive). ' +
                'Other filters are exact matches.',
            inputSchema: zod_1.z.object({
                search: zod_1.z.string().optional().describe('Search term matched against the task title (partial match)'),
                projectId: zod_1.z.string().optional().describe('Filter by project ID (UUID)'),
                employeeId: zod_1.z.string().optional().describe('Filter by assigned employee ID (UUID)'),
                status: TaskStatusSchema,
                priority: TaskPrioritySchema,
                page: PageSchema,
                limit: LimitSchema,
                relations: RelationsSchema
            }),
            execute: ({ search, projectId, employeeId, status, priority, page, limit, relations }) => runTool('search_tasks', async () => {
                const scope = requireScope(defaults);
                const take = clampLimit(limit);
                const response = await client.get('/api/tasks/pagination', buildBaseQuery({
                    ...scope,
                    ...(search ? { title: search } : {}),
                    ...(projectId ? { projectId } : {}),
                    ...(employeeId ? { 'members.id': employeeId } : {}),
                    ...(status ? { status } : {}),
                    ...(priority ? { priority } : {})
                }, { relations: relations ?? ['project'], take, page: page ?? 1 }));
                return pruneList(response, take, pruneTask);
            })
        }),
        create_task: tool({
            description: "Create a new task in the current user's organization, on their behalf. " +
                'Requires explicit user approval before it runs. Provide at minimum a title; ' +
                'link it to a project with projectId (use get_projects to find one).',
            inputSchema: zod_1.z.object({
                title: zod_1.z.string().min(1).describe('The task title (required)'),
                description: zod_1.z.string().optional().describe('Detailed task description'),
                projectId: zod_1.z.string().optional().describe('Project ID (UUID) to create the task in'),
                status: TaskStatusSchema,
                priority: TaskPrioritySchema,
                size: TaskSizeSchema,
                dueDate: zod_1.z.string().optional().describe('Due date (ISO 8601, e.g. 2026-07-15)'),
                estimate: zod_1.z.number().int().optional().describe('Time estimate in seconds')
            }),
            execute: ({ title, description, projectId, status, priority, size, dueDate, estimate }) => runTool('create_task', async () => {
                const scope = requireScope(defaults);
                // Mirrors the MCP create_task body: scope IDs in the body,
                // dates parsed and dropped when invalid (convertDateFields).
                const body = {
                    title,
                    ...(description ? { description } : {}),
                    ...(projectId ? { projectId } : {}),
                    ...(status ? { status } : {}),
                    ...(priority ? { priority } : {}),
                    ...(size ? { size } : {}),
                    ...(estimate !== undefined ? { estimate } : {}),
                    ...(toIsoDate(dueDate) ? { dueDate: toIsoDate(dueDate) } : {}),
                    ...scope
                };
                const created = await client.post('/api/tasks', body);
                return pruneTask(created);
            })
        }),
        /* ------------------ Projects & people --------------------- */
        get_projects: tool({
            description: "List the projects of the current user's organization (only projects visible to that user). " +
                '`name` filters by partial, case-insensitive project name.',
            inputSchema: zod_1.z.object({
                name: zod_1.z.string().optional().describe('Filter by project name (partial match)'),
                page: PageSchema,
                limit: LimitSchema,
                relations: RelationsSchema
            }),
            execute: ({ name, page, limit, relations }) => runTool('get_projects', async () => {
                const scope = requireScope(defaults);
                const take = clampLimit(limit);
                const response = await client.get('/api/organization-projects/pagination', buildBaseQuery({ ...scope, ...(name ? { name } : {}) }, { relations: relations ?? [], take, page: page ?? 1 }));
                return pruneList(response, take, pruneProject);
            })
        }),
        get_employees: tool({
            description: "List the employees of the current user's organization (as visible to that user). " +
                '`search` matches employee name or email (partial).',
            inputSchema: zod_1.z.object({
                search: zod_1.z.string().optional().describe('Search by employee name (partial match)'),
                isActive: zod_1.z.boolean().optional().describe('Filter by active status'),
                page: PageSchema,
                limit: LimitSchema,
                relations: RelationsSchema
            }),
            execute: ({ search, isActive, page, limit, relations }) => runTool('get_employees', async () => {
                const scope = requireScope(defaults);
                const take = clampLimit(limit);
                const response = await client.get('/api/employee/pagination', buildBaseQuery({
                    ...scope,
                    ...(search ? { 'user.name': search } : {}),
                    ...(isActive !== undefined ? { isActive } : {})
                }, { relations: relations ?? ['user'], take, page: page ?? 1 }));
                return pruneList(response, take, pruneEmployee);
            })
        }),
        get_organization_contacts: tool({
            description: "List the current user's organization contacts (clients, customers, leads), acting as that user.",
            inputSchema: zod_1.z.object({
                contactType: zod_1.z
                    .enum(['CLIENT', 'CUSTOMER', 'LEAD'])
                    .optional()
                    .describe('Filter by contact type'),
                limit: LimitSchema,
                relations: RelationsSchema
            }),
            execute: ({ contactType, limit, relations }) => runTool('get_organization_contacts', async () => {
                const scope = requireScope(defaults);
                const take = clampLimit(limit);
                // data-JSON endpoint: ?data={"findInput":{...},"relations":[...]}
                const response = await client.get('/api/organization-contact', {
                    data: {
                        findInput: { ...scope, ...(contactType ? { contactType } : {}) },
                        relations: relations ?? []
                    }
                });
                return pruneList(response, take, pruneContact);
            })
        }),
        /* ---------------------- Daily plans ----------------------- */
        get_my_daily_plans: tool({
            description: 'Get the daily work plans of the current user (the person you are chatting with), ' +
                'including the tasks planned for each day.',
            inputSchema: zod_1.z.object({
                status: zod_1.z
                    .enum(['open', 'in-progress', 'completed'])
                    .optional()
                    .describe('Filter by plan status'),
                limit: LimitSchema,
                relations: RelationsSchema
            }),
            execute: ({ status, limit, relations }) => runTool('get_my_daily_plans', async () => {
                const scope = requireScope(defaults);
                const take = clampLimit(limit);
                const response = await client.get('/api/daily-plan/me', buildBaseQuery({ ...scope, ...(status ? { status } : {}) }, { relations: relations ?? ['tasks'] }));
                return pruneList(response, take, pruneDailyPlan);
            })
        }),
        /* ------------------------- Timer -------------------------- */
        get_timer_status: tool({
            description: "Get the current user's time-tracking timer status: whether a timer is running, " +
                'total duration today, and the last time log.',
            inputSchema: zod_1.z.object({}),
            execute: () => runTool('get_timer_status', async () => {
                const scope = requireScope(defaults);
                // TimerStatusQueryDTO takes flat tenantId/organizationId params.
                const status = await client.get('/api/timesheet/timer/status', { ...scope });
                return compact({
                    running: status?.running,
                    duration: status?.duration,
                    lastLog: status?.lastLog ? pruneTimeLog(status.lastLog) : undefined
                });
            })
        }),
        start_timer: tool({
            description: 'Start the time-tracking timer for the current user (on their behalf — requires explicit ' +
                'user approval). Optionally link the tracked time to a task and/or project.',
            inputSchema: zod_1.z.object({
                taskId: zod_1.z.string().optional().describe('Task ID (UUID) to track time against'),
                projectId: zod_1.z.string().optional().describe('Project ID (UUID) to track time against'),
                description: zod_1.z.string().optional().describe('Description for the time entry'),
                isBillable: zod_1.z.boolean().optional().describe('Whether the tracked time is billable'),
                source: TimerSourceSchema
            }),
            execute: ({ taskId, projectId, description, isBillable, source }) => runTool('start_timer', async () => {
                const scope = requireScope(defaults);
                // Mirrors the MCP start_timer body (StartTimerDTO).
                const body = {
                    ...scope,
                    ...(projectId ? { projectId } : {}),
                    ...(taskId ? { taskId } : {}),
                    ...(description ? { description } : {}),
                    logType: 'TRACKED',
                    source: source || 'BROWSER',
                    ...(isBillable !== undefined ? { isBillable } : {})
                };
                const log = await client.post('/api/timesheet/timer/start', body);
                return pruneTimeLog(log);
            })
        }),
        stop_timer: tool({
            description: 'Stop the running time-tracking timer for the current user (on their behalf — requires ' +
                'explicit user approval). Returns the completed time log.',
            inputSchema: zod_1.z.object({
                description: zod_1.z.string().optional().describe('Description to set on the time entry'),
                source: TimerSourceSchema
            }),
            execute: ({ description, source }) => runTool('stop_timer', async () => {
                const scope = requireScope(defaults);
                // Mirrors the MCP stop_timer body (StopTimerDTO).
                const body = {
                    ...scope,
                    ...(description ? { description } : {}),
                    source: source || 'BROWSER'
                };
                const log = await client.post('/api/timesheet/timer/stop', body);
                return pruneTimeLog(log ?? { description: 'No running timer was found to stop.' });
            })
        }),
        /* ----------------------- Financials ----------------------- */
        get_invoices: tool({
            description: "List invoices of the current user's organization (only what that user is allowed to see). " +
                'Returns invoice number, status, amounts, due dates and the billed contact.',
            inputSchema: zod_1.z.object({
                status: zod_1.z
                    .enum(['DRAFT', 'SENT', 'VIEWED', 'FULLY_PAID', 'PARTIALLY_PAID', 'OVERPAID', 'VOID'])
                    .optional()
                    .describe('Filter by invoice status'),
                paid: zod_1.z.boolean().optional().describe('Filter by payment status'),
                page: PageSchema,
                limit: LimitSchema,
                relations: RelationsSchema
            }),
            execute: ({ status, paid, page, limit, relations }) => runTool('get_invoices', async () => {
                const scope = requireScope(defaults);
                const take = clampLimit(limit);
                const response = await client.get('/api/invoices/pagination', buildBaseQuery({
                    ...scope,
                    ...(status ? { status } : {}),
                    ...(paid !== undefined ? { paid } : {})
                }, { relations: relations ?? ['toContact'], take, page: page ?? 1 }));
                return pruneList(response, take, pruneInvoice);
            })
        }),
        get_expenses: tool({
            description: "List expenses of the current user's organization (as that user; RBAC applies). " +
                'Returns amounts, dates, categories, vendors and projects.',
            inputSchema: zod_1.z.object({
                employeeId: zod_1.z.string().optional().describe('Filter by employee ID (UUID)'),
                projectId: zod_1.z.string().optional().describe('Filter by project ID (UUID)'),
                limit: LimitSchema,
                relations: RelationsSchema
            }),
            execute: ({ employeeId, projectId, limit, relations }) => runTool('get_expenses', async () => {
                const scope = requireScope(defaults);
                const take = clampLimit(limit);
                // data-JSON endpoint: ?data={"findInput":{...},"relations":[...]}
                const response = await client.get('/api/expense', {
                    data: {
                        findInput: {
                            ...scope,
                            ...(employeeId ? { employeeId } : {}),
                            ...(projectId ? { projectId } : {})
                        },
                        relations: relations ?? ['category', 'vendor']
                    }
                });
                return pruneList(response, take, pruneExpense);
            })
        }),
        get_incomes: tool({
            description: "List income records of the current user's organization (as that user; RBAC applies). " +
                'Returns amounts, dates, clients and notes.',
            inputSchema: zod_1.z.object({
                employeeId: zod_1.z.string().optional().describe('Filter by employee ID (UUID)'),
                limit: LimitSchema,
                relations: RelationsSchema
            }),
            execute: ({ employeeId, limit, relations }) => runTool('get_incomes', async () => {
                const scope = requireScope(defaults);
                const take = clampLimit(limit);
                // data-JSON endpoint: ?data={"findInput":{...},"relations":[...]}
                const response = await client.get('/api/income', {
                    data: {
                        findInput: { ...scope, ...(employeeId ? { employeeId } : {}) },
                        relations: relations ?? ['client']
                    }
                });
                return pruneList(response, take, pruneIncome);
            })
        }),
        /* ------------------------ Time off ------------------------ */
        get_time_off_requests: tool({
            description: "List time-off requests in the current user's organization (as that user; RBAC applies). " +
                'Returns status, dates, policy and the employees involved.',
            inputSchema: zod_1.z.object({
                status: zod_1.z
                    .enum(['REQUESTED', 'APPROVED', 'DENIED'])
                    .optional()
                    .describe('Filter by request status'),
                employeeId: zod_1.z.string().optional().describe('Filter by employee ID (UUID)'),
                limit: LimitSchema,
                relations: RelationsSchema
            }),
            execute: ({ status, employeeId, limit, relations }) => runTool('get_time_off_requests', async () => {
                const scope = requireScope(defaults);
                const take = clampLimit(limit);
                // data-JSON endpoint (note: controller path is singular
                // '/time-off-request'): ?data={"findInput":{...},"relations":[...]}
                const response = await client.get('/api/time-off-request', {
                    data: {
                        findInput: {
                            ...scope,
                            ...(status ? { status } : {}),
                            ...(employeeId ? { employeeId } : {})
                        },
                        relations: relations ?? ['policy', 'employees', 'employees.user']
                    }
                });
                return pruneList(response, take, pruneTimeOff);
            })
        })
    };
}
//# sourceMappingURL=gauzy-tools.js.map