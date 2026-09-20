import { NbDialogConfig } from '@nebular/theme';
/**
 * Shared constants for the Documents hub UI (`@gauzy/plugin-docs-ui`).
 */
/** Route location id where other plugins can contribute Documents sub-pages. */
export declare const DOCS_SECTIONS_LOCATION: "documents-sections";
/** Absolute link to the Documents hub browse page. */
export declare const DOCS_PAGE_LINK = "/pages/documents";
/** Documents settings path, RELATIVE to /pages/settings (registered at 'settings-sections'). */
export declare const DOCS_SETTINGS_PATH = "documents";
/** Absolute link to the Documents settings page (nav item under the Settings section). */
export declare const DOCS_SETTINGS_LINK = "/pages/settings/documents";
/**
 * Inbound email capture settings path, RELATIVE to /pages/settings.
 *
 * A sibling of {@link DOCS_SETTINGS_PATH} rather than a child of it: the core settings shell
 * registers `settings-sections` children as a flat list, and the capture surface is big enough
 * (a shared address, per-domain DNS verification, per-address allowlists) that folding it into
 * the defaults page would bury both.
 */
export declare const DOCS_INBOUND_SETTINGS_PATH = "documents-inbound";
/** Absolute link to the inbound email settings page (nav item under the Settings section). */
export declare const DOCS_INBOUND_SETTINGS_LINK = "/pages/settings/documents-inbound";
/** Silent refresh interval while any visible document is still processing/indexing. */
export declare const DOCS_PROCESSING_POLL_MS = 5000;
/** Debounce for filter-driven list reloads (search input debounces separately). */
export declare const DOCS_FILTER_DEBOUNCE_MS = 300;
/** Debounce for the free-text search input. */
export declare const DOCS_SEARCH_DEBOUNCE_MS = 500;
/**
 * Minimum query length for content search (`searchIn=content`).
 *
 * Re-exported from the API model on purpose: the backend rejects a shorter query with 400
 * `DOCS_QUERY_TOO_SHORT`, so the UI gate, the tooltip and the request builder must all read
 * the *same* number. This constant used to carry an independent `2` and silently disagreed
 * with the wire contract.
 */
export declare const DOCS_CONTENT_SEARCH_MIN_CHARS = 3;
/** Default table page size. */
export declare const DOCS_DEFAULT_PAGE_SIZE = 10;
/** Cards view page size ("Load more" appends another batch of this size). */
export declare const DOCS_CARDS_PAGE_SIZE = 24;
/** Client-side cap on files per multi-upload (server re-validates). */
export declare const DOCS_MAX_FILES_PER_UPLOAD = 10;
/** Fallback max file size (bytes) until `GET /settings` supplies the org limit. */
export declare const DOCS_DEFAULT_MAX_FILE_SIZE_BYTES: number;
/** Upload accept list mirroring the backend extension allowlist (UX-only; server re-validates). */
export declare const DOCS_UPLOAD_ACCEPT = ".pdf,.docx,.xlsx,.pptx,.odt,.ods,.csv,.txt,.md,.html,.png,.jpg,.jpeg,.webp,.gif";
/** Bulk endpoint hard cap (ids per request). */
export declare const DOCS_BULK_MAX_IDS = 200;
/** Max per-id errors rendered inline in the bulk result panel (full list via copy report). */
export declare const DOCS_BULK_MAX_INLINE_ERRORS = 10;
/**
 * Shared open config for the file preview dialog (`01-ux-spec.md` §9): `Esc`
 * closes it, focus moves into the dialog (and is restored on close), and the
 * page behind it does not scroll. Every entry point (table, cards, detail panel,
 * review queue) opens it with exactly these semantics.
 */
export declare const DOCS_PREVIEW_DIALOG_CONFIG: Partial<NbDialogConfig>;
/** localStorage key — tree column collapsed state. */
export declare const DOCS_TREE_COLLAPSED_KEY = "gauzy_docs_tree_collapsed";
/** localStorage key — per-user table column visibility (`01-ux-spec.md` §4.1). */
export declare const DOCS_TABLE_COLUMNS_KEY = "gauzy_docs_columns";
/**
 * Viewport width (px) below which the table drops its low-priority columns by
 * default (`01-ux-spec.md` §14 — the Nebular `lg` breakpoint). A stored column
 * preference still wins, so the chooser can bring any of them back.
 */
export declare const DOCS_NARROW_BREAKPOINT_PX = 992;
/**
 * How long the "uploaded — needs review" toast stays up (`01-ux-spec.md` §7.3).
 * Longer than a plain confirmation because the toast IS the action: clicking it
 * opens the review queue.
 */
export declare const DOCS_REVIEW_TOAST_DURATION_MS = 10000;
/** localStorage key prefix — recently opened document ids (per organization). */
export declare const DOCS_RECENTS_KEY_PREFIX = "gauzy_docs_recents_";
/** Number of recent documents kept in the tree "Recents" section. */
export declare const DOCS_RECENTS_LIMIT = 10;
/**
 * localStorage key prefix — named saved filter views (`01-ux-spec.md` §5, M5).
 * Device-local by design: v1 never stores views server-side, so the key is
 * scoped per organization exactly like the recents list above (a browser
 * profile is one user).
 */
export declare const DOCS_SAVED_VIEWS_KEY_PREFIX = "gauzy_docs_saved_views_";
/** Cap on stored saved views per organization (localStorage is a shared 5 MB budget). */
export declare const DOCS_SAVED_VIEWS_LIMIT = 20;
/** Max length of a saved view name (UI-only; nothing server-side validates it). */
export declare const DOCS_SAVED_VIEW_NAME_MAX = 60;
