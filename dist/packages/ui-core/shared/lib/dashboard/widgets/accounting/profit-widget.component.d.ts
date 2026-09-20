import { BaseAccountingWidgetComponent } from './base-accounting-widget.component';
import * as i0 from "@angular/core";
/**
 * KPI widget: profit (income minus expenses) for the selected period.
 *
 * Mirrors the third `<ga-single-statistic>` of the Accounting dashboard page,
 * including the way its colour follows the sign. That page paints a loss in a
 * hard-coded orange; this widget reuses the theme's danger colour instead, so
 * the figure stays legible in all eight Gauzy themes (and in dark mode) rather
 * than being pinned to one hex value.
 */
export declare class ProfitWidgetComponent extends BaseAccountingWidgetComponent {
    /** Raw profit, used for the sign test. */
    protected readonly profitAmount: import("@angular/core").Signal<number>;
    /** Profit, formatted in the organization's currency. */
    protected readonly profit: import("@angular/core").Signal<string>;
    /** Warning colour while in the black, danger colour once in the red. */
    protected readonly profitColor: import("@angular/core").Signal<string>;
    static ɵfac: i0.ɵɵFactoryDeclaration<ProfitWidgetComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ProfitWidgetComponent, "ga-profit-widget", never, {}, {}, never, never, true, never>;
}
