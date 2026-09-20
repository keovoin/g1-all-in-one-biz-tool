import { computed, Directive, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { combineLatest, of, Subject } from 'rxjs';
import { catchError, filter, map, startWith, switchMap, tap } from 'rxjs/operators';
import { TimesheetStatisticsCacheService } from '@gauzy/ui-core/core';
import { BaseDashboardWidgetComponent } from '@gauzy/ui-core/shared';
import { isCurrentWeekRange, resolvePeriodSeconds, resolveRangePeriod, toErrorMessage } from './time-track-widget.utils';
import * as i0 from "@angular/core";
/**
 * Shared data layer for every Time Tracking counter widget.
 *
 * All six counters are projections of the very same
 * `/timesheet/statistics/counts` payload, so they all subscribe to the ambient
 * dashboard context here and fetch through {@link TimesheetStatisticsCacheService}.
 * The cache collapses the six identical in-flight requests into one — which is
 * the whole reason a counter is cheap enough to be dropped on a canvas six times.
 *
 * Subclasses only decide *which* number of the payload they show and how it is
 * formatted; they never fetch.
 */
export class BaseTimeTrackCounterWidgetComponent extends BaseDashboardWidgetComponent {
    constructor() {
        super(...arguments);
        this._statisticsCache = inject(TimesheetStatisticsCacheService);
        /** Manual re-fetch trigger, fed by {@link refresh}. */
        this._reload$ = new Subject();
        /** Latest counts payload; `null` until the first successful fetch. */
        this.counts = signal(null, ...(ngDevMode ? [{ debugName: "counts" }] : []));
        /** Context the current payload was fetched for; powers the period-aware titles. */
        this.widgetContext = signal(null, ...(ngDevMode ? [{ debugName: "widgetContext" }] : []));
        /** Day / week / arbitrary-period classification of the selected range. */
        this.rangePeriod = computed(() => resolveRangePeriod(this.widgetContext()), ...(ngDevMode ? [{ debugName: "rangePeriod" }] : []));
        /** True when the selected range is exactly the current calendar week. */
        this.isCurrentWeek = computed(() => isCurrentWeekRange(this.widgetContext()), ...(ngDevMode ? [{ debugName: "isCurrentWeek" }] : []));
        /** Workable seconds in the range across all members — the duration counters' denominator. */
        this.periodSeconds = computed(() => resolvePeriodSeconds(this.widgetContext(), this.counts()?.employeesCount ?? 0), ...(ngDevMode ? [{ debugName: "periodSeconds" }] : []));
        /** Displayable form of the base class' `error` signal. */
        this.errorMessage = computed(() => toErrorMessage(this.error()), ...(ngDevMode ? [{ debugName: "errorMessage" }] : []));
    }
    /**
     * Starts the counts subscription.
     *
     * Deliberately does NOT call `super.ngOnInit()`: the base class' default is to
     * call {@link refresh} on every context emission, which here would push an
     * extra value through `_reload$` and fetch the same payload twice. This class
     * subscribes to `context$` itself instead.
     *
     * Subclasses that need extra data (total members, total projects) override
     * this and must call `super.ngOnInit()`.
     */
    ngOnInit() {
        // Show the skeleton from the very first paint: the canvas may take a moment
        // to resolve an organization, and a hard "0" would read as real data.
        this.loading.set(true);
        this.observeCounts();
    }
    /**
     * Re-fetches the counts payload, clearing any previous error first.
     *
     * Invoked by the widget host's refresh control and by the card's retry button.
     */
    refresh() {
        this.error.set(null);
        // Without dropping the cached payload a manual refresh inside the cache TTL
        // would silently replay the stale numbers. `invalidate()` coalesces per
        // scope, so all six counters refreshing at once still cause one request.
        const context = this.widgetContext();
        if (context) {
            this._statisticsCache.invalidate(context);
        }
        this._reload$.next();
    }
    /**
     * Wires `context$` (plus manual reloads) to the cached counts endpoint and
     * mirrors the request lifecycle into the `loading` / `error` signals.
     */
    observeCounts() {
        combineLatest([this.context$, this._reload$.pipe(startWith(undefined))])
            .pipe(map(([context]) => context), 
        // A context without an organization cannot produce a meaningful
        // request; the canvas shows the "select an organization" state.
        filter((context) => !!context?.organizationId), tap((context) => {
            this.widgetContext.set(context);
            this.loading.set(true);
            this.error.set(null);
        }), 
        // switchMap, not mergeMap: a fast date-range change must abandon
        // the previous request instead of racing it to the signal.
        switchMap((context) => 
        // The cache service takes the context itself and does the
        // request shaping (`buildStatisticsRequest`) — reproducing it
        // here is what makes a widget disagree with the standard
        // dashboard about the UTC offset.
        this._statisticsCache.getCounts(context).pipe(catchError((error) => {
            this.error.set(toErrorMessage(error));
            return of(null);
        }))), tap((counts) => {
            // Keep the last good payload on screen when a refresh fails,
            // rather than blanking a working widget.
            if (counts) {
                this.counts.set(counts);
            }
            this.loading.set(false);
        }), takeUntilDestroyed(this.destroyRef))
            .subscribe();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: BaseTimeTrackCounterWidgetComponent, deps: null, target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "21.0.7", type: BaseTimeTrackCounterWidgetComponent, isStandalone: true, usesInheritance: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: BaseTimeTrackCounterWidgetComponent, decorators: [{
            type: Directive
        }] });
//# sourceMappingURL=base-time-track-counter-widget.component.js.map