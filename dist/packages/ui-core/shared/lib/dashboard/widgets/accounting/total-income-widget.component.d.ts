import { BaseAccountingWidgetComponent } from './base-accounting-widget.component';
import * as i0 from "@angular/core";
/**
 * KPI widget: total income booked across the organization in the selected period.
 *
 * Mirrors the first `<ga-single-statistic>` of the Accounting dashboard page,
 * down to its info colour.
 */
export declare class TotalIncomeWidgetComponent extends BaseAccountingWidgetComponent {
    /** Total income, formatted in the organization's currency. */
    protected readonly income: import("@angular/core").Signal<string>;
    static ɵfac: i0.ɵɵFactoryDeclaration<TotalIncomeWidgetComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<TotalIncomeWidgetComponent, "ga-total-income-widget", never, {}, {}, never, never, true, never>;
}
