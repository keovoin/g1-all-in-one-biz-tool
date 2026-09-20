import { inject, Injectable } from '@angular/core';
import { defer, from, Subject, throwError } from 'rxjs';
import { catchError, shareReplay, startWith, switchMap } from 'rxjs/operators';
import { isNotEmpty, toUtcOffset } from '@gauzy/ui-core/common';
import { TimesheetStatisticsService } from '../timesheet/timesheet-statistics.service';
import * as i0 from "@angular/core";
/** Date format the timesheet statistics API expects. */
const API_DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss';
/**
 * How long a fetched statistics response stays reusable.
 *
 * Long enough to collapse the widgets of one dashboard render into a single
 * request per endpoint, short enough that a user tabbing back to a dashboard
 * gets fresh numbers.
 */
export const STATISTICS_CACHE_TTL_MS = 15_000;
/**
 * Window in which repeated invalidations of the same scope collapse into one.
 *
 * Every widget on a canvas reacts to the same "refresh" click, so without this
 * the 2nd..Nth `invalidate()` would evict the entry the previous widget had
 * just re-created — turning one manual refresh into N HTTP requests.
 */
const INVALIDATE_COALESCE_MS = 250;
/**
 * Serializes a request object into a stable string, independent of key order.
 *
 * The comparator is explicit on purpose: the default `Array.sort()` compares the
 * UTF-16 code units of the *stringified* elements, which is not a guaranteed
 * alphabetical order. Since this string IS the cache key, an unstable order
 * would produce two keys for one request — i.e. duplicate HTTP calls.
 *
 * @param value - The object to serialize.
 * @returns A deterministic string representation.
 */
function stableStringify(value) {
    const record = value;
    return Object.keys(record)
        .sort((a, b) => a.localeCompare(b))
        .map((key) => `${key}=${JSON.stringify(record[key])}`)
        .join('&');
}
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
export function buildStatisticsRequest(context) {
    const { tenantId, organizationId, startDate, endDate, todayStart, todayEnd, timeZone } = context;
    const request = {
        tenantId,
        organizationId,
        todayStart: toUtcOffset(todayStart, timeZone).format(API_DATE_FORMAT),
        todayEnd: toUtcOffset(todayEnd, timeZone).format(API_DATE_FORMAT),
        startDate: toUtcOffset(startDate, timeZone).format(API_DATE_FORMAT),
        endDate: toUtcOffset(endDate, timeZone).format(API_DATE_FORMAT),
        timeZone
    };
    // `isNotEmpty` also rejects `[null]`, which is what the "All Employees"
    // selection produces — sending it would filter on a non-existent employee.
    if (isNotEmpty(context.employeeIds)) {
        request.employeeIds = context.employeeIds;
    }
    if (isNotEmpty(context.projectIds)) {
        request.projectIds = context.projectIds;
    }
    if (isNotEmpty(context.teamIds)) {
        request.teamIds = context.teamIds;
    }
    return request;
}
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
export function normalizeDurationPercentage(activities) {
    return (activities ?? []).map((activity) => {
        const share = Number(activity?.durationPercentage);
        return {
            ...activity,
            durationPercentage: Number.isFinite(share) ? Math.min(Math.max(share, 0), 100) : 0
        };
    });
}
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
export class TimesheetStatisticsCacheService {
    constructor() {
        this._timesheetStatisticsService = inject(TimesheetStatisticsService);
        this._cache = new Map();
        this._invalidated$ = new Subject();
        /** Guards against the refresh stampede described on INVALIDATE_COALESCE_MS. */
        this._lastInvalidatedKey = null;
        this._lastInvalidatedAt = 0;
        /** Emits after every effective invalidation. */
        this.invalidated$ = this._invalidated$.asObservable();
    }
    /*
    |--------------------------------------------------------------------------
    | Endpoints
    |--------------------------------------------------------------------------
    */
    /**
     * Counts used by the six counter widgets (members worked, projects worked,
     * today activity, worked today, worked this period, activity this period).
     *
     * @param context - The dashboard context to query for.
     */
    getCounts(context) {
        return this._resolve(context, 'counts', (payload) => this._timesheetStatisticsService.getCounts(payload));
    }
    /**
     * Application / URL activity buckets.
     *
     * Returns the raw API payload — pass it through
     * {@link normalizeDurationPercentage} when the widget renders the relative
     * share the server already computed.
     *
     * @param context - The dashboard context to query for.
     */
    getActivities(context) {
        return this._resolve(context, 'activities', (payload) => this._timesheetStatisticsService.getActivities(payload));
    }
    /**
     * Recent time slots (screenshot / activity strip).
     *
     * @param context - The dashboard context to query for.
     */
    getTimeSlots(context) {
        return this._resolve(context, 'time-slots', (payload) => this._timesheetStatisticsService.getTimeSlots(payload));
    }
    /**
     * Time tracked per project.
     *
     * @param context - The dashboard context to query for.
     */
    getProjects(context) {
        return this._resolve(context, 'projects', (payload) => this._timesheetStatisticsService.getProjects(payload));
    }
    /**
     * Time tracked per task.
     *
     * @param context - The dashboard context to query for.
     * @param take - Page size; defaults to the 5 the standard dashboard requests.
     */
    getTasks(context, take = 5) {
        return this._resolve(context, 'tasks', (payload) => this._timesheetStatisticsService.getTasksStatistics(payload), { take });
    }
    /**
     * Manually entered time entries.
     *
     * @param context - The dashboard context to query for.
     */
    getManualTimes(context) {
        return this._resolve(context, 'manual-times', (payload) => this._timesheetStatisticsService.getManualTimes(payload));
    }
    /**
     * Per-member weekly / today totals.
     *
     * @param context - The dashboard context to query for.
     */
    getMembers(context) {
        return this._resolve(context, 'members', (payload) => this._timesheetStatisticsService.getMembers(payload));
    }
    /*
    |--------------------------------------------------------------------------
    | Invalidation
    |--------------------------------------------------------------------------
    */
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
    invalidate(context) {
        const scope = context ? this._contextHash(context) : '*';
        const now = Date.now();
        if (this._lastInvalidatedKey === scope && now - this._lastInvalidatedAt < INVALIDATE_COALESCE_MS) {
            return;
        }
        this._lastInvalidatedKey = scope;
        this._lastInvalidatedAt = now;
        this._drop(context);
        this._invalidated$.next();
    }
    /**
     * Unconditionally empties the cache — no coalescing, no notification.
     *
     * Use on hard boundaries (sign-out, organization switch) where replaying a
     * previous tenant's numbers would be wrong.
     */
    clear() {
        this._cache.clear();
        this._lastInvalidatedKey = null;
        this._lastInvalidatedAt = 0;
    }
    /*
    |--------------------------------------------------------------------------
    | Internals
    |--------------------------------------------------------------------------
    */
    /**
     * Builds the long-lived stream handed to widgets: it resolves a cache entry
     * now and again after every invalidation.
     */
    _resolve(context, endpoint, request, 
    // Deliberately NOT `Record<string, unknown>`: spreading an index-signature
    // type into the typed payload literal below widens every value to `unknown`.
    extra) {
        const payload = { ...buildStatisticsRequest(context), ...extra };
        const key = `${this._contextHash(context)}::${endpoint}::${extra ? stableStringify(extra) : ''}`;
        return this._invalidated$.pipe(startWith(undefined), switchMap(() => this._cached(key, () => request(payload))), 
        // refCount so the widget's subscription is the only thing keeping this
        // wrapper alive; the cached entry itself outlives it (that is the point).
        shareReplay({ bufferSize: 1, refCount: true }));
    }
    /**
     * Returns the shared observable for `key`, creating it on a miss.
     *
     * `defer` keeps the call lazy (nothing is requested until a widget
     * subscribes) and `shareReplay({ refCount: false })` hands the SAME in-flight
     * promise to every subsequent subscriber — this is what collapses six
     * counter widgets into one HTTP request.
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
            // TTL; evict it so the next widget (or retry) hits the network again.
            if (own.entry && this._cache.get(key) === own.entry) {
                this._cache.delete(key);
            }
            return throwError(() => error);
        }));
        own.entry = { stream$, expiresAt: now + STATISTICS_CACHE_TTL_MS };
        this._cache.set(key, own.entry);
        return stream$;
    }
    /** Stable fingerprint of the context-derived part of a request payload. */
    _contextHash(context) {
        return stableStringify(buildStatisticsRequest(context));
    }
    /** Removes cache entries for one context, or all of them. */
    _drop(context) {
        if (!context) {
            this._cache.clear();
            return;
        }
        const prefix = `${this._contextHash(context)}::`;
        for (const key of Array.from(this._cache.keys())) {
            if (key.startsWith(prefix)) {
                this._cache.delete(key);
            }
        }
    }
    /** Drops expired entries so long sessions don't accumulate dead payload keys. */
    _prune(now) {
        for (const [key, entry] of Array.from(this._cache.entries())) {
            if (entry.expiresAt <= now) {
                this._cache.delete(key);
            }
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TimesheetStatisticsCacheService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TimesheetStatisticsCacheService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TimesheetStatisticsCacheService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }] });
//# sourceMappingURL=timesheet-statistics-cache.service.js.map