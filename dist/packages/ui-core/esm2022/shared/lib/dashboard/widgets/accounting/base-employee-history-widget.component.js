import { Directive, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject, combineLatest, of } from 'rxjs';
import { catchError, distinctUntilChanged, filter, map, startWith, switchMap, tap } from 'rxjs/operators';
import { BaseDashboardWidgetComponent } from '../../widget-host/base-dashboard-widget.component';
// Reused rather than re-derived: the history endpoint is scoped exactly like the
// `/employee-statistics/months` one the HR widgets read, so both the employee
// resolution and the "did the request scope actually move?" fingerprint (which
// tolerates a bookmark-restored, string-serialized date) are already written.
import { hrStatisticsKey, resolveHrEmployeeId } from '../hr/hr-statistics.utils';
import { AccountingStatisticsCacheService } from './accounting-statistics-cache.service';
import * as i0 from "@angular/core";
/**
 * Shared data layer for the two employee-scoped history widgets (Records History
 * and Profit History).
 *
 * Both render a component that used to exist ONLY as a modal dialog, fed by the
 * Human Resources page. On a canvas there is no opener to hand them their rows,
 * so this class does what `HumanResourcesComponent.openHistoryDialog()` /
 * `openProfitDialog()` did: resolve the employee in scope, fetch from
 * `/employee-statistics/history` through {@link AccountingStatisticsCacheService}
 * (which collapses the requests both widgets share into one), and mirror the
 * request lifecycle into the `loading` / `error` signals.
 *
 * Subclasses only decide WHICH requests make up their payload.
 *
 * @typeParam T - Shape of the payload the subclass renders.
 */
export class BaseEmployeeHistoryWidgetComponent extends BaseDashboardWidgetComponent {
    constructor() {
        super(...arguments);
        this.statisticsCache = inject(AccountingStatisticsCacheService);
        /** Manual re-fetch trigger, fed by {@link refresh}. */
        this._reload$ = new Subject();
        /** Context the current payload was fetched for. */
        this.widgetContext = signal(null, ...(ngDevMode ? [{ debugName: "widgetContext" }] : []));
        /** Latest payload; `null` until the first successful fetch. */
        this.payload = signal(null, ...(ngDevMode ? [{ debugName: "payload" }] : []));
        /** The employee the history is about, or `null` when none is in scope. */
        this.employeeId = computed(() => resolveHrEmployeeId(this.widgetContext()), ...(ngDevMode ? [{ debugName: "employeeId" }] : []));
        /**
         * True when the widget has nothing to query.
         *
         * `/employee-statistics/history` is per-employee, so with the selector on "All
         * employees" there is no request to make — the widget shows an actionable hint
         * instead of an empty table that looks like "this person has no records".
         */
        this.requiresEmployee = computed(() => !!this.widgetContext() && !this.employeeId(), ...(ngDevMode ? [{ debugName: "requiresEmployee" }] : []));
    }
    /**
     * Starts the history subscription.
     *
     * Deliberately does NOT call `super.ngOnInit()`: the base class' default is to
     * call {@link refresh} on every context emission, which here would push an
     * extra value through the reload trigger and fetch the same payload twice.
     * This class subscribes to `context$` itself instead.
     */
    ngOnInit() {
        // Show the skeleton from the very first paint: the canvas may take a moment
        // to resolve an organization, and an empty table would read as real data.
        this.loading.set(true);
        this.observeHistory();
    }
    /**
     * Re-fetches the payload, clearing any previous error first.
     *
     * Invoked by the widget host's refresh control and by the state wrapper's
     * retry button.
     */
    refresh() {
        this.clearError();
        // Without dropping the cached payload a manual refresh inside the cache TTL
        // would silently replay the stale rows. The cache coalesces invalidations per
        // scope, so several history widgets refreshing at once still cause one
        // request per distinct scope.
        const context = this.widgetContext();
        const employeeId = this.employeeId();
        if (context && employeeId) {
            this.invalidate(context, employeeId);
        }
        this._reload$.next();
    }
    /**
     * Wires `context$` (plus manual reloads) to {@link fetch} and mirrors the
     * request lifecycle into the `loading` / `error` signals.
     */
    observeHistory() {
        // `distinctUntilChanged` sits on the CONTEXT, before the reload trigger is
        // merged in: applying it afterwards would swallow a manual refresh whose
        // context has not changed — which is every manual refresh.
        const scoped$ = this.context$.pipe(
        // A context without an organization cannot produce a meaningful request;
        // the canvas shows the "select an organization" state.
        filter((context) => !!context?.organizationId), distinctUntilChanged((previous, current) => hrStatisticsKey(previous) === hrStatisticsKey(current)));
        combineLatest([scoped$, this._reload$.pipe(startWith(undefined))])
            .pipe(map(([context]) => context), tap((context) => {
            this.widgetContext.set(context);
            this.loading.set(true);
            this.clearError();
        }), 
        // switchMap, not mergeMap: a fast employee or date-range change must
        // abandon the previous request instead of racing it to the signal.
        switchMap((context) => this.fetchFor(context)), tap((payload) => {
            // `null` marks a failed request: `setError` has already run and the
            // last good payload stays on screen rather than blanking the widget.
            if (payload !== null) {
                this.payload.set(payload);
            }
            this.loading.set(false);
        }), takeUntilDestroyed(this.destroyRef))
            .subscribe();
    }
    /**
     * One fetch for the given context, or nothing when there is no employee.
     *
     * @param context - The context to query for.
     * @returns The payload, or `null` when the request failed.
     */
    fetchFor(context) {
        const employeeId = resolveHrEmployeeId(context);
        if (!employeeId) {
            // No employee in scope: `requiresEmployee` renders the hint, and the
            // previous employee's records must not linger behind it.
            this.payload.set(null);
            return of(null);
        }
        return this.fetch(context, employeeId).pipe(catchError((error) => {
            this.setError(error);
            return of(null);
        }));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: BaseEmployeeHistoryWidgetComponent, deps: null, target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "21.0.7", type: BaseEmployeeHistoryWidgetComponent, isStandalone: true, usesInheritance: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: BaseEmployeeHistoryWidgetComponent, decorators: [{
            type: Directive
        }] });
//# sourceMappingURL=base-employee-history-widget.component.js.map