/**
 * Column visibility model for the documents table (`01-ux-spec.md` §4.1 column
 * chooser + §14 responsive defaults).
 *
 * Two independent inputs decide whether a column renders:
 *
 * 1. the **stored per-user preference** (`localStorage['gauzy_docs_columns']`), and
 * 2. the **narrow-viewport defaults**, which hide the three low-priority columns
 *    below the `lg` breakpoint.
 *
 * 🛑 They are not the same thing and the order matters: §14 says the narrow
 * defaults are "restorable via column chooser", so an explicit preference — for
 * either direction — always wins over the breakpoint. Baking the breakpoint into
 * the stored map instead would make one narrow session permanently hide those
 * columns on the desktop too.
 */
/** Data keys of the table columns, in render order. `actions` lives in the row kebab. */
export type DocsTableColumnKey = 'name' | 'categories' | 'tags' | 'status' | 'knowledge' | 'source' | 'fileSize' | 'updatedAt';
export declare const DOCS_TABLE_COLUMN_KEYS: readonly DocsTableColumnKey[];
/** `DOCS.TABLE.COLUMNS.*` leaf per column — shared by the table header and the chooser. */
export declare const DOCS_TABLE_COLUMN_TITLE_KEYS: Record<DocsTableColumnKey, string>;
/** Name is the row's identity (and the only cell that opens it) — never hideable. */
export declare const DOCS_TABLE_REQUIRED_COLUMNS: readonly DocsTableColumnKey[];
/** Hidden by default below `DOCS_NARROW_BREAKPOINT_PX` (`01-ux-spec.md` §14). */
export declare const DOCS_TABLE_NARROW_HIDDEN_COLUMNS: readonly DocsTableColumnKey[];
/** Stored preferences: only the columns the user actually toggled carry an entry. */
export type DocsTableColumnPreferences = Partial<Record<DocsTableColumnKey, boolean>>;
/** The `localStorage` surface these helpers need — narrowed so tests can pass a stub. */
export type DocsColumnStorage = Pick<Storage, 'getItem' | 'setItem'>;
/**
 * Reads the stored preferences, dropping anything that is not a known column /
 * boolean pair. Corrupt or foreign JSON degrades to "no preferences", never to a
 * thrown error that would take the table down with it.
 */
export declare function readDocsTableColumnPreferences(storage?: DocsColumnStorage | null): DocsTableColumnPreferences;
/** Persists the preferences; a failing write (quota, private mode) is not fatal. */
export declare function writeDocsTableColumnPreferences(preferences: DocsTableColumnPreferences, storage?: DocsColumnStorage | null): void;
/**
 * Resolves the effective visibility of every column: stored preference first,
 * then the narrow-viewport defaults, then "visible". Required columns are forced
 * on regardless of what a hand-edited storage entry claims.
 */
export declare function resolveDocsTableColumns(preferences: DocsTableColumnPreferences, narrow: boolean): Record<DocsTableColumnKey, boolean>;
/** True when the viewport is below the `lg` breakpoint (`01-ux-spec.md` §14). */
export declare function isNarrowViewport(width?: number): boolean;
