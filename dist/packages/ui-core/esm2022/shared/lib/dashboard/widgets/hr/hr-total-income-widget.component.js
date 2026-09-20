import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { EmployeeStatisticsHistoryEnum } from '@gauzy/contracts';
import { BaseHrInfoWidgetComponent } from './base-hr-info-widget.component';
import { HrInfoCardComponent } from './hr-info-card.component';
import { HR_BLOCK_COLORS } from './hr-statistics.utils';
import * as i0 from "@angular/core";
/**
 * Human Resources block: everything the selected employee brought in.
 *
 * Mirrors the legacy page's headline block, including its accordion: once part
 * of the income came from a direct bonus, the total alone is misleading, so the
 * block splits into plain income + direct income and explains the arithmetic in
 * its meta line. With no direct bonus there is nothing to split and the block
 * collapses to a single figure — exactly as on `/pages/dashboard/hr`.
 */
export class HrTotalIncomeWidgetComponent extends BaseHrInfoWidgetComponent {
    constructor() {
        super(...arguments);
        /** Colour of every income figure. */
        this.color = HR_BLOCK_COLORS.INCOME;
        /** History opened when the headline block is clicked. */
        this.historyType = EmployeeStatisticsHistoryEnum.INCOME;
        /** Formatted total income. */
        this.value = computed(() => this.formatAmount(this.totals().income), ...(ngDevMode ? [{ debugName: "value" }] : []));
        /** Whether any of the income came from a direct bonus. */
        this.hasDirectIncomeBonus = computed(() => this.totals().directIncomeBonus !== 0, ...(ngDevMode ? [{ debugName: "hasDirectIncomeBonus" }] : []));
        /** Breakdown line, shown only when there is something to break down. */
        this.metaKey = computed(() => this.hasDirectIncomeBonus() ? 'DASHBOARD_PAGE.TITLE.TOTAL_INCOME_CALC' : null, ...(ngDevMode ? [{ debugName: "metaKey" }] : []));
        /** Already formatted amounts interpolated into {@link metaKey}. */
        this.metaParams = computed(() => {
            if (!this.hasDirectIncomeBonus()) {
                return null;
            }
            const totals = this.totals();
            return {
                totalNonBonusIncome: this.formatAmount(totals.nonBonusIncome),
                totalBonusIncome: this.formatAmount(totals.directIncomeBonus)
            };
        }, ...(ngDevMode ? [{ debugName: "metaParams" }] : []));
        /** Accordion rows; empty keeps the block in its plain, non-accordion form. */
        this.rows = computed(() => {
            if (!this.hasDirectIncomeBonus()) {
                return [];
            }
            const totals = this.totals();
            return [
                {
                    id: 'income',
                    titleKey: 'INCOME_PAGE.INCOME',
                    value: this.formatAmount(totals.nonBonusIncome),
                    color: this.color,
                    historyType: EmployeeStatisticsHistoryEnum.NON_BONUS_INCOME
                },
                {
                    id: 'direct-income',
                    titleKey: 'DASHBOARD_PAGE.TITLE.TOTAL_DIRECT_INCOME',
                    metaKey: 'DASHBOARD_PAGE.TITLE.TOTAL_DIRECT_INCOME_INFO',
                    value: this.formatAmount(totals.directIncomeBonus),
                    color: this.color,
                    historyType: EmployeeStatisticsHistoryEnum.BONUS_INCOME
                }
            ];
        }, ...(ngDevMode ? [{ debugName: "rows" }] : []));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: HrTotalIncomeWidgetComponent, deps: null, target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: HrTotalIncomeWidgetComponent, isStandalone: true, selector: "ga-hr-total-income-widget", usesInheritance: true, ngImport: i0, template: "<ga-hr-info-card\n\ttitleKey=\"DASHBOARD_PAGE.DEVELOPER.TOTAL_INCOME\"\n\t[metaKey]=\"metaKey()\"\n\t[metaParams]=\"metaParams()\"\n\t[value]=\"value()\"\n\t[color]=\"color\"\n\t[rows]=\"rows()\"\n\t[loading]=\"loading()\"\n\t[error]=\"error()\"\n\t[hasEmployee]=\"hasEmployee()\"\n\t(openInfo)=\"openHistory(historyType)\"\n\t(openRow)=\"openHistory($event.historyType)\"\n\t(retry)=\"refresh()\"\n></ga-hr-info-card>\n", dependencies: [{ kind: "component", type: HrInfoCardComponent, selector: "ga-hr-info-card", inputs: ["titleKey", "metaKey", "metaParams", "value", "color", "highlight", "rows", "loading", "error", "hasEmployee", "unavailableKey"], outputs: ["openInfo", "openRow", "retry"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: HrTotalIncomeWidgetComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-hr-total-income-widget', standalone: true, imports: [HrInfoCardComponent], changeDetection: ChangeDetectionStrategy.OnPush, template: "<ga-hr-info-card\n\ttitleKey=\"DASHBOARD_PAGE.DEVELOPER.TOTAL_INCOME\"\n\t[metaKey]=\"metaKey()\"\n\t[metaParams]=\"metaParams()\"\n\t[value]=\"value()\"\n\t[color]=\"color\"\n\t[rows]=\"rows()\"\n\t[loading]=\"loading()\"\n\t[error]=\"error()\"\n\t[hasEmployee]=\"hasEmployee()\"\n\t(openInfo)=\"openHistory(historyType)\"\n\t(openRow)=\"openHistory($event.historyType)\"\n\t(retry)=\"refresh()\"\n></ga-hr-info-card>\n" }]
        }] });
//# sourceMappingURL=hr-total-income-widget.component.js.map