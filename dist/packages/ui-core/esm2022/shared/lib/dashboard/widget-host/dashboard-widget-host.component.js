import { __decorate, __metadata } from "tslib";
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Injector, booleanAttribute, computed, effect, inject, input, isDevMode, output, reflectComponentType, runInInjectionContext, signal, viewChild } from '@angular/core';
import { NbButtonModule, NbCardModule, NbIconModule, NbPopoverDirective, NbPopoverModule } from '@nebular/theme';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { from, isObservable, of } from 'rxjs';
import { map, shareReplay, take } from 'rxjs/operators';
import { DASHBOARD_GRID_COLUMNS, DASHBOARD_WIDGET_CONFIG, DASHBOARD_WIDGET_CONTEXT, DashboardContextService, narrowDashboardContext, Store, WidgetRegistryService } from '@gauzy/ui-core/core';
import { toErrorMessage } from './base-dashboard-widget.component';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "@nebular/theme";
import * as i3 from "@ngx-translate/core";
/** Widths offered in the resize menu when a widget declares no `supportedWidths`. */
const FALLBACK_WIDTHS = [3, 4, 6, 8, 12];
/** Shared empty objects, so identity stays stable across change detection. */
const EMPTY_CONFIG = Object.freeze({});
const EMPTY_INPUTS = Object.freeze({});
/**
 * Public input names declared by a dynamically rendered component, cached per
 * component type.
 *
 * `ComponentRef.setInput()` logs an NG0303 error for inputs the component does
 * not declare, and `*ngComponentOutlet` calls it for every key of its `inputs`
 * binding — so the host must filter the bag down to what the widget accepts.
 */
const declaredInputsCache = new WeakMap();
/**
 * Returns the public (template) input names of a component type.
 *
 * @param component - The dynamically resolved widget component.
 */
function declaredInputs(component) {
    const cached = declaredInputsCache.get(component);
    if (cached) {
        return cached;
    }
    const mirror = reflectComponentType(component);
    const names = new Set((mirror?.inputs ?? []).map((meta) => meta.templateName));
    declaredInputsCache.set(component, names);
    return names;
}
/**
 * Normalizes whatever a registry `title` resolver returned into an observable.
 *
 * A resolver may hand back a plain string, a promise, or an observable, and the
 * host treats all three the same way.
 *
 * @param resolved - The raw value produced by the resolver.
 */
function toTitleStream(resolved) {
    if (isObservable(resolved)) {
        return resolved;
    }
    if (resolved instanceof Promise) {
        return from(resolved);
    }
    return of(resolved);
}
/** Coerces a config value that may hold a single id or a list of ids. */
function toIdArray(value) {
    if (Array.isArray(value)) {
        const ids = value.filter((id) => typeof id === 'string' && !!id);
        return ids.length ? ids : undefined;
    }
    return typeof value === 'string' && value ? [value] : undefined;
}
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
export function toContextOverrides(config) {
    if (!config) {
        return undefined;
    }
    const employeeIds = toIdArray(config['employeeIds'] ?? config['employeeId']);
    const projectIds = toIdArray(config['projectIds'] ?? config['projectId']);
    const teamIds = toIdArray(config['teamIds'] ?? config['teamId']);
    if (!employeeIds && !projectIds && !teamIds) {
        return undefined;
    }
    return { employeeIds, projectIds, teamIds };
}
/**
 * Config field types the builder's configuration dialog knows how to render.
 *
 * `employee` / `project` / `team` are declared by {@link WidgetConfigField} but
 * have no picker yet: the shared page selectors are store-bound (they write
 * `Store.selectedProject` / `selectedEmployee` and rewrite the route's query
 * params), so dropping one into a modal would silently re-scope the whole page.
 *
 * TODO(dashboard-builder): add modal-safe entity pickers and delete this set.
 */
const RENDERABLE_CONFIG_TYPES = new Set([
    'text',
    'number',
    'boolean',
    'select'
]);
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
export function renderableConfigFields(schema) {
    return (schema ?? []).filter((field) => !!field?.key && RENDERABLE_CONFIG_TYPES.has(field.type));
}
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
let DashboardWidgetHostComponent = class DashboardWidgetHostComponent {
    constructor() {
        this.registry = inject(WidgetRegistryService);
        this.store = inject(Store);
        this.injector = inject(Injector);
        this.translateService = inject(TranslateService);
        this.contextService = inject(DashboardContextService);
        /**
         * Context stream provided by an ancestor, when the page wants to override the
         * default source (mini dashboards, previews, tests). When absent the host
         * falls back to the application-wide {@link DashboardContextService}.
         */
        this.ambientContext$ = inject(DASHBOARD_WIDGET_CONTEXT, {
            optional: true
        });
        /** The placement this host renders. */
        this.placement = input.required(...(ngDevMode ? [{ debugName: "placement" }] : []));
        /** Whether the canvas is in edit mode (shows the kebab menu). */
        this.editing = input(false, { ...(ngDevMode ? { debugName: "editing" } : {}), transform: booleanAttribute });
        /*
        |--------------------------------------------------------------------------
        | Outputs
        |--------------------------------------------------------------------------
        | Past-tense / `*Requested` names on purpose: an output named after a native
        | DOM event (`remove`, `resize`, ...) shadows that event on the host element,
        | so a consumer binding it can fire twice or bind something else entirely.
        */
        /** The user asked to remove this placement from the canvas. */
        this.removed = output();
        /**
         * The user asked to configure this placement.
         *
         * Deliberately payload-less: the host does not own the settings dialog, and
         * the parent already knows which placement it bound. Emitting a payload here
         * would be mistaken for "the new configuration" by canvases that persist it.
         */
        this.configureRequested = output();
        /** The user picked a new width (in grid columns) for this placement. */
        this.resized = output();
        /** Bumped whenever the registry changes, so a late-registered plugin appears. */
        this.registryVersion = signal(0, ...(ngDevMode ? [{ debugName: "registryVersion" }] : []));
        /** Bumped whenever role permissions change, so access is re-evaluated. */
        this.permissionsVersion = signal(0, ...(ngDevMode ? [{ debugName: "permissionsVersion" }] : []));
        /** Bumped on every language change, so a translated title is re-resolved. */
        this.langVersion = signal(0, ...(ngDevMode ? [{ debugName: "langVersion" }] : []));
        /** The resolved widget component, or `null` while loading/unavailable. */
        this.component = signal(null, ...(ngDevMode ? [{ debugName: "component" }] : []));
        /** True while the widget's component bundle is being resolved. */
        this.loading = signal(false, ...(ngDevMode ? [{ debugName: "loading" }] : []));
        /** Message of the failed component resolution, or `null`. */
        this.loadError = signal(null, ...(ngDevMode ? [{ debugName: "loadError" }] : []));
        /** Resolved (but not yet translated) widget title. */
        this.resolvedTitle = signal('', ...(ngDevMode ? [{ debugName: "resolvedTitle" }] : []));
        /** Guards against out-of-order async resolutions. */
        this.loadToken = 0;
        this.titleToken = 0;
        /** The kebab menu popover, so an action can close it. */
        this.popover = viewChild(NbPopoverDirective, ...(ngDevMode ? [{ debugName: "popover" }] : []));
        /** The registry key of the placed widget. */
        this.widgetId = computed(() => this.placement().widgetId, ...(ngDevMode ? [{ debugName: "widgetId" }] : []));
        /** The placement's persisted configuration (stable identity when absent). */
        this.widgetConfig = computed(() => this.placement().config ?? EMPTY_CONFIG, ...(ngDevMode ? [{ debugName: "widgetConfig" }] : []));
        /** Registry entry behind the placement, or `undefined` when unavailable. */
        this.widget = computed(() => {
            this.registryVersion();
            return this.registry.getWidget(this.widgetId());
        }, ...(ngDevMode ? [{ debugName: "widget" }] : []));
        /** Whether the current user may see this widget. */
        this.hasAccess = computed(() => {
            this.permissionsVersion();
            const permissions = this.widget()?.permissions ?? [];
            // `Store.hasAnyPermission()` answers `false` for an empty list, but a
            // widget that requires nothing must stay visible to everybody.
            if (!permissions.length) {
                return true;
            }
            return this.store.hasAnyPermission(...permissions);
        }, ...(ngDevMode ? [{ debugName: "hasAccess" }] : []));
        /** Whether the placement is temporarily hidden. */
        this.hidden = computed(() => !!this.placement().hidden, ...(ngDevMode ? [{ debugName: "hidden" }] : []));
        /** What the card body renders. */
        this.state = computed(() => {
            const widget = this.widget();
            if (!widget?.loadComponent) {
                return 'missing';
            }
            if (!this.hasAccess()) {
                return 'forbidden';
            }
            if (this.loadError()) {
                return 'error';
            }
            return this.component() ? 'ready' : 'loading';
        }, ...(ngDevMode ? [{ debugName: "state" }] : []));
        /** Title (or translation key) shown in the card header. */
        this.title = computed(() => this.resolvedTitle() || 'DASHBOARD_PAGE.BUILDER.HOST.UNTITLED_WIDGET', ...(ngDevMode ? [{ debugName: "title" }] : []));
        /**
         * Whether the widget exposes per-instance settings the dialog can render.
         *
         * The kebab menu only offers "Configure" when this is true, so the action is
         * never a dead end — neither for a widget with nothing to configure, nor for
         * one whose whole schema uses a field type the dialog cannot render yet (see
         * {@link renderableConfigFields}).
         */
        this.configurable = computed(() => renderableConfigFields(this.widget()?.configSchema).length > 0, ...(ngDevMode ? [{ debugName: "configurable" }] : []));
        /** Widths offered by the resize menu, clamped to the widget's min/max size. */
        this.widthOptions = computed(() => {
            const widget = this.widget();
            // Annotated `number[]` on purpose: `supportedWidths` is the literal union
            // `WidgetGridWidth[]`, and calling `.filter()` on an un-widened
            // `WidgetGridWidth[] | number[]` union resolves against two overloaded
            // signatures — which TypeScript refuses to call.
            const widths = widget?.supportedWidths?.length ? [...widget.supportedWidths] : FALLBACK_WIDTHS;
            const min = widget?.minSize?.w ?? 1;
            const max = widget?.maxSize?.w ?? DASHBOARD_GRID_COLUMNS;
            return widths
                .filter((width) => width >= min && width <= max && width <= DASHBOARD_GRID_COLUMNS)
                .sort((a, b) => a - b);
        }, ...(ngDevMode ? [{ debugName: "widthOptions" }] : []));
        /**
         * Per-instance injector handed to the widget.
         *
         * Depends ONLY on the widget id and the config object identity: changing
         * `ngComponentOutletInjector` destroys and recreates the component, so it
         * must not change while a placement is merely being dragged or resized (the
         * layout utils shallow-copy placements, keeping `config` identity stable).
         */
        this.widgetInjector = computed(() => {
            const widgetId = this.widgetId();
            const config = this.widgetConfig();
            const overrides = toContextOverrides(config);
            const context$ = this.ambientContext$
                ? this.ambientContext$.pipe(map((context) => narrowDashboardContext(context, overrides)), shareReplay({ bufferSize: 1, refCount: true }))
                : this.contextService.contextFor(overrides);
            return Injector.create({
                name: `dashboard-widget:${widgetId}`,
                parent: this.injector,
                providers: [
                    { provide: DASHBOARD_WIDGET_CONTEXT, useValue: context$ },
                    { provide: DASHBOARD_WIDGET_CONFIG, useValue: config }
                ]
            });
        }, ...(ngDevMode ? [{ debugName: "widgetInjector" }] : []));
        /**
         * Inputs forwarded to the widget, filtered down to the ones it declares.
         *
         * DI is the contract; these are a convenience for simple presentational
         * widgets that only need their placement/config.
         */
        this.widgetInputs = computed(() => {
            const component = this.component();
            if (!component) {
                return EMPTY_INPUTS;
            }
            const declared = declaredInputs(component);
            if (!declared.size) {
                return EMPTY_INPUTS;
            }
            const candidates = {
                placement: this.placement(),
                config: this.widgetConfig(),
                editing: this.editing()
            };
            const inputs = {};
            for (const [key, value] of Object.entries(candidates)) {
                if (declared.has(key)) {
                    inputs[key] = value;
                }
            }
            return Object.keys(inputs).length ? inputs : EMPTY_INPUTS;
        }, ...(ngDevMode ? [{ debugName: "widgetInputs" }] : []));
        // A plugin may register its widgets after the dashboard has rendered — a
        // "missing widget" placeholder must recover when that happens.
        this.registry.widgets$.pipe(untilDestroyed(this)).subscribe(() => this.registryVersion.update((v) => v + 1));
        // Role permissions arrive asynchronously after sign-in / tenant switch.
        this.store.userRolePermissions$
            .pipe(untilDestroyed(this))
            .subscribe(() => this.permissionsVersion.update((v) => v + 1));
        // A widget title may be produced by a ResolveFn that translates eagerly, so
        // it has to be re-resolved on a language change. Routed through a signal
        // rather than resolved here directly: only the effect below is guaranteed
        // to run after the required `placement` input has been set.
        this.translateService.onLangChange
            .pipe(untilDestroyed(this))
            .subscribe(() => this.langVersion.update((v) => v + 1));
        // Resolve the component whenever the placed widget (or access to it) changes.
        effect(() => this.loadWidgetComponent(this.widgetId(), this.widget(), this.hasAccess()));
        // Keep the header title in sync with the placement override / registry entry.
        effect(() => {
            this.langVersion();
            this.resolveTitle(this.placement().title, this.widget());
        });
    }
    /** Emits {@link configureRequested} for this placement and closes the menu. */
    onConfigure() {
        this.closeMenu();
        this.configureRequested.emit();
    }
    /** Emits {@link removed} for this placement and closes the menu. */
    onRemove() {
        this.closeMenu();
        this.removed.emit(this.placement());
    }
    /**
     * Emits {@link resized} with the picked width and closes the menu.
     *
     * @param width - New span in grid columns.
     */
    onResize(width) {
        this.closeMenu();
        this.resized.emit({ w: width });
    }
    /** Retries a failed component resolution. */
    retry() {
        this.loadWidgetComponent(this.widgetId(), this.widget(), this.hasAccess());
    }
    /** Hides the kebab popover, if it is open. */
    closeMenu() {
        this.popover()?.hide();
    }
    /**
     * Resolves (and caches, via the registry) the component backing a placement.
     *
     * @param widgetId - The placement's registry key.
     * @param widget - The registry entry, when it exists.
     * @param hasAccess - Whether the user may see the widget.
     */
    loadWidgetComponent(widgetId, widget, hasAccess) {
        const token = ++this.loadToken;
        this.component.set(null);
        this.loadError.set(null);
        // Nothing to load: the placeholders are rendered from `state()` instead.
        if (!widget?.loadComponent || !hasAccess) {
            this.loading.set(false);
            return;
        }
        this.loading.set(true);
        this.registry
            .resolveComponent(widgetId)
            .then((component) => {
            if (token !== this.loadToken) {
                return; // A newer load superseded this one.
            }
            this.loading.set(false);
            this.component.set(component);
        })
            .catch((error) => {
            if (token !== this.loadToken) {
                return;
            }
            this.loading.set(false);
            this.loadError.set(toErrorMessage(error));
        });
    }
    /**
     * Resolves the header title: the user's override wins, otherwise the registry
     * title — which may be a plain string, a translation key, or a `ResolveFn`
     * returning any of those (possibly asynchronously).
     *
     * @param override - `placement.title`, set when the user renamed the widget.
     * @param widget - The registry entry, when it exists.
     */
    resolveTitle(override, widget) {
        const token = ++this.titleToken;
        if (override) {
            this.resolvedTitle.set(override);
            return;
        }
        const title = widget?.title;
        if (!title) {
            this.resolvedTitle.set('');
            return;
        }
        if (typeof title === 'string') {
            this.resolvedTitle.set(title);
            return;
        }
        let resolved;
        try {
            // Registry resolvers are plain functions that may call `inject()`, and
            // they never actually read the route arguments of a `ResolveFn`.
            resolved = runInInjectionContext(this.injector, () => title(null, null));
        }
        catch (error) {
            if (isDevMode()) {
                console.warn(`[ga-dashboard-widget-host] Failed to resolve title for "${this.widgetId()}"`, error);
            }
            this.resolvedTitle.set('');
            return;
        }
        toTitleStream(resolved)
            .pipe(take(1), untilDestroyed(this))
            .subscribe({
            next: (value) => {
                if (token === this.titleToken) {
                    this.resolvedTitle.set(value ?? '');
                }
            },
            error: () => {
                if (token === this.titleToken) {
                    this.resolvedTitle.set('');
                }
            }
        });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: DashboardWidgetHostComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: DashboardWidgetHostComponent, isStandalone: true, selector: "ga-dashboard-widget-host", inputs: { placement: { classPropertyName: "placement", publicName: "placement", isSignal: true, isRequired: true, transformFunction: null }, editing: { classPropertyName: "editing", publicName: "editing", isSignal: true, isRequired: false, transformFunction: null } }, outputs: { removed: "removed", configureRequested: "configureRequested", resized: "resized" }, viewQueries: [{ propertyName: "popover", first: true, predicate: NbPopoverDirective, descendants: true, isSignal: true }], ngImport: i0, template: "@if (!hidden() || editing()) {\n\t<nb-card class=\"widget-card\" [class.is-editing]=\"editing()\" [class.is-hidden]=\"hidden()\">\n\t\t<nb-card-header class=\"widget-header\">\n\t\t\t<span class=\"widget-title\" [attr.title]=\"title() | translate\">{{ title() | translate }}</span>\n\n\t\t\t@if (hidden()) {\n\t\t\t\t<span class=\"widget-badge\">{{ 'DASHBOARD_PAGE.BUILDER.HOST.HIDDEN' | translate }}</span>\n\t\t\t}\n\n\t\t\t@if (editing()) {\n\t\t\t\t<button\n\t\t\t\t\ttype=\"button\"\n\t\t\t\t\tnbButton\n\t\t\t\t\tghost\n\t\t\t\t\tsize=\"tiny\"\n\t\t\t\t\tclass=\"widget-menu-trigger\"\n\t\t\t\t\t[nbPopover]=\"widgetMenu\"\n\t\t\t\t\tnbPopoverTrigger=\"click\"\n\t\t\t\t\tnbPopoverPlacement=\"bottom\"\n\t\t\t\t\t[attr.aria-label]=\"'DASHBOARD_PAGE.BUILDER.HOST.WIDGET_MENU' | translate\"\n\t\t\t\t>\n\t\t\t\t\t<nb-icon icon=\"more-vertical-outline\"></nb-icon>\n\t\t\t\t</button>\n\t\t\t}\n\t\t</nb-card-header>\n\n\t\t<nb-card-body class=\"widget-body\">\n\t\t\t@switch (state()) {\n\t\t\t\t@case ('ready') {\n\t\t\t\t\t@if (component(); as widgetComponent) {\n\t\t\t\t\t\t<ng-container\n\t\t\t\t\t\t\t*ngComponentOutlet=\"widgetComponent; injector: widgetInjector(); inputs: widgetInputs()\"\n\t\t\t\t\t\t/>\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t\t@case ('loading') {\n\t\t\t\t\t<!-- Skeleton rather than a spinner: the card keeps its height, so the\n\t\t\t\t\t     canvas does not reflow when the widget bundle lands.\n\n\t\t\t\t\t     `<output>` (like the widget state components), not a `<div>`: a\n\t\t\t\t\t     role-less element DISCARDS `aria-label`, so the loading state was\n\t\t\t\t\t     announced as nothing at all. `<output>` carries an implicit\n\t\t\t\t\t     `status` live region \u2014 hence no explicit role \u2014 which also gets\n\t\t\t\t\t     the swap to the loaded content announced. -->\n\t\t\t\t\t<output\n\t\t\t\t\t\tclass=\"widget-skeleton\"\n\t\t\t\t\t\taria-busy=\"true\"\n\t\t\t\t\t\t[attr.aria-label]=\"'DASHBOARD_PAGE.BUILDER.HOST.LOADING' | translate\"\n\t\t\t\t\t>\n\t\t\t\t\t\t<span class=\"skeleton-line w-60\"></span>\n\t\t\t\t\t\t<span class=\"skeleton-line w-90\"></span>\n\t\t\t\t\t\t<span class=\"skeleton-line w-75\"></span>\n\t\t\t\t\t</output>\n\t\t\t\t}\n\t\t\t\t@case ('error') {\n\t\t\t\t\t<div class=\"widget-placeholder is-error\">\n\t\t\t\t\t\t<nb-icon icon=\"alert-triangle-outline\"></nb-icon>\n\t\t\t\t\t\t<p class=\"placeholder-title\">{{ 'DASHBOARD_PAGE.BUILDER.HOST.LOAD_FAILED' | translate }}</p>\n\t\t\t\t\t\t<p class=\"placeholder-hint\">{{ loadError() }}</p>\n\t\t\t\t\t\t<button type=\"button\" nbButton size=\"tiny\" status=\"basic\" (click)=\"retry()\">\n\t\t\t\t\t\t\t{{ 'DASHBOARD_PAGE.BUILDER.HOST.RETRY' | translate }}\n\t\t\t\t\t\t</button>\n\t\t\t\t\t</div>\n\t\t\t\t}\n\t\t\t\t@case ('forbidden') {\n\t\t\t\t\t<div class=\"widget-placeholder\">\n\t\t\t\t\t\t<nb-icon icon=\"lock-outline\"></nb-icon>\n\t\t\t\t\t\t<p class=\"placeholder-title\">{{ 'DASHBOARD_PAGE.BUILDER.HOST.NO_ACCESS' | translate }}</p>\n\t\t\t\t\t\t<p class=\"placeholder-hint\">{{ 'DASHBOARD_PAGE.BUILDER.HOST.NO_ACCESS_HINT' | translate }}</p>\n\t\t\t\t\t</div>\n\t\t\t\t}\n\t\t\t\t@default {\n\t\t\t\t\t<!-- The widget's plugin was disabled or the widget was removed: a saved\n\t\t\t\t\t     dashboard must stay usable instead of crashing. -->\n\t\t\t\t\t<div class=\"widget-placeholder\">\n\t\t\t\t\t\t<nb-icon icon=\"cube-outline\"></nb-icon>\n\t\t\t\t\t\t<p class=\"placeholder-title\">\n\t\t\t\t\t\t\t{{ 'DASHBOARD_PAGE.BUILDER.HOST.UNAVAILABLE' | translate }}\n\t\t\t\t\t\t</p>\n\t\t\t\t\t\t<p class=\"placeholder-hint\">\n\t\t\t\t\t\t\t{{ 'DASHBOARD_PAGE.BUILDER.HOST.UNAVAILABLE_HINT' | translate }}\n\t\t\t\t\t\t</p>\n\t\t\t\t\t\t<code class=\"placeholder-id\">{{ widgetId() }}</code>\n\t\t\t\t\t</div>\n\t\t\t\t}\n\t\t\t}\n\t\t</nb-card-body>\n\t</nb-card>\n}\n\n<!-- Edit-mode kebab menu -->\n<ng-template #widgetMenu>\n\t<div class=\"widget-menu\">\n\t\t<!-- Only offered when the widget actually declares settings, so the action\n\t\t     is never a dead end. -->\n\t\t@if (configurable()) {\n\t\t\t<button type=\"button\" class=\"menu-item\" (click)=\"onConfigure()\">\n\t\t\t\t<nb-icon icon=\"settings-2-outline\"></nb-icon>\n\t\t\t\t<span>{{ 'DASHBOARD_PAGE.BUILDER.HOST.CONFIGURE' | translate }}</span>\n\t\t\t</button>\n\t\t}\n\n\t\t@if (widthOptions().length > 1) {\n\t\t\t<div class=\"menu-section\">{{ 'DASHBOARD_PAGE.BUILDER.HOST.WIDTH' | translate }}</div>\n\t\t\t<div class=\"menu-widths\">\n\t\t\t\t@for (width of widthOptions(); track width) {\n\t\t\t\t\t<!-- The bare number is meaningless to a screen reader, and the\n\t\t\t\t\t     current width is otherwise conveyed by color alone. -->\n\t\t\t\t\t<button\n\t\t\t\t\t\ttype=\"button\"\n\t\t\t\t\t\tclass=\"width-option\"\n\t\t\t\t\t\t[class.selected]=\"width === placement().w\"\n\t\t\t\t\t\t[attr.aria-pressed]=\"width === placement().w\"\n\t\t\t\t\t\t[attr.aria-label]=\"'DASHBOARD_PAGE.BUILDER.HOST.WIDTH_COLUMNS' | translate: { count: width }\"\n\t\t\t\t\t\t(click)=\"onResize(width)\"\n\t\t\t\t\t>\n\t\t\t\t\t\t{{ width }}\n\t\t\t\t\t</button>\n\t\t\t\t}\n\t\t\t</div>\n\t\t}\n\n\t\t<button type=\"button\" class=\"menu-item is-danger\" (click)=\"onRemove()\">\n\t\t\t<nb-icon icon=\"trash-2-outline\"></nb-icon>\n\t\t\t<span>{{ 'DASHBOARD_PAGE.BUILDER.HOST.REMOVE' | translate }}</span>\n\t\t</button>\n\t</div>\n</ng-template>\n", styles: [":host{display:block;height:100%;min-width:0}.widget-card{display:flex;flex-direction:column;height:100%;margin:0;background-color:var(--background-basic-color-1);box-shadow:0 6px 20px #0000000d;border-radius:var(--border-radius);overflow:hidden}.widget-card.is-editing{border:1px dashed var(--gauzy-border-default-color)}.widget-card.is-hidden{opacity:.55}.widget-header{display:flex;align-items:center;gap:.5rem;padding:.75rem;background-color:transparent}.widget-title{flex:1 1 auto;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:.875rem;font-weight:600;line-height:1rem;color:var(--gauzy-text-color-2)}.widget-badge{flex:0 0 auto;padding:0 .375rem;border-radius:var(--border-radius);background-color:var(--gauzy-card-2);color:var(--gauzy-text-color-2);font-size:var(--text-caption-2-font-size);line-height:1.4;text-transform:uppercase}.widget-menu-trigger{flex:0 0 auto;padding:0}.widget-body{flex:1 1 auto;min-height:0;padding:0 .75rem .75rem;overflow:auto}.widget-card:has(gz-time-track-counter-card) .widget-header{padding:.75rem .75rem 0}.widget-card:has(gz-time-track-counter-card) .widget-title{font-size:12px;font-weight:500;line-height:1rem}.widget-card:has(gz-time-track-counter-card) .widget-body{padding:0 .75rem .75rem}.widget-skeleton{display:flex;flex-direction:column;gap:.625rem;padding:.25rem 0}.widget-skeleton .skeleton-line{display:block;height:.75rem;border-radius:var(--border-radius);background:linear-gradient(90deg,var(--background-basic-color-3) 25%,var(--background-basic-color-2) 50%,var(--background-basic-color-3) 75%);background-size:200% 100%;animation:ga-widget-skeleton 1.4s ease-in-out infinite}.widget-skeleton .skeleton-line.w-60{width:60%}.widget-skeleton .skeleton-line.w-75{width:75%}.widget-skeleton .skeleton-line.w-90{width:90%}@keyframes ga-widget-skeleton{0%{background-position:200% 0}to{background-position:-200% 0}}@media(prefers-reduced-motion:reduce){.widget-skeleton .skeleton-line{animation:none}}.widget-placeholder{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.375rem;height:100%;min-height:5rem;padding:.75rem;text-align:center;color:var(--text-hint-color)}.widget-placeholder nb-icon{font-size:1.5rem;color:var(--text-hint-color)}.widget-placeholder .placeholder-title{margin:0;font-size:var(--text-subtitle-2-font-size);color:var(--gauzy-text-color-1)}.widget-placeholder .placeholder-hint{margin:0;font-size:var(--text-caption-font-size);overflow-wrap:anywhere}.widget-placeholder .placeholder-id{font-size:var(--text-caption-2-font-size);color:var(--text-hint-color);overflow-wrap:anywhere}.widget-placeholder.is-error nb-icon,.widget-placeholder.is-error .placeholder-title{color:var(--color-danger-default)}.widget-menu{display:flex;flex-direction:column;min-width:11rem;padding:.25rem}.widget-menu .menu-item{display:flex;align-items:center;gap:.5rem;padding:.375rem .5rem;border:none;border-radius:var(--border-radius);background:transparent;color:var(--gauzy-text-color-1);font-size:var(--text-button-tiny-font-size);text-align:start;cursor:pointer}.widget-menu .menu-item nb-icon{font-size:1rem}.widget-menu .menu-item:hover{background-color:var(--background-basic-color-3)}.widget-menu .menu-item.is-danger{color:var(--color-danger-default)}.widget-menu .menu-item.is-danger nb-icon{color:var(--color-danger-default)}.widget-menu .menu-section{padding:.375rem .5rem .125rem;color:var(--text-hint-color);font-size:var(--text-caption-2-font-size);text-transform:uppercase}.widget-menu .menu-widths{display:flex;flex-wrap:wrap;gap:.25rem;padding:0 .5rem .375rem}.widget-menu .menu-widths .width-option{min-width:1.75rem;padding:.125rem .375rem;border:1px solid var(--border-basic-color-4);border-radius:var(--border-radius);background:transparent;color:var(--gauzy-text-color-2);font-size:var(--text-caption-font-size);cursor:pointer}.widget-menu .menu-widths .width-option:hover{background-color:var(--background-basic-color-3)}.widget-menu .menu-widths .width-option.selected{border-color:var(--color-primary-default);background-color:var(--color-primary-transparent-100);color:var(--color-primary-default)}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"], dependencies: [{ kind: "ngmodule", type: CommonModule }, { kind: "directive", type: i1.NgComponentOutlet, selector: "[ngComponentOutlet]", inputs: ["ngComponentOutlet", "ngComponentOutletInputs", "ngComponentOutletInjector", "ngComponentOutletEnvironmentInjector", "ngComponentOutletContent", "ngComponentOutletNgModule"], exportAs: ["ngComponentOutlet"] }, { kind: "ngmodule", type: NbButtonModule }, { kind: "component", type: i2.NbButtonComponent, selector: "button[nbButton],a[nbButton],input[type=\"button\"][nbButton],input[type=\"submit\"][nbButton]", inputs: ["hero"] }, { kind: "ngmodule", type: NbCardModule }, { kind: "component", type: i2.NbCardComponent, selector: "nb-card", inputs: ["size", "status", "accent"] }, { kind: "component", type: i2.NbCardBodyComponent, selector: "nb-card-body" }, { kind: "component", type: i2.NbCardHeaderComponent, selector: "nb-card-header" }, { kind: "ngmodule", type: NbIconModule }, { kind: "component", type: i2.NbIconComponent, selector: "nb-icon", inputs: ["icon", "pack", "options", "status", "config"] }, { kind: "ngmodule", type: NbPopoverModule }, { kind: "directive", type: i2.NbPopoverDirective, selector: "[nbPopover]", inputs: ["nbPopover", "nbPopoverContext", "nbPopoverPlacement", "nbPopoverAdjustment", "nbPopoverTrigger", "nbPopoverOffset", "nbTooltipDisabled", "nbPopoverClass"], outputs: ["nbPopoverShowStateChange"], exportAs: ["nbPopover"] }, { kind: "ngmodule", type: TranslateModule }, { kind: "pipe", type: i3.TranslatePipe, name: "translate" }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
};
DashboardWidgetHostComponent = __decorate([
    UntilDestroy(),
    __metadata("design:paramtypes", [])
], DashboardWidgetHostComponent);
export { DashboardWidgetHostComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: DashboardWidgetHostComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-dashboard-widget-host', standalone: true, imports: [CommonModule, NbButtonModule, NbCardModule, NbIconModule, NbPopoverModule, TranslateModule], changeDetection: ChangeDetectionStrategy.OnPush, template: "@if (!hidden() || editing()) {\n\t<nb-card class=\"widget-card\" [class.is-editing]=\"editing()\" [class.is-hidden]=\"hidden()\">\n\t\t<nb-card-header class=\"widget-header\">\n\t\t\t<span class=\"widget-title\" [attr.title]=\"title() | translate\">{{ title() | translate }}</span>\n\n\t\t\t@if (hidden()) {\n\t\t\t\t<span class=\"widget-badge\">{{ 'DASHBOARD_PAGE.BUILDER.HOST.HIDDEN' | translate }}</span>\n\t\t\t}\n\n\t\t\t@if (editing()) {\n\t\t\t\t<button\n\t\t\t\t\ttype=\"button\"\n\t\t\t\t\tnbButton\n\t\t\t\t\tghost\n\t\t\t\t\tsize=\"tiny\"\n\t\t\t\t\tclass=\"widget-menu-trigger\"\n\t\t\t\t\t[nbPopover]=\"widgetMenu\"\n\t\t\t\t\tnbPopoverTrigger=\"click\"\n\t\t\t\t\tnbPopoverPlacement=\"bottom\"\n\t\t\t\t\t[attr.aria-label]=\"'DASHBOARD_PAGE.BUILDER.HOST.WIDGET_MENU' | translate\"\n\t\t\t\t>\n\t\t\t\t\t<nb-icon icon=\"more-vertical-outline\"></nb-icon>\n\t\t\t\t</button>\n\t\t\t}\n\t\t</nb-card-header>\n\n\t\t<nb-card-body class=\"widget-body\">\n\t\t\t@switch (state()) {\n\t\t\t\t@case ('ready') {\n\t\t\t\t\t@if (component(); as widgetComponent) {\n\t\t\t\t\t\t<ng-container\n\t\t\t\t\t\t\t*ngComponentOutlet=\"widgetComponent; injector: widgetInjector(); inputs: widgetInputs()\"\n\t\t\t\t\t\t/>\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t\t@case ('loading') {\n\t\t\t\t\t<!-- Skeleton rather than a spinner: the card keeps its height, so the\n\t\t\t\t\t     canvas does not reflow when the widget bundle lands.\n\n\t\t\t\t\t     `<output>` (like the widget state components), not a `<div>`: a\n\t\t\t\t\t     role-less element DISCARDS `aria-label`, so the loading state was\n\t\t\t\t\t     announced as nothing at all. `<output>` carries an implicit\n\t\t\t\t\t     `status` live region \u2014 hence no explicit role \u2014 which also gets\n\t\t\t\t\t     the swap to the loaded content announced. -->\n\t\t\t\t\t<output\n\t\t\t\t\t\tclass=\"widget-skeleton\"\n\t\t\t\t\t\taria-busy=\"true\"\n\t\t\t\t\t\t[attr.aria-label]=\"'DASHBOARD_PAGE.BUILDER.HOST.LOADING' | translate\"\n\t\t\t\t\t>\n\t\t\t\t\t\t<span class=\"skeleton-line w-60\"></span>\n\t\t\t\t\t\t<span class=\"skeleton-line w-90\"></span>\n\t\t\t\t\t\t<span class=\"skeleton-line w-75\"></span>\n\t\t\t\t\t</output>\n\t\t\t\t}\n\t\t\t\t@case ('error') {\n\t\t\t\t\t<div class=\"widget-placeholder is-error\">\n\t\t\t\t\t\t<nb-icon icon=\"alert-triangle-outline\"></nb-icon>\n\t\t\t\t\t\t<p class=\"placeholder-title\">{{ 'DASHBOARD_PAGE.BUILDER.HOST.LOAD_FAILED' | translate }}</p>\n\t\t\t\t\t\t<p class=\"placeholder-hint\">{{ loadError() }}</p>\n\t\t\t\t\t\t<button type=\"button\" nbButton size=\"tiny\" status=\"basic\" (click)=\"retry()\">\n\t\t\t\t\t\t\t{{ 'DASHBOARD_PAGE.BUILDER.HOST.RETRY' | translate }}\n\t\t\t\t\t\t</button>\n\t\t\t\t\t</div>\n\t\t\t\t}\n\t\t\t\t@case ('forbidden') {\n\t\t\t\t\t<div class=\"widget-placeholder\">\n\t\t\t\t\t\t<nb-icon icon=\"lock-outline\"></nb-icon>\n\t\t\t\t\t\t<p class=\"placeholder-title\">{{ 'DASHBOARD_PAGE.BUILDER.HOST.NO_ACCESS' | translate }}</p>\n\t\t\t\t\t\t<p class=\"placeholder-hint\">{{ 'DASHBOARD_PAGE.BUILDER.HOST.NO_ACCESS_HINT' | translate }}</p>\n\t\t\t\t\t</div>\n\t\t\t\t}\n\t\t\t\t@default {\n\t\t\t\t\t<!-- The widget's plugin was disabled or the widget was removed: a saved\n\t\t\t\t\t     dashboard must stay usable instead of crashing. -->\n\t\t\t\t\t<div class=\"widget-placeholder\">\n\t\t\t\t\t\t<nb-icon icon=\"cube-outline\"></nb-icon>\n\t\t\t\t\t\t<p class=\"placeholder-title\">\n\t\t\t\t\t\t\t{{ 'DASHBOARD_PAGE.BUILDER.HOST.UNAVAILABLE' | translate }}\n\t\t\t\t\t\t</p>\n\t\t\t\t\t\t<p class=\"placeholder-hint\">\n\t\t\t\t\t\t\t{{ 'DASHBOARD_PAGE.BUILDER.HOST.UNAVAILABLE_HINT' | translate }}\n\t\t\t\t\t\t</p>\n\t\t\t\t\t\t<code class=\"placeholder-id\">{{ widgetId() }}</code>\n\t\t\t\t\t</div>\n\t\t\t\t}\n\t\t\t}\n\t\t</nb-card-body>\n\t</nb-card>\n}\n\n<!-- Edit-mode kebab menu -->\n<ng-template #widgetMenu>\n\t<div class=\"widget-menu\">\n\t\t<!-- Only offered when the widget actually declares settings, so the action\n\t\t     is never a dead end. -->\n\t\t@if (configurable()) {\n\t\t\t<button type=\"button\" class=\"menu-item\" (click)=\"onConfigure()\">\n\t\t\t\t<nb-icon icon=\"settings-2-outline\"></nb-icon>\n\t\t\t\t<span>{{ 'DASHBOARD_PAGE.BUILDER.HOST.CONFIGURE' | translate }}</span>\n\t\t\t</button>\n\t\t}\n\n\t\t@if (widthOptions().length > 1) {\n\t\t\t<div class=\"menu-section\">{{ 'DASHBOARD_PAGE.BUILDER.HOST.WIDTH' | translate }}</div>\n\t\t\t<div class=\"menu-widths\">\n\t\t\t\t@for (width of widthOptions(); track width) {\n\t\t\t\t\t<!-- The bare number is meaningless to a screen reader, and the\n\t\t\t\t\t     current width is otherwise conveyed by color alone. -->\n\t\t\t\t\t<button\n\t\t\t\t\t\ttype=\"button\"\n\t\t\t\t\t\tclass=\"width-option\"\n\t\t\t\t\t\t[class.selected]=\"width === placement().w\"\n\t\t\t\t\t\t[attr.aria-pressed]=\"width === placement().w\"\n\t\t\t\t\t\t[attr.aria-label]=\"'DASHBOARD_PAGE.BUILDER.HOST.WIDTH_COLUMNS' | translate: { count: width }\"\n\t\t\t\t\t\t(click)=\"onResize(width)\"\n\t\t\t\t\t>\n\t\t\t\t\t\t{{ width }}\n\t\t\t\t\t</button>\n\t\t\t\t}\n\t\t\t</div>\n\t\t}\n\n\t\t<button type=\"button\" class=\"menu-item is-danger\" (click)=\"onRemove()\">\n\t\t\t<nb-icon icon=\"trash-2-outline\"></nb-icon>\n\t\t\t<span>{{ 'DASHBOARD_PAGE.BUILDER.HOST.REMOVE' | translate }}</span>\n\t\t</button>\n\t</div>\n</ng-template>\n", styles: [":host{display:block;height:100%;min-width:0}.widget-card{display:flex;flex-direction:column;height:100%;margin:0;background-color:var(--background-basic-color-1);box-shadow:0 6px 20px #0000000d;border-radius:var(--border-radius);overflow:hidden}.widget-card.is-editing{border:1px dashed var(--gauzy-border-default-color)}.widget-card.is-hidden{opacity:.55}.widget-header{display:flex;align-items:center;gap:.5rem;padding:.75rem;background-color:transparent}.widget-title{flex:1 1 auto;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:.875rem;font-weight:600;line-height:1rem;color:var(--gauzy-text-color-2)}.widget-badge{flex:0 0 auto;padding:0 .375rem;border-radius:var(--border-radius);background-color:var(--gauzy-card-2);color:var(--gauzy-text-color-2);font-size:var(--text-caption-2-font-size);line-height:1.4;text-transform:uppercase}.widget-menu-trigger{flex:0 0 auto;padding:0}.widget-body{flex:1 1 auto;min-height:0;padding:0 .75rem .75rem;overflow:auto}.widget-card:has(gz-time-track-counter-card) .widget-header{padding:.75rem .75rem 0}.widget-card:has(gz-time-track-counter-card) .widget-title{font-size:12px;font-weight:500;line-height:1rem}.widget-card:has(gz-time-track-counter-card) .widget-body{padding:0 .75rem .75rem}.widget-skeleton{display:flex;flex-direction:column;gap:.625rem;padding:.25rem 0}.widget-skeleton .skeleton-line{display:block;height:.75rem;border-radius:var(--border-radius);background:linear-gradient(90deg,var(--background-basic-color-3) 25%,var(--background-basic-color-2) 50%,var(--background-basic-color-3) 75%);background-size:200% 100%;animation:ga-widget-skeleton 1.4s ease-in-out infinite}.widget-skeleton .skeleton-line.w-60{width:60%}.widget-skeleton .skeleton-line.w-75{width:75%}.widget-skeleton .skeleton-line.w-90{width:90%}@keyframes ga-widget-skeleton{0%{background-position:200% 0}to{background-position:-200% 0}}@media(prefers-reduced-motion:reduce){.widget-skeleton .skeleton-line{animation:none}}.widget-placeholder{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.375rem;height:100%;min-height:5rem;padding:.75rem;text-align:center;color:var(--text-hint-color)}.widget-placeholder nb-icon{font-size:1.5rem;color:var(--text-hint-color)}.widget-placeholder .placeholder-title{margin:0;font-size:var(--text-subtitle-2-font-size);color:var(--gauzy-text-color-1)}.widget-placeholder .placeholder-hint{margin:0;font-size:var(--text-caption-font-size);overflow-wrap:anywhere}.widget-placeholder .placeholder-id{font-size:var(--text-caption-2-font-size);color:var(--text-hint-color);overflow-wrap:anywhere}.widget-placeholder.is-error nb-icon,.widget-placeholder.is-error .placeholder-title{color:var(--color-danger-default)}.widget-menu{display:flex;flex-direction:column;min-width:11rem;padding:.25rem}.widget-menu .menu-item{display:flex;align-items:center;gap:.5rem;padding:.375rem .5rem;border:none;border-radius:var(--border-radius);background:transparent;color:var(--gauzy-text-color-1);font-size:var(--text-button-tiny-font-size);text-align:start;cursor:pointer}.widget-menu .menu-item nb-icon{font-size:1rem}.widget-menu .menu-item:hover{background-color:var(--background-basic-color-3)}.widget-menu .menu-item.is-danger{color:var(--color-danger-default)}.widget-menu .menu-item.is-danger nb-icon{color:var(--color-danger-default)}.widget-menu .menu-section{padding:.375rem .5rem .125rem;color:var(--text-hint-color);font-size:var(--text-caption-2-font-size);text-transform:uppercase}.widget-menu .menu-widths{display:flex;flex-wrap:wrap;gap:.25rem;padding:0 .5rem .375rem}.widget-menu .menu-widths .width-option{min-width:1.75rem;padding:.125rem .375rem;border:1px solid var(--border-basic-color-4);border-radius:var(--border-radius);background:transparent;color:var(--gauzy-text-color-2);font-size:var(--text-caption-font-size);cursor:pointer}.widget-menu .menu-widths .width-option:hover{background-color:var(--background-basic-color-3)}.widget-menu .menu-widths .width-option.selected{border-color:var(--color-primary-default);background-color:var(--color-primary-transparent-100);color:var(--color-primary-default)}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"] }]
        }], ctorParameters: () => [], propDecorators: { placement: [{ type: i0.Input, args: [{ isSignal: true, alias: "placement", required: true }] }], editing: [{ type: i0.Input, args: [{ isSignal: true, alias: "editing", required: false }] }], removed: [{ type: i0.Output, args: ["removed"] }], configureRequested: [{ type: i0.Output, args: ["configureRequested"] }], resized: [{ type: i0.Output, args: ["resized"] }], popover: [{ type: i0.ViewChild, args: [i0.forwardRef(() => NbPopoverDirective), { isSignal: true }] }] } });
//# sourceMappingURL=dashboard-widget-host.component.js.map