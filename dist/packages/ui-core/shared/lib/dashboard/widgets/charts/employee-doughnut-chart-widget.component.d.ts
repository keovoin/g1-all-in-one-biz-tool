import { BaseEmployeeChartWidgetComponent } from './base-employee-chart-widget.component';
import * as i0 from "@angular/core";
/**
 * Chart widget: the selected member's revenue, expenses, bonus and profit over
 * the selected range, as a doughnut.
 *
 * The share-of-the-whole view of the HR dashboard's chart switcher. Unlike the
 * legacy component — which charted `employeeStatistics[0]`, i.e. only the first
 * month of whatever came back — this totals every month in the range, because a
 * canvas widget's range is not locked to a single month.
 */
export declare class EmployeeDoughnutChartWidgetComponent extends BaseEmployeeChartWidgetComponent {
    /** Chart.js type of this widget's single rendering. */
    protected readonly chartType: import("@angular/core").Signal<keyof import("chart.js").ChartTypeRegistry>;
    /** Doughnut slices for the current payload. */
    protected readonly chartData: import("@angular/core").Signal<import("chart.js").ChartData<keyof import("chart.js").ChartTypeRegistry, (number | import("chart.js").Point | [number, number] | import("chart.js").BubbleDataPoint)[], unknown>>;
    /** Doughnut options, themed with the active palette. */
    protected readonly chartOptions: import("@angular/core").Signal<import("node_modules/chart.js/dist/types/utils")._DeepPartialObject<import("chart.js").CoreChartOptions<keyof import("chart.js").ChartTypeRegistry> & import("chart.js").ElementChartOptions<keyof import("chart.js").ChartTypeRegistry> & import("chart.js").PluginChartOptions<keyof import("chart.js").ChartTypeRegistry> & import("chart.js").DatasetChartOptions<keyof import("chart.js").ChartTypeRegistry> & import("chart.js").ScaleChartOptions<keyof import("chart.js").ChartTypeRegistry>>>;
    static ɵfac: i0.ɵɵFactoryDeclaration<EmployeeDoughnutChartWidgetComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<EmployeeDoughnutChartWidgetComponent, "ga-employee-doughnut-chart-widget", never, {}, {}, never, never, true, never>;
}
