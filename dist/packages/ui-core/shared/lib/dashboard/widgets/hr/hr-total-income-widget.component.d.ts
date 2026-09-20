import { Signal } from '@angular/core';
import { EmployeeStatisticsHistoryEnum } from '@gauzy/contracts';
import { BaseHrInfoWidgetComponent } from './base-hr-info-widget.component';
import { IHrInfoBlockRow } from './hr-info-card.component';
import * as i0 from "@angular/core";
/**
 * Human Resources block: everything the selected employee brought in.
 *
 * Mirrors the legacy page's headline block, including its accordion: once part
 * of the income came from a direct bonus, the total alone is misleading, so the
 * block splits into plain income + direct income and explains the arithmetic in
 * its meta line. With no direct bonus there is nothing to split and the block
 * collapses to a single figure — exactly as on `/pages/dashboard/hr`.
 */
export declare class HrTotalIncomeWidgetComponent extends BaseHrInfoWidgetComponent {
    /** Colour of every income figure. */
    protected readonly color: "var(--color-success-default)";
    /** History opened when the headline block is clicked. */
    protected readonly historyType = EmployeeStatisticsHistoryEnum.INCOME;
    /** Formatted total income. */
    protected readonly value: Signal<string>;
    /** Whether any of the income came from a direct bonus. */
    private readonly hasDirectIncomeBonus;
    /** Breakdown line, shown only when there is something to break down. */
    protected readonly metaKey: Signal<string | null>;
    /** Already formatted amounts interpolated into {@link metaKey}. */
    protected readonly metaParams: Signal<Record<string, unknown> | null>;
    /** Accordion rows; empty keeps the block in its plain, non-accordion form. */
    protected readonly rows: Signal<IHrInfoBlockRow[]>;
    static ɵfac: i0.ɵɵFactoryDeclaration<HrTotalIncomeWidgetComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<HrTotalIncomeWidgetComponent, "ga-hr-total-income-widget", never, {}, {}, never, never, true, never>;
}
