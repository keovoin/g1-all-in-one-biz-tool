import { __decorate } from "tslib";
import { DestroyRef, Directive, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { UntilDestroy } from '@ngneat/until-destroy';
import { DASHBOARD_WIDGET_CONFIG, DASHBOARD_WIDGET_CONTEXT } from '@gauzy/ui-core/core';
import * as i0 from "@angular/core";
/**
 * Base class for every widget rendered on a dashboard canvas.
 *
 * A canvas-hosted widget is instantiated dynamically by
 * `DashboardWidgetHostComponent`, so it cannot rely on the page-level selector
 * components (date range picker, employee/project selectors) being its
 * ancestors. Instead the host provides the ambient selection through
 * {@link DASHBOARD_WIDGET_CONTEXT} — already narrowed by the placement's own
 * configuration — and the persisted per-instance settings through
 * {@link DASHBOARD_WIDGET_CONFIG}.
 *
 * Subclasses only have to override {@link refresh} and render from
 * {@link loading} / {@link error} / their own data.
 *
 * @example
 * ```ts
 * (at)UntilDestroy()
 * (at)Component({ selector: 'ga-members-worked-widget', standalone: true, templateUrl: './...' })
 * export class MembersWorkedWidgetComponent extends BaseDashboardWidgetComponent {
 *   readonly members = signal<IEmployee[]>([]);
 *
 *   override refresh(): void {
 *     const context = this.context();
 *     if (!context) return;
 *     this.loading.set(true);
 *     this.service.getMembers(context).pipe(untilDestroyed(this)).subscribe({
 *       next: (members) => { this.members.set(members); this.loading.set(false); },
 *       error: (error) => this.setError(error)
 *     });
 *   }
 * }
 * ```
 *
 * NOTE for subclasses: this class is decorated with `@UntilDestroy()` so
 * `untilDestroyed(this)` already works, BUT a subclass that declares its own
 * `ngOnDestroy` shadows the patched one — such subclasses must be decorated
 * with `@UntilDestroy()` themselves (the repo-wide convention anyway).
 */
let BaseDashboardWidgetComponent = class BaseDashboardWidgetComponent {
    constructor() {
        /**
         * Ambient dashboard context — organization, reporting window and the
         * employee/project/team scope, already narrowed by this placement's config.
         */
        this.context$ = inject(DASHBOARD_WIDGET_CONTEXT);
        /**
         * Latest emitted context, for imperative reads inside handlers and templates.
         * `undefined` until the canvas has resolved an organization.
         */
        this.context = toSignal(this.context$);
        /**
         * Persisted per-instance configuration of this widget placement.
         * Empty object when the widget has no settings, so `this.config['x']` is safe.
         */
        this.config = inject(DASHBOARD_WIDGET_CONFIG, { optional: true }) ?? {};
        /** True while the widget is fetching its data. Drives the widget's spinner. */
        this.loading = signal(false, ...(ngDevMode ? [{ debugName: "loading" }] : []));
        /** Message of the last failed load, or `null`. Drives the widget's error state. */
        this.error = signal(null, ...(ngDevMode ? [{ debugName: "error" }] : []));
        /** Used for subscriptions owned by this base class (never shadowed by subclasses). */
        this.destroyRef = inject(DestroyRef);
        /**
         * Whether {@link refresh} is re-run every time the ambient context changes
         * (date range, organization, employee/project/team scope).
         *
         * Widgets that fetch nothing — or that manage their own triggers — override
         * this with `false` and get a single {@link refresh} call instead.
         */
        this.refreshOnContextChange = true;
    }
    /**
     * Wires the automatic refresh.
     *
     * Deliberately done in `ngOnInit` rather than the constructor: the context
     * stream is replayed, so subscribing during construction would call
     * {@link refresh} before the subclass' own field initializers had run.
     *
     * Subclasses overriding this method MUST call `super.ngOnInit()`.
     */
    ngOnInit() {
        if (!this.refreshOnContextChange) {
            this.refresh();
            return;
        }
        this.context$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.refresh());
    }
    /**
     * Loads (or reloads) the widget's data.
     *
     * Called once the context is available, again whenever it changes, and by the
     * host's "Retry" action. The base implementation does nothing.
     */
    refresh() {
        // Intentionally empty — widgets with no data source need no work here.
    }
    /**
     * Reads a typed value out of the per-instance configuration.
     *
     * @param key - Configuration key, as declared in the widget's `configSchema`.
     * @param fallback - Returned when the key is absent or `null`/`undefined`.
     */
    getConfig(key, fallback) {
        const value = this.config?.[key];
        return (value ?? fallback);
    }
    /**
     * Puts the widget into its error state and clears the loading flag.
     *
     * @param error - Anything thrown/emitted by the failing call.
     */
    setError(error) {
        this.loading.set(false);
        this.error.set(toErrorMessage(error));
    }
    /** Clears the error state (typically before starting a new load). */
    clearError() {
        this.error.set(null);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: BaseDashboardWidgetComponent, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "21.0.7", type: BaseDashboardWidgetComponent, isStandalone: true, ngImport: i0 }); }
};
BaseDashboardWidgetComponent = __decorate([
    UntilDestroy()
], BaseDashboardWidgetComponent);
export { BaseDashboardWidgetComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: BaseDashboardWidgetComponent, decorators: [{
            type: Directive
        }] });
/**
 * Best-effort human readable message for an unknown thrown value.
 *
 * Kept outside the class so widgets and the host can share the same behaviour
 * without inheriting from each other.
 *
 * @param error - Anything thrown, emitted or rejected.
 */
export function toErrorMessage(error) {
    if (!error) {
        return 'Unknown error';
    }
    if (typeof error === 'string') {
        return error;
    }
    if (error instanceof Error) {
        return error.message;
    }
    const message = error?.message;
    return typeof message === 'string' ? message : 'Unknown error';
}
//# sourceMappingURL=base-dashboard-widget.component.js.map