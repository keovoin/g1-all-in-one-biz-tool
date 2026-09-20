import { inject, Injectable } from '@angular/core';
import { defer, firstValueFrom, from, of, Subject, throwError } from 'rxjs';
import { catchError, shareReplay, startWith, switchMap } from 'rxjs/operators';
import { ReportGroupFilterEnum } from '@gauzy/contracts';
import { buildStatisticsRequest, OrganizationProjectsService, OrganizationTeamsService, TimesheetService, TimesheetStatisticsCacheService } from '@gauzy/ui-core/core';
import { NO_TASK_ID } from './teams-dashboard.types';
import { resolveWorkingSeconds, teamsScopeKey, uniqueById } from './teams-widget.utils';
import * as i0 from "@angular/core";
/**
 * How long a fetched snapshot stays reusable.
 *
 * Matches `STATISTICS_CACHE_TTL_MS`: long enough to collapse all Teams widgets
 * of one canvas render into a single set of requests, short enough that a user
 * returning to the dashboard gets fresh numbers.
 */
export const TEAMS_SNAPSHOT_CACHE_TTL_MS = 15_000;
/**
 * Window in which repeated invalidations of the same scope collapse into one,
 * so one "refresh" click does not turn into one request set per widget.
 */
const INVALIDATE_COALESCE_MS = 250;
/** Relations the legacy Teams dashboard loads to classify members. */
const TEAM_RELATIONS = ['members', 'members.role', 'members.employee', 'members.employee.user'];
/** Relations the legacy Teams dashboard loads with its time logs. */
const TIME_LOG_RELATIONS = ['project', 'task', 'employee.user'];
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
export class TeamsDashboardStatisticsService {
    constructor() {
        this._teamsService = inject(OrganizationTeamsService);
        this._projectsService = inject(OrganizationProjectsService);
        this._timesheetService = inject(TimesheetService);
        this._statisticsCache = inject(TimesheetStatisticsCacheService);
        this._cache = new Map();
        this._invalidated$ = new Subject();
        /**
         * Employee scope the counts request of each cached snapshot was issued with.
         *
         * `_loadCounts` narrows the context to the teams' own members, so the entry it
         * creates in {@link TimesheetStatisticsCacheService} is keyed by that NARROWED
         * context — invalidating with the ambient one would miss it and replay the
         * previous activity percentage for the whole TTL. Only the ids are kept (not
         * the context) so this map cannot pin a stale `IOrganization` in memory.
         */
        this._countsEmployeeIds = new Map();
        /** Guards against the refresh stampede described on {@link INVALIDATE_COALESCE_MS}. */
        this._lastInvalidatedKey = null;
        this._lastInvalidatedAt = 0;
    }
    /**
     * Long-lived stream of the Teams snapshot for one dashboard context.
     *
     * Re-resolves against the cache after every {@link invalidate}, so a widget
     * can hold a single subscription and still receive refreshed data.
     *
     * @param context - The ambient dashboard context to query for.
     * @returns The snapshot stream; it errors when the underlying requests fail.
     */
    getSnapshot(context) {
        const key = teamsScopeKey(context);
        return this._invalidated$.pipe(startWith(undefined), switchMap(() => this._cached(key, () => this._load(context))), 
        // refCount so the widget's subscription is the only thing keeping this
        // wrapper alive; the cached entry itself outlives it (that is the point).
        shareReplay({ bufferSize: 1, refCount: true }));
    }
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
    invalidate(context) {
        const scope = context ? teamsScopeKey(context) : '*';
        const now = Date.now();
        if (this._lastInvalidatedKey === scope && now - this._lastInvalidatedAt < INVALIDATE_COALESCE_MS) {
            return;
        }
        this._lastInvalidatedKey = scope;
        this._lastInvalidatedAt = now;
        if (context) {
            this._cache.delete(scope);
            // The counts call is served by the timesheet cache, which has its own
            // entry for this scope — leaving it would replay stale activity numbers.
            this._statisticsCache.invalidate(context);
            // …and the entry `_loadCounts` actually created is keyed by the
            // member-scoped context, which hashes differently. Drop that one too,
            // or "refresh" leaves the activity percentage frozen for the TTL.
            const employeeIds = this._countsEmployeeIds.get(scope);
            // An empty list means `_loadCounts` never issued a request for this
            // scope, so there is no narrowed entry to drop.
            if (employeeIds?.length) {
                this._statisticsCache.invalidate(this._countsContext(context, employeeIds));
            }
            // Drop the scope record too. `_cache.delete(scope)` above already put
            // this key out of `_prune()`'s reach, so keeping the ID[] would leak a
            // little memory on every scope switch until the next `clear()`.
            this._countsEmployeeIds.delete(scope);
        }
        else {
            this._cache.clear();
            this._countsEmployeeIds.clear();
        }
        this._invalidated$.next();
    }
    /**
     * Unconditionally empties the cache — no coalescing, no notification.
     *
     * Use on hard boundaries (sign-out, tenant switch) where replaying a previous
     * organization's teams would be wrong.
     */
    clear() {
        this._cache.clear();
        this._countsEmployeeIds.clear();
        this._lastInvalidatedKey = null;
        this._lastInvalidatedAt = 0;
    }
    /*
    |--------------------------------------------------------------------------
    | Internals
    |--------------------------------------------------------------------------
    */
    /**
     * Returns the shared observable for `key`, creating it on a miss.
     *
     * `defer` keeps the request lazy and `shareReplay({ refCount: false })` hands
     * the SAME in-flight promise to every subsequent subscriber — this is what
     * collapses eight Teams widgets into one fetch.
     */
    _cached(key, request) {
        const now = Date.now();
        const hit = this._cache.get(key);
        if (hit && hit.expiresAt > now) {
            return hit.stream$;
        }
        this._prune(now);
        // Holder so the error handler can identify "its own" entry without a
        // use-before-assignment dance on the entry const itself.
        const own = {};
        const stream$ = defer(() => from(request())).pipe(shareReplay({ bufferSize: 1, refCount: false }), catchError((error) => {
            // A cached failure would be replayed to every subscriber for the whole
            // TTL; evict it so the next widget (or a retry) hits the network again.
            if (own.entry && this._cache.get(key) === own.entry) {
                this._cache.delete(key);
            }
            return throwError(() => error);
        }));
        own.entry = { stream$, expiresAt: now + TEAMS_SNAPSHOT_CACHE_TTL_MS };
        this._cache.set(key, own.entry);
        return stream$;
    }
    /** Drops expired entries so long sessions do not accumulate dead scopes. */
    _prune(now) {
        for (const [key, entry] of Array.from(this._cache.entries())) {
            if (entry.expiresAt <= now) {
                this._cache.delete(key);
                // The matching counts entry shares this TTL, so its scope record is
                // dead too; dropping it here is what bounds the map's growth.
                this._countsEmployeeIds.delete(key);
            }
        }
    }
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
    _countsContext(context, employeeIds) {
        return { ...context, employeeIds };
    }
    /**
     * Fetches and maps everything the Teams widgets need.
     *
     * Mirrors `TeamComponent._loadTeams` + `getTimeLogs` + `teamMapper` +
     * `getCounts`, in that order and with the same filters.
     */
    async _load(context) {
        const { tenantId, organizationId } = context;
        // `buildStatisticsRequest` is the parity-critical request shaper (UTC offset,
        // date serialization, "omit empty scopes"). The time-log endpoints do not
        // understand the `today*` bounds, so they are dropped rather than re-derived.
        const { todayStart, todayEnd, ...filters } = buildStatisticsRequest(context);
        const request = {
            ...filters,
            groupBy: ReportGroupFilterEnum.employee
        };
        // All four are independent of each other, so they go out together: two
        // sequential batches cost an extra round-trip on every Teams canvas load.
        const [teams, projectsTotal, logs, dailyReport] = await Promise.all([
            this._teamsService.getAll(TEAM_RELATIONS, { organizationId, tenantId }).then((page) => page?.items ?? []),
            // A failing project count only degrades one denominator; it must not
            // take down every Teams widget on the canvas.
            this._projectsService.getCount({ organizationId, tenantId }).catch(() => 0),
            this._timesheetService.getTimeLogs(request, TIME_LOG_RELATIONS),
            // Same reasoning: without the daily report members simply have no
            // activity percentage, which is far better than an error state.
            this._timesheetService.getDailyReport(request).catch(() => [])
        ]);
        const scopedTeams = this._filterTeams(teams, context);
        const activityByUserId = this._mapActivity(dailyReport);
        const workPeriod = resolveWorkingSeconds(context);
        const mappedTeams = [];
        const allMembers = [];
        const workingMembers = [];
        const projects = [];
        for (const team of scopedTeams) {
            const members = (team.members ?? []).map((member) => this._mapMember(member, team, logs ?? [], activityByUserId, workPeriod, projects));
            // De-duplicate BEFORE counting: a member holding two roles in one team is
            // returned twice by the API and would otherwise be counted twice.
            const distinct = uniqueById(members);
            const online = distinct.filter((member) => member.isRunningTimer);
            const working = distinct.filter((member) => member.isWorkingToday);
            const idle = distinct.filter((member) => !member.isWorkingToday);
            allMembers.push(...distinct);
            workingMembers.push(...working);
            mappedTeams.push({
                id: team.id,
                name: team.name,
                countOnline: online.length,
                countWorking: working.length,
                countNotWorking: idle.length,
                countTotal: distinct.length,
                members: [...working, ...idle]
            });
        }
        // Members are de-duplicated ACROSS teams here: somebody on two teams is one
        // person for the "Members worked" counter, but two rows in the team lists.
        const distinctMembers = this._uniqueByEmployee(allMembers);
        const distinctWorking = this._uniqueByEmployee(workingMembers);
        const counts = await this._loadCounts(context, distinctMembers);
        return {
            teams: mappedTeams,
            teamsOnline: mappedTeams.filter((team) => team.countOnline > 0).length,
            teamsWorking: mappedTeams.filter((team) => team.countWorking > 0).length,
            teamsNotWorking: mappedTeams.filter((team) => team.countNotWorking > 0 && team.countWorking === 0).length,
            teamsTotal: mappedTeams.length,
            membersWorked: distinctWorking.length,
            membersTotal: distinctMembers.length,
            projectsWorked: uniqueById(projects).length,
            projectsTotal: projectsTotal || 0,
            activityPercentage: Number(counts?.weekActivities) || 0
        };
    }
    /**
     * Applies the context's team and employee scope, mirroring the legacy page's
     * `selectedTeam` / `selectedEmployee` filters.
     */
    _filterTeams(teams, context) {
        const teamIds = context.teamIds ?? [];
        const employeeIds = context.employeeIds ?? [];
        return (teams ?? []).filter((team) => {
            if (teamIds.length && !teamIds.includes(team.id)) {
                return false;
            }
            if (!employeeIds.length) {
                return true;
            }
            // A team the selected employee does not belong to tells that employee
            // nothing, so the legacy page drops it entirely.
            return (team.members ?? []).some((member) => employeeIds.includes(member?.employeeId));
        });
    }
    /**
     * Projects one team membership into the flat row the widgets render, and
     * collects the projects it logged time against.
     */
    _mapMember(member, team, logs, activityByUserId, workPeriod, projects) {
        const userId = member?.employee?.userId;
        // Same predicate as the legacy page: a log counts for this row only when it
        // belongs to this member AND was tracked against THIS team.
        const memberLogs = userId
            ? logs.filter((log) => !!log && log.employee?.userId === userId && log.organizationTeamId === team.id)
            : [];
        const isWorkingToday = memberLogs.length > 0;
        const workedDuration = memberLogs.reduce((total, log) => total + (Number(log.duration) || 0), 0);
        if (isWorkingToday) {
            for (const log of memberLogs) {
                if (log.project) {
                    projects.push(log.project);
                }
            }
        }
        const activity = userId ? activityByUserId.get(userId) : undefined;
        return {
            id: member.id,
            employeeId: member.employeeId,
            name: member.employee?.user?.name ?? member.employee?.fullName ?? '',
            imageUrl: member.employee?.user?.imageUrl,
            employee: member.employee,
            // The last log wins, exactly like the legacy page's `logs.reverse()[0]`,
            // but without mutating the shared array it filtered from.
            isRunningTimer: isWorkingToday ? !!memberLogs.at(-1)?.isRunning : false,
            isWorkingToday,
            workedDuration,
            workPeriod,
            activity: activity ?? null,
            tasks: this._mapTasks(memberLogs),
            teamId: team.id,
            teamName: team.name
        };
    }
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
    _mapTasks(logs) {
        const byTask = new Map();
        for (const log of logs) {
            const id = log?.taskId ?? NO_TASK_ID;
            const existing = byTask.get(id);
            if (existing) {
                existing.duration += Number(log.duration) || 0;
                continue;
            }
            byTask.set(id, {
                id,
                title: log?.task?.title ?? '',
                duration: Number(log.duration) || 0,
                // `estimate` belongs to the task, not the log, so it is read once
                // from the first log of the group rather than accumulated.
                estimate: log?.task?.estimate
            });
        }
        return Array.from(byTask.values());
    }
    /**
     * Reduces the employee-grouped daily report into one activity percentage per
     * user.
     *
     * @param report - The daily report, grouped by employee.
     * @returns Activity percentage keyed by the member's USER id, which is what
     *          the report rows carry (not the employee id).
     */
    _mapActivity(report) {
        const activityByUserId = new Map();
        for (const row of (report ?? [])) {
            const userId = row?.employee?.userId;
            if (!userId) {
                continue;
            }
            const activity = this._rowActivity(row);
            if (activity !== null) {
                activityByUserId.set(userId, activity);
            }
        }
        return activityByUserId;
    }
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
    _rowActivity(row) {
        const rowActivity = Number(row?.activity);
        if (Number.isFinite(rowActivity)) {
            return rowActivity;
        }
        let weightedTotal = 0;
        let weight = 0;
        let plainTotal = 0;
        let samples = 0;
        for (const day of row.logs ?? []) {
            for (const entry of day?.projectLogs ?? []) {
                const activity = Number(entry?.activity);
                if (!Number.isFinite(activity)) {
                    continue;
                }
                const duration = Number(entry?.sum) || 0;
                weightedTotal += activity * duration;
                weight += duration;
                plainTotal += activity;
                samples += 1;
            }
        }
        if (!samples) {
            return null;
        }
        // Fall back to the plain mean when every entry has a zero duration —
        // dividing by that weight would produce NaN.
        return weight > 0 ? weightedTotal / weight : plainTotal / samples;
    }
    /**
     * Fetches the counts payload scoped to the teams' members, which is where the
     * overall activity percentage comes from.
     *
     * Routed through {@link TimesheetStatisticsCacheService} so it shares the
     * request with any Time Tracking counter that happens to be on the same canvas.
     */
    _loadCounts(context, members) {
        const employeeIds = members.map((member) => member.employeeId).filter((id) => !!id);
        // Remembered so `invalidate()` can drop the entry this call is about to
        // create — it is keyed by the narrowed context, not by `context`.
        this._countsEmployeeIds.set(teamsScopeKey(context), employeeIds);
        if (!employeeIds.length) {
            // Nobody is in scope, so there is nothing to ask about. Asking anyway
            // would drop the employee filter and report the WHOLE organization's
            // activity next to a team that has zero members — the one number on
            // this snapshot a user would read as "my empty team is 84% active".
            return Promise.resolve(null);
        }
        return firstValueFrom(this._statisticsCache
            .getCounts(this._countsContext(context, employeeIds))
            // Non-fatal: without counts the activity card reads 0% while every
            // other Teams widget still renders its numbers.
            .pipe(catchError(() => of(null))));
    }
    /**
     * De-duplicates member rows by employee, so somebody on two teams counts once.
     *
     * Rows without an `employeeId` cannot be matched and are all kept.
     */
    _uniqueByEmployee(members) {
        const seen = new Set();
        const unique = [];
        for (const member of members) {
            if (!member.employeeId) {
                unique.push(member);
                continue;
            }
            if (seen.has(member.employeeId)) {
                continue;
            }
            seen.add(member.employeeId);
            unique.push(member);
        }
        return unique;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TeamsDashboardStatisticsService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TeamsDashboardStatisticsService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TeamsDashboardStatisticsService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }] });
//# sourceMappingURL=teams-dashboard-statistics.service.js.map