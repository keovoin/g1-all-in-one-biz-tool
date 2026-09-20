import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { EmployeeStatisticsHistoryEnum } from '@gauzy/contracts';
import { BaseHrInfoWidgetComponent } from './base-hr-info-widget.component';
import { HrInfoCardComponent } from './hr-info-card.component';
import { HR_BLOCK_COLORS } from './hr-statistics.utils';
import * as i0 from "@angular/core";
/**
 * Human Resources block: bonus that is simply the employee's direct income.
 *
 * The legacy page hides this block entirely when the organization pays no
 * bonuses. A widget cannot silently disappear from a canvas the user built, so
 * it says so instead — an explanation the user can act on beats an empty card.
 */
export class HrTotalDirectBonusWidgetComponent extends BaseHrInfoWidgetComponent {
    constructor() {
        super(...arguments);
        /** Colour of every bonus figure. */
        this.color = HR_BLOCK_COLORS.BONUS;
        /** History opened when the block is clicked. */
        this.historyType = EmployeeStatisticsHistoryEnum.BONUS_INCOME;
        /** Formatted direct income bonus. */
        this.value = computed(() => this.formatAmount(this.totals().directIncomeBonus), ...(ngDevMode ? [{ debugName: "value" }] : []));
        /** Set when the organization pays no bonuses at all. */
        this.unavailableKey = computed(() => this.bonusType() ? null : 'DASHBOARD_PAGE.BUILDER.WIDGETS.HR.NO_BONUS_TYPE', ...(ngDevMode ? [{ debugName: "unavailableKey" }] : []));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: HrTotalDirectBonusWidgetComponent, deps: null, target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: HrTotalDirectBonusWidgetComponent, isStandalone: true, selector: "ga-hr-total-direct-bonus-widget", usesInheritance: true, ngImport: i0, template: "<ga-hr-info-card\n\ttitleKey=\"DASHBOARD_PAGE.TITLE.TOTAL_DIRECT_BONUS\"\n\tmetaKey=\"DASHBOARD_PAGE.TITLE.TOTAL_DIRECT_BONUS_INFO\"\n\t[value]=\"value()\"\n\t[color]=\"color\"\n\t[loading]=\"loading()\"\n\t[error]=\"error()\"\n\t[hasEmployee]=\"hasEmployee()\"\n\t[unavailableKey]=\"unavailableKey()\"\n\t(openInfo)=\"openHistory(historyType)\"\n\t(retry)=\"refresh()\"\n></ga-hr-info-card>\n", dependencies: [{ kind: "component", type: HrInfoCardComponent, selector: "ga-hr-info-card", inputs: ["titleKey", "metaKey", "metaParams", "value", "color", "highlight", "rows", "loading", "error", "hasEmployee", "unavailableKey"], outputs: ["openInfo", "openRow", "retry"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: HrTotalDirectBonusWidgetComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-hr-total-direct-bonus-widget', standalone: true, imports: [HrInfoCardComponent], changeDetection: ChangeDetectionStrategy.OnPush, template: "<ga-hr-info-card\n\ttitleKey=\"DASHBOARD_PAGE.TITLE.TOTAL_DIRECT_BONUS\"\n\tmetaKey=\"DASHBOARD_PAGE.TITLE.TOTAL_DIRECT_BONUS_INFO\"\n\t[value]=\"value()\"\n\t[color]=\"color\"\n\t[loading]=\"loading()\"\n\t[error]=\"error()\"\n\t[hasEmployee]=\"hasEmployee()\"\n\t[unavailableKey]=\"unavailableKey()\"\n\t(openInfo)=\"openHistory(historyType)\"\n\t(retry)=\"refresh()\"\n></ga-hr-info-card>\n" }]
        }] });
//# sourceMappingURL=hr-total-direct-bonus-widget.component.js.map