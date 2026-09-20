import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { AccountingStatisticCardComponent } from './accounting-statistic-card.component';
import { BaseAccountingWidgetComponent } from './base-accounting-widget.component';
import * as i0 from "@angular/core";
/** Hint shown when the organization runs no bonus scheme at all. */
const BONUS_NOT_CONFIGURED = 'DASHBOARD_PAGE.BUILDER.WIDGETS.ACCOUNTING_TOTAL_BONUS.NOT_CONFIGURED';
/**
 * KPI widget: total bonus paid across the organization in the selected period.
 *
 * Mirrors the fourth `<ga-single-statistic>` of the Accounting dashboard page,
 * which renders it in the `highlight` variant (the statistic component paints
 * that in the theme's success colour and ignores the `color` input entirely).
 *
 * The page hides this KPI outright when the organization declares no
 * `bonusType`. A canvas widget cannot silently vanish — the user placed it
 * deliberately — so it explains itself instead of showing a permanent zero.
 */
export class TotalBonusWidgetComponent extends BaseAccountingWidgetComponent {
    constructor() {
        super(...arguments);
        /** Total bonus, formatted in the organization's currency. */
        this.bonus = computed(() => this.formatCurrency(this.total()?.bonus ?? 0), ...(ngDevMode ? [{ debugName: "bonus" }] : []));
        /** Translation key of the "no bonus scheme" hint, or `null` when the figure applies. */
        this.unavailableKey = computed(() => this.hasBonusType() ? null : BONUS_NOT_CONFIGURED, ...(ngDevMode ? [{ debugName: "unavailableKey" }] : []));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TotalBonusWidgetComponent, deps: null, target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: TotalBonusWidgetComponent, isStandalone: true, selector: "ga-total-bonus-widget", usesInheritance: true, ngImport: i0, template: "<ga-accounting-statistic-card\n\ttype=\"highlight\"\n\t[value]=\"bonus()\"\n\t[loading]=\"loading()\"\n\t[error]=\"error()\"\n\t[unavailableKey]=\"unavailableKey()\"\n\t(retry)=\"refresh()\"\n></ga-accounting-statistic-card>\n", dependencies: [{ kind: "component", type: AccountingStatisticCardComponent, selector: "ga-accounting-statistic-card", inputs: ["value", "color", "type", "loading", "error", "unavailableKey"], outputs: ["retry"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TotalBonusWidgetComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-total-bonus-widget', standalone: true, imports: [AccountingStatisticCardComponent], changeDetection: ChangeDetectionStrategy.OnPush, template: "<ga-accounting-statistic-card\n\ttype=\"highlight\"\n\t[value]=\"bonus()\"\n\t[loading]=\"loading()\"\n\t[error]=\"error()\"\n\t[unavailableKey]=\"unavailableKey()\"\n\t(retry)=\"refresh()\"\n></ga-accounting-statistic-card>\n" }]
        }] });
//# sourceMappingURL=total-bonus-widget.component.js.map