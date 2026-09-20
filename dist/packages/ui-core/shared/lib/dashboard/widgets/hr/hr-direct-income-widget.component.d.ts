import { Signal } from '@angular/core';
import { EmployeeStatisticsHistoryEnum } from '@gauzy/contracts';
import { BaseHrInfoWidgetComponent } from './base-hr-info-widget.component';
import * as i0 from "@angular/core";
/**
 * Human Resources block: the part of the income that came from a direct bonus.
 *
 * The counterpart of {@link HrIncomeWidgetComponent}: together the two add up to
 * the Total Income block. Nested inside the accordion on the legacy page, it is
 * exposed here as its own widget so a canvas can track bonus-driven income on
 * its own.
 */
export declare class HrDirectIncomeWidgetComponent extends BaseHrInfoWidgetComponent {
    /** Colour of every income figure. */
    protected readonly color: "var(--color-success-default)";
    /** History opened when the block is clicked. */
    protected readonly historyType = EmployeeStatisticsHistoryEnum.BONUS_INCOME;
    /** Formatted direct income bonus. */
    protected readonly value: Signal<string>;
    static ɵfac: i0.ɵɵFactoryDeclaration<HrDirectIncomeWidgetComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<HrDirectIncomeWidgetComponent, "ga-hr-direct-income-widget", never, {}, {}, never, never, true, never>;
}
