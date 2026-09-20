import { Router } from '@angular/router';
import { DashboardLayout, ID, IDashboard, IDashboardLayout, IDashboardLayoutV2 } from '@gauzy/contracts';
import { DashboardService } from './dashboard.service';
import { Store } from '../store/store.service';
import * as i0 from "@angular/core";
/**
 * Client-side state holder for custom user dashboards.
 *
 * Responsibilities:
 * - Loads the current user's custom dashboards for the selected organization.
 * - Tracks the currently applied dashboard (`null` = the Standard dashboard).
 * - Applies/captures the widget layout state, which the existing widget system
 *   (WidgetService/WindowService in @gauzy/ui-core/shared) reads from and writes to
 *   `Store.widgets` / `Store.windows`. A custom dashboard is a persisted snapshot
 *   of that serialized state (`IDashboardLayout`), stored in `IDashboard.contentHtml`.
 * - Preserves the Standard layout in a localStorage backup while a custom
 *   dashboard is active, and restores it when switching back to Standard.
 *
 * Two persisted layout shapes coexist in `IDashboard.contentHtml`:
 * - **v1** (`IDashboardLayout`) — a snapshot of the legacy `GuiDrag` widget
 *   system, applied to `Store.widgets` / `Store.windows` on selection.
 * - **v2** (`IDashboardLayoutV2`) — a dashboard builder document (tabs of freely
 *   placed widget instances) rendered by the canvas. v2 documents are NEVER
 *   applied to the legacy widget state: doing so would clobber the user's
 *   Standard arrangement, which is only ever backed up/restored around v1.
 */
export declare class DashboardStoreService {
    private readonly _dashboardService;
    private readonly _store;
    private readonly _router;
    private readonly _dashboards$;
    /** The current user's custom dashboards (for the selected organization). */
    readonly dashboards$: import("rxjs").Observable<IDashboard[]>;
    private readonly _selectedDashboard$;
    /** The currently applied custom dashboard, or `null` when the Standard dashboard is active. */
    readonly selectedDashboard$: import("rxjs").Observable<IDashboard>;
    private readonly _editing$;
    /** Whether the currently selected custom dashboard is in edit (arrange) mode. */
    readonly editing$: import("rxjs").Observable<boolean>;
    private readonly _refresh$;
    /**
     * In-progress v2 document staged by the canvas while editing, so the
     * switcher's Save button (which has no reference to the canvas) can persist
     * it. `null` whenever there is nothing unsaved.
     */
    private _pendingLayout;
    constructor(_dashboardService: DashboardService, _store: Store, _router: Router);
    /** The currently applied custom dashboard, or `null` for Standard. */
    get selectedDashboard(): IDashboard | null;
    /** The current user's custom dashboards. */
    get dashboards(): IDashboard[];
    /** Triggers a reload of the dashboards list. */
    refresh(): void;
    /** The organization the in-memory dashboard state currently belongs to. */
    private _activeOrganizationId;
    /**
     * Storage keys are scoped to the current user AND organization so that on a
     * shared browser (or after an organization switch) one context's selection
     * or layout backup can never leak into another's session.
     */
    private _selectedKeyFor;
    private _backupKeyFor;
    private get _selectedKey();
    private get _backupKey();
    private _listenToChangesAndLoadDashboards;
    /**
     * Leaves the given organization's dashboard context: restores its Standard
     * layout snapshot (when a custom dashboard was active there), removes its
     * persisted keys and resets the in-memory list/selection.
     */
    private _leaveOrganization;
    /**
     * Loads the current user's dashboards for the selected organization.
     * Dashboards are personal, so results are scoped to the creating user.
     */
    private _loadDashboards;
    /**
     * Keeps the selected dashboard reference in sync with the freshly loaded list
     * (e.g. after rename) and clears a stale selection when the dashboard is gone.
     */
    private _reconcileSelection;
    /**
     * Applies the custom dashboard with the given ID: snapshots the Standard
     * layout (when leaving Standard), writes the dashboard's saved layout into
     * the widget system state and marks the dashboard as selected.
     *
     * Used by the `custom/:id` route guard BEFORE the widget host component
     * initializes, so the layout components pick up the applied state.
     *
     * For a v2 (builder) dashboard nothing is written into the legacy widget
     * state — it renders on the canvas — but the Standard snapshot is still
     * taken so returning to Standard restores the untouched arrangement.
     *
     * @param id - The dashboard ID to apply.
     * @throws When the dashboard cannot be found.
     */
    selectById(id: ID): Promise<IDashboard>;
    /**
     * Restores the Standard dashboard layout if a custom dashboard was active.
     * Invoked by a guard on the standard dashboard tab routes, so it is safe to
     * call repeatedly (no-op when Standard is already active).
     */
    ensureStandardLayout(): void;
    /**
     * Resolves the user's default custom dashboard (if any).
     * Used to decide where `/pages/dashboard` should land.
     */
    resolveDefaultDashboard(): Promise<IDashboard | null>;
    /** Navigates to the given custom dashboard (the route guard applies its layout). */
    navigateToDashboard(id: ID): void;
    /** Navigates to the Standard dashboard (the route guard restores the standard layout). */
    navigateToStandard(): void;
    /**
     * Creates a new custom dashboard.
     *
     * A brand new dashboard starts as an EMPTY v2 builder document (a single
     * empty tab): the product requirement is a blank canvas the user fills from
     * the widget palette, not a copy of the Standard arrangement.
     *
     * @param name - Display name of the dashboard.
     * @param layout - Explicit initial layout (used by Duplicate, which carries
     *   over the source document); `null` creates the empty v2 canvas.
     */
    createDashboard(name: string, layout?: DashboardLayout | null): Promise<IDashboard>;
    /**
     * Duplicates the given dashboard (or the current live layout when
     * duplicating the Standard dashboard).
     *
     * A v2 (builder) source is deep-cloned with FRESH tab and placement ids so
     * the copy is fully independent — sharing ids would make the two dashboards
     * collide in any instance-keyed state (widget config, selection, drag).
     *
     * @param source - The dashboard to duplicate, or `null` to duplicate the
     *   currently applied (Standard) layout.
     * @param name - Name for the copy.
     */
    duplicateDashboard(source: IDashboard | null, name: string): Promise<IDashboard>;
    /** Renames the given dashboard. */
    renameDashboard(dashboard: IDashboard, name: string): Promise<IDashboard>;
    /** Marks the given dashboard as the user's default one. */
    setDefaultDashboard(dashboard: IDashboard): Promise<IDashboard>;
    /** Clears the default flag from all of the user's dashboards (Standard becomes the default again). */
    clearDefaultDashboard(): Promise<void>;
    /**
     * Deletes the given dashboard. When it is the currently applied one, the
     * Standard layout is restored and the user is navigated back to Standard.
     */
    deleteDashboard(dashboard: IDashboard): Promise<void>;
    /** Enters edit (arrange) mode for the currently selected custom dashboard. */
    startEditing(): void;
    /**
     * Persists the current live widget layout into the selected custom dashboard.
     *
     * For a v2 (builder) dashboard the live widget state is NOT the dashboard's
     * content, so the document staged by the canvas is saved instead; capturing
     * `Store.widgets`/`Store.windows` here would overwrite the builder document
     * with an unrelated legacy snapshot.
     */
    saveSelectedLayout(): Promise<IDashboard | null>;
    /**
     * Discards unsaved layout changes: re-applies the persisted layout of the
     * selected dashboard and reloads the widget host route.
     */
    cancelEditing(): void;
    /**
     * Reads a dashboard's persisted content as a v2 (builder) document.
     *
     * ALWAYS returns a v2 document: a legacy v1 snapshot (or empty/corrupt
     * content) is normalized into a single empty tab while its original payload
     * is preserved, so the canvas can render any dashboard without special
     * casing. Use {@link isBuilderDashboard} to tell the two apart.
     *
     * @param dashboard - The dashboard to read (tolerates `null`).
     * @returns A normalized, grid-clamped v2 document.
     */
    getLayout(dashboard: IDashboard | null | undefined): IDashboardLayoutV2;
    /**
     * Persists a v2 (builder) document into the given dashboard.
     *
     * @param dashboardId - The dashboard to write to.
     * @param layout - The document produced by the canvas.
     * @returns The updated dashboard.
     */
    saveLayoutV2(dashboardId: ID, layout: IDashboardLayoutV2): Promise<IDashboard>;
    /**
     * Stages the canvas' in-progress document so the switcher's Save / Discard
     * buttons — which hold no reference to the canvas — act on it.
     *
     * @param layout - The working document, or `null` once there is nothing unsaved.
     */
    stagePendingLayout(layout: IDashboardLayoutV2 | null): void;
    /**
     * Whether the dashboard is a v2 builder document (rendered on the canvas)
     * rather than a legacy v1 widget snapshot.
     *
     * @param dashboard - The dashboard to test.
     */
    isBuilderDashboard(dashboard: IDashboard | null | undefined): boolean;
    /**
     * Deep-clones a v2 document, re-generating every tab and placement id.
     *
     * Per-instance `config` objects are cloned too, so editing the copy can
     * never mutate the source dashboard's persisted settings.
     *
     * @param layout - The (already normalized) document to clone.
     */
    private _cloneLayoutV2;
    /**
     * Structural clone of a placement's persisted configuration.
     *
     * The value is plain JSON layout data (it round-trips through the API's json
     * column), so `structuredClone` handles it and — unlike the JSON round-trip
     * it replaces — copes with cycles too.
     */
    private _deepClone;
    /**
     * Captures the current live widget layout (as maintained by the existing
     * widget system in `Store.widgets` / `Store.windows`).
     */
    captureLayout(): IDashboardLayout;
    /**
     * Writes the given saved layout into the legacy widget system state.
     *
     * v2 (builder) documents are skipped: they render on the canvas, and their
     * `widgets`/`windows` keys are either absent (so the live Standard
     * arrangement would be wiped) or a stale pre-migration snapshot.
     */
    private _applyLayout;
    /**
     * Whether the dashboard row holds a serialized widget layout (i.e. was
     * created by this feature) — either a v2 builder document or a v1 snapshot.
     * Seeded/legacy rows store arbitrary HTML in `contentHtml` and are excluded
     * from the custom dashboard experience.
     *
     * v2 documents MUST be recognized here: they carry no `widgets`/`windows`
     * keys, so a v1-only check would filter every builder dashboard out of the
     * switcher and out of the default-dashboard redirect.
     */
    private _isLayoutDashboard;
    /** Keeps only the serializable `GuiDrag` fields of each layout item. */
    private _sanitizeLayoutItems;
    /** Snapshots the Standard layout once, before the first custom dashboard is applied. */
    private _snapshotStandardIfNeeded;
    /** Restores the Standard layout snapshot into the widget system state. */
    private _restoreStandardSnapshot;
    /** Builds a unique identifier (slug) for a dashboard name. */
    private _slugify;
    static ɵfac: i0.ɵɵFactoryDeclaration<DashboardStoreService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<DashboardStoreService>;
}
