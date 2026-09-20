import { BaseEmployeeChartWidgetComponent } from './base-employee-chart-widget.component';
import { EmployeeChartKind } from './employee-chart.utils';
import * as i0 from "@angular/core";
/**
 * Chart widget: the HR dashboard's chart switcher, canvas-hosted.
 *
 * One widget that renders any of the three employee-statistics charts and lets
 * the viewer flip between them — the same choice the HR dashboard offers from
 * its "Employee Statistics" panel header, so a canvas does not have to spend
 * three cells to offer all three views.
 *
 * The dropdown is a VIEW state, not a persisted one: a canvas widget has no
 * write access to its own placement, so a pick lasts for the session. The
 * starting rendering comes from the placement's `chartType` setting, which the
 * builder's configuration dialog writes.
 */
export declare class EmployeeStatisticsChartWidgetComponent extends BaseEmployeeChartWidgetComponent {
    /** Renderings offered by the dropdown, in the legacy switcher's order. */
    protected readonly chartKinds: readonly EmployeeChartKind[];
    /**
     * The rendering currently on screen.
     *
     * Seeded from the placement's configuration; `toEmployeeChartKind` narrows an
     * unknown persisted value (a renamed kind, hand-edited JSON) back to the
     * default instead of rendering a blank canvas.
     */
    protected readonly selectedKind: import("@angular/core").WritableSignal<EmployeeChartKind>;
    /** Chart.js type of the selected rendering. */
    protected readonly chartType: import("@angular/core").Signal<keyof import("chart.js").ChartTypeRegistry>;
    /** Datasets of the selected rendering. */
    protected readonly chartData: import("@angular/core").Signal<import("chart.js").ChartData<keyof import("chart.js").ChartTypeRegistry, (number | import("chart.js").Point | [number, number] | import("chart.js").BubbleDataPoint)[], unknown>>;
    /** Options of the selected rendering, themed with the active palette. */
    protected readonly chartOptions: import("@angular/core").Signal<import("node_modules/chart.js/dist/types/utils")._DeepPartialObject<import("chart.js").CoreChartOptions<keyof import("chart.js").ChartTypeRegistry> & import("chart.js").ElementChartOptions<keyof import("chart.js").ChartTypeRegistry> & import("chart.js").PluginChartOptions<keyof import("chart.js").ChartTypeRegistry> & import("chart.js").DatasetChartOptions<keyof import("chart.js").ChartTypeRegistry> & import("chart.js").ScaleChartOptions<keyof import("chart.js").ChartTypeRegistry>>>;
    /**
     * Switches the rendering.
     *
     * Only the chart is rebuilt — the payload is untouched, so flipping between
     * views never issues a request.
     *
     * @param kind - The rendering the viewer picked.
     */
    onKindChange(kind: EmployeeChartKind): void;
    /**
     * Translation key of a rendering's dropdown label.
     *
     * @param kind - The rendering to label.
     * @returns The translation key.
     */
    labelFor(kind: EmployeeChartKind): string;
    static ɵfac: i0.ɵɵFactoryDeclaration<EmployeeStatisticsChartWidgetComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<EmployeeStatisticsChartWidgetComponent, "ga-employee-statistics-chart-widget", never, {}, {}, never, never, true, never>;
}
