import { OnInit, Signal } from '@angular/core';
import { Observable } from 'rxjs';
import { IDashboardWidgetContext, TimesheetStatisticsCacheService } from '@gauzy/ui-core/core';
import { BaseDashboardWidgetComponent } from '@gauzy/ui-core/shared';
import { RangePeriod } from './time-track-widget.utils';
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
export declare abstract class BaseTimeTrackListWidgetComponent<T> extends BaseDashboardWidgetComponent implements OnInit {
    /** Request-coalescing cache in front of the timesheet statistics endpoints. */
    protected readonly statisticsCache: TimesheetStatisticsCacheService;
    /** Manual re-fetch trigger, fed by {@link refresh}. */
    private readonly _reload$;
    /** Rows currently on screen; empty until the first successful fetch. */
    protected readonly rows: import("@angular/core").WritableSignal<T[]>;
    /** Context the current rows were fetched for; powers the range-aware copy. */
    protected readonly widgetContext: import("@angular/core").WritableSignal<IDashboardWidgetContext>;
    /**
     * Whether a fetch has completed at least once.
     *
     * Without it an empty `rows()` on the very first paint would render "no
     * manual time for the week" before anything had been requested.
     */
    private readonly _loaded;
    /** Day / week / arbitrary-period classification of the selected range. */
    protected readonly rangePeriod: Signal<RangePeriod>;
    /** Displayable form of the base class' `error` signal. */
    protected readonly errorMessage: Signal<string | null>;
    /** True once a fetch has succeeded and produced nothing to show. */
    protected readonly isEmpty: Signal<boolean>;
    /**
     * Range-aware "nothing here" message, e.g. `TIMESHEET.NO_MANUAL_TIME_WEEK`.
     *
     * Safe despite {@link emptyMessageBaseKey} being a subclass field: a
     * `computed` only runs its body when first READ (from the template), long
     * after the subclass' field initializers.
     */
    protected readonly emptyMessageKey: Signal<string>;
    /**
     * Translation key of the empty message WITHOUT its `_DAY` / `_WEEK` /
     * `_PERIOD` suffix, e.g. `TIMESHEET.NO_MANUAL_TIME`.
     */
    protected abstract readonly emptyMessageBaseKey: string;
    /**
     * Reads this panel's endpoint for the given context.
     *
     * Implementations MUST go through {@link statisticsCache} rather than
     * `TimesheetStatisticsService`: the cache is what collapses identical requests
     * into one, and it is also what applies the organization's UTC offset the same
     * way the legacy page does (`buildStatisticsRequest`), so a widget and the
     * standard dashboard never disagree about the same numbers.
     *
     * @param context - The dashboard context to query for.
     * @returns The rows to render.
     */
    protected abstract fetch(context: IDashboardWidgetContext): Observable<T[]>;
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
    ngOnInit(): void;
    /**
     * Re-fetches this panel's rows, clearing any previous error first.
     *
     * Invoked by the widget host's refresh control and by the state wrapper's
     * retry button.
     */
    refresh(): void;
    /**
     * Wires `context$` (plus manual reloads) to {@link fetch} and mirrors the
     * request lifecycle into the `loading` / `error` signals.
     */
    private observeRows;
    static ɵfac: i0.ɵɵFactoryDeclaration<BaseTimeTrackListWidgetComponent<any>, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<BaseTimeTrackListWidgetComponent<any>, never, never, {}, {}, never, never, true, never>;
}
