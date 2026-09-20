import { IChartData } from '../../../report/charts/line-chart/ichart.interface';
import { BaseAccountingWidgetComponent } from './base-accounting-widget.component';
import * as i0 from "@angular/core";
/**
 * Cash flow over the selected period: income, expenses, profit and bonus plotted
 * against the aggregate payload's date buckets.
 *
 * This is the Accounting page's `<ngx-line-chart>` on a canvas. The chart
 * component itself is reused untouched — it owns the Chart.js options, the theme
 * subscription and the hover behaviour — so this widget only has to supply the
 * datasets and the three states the page never had (loading, error, empty).
 *
 * It reads the very same `/employee-statistics/aggregate` response as the four
 * Accounting KPIs and the employee breakdown table, so a canvas showing all six
 * still issues ONE request per context change (see
 * `AccountingStatisticsCacheService`).
 */
export declare class CashFlowWidgetComponent extends BaseAccountingWidgetComponent {
    private readonly _themeService;
    private readonly _translateService;
    private readonly _host;
    /** Chart colours of the active theme; re-resolved on every theme switch. */
    private readonly palette;
    /** Translated series names; re-emitted on every language change. */
    private readonly seriesLabels;
    /** Date buckets of the current payload, or an empty list before the first fetch. */
    private readonly chartRows;
    /** True when the query succeeded but the range contains no bucket to plot. */
    protected readonly isEmpty: import("@angular/core").Signal<boolean>;
    /** Fully built datasets for `ngx-line-chart`. */
    protected readonly chartData: import("@angular/core").Signal<IChartData>;
    constructor();
    /** Keeps {@link palette} in sync with the active Nebular theme. */
    private observeTheme;
    /**
     * Keeps {@link seriesLabels} translated.
     *
     * `stream()` rather than `instant()`: a widget is created the moment it is
     * dropped on a canvas, which can be before the language file has resolved, and
     * `instant()` would then bake the raw translation keys into the legend for the
     * rest of the session.
     */
    private observeSeriesLabels;
    static ɵfac: i0.ɵɵFactoryDeclaration<CashFlowWidgetComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<CashFlowWidgetComponent, "ga-accounting-cash-flow-widget", never, {}, {}, never, never, true, never>;
}
