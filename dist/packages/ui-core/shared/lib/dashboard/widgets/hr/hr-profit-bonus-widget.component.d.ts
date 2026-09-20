import { Signal } from '@angular/core';
import { BaseHrInfoWidgetComponent } from './base-hr-info-widget.component';
import * as i0 from "@angular/core";
/**
 * Human Resources block: the bonus an organization on a PROFIT-based rule owes.
 *
 * A percentage of the employee's profit, so it turns negative whenever the
 * profit does — the legacy page's note about deducting negative bonuses from
 * later positive ones applies here too, which is why the figure flips to the
 * danger colour rather than quietly showing a minus sign.
 *
 * Only meaningful for organizations whose bonus type is
 * {@link BonusTypeEnum.PROFIT_BASED_BONUS}; for anyone else the widget explains
 * itself instead of showing a number that means nothing.
 */
export declare class HrProfitBonusWidgetComponent extends BaseHrInfoWidgetComponent {
    /** Formatted rule-derived bonus. */
    protected readonly value: Signal<string>;
    /** Success while the bonus is positive, danger once it has to be clawed back. */
    protected readonly color: Signal<string>;
    /** Percentage and profit interpolated into the "x% of the profit y" line. */
    protected readonly metaParams: Signal<Record<string, unknown>>;
    /** Set when the organization uses a different bonus rule (or none). */
    protected readonly unavailableKey: Signal<string | null>;
    static ɵfac: i0.ɵɵFactoryDeclaration<HrProfitBonusWidgetComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<HrProfitBonusWidgetComponent, "ga-hr-profit-bonus-widget", never, {}, {}, never, never, true, never>;
}
