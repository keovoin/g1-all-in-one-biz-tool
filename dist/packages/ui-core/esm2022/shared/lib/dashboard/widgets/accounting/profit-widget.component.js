import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { AccountingStatisticCardComponent } from './accounting-statistic-card.component';
import { BaseAccountingWidgetComponent } from './base-accounting-widget.component';
import * as i0 from "@angular/core";
/**
 * KPI widget: profit (income minus expenses) for the selected period.
 *
 * Mirrors the third `<ga-single-statistic>` of the Accounting dashboard page,
 * including the way its colour follows the sign. That page paints a loss in a
 * hard-coded orange; this widget reuses the theme's danger colour instead, so
 * the figure stays legible in all eight Gauzy themes (and in dark mode) rather
 * than being pinned to one hex value.
 */
export class ProfitWidgetComponent extends BaseAccountingWidgetComponent {
    constructor() {
        super(...arguments);
        /** Raw profit, used for the sign test. */
        this.profitAmount = computed(() => this.total()?.profit ?? 0, ...(ngDevMode ? [{ debugName: "profitAmount" }] : []));
        /** Profit, formatted in the organization's currency. */
        this.profit = computed(() => this.formatCurrency(this.profitAmount()), ...(ngDevMode ? [{ debugName: "profit" }] : []));
        /** Warning colour while in the black, danger colour once in the red. */
        this.profitColor = computed(() => this.profitAmount() >= 0 ? 'var(--color-warning-default)' : 'var(--color-danger-default)', ...(ngDevMode ? [{ debugName: "profitColor" }] : []));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ProfitWidgetComponent, deps: null, target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: ProfitWidgetComponent, isStandalone: true, selector: "ga-profit-widget", usesInheritance: true, ngImport: i0, template: "<ga-accounting-statistic-card\n\t[color]=\"profitColor()\"\n\t[value]=\"profit()\"\n\t[loading]=\"loading()\"\n\t[error]=\"error()\"\n\t(retry)=\"refresh()\"\n></ga-accounting-statistic-card>\n", dependencies: [{ kind: "component", type: AccountingStatisticCardComponent, selector: "ga-accounting-statistic-card", inputs: ["value", "color", "type", "loading", "error", "unavailableKey"], outputs: ["retry"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ProfitWidgetComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-profit-widget', standalone: true, imports: [AccountingStatisticCardComponent], changeDetection: ChangeDetectionStrategy.OnPush, template: "<ga-accounting-statistic-card\n\t[color]=\"profitColor()\"\n\t[value]=\"profit()\"\n\t[loading]=\"loading()\"\n\t[error]=\"error()\"\n\t(retry)=\"refresh()\"\n></ga-accounting-statistic-card>\n" }]
        }] });
//# sourceMappingURL=profit-widget.component.js.map