import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { EmployeeStatisticsHistoryEnum } from '@gauzy/contracts';
import { ProfitHistoryModule } from '../../profit-history/profit-history.module';
// The totals come from `/employee-statistics/months`, the same payload every HR
// info block reads — through the same cache, so a canvas holding this widget and
// the HR blocks still issues one request for it.
import { EmployeeMonthStatisticsCacheService } from '../charts/employee-month-statistics-cache.service';
import { sumHrStatistics } from '../hr/hr-statistics.utils';
import { TeamsWidgetStateComponent } from '../teams/teams-widget-state.component';
import { BaseEmployeeHistoryWidgetComponent } from './base-employee-history-widget.component';
import * as i0 from "@angular/core";
import * as i1 from "../../profit-history/profit-history.component";
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
export class ProfitHistoryWidgetComponent extends BaseEmployeeHistoryWidgetComponent {
    constructor() {
        super(...arguments);
        this._monthStatisticsCache = inject(EmployeeMonthStatisticsCacheService);
    }
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
    fetch(context, employeeId) {
        return combineLatest([
            this.statisticsCache.getStatisticsHistory(context, employeeId, EmployeeStatisticsHistoryEnum.INCOME),
            this.statisticsCache.getStatisticsHistory(context, employeeId, EmployeeStatisticsHistoryEnum.EXPENSES),
            this._monthStatisticsCache.getMonthStatistics(context, employeeId)
        ]).pipe(map(([incomes, expenses, months]) => {
            const totals = sumHrStatistics(months);
            return {
                incomes: incomes ?? [],
                expenses: expenses ?? [],
                incomeTotal: totals.income,
                expenseTotal: totals.expense,
                profit: totals.profit
            };
        }));
    }
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
    invalidate(context, employeeId) {
        this.statisticsCache.invalidateHistory(context, employeeId, EmployeeStatisticsHistoryEnum.INCOME);
        this.statisticsCache.invalidateHistory(context, employeeId, EmployeeStatisticsHistoryEnum.EXPENSES);
        this._monthStatisticsCache.invalidate(context, employeeId);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ProfitHistoryWidgetComponent, deps: null, target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: ProfitHistoryWidgetComponent, isStandalone: true, selector: "ga-accounting-profit-history-widget", usesInheritance: true, ngImport: i0, template: "<!--\n\t`empty` carries the \"no employee selected\" case only: once an employee IS in\n\tscope the wrapped report renders its own \"no profit history\" message, so a\n\tsecond empty state here would hide it.\n-->\n<ga-teams-widget-state\n\t[loading]=\"loading()\"\n\t[error]=\"error()\"\n\t[empty]=\"requiresEmployee()\"\n\t[skeletonRows]=\"5\"\n\temptyMessageKey=\"DASHBOARD_PAGE.BUILDER.WIDGETS.HR.NO_EMPLOYEE\"\n\t(retry)=\"refresh()\"\n>\n\t<ga-profit-history-selector [records]=\"payload()\"></ga-profit-history-selector>\n</ga-teams-widget-state>\n", styles: [":host{display:block;height:100%;width:100%;min-width:0;overflow:hidden}ga-profit-history-selector{display:block;height:100%;width:100%;min-width:0;overflow:auto}\n"], dependencies: [{ kind: "ngmodule", type: ProfitHistoryModule }, { kind: "component", type: i1.ProfitHistoryComponent, selector: "ga-profit-history-selector", inputs: ["records"] }, { kind: "component", type: TeamsWidgetStateComponent, selector: "ga-teams-widget-state", inputs: ["loading", "error", "empty", "emptyMessageKey", "skeletonRows"], outputs: ["retry"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ProfitHistoryWidgetComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-accounting-profit-history-widget', standalone: true, imports: [ProfitHistoryModule, TeamsWidgetStateComponent], changeDetection: ChangeDetectionStrategy.OnPush, template: "<!--\n\t`empty` carries the \"no employee selected\" case only: once an employee IS in\n\tscope the wrapped report renders its own \"no profit history\" message, so a\n\tsecond empty state here would hide it.\n-->\n<ga-teams-widget-state\n\t[loading]=\"loading()\"\n\t[error]=\"error()\"\n\t[empty]=\"requiresEmployee()\"\n\t[skeletonRows]=\"5\"\n\temptyMessageKey=\"DASHBOARD_PAGE.BUILDER.WIDGETS.HR.NO_EMPLOYEE\"\n\t(retry)=\"refresh()\"\n>\n\t<ga-profit-history-selector [records]=\"payload()\"></ga-profit-history-selector>\n</ga-teams-widget-state>\n", styles: [":host{display:block;height:100%;width:100%;min-width:0;overflow:hidden}ga-profit-history-selector{display:block;height:100%;width:100%;min-width:0;overflow:auto}\n"] }]
        }] });
//# sourceMappingURL=profit-history-widget.component.js.map