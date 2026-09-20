import { OnInit } from '@angular/core';
import { ICountsStatistics } from '@gauzy/contracts';
import { IDashboardWidgetContext } from '@gauzy/ui-core/core';
import { BaseDashboardWidgetComponent } from '@gauzy/ui-core/shared';
import { RangePeriod } from './time-track-widget.utils';
import * as i0 from "@angular/core";
/**
 * Shared data layer for every Time Tracking counter widget.
 *
 * All six counters are projections of the very same
 * `/timesheet/statistics/counts` payload, so they all subscribe to the ambient
 * dashboard context here and fetch through {@link TimesheetStatisticsCacheService}.
 * The cache collapses the six identical in-flight requests into one — which is
 * the whole reason a counter is cheap enough to be dropped on a canvas six times.
 *
 * Subclasses only decide *which* number of the payload they show and how it is
 * formatted; they never fetch.
 */
export declare abstract class BaseTimeTrackCounterWidgetComponent extends BaseDashboardWidgetComponent implements OnInit {
    private readonly _statisticsCache;
    /** Manual re-fetch trigger, fed by {@link refresh}. */
    private readonly _reload$;
    /** Latest counts payload; `null` until the first successful fetch. */
    protected readonly counts: import("@angular/core").WritableSignal<ICountsStatistics>;
    /** Context the current payload was fetched for; powers the period-aware titles. */
    protected readonly widgetContext: import("@angular/core").WritableSignal<IDashboardWidgetContext>;
    /** Day / week / arbitrary-period classification of the selected range. */
    protected readonly rangePeriod: import("@angular/core").Signal<RangePeriod>;
    /** True when the selected range is exactly the current calendar week. */
    protected readonly isCurrentWeek: import("@angular/core").Signal<boolean>;
    /** Workable seconds in the range across all members — the duration counters' denominator. */
    protected readonly periodSeconds: import("@angular/core").Signal<number>;
    /** Displayable form of the base class' `error` signal. */
    protected readonly errorMessage: import("@angular/core").Signal<string>;
    /**
     * Starts the counts subscription.
     *
     * Deliberately does NOT call `super.ngOnInit()`: the base class' default is to
     * call {@link refresh} on every context emission, which here would push an
     * extra value through `_reload$` and fetch the same payload twice. This class
     * subscribes to `context$` itself instead.
     *
     * Subclasses that need extra data (total members, total projects) override
     * this and must call `super.ngOnInit()`.
     */
    ngOnInit(): void;
    /**
     * Re-fetches the counts payload, clearing any previous error first.
     *
     * Invoked by the widget host's refresh control and by the card's retry button.
     */
    refresh(): void;
    /**
     * Wires `context$` (plus manual reloads) to the cached counts endpoint and
     * mirrors the request lifecycle into the `loading` / `error` signals.
     */
    private observeCounts;
    static ɵfac: i0.ɵɵFactoryDeclaration<BaseTimeTrackCounterWidgetComponent, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<BaseTimeTrackCounterWidgetComponent, never, never, {}, {}, never, never, true, never>;
}
