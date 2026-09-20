import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IDashboardWidgetContext } from '@gauzy/ui-core/core';
import { IProjectManagementSnapshot } from './project-management-dashboard.types';
import * as i0 from "@angular/core";
/**
 * How many tasks one snapshot samples.
 *
 * The legacy panel pages through the whole task list with an infinite scroll; a
 * canvas card has no room for that, so the widgets read one page. It is a shared
 * CONSTANT rather than a per-widget setting because two widgets asking for
 * different page sizes would hash to different cache keys and defeat the request
 * sharing this service exists for.
 *
 * Set to 100 — the hard ceiling `PaginationQueryDTO.take` (`@Max(100)`) enforces
 * on the API side, so this is as large a sample as the endpoints can return in
 * one call. That matters beyond the row count: the Most Viewed Projects ranking
 * is derived from this same page, so the page size IS the ranking's sample size
 * (see `sortProjectsByPopularity`). Ranking beyond it would need a server-side
 * "tasks per project" aggregate, which no endpoint exposes today.
 */
export declare const PROJECT_MANAGEMENT_TASKS_PAGE_SIZE = 100;
/** An endpoint plus the query string to call it with. */
interface ITasksRequest {
    readonly endPoint: string;
    readonly params: HttpParams;
}
/**
 * Builds the task request for a dashboard context.
 *
 * Parity-critical: it reproduces
 * `ProjectManagementDetailsComponent._setSmartTableSource()` — the same two
 * endpoints, the same relations and the same `dueDate` ascending order — with
 * ONE correction.
 *
 * The legacy page sends `where.employeeId` to `/tasks/employee`, but
 * `TaskService.getEmployeeTasks()` reads `where.members.id` and ignores every
 * other key (it builds its query by hand and never feeds `where` to TypeORM).
 * For a user holding `CHANGE_SELECTED_EMPLOYEE` — i.e. every admin who can use
 * the employee selector — that means the legacy panel silently returns the whole
 * organization's tasks whichever employee is picked. This sends the key the
 * server actually reads, so the widget honours the selector.
 *
 * @param context - The ambient dashboard context.
 * @returns The endpoint and params to fetch the task page with.
 */
export declare function buildProjectManagementTasksRequest(context: IDashboardWidgetContext): ITasksRequest;
/**
 * Single source of truth for every Project Management dashboard widget.
 *
 * The legacy `ProjectManagementDetailsComponent` derives its Today, Most Viewed
 * Projects and Recently Assigned panels from ONE task list, and so does this
 * service. Without it, dropping the three data-driven widgets on a canvas would
 * issue three identical requests on every context change.
 *
 * Keyed by {@link projectManagementScopeKey}, so a widget that narrows the
 * context (pinned to one project, say) correctly gets its own fetch.
 *
 * Calls `HttpClient` directly rather than going through `TasksService`: that
 * service's `errorHandler` raises a global toastr on every failure, which for a
 * canvas of widgets means a stack of toasts for a problem that belongs inside
 * the failing card — and it rethrows a bare string, losing the status code.
 *
 * Errors are NOT swallowed: widgets need them to render an error state. As usual
 * in RxJS an error terminates the subscription, so a widget's `refresh()` must
 * RE-SUBSCRIBE (call {@link getSnapshot} again) rather than only invalidating —
 * the failed cache entry is evicted on error, so the re-call hits the network.
 */
export declare class ProjectManagementTasksService {
    private readonly _http;
    private readonly _cache;
    private readonly _invalidated$;
    /** Guards against the refresh stampede described on {@link INVALIDATE_COALESCE_MS}. */
    private _lastInvalidatedKey;
    private _lastInvalidatedAt;
    /** Emits after every effective invalidation. */
    readonly invalidated$: Observable<void>;
    /**
     * Long-lived stream of the task snapshot for one dashboard context.
     *
     * Re-resolves against the cache after every {@link invalidate}, so a widget
     * can hold a single subscription and still receive refreshed data.
     *
     * @param context - The ambient dashboard context to query for.
     * @returns The snapshot stream; it errors when the underlying request fails.
     */
    getSnapshot(context: IDashboardWidgetContext): Observable<IProjectManagementSnapshot>;
    /**
     * Drops cached snapshots so the next subscriber re-fetches, and notifies live
     * streams to re-resolve.
     *
     * Repeated calls for the same scope within {@link INVALIDATE_COALESCE_MS} are
     * ignored, so every Project Management widget on a canvas may call this from
     * its own `refresh()` without causing a request storm.
     *
     * @param context - Limit the invalidation to one context; omit to drop everything.
     */
    invalidate(context?: IDashboardWidgetContext): void;
    /**
     * Unconditionally empties the cache — no coalescing, no notification.
     *
     * Use on hard boundaries (sign-out, organization switch) where replaying a
     * previous organization's tasks would be wrong.
     */
    clear(): void;
    /**
     * Returns the shared observable for `key`, creating it on a miss.
     *
     * `HttpClient` observables are cold, so nothing is fetched until a widget
     * subscribes; `shareReplay({ refCount: false })` then hands the SAME in-flight
     * response to every subsequent subscriber — this is what collapses the three
     * data-driven widgets into one HTTP request, and what keeps the entry warm for
     * the whole TTL after the last widget has unsubscribed.
     */
    private _cached;
    /**
     * Removes one scope from the cache.
     *
     * @param key - The scope key to evict.
     * @returns The evicted entry, if there was one, for {@link _release}.
     */
    private _drop;
    /**
     * Empties the cache.
     *
     * @returns Every evicted entry, for {@link _release}.
     */
    private _dropAll;
    /**
     * Aborts the requests of entries that are no longer reachable.
     *
     * Without this, a refresh issued while a fetch is still in flight would leave
     * TWO requests running for the same scope: the evicted entry holds its source
     * subscription open (`refCount: false`) even after every widget has switched
     * away, so nothing would ever tear it down, and its response would be parsed
     * and thrown away.
     *
     * @param entries - The entries {@link _drop} / {@link _dropAll} removed.
     */
    private _release;
    /**
     * Drops expired entries so long sessions do not accumulate dead scopes.
     *
     * Deliberately does NOT {@link _release} what it drops. Expiry only means the
     * entry is too stale to be handed to the NEXT subscriber; widgets that are
     * already subscribed keep theirs. Aborting here would cut off a request that
     * merely outlived the TTL — its widget would complete without a value and sit
     * in the loading state forever. Only an explicit invalidate/clear, where every
     * subscriber is told to re-resolve, may abort.
     */
    private _prune;
    static ɵfac: i0.ɵɵFactoryDeclaration<ProjectManagementTasksService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ProjectManagementTasksService>;
}
export {};
