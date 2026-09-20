import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { AccountingStatisticCardComponent } from './accounting-statistic-card.component';
import { BaseAccountingWidgetComponent } from './base-accounting-widget.component';
import * as i0 from "@angular/core";
/**
 * KPI widget: total expenses booked across the organization in the selected period.
 *
 * Mirrors the second `<ga-single-statistic>` of the Accounting dashboard page,
 * down to its danger colour.
 */
export class TotalExpensesWidgetComponent extends BaseAccountingWidgetComponent {
    constructor() {
        super(...arguments);
        /** Total expenses, formatted in the organization's currency. */
        this.expenses = computed(() => this.formatCurrency(this.total()?.expense ?? 0), ...(ngDevMode ? [{ debugName: "expenses" }] : []));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TotalExpensesWidgetComponent, deps: null, target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: TotalExpensesWidgetComponent, isStandalone: true, selector: "ga-total-expenses-widget", usesInheritance: true, ngImport: i0, template: "<ga-accounting-statistic-card\n\tcolor=\"var(--color-danger-default)\"\n\t[value]=\"expenses()\"\n\t[loading]=\"loading()\"\n\t[error]=\"error()\"\n\t(retry)=\"refresh()\"\n></ga-accounting-statistic-card>\n", dependencies: [{ kind: "component", type: AccountingStatisticCardComponent, selector: "ga-accounting-statistic-card", inputs: ["value", "color", "type", "loading", "error", "unavailableKey"], outputs: ["retry"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TotalExpensesWidgetComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-total-expenses-widget', standalone: true, imports: [AccountingStatisticCardComponent], changeDetection: ChangeDetectionStrategy.OnPush, template: "<ga-accounting-statistic-card\n\tcolor=\"var(--color-danger-default)\"\n\t[value]=\"expenses()\"\n\t[loading]=\"loading()\"\n\t[error]=\"error()\"\n\t(retry)=\"refresh()\"\n></ga-accounting-statistic-card>\n" }]
        }] });
//# sourceMappingURL=total-expenses-widget.component.js.map