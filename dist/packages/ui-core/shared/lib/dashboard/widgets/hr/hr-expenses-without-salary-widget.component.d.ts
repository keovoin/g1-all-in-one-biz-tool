import { Signal } from '@angular/core';
import { EmployeeStatisticsHistoryEnum } from '@gauzy/contracts';
import { BaseHrInfoWidgetComponent } from './base-hr-info-widget.component';
import * as i0 from "@angular/core";
/**
 * Human Resources block: everything the selected employee cost, salary aside.
 *
 * Employee expenses + split expenses + recurring expenses. Reading it next to
 * {@link HrTotalExpensesWidgetComponent} gives the salary as the difference,
 * which is the comparison the legacy page's header makes.
 */
export declare class HrExpensesWithoutSalaryWidgetComponent extends BaseHrInfoWidgetComponent {
    /** Colour of every expense figure. */
    protected readonly color: "var(--color-warning-default)";
    /** History opened when the block is clicked. */
    protected readonly historyType = EmployeeStatisticsHistoryEnum.EXPENSES_WITHOUT_SALARY;
    /** Formatted expenses excluding salary. */
    protected readonly value: Signal<string>;
    static ɵfac: i0.ɵɵFactoryDeclaration<HrExpensesWithoutSalaryWidgetComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<HrExpensesWithoutSalaryWidgetComponent, "ga-hr-expenses-without-salary-widget", never, {}, {}, never, never, true, never>;
}
