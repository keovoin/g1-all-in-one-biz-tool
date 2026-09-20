import { OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ID } from '@gauzy/contracts';
import { IDashboardWidgetContext } from '@gauzy/ui-core/core';
import { BaseDashboardWidgetComponent } from '../../widget-host/base-dashboard-widget.component';
import { AccountingStatisticsCacheService } from './accounting-statistics-cache.service';
import * as i0 from "@angular/core";
/**
 * Shared data layer for the two employee-scoped history widgets (Records History
 * and Profit History).
 *
 * Both render a component that used to exist ONLY as a modal dialog, fed by the
 * Human Resources page. On a canvas there is no opener to hand them their rows,
 * so this class does what `HumanResourcesComponent.openHistoryDialog()` /
 * `openProfitDialog()` did: resolve the employee in scope, fetch from
 * `/employee-statistics/history` through {@link AccountingStatisticsCacheService}
 * (which collapses the requests both widgets share into one), and mirror the
 * request lifecycle into the `loading` / `error` signals.
 *
 * Subclasses only decide WHICH requests make up their payload.
 *
 * @typeParam T - Shape of the payload the subclass renders.
 */
export declare abstract class BaseEmployeeHistoryWidgetComponent<T> extends BaseDashboardWidgetComponent implements OnInit {
    protected readonly statisticsCache: AccountingStatisticsCacheService;
    /** Manual re-fetch trigger, fed by {@link refresh}. */
    private readonly _reload$;
    /** Context the current payload was fetched for. */
    protected readonly widgetContext: import("@angular/core").WritableSignal<IDashboardWidgetContext>;
    /** Latest payload; `null` until the first successful fetch. */
    protected readonly payload: import("@angular/core").WritableSignal<T>;
    /** The employee the history is about, or `null` when none is in scope. */
    protected readonly employeeId: import("@angular/core").Signal<string>;
    /**
     * True when the widget has nothing to query.
     *
     * `/employee-statistics/history` is per-employee, so with the selector on "All
     * employees" there is no request to make — the widget shows an actionable hint
     * instead of an empty table that looks like "this person has no records".
     */
    protected readonly requiresEmployee: import("@angular/core").Signal<boolean>;
    /**
     * Starts the history subscription.
     *
     * Deliberately does NOT call `super.ngOnInit()`: the base class' default is to
     * call {@link refresh} on every context emission, which here would push an
     * extra value through the reload trigger and fetch the same payload twice.
     * This class subscribes to `context$` itself instead.
     */
    ngOnInit(): void;
    /**
     * Re-fetches the payload, clearing any previous error first.
     *
     * Invoked by the widget host's refresh control and by the state wrapper's
     * retry button.
     */
    refresh(): void;
    /**
     * Issues the request(s) making up this widget's payload.
     *
     * @param context - The context to query for.
     * @param employeeId - The employee in scope.
     * @returns The payload stream.
     */
    protected abstract fetch(context: IDashboardWidgetContext, employeeId: ID): Observable<T>;
    /**
     * Drops whatever this widget cached, so {@link refresh} really re-fetches.
     *
     * @param context - The context the payload was fetched for.
     * @param employeeId - The employee in scope.
     */
    protected abstract invalidate(context: IDashboardWidgetContext, employeeId: ID): void;
    /**
     * Wires `context$` (plus manual reloads) to {@link fetch} and mirrors the
     * request lifecycle into the `loading` / `error` signals.
     */
    private observeHistory;
    /**
     * One fetch for the given context, or nothing when there is no employee.
     *
     * @param context - The context to query for.
     * @returns The payload, or `null` when the request failed.
     */
    private fetchFor;
    static ɵfac: i0.ɵɵFactoryDeclaration<BaseEmployeeHistoryWidgetComponent<any>, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<BaseEmployeeHistoryWidgetComponent<any>, never, never, {}, {}, never, never, true, never>;
}
