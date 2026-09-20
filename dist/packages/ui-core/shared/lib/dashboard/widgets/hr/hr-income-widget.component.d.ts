import { Signal } from '@angular/core';
import { EmployeeStatisticsHistoryEnum } from '@gauzy/contracts';
import { BaseHrInfoWidgetComponent } from './base-hr-info-widget.component';
import * as i0 from "@angular/core";
/**
 * Human Resources block: income that did NOT come from a direct bonus.
 *
 * On the legacy page this figure only exists nested inside the Total Income
 * accordion. As a standalone widget it lets a canvas show the "real" earned
 * income without the bonus noise, which is the number most compensation
 * conversations actually start from.
 */
export declare class HrIncomeWidgetComponent extends BaseHrInfoWidgetComponent {
    /** Colour of every income figure. */
    protected readonly color: "var(--color-success-default)";
    /** History opened when the block is clicked. */
    protected readonly historyType = EmployeeStatisticsHistoryEnum.NON_BONUS_INCOME;
    /** Formatted income excluding the direct income bonus. */
    protected readonly value: Signal<string>;
    static ɵfac: i0.ɵɵFactoryDeclaration<HrIncomeWidgetComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<HrIncomeWidgetComponent, "ga-hr-income-widget", never, {}, {}, never, never, true, never>;
}
