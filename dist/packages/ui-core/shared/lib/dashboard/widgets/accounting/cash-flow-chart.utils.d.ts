import { IChartEmployeeStatistic } from '@gauzy/contracts';
import { IChartData } from '../../../report/charts/line-chart/ichart.interface';
import { IEmployeeChartPalette } from '../charts/employee-chart.utils';
/** Translated names of the four cash-flow series, in dataset order. */
export interface ICashFlowSeriesLabels {
    income: string;
    expense: string;
    profit: string;
    bonus: string;
}
/**
 * Translation keys of the four series.
 *
 * Verbatim from `AccountingComponent.generateCharts()` — including the fact that
 * the expenses label comes from the Profit History block rather than the CHARTS
 * block. Picking "tidier" keys here would silently change the legend of a chart
 * users already know.
 */
export declare const CASH_FLOW_SERIES_KEYS: Readonly<Record<keyof ICashFlowSeriesLabels, string>>;
/** Untranslated fallback, used only before the language file has resolved. */
export declare const DEFAULT_CASH_FLOW_LABELS: ICashFlowSeriesLabels;
/**
 * Builds the `ngx-line-chart` datasets for the cash-flow chart.
 *
 * Same four series as the Accounting page (income, expenses, profit, bonus) over
 * the same `IAggregatedEmployeeStatistic.chart` rows, with two deliberate
 * differences:
 *
 * 1. Colours come from the active theme instead of `ChartUtil.CHART_COLORS`'
 *    fixed literals, so the lines stay legible in all eight themes.
 * 2. Cells are coerced with `Number(...) || 0`; the page's bare `pluck` lets a
 *    single `null` reach Chart.js, which then draws a gap in the line with
 *    nothing to explain it.
 *
 * @param rows - The chart rows of the aggregate statistics payload.
 * @param palette - Colours of the active theme.
 * @param labels - Translated series names.
 * @returns The data object `ngx-line-chart` renders.
 */
export declare function buildCashFlowChartData(rows: IChartEmployeeStatistic[] | null | undefined, palette: IEmployeeChartPalette, labels: ICashFlowSeriesLabels): IChartData;
