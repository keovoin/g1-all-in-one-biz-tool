import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { EmployeeStatisticsHistoryEnum } from '@gauzy/contracts';
import { BaseHrInfoWidgetComponent } from './base-hr-info-widget.component';
import { HrInfoCardComponent } from './hr-info-card.component';
import { HR_BLOCK_COLORS } from './hr-statistics.utils';
import * as i0 from "@angular/core";
/**
 * Human Resources block: everything the selected employee cost, salary aside.
 *
 * Employee expenses + split expenses + recurring expenses. Reading it next to
 * {@link HrTotalExpensesWidgetComponent} gives the salary as the difference,
 * which is the comparison the legacy page's header makes.
 */
export class HrExpensesWithoutSalaryWidgetComponent extends BaseHrInfoWidgetComponent {
    constructor() {
        super(...arguments);
        /** Colour of every expense figure. */
        this.color = HR_BLOCK_COLORS.EXPENSE;
        /** History opened when the block is clicked. */
        this.historyType = EmployeeStatisticsHistoryEnum.EXPENSES_WITHOUT_SALARY;
        /** Formatted expenses excluding salary. */
        this.value = computed(() => this.formatAmount(this.totals().expenseWithoutSalary), ...(ngDevMode ? [{ debugName: "value" }] : []));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: HrExpensesWithoutSalaryWidgetComponent, deps: null, target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: HrExpensesWithoutSalaryWidgetComponent, isStandalone: true, selector: "ga-hr-expenses-without-salary-widget", usesInheritance: true, ngImport: i0, template: "<ga-hr-info-card\n\ttitleKey=\"DASHBOARD_PAGE.TITLE.TOTAL_EXPENSES_WITHOUT_SALARY\"\n\tmetaKey=\"DASHBOARD_PAGE.TITLE.TOTAL_EXPENSES_WITHOUT_SALARY_CALC\"\n\t[value]=\"value()\"\n\t[color]=\"color\"\n\t[loading]=\"loading()\"\n\t[error]=\"error()\"\n\t[hasEmployee]=\"hasEmployee()\"\n\t(openInfo)=\"openHistory(historyType)\"\n\t(retry)=\"refresh()\"\n></ga-hr-info-card>\n", dependencies: [{ kind: "component", type: HrInfoCardComponent, selector: "ga-hr-info-card", inputs: ["titleKey", "metaKey", "metaParams", "value", "color", "highlight", "rows", "loading", "error", "hasEmployee", "unavailableKey"], outputs: ["openInfo", "openRow", "retry"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: HrExpensesWithoutSalaryWidgetComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-hr-expenses-without-salary-widget', standalone: true, imports: [HrInfoCardComponent], changeDetection: ChangeDetectionStrategy.OnPush, template: "<ga-hr-info-card\n\ttitleKey=\"DASHBOARD_PAGE.TITLE.TOTAL_EXPENSES_WITHOUT_SALARY\"\n\tmetaKey=\"DASHBOARD_PAGE.TITLE.TOTAL_EXPENSES_WITHOUT_SALARY_CALC\"\n\t[value]=\"value()\"\n\t[color]=\"color\"\n\t[loading]=\"loading()\"\n\t[error]=\"error()\"\n\t[hasEmployee]=\"hasEmployee()\"\n\t(openInfo)=\"openHistory(historyType)\"\n\t(retry)=\"refresh()\"\n></ga-hr-info-card>\n" }]
        }] });
//# sourceMappingURL=hr-expenses-without-salary-widget.component.js.map