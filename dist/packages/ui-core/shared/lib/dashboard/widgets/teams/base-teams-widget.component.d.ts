import { OnInit } from '@angular/core';
import { IDashboardWidgetContext } from '@gauzy/ui-core/core';
import { BaseDashboardWidgetComponent } from '../../widget-host/base-dashboard-widget.component';
import { ITeamsDashboardSnapshot } from './teams-dashboard.types';
import * as i0 from "@angular/core";
/**
 * Shared data layer for every Teams dashboard widget.
 *
 * All Teams widgets are projections of the very same snapshot — teams, their
 * classified members, the worked project/member counts and the range's activity
 * percentage — so they all subscribe to the ambient dashboard context here and
 * fetch through {@link TeamsDashboardStatisticsService}. That service collapses
 * the identical in-flight requests into one, which is what makes it cheap to
 * drop several Teams widgets on the same canvas.
 *
 * Subclasses only decide WHICH part of the snapshot they render; they never fetch.
 */
export declare abstract class BaseTeamsWidgetComponent extends BaseDashboardWidgetComponent implements OnInit {
    private readonly _statistics;
    /** Manual re-fetch trigger, fed by {@link refresh}. */
    private readonly _reload$;
    /** Latest snapshot; `null` until the first successful fetch. */
    protected readonly snapshot: import("@angular/core").WritableSignal<ITeamsDashboardSnapshot>;
    /** Context the current snapshot was fetched for. */
    protected readonly widgetContext: import("@angular/core").WritableSignal<IDashboardWidgetContext>;
    /**
     * Starts the snapshot subscription.
     *
     * Deliberately does NOT call `super.ngOnInit()`: the base class' default is to
     * call {@link refresh} on every context emission, which here would push an
     * extra value through `_reload$` and fetch the same snapshot twice. This class
     * subscribes to `context$` itself instead.
     *
     * Subclasses that need extra data must override this and call `super.ngOnInit()`.
     */
    ngOnInit(): void;
    /**
     * Re-fetches the snapshot, clearing any previous error first.
     *
     * Invoked by the widget host's refresh control and by the card's retry button.
     */
    refresh(): void;
    /**
     * Wires `context$` (plus manual reloads) to the snapshot service and mirrors
     * the request lifecycle into the `loading` / `error` signals.
     */
    private observeSnapshot;
    static ɵfac: i0.ɵɵFactoryDeclaration<BaseTeamsWidgetComponent, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<BaseTeamsWidgetComponent, never, never, {}, {}, never, never, true, never>;
}
