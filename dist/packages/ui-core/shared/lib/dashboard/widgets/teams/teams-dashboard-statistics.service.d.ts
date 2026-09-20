import { Observable } from 'rxjs';
import { IDashboardWidgetContext } from '@gauzy/ui-core/core';
import { ITeamsDashboardSnapshot } from './teams-dashboard.types';
import * as i0 from "@angular/core";
/**
 * How long a fetched snapshot stays reusable.
 *
 * Matches `STATISTICS_CACHE_TTL_MS`: long enough to collapse all Teams widgets
 * of one canvas render into a single set of requests, short enough that a user
 * returning to the dashboard gets fresh numbers.
 */
export declare const TEAMS_SNAPSHOT_CACHE_TTL_MS = 15000;
/**
 * Single source of truth for every Teams dashboard widget.
 *
 * The legacy `TeamComponent` derives all of its cards from ONE pass — teams with
 * their members, the range's time logs, the daily report and the counts endpoint
 * — and so does this service. Without it, dropping the eight Teams widgets on a
 * canvas would issue that whole set of requests eight times over.
 *
 * Keyed by {@link teamsScopeKey}, so a widget that narrows the context (pinned to
 * one team, say) correctly gets its own fetch.
 *
 * Errors are NOT swallowed: widgets need them to render an error state. As usual
 * in RxJS an error terminates the subscription, so a widget's `refresh()` must
 * RE-SUBSCRIBE (call {@link getSnapshot} again) rather than only invalidating —
 * the failed cache entry is evicted on error, so the re-call hits the network.
 */
export declare class TeamsDashboardStatisticsService {
    private readonly _teamsService;
    private readonly _projectsService;
    private readonly _timesheetService;
    private readonly _statisticsCache;
    private readonly _cache;
    private readonly _invalidated$;
    /**
     * Employee scope the counts request of each cached snapshot was issued with.
     *
     * `_loadCounts` narrows the context to the teams' own members, so the entry it
     * creates in {@link TimesheetStatisticsCacheService} is keyed by that NARROWED
     * context — invalidating with the ambient one would miss it and replay the
     * previous activity percentage for the whole TTL. Only the ids are kept (not
     * the context) so this map cannot pin a stale `IOrganization` in memory.
     */
    private readonly _countsEmployeeIds;
    /** Guards against the refresh stampede described on {@link INVALIDATE_COALESCE_MS}. */
    private _lastInvalidatedKey;
    private _lastInvalidatedAt;
    /**
     * Long-lived stream of the Teams snapshot for one dashboard context.
     *
     * Re-resolves against the cache after every {@link invalidate}, so a widget
     * can hold a single subscription and still receive refreshed data.
     *
     * @param context - The ambient dashboard context to query for.
     * @returns The snapshot stream; it errors when the underlying requests fail.
     */
    getSnapshot(context: IDashboardWidgetContext): Observable<ITeamsDashboardSnapshot>;
    /**
     * Drops cached snapshots so the next subscriber re-fetches, and notifies live
     * streams to re-resolve.
     *
     * Repeated calls for the same scope within {@link INVALIDATE_COALESCE_MS} are
     * ignored, so every Teams widget on a canvas may call this from its own
     * `refresh()` without causing a request storm.
     *
     * @param context - Limit the invalidation to one context; omit to drop everything.
     */
    invalidate(context?: IDashboardWidgetContext): void;
    /**
     * Unconditionally empties the cache — no coalescing, no notification.
     *
     * Use on hard boundaries (sign-out, tenant switch) where replaying a previous
     * organization's teams would be wrong.
     */
    clear(): void;
    /**
     * Returns the shared observable for `key`, creating it on a miss.
     *
     * `defer` keeps the request lazy and `shareReplay({ refCount: false })` hands
     * the SAME in-flight promise to every subsequent subscriber — this is what
     * collapses eight Teams widgets into one fetch.
     */
    private _cached;
    /** Drops expired entries so long sessions do not accumulate dead scopes. */
    private _prune;
    /**
     * Builds the member-scoped context the counts endpoint is queried with.
     *
     * Shared by {@link _loadCounts} and {@link invalidate} on purpose: two
     * implementations would hash differently, which is exactly the bug that makes
     * a refresh replay a stale activity percentage.
     *
     * Both callers guarantee a non-empty list: an empty one would widen the query
     * back to the whole organization, which {@link _loadCounts} refuses to do.
     *
     * @param context - The ambient dashboard context.
     * @param employeeIds - Members of the teams in scope.
     * @returns The context to hand to {@link TimesheetStatisticsCacheService}.
     */
    private _countsContext;
    /**
     * Fetches and maps everything the Teams widgets need.
     *
     * Mirrors `TeamComponent._loadTeams` + `getTimeLogs` + `teamMapper` +
     * `getCounts`, in that order and with the same filters.
     */
    private _load;
    /**
     * Applies the context's team and employee scope, mirroring the legacy page's
     * `selectedTeam` / `selectedEmployee` filters.
     */
    private _filterTeams;
    /**
     * Projects one team membership into the flat row the widgets render, and
     * collects the projects it logged time against.
     */
    private _mapMember;
    /**
     * Groups a member's logs by task and sums each group's duration.
     *
     * Replicates the legacy page's `_groupBy('taskId', logs)` pass, with the logs
     * without a task collected under an explicit {@link NO_TASK_ID} bucket rather
     * than under the `"undefined"` string key that grouping produced by accident.
     *
     * @param logs - The member's time logs inside the selected range.
     * @returns One row per task, in the order the tasks were first logged against.
     */
    private _mapTasks;
    /**
     * Reduces the employee-grouped daily report into one activity percentage per
     * user.
     *
     * @param report - The daily report, grouped by employee.
     * @returns Activity percentage keyed by the member's USER id, which is what
     *          the report rows carry (not the employee id).
     */
    private _mapActivity;
    /**
     * Activity percentage of one report row.
     *
     * Prefers the row's own `activity` — the server-side average over the whole
     * range, and the very field the legacy page reads — and only falls back to
     * averaging the per-project entries when the row carries none.
     *
     * @param row - One employee-grouped daily report row.
     * @returns The percentage, or `null` when the row holds no usable sample.
     */
    private _rowActivity;
    /**
     * Fetches the counts payload scoped to the teams' members, which is where the
     * overall activity percentage comes from.
     *
     * Routed through {@link TimesheetStatisticsCacheService} so it shares the
     * request with any Time Tracking counter that happens to be on the same canvas.
     */
    private _loadCounts;
    /**
     * De-duplicates member rows by employee, so somebody on two teams counts once.
     *
     * Rows without an `employeeId` cannot be matched and are all kept.
     */
    private _uniqueByEmployee;
    static ɵfac: i0.ɵɵFactoryDeclaration<TeamsDashboardStatisticsService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<TeamsDashboardStatisticsService>;
}
