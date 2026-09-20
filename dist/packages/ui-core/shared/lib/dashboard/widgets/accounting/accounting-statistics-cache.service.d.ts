import { Observable } from 'rxjs';
import { EmployeeStatisticsHistoryEnum, IAggregatedEmployeeStatistic, IAggregatedEmployeeStatisticFindInput, ID, IEmployeeStatisticsHistory, IEmployeeStatisticsHistoryFindInput } from '@gauzy/contracts';
import { IDashboardWidgetContext } from '@gauzy/ui-core/core';
import * as i0 from "@angular/core";
/**
 * Builds the `/employee-statistics/aggregate` request for a dashboard context.
 *
 * Parity-critical: it reproduces `AccountingComponent.getAggregateStatistics()`
 * exactly — organization, tenant and the raw selected range, nothing else. The
 * endpoint knows no employee/project/team scope, which is precisely why the
 * widgets must NOT refetch when those selectors change.
 *
 * @param context - The ambient dashboard context.
 * @returns The find input the aggregate endpoint expects.
 */
export declare function buildAggregateStatisticsRequest(context: IDashboardWidgetContext): IAggregatedEmployeeStatisticFindInput;
/**
 * Builds the `/employee-statistics/history` request for a dashboard context.
 *
 * Parity-critical: it reproduces `HumanResourcesComponent.openHistoryDialog()`
 * exactly — including the fact that the range is sent RAW here, unlike the
 * `/employee-statistics/months` request the same page builds with `toUTC(...)`.
 * Normalizing it "for consistency" would make the widget report a different set
 * of records than the dialog does for the same selection.
 *
 * @param context - The ambient dashboard context.
 * @param employeeId - The employee the history is for.
 * @param type - Which history the endpoint should return.
 * @returns The find input the history endpoint expects.
 */
export declare function buildStatisticsHistoryRequest(context: IDashboardWidgetContext, employeeId: ID, type: EmployeeStatisticsHistoryEnum): IEmployeeStatisticsHistoryFindInput;
/**
 * Request-coalescing cache in front of {@link EmployeeStatisticsService}.
 *
 * It fronts the two endpoints the Accounting widgets read:
 *
 * - `/employee-statistics/aggregate` — the KPIs (income, expenses, profit,
 *   bonus), the cash-flow chart and the per-employee breakdown table are SIX
 *   projections of ONE response, exactly like the six Time Tracking counters
 *   share one counts payload.
 * - `/employee-statistics/history` — the Records History and Profit History
 *   widgets both read it, and a Records History widget configured to `INCOME`
 *   shares its response with the Profit History widget beside it.
 *
 * Without this service, dropping those widgets on one canvas would issue an
 * identical request per widget on every context change.
 *
 * Mirrors `TimesheetStatisticsCacheService`: keyed by the request scope, entries
 * expire after {@link STATISTICS_CACHE_TTL_MS}, and the returned observables are
 * long-lived so they re-resolve after an {@link invalidate}.
 *
 * Errors are NOT swallowed — widgets need them to render an error state. As
 * usual in RxJS an error terminates the subscription, so a widget's `refresh()`
 * has to RE-CALL {@link getAggregate} / {@link getStatisticsHistory}
 * (re-subscribe) rather than merely call {@link invalidate}, or a failed widget
 * could never recover. The failed entry is evicted on error, so that re-call
 * always hits the network.
 */
export declare class AccountingStatisticsCacheService {
    private readonly _employeeStatisticsService;
    private readonly _cache;
    private readonly _invalidated$;
    /**
     * When each scope was last invalidated — the guard against the refresh
     * stampede described on {@link INVALIDATE_COALESCE_MS}.
     *
     * A map rather than a single "last key" slot: this cache now serves several
     * scopes at once (one aggregate, one history entry per widget), so widgets
     * refreshing in an interleaved order (A, B, A) would defeat a single slot and
     * evict A twice.
     */
    private readonly _lastInvalidatedAt;
    /** Emits after every effective invalidation. */
    readonly invalidated$: Observable<void>;
    /**
     * Aggregated employee statistics (totals, per-employee rows and the cash-flow
     * chart series) for the given dashboard context.
     *
     * @param context - The dashboard context to query for.
     * @returns A shared stream that re-resolves after every invalidation.
     */
    getAggregate(context: IDashboardWidgetContext): Observable<IAggregatedEmployeeStatistic>;
    /**
     * Income/expense history rows of one employee over the context's range.
     *
     * @param context - The dashboard context to query for.
     * @param employeeId - The employee the history is for.
     * @param type - Which history to return (income, expenses, bonus income, ...).
     * @returns A shared stream that re-resolves after every invalidation.
     */
    getStatisticsHistory(context: IDashboardWidgetContext, employeeId: ID, type: EmployeeStatisticsHistoryEnum): Observable<IEmployeeStatisticsHistory[]>;
    /**
     * Drops the cached aggregate response so the next subscriber re-fetches, and
     * notifies live streams to re-resolve.
     *
     * Repeated calls for the same scope within {@link INVALIDATE_COALESCE_MS} are
     * ignored, so every accounting widget may safely call this from its own
     * `refresh()` without causing a request storm.
     *
     * @param context - Limit the invalidation to one context; omit to drop everything.
     */
    invalidate(context?: IDashboardWidgetContext): void;
    /**
     * Drops one cached history response so the next subscriber re-fetches.
     *
     * @param context - The dashboard context the history was fetched for.
     * @param employeeId - The employee the history is for.
     * @param type - Which history to drop.
     */
    invalidateHistory(context: IDashboardWidgetContext, employeeId: ID, type: EmployeeStatisticsHistoryEnum): void;
    /**
     * Unconditionally empties the cache — no coalescing, no notification.
     *
     * Use on hard boundaries (sign-out, organization switch) where replaying a
     * previous tenant's numbers would be wrong.
     */
    clear(): void;
    /**
     * Evicts one scope (or everything for `'*'`) and re-resolves live streams,
     * unless the same scope was already invalidated a moment ago.
     *
     * @param scope - Cache key to drop, or `'*'` for the whole cache.
     */
    private _invalidateScope;
    /**
     * Records an invalidation timestamp, dropping the ones that can no longer
     * suppress anything so a long session does not accumulate dead scopes.
     *
     * @param scope - The scope just invalidated.
     * @param now - The current epoch value.
     */
    private _rememberInvalidation;
    /**
     * The long-lived stream for one cache key: re-resolves the cached entry after
     * every invalidation, and shares one subscription among the widgets.
     *
     * @param key - Cache key of the request.
     * @param fetch - Issues the request; called only on a cache miss.
     * @returns A shared stream that re-resolves after every invalidation.
     */
    private _shared;
    /**
     * Returns the shared observable for `key`, creating it on a miss.
     *
     * `defer` keeps the call lazy (nothing is requested until a widget subscribes)
     * and `shareReplay({ refCount: false })` hands the SAME in-flight promise to
     * every subsequent subscriber — this is what collapses the widgets reading one
     * endpoint into one HTTP request.
     *
     * @param key - Cache key of the request.
     * @param fetch - Issues the request; called only on a cache miss.
     */
    private _cached;
    /** Drops expired entries so long sessions don't accumulate dead payload keys. */
    private _prune;
    static ɵfac: i0.ɵɵFactoryDeclaration<AccountingStatisticsCacheService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<AccountingStatisticsCacheService>;
}
