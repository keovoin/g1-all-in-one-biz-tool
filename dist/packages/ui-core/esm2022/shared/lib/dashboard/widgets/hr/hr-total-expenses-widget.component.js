import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { EmployeeStatisticsHistoryEnum } from '@gauzy/contracts';
import { BaseHrInfoWidgetComponent } from './base-hr-info-widget.component';
import { HrInfoCardComponent } from './hr-info-card.component';
import { HR_BLOCK_COLORS } from './hr-statistics.utils';
import * as i0 from "@angular/core";
/**
 * Human Resources block: the full cost of the selected employee.
 *
 * Employee expenses + split expenses + recurring expenses + salary — the
 * denominator of the Profit block.
 */
export class HrTotalExpensesWidgetComponent extends BaseHrInfoWidgetComponent {
    constructor() {
        super(...arguments);
        /** Colour of every expense figure. */
        this.color = HR_BLOCK_COLORS.EXPENSE;
        /** History opened when the block is clicked. */
        this.historyType = EmployeeStatisticsHistoryEnum.EXPENSES;
        /** Formatted total expenses. */
        this.value = computed(() => this.formatAmount(this.totals().expense), ...(ngDevMode ? [{ debugName: "value" }] : []));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: HrTotalExpensesWidgetComponent, deps: null, target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: HrTotalExpensesWidgetComponent, isStandalone: true, selector: "ga-hr-total-expenses-widget", usesInheritance: true, ngImport: i0, template: "<ga-hr-info-card\n\ttitleKey=\"DASHBOARD_PAGE.DEVELOPER.TOTAL_EXPENSES\"\n\tmetaKey=\"DASHBOARD_PAGE.TITLE.TOTAL_EXPENSE_CALC\"\n\t[value]=\"value()\"\n\t[color]=\"color\"\n\t[loading]=\"loading()\"\n\t[error]=\"error()\"\n\t[hasEmployee]=\"hasEmployee()\"\n\t(openInfo)=\"openHistory(historyType)\"\n\t(retry)=\"refresh()\"\n></ga-hr-info-card>\n", dependencies: [{ kind: "component", type: HrInfoCardComponent, selector: "ga-hr-info-card", inputs: ["titleKey", "metaKey", "metaParams", "value", "color", "highlight", "rows", "loading", "error", "hasEmployee", "unavailableKey"], outputs: ["openInfo", "openRow", "retry"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: HrTotalExpensesWidgetComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-hr-total-expenses-widget', standalone: true, imports: [HrInfoCardComponent], changeDetection: ChangeDetectionStrategy.OnPush, template: "<ga-hr-info-card\n\ttitleKey=\"DASHBOARD_PAGE.DEVELOPER.TOTAL_EXPENSES\"\n\tmetaKey=\"DASHBOARD_PAGE.TITLE.TOTAL_EXPENSE_CALC\"\n\t[value]=\"value()\"\n\t[color]=\"color\"\n\t[loading]=\"loading()\"\n\t[error]=\"error()\"\n\t[hasEmployee]=\"hasEmployee()\"\n\t(openInfo)=\"openHistory(historyType)\"\n\t(retry)=\"refresh()\"\n></ga-hr-info-card>\n" }]
        }] });
//# sourceMappingURL=hr-total-expenses-widget.component.js.map