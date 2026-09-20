import { Observable } from 'rxjs';
import { IActivitiesStatistics, ICountsStatistics, IManualTimesStatistics, IMembersStatistics, IProjectsStatistics, ITasksStatistics, ITimeLogFilters, ITimeLogTodayFilters, ITimeSlotStatistics } from '@gauzy/contracts';
import { IDashboardWidgetContext } from './dashboard-widget-context';
import * as i0 from "@angular/core";
/**
 * How long a fetched statistics response stays reusable.
 *
 * Long enough to collapse the widgets of one dashboard render into a single
 * request per endpoint, short enough that a user tabbing back to a dashboard
 * gets fresh numbers.
 */
export declare const STATISTICS_CACHE_TTL_MS = 15000;
/**
 * The payload every statistics endpoint receives.
 *
 * Every `IGet*Statistics` interface extends `ITimeLogFilters` and adds only
 * optional members, so this type is directly assignable to all of them.
 */
export type StatisticsRequestPayload = ITimeLogFilters & ITimeLogTodayFilters & {
    take?: number;
};
/**
 * Builds the timesheet statistics request payload for a dashboard context.
 *
 * This is the parity-critical function: it reproduces
 * `TimeTrackingComponent.preparePayloads()` exactly — same UTC-offset shift,
 * same `YYYY-MM-DD HH:mm:ss` serialization, same "omit empty scopes" rule — so
 * a canvas widget and the standard dashboard send byte-identical requests and
 * therefore render identical numbers.
 *
 * @param context - The ambient dashboard context.
 * @returns The request payload shared by every statistics endpoint.
 */
export declare function buildStatisticsRequest(context: IDashboardWidgetContext): StatisticsRequestPayload;
/**
 * Makes the server-computed `durationPercentage` safe to render.
 *
 * `/timesheet/statistics/activities` returns only the TOP 5 activity buckets, but
 * it computes each one's `durationPercentage` against the total of the WHOLE
 * period — `StatisticService.getActivities()` runs a second, unlimited aggregate
 * for exactly that denominator. Re-deriving the share client-side from the five
 * returned rows (which `TimeTrackingComponent.getActivities()` still does) forces
 * those five to add up to 100% and so overstates every one of them: an app worth
 * 12% of the tracked period renders as 40%. The server value is the correct one
 * and is therefore kept as-is.
 *
 * Only normalization happens here: the aggregate can come back as a string, and
 * the server divides by the period total without a zero guard, so an empty period
 * yields `NaN` — either would reach `nb-progress-bar` as a `NaN` width.
 *
 * @param activities - Activities as returned by the API.
 * @returns A new array whose `durationPercentage` is a finite 0..100 number.
 */
export declare function normalizeDurationPercentage(activities: IActivitiesStatistics[]): IActivitiesStatistics[];
/**
 * Request-coalescing cache in front of {@link TimesheetStatisticsService}.
 *
 * A dashboard canvas renders many widgets that all describe the same slice of
 * data — the six counter widgets, for instance, are six views of ONE
 * `/timesheet/statistics/counts` response. Without this service each of them
 * would issue its own HTTP request on every context change.
 *
 * Keyed by the serialized request payload, so widgets that narrow the context
 * (pinned to a project, say) correctly get their own request.
 *
 * The returned observables are long-lived: they re-resolve against the cache
 * whenever `invalidate()` fires, so a widget can simply hold one subscription
 * and receive fresh data after a manual refresh.
 *
 * Errors are NOT swallowed — widgets need them to render an error state. As
 * usual in RxJS an error terminates the subscription, which has one consequence
 * callers MUST honour: once a stream has errored it is dead and will no longer
 * react to {@link TimesheetStatisticsCacheService.invalidate}. A widget's
 * `refresh()` therefore has to RE-CALL the getter (re-subscribe), not merely
 * call `invalidate()`, or a failed widget can never recover. The failed cache
 * entry is evicted on error, so the re-call always hits the network.
 */
export declare class TimesheetStatisticsCacheService {
    private readonly _timesheetStatisticsService;
    private readonly _cache;
    private readonly _invalidated$;
    /** Guards against the refresh stampede described on INVALIDATE_COALESCE_MS. */
    private _lastInvalidatedKey;
    private _lastInvalidatedAt;
    /** Emits after every effective invalidation. */
    readonly invalidated$: Observable<void>;
    /**
     * Counts used by the six counter widgets (members worked, projects worked,
     * today activity, worked today, worked this period, activity this period).
     *
     * @param context - The dashboard context to query for.
     */
    getCounts(context: IDashboardWidgetContext): Observable<ICountsStatistics>;
    /**
     * Application / URL activity buckets.
     *
     * Returns the raw API payload — pass it through
     * {@link normalizeDurationPercentage} when the widget renders the relative
     * share the server already computed.
     *
     * @param context - The dashboard context to query for.
     */
    getActivities(context: IDashboardWidgetContext): Observable<IActivitiesStatistics[]>;
    /**
     * Recent time slots (screenshot / activity strip).
     *
     * @param context - The dashboard context to query for.
     */
    getTimeSlots(context: IDashboardWidgetContext): Observable<ITimeSlotStatistics[]>;
    /**
     * Time tracked per project.
     *
     * @param context - The dashboard context to query for.
     */
    getProjects(context: IDashboardWidgetContext): Observable<IProjectsStatistics[]>;
    /**
     * Time tracked per task.
     *
     * @param context - The dashboard context to query for.
     * @param take - Page size; defaults to the 5 the standard dashboard requests.
     */
    getTasks(context: IDashboardWidgetContext, take?: number): Observable<ITasksStatistics[]>;
    /**
     * Manually entered time entries.
     *
     * @param context - The dashboard context to query for.
     */
    getManualTimes(context: IDashboardWidgetContext): Observable<IManualTimesStatistics[]>;
    /**
     * Per-member weekly / today totals.
     *
     * @param context - The dashboard context to query for.
     */
    getMembers(context: IDashboardWidgetContext): Observable<IMembersStatistics[]>;
    /**
     * Drops cached responses so the next subscriber re-fetches, and notifies
     * live streams (returned by the getters above) to re-resolve.
     *
     * Repeated calls for the same scope within {@link INVALIDATE_COALESCE_MS} are
     * ignored, so every widget on a canvas may safely call this from its own
     * `refresh()` without causing a request storm.
     *
     * @param context - Limit the invalidation to one context; omit to drop everything.
     */
    invalidate(context?: IDashboardWidgetContext): void;
    /**
     * Unconditionally empties the cache — no coalescing, no notification.
     *
     * Use on hard boundaries (sign-out, organization switch) where replaying a
     * previous tenant's numbers would be wrong.
     */
    clear(): void;
    /**
     * Builds the long-lived stream handed to widgets: it resolves a cache entry
     * now and again after every invalidation.
     */
    private _resolve;
    /**
     * Returns the shared observable for `key`, creating it on a miss.
     *
     * `defer` keeps the call lazy (nothing is requested until a widget
     * subscribes) and `shareReplay({ refCount: false })` hands the SAME in-flight
     * promise to every subsequent subscriber — this is what collapses six
     * counter widgets into one HTTP request.
     */
    private _cached;
    /** Stable fingerprint of the context-derived part of a request payload. */
    private _contextHash;
    /** Removes cache entries for one context, or all of them. */
    private _drop;
    /** Drops expired entries so long sessions don't accumulate dead payload keys. */
    private _prune;
    static ɵfac: i0.ɵɵFactoryDeclaration<TimesheetStatisticsCacheService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<TimesheetStatisticsCacheService>;
}
