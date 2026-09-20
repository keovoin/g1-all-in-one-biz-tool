import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { from, of } from 'rxjs';
import { catchError, take } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EmployeeStatisticsHistoryEnum } from '@gauzy/contracts';
import { BaseHrInfoWidgetComponent } from './base-hr-info-widget.component';
import { HrInfoCardComponent } from './hr-info-card.component';
import { HR_BLOCK_COLORS } from './hr-statistics.utils';
import * as i0 from "@angular/core";
/**
 * Human Resources block: income minus expenses for the selected employee.
 *
 * Rendered in the emphasized (`highlight`) variant, like the legacy page, and
 * flips from the success colour to the danger colour when it goes negative —
 * which is the one number on this dashboard nobody should have to read twice.
 *
 * Clicking it opens the profit history: incomes and expenses side by side, so
 * the figure can be traced back to the records that produced it.
 */
export class HrProfitWidgetComponent extends BaseHrInfoWidgetComponent {
    constructor() {
        super(...arguments);
        /** Formatted profit. */
        this.value = computed(() => this.formatAmount(this.totals().profit), ...(ngDevMode ? [{ debugName: "value" }] : []));
        /** Success while the employee is in the black, danger once they are not. */
        this.color = computed(() => this.signedColor(this.totals().profit, HR_BLOCK_COLORS.INCOME, HR_BLOCK_COLORS.NEGATIVE), ...(ngDevMode ? [{ debugName: "color" }] : []));
        /** Already formatted amounts interpolated into the "income − expenses" line. */
        this.metaParams = computed(() => {
            const totals = this.totals();
            return {
                totalAllIncome: this.formatAmount(totals.income),
                totalExpense: this.formatAmount(totals.expense)
            };
        }, ...(ngDevMode ? [{ debugName: "metaParams" }] : []));
    }
    /**
     * Opens the profit history dialog — incomes and expenses side by side.
     *
     * Overrides the base's single-history behaviour because profit is derived from
     * two record sets, exactly as `HumanResourcesComponent.openProfitDialog()`
     * does. Both requests and the dialog bundle are loaded in parallel, and any
     * failure is reported rather than silently swallowing the click.
     */
    openProfitHistory() {
        const context = this.widgetContext();
        const employeeId = this.employeeId();
        if (!context || !employeeId || !this.dialogs) {
            return;
        }
        // Captured with the rest of the click-time scope. Reading `totals()`
        // after the await would pair the OLD employee's records with the NEW
        // employee's totals whenever the selection moves while the fetch is in
        // flight — a dialog that silently disagrees with itself.
        const totals = this.totals();
        const { startDate, endDate, organizationId, tenantId } = context;
        const history = (type) => this.employeeStatistics.getEmployeeStatisticsHistory({
            employeeId,
            startDate,
            endDate,
            type,
            organizationId,
            tenantId
        });
        from(Promise.all([
            history(EmployeeStatisticsHistoryEnum.INCOME),
            history(EmployeeStatisticsHistoryEnum.EXPENSES),
            this.loadDeclaredComponent(() => import('../../profit-history/profit-history.module'), () => import('../../profit-history/profit-history.component'), (module) => module.ProfitHistoryComponent)
        ]))
            .pipe(take(1), catchError((error) => {
            this.reportActionError(error);
            return of(null);
        }), takeUntilDestroyed(this.destroyRef))
            .subscribe((resolved) => {
            if (!resolved) {
                return;
            }
            const [incomes, expenses, component] = resolved;
            this.dialogs?.open(component, {
                context: {
                    records: {
                        incomes,
                        expenses,
                        incomeTotal: totals.income,
                        expenseTotal: totals.expense,
                        profit: totals.profit
                    }
                }
            });
        });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: HrProfitWidgetComponent, deps: null, target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: HrProfitWidgetComponent, isStandalone: true, selector: "ga-hr-profit-widget", usesInheritance: true, ngImport: i0, template: "<ga-hr-info-card\n\ttitleKey=\"DASHBOARD_PAGE.DEVELOPER.PROFIT\"\n\tmetaKey=\"DASHBOARD_PAGE.DEVELOPER.PROFIT_CALC\"\n\t[metaParams]=\"metaParams()\"\n\t[value]=\"value()\"\n\t[color]=\"color()\"\n\t[highlight]=\"true\"\n\t[loading]=\"loading()\"\n\t[error]=\"error()\"\n\t[hasEmployee]=\"hasEmployee()\"\n\t(openInfo)=\"openProfitHistory()\"\n\t(retry)=\"refresh()\"\n></ga-hr-info-card>\n", dependencies: [{ kind: "component", type: HrInfoCardComponent, selector: "ga-hr-info-card", inputs: ["titleKey", "metaKey", "metaParams", "value", "color", "highlight", "rows", "loading", "error", "hasEmployee", "unavailableKey"], outputs: ["openInfo", "openRow", "retry"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: HrProfitWidgetComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-hr-profit-widget', standalone: true, imports: [HrInfoCardComponent], changeDetection: ChangeDetectionStrategy.OnPush, template: "<ga-hr-info-card\n\ttitleKey=\"DASHBOARD_PAGE.DEVELOPER.PROFIT\"\n\tmetaKey=\"DASHBOARD_PAGE.DEVELOPER.PROFIT_CALC\"\n\t[metaParams]=\"metaParams()\"\n\t[value]=\"value()\"\n\t[color]=\"color()\"\n\t[highlight]=\"true\"\n\t[loading]=\"loading()\"\n\t[error]=\"error()\"\n\t[hasEmployee]=\"hasEmployee()\"\n\t(openInfo)=\"openProfitHistory()\"\n\t(retry)=\"refresh()\"\n></ga-hr-info-card>\n" }]
        }] });
//# sourceMappingURL=hr-profit-widget.component.js.map