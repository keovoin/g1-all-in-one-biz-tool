import { BaseAccountingWidgetComponent } from './base-accounting-widget.component';
import * as i0 from "@angular/core";
/**
 * KPI widget: total bonus paid across the organization in the selected period.
 *
 * Mirrors the fourth `<ga-single-statistic>` of the Accounting dashboard page,
 * which renders it in the `highlight` variant (the statistic component paints
 * that in the theme's success colour and ignores the `color` input entirely).
 *
 * The page hides this KPI outright when the organization declares no
 * `bonusType`. A canvas widget cannot silently vanish — the user placed it
 * deliberately — so it explains itself instead of showing a permanent zero.
 */
export declare class TotalBonusWidgetComponent extends BaseAccountingWidgetComponent {
    /** Total bonus, formatted in the organization's currency. */
    protected readonly bonus: import("@angular/core").Signal<string>;
    /** Translation key of the "no bonus scheme" hint, or `null` when the figure applies. */
    protected readonly unavailableKey: import("@angular/core").Signal<string>;
    static ɵfac: i0.ɵɵFactoryDeclaration<TotalBonusWidgetComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<TotalBonusWidgetComponent, "ga-total-bonus-widget", never, {}, {}, never, never, true, never>;
}
