import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { EmployeeStatisticsHistoryEnum } from '@gauzy/contracts';
import { BaseHrInfoWidgetComponent } from './base-hr-info-widget.component';
import { HrInfoCardComponent } from './hr-info-card.component';
import { HR_BLOCK_COLORS } from './hr-statistics.utils';
import * as i0 from "@angular/core";
/**
 * Human Resources block: the part of the income that came from a direct bonus.
 *
 * The counterpart of {@link HrIncomeWidgetComponent}: together the two add up to
 * the Total Income block. Nested inside the accordion on the legacy page, it is
 * exposed here as its own widget so a canvas can track bonus-driven income on
 * its own.
 */
export class HrDirectIncomeWidgetComponent extends BaseHrInfoWidgetComponent {
    constructor() {
        super(...arguments);
        /** Colour of every income figure. */
        this.color = HR_BLOCK_COLORS.INCOME;
        /** History opened when the block is clicked. */
        this.historyType = EmployeeStatisticsHistoryEnum.BONUS_INCOME;
        /** Formatted direct income bonus. */
        this.value = computed(() => this.formatAmount(this.totals().directIncomeBonus), ...(ngDevMode ? [{ debugName: "value" }] : []));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: HrDirectIncomeWidgetComponent, deps: null, target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: HrDirectIncomeWidgetComponent, isStandalone: true, selector: "ga-hr-direct-income-widget", usesInheritance: true, ngImport: i0, template: "<ga-hr-info-card\n\ttitleKey=\"DASHBOARD_PAGE.TITLE.TOTAL_DIRECT_INCOME\"\n\tmetaKey=\"DASHBOARD_PAGE.TITLE.TOTAL_DIRECT_INCOME_INFO\"\n\t[value]=\"value()\"\n\t[color]=\"color\"\n\t[loading]=\"loading()\"\n\t[error]=\"error()\"\n\t[hasEmployee]=\"hasEmployee()\"\n\t(openInfo)=\"openHistory(historyType)\"\n\t(retry)=\"refresh()\"\n></ga-hr-info-card>\n", dependencies: [{ kind: "component", type: HrInfoCardComponent, selector: "ga-hr-info-card", inputs: ["titleKey", "metaKey", "metaParams", "value", "color", "highlight", "rows", "loading", "error", "hasEmployee", "unavailableKey"], outputs: ["openInfo", "openRow", "retry"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: HrDirectIncomeWidgetComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-hr-direct-income-widget', standalone: true, imports: [HrInfoCardComponent], changeDetection: ChangeDetectionStrategy.OnPush, template: "<ga-hr-info-card\n\ttitleKey=\"DASHBOARD_PAGE.TITLE.TOTAL_DIRECT_INCOME\"\n\tmetaKey=\"DASHBOARD_PAGE.TITLE.TOTAL_DIRECT_INCOME_INFO\"\n\t[value]=\"value()\"\n\t[color]=\"color\"\n\t[loading]=\"loading()\"\n\t[error]=\"error()\"\n\t[hasEmployee]=\"hasEmployee()\"\n\t(openInfo)=\"openHistory(historyType)\"\n\t(retry)=\"refresh()\"\n></ga-hr-info-card>\n" }]
        }] });
//# sourceMappingURL=hr-direct-income-widget.component.js.map