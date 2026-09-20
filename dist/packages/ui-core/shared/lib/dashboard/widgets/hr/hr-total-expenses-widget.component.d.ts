import { Signal } from '@angular/core';
import { EmployeeStatisticsHistoryEnum } from '@gauzy/contracts';
import { BaseHrInfoWidgetComponent } from './base-hr-info-widget.component';
import * as i0 from "@angular/core";
/**
 * Human Resources block: the full cost of the selected employee.
 *
 * Employee expenses + split expenses + recurring expenses + salary — the
 * denominator of the Profit block.
 */
export declare class HrTotalExpensesWidgetComponent extends BaseHrInfoWidgetComponent {
    /** Colour of every expense figure. */
    protected readonly color: "var(--color-warning-default)";
    /** History opened when the block is clicked. */
    protected readonly historyType = EmployeeStatisticsHistoryEnum.EXPENSES;
    /** Formatted total expenses. */
    protected readonly value: Signal<string>;
    static ɵfac: i0.ɵɵFactoryDeclaration<HrTotalExpensesWidgetComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<HrTotalExpensesWidgetComponent, "ga-hr-total-expenses-widget", never, {}, {}, never, never, true, never>;
}
