import { DestroyRef, OnInit, Signal } from '@angular/core';
import { Observable } from 'rxjs';
import { IDashboardWidgetContext } from '@gauzy/ui-core/core';
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
export declare abstract class BaseDashboardWidgetComponent implements OnInit {
    /**
     * Ambient dashboard context — organization, reporting window and the
     * employee/project/team scope, already narrowed by this placement's config.
     */
    protected readonly context$: Observable<IDashboardWidgetContext>;
    /**
     * Latest emitted context, for imperative reads inside handlers and templates.
     * `undefined` until the canvas has resolved an organization.
     */
    protected readonly context: Signal<IDashboardWidgetContext | undefined>;
    /**
     * Persisted per-instance configuration of this widget placement.
     * Empty object when the widget has no settings, so `this.config['x']` is safe.
     */
    protected readonly config: Record<string, unknown>;
    /** True while the widget is fetching its data. Drives the widget's spinner. */
    readonly loading: import("@angular/core").WritableSignal<boolean>;
    /** Message of the last failed load, or `null`. Drives the widget's error state. */
    readonly error: import("@angular/core").WritableSignal<string>;
    /** Used for subscriptions owned by this base class (never shadowed by subclasses). */
    protected readonly destroyRef: DestroyRef;
    /**
     * Whether {@link refresh} is re-run every time the ambient context changes
     * (date range, organization, employee/project/team scope).
     *
     * Widgets that fetch nothing — or that manage their own triggers — override
     * this with `false` and get a single {@link refresh} call instead.
     */
    protected readonly refreshOnContextChange: boolean;
    /**
     * Wires the automatic refresh.
     *
     * Deliberately done in `ngOnInit` rather than the constructor: the context
     * stream is replayed, so subscribing during construction would call
     * {@link refresh} before the subclass' own field initializers had run.
     *
     * Subclasses overriding this method MUST call `super.ngOnInit()`.
     */
    ngOnInit(): void;
    /**
     * Loads (or reloads) the widget's data.
     *
     * Called once the context is available, again whenever it changes, and by the
     * host's "Retry" action. The base implementation does nothing.
     */
    refresh(): void;
    /**
     * Reads a typed value out of the per-instance configuration.
     *
     * @param key - Configuration key, as declared in the widget's `configSchema`.
     * @param fallback - Returned when the key is absent or `null`/`undefined`.
     */
    protected getConfig<T>(key: string, fallback: T): T;
    /**
     * Puts the widget into its error state and clears the loading flag.
     *
     * @param error - Anything thrown/emitted by the failing call.
     */
    protected setError(error: unknown): void;
    /** Clears the error state (typically before starting a new load). */
    protected clearError(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<BaseDashboardWidgetComponent, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<BaseDashboardWidgetComponent, never, never, {}, {}, never, never, true, never>;
}
/**
 * Best-effort human readable message for an unknown thrown value.
 *
 * Kept outside the class so widgets and the host can share the same behaviour
 * without inheriting from each other.
 *
 * @param error - Anything thrown, emitted or rejected.
 */
export declare function toErrorMessage(error: unknown): string;
