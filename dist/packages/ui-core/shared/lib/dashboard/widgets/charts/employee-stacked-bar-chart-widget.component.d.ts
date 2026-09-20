import { BaseEmployeeChartWidgetComponent } from './base-employee-chart-widget.component';
import * as i0 from "@angular/core";
/**
 * Chart widget: how each month's expenses, bonus and profit divide that month's
 * revenue, as a stacked horizontal bar.
 *
 * The composition view of the HR dashboard's chart switcher. Each month's values
 * are normalized by its own `(expense + profit + bonus) / income` proportion, so
 * a strong month and a weak one are directly comparable.
 */
export declare class EmployeeStackedBarChartWidgetComponent extends BaseEmployeeChartWidgetComponent {
    /** Chart.js type of this widget's single rendering. */
    protected readonly chartType: import("@angular/core").Signal<keyof import("chart.js").ChartTypeRegistry>;
    /** Stacked bar datasets for the current payload. */
    protected readonly chartData: import("@angular/core").Signal<import("chart.js").ChartData<keyof import("chart.js").ChartTypeRegistry, (number | import("chart.js").Point | [number, number] | import("chart.js").BubbleDataPoint)[], unknown>>;
    /** Stacked bar options, themed with the active palette. */
    protected readonly chartOptions: import("@angular/core").Signal<import("node_modules/chart.js/dist/types/utils")._DeepPartialObject<import("chart.js").CoreChartOptions<keyof import("chart.js").ChartTypeRegistry> & import("chart.js").ElementChartOptions<keyof import("chart.js").ChartTypeRegistry> & import("chart.js").PluginChartOptions<keyof import("chart.js").ChartTypeRegistry> & import("chart.js").DatasetChartOptions<keyof import("chart.js").ChartTypeRegistry> & import("chart.js").ScaleChartOptions<keyof import("chart.js").ChartTypeRegistry>>>;
    static ɵfac: i0.ɵɵFactoryDeclaration<EmployeeStackedBarChartWidgetComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<EmployeeStackedBarChartWidgetComponent, "ga-employee-stacked-bar-chart-widget", never, {}, {}, never, never, true, never>;
}
