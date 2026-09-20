import { Observable } from 'rxjs';
import { EmployeeStatisticsHistoryEnum, ID, IEmployeeStatisticsHistory } from '@gauzy/contracts';
import { IDashboardWidgetContext } from '@gauzy/ui-core/core';
import { BaseEmployeeHistoryWidgetComponent } from './base-employee-history-widget.component';
import * as i0 from "@angular/core";
/**
 * The Human Resources "records history" table, inline on a canvas.
 *
 * `RecordsHistoryComponent` only ever existed as a modal: the HR page fetched
 * the rows and handed them to `NbDialogService`. This widget reuses that exact
 * component — same columns, same pagination, same empty message — and supplies
 * what the opener used to supply: the employee in scope and the rows for the
 * configured history.
 *
 * WHICH history it shows is a per-placement setting, so one canvas can carry an
 * income table next to an expenses one.
 */
export declare class RecordsHistoryWidgetComponent extends BaseEmployeeHistoryWidgetComponent<IEmployeeStatisticsHistory[]> {
    /**
     * The history this placement renders.
     *
     * A plain field, not a signal: the placement's configuration is injected once
     * when the host builds the widget and cannot change without re-creating it.
     * `toRecordsHistoryType` narrows an unusable persisted value back to the
     * default instead of rendering a table with no columns.
     */
    protected readonly historyType: EmployeeStatisticsHistoryEnum;
    /**
     * The rows to render.
     *
     * An empty array — never `null` — so the wrapped table can always be bound;
     * it renders its own "no records" message, which is why this widget declares
     * no empty state of its own.
     */
    protected readonly records: import("@angular/core").Signal<IEmployeeStatisticsHistory[]>;
    /**
     * Fetches the configured history for the employee in scope.
     *
     * Shared with every other widget reading the same history for the same
     * employee and range — including the Profit History widget, which needs the
     * income and expenses histories.
     *
     * @param context - The context to query for.
     * @param employeeId - The employee in scope.
     * @returns The history rows.
     */
    protected fetch(context: IDashboardWidgetContext, employeeId: ID): Observable<IEmployeeStatisticsHistory[]>;
    /**
     * Drops this widget's cached history so a manual refresh really re-fetches.
     *
     * @param context - The context the rows were fetched for.
     * @param employeeId - The employee in scope.
     */
    protected invalidate(context: IDashboardWidgetContext, employeeId: ID): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<RecordsHistoryWidgetComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<RecordsHistoryWidgetComponent, "ga-accounting-records-history-widget", never, {}, {}, never, never, true, never>;
}
