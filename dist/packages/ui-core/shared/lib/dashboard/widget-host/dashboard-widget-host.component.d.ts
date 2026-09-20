import { Injector, Type } from '@angular/core';
import { IDashboardWidgetPlacement } from '@gauzy/contracts';
import { IDashboardWidgetContextOverrides, WidgetConfigField, WidgetRegistryConfig } from '@gauzy/ui-core/core';
import * as i0 from "@angular/core";
/** What the host is currently rendering inside its card body. */
export type DashboardWidgetHostState = 'missing' | 'forbidden' | 'loading' | 'error' | 'ready';
/**
 * Reads the scope overrides out of a placement's persisted configuration.
 *
 * This is what lets the same widget be dropped twice on one canvas and scoped
 * differently — e.g. one instance pinned to a single project while the page
 * selector still says "all projects". Both the singular (`projectId`) and plural
 * (`projectIds`) spellings are accepted, because a `configSchema` field of type
 * `project` stores a single id while a multi-select stores a list.
 *
 * Only the scope is overridable; the reporting window, organization and time
 * zone always come from the page.
 *
 * @param config - The placement's persisted configuration.
 * @returns The overrides, or `undefined` when the widget inherits everything.
 */
export declare function toContextOverrides(config: Record<string, unknown> | undefined): IDashboardWidgetContextOverrides | undefined;
/**
 * The subset of a widget's `configSchema` the configuration dialog can render.
 *
 * Shared with the dialog on purpose: the kebab's "Configure" entry is gated on
 * this being non-empty, so the menu can never advertise a dialog that would open
 * with nothing in it.
 *
 * @param schema - The widget's declared configuration schema.
 * @returns The renderable fields, in declaration order.
 */
export declare function renderableConfigFields(schema: WidgetConfigField[] | undefined): WidgetConfigField[];
/**
 * Card frame around one widget instance on a dashboard canvas.
 *
 * The host owns everything that is NOT the widget's own content: the title, the
 * edit-mode kebab menu (configure / resize / remove), the loading skeleton, the
 * error state with retry, and the two placeholders that keep a saved dashboard
 * usable when its widgets are unavailable —
 *
 * - **missing**: the `widgetId` is not in the registry (its plugin was disabled
 *   or the widget was removed). A saved dashboard must never crash on this.
 * - **forbidden**: the widget declares permissions the current user lacks.
 *
 * The widget itself is created dynamically and receives
 * {@link DASHBOARD_WIDGET_CONTEXT} (narrowed by `placement.config`) and
 * {@link DASHBOARD_WIDGET_CONFIG} through a per-instance injector.
 */
export declare class DashboardWidgetHostComponent {
    private readonly registry;
    private readonly store;
    private readonly injector;
    private readonly translateService;
    private readonly contextService;
    /**
     * Context stream provided by an ancestor, when the page wants to override the
     * default source (mini dashboards, previews, tests). When absent the host
     * falls back to the application-wide {@link DashboardContextService}.
     */
    private readonly ambientContext$;
    /** The placement this host renders. */
    readonly placement: import("@angular/core").InputSignal<IDashboardWidgetPlacement>;
    /** Whether the canvas is in edit mode (shows the kebab menu). */
    readonly editing: import("@angular/core").InputSignalWithTransform<boolean, unknown>;
    /** The user asked to remove this placement from the canvas. */
    readonly removed: import("@angular/core").OutputEmitterRef<IDashboardWidgetPlacement>;
    /**
     * The user asked to configure this placement.
     *
     * Deliberately payload-less: the host does not own the settings dialog, and
     * the parent already knows which placement it bound. Emitting a payload here
     * would be mistaken for "the new configuration" by canvases that persist it.
     */
    readonly configureRequested: import("@angular/core").OutputEmitterRef<void>;
    /** The user picked a new width (in grid columns) for this placement. */
    readonly resized: import("@angular/core").OutputEmitterRef<{
        w: number;
    }>;
    /** Bumped whenever the registry changes, so a late-registered plugin appears. */
    private readonly registryVersion;
    /** Bumped whenever role permissions change, so access is re-evaluated. */
    private readonly permissionsVersion;
    /** Bumped on every language change, so a translated title is re-resolved. */
    private readonly langVersion;
    /** The resolved widget component, or `null` while loading/unavailable. */
    readonly component: import("@angular/core").WritableSignal<Type<unknown>>;
    /** True while the widget's component bundle is being resolved. */
    readonly loading: import("@angular/core").WritableSignal<boolean>;
    /** Message of the failed component resolution, or `null`. */
    readonly loadError: import("@angular/core").WritableSignal<string>;
    /** Resolved (but not yet translated) widget title. */
    private readonly resolvedTitle;
    /** Guards against out-of-order async resolutions. */
    private loadToken;
    private titleToken;
    /** The kebab menu popover, so an action can close it. */
    private readonly popover;
    /** The registry key of the placed widget. */
    readonly widgetId: import("@angular/core").Signal<string>;
    /** The placement's persisted configuration (stable identity when absent). */
    readonly widgetConfig: import("@angular/core").Signal<Record<string, unknown>>;
    /** Registry entry behind the placement, or `undefined` when unavailable. */
    readonly widget: import("@angular/core").Signal<WidgetRegistryConfig>;
    /** Whether the current user may see this widget. */
    readonly hasAccess: import("@angular/core").Signal<boolean>;
    /** Whether the placement is temporarily hidden. */
    readonly hidden: import("@angular/core").Signal<boolean>;
    /** What the card body renders. */
    readonly state: import("@angular/core").Signal<DashboardWidgetHostState>;
    /** Title (or translation key) shown in the card header. */
    readonly title: import("@angular/core").Signal<string>;
    /**
     * Whether the widget exposes per-instance settings the dialog can render.
     *
     * The kebab menu only offers "Configure" when this is true, so the action is
     * never a dead end — neither for a widget with nothing to configure, nor for
     * one whose whole schema uses a field type the dialog cannot render yet (see
     * {@link renderableConfigFields}).
     */
    readonly configurable: import("@angular/core").Signal<boolean>;
    /** Widths offered by the resize menu, clamped to the widget's min/max size. */
    readonly widthOptions: import("@angular/core").Signal<number[]>;
    /**
     * Per-instance injector handed to the widget.
     *
     * Depends ONLY on the widget id and the config object identity: changing
     * `ngComponentOutletInjector` destroys and recreates the component, so it
     * must not change while a placement is merely being dragged or resized (the
     * layout utils shallow-copy placements, keeping `config` identity stable).
     */
    readonly widgetInjector: import("@angular/core").Signal<Injector>;
    /**
     * Inputs forwarded to the widget, filtered down to the ones it declares.
     *
     * DI is the contract; these are a convenience for simple presentational
     * widgets that only need their placement/config.
     */
    readonly widgetInputs: import("@angular/core").Signal<Record<string, unknown>>;
    constructor();
    /** Emits {@link configureRequested} for this placement and closes the menu. */
    onConfigure(): void;
    /** Emits {@link removed} for this placement and closes the menu. */
    onRemove(): void;
    /**
     * Emits {@link resized} with the picked width and closes the menu.
     *
     * @param width - New span in grid columns.
     */
    onResize(width: number): void;
    /** Retries a failed component resolution. */
    retry(): void;
    /** Hides the kebab popover, if it is open. */
    private closeMenu;
    /**
     * Resolves (and caches, via the registry) the component backing a placement.
     *
     * @param widgetId - The placement's registry key.
     * @param widget - The registry entry, when it exists.
     * @param hasAccess - Whether the user may see the widget.
     */
    private loadWidgetComponent;
    /**
     * Resolves the header title: the user's override wins, otherwise the registry
     * title — which may be a plain string, a translation key, or a `ResolveFn`
     * returning any of those (possibly asynchronously).
     *
     * @param override - `placement.title`, set when the user renamed the widget.
     * @param widget - The registry entry, when it exists.
     */
    private resolveTitle;
    static ɵfac: i0.ɵɵFactoryDeclaration<DashboardWidgetHostComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<DashboardWidgetHostComponent, "ga-dashboard-widget-host", never, { "placement": { "alias": "placement"; "required": true; "isSignal": true; }; "editing": { "alias": "editing"; "required": false; "isSignal": true; }; }, { "removed": "removed"; "configureRequested": "configureRequested"; "resized": "resized"; }, never, never, true, never>;
}
