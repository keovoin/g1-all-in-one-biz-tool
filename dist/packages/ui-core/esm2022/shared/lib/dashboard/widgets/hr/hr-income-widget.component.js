import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { EmployeeStatisticsHistoryEnum } from '@gauzy/contracts';
import { BaseHrInfoWidgetComponent } from './base-hr-info-widget.component';
import { HrInfoCardComponent } from './hr-info-card.component';
import { HR_BLOCK_COLORS } from './hr-statistics.utils';
import * as i0 from "@angular/core";
/**
 * Human Resources block: income that did NOT come from a direct bonus.
 *
 * On the legacy page this figure only exists nested inside the Total Income
 * accordion. As a standalone widget it lets a canvas show the "real" earned
 * income without the bonus noise, which is the number most compensation
 * conversations actually start from.
 */
export class HrIncomeWidgetComponent extends BaseHrInfoWidgetComponent {
    constructor() {
        super(...arguments);
        /** Colour of every income figure. */
        this.color = HR_BLOCK_COLORS.INCOME;
        /** History opened when the block is clicked. */
        this.historyType = EmployeeStatisticsHistoryEnum.NON_BONUS_INCOME;
        /** Formatted income excluding the direct income bonus. */
        this.value = computed(() => this.formatAmount(this.totals().nonBonusIncome), ...(ngDevMode ? [{ debugName: "value" }] : []));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: HrIncomeWidgetComponent, deps: null, target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: HrIncomeWidgetComponent, isStandalone: true, selector: "ga-hr-income-widget", usesInheritance: true, ngImport: i0, template: "<ga-hr-info-card\n\ttitleKey=\"INCOME_PAGE.INCOME\"\n\tmetaKey=\"DASHBOARD_PAGE.BUILDER.WIDGETS.HR.INCOME.META\"\n\t[value]=\"value()\"\n\t[color]=\"color\"\n\t[loading]=\"loading()\"\n\t[error]=\"error()\"\n\t[hasEmployee]=\"hasEmployee()\"\n\t(openInfo)=\"openHistory(historyType)\"\n\t(retry)=\"refresh()\"\n></ga-hr-info-card>\n", dependencies: [{ kind: "component", type: HrInfoCardComponent, selector: "ga-hr-info-card", inputs: ["titleKey", "metaKey", "metaParams", "value", "color", "highlight", "rows", "loading", "error", "hasEmployee", "unavailableKey"], outputs: ["openInfo", "openRow", "retry"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: HrIncomeWidgetComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-hr-income-widget', standalone: true, imports: [HrInfoCardComponent], changeDetection: ChangeDetectionStrategy.OnPush, template: "<ga-hr-info-card\n\ttitleKey=\"INCOME_PAGE.INCOME\"\n\tmetaKey=\"DASHBOARD_PAGE.BUILDER.WIDGETS.HR.INCOME.META\"\n\t[value]=\"value()\"\n\t[color]=\"color\"\n\t[loading]=\"loading()\"\n\t[error]=\"error()\"\n\t[hasEmployee]=\"hasEmployee()\"\n\t(openInfo)=\"openHistory(historyType)\"\n\t(retry)=\"refresh()\"\n></ga-hr-info-card>\n" }]
        }] });
//# sourceMappingURL=hr-income-widget.component.js.map