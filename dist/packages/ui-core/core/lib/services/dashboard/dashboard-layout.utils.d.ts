import { DashboardLayout, IDashboardLayoutV2, IDashboardTab, IDashboardWidgetPlacement, JsonData } from '@gauzy/contracts';
/** Number of columns on a dashboard canvas. */
export declare const DASHBOARD_GRID_COLUMNS = 12;
/** Default footprint applied when a widget declares no `defaultSize`. */
export declare const DEFAULT_WIDGET_SIZE: {
    w: number;
    h: number;
};
/**
 * Generates a stable identifier for tabs and widget placements.
 *
 * SECURITY NOTE (rule typescript:S2245): these ids are document identity only —
 * a tab key, a placement key, a CDK drop-list handle. They are never a secret,
 * a token, or any part of an access decision: a dashboard is fetched by its own
 * server-issued id and authorized server-side, so nothing follows from knowing
 * or predicting a placement id.
 *
 * They are still produced from Web Crypto wherever it exists — `randomUUID()`
 * first, then `getRandomValues()` — with a plain time-plus-counter fallback for
 * the jsdom/unit-test and insecure-context environments that offer neither.
 */
export declare function createId(): string;
/**
 * Type guard: is this a v2 (dashboard builder) document?
 *
 * @param layout - Any parsed layout document.
 */
export declare function isLayoutV2(layout: DashboardLayout | null | undefined): layout is IDashboardLayoutV2;
/**
 * Parses a `Dashboard.contentHtml` payload into a layout document.
 *
 * `contentHtml` is a json column on postgres/mysql but `text` on sqlite, so the
 * value may arrive as an object or as a string. Malformed content (including
 * the string `"null"`, arrays, and primitives) yields an empty document rather
 * than throwing — a corrupt row must never break the dashboard.
 *
 * @param content - The raw persisted value.
 */
export declare function parseLayout(content: JsonData | undefined | null): DashboardLayout;
/**
 * Normalizes any persisted layout into a v2 document.
 *
 * - v2 documents are returned with their tabs sorted and every placement
 *   clamped to the grid.
 * - v1 snapshots (and empty documents) become a v2 document with a single
 *   empty tab, while PRESERVING the original v1 payload so the legacy renderer
 *   can keep displaying dashboards created before the builder shipped.
 *
 * @param layout - A parsed layout document.
 * @param defaultTabName - Name given to the tab created for legacy/empty documents.
 */
export declare function normalizeLayout(layout: DashboardLayout | null | undefined, defaultTabName?: string): IDashboardLayoutV2;
/** Builds an empty tab. */
export declare function emptyTab(name?: string): IDashboardTab;
/** Clamps a placement's geometry into the grid and enforces positive spans. */
export declare function clampPlacement(placement: IDashboardWidgetPlacement): IDashboardWidgetPlacement;
/**
 * Resolves overlaps and compacts placements upwards.
 *
 * Placements are processed in reading order (top-to-bottom, then left-to-right)
 * and each is pulled up to the first row where it collides with nothing already
 * placed. The result is deterministic, gap-free vertically, and stable for
 * inputs that are already packed.
 *
 * @param placements - The placements of a single tab.
 * @returns A new array of placements with corrected `y` values.
 */
export declare function packLayout(placements: IDashboardWidgetPlacement[]): IDashboardWidgetPlacement[];
/**
 * Inserts a new placement into a tab at the requested grid position, then
 * repacks so nothing overlaps.
 *
 * @param placements - Existing placements.
 * @param placement - The placement being added.
 */
export declare function addPlacement(placements: IDashboardWidgetPlacement[], placement: IDashboardWidgetPlacement): IDashboardWidgetPlacement[];
/**
 * Moves the placement identified by `instanceId` to a new index in reading
 * order (used by the PR-1 ordered-list drag), then repacks.
 *
 * @param placements - Existing placements.
 * @param fromIndex - The index the placement was dragged from.
 * @param toIndex - The index it was dropped at.
 */
export declare function movePlacement(placements: IDashboardWidgetPlacement[], fromIndex: number, toIndex: number): IDashboardWidgetPlacement[];
/** Removes a placement by instance id. */
export declare function removePlacement(placements: IDashboardWidgetPlacement[], instanceId: string): IDashboardWidgetPlacement[];
/** Resizes a placement, clamping to the grid, then repacks. */
export declare function resizePlacement(placements: IDashboardWidgetPlacement[], instanceId: string, size: {
    w?: number;
    h?: number;
}): IDashboardWidgetPlacement[];
