import { Observable } from 'rxjs';
import { ID, IMonthAggregatedEmployeeStatistics, IMonthAggregatedEmployeeStatisticsFindInput } from '@gauzy/contracts';
import { IDashboardWidgetContext } from '@gauzy/ui-core/core';
import * as i0 from "@angular/core";
/**
 * Builds the `/employee-statistics/months` request for a dashboard context.
 *
 * Parity-critical: it reproduces `HumanResourcesComponent.getEmployeeStatistics()`
 * exactly — including the `toUTC(...)` conversion, without which the widgets
 * would silently report a different set of months than the HR dashboard for the
 * same selection.
 *
 * @param context - The ambient dashboard context.
 * @param employeeId - The employee the statistics are for.
 * @returns The find input the months endpoint expects.
 */
export declare function buildMonthStatisticsRequest(context: IDashboardWidgetContext, employeeId: ID): IMonthAggregatedEmployeeStatisticsFindInput;
/**
 * Request-coalescing cache in front of
 * {@link EmployeeStatisticsService.getAggregatedStatisticsByEmployeeId}.
 *
 * The four employee chart widgets are four renderings of ONE
 * `/employee-statistics/months` response — exactly like the six Time Tracking
 * counters share one counts payload. Without this service, a canvas showing the
 * doughnut next to the bar chart would issue two identical requests on every
 * date-range change.
 *
 * Mirrors `TimesheetStatisticsCacheService` and `AccountingStatisticsCacheService`:
 * keyed by the request scope, entries expire after {@link STATISTICS_CACHE_TTL_MS},
 * and the returned observables are long-lived so they re-resolve after an
 * {@link invalidate}.
 *
 * Errors are NOT swallowed — widgets need them to render an error state. As usual
 * in RxJS an error terminates the subscription, so a widget's `refresh()` has to
 * RE-CALL {@link getMonthStatistics} (re-subscribe) rather than merely call
 * {@link invalidate}, or a failed widget could never recover. The failed entry is
 * evicted on error, so that re-call always hits the network.
 */
export declare class EmployeeMonthStatisticsCacheService {
    private readonly _employeeStatisticsService;
    private readonly _cache;
    private readonly _invalidated$;
    /** Guards against the refresh stampede described on {@link INVALIDATE_COALESCE_MS}. */
    private _lastInvalidatedKey;
    private _lastInvalidatedAt;
    /** Emits after every effective invalidation. */
    readonly invalidated$: Observable<void>;
    /**
     * Monthly aggregated statistics for one employee over the context's range.
     *
     * @param context - The dashboard context to query for.
     * @param employeeId - The employee the statistics are for.
     * @returns A shared stream that re-resolves after every invalidation.
     */
    getMonthStatistics(context: IDashboardWidgetContext, employeeId: ID): Observable<IMonthAggregatedEmployeeStatistics[]>;
    /**
     * Drops cached responses so the next subscriber re-fetches, and notifies live
     * streams to re-resolve.
     *
     * Repeated calls for the same scope within {@link INVALIDATE_COALESCE_MS} are
     * ignored, so every chart widget may safely call this from its own `refresh()`
     * without causing a request storm.
     *
     * @param context - Limit the invalidation to one context; omit to drop everything.
     * @param employeeId - The employee scope, required alongside `context`.
     */
    invalidate(context?: IDashboardWidgetContext, employeeId?: ID): void;
    /**
     * Unconditionally empties the cache — no coalescing, no notification.
     *
     * Use on hard boundaries (sign-out, organization switch) where replaying a
     * previous tenant's numbers would be wrong.
     */
    clear(): void;
    /**
     * Returns the shared observable for `key`, creating it on a miss.
     *
     * `defer` keeps the call lazy (nothing is requested until a widget subscribes)
     * and `shareReplay({ refCount: false })` hands the SAME in-flight promise to
     * every subsequent subscriber — this is what collapses the chart widgets into
     * one HTTP request.
     *
     * @param key - Cache key of the request.
     * @param request - The find input to send.
     */
    private _cached;
    /** Drops expired entries so long sessions don't accumulate dead payload keys. */
    private _prune;
    static ɵfac: i0.ɵɵFactoryDeclaration<EmployeeMonthStatisticsCacheService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<EmployeeMonthStatisticsCacheService>;
}
