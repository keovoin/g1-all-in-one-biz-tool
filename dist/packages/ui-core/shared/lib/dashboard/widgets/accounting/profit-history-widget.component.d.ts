import { Observable } from 'rxjs';
import { ID, IEmployeeStatisticsHistory } from '@gauzy/contracts';
import { IDashboardWidgetContext } from '@gauzy/ui-core/core';
import { BaseEmployeeHistoryWidgetComponent } from './base-employee-history-widget.component';
import * as i0 from "@angular/core";
/** Exactly the object `ProfitHistoryComponent` renders. */
export interface IProfitHistoryRecords {
    incomes: IEmployeeStatisticsHistory[];
    expenses: IEmployeeStatisticsHistory[];
    incomeTotal: number;
    expenseTotal: number;
    profit: number;
}
/**
 * The Human Resources profit report, inline on a canvas.
 *
 * `ProfitHistoryComponent` only ever existed as a modal: the HR page fetched two
 * histories, took the totals it had already computed for its own blocks, and
 * handed the lot to `NbDialogService`. This widget reuses that exact component
 * and reproduces `HumanResourcesComponent.openProfitDialog()` faithfully —
 * including the fact that the three totals come from `/employee-statistics/months`
 * rather than from summing the history rows, which report gross amounts and
 * would disagree with the HR dashboard's own figures.
 *
 * All three requests go through caches shared with the other widgets, so the
 * income history is the SAME request a Records History widget configured to
 * "Total Income" makes, and the totals are the same payload the HR info blocks
 * read.
 */
export declare class ProfitHistoryWidgetComponent extends BaseEmployeeHistoryWidgetComponent<IProfitHistoryRecords> {
    private readonly _monthStatisticsCache;
    /**
     * Fetches both histories and the monthly totals for the employee in scope.
     *
     * `combineLatest` rather than `forkJoin`: the cached streams are long-lived so
     * they can re-emit after an invalidation, and `forkJoin` — which waits for
     * completion — would never emit at all.
     *
     * @param context - The context to query for.
     * @param employeeId - The employee in scope.
     * @returns The records object the profit report renders.
     */
    protected fetch(context: IDashboardWidgetContext, employeeId: ID): Observable<IProfitHistoryRecords>;
    /**
     * Drops everything this widget cached, so a manual refresh really re-fetches.
     *
     * All three caches coalesce invalidations per scope, so the sibling widgets
     * sharing these payloads still cause one request each rather than one per
     * widget.
     *
     * @param context - The context the payload was fetched for.
     * @param employeeId - The employee in scope.
     */
    protected invalidate(context: IDashboardWidgetContext, employeeId: ID): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ProfitHistoryWidgetComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ProfitHistoryWidgetComponent, "ga-accounting-profit-history-widget", never, {}, {}, never, never, true, never>;
}
