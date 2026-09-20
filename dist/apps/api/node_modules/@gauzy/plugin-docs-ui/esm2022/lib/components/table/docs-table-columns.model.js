import { DOCS_NARROW_BREAKPOINT_PX, DOCS_TABLE_COLUMNS_KEY } from '../../docs.constants';
export const DOCS_TABLE_COLUMN_KEYS = [
    'name',
    'categories',
    'tags',
    'status',
    'knowledge',
    'source',
    'fileSize',
    'updatedAt'
];
/** `DOCS.TABLE.COLUMNS.*` leaf per column — shared by the table header and the chooser. */
export const DOCS_TABLE_COLUMN_TITLE_KEYS = {
    name: 'DOCS.TABLE.COLUMNS.NAME',
    categories: 'DOCS.TABLE.COLUMNS.CATEGORIES',
    tags: 'DOCS.TABLE.COLUMNS.TAGS',
    status: 'DOCS.TABLE.COLUMNS.STATUS',
    knowledge: 'DOCS.TABLE.COLUMNS.KNOWLEDGE',
    source: 'DOCS.TABLE.COLUMNS.SOURCE',
    fileSize: 'DOCS.TABLE.COLUMNS.SIZE',
    updatedAt: 'DOCS.TABLE.COLUMNS.UPDATED'
};
/** Name is the row's identity (and the only cell that opens it) — never hideable. */
export const DOCS_TABLE_REQUIRED_COLUMNS = ['name'];
/** Hidden by default below `DOCS_NARROW_BREAKPOINT_PX` (`01-ux-spec.md` §14). */
export const DOCS_TABLE_NARROW_HIDDEN_COLUMNS = ['categories', 'tags', 'source'];
/**
 * `localStorage` in a try/catch: it throws on access in a sandboxed iframe and in
 * Safari's private mode, and a column preference is never worth an exception.
 */
function defaultStorage() {
    try {
        return typeof localStorage !== 'undefined' ? localStorage : null;
    }
    catch {
        return null;
    }
}
function isColumnKey(value) {
    return DOCS_TABLE_COLUMN_KEYS.includes(value);
}
/**
 * Reads the stored preferences, dropping anything that is not a known column /
 * boolean pair. Corrupt or foreign JSON degrades to "no preferences", never to a
 * thrown error that would take the table down with it.
 */
export function readDocsTableColumnPreferences(storage = defaultStorage()) {
    const raw = storage?.getItem(DOCS_TABLE_COLUMNS_KEY);
    if (!raw)
        return {};
    try {
        const parsed = JSON.parse(raw);
        if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed))
            return {};
        const preferences = {};
        for (const [key, value] of Object.entries(parsed)) {
            if (isColumnKey(key) && typeof value === 'boolean')
                preferences[key] = value;
        }
        return preferences;
    }
    catch {
        return {};
    }
}
/** Persists the preferences; a failing write (quota, private mode) is not fatal. */
export function writeDocsTableColumnPreferences(preferences, storage = defaultStorage()) {
    try {
        storage?.setItem(DOCS_TABLE_COLUMNS_KEY, JSON.stringify(preferences));
    }
    catch {
        // Storage unavailable — the choice still applies to this session.
    }
}
/**
 * Resolves the effective visibility of every column: stored preference first,
 * then the narrow-viewport defaults, then "visible". Required columns are forced
 * on regardless of what a hand-edited storage entry claims.
 */
export function resolveDocsTableColumns(preferences, narrow) {
    const visibility = {};
    for (const key of DOCS_TABLE_COLUMN_KEYS) {
        if (DOCS_TABLE_REQUIRED_COLUMNS.includes(key)) {
            visibility[key] = true;
            continue;
        }
        if (typeof preferences[key] === 'boolean') {
            visibility[key] = preferences[key];
            continue;
        }
        visibility[key] = !(narrow && DOCS_TABLE_NARROW_HIDDEN_COLUMNS.includes(key));
    }
    return visibility;
}
/** True when the viewport is below the `lg` breakpoint (`01-ux-spec.md` §14). */
export function isNarrowViewport(width) {
    const resolved = typeof width === 'number' ? width : typeof window !== 'undefined' ? window.innerWidth : undefined;
    return typeof resolved === 'number' && resolved < DOCS_NARROW_BREAKPOINT_PX;
}
//# sourceMappingURL=docs-table-columns.model.js.map