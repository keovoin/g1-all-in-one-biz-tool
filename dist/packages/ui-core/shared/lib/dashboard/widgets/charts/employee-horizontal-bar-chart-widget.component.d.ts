import { BaseEmployeeChartWidgetComponent } from './base-employee-chart-widget.component';
import * as i0 from "@angular/core";
/**
 * Chart widget: the selected member's revenue, expenses, profit and bonus per
 * month, as grouped horizontal bars.
 *
 * The month-over-month view of the HR dashboard's chart switcher, and the one it
 * defaults to. Profit and bonus bars below zero are drawn in the theme's danger
 * colours, so a loss is never mistaken for a gain.
 */
export declare class EmployeeHorizontalBarChartWidgetComponent extends BaseEmployeeChartWidgetComponent {
    /** Chart.js type of this widget's single rendering. */
    protected readonly chartType: import("@angular/core").Signal<keyof import("chart.js").ChartTypeRegistry>;
    /** Grouped bar datasets for the current payload. */
    protected readonly chartData: import("@angular/core").Signal<import("chart.js").ChartData<keyof import("chart.js").ChartTypeRegistry, (number | import("chart.js").Point | [number, number] | import("chart.js").BubbleDataPoint)[], unknown>>;
    /** Bar chart options, themed with the active palette. */
    protected readonly chartOptions: import("@angular/core").Signal<import("node_modules/chart.js/dist/types/utils")._DeepPartialObject<import("chart.js").CoreChartOptions<keyof import("chart.js").ChartTypeRegistry> & import("chart.js").ElementChartOptions<keyof import("chart.js").ChartTypeRegistry> & import("chart.js").PluginChartOptions<keyof import("chart.js").ChartTypeRegistry> & import("chart.js").DatasetChartOptions<keyof import("chart.js").ChartTypeRegistry> & import("chart.js").ScaleChartOptions<keyof import("chart.js").ChartTypeRegistry>>>;
    static ɵfac: i0.ɵɵFactoryDeclaration<EmployeeHorizontalBarChartWidgetComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<EmployeeHorizontalBarChartWidgetComponent, "ga-employee-horizontal-bar-chart-widget", never, {}, {}, never, never, true, never>;
}
