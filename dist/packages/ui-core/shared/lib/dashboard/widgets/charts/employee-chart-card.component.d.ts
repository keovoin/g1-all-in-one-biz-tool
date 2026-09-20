import { AfterViewInit, OnDestroy } from '@angular/core';
import * as i0 from "@angular/core";
/**
 * Presentational body shared by the four employee chart widgets.
 *
 * It wraps `ng2-charts`' `BaseChartDirective` — the very directive the HR
 * dashboard's charts use — and adds the four states a canvas-hosted widget needs
 * but that page never had: a loading skeleton, a recoverable error state, an
 * actionable "pick a member" hint, and the existing "no data" notice.
 *
 * It deliberately renders NO card and NO title: on a canvas every widget is
 * already wrapped by `<ga-dashboard-widget-host>`, which owns the `nb-card`, the
 * header title and the edit-mode menu. Rendering our own would nest a card in a
 * card and print the title twice.
 *
 * Purely presentational on purpose — all fetching, theming and dataset building
 * live in `BaseEmployeeChartWidgetComponent`, so this component stays trivially
 * reusable by any future chart widget.
 */
export declare class EmployeeChartCardComponent implements AfterViewInit, OnDestroy {
    private readonly _host;
    private readonly _zone;
    /** Chart.js chart type — `'bar'` or `'doughnut'` for the shipped widgets. */
    readonly type: import("@angular/core").InputSignal<keyof import("chart.js").ChartTypeRegistry>;
    /** Chart.js data object; `null` while the widget has nothing to draw. */
    readonly data: import("@angular/core").InputSignal<import("chart.js").ChartData<keyof import("chart.js").ChartTypeRegistry, (number | import("chart.js").Point | [number, number] | import("chart.js").BubbleDataPoint)[], unknown>>;
    /** Chart.js options, already themed by the widget. */
    readonly options: import("@angular/core").InputSignal<import("node_modules/chart.js/dist/types/utils")._DeepPartialObject<import("chart.js").CoreChartOptions<keyof import("chart.js").ChartTypeRegistry> & import("chart.js").ElementChartOptions<keyof import("chart.js").ChartTypeRegistry> & import("chart.js").PluginChartOptions<keyof import("chart.js").ChartTypeRegistry> & import("chart.js").DatasetChartOptions<keyof import("chart.js").ChartTypeRegistry> & import("chart.js").ScaleChartOptions<keyof import("chart.js").ChartTypeRegistry>>>;
    /** Shows the skeleton instead of the chart. */
    readonly loading: import("@angular/core").InputSignal<boolean>;
    /** Non-null switches the card into its error state. */
    readonly error: import("@angular/core").InputSignal<string>;
    /**
     * True when the widget cannot query anything until the user picks a member.
     *
     * Rendered as an actionable hint rather than an empty chart, because "no bars"
     * and "no member selected" are two very different answers.
     */
    readonly requiresEmployee: import("@angular/core").InputSignal<boolean>;
    /** True when the query succeeded but returned no months. */
    readonly empty: import("@angular/core").InputSignal<boolean>;
    /** Emitted when the user asks for a re-fetch from the error state. */
    readonly retry: import("@angular/core").OutputEmitterRef<void>;
    /**
     * Chart data, never `null`.
     *
     * `BaseChartDirective` assigns whatever it is given straight onto the Chart.js
     * instance, and a `null` there throws inside the library rather than in our
     * template — so the empty structure is substituted here.
     */
    protected readonly chartData: import("@angular/core").Signal<import("chart.js").ChartData<keyof import("chart.js").ChartTypeRegistry, (number | import("chart.js").Point | [number, number] | import("chart.js").BubbleDataPoint)[], unknown>>;
    /** Chart options, normalized to `undefined` so Chart.js applies its defaults. */
    protected readonly chartOptions: import("@angular/core").Signal<import("node_modules/chart.js/dist/types/utils")._DeepPartialObject<import("chart.js").CoreChartOptions<keyof import("chart.js").ChartTypeRegistry> & import("chart.js").ElementChartOptions<keyof import("chart.js").ChartTypeRegistry> & import("chart.js").PluginChartOptions<keyof import("chart.js").ChartTypeRegistry> & import("chart.js").DatasetChartOptions<keyof import("chart.js").ChartTypeRegistry> & import("chart.js").ScaleChartOptions<keyof import("chart.js").ChartTypeRegistry>>>;
    /** The rendered chart, absent in every state other than "ready". */
    private readonly chartDirective;
    /** Watches the widget's own box, see {@link scheduleResize}. */
    private resizeObserver;
    /** Pending animation frame id, `0` when none is scheduled. */
    private resizeFrame;
    /**
     * Starts observing the host box so the chart follows its grid cell.
     *
     * Chart.js only re-measures when its own container resizes, and on a dashboard
     * canvas the widget is resized by a CSS grid whose track sizes change without
     * any layout event the chart can see (another widget dropped next to it, the
     * width menu picking 4 → 8 columns, the browser window changing). Without this
     * the canvas keeps its first measured size and the chart renders stretched.
     */
    ngAfterViewInit(): void;
    /** Stops the observer and drops any pending frame. */
    ngOnDestroy(): void;
    /**
     * Coalesces a burst of resize notifications into one `chart.resize()`.
     *
     * Resizing a Chart.js chart re-renders it synchronously, so calling it per
     * observer notification during a drag would drop frames.
     */
    private scheduleResize;
    static ɵfac: i0.ɵɵFactoryDeclaration<EmployeeChartCardComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<EmployeeChartCardComponent, "ga-employee-chart-card", never, { "type": { "alias": "type"; "required": false; "isSignal": true; }; "data": { "alias": "data"; "required": false; "isSignal": true; }; "options": { "alias": "options"; "required": false; "isSignal": true; }; "loading": { "alias": "loading"; "required": false; "isSignal": true; }; "error": { "alias": "error"; "required": false; "isSignal": true; }; "requiresEmployee": { "alias": "requiresEmployee"; "required": false; "isSignal": true; }; "empty": { "alias": "empty"; "required": false; "isSignal": true; }; }, { "retry": "retry"; }, never, never, true, never>;
}
