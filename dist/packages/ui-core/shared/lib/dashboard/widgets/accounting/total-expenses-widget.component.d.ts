import { BaseAccountingWidgetComponent } from './base-accounting-widget.component';
import * as i0 from "@angular/core";
/**
 * KPI widget: total expenses booked across the organization in the selected period.
 *
 * Mirrors the second `<ga-single-statistic>` of the Accounting dashboard page,
 * down to its danger colour.
 */
export declare class TotalExpensesWidgetComponent extends BaseAccountingWidgetComponent {
    /** Total expenses, formatted in the organization's currency. */
    protected readonly expenses: import("@angular/core").Signal<string>;
    static ɵfac: i0.ɵɵFactoryDeclaration<TotalExpensesWidgetComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<TotalExpensesWidgetComponent, "ga-total-expenses-widget", never, {}, {}, never, never, true, never>;
}
