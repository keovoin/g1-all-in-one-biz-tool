import { Signal } from '@angular/core';
import { BaseHrInfoWidgetComponent } from './base-hr-info-widget.component';
import * as i0 from "@angular/core";
/**
 * Human Resources block: the bonus an organization on a REVENUE-based rule owes.
 *
 * A percentage of the employee's total income rather than of their profit, so
 * unlike {@link HrProfitBonusWidgetComponent} it does not follow the cost side
 * down.
 *
 * Only meaningful for organizations whose bonus type is
 * {@link BonusTypeEnum.REVENUE_BASED_BONUS}; for anyone else the widget explains
 * itself instead of showing a number that means nothing.
 */
export declare class HrRevenueBonusWidgetComponent extends BaseHrInfoWidgetComponent {
    /** Formatted rule-derived bonus. */
    protected readonly value: Signal<string>;
    /** Success while the bonus is positive, danger once it has to be clawed back. */
    protected readonly color: Signal<string>;
    /** Percentage and income interpolated into the "x% of the income y" line. */
    protected readonly metaParams: Signal<Record<string, unknown>>;
    /** Set when the organization uses a different bonus rule (or none). */
    protected readonly unavailableKey: Signal<string | null>;
    static ɵfac: i0.ɵɵFactoryDeclaration<HrRevenueBonusWidgetComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<HrRevenueBonusWidgetComponent, "ga-hr-revenue-bonus-widget", never, {}, {}, never, never, true, never>;
}
