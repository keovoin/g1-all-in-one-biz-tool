import { CurrencyPipe } from '@angular/common';
import { ChartConfiguration, ChartType } from 'chart.js';
import { IMonthAggregatedEmployeeStatistics, IOrganization } from '@gauzy/contracts';
import { CurrencyPositionPipe } from '../../../pipes/currency-position.pipe';
import { EmployeeChartKind } from './employee-chart.constants';
export * from './employee-chart.constants';
/**
 * Colours a chart needs, resolved from the ACTIVE theme rather than hardcoded.
 *
 * The legacy charts baked six literal hex values into the component, so they
 * rendered identically (and, on the dark themes, badly) whatever theme the user
 * had picked. Everything here comes from the Nebular JS theme instead, which is
 * the canvas equivalent of `nb-theme()` — a `<canvas>` cannot resolve a CSS
 * custom property, so the value has to be looked up in TypeScript.
 */
export interface IEmployeeChartPalette {
    revenue: string;
    expenses: string;
    bonus: string;
    profit: string;
    /** Bonus bars below zero, so a negative reads as a loss at a glance. */
    negativeBonus: string;
    /** Profit bars below zero. */
    negativeProfit: string;
    /** Legend / tick label colour. */
    textColor: string;
    /** Grid line colour. */
    axisLineColor: string;
}
/** Shape of the slice of `NbJSThemeOptions.variables` the charts read. */
type ThemeVariables = Record<string, unknown> | undefined | null;
/**
 * Resolves the chart palette for the currently active theme.
 *
 * @param variables - `NbJSThemeOptions.variables` of the active theme.
 * @param element - The widget's host element, used to read CSS custom properties
 *                  when the JS theme does not declare a variable.
 * @returns A fully populated palette; never throws and never returns an empty colour.
 */
export declare function resolveEmployeeChartPalette(variables: ThemeVariables, element?: Element | null): IEmployeeChartPalette;
/** The four money series every employee chart is built from. */
export interface IEmployeeStatisticsTotals {
    income: number;
    expense: number;
    profit: number;
    bonus: number;
}
/**
 * Sums the monthly rows into one total per series.
 *
 * The legacy doughnut read `employeeStatistics[0]` — correct on the HR page,
 * whose date picker is locked to a single month, but wrong on a canvas where the
 * range is free: a quarter would have silently charted only its first month.
 * Summing matches how the HR page itself totals the same payload for its KPI
 * blocks (`HumanResourcesComponent._statsSum`).
 *
 * @param statistics - Monthly aggregated rows, newest-first or oldest-first.
 * @returns The totals; all zeros for an empty/absent payload.
 */
export declare function sumEmployeeStatistics(statistics: readonly IMonthAggregatedEmployeeStatistics[] | null | undefined): IEmployeeStatisticsTotals;
/**
 * Month/year labels for the categorical axis, e.g. `Mar '25`.
 *
 * Uses moment's localized month names (the same `months` export the legacy bar
 * chart used) and the API's zero-based `month`.
 *
 * @param statistics - Monthly aggregated rows.
 * @returns One label per row, in payload order.
 */
export declare function toMonthLabels(statistics: readonly IMonthAggregatedEmployeeStatistics[] | null | undefined): string[];
/**
 * Formats a money value the way the rest of the dashboard does.
 *
 * Deliberately takes the two pipes as arguments instead of importing them as
 * singletons: `CurrencyPipe` is locale-bound and must come from the component's
 * own injector.
 *
 * @param value - The amount.
 * @param organization - Organization owning the currency + its position.
 * @param currencyPipe - Angular's currency pipe.
 * @param positionPipe - Gauzy's symbol-position pipe.
 * @returns The formatted amount; falls back to the raw currency string when the
 *          position pipe cannot parse it.
 */
export declare function formatEmployeeCurrency(value: number, organization: IOrganization | undefined, currencyPipe: CurrencyPipe, positionPipe: CurrencyPositionPipe): string;
/** Chart.js chart type backing each {@link EmployeeChartKind}. */
export declare function toChartType(kind: EmployeeChartKind): ChartType;
/**
 * Narrows an arbitrary persisted value to a known chart kind.
 *
 * @param value - Raw value out of the placement's `config`.
 * @param fallback - Kind to use when the value is absent or unknown.
 * @returns A valid {@link EmployeeChartKind}.
 */
export declare function toEmployeeChartKind(value: unknown, fallback?: EmployeeChartKind): EmployeeChartKind;
/** Everything the dataset/label builders need beyond the raw statistics. */
export interface IEmployeeChartContext {
    palette: IEmployeeChartPalette;
    /** Already translated series names, keyed by series. */
    labels: {
        revenue: string;
        expenses: string;
        profit: string;
        bonus: string;
    };
    /** Formats an amount for the legend labels. */
    formatCurrency: (value: number) => string;
}
/**
 * Doughnut dataset: one slice per money series over the whole selected range.
 *
 * @param statistics - Monthly aggregated rows.
 * @param context - Palette, translated series names and the currency formatter.
 * @returns A Chart.js data object.
 */
export declare function buildDoughnutChartData(statistics: readonly IMonthAggregatedEmployeeStatistics[] | null | undefined, context: IEmployeeChartContext): ChartConfiguration['data'];
/**
 * Grouped horizontal bar dataset: four series across the months in range.
 *
 * @param statistics - Monthly aggregated rows.
 * @param context - Palette, translated series names and the currency formatter.
 * @returns A Chart.js data object.
 */
export declare function buildHorizontalBarChartData(statistics: readonly IMonthAggregatedEmployeeStatistics[] | null | undefined, context: IEmployeeChartContext): ChartConfiguration['data'];
/**
 * Stacked horizontal bar dataset.
 *
 * Each month's expense/bonus/profit are divided by that month's
 * `(expense + profit + bonus) / income` proportion, so the stack length is
 * comparable to the month's income rather than to the other months — the exact
 * normalization the legacy stacked chart applied.
 *
 * @param statistics - Monthly aggregated rows.
 * @param context - Palette, translated series names and the currency formatter.
 * @returns A Chart.js data object.
 */
export declare function buildStackedBarChartData(statistics: readonly IMonthAggregatedEmployeeStatistics[] | null | undefined, context: IEmployeeChartContext): ChartConfiguration['data'];
/**
 * Doughnut options.
 *
 * @param palette - Theme colours for legend text.
 * @returns Chart.js options.
 */
export declare function buildDoughnutChartOptions(palette: IEmployeeChartPalette): ChartConfiguration['options'];
/**
 * Grouped horizontal bar options.
 *
 * @param palette - Theme colours for legend, ticks and grid lines.
 * @returns Chart.js options.
 */
export declare function buildHorizontalBarChartOptions(palette: IEmployeeChartPalette): ChartConfiguration['options'];
/**
 * Stacked horizontal bar options.
 *
 * Takes the statistics as well as the palette so the tooltip can UNDO the
 * per-month normalization {@link buildStackedBarChartData} applies: the plotted
 * value is a proportion-scaled number that is not a real amount, so a default
 * tooltip would report money the employee never earned or spent. (The legacy
 * chart tried the same and coerced a whole array with `+`, so its tooltip read
 * `NaN` for any range longer than one month.)
 *
 * @param palette - Theme colours for legend, ticks and grid lines.
 * @param statistics - The rows the datasets were built from, in the same order.
 * @param formatCurrency - Formats the real amount; falls back to the plain number.
 * @returns Chart.js options.
 */
export declare function buildStackedBarChartOptions(palette: IEmployeeChartPalette, statistics?: readonly IMonthAggregatedEmployeeStatistics[] | null, formatCurrency?: (value: number) => string): ChartConfiguration['options'];
