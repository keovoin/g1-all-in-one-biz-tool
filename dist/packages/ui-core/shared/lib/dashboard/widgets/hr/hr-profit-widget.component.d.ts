import { Signal } from '@angular/core';
import { BaseHrInfoWidgetComponent } from './base-hr-info-widget.component';
import * as i0 from "@angular/core";
/**
 * Human Resources block: income minus expenses for the selected employee.
 *
 * Rendered in the emphasized (`highlight`) variant, like the legacy page, and
 * flips from the success colour to the danger colour when it goes negative —
 * which is the one number on this dashboard nobody should have to read twice.
 *
 * Clicking it opens the profit history: incomes and expenses side by side, so
 * the figure can be traced back to the records that produced it.
 */
export declare class HrProfitWidgetComponent extends BaseHrInfoWidgetComponent {
    /** Formatted profit. */
    protected readonly value: Signal<string>;
    /** Success while the employee is in the black, danger once they are not. */
    protected readonly color: Signal<string>;
    /** Already formatted amounts interpolated into the "income − expenses" line. */
    protected readonly metaParams: Signal<Record<string, unknown>>;
    /**
     * Opens the profit history dialog — incomes and expenses side by side.
     *
     * Overrides the base's single-history behaviour because profit is derived from
     * two record sets, exactly as `HumanResourcesComponent.openProfitDialog()`
     * does. Both requests and the dialog bundle are loaded in parallel, and any
     * failure is reported rather than silently swallowing the click.
     */
    openProfitHistory(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<HrProfitWidgetComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<HrProfitWidgetComponent, "ga-hr-profit-widget", never, {}, {}, never, never, true, never>;
}
