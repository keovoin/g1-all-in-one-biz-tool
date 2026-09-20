import { OnInit } from '@angular/core';
import { IDashboardWidgetContext } from '@gauzy/ui-core/core';
import { BaseDashboardWidgetComponent } from '../../widget-host/base-dashboard-widget.component';
import { IProjectManagementSnapshot } from './project-management-dashboard.types';
import * as i0 from "@angular/core";
/**
 * Shared data layer for every data-driven Project Management widget.
 *
 * The Today, Most Viewed Projects and Recently Assigned panels are three
 * projections of the very same task page, so they all subscribe to the ambient
 * dashboard context here and fetch through {@link ProjectManagementTasksService}.
 * That service collapses the identical in-flight requests into one, which is
 * what makes it cheap to drop all three on the same canvas.
 *
 * Subclasses only decide WHICH part of the snapshot they render; they never
 * fetch. The Inbox widget does not extend this class — it has no data source.
 */
export declare abstract class BaseProjectManagementWidgetComponent extends BaseDashboardWidgetComponent implements OnInit {
    private readonly _tasks;
    /** Manual re-fetch trigger, fed by {@link refresh}. */
    private readonly _reload$;
    /** Latest snapshot; `null` until the first successful fetch. */
    protected readonly snapshot: import("@angular/core").WritableSignal<IProjectManagementSnapshot>;
    /** Context the current snapshot was fetched for. */
    protected readonly widgetContext: import("@angular/core").WritableSignal<IDashboardWidgetContext>;
    /**
     * Starts the snapshot subscription.
     *
     * Deliberately does NOT call `super.ngOnInit()`: the base class' default is to
     * call {@link refresh} on every context emission, which here would push an
     * extra value through `_reload$` and fetch the same page twice. This class
     * subscribes to `context$` itself instead.
     *
     * Subclasses that need extra data must override this and call `super.ngOnInit()`.
     */
    ngOnInit(): void;
    /**
     * Re-fetches the task page, clearing any previous error first.
     *
     * Invoked by the widget host's refresh control and by the card's retry button.
     */
    refresh(): void;
    /**
     * Wires `context$` (plus manual reloads) to the task service and mirrors the
     * request lifecycle into the `loading` / `error` signals.
     */
    private observeSnapshot;
    static ɵfac: i0.ɵɵFactoryDeclaration<BaseProjectManagementWidgetComponent, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<BaseProjectManagementWidgetComponent, never, never, {}, {}, never, never, true, never>;
}
