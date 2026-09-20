import { CurrencyPipe } from '@angular/common';
import { computed, Directive, inject, LOCALE_ID, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NbDialogService } from '@nebular/theme';
import { combineLatest, from, of, Subject } from 'rxjs';
import { catchError, distinctUntilChanged, filter, map, startWith, switchMap, take, tap } from 'rxjs/operators';
import { EmployeeStatisticsService, ErrorHandlingService } from '@gauzy/ui-core/core';
import { CurrencyPositionPipe } from '../../../pipes/currency-position.pipe';
import { BaseDashboardWidgetComponent } from '../../widget-host/base-dashboard-widget.component';
// Deliberately the CHART family's cache: both widget families project the very
// same `/employee-statistics/months` response, and a second cache beside it
// would mean an HR block and an employee chart pinned to the same person issue
// two identical requests. One cache, one request — whoever asks first wins.
import { EmployeeMonthStatisticsCacheService } from '../charts/employee-month-statistics-cache.service';
import { hrStatisticsKey, resolveHrEmployeeId, sumHrStatistics } from './hr-statistics.utils';
import * as i0 from "@angular/core";
/**
 * Shared data layer for every Human Resources info-block widget.
 *
 * All nine blocks are projections of the very same
 * `/employee-statistics/months` payload, so they all subscribe to the ambient
 * dashboard context here and fetch through
 * {@link EmployeeMonthStatisticsCacheService}, which collapses their nine
 * identical in-flight requests into one — that is the whole reason a block is
 * cheap enough to be dropped on a canvas nine times.
 *
 * Subclasses only decide *which* number of the payload they show, how it is
 * labelled, and which history dialog (if any) it opens; they never fetch.
 */
export class BaseHrInfoWidgetComponent extends BaseDashboardWidgetComponent {
    constructor() {
        super(...arguments);
        this._statisticsCache = inject(EmployeeMonthStatisticsCacheService);
        /** Surfaces secondary (dialog) failures without touching the widget's own state. */
        this._errorHandling = inject(ErrorHandlingService);
        /** Record-level history behind the aggregates; used by the history dialogs. */
        this.employeeStatistics = inject(EmployeeStatisticsService);
        /**
         * Optional on purpose: `NbDialogService` comes from `NbDialogModule.forRoot()`.
         * A widget is created through the host's own injector and may be rendered by a
         * shell that never registered it, and a missing history dialog must not take
         * the whole figure down with a NullInjectorError.
         */
        this.dialogs = inject(NbDialogService, { optional: true });
        /** Built by hand (rather than injected) so the widget needs no `providers`. */
        this._currencyPipe = new CurrencyPipe(inject(LOCALE_ID));
        this._currencyPositionPipe = new CurrencyPositionPipe();
        /** Manual re-fetch trigger, fed by {@link refresh}. */
        this._reload$ = new Subject();
        /** Latest context, for the labels and the history dialogs. */
        this.widgetContext = signal(null, ...(ngDevMode ? [{ debugName: "widgetContext" }] : []));
        /** Latest monthly rows; `null` until the first successful fetch. */
        this.statistics = signal(null, ...(ngDevMode ? [{ debugName: "statistics" }] : []));
        /** Everything the blocks render, derived from {@link statistics}. */
        this.totals = computed(() => sumHrStatistics(this.statistics()), ...(ngDevMode ? [{ debugName: "totals" }] : []));
        /** The employee the figures are about, or `null` when none is in scope. */
        this.employeeId = computed(() => resolveHrEmployeeId(this.widgetContext()), ...(ngDevMode ? [{ debugName: "employeeId" }] : []));
        /** Drives the card's "select an employee" empty state. */
        this.hasEmployee = computed(() => !!this.employeeId(), ...(ngDevMode ? [{ debugName: "hasEmployee" }] : []));
        /** ISO currency code the amounts are formatted in. */
        this.currency = computed(() => {
            const context = this.widgetContext();
            return context?.organization?.currency || context?.currency || '';
        }, ...(ngDevMode ? [{ debugName: "currency" }] : []));
        /** Whether the symbol goes before or after the amount. */
        this.currencyPosition = computed(() => this.widgetContext()?.organization?.currencyPosition ?? '', ...(ngDevMode ? [{ debugName: "currencyPosition" }] : []));
        /** The organization's bonus rule, or `null` when it pays no bonuses. */
        this.bonusType = computed(() => this.widgetContext()?.organization?.bonusType ?? null, ...(ngDevMode ? [{ debugName: "bonusType" }] : []));
        /** Percentage the organization's bonus rule applies. */
        this.bonusPercentage = computed(() => this.widgetContext()?.organization?.bonusPercentage ?? 0, ...(ngDevMode ? [{ debugName: "bonusPercentage" }] : []));
    }
    /**
     * Starts the context and statistics subscriptions.
     *
     * Deliberately does NOT call `super.ngOnInit()`: the base class' default is to
     * call {@link refresh} on every context emission, which here would push an
     * extra value through `_reload$` and fetch the same payload twice.
     */
    ngOnInit() {
        // Show the skeleton from the very first paint: the canvas may take a moment
        // to resolve an organization, and a hard "0" would read as real data.
        this.loading.set(true);
        this.observeContext();
        this.observeStatistics();
    }
    /**
     * Re-fetches the statistics payload, clearing any previous error first.
     *
     * Invoked by the widget host's refresh control and by the card's retry button.
     */
    refresh() {
        this.error.set(null);
        // Without dropping the cached payload a manual refresh inside the cache TTL
        // would silently replay the stale numbers. `invalidate()` coalesces per
        // scope, so all nine blocks refreshing at once still cause one request.
        const context = this.widgetContext();
        const employeeId = this.employeeId();
        if (context && employeeId) {
            this._statisticsCache.invalidate(context, employeeId);
        }
        this._reload$.next();
    }
    /**
     * Formats an amount the way the legacy Human Resources page does: through the
     * `currency` pipe, then repositioned per the organization's preference.
     *
     * @param amount - The raw amount.
     * @returns The display string; the bare number when no currency is configured.
     */
    formatAmount(amount) {
        const value = Number(amount) || 0;
        const currency = this.currency();
        if (!currency) {
            return `${value}`;
        }
        const formatted = this._currencyPipe.transform(value, currency) ?? `${value}`;
        try {
            return this._currencyPositionPipe.transform(formatted, this.currencyPosition());
        }
        catch {
            // `CurrencyPositionPipe.extract()` indexes the result of `RegExp.exec()`
            // without a null check, so a formatted value that carries no symbol at
            // all throws. The formatted string, unmoved, is a fine fallback.
            return formatted;
        }
    }
    /**
     * Colour for an amount that is only "good" while it is positive.
     *
     * @param amount - The raw amount.
     * @param positive - Colour used at or above zero.
     * @param negative - Colour used below zero.
     */
    signedColor(amount, positive, negative) {
        return amount >= 0 ? positive : negative;
    }
    /**
     * Opens the records-history dialog for one of this employee's figures.
     *
     * @param type - Which history to load; `null`/`undefined` makes the click inert
     *               (the bonus blocks have no history behind them, exactly as on
     *               the legacy page).
     */
    openHistory(type) {
        const context = this.widgetContext();
        const employeeId = this.employeeId();
        if (!type || !context || !employeeId || !this.dialogs) {
            return;
        }
        const { startDate, endDate, organizationId, tenantId } = context;
        from(Promise.all([
            this.employeeStatistics.getEmployeeStatisticsHistory({
                employeeId,
                startDate,
                endDate,
                type,
                organizationId,
                tenantId
            }),
            this.loadDeclaredComponent(() => import('../../records-history/records-history.module'), () => import('../../records-history/records-history.component'), (module) => module.RecordsHistoryComponent)
        ]))
            .pipe(take(1), catchError((error) => {
            this.reportActionError(error);
            return of(null);
        }), takeUntilDestroyed(this.destroyRef))
            .subscribe((resolved) => {
            if (!resolved) {
                return;
            }
            const [records, component] = resolved;
            this.dialogs?.open(component, { context: { type, records } });
        });
    }
    /**
     * Reports the failure of a SECONDARY action (a history dialog) without
     * touching the widget's own state.
     *
     * Routing these through `setError()` would put an already-loaded card into
     * its error state, hiding correct totals behind a retry button because an
     * optional, read-only dialog failed to open.
     *
     * @param error - Anything thrown or rejected by the dialog's data/bundle load.
     */
    reportActionError(error) {
        try {
            this._errorHandling.handleError(error);
        }
        catch {
            // The toast stack lives in `NbToastrModule.forRoot()`. A widget is
            // created through the host's own injector and may be rendered by a
            // shell that never registered it — a missing toast must not turn one
            // swallowed failure into two.
            console.error('Dashboard widget action failed', error);
        }
    }
    /**
     * Loads a component that is DECLARED in an NgModule (not standalone).
     *
     * Importing only the component file is not enough: Ivy registers a declared
     * component's template scope when the *NgModule* file is evaluated, so a
     * dialog opened without that would render with its own directives unresolved.
     * Both files are therefore imported, and both stay out of the widget's initial
     * chunk — history dialogs drag in the whole smart-table stack.
     *
     * @param loadModule - Dynamic import of the declaring NgModule file.
     * @param loadComponent - Dynamic import of the component file.
     * @param pick - Selects the component class from the component module's exports.
     */
    async loadDeclaredComponent(loadModule, loadComponent, pick) {
        const [, componentModule] = await Promise.all([loadModule(), loadComponent()]);
        return pick(componentModule);
    }
    /** Mirrors every context emission into {@link widgetContext} for the labels. */
    observeContext() {
        this.context$
            .pipe(tap((context) => this.widgetContext.set(context)), takeUntilDestroyed(this.destroyRef))
            .subscribe();
    }
    /**
     * Wires `context$` (plus manual reloads) to the cached statistics endpoint and
     * mirrors the request lifecycle into the `loading` / `error` signals.
     */
    observeStatistics() {
        const request$ = this.context$.pipe(
        // A context without an organization cannot produce a meaningful request.
        filter((context) => !!context?.organizationId), 
        // Only the fields the request is actually built from. Without this, a
        // project or team selection — which this endpoint does not even accept —
        // would refetch the identical payload on every canvas.
        distinctUntilChanged((previous, current) => hrStatisticsKey(previous) === hrStatisticsKey(current)));
        combineLatest([request$, this._reload$.pipe(startWith(undefined))])
            .pipe(map(([context]) => context), tap(() => this.error.set(null)), 
        // switchMap, not mergeMap: a fast date-range change must abandon the
        // previous request instead of racing it to the signal.
        switchMap((context) => {
            const employeeId = resolveHrEmployeeId(context);
            if (!employeeId) {
                // Nothing to fetch — and the previous employee's numbers must go,
                // or the card would keep showing them under an empty selection.
                this.statistics.set(null);
                this.loading.set(false);
                return of(null);
            }
            this.loading.set(true);
            return this._statisticsCache.getMonthStatistics(context, employeeId).pipe(catchError((error) => {
                this.setError(error);
                return of(null);
            }));
        }), tap((rows) => {
            // Keep the last good payload on screen when a refresh fails, rather
            // than blanking a working widget.
            if (rows) {
                this.statistics.set(rows);
            }
            this.loading.set(false);
        }), takeUntilDestroyed(this.destroyRef))
            .subscribe();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: BaseHrInfoWidgetComponent, deps: null, target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "21.0.7", type: BaseHrInfoWidgetComponent, isStandalone: true, usesInheritance: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: BaseHrInfoWidgetComponent, decorators: [{
            type: Directive
        }] });
//# sourceMappingURL=base-hr-info-widget.component.js.map