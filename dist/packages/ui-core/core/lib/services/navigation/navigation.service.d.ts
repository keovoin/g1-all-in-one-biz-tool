import { DestroyRef } from '@angular/core';
import { ActivatedRoute, QueryParamsHandling, Router } from '@angular/router';
import * as i0 from "@angular/core";
export declare class NavigationService {
    private readonly _router;
    private readonly _activatedRoute;
    private readonly _destroyRef;
    /**
     * Query-param patches accumulated between flushes. Writes COALESCE: a burst
     * (e.g. an organization switch cascading into team/project rewrites) merges
     * into one router navigation, last value per key wins — the same end state
     * the old synchronous `location.replaceState` produced, without issuing one
     * navigation per write.
     */
    private _pending;
    /** Callers awaiting the flush that will carry their patch. */
    private _pendingResolvers;
    private _flushScheduled;
    constructor(_router: Router, _activatedRoute: ActivatedRoute, _destroyRef: DestroyRef);
    /**
     * Navigates to the current route with specified query parameters, while preserving existing ones.
     *
     * @param queryParams The query parameters to be attached.
     */
    navigateQueryParams(route: string[], queryParams: {
        [key: string]: string | string[] | boolean;
    }, queryParamsHandling?: QueryParamsHandling): Promise<void>;
    /**
     * Updates the query parameters of the current route without a history entry.
     *
     * THE ROUTER OWNS THE WRITE. This used to build the URL by hand and call
     * `location.replaceState`, which the router cannot see: `currentUrlTree`
     * never contained the written params, so the first cancelled or failed
     * navigation had `resetUrlToCurrentUrlTree` rewrite the URL WITHOUT them —
     * the date-range/organization params silently vanished (observed live on
     * demo). `router.navigate` keeps tree and URL in agreement.
     *
     * The write is DEFERRED (macrotask) and RETRIED after any in-flight
     * navigation settles, never issued mid-flight:
     * - deferred, because callers like the app component's bookmark writer run
     *   synchronously inside NavigationEnd — where `getCurrentNavigation()` is
     *   still non-null (it is nulled only in the router's `finalize`), so a
     *   naive "skip while navigating" guard would drop that write on every
     *   navigation, and `route.data` never re-emits to heal it;
     * - retried (not dropped), because some writes are one-shot (the
     *   organization selector's startup write) — a dropped patch here would
     *   not self-heal.
     *
     * Removal semantics are preserved exactly: `''`, `null`, `undefined` and
     * empty arrays all REMOVE a param (the team/project selectors pass `''`
     * meaning "All" — under plain router merge that would survive as
     * `?teamId=`), while `false` and `0` are kept. Arrays are deduplicated.
     *
     * @param queryParams The query parameters to be updated.
     * @param queryParamsHandling The strategy to handle the query parameters (default is 'merge').
     *                            Every current caller merges; a non-merge patch replaces the
     *                            pending accumulation wholesale.
     */
    updateQueryParams(queryParams: {
        [key: string]: string | string[] | boolean;
    }, queryParamsHandling?: QueryParamsHandling): Promise<void>;
    /**
     * Maps the service's historical "empty means remove" contract onto the
     * router's: `createUrlTree` merge removes `null`/`undefined` but keeps `''`
     * (serialized as `?key=`) and empty arrays, so both become `null` here.
     */
    private _normalize;
    /**
     * Schedules a flush on a MACROTASK. A microtask is not enough: a write made
     * synchronously during NavigationEnd would flush before the router's
     * `finalize` clears `currentNavigation`, see `updateQueryParams`.
     */
    private _scheduleFlush;
    private _flush;
    static ɵfac: i0.ɵɵFactoryDeclaration<NavigationService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<NavigationService>;
}
