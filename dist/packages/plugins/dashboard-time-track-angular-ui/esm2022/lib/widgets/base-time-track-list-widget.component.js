import { computed, Directive, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { combineLatest, of, Subject } from 'rxjs';
import { catchError, distinctUntilChanged, filter, map, startWith, switchMap, tap } from 'rxjs/operators';
import { TimesheetStatisticsCacheService } from '@gauzy/ui-core/core';
import { BaseDashboardWidgetComponent } from '@gauzy/ui-core/shared';
import { rangeMessageKey, resolveRangePeriod, timeTrackScopeKey, toErrorMessage } from './time-track-widget.utils';
import * as i0 from "@angular/core";
/**
 * Shared data layer for the five list-shaped Time Tracking widgets — Manual
 * Time, Tasks, Projects, Apps & URLs and Members.
 *
 * Each of them is one of the "windows" the legacy Time Tracking page renders,
 * and each reads a different `/timesheet/statistics/*` endpoint. Fetching goes
 * through {@link TimesheetStatisticsCacheService}, which already exposes every
 * one of those endpoints: it collapses identical in-flight requests into one, so
 * dropping the same panel twice on a canvas (or a panel next to the counters
 * that share its scope) still costs a single HTTP call per endpoint.
 *
 * Subclasses only decide WHICH endpoint they read and how a row renders; they
 * never own loading, error or empty handling.
 *
 * @typeParam T - Row type of the panel.
 */
export class BaseTimeTrackListWidgetComponent extends BaseDashboardWidgetComponent {
    constructor() {
        super(...arguments);
        /** Request-coalescing cache in front of the timesheet statistics endpoints. */
        this.statisticsCache = inject(TimesheetStatisticsCacheService);
        /** Manual re-fetch trigger, fed by {@link refresh}. */
        this._reload$ = new Subject();
        /** Rows currently on screen; empty until the first successful fetch. */
        this.rows = signal([], ...(ngDevMode ? [{ debugName: "rows" }] : []));
        /** Context the current rows were fetched for; powers the range-aware copy. */
        this.widgetContext = signal(null, ...(ngDevMode ? [{ debugName: "widgetContext" }] : []));
        /**
         * Whether a fetch has completed at least once.
         *
         * Without it an empty `rows()` on the very first paint would render "no
         * manual time for the week" before anything had been requested.
         */
        this._loaded = signal(false, ...(ngDevMode ? [{ debugName: "_loaded" }] : []));
        /** Day / week / arbitrary-period classification of the selected range. */
        this.rangePeriod = computed(() => resolveRangePeriod(this.widgetContext()), ...(ngDevMode ? [{ debugName: "rangePeriod" }] : []));
        /** Displayable form of the base class' `error` signal. */
        this.errorMessage = computed(() => toErrorMessage(this.error()), ...(ngDevMode ? [{ debugName: "errorMessage" }] : []));
        /** True once a fetch has succeeded and produced nothing to show. */
        this.isEmpty = computed(() => this._loaded() && this.rows().length === 0, ...(ngDevMode ? [{ debugName: "isEmpty" }] : []));
        /**
         * Range-aware "nothing here" message, e.g. `TIMESHEET.NO_MANUAL_TIME_WEEK`.
         *
         * Safe despite {@link emptyMessageBaseKey} being a subclass field: a
         * `computed` only runs its body when first READ (from the template), long
         * after the subclass' field initializers.
         */
        this.emptyMessageKey = computed(() => rangeMessageKey(this.emptyMessageBaseKey, this.rangePeriod()), ...(ngDevMode ? [{ debugName: "emptyMessageKey" }] : []));
    }
    /**
     * Starts the rows subscription.
     *
     * Deliberately does NOT call `super.ngOnInit()`: the base class' default is to
     * call {@link refresh} on every context emission, which here would push an
     * extra value through `_reload$` and fetch the same payload twice. This class
     * subscribes to `context$` itself instead.
     *
     * Subclasses that need extra data must override this and call `super.ngOnInit()`.
     */
    ngOnInit() {
        // Show the skeleton from the very first paint: the canvas may take a moment
        // to resolve an organization, and an empty list would read as real data.
        this.loading.set(true);
        this.observeRows();
    }
    /**
     * Re-fetches this panel's rows, clearing any previous error first.
     *
     * Invoked by the widget host's refresh control and by the state wrapper's
     * retry button.
     */
    refresh() {
        this.clearError();
        // Without dropping the cached payload a manual refresh inside the cache TTL
        // would silently replay the stale rows. `invalidate()` coalesces per scope,
        // so every Time Tracking widget on the canvas refreshing at once still
        // causes one request per endpoint.
        const context = this.widgetContext();
        if (context) {
            this.statisticsCache.invalidate(context);
        }
        // Pushing through `_reload$` also RE-CALLS `fetch()`. That matters after a
        // failure: an errored cache stream is terminated and no longer reacts to
        // `invalidate()`, so a widget that only invalidated could never recover.
        this._reload$.next();
    }
    /**
     * Wires `context$` (plus manual reloads) to {@link fetch} and mirrors the
     * request lifecycle into the `loading` / `error` signals.
     */
    observeRows() {
        combineLatest([
            // Compare on the request fingerprint only: an unrelated store write
            // hands out a new `organization` object on every emission, and without
            // this each of them would re-run the fetch for an identical payload.
            this.context$.pipe(distinctUntilChanged((previous, current) => timeTrackScopeKey(previous) === timeTrackScopeKey(current))),
            this._reload$.pipe(startWith(undefined))
        ])
            .pipe(map(([context]) => context), 
        // A context without an organization cannot produce a meaningful
        // request; the canvas shows the "select an organization" state.
        filter((context) => !!context?.organizationId), tap((context) => {
            this.widgetContext.set(context);
            this.loading.set(true);
            this.clearError();
        }), 
        // switchMap, not mergeMap: a fast date-range change must abandon the
        // previous request instead of racing it to the signal.
        switchMap((context) => this.fetch(context).pipe(catchError((error) => {
            this.setError(error);
            // `null`, not `[]`: an empty array would blank a working
            // panel and then claim there is no data.
            return of(null);
        }))), tap((rows) => {
            // Keep the last good rows in the signal when a refresh fails: the
            // state wrapper shows the error instead of them, but a successful
            // retry then re-renders straight into the previous content rather
            // than flashing the empty state on the way back.
            if (rows) {
                this.rows.set(rows);
                this._loaded.set(true);
            }
            this.loading.set(false);
        }), takeUntilDestroyed(this.destroyRef))
            .subscribe();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: BaseTimeTrackListWidgetComponent, deps: null, target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "21.0.7", type: BaseTimeTrackListWidgetComponent, isStandalone: true, usesInheritance: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: BaseTimeTrackListWidgetComponent, decorators: [{
            type: Directive
        }] });
//# sourceMappingURL=base-time-track-list-widget.component.js.map