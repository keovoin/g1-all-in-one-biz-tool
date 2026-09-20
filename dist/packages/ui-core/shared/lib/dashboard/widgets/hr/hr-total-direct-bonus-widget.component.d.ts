import { Signal } from '@angular/core';
import { EmployeeStatisticsHistoryEnum } from '@gauzy/contracts';
import { BaseHrInfoWidgetComponent } from './base-hr-info-widget.component';
import * as i0 from "@angular/core";
/**
 * Human Resources block: bonus that is simply the employee's direct income.
 *
 * The legacy page hides this block entirely when the organization pays no
 * bonuses. A widget cannot silently disappear from a canvas the user built, so
 * it says so instead — an explanation the user can act on beats an empty card.
 */
export declare class HrTotalDirectBonusWidgetComponent extends BaseHrInfoWidgetComponent {
    /** Colour of every bonus figure. */
    protected readonly color: "var(--color-success-default)";
    /** History opened when the block is clicked. */
    protected readonly historyType = EmployeeStatisticsHistoryEnum.BONUS_INCOME;
    /** Formatted direct income bonus. */
    protected readonly value: Signal<string>;
    /** Set when the organization pays no bonuses at all. */
    protected readonly unavailableKey: Signal<string | null>;
    static ɵfac: i0.ɵɵFactoryDeclaration<HrTotalDirectBonusWidgetComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<HrTotalDirectBonusWidgetComponent, "ga-hr-total-direct-bonus-widget", never, {}, {}, never, never, true, never>;
}
