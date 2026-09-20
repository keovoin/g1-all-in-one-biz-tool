import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { BonusTypeEnum } from '@gauzy/contracts';
import { BaseHrInfoWidgetComponent } from './base-hr-info-widget.component';
import { HrInfoCardComponent } from './hr-info-card.component';
import { HR_BLOCK_COLORS } from './hr-statistics.utils';
import * as i0 from "@angular/core";
/**
 * Human Resources block: the bonus an organization on a PROFIT-based rule owes.
 *
 * A percentage of the employee's profit, so it turns negative whenever the
 * profit does — the legacy page's note about deducting negative bonuses from
 * later positive ones applies here too, which is why the figure flips to the
 * danger colour rather than quietly showing a minus sign.
 *
 * Only meaningful for organizations whose bonus type is
 * {@link BonusTypeEnum.PROFIT_BASED_BONUS}; for anyone else the widget explains
 * itself instead of showing a number that means nothing.
 */
export class HrProfitBonusWidgetComponent extends BaseHrInfoWidgetComponent {
    constructor() {
        super(...arguments);
        /** Formatted rule-derived bonus. */
        this.value = computed(() => this.formatAmount(this.totals().calculatedBonus), ...(ngDevMode ? [{ debugName: "value" }] : []));
        /** Success while the bonus is positive, danger once it has to be clawed back. */
        this.color = computed(() => this.signedColor(this.totals().calculatedBonus, HR_BLOCK_COLORS.BONUS, HR_BLOCK_COLORS.NEGATIVE), ...(ngDevMode ? [{ debugName: "color" }] : []));
        /** Percentage and profit interpolated into the "x% of the profit y" line. */
        this.metaParams = computed(() => ({
            bonusPercentage: this.bonusPercentage(),
            difference: this.formatAmount(this.totals().profit)
        }), ...(ngDevMode ? [{ debugName: "metaParams" }] : []));
        /** Set when the organization uses a different bonus rule (or none). */
        this.unavailableKey = computed(() => {
            const bonusType = this.bonusType();
            if (bonusType === BonusTypeEnum.PROFIT_BASED_BONUS) {
                return null;
            }
            return bonusType
                ? 'DASHBOARD_PAGE.BUILDER.WIDGETS.HR.NOT_PROFIT_BASED'
                : 'DASHBOARD_PAGE.BUILDER.WIDGETS.HR.NO_BONUS_TYPE';
        }, ...(ngDevMode ? [{ debugName: "unavailableKey" }] : []));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: HrProfitBonusWidgetComponent, deps: null, target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: HrProfitBonusWidgetComponent, isStandalone: true, selector: "ga-hr-profit-bonus-widget", usesInheritance: true, ngImport: i0, template: "<ga-hr-info-card\n\ttitleKey=\"DASHBOARD_PAGE.TITLE.TOTAL_PROFIT_BONUS\"\n\tmetaKey=\"DASHBOARD_PAGE.TITLE.TOTAL_PROFIT_BONUS_INFO\"\n\t[metaParams]=\"metaParams()\"\n\t[value]=\"value()\"\n\t[color]=\"color()\"\n\t[loading]=\"loading()\"\n\t[error]=\"error()\"\n\t[hasEmployee]=\"hasEmployee()\"\n\t[unavailableKey]=\"unavailableKey()\"\n\t(retry)=\"refresh()\"\n></ga-hr-info-card>\n", dependencies: [{ kind: "component", type: HrInfoCardComponent, selector: "ga-hr-info-card", inputs: ["titleKey", "metaKey", "metaParams", "value", "color", "highlight", "rows", "loading", "error", "hasEmployee", "unavailableKey"], outputs: ["openInfo", "openRow", "retry"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: HrProfitBonusWidgetComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-hr-profit-bonus-widget', standalone: true, imports: [HrInfoCardComponent], changeDetection: ChangeDetectionStrategy.OnPush, template: "<ga-hr-info-card\n\ttitleKey=\"DASHBOARD_PAGE.TITLE.TOTAL_PROFIT_BONUS\"\n\tmetaKey=\"DASHBOARD_PAGE.TITLE.TOTAL_PROFIT_BONUS_INFO\"\n\t[metaParams]=\"metaParams()\"\n\t[value]=\"value()\"\n\t[color]=\"color()\"\n\t[loading]=\"loading()\"\n\t[error]=\"error()\"\n\t[hasEmployee]=\"hasEmployee()\"\n\t[unavailableKey]=\"unavailableKey()\"\n\t(retry)=\"refresh()\"\n></ga-hr-info-card>\n" }]
        }] });
//# sourceMappingURL=hr-profit-bonus-widget.component.js.map