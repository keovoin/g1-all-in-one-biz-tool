import { DocumentKindEnum, DocumentKnowledgeStatusEnum, DocumentReviewStatusEnum, DocumentSourceEnum, DocumentStatusEnum } from '@gauzy/contracts';
import { DOCS_DEFAULT_PAGE_SIZE } from '../docs.constants';
export const DOCS_PRESETS = ['needs-review', 'not-in-knowledge', 'archived'];
export function createInitialDocsFilterState() {
    return {
        q: '',
        searchIn: 'name',
        kind: [],
        status: [],
        knowledgeStatus: [],
        reviewStatus: [],
        source: [],
        categoryIds: [],
        tagIds: [],
        archived: false,
        preset: undefined,
        createdFrom: undefined,
        createdTo: undefined,
        updatedFrom: undefined,
        updatedTo: undefined,
        sort: { field: 'updatedAt', order: 'DESC' }
    };
}
export function isDefaultSort(sort) {
    return !sort || (sort.field === 'updatedAt' && sort.order === 'DESC');
}
/** True when any non-default filter is active (drives the "no results" empty state). */
export function hasActiveFilters(filter) {
    return !!(filter.q ||
        filter.preset ||
        filter.kind.length ||
        filter.status.length ||
        filter.knowledgeStatus.length ||
        filter.reviewStatus.length ||
        filter.source.length ||
        filter.categoryIds.length ||
        filter.tagIds.length ||
        filter.archived ||
        filter.createdFrom ||
        filter.createdTo ||
        filter.updatedFrom ||
        filter.updatedTo);
}
// ─── URL codec (whitelist-validated both directions) ─────────────────────────
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
/** UPLOADED never appears in the URL — it folds into PROCESSING for users. */
const URL_STATUS_WHITELIST = [DocumentStatusEnum.READY, DocumentStatusEnum.PROCESSING, DocumentStatusEnum.FAILED];
/**
 * Expands a status selection for the API (`R-STA-02`).
 *
 * 🛑 UPLOADED is an internal first phase the user is never shown: the badge, the
 * facet dropdown and the URL all say "Processing". Filtering must fold the same
 * way — sending a bare `status=PROCESSING` hides every row that is still in
 * UPLOADED, i.e. the freshly uploaded files the filter most obviously promises.
 * The API keeps all four states; only the UI speaks two.
 */
export function expandStatusFilterForApi(status) {
    if (!status.includes(DocumentStatusEnum.PROCESSING) || status.includes(DocumentStatusEnum.UPLOADED)) {
        return status;
    }
    return [...status, DocumentStatusEnum.UPLOADED];
}
/**
 * Folds the UPLOADED facet bucket into PROCESSING for display — the same
 * two-phase truth as {@link expandStatusFilterForApi}, from the other direction.
 * Dropping the bucket instead (what the filter bar used to do) understated the
 * Processing count by exactly the rows that had only just arrived.
 */
export function foldStatusFacetBuckets(buckets) {
    if (!buckets?.length)
        return [];
    const uploaded = buckets.find((bucket) => bucket.value === DocumentStatusEnum.UPLOADED);
    const folded = buckets.filter((bucket) => bucket.value !== DocumentStatusEnum.UPLOADED);
    if (!uploaded?.count)
        return folded;
    const processing = folded.find((bucket) => bucket.value === DocumentStatusEnum.PROCESSING);
    if (processing) {
        return folded.map((bucket) => bucket === processing ? { ...bucket, count: (bucket.count ?? 0) + uploaded.count } : bucket);
    }
    // No PROCESSING bucket came back at all — the uploaded rows ARE the processing ones.
    return [...folded, { ...uploaded, value: DocumentStatusEnum.PROCESSING }];
}
function parseCsvEnum(raw, allowed) {
    if (!raw)
        return [];
    const set = new Set(allowed);
    return [...new Set(raw.split(','))].filter((v) => set.has(v));
}
function parseCsvIds(raw) {
    if (!raw)
        return [];
    return [...new Set(raw.split(','))].filter((v) => !!v.trim());
}
function parseDate(raw) {
    return raw && DATE_RE.test(raw) ? raw : undefined;
}
/**
 * Restores filter state from query params. Unknown enum members, invalid dates
 * and malformed sorts are silently dropped per the §6 restore rules.
 */
export function parseDocsFilterFromParams(params) {
    const state = createInitialDocsFilterState();
    state.q = typeof params['q'] === 'string' ? params['q'] : '';
    state.searchIn = params['searchIn'] === 'content' ? 'content' : 'name';
    state.kind = parseCsvEnum(params['kind'], Object.values(DocumentKindEnum));
    state.status = parseCsvEnum(params['status'], URL_STATUS_WHITELIST);
    state.knowledgeStatus = parseCsvEnum(params['knowledge'], Object.values(DocumentKnowledgeStatusEnum));
    state.source = parseCsvEnum(params['source'], Object.values(DocumentSourceEnum));
    // Free-text facet ids are accepted before facets load (deep links from AI chat).
    state.categoryIds = parseCsvIds(params['categories']);
    state.tagIds = parseCsvIds(params['tags']);
    state.createdFrom = parseDate(params['createdFrom']);
    state.createdTo = parseDate(params['createdTo']);
    state.updatedFrom = parseDate(params['updatedFrom']);
    state.updatedTo = parseDate(params['updatedTo']);
    const preset = params['preset'];
    if (DOCS_PRESETS.includes(preset)) {
        state.preset = preset;
        applyPreset(state, preset);
    }
    const sort = typeof params['sort'] === 'string' ? params['sort'] : '';
    const [field, order] = sort.split(':');
    if (field && (order === 'asc' || order === 'desc')) {
        state.sort = { field, order: order.toUpperCase() };
    }
    return state;
}
/** Applies the filter values a preset implies (per `01-ux-spec.md` §5.1). */
export function applyPreset(state, preset) {
    state.preset = preset ?? undefined;
    state.reviewStatus = [];
    state.archived = false;
    switch (preset) {
        case 'needs-review':
            state.reviewStatus = [DocumentReviewStatusEnum.PENDING];
            break;
        case 'not-in-knowledge':
            state.knowledgeStatus = [DocumentKnowledgeStatusEnum.NONE, DocumentKnowledgeStatusEnum.EXCLUDED];
            break;
        case 'archived':
            state.archived = true;
            break;
    }
    return state;
}
/**
 * Serializes the filter state into query params. Params at their default value
 * are set to `null` so a merge write removes them from the URL.
 */
export function docsFilterToParams(filter, pagination) {
    const csv = (values) => (values.length ? values.join(',') : null);
    // Presets own their implied filter values — implied values are not duplicated in the URL.
    const implied = filter.preset ? applyPreset({ ...createInitialDocsFilterState() }, filter.preset) : null;
    const minus = (values, impliedValues) => impliedValues?.length ? values.filter((v) => !impliedValues.includes(v)) : values;
    return {
        q: filter.q || null,
        searchIn: filter.searchIn === 'content' ? 'content' : null,
        preset: filter.preset ?? null,
        kind: csv(filter.kind),
        status: csv(filter.status.filter((s) => s !== DocumentStatusEnum.UPLOADED)),
        knowledge: csv(minus(filter.knowledgeStatus, implied?.knowledgeStatus)),
        source: csv(filter.source),
        categories: csv(filter.categoryIds),
        tags: csv(filter.tagIds),
        createdFrom: filter.createdFrom ?? null,
        createdTo: filter.createdTo ?? null,
        updatedFrom: filter.updatedFrom ?? null,
        updatedTo: filter.updatedTo ?? null,
        sort: isDefaultSort(filter.sort) ? null : `${filter.sort.field}:${filter.sort.order.toLowerCase()}`,
        page: pagination && pagination.page > 1 ? pagination.page : null,
        pageSize: pagination && pagination.pageSize !== DOCS_DEFAULT_PAGE_SIZE ? pagination.pageSize : null
    };
}
//# sourceMappingURL=docs-filter.model.js.map