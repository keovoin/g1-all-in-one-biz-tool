/**
 * Sort fields the backend accepts.
 *
 * 🛑 WIRE values, `@IsIn`-validated on `GetDocumentsQueryDTO.sort`: anything else
 * (a composite `field:order` string, `index`, a column name) is a 400 that takes
 * the whole list, count and facets request down with it.
 */
export const DOCUMENT_SORT_FIELDS = ['name', 'updatedAt', 'createdAt', 'size', 'kind'];
/**
 * Minimum `q` length the backend requires for `searchIn=content` (else 400
 * `DOCS_QUERY_TOO_SHORT`).
 *
 * 🛑 **The single client-side definition of that number** — `DOCS_CONTENT_SEARCH_MIN_CHARS`
 * in `docs.constants.ts` re-exports this one, and the filter bar's Content gate, its tooltip
 * (`DOCS.FILTERS.SEARCH_CONTENT_DISABLED`, which interpolates it) and the downgrade below all
 * read from here. A second, disagreeing copy is exactly how the gate came to advertise 2
 * while `DocumentService.buildFilters()` rejected anything under 3.
 */
export const DOCUMENT_CONTENT_SEARCH_MIN_CHARS = 3;
/** `PaginationQueryDTO.take` is `@Max(100)` — a larger window is a 400, not a bigger page. */
export const DOCUMENT_MAX_TAKE = 100;
/** Keeps only a non-empty array (an empty one would serialize to nothing anyway). */
const listOrUndefined = (values) => (values?.length ? values : undefined);
/** Keeps only a non-empty string — `''` and `undefined` both mean "no value" here. */
const textOrUndefined = (value) => value || undefined;
/** The wire values of `GetDocumentsQueryDTO.archived` (`@IsIn`-validated). */
const DOCUMENT_ARCHIVED_FILTERS = ['exclude', 'include', 'only'];
/**
 * The DTO's `kind` is an **array** (`@IsEnum(..., { each: true })`, CSV or
 * repeated params; the service filters `kind IN (...)`). The scalar-unwrap this
 * used to do silently DROPPED every multi-kind selection — the filter widened
 * the result set with no error.
 */
function normalizeKind(kind) {
    if (!kind)
        return undefined;
    return listOrUndefined(Array.isArray(kind) ? kind : [kind]);
}
/** `true`/`false` map onto the DTO enum; an unrecognized value is dropped, not sent. */
function normalizeArchived(archived) {
    if (typeof archived === 'boolean')
        return archived ? 'only' : 'exclude';
    if (archived && DOCUMENT_ARCHIVED_FILTERS.includes(archived))
        return archived;
    return undefined;
}
/**
 * `searchIn` only ever travels with a query, and a content search below the
 * backend minimum is a 400 — degrade it to a name search instead.
 */
function normalizeSearchIn(q, searchIn) {
    if (!q)
        return undefined;
    return searchIn === 'content' && q.length >= DOCUMENT_CONTENT_SEARCH_MIN_CHARS ? 'content' : 'name';
}
/**
 * Page window as `PaginationQueryDTO` accepts it: `skip` is a 1-based page number
 * and `take` is `@Max(100)` — a larger window is a 400, not a bigger page.
 */
function normalizeWindow(skip, take) {
    return {
        skip: typeof skip === 'number' && skip > 0 ? Math.floor(skip) : undefined,
        take: typeof take === 'number' && take > 0 ? Math.min(Math.floor(take), DOCUMENT_MAX_TAKE) : undefined
    };
}
/**
 * Only ever sent WITH an organization: `TenantOrganizationBaseDTO` requires
 * `organizationId` (or an `organization` object), so a tenant-only `where` is a 400.
 */
function buildQueryScope(organizationId, tenantId) {
    if (!organizationId)
        return undefined;
    return tenantId ? { organizationId, tenantId } : { organizationId };
}
/** `toParams()` serializes `undefined` as the literal string "undefined" — prune first. */
function pruneUndefined(params) {
    Object.keys(params).forEach((key) => {
        if (params[key] === undefined)
            delete params[key];
    });
    return params;
}
/** Splits `'updatedAt:desc'` / `{ field, order }` / `'updatedAt'` into the two wire params. */
function normalizeSort(sort, sortOrder) {
    if (!sort)
        return {};
    const field = typeof sort === 'string' ? sort.split(':')[0] : sort.field;
    const rawOrder = typeof sort === 'string' ? sort.split(':')[1] : sort.order;
    const order = String(rawOrder ?? sortOrder ?? '').toUpperCase();
    if (!DOCUMENT_SORT_FIELDS.includes(field))
        return {};
    return {
        sort: field,
        sortOrder: order === 'ASC' || order === 'DESC' ? order : undefined
    };
}
/**
 * Reconciles a caller's filter input with `GetDocumentsQueryDTO`.
 *
 * Applied by `DocumentsService` on every list/count/facets call so no call site
 * can drift from the backend contract again. Values the DTO cannot express are
 * dropped rather than sent — a dropped filter is a wider result set, a rejected
 * one is an empty hub.
 */
export function toDocumentsQueryParams(input = {}) {
    const q = textOrUndefined(input.q?.trim());
    const params = {
        kind: normalizeKind(input.kind),
        status: listOrUndefined(input.status),
        knowledgeStatus: listOrUndefined(input.knowledgeStatus),
        reviewStatus: listOrUndefined(input.reviewStatus),
        source: listOrUndefined(input.source),
        categoryIds: listOrUndefined(input.categoryIds),
        tagIds: listOrUndefined(input.tagIds),
        visibility: input.visibility,
        archived: normalizeArchived(input.archived),
        searchable: typeof input.searchable === 'boolean' ? input.searchable : undefined,
        // `null` means "no folder scope" (flat search); only `'root'` is the top level.
        parentId: input.parentId === null ? undefined : input.parentId,
        q,
        searchIn: normalizeSearchIn(q, input.searchIn),
        createdAtFrom: textOrUndefined(input.createdAtFrom),
        createdAtTo: textOrUndefined(input.createdAtTo),
        updatedAtFrom: textOrUndefined(input.updatedAtFrom),
        updatedAtTo: textOrUndefined(input.updatedAtTo),
        ...normalizeSort(input.sort, input.sortOrder),
        relations: listOrUndefined(input.relations),
        ...normalizeWindow(input.skip, input.take),
        where: buildQueryScope(input.organizationId, input.tenantId)
    };
    return pruneUndefined(params);
}
/**
 * Normalizes the facets wire shape into the `{ value, label, count }[]` buckets
 * every consumer binds.
 *
 * 🛑 The response used to be stored RAW: `bucketsOrEnum()` saw a non-array for
 * every enum facet and silently fell back to bare enum lists (per-option counts
 * never rendered), while Category/Tag options were built from rows whose
 * `.value`/`.label` were `undefined`. `DocumentsService.getFacets` is the single
 * funnel through this function — effects and the store stay shape-agnostic.
 */
export function normalizeDocumentFacets(raw) {
    const enumBuckets = (facet) => {
        if (Array.isArray(facet))
            return facet;
        if (!facet || typeof facet !== 'object')
            return [];
        return Object.entries(facet).map(([value, count]) => ({ value, count: Number(count) }));
    };
    const rowBuckets = (rows) => {
        if (!Array.isArray(rows))
            return [];
        return rows.map((row) => 'value' in row ? row : { value: row.id, label: row.name, count: Number(row.count) });
    };
    return {
        kind: enumBuckets(raw?.kind),
        status: enumBuckets(raw?.status),
        knowledgeStatus: enumBuckets(raw?.knowledgeStatus),
        reviewStatus: enumBuckets(raw?.reviewStatus),
        source: enumBuckets(raw?.source),
        categories: rowBuckets(raw?.categories),
        tags: rowBuckets(raw?.tags),
        presets: raw?.presets
    };
}
/**
 * Reads the usage numbers out of a settings response tolerantly and returns the
 * normalized view the settings card binds to.
 *
 * Three accepted wire shapes, in precedence order:
 *  1. **`quota`** — what `DocumentSettingsService.getSettings()` actually emits
 *     (`{ quotaBytes, usedBytes, remainingBytes, unlimited }`);
 *  2. `storage` — the alias this function was originally written against;
 *  3. `capabilities.storage{Used,Quota}Bytes` — the flattened variant.
 *
 * Returns `null` — meaning "this deployment does not report usage" — unless a real
 * numeric `usedBytes` is present. A quota of `0`/absent means *unlimited* (§5.7),
 * normalized to `quotaBytes: null` so callers only have to test for null.
 */
export function normalizeDocumentStorage(settings) {
    if (!settings)
        return null;
    const flat = settings.capabilities;
    const used = settings.quota?.usedBytes ?? settings.storage?.usedBytes ?? flat?.storageUsedBytes;
    if (typeof used !== 'number' || !Number.isFinite(used) || used < 0)
        return null;
    const rawQuota = settings.quota?.quotaBytes ?? settings.storage?.quotaBytes ?? flat?.storageQuotaBytes;
    const quotaBytes = typeof rawQuota === 'number' && Number.isFinite(rawQuota) && rawQuota > 0 ? rawQuota : null;
    return { usedBytes: used, quotaBytes };
}
//# sourceMappingURL=docs-api.model.js.map