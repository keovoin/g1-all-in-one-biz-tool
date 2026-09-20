import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { AccountingStatisticCardComponent } from './accounting-statistic-card.component';
import { BaseAccountingWidgetComponent } from './base-accounting-widget.component';
import * as i0 from "@angular/core";
/**
 * KPI widget: total income booked across the organization in the selected period.
 *
 * Mirrors the first `<ga-single-statistic>` of the Accounting dashboard page,
 * down to its info colour.
 */
export class TotalIncomeWidgetComponent extends BaseAccountingWidgetComponent {
    constructor() {
        super(...arguments);
        /** Total income, formatted in the organization's currency. */
        this.income = computed(() => this.formatCurrency(this.total()?.income ?? 0), ...(ngDevMode ? [{ debugName: "income" }] : []));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TotalIncomeWidgetComponent, deps: null, target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: TotalIncomeWidgetComponent, isStandalone: true, selector: "ga-total-income-widget", usesInheritance: true, ngImport: i0, template: "<ga-accounting-statistic-card\n\tcolor=\"var(--color-info-default)\"\n\t[value]=\"income()\"\n\t[loading]=\"loading()\"\n\t[error]=\"error()\"\n\t(retry)=\"refresh()\"\n></ga-accounting-statistic-card>\n", dependencies: [{ kind: "component", type: AccountingStatisticCardComponent, selector: "ga-accounting-statistic-card", inputs: ["value", "color", "type", "loading", "error", "unavailableKey"], outputs: ["retry"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TotalIncomeWidgetComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-total-income-widget', standalone: true, imports: [AccountingStatisticCardComponent], changeDetection: ChangeDetectionStrategy.OnPush, template: "<ga-accounting-statistic-card\n\tcolor=\"var(--color-info-default)\"\n\t[value]=\"income()\"\n\t[loading]=\"loading()\"\n\t[error]=\"error()\"\n\t(retry)=\"refresh()\"\n></ga-accounting-statistic-card>\n" }]
        }] });
//# sourceMappingURL=total-income-widget.component.js.map