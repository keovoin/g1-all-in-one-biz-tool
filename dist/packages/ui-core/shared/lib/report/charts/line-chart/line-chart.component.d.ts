import { OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { NbJSThemeOptions, NbThemeService } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { ChartType, ChartConfiguration, ActiveElement, ChartEvent, TooltipItem } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { AnnotationPluginOptions } from 'chartjs-plugin-annotation';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import * as i0 from "@angular/core";
export declare class LineChartComponent extends TranslationBaseComponent implements OnChanges, OnDestroy, OnInit {
    private readonly themeService;
    readonly translate: TranslateService;
    lineChartType: ChartType;
    lineChartOptions: ChartConfiguration['options'];
    /**
     * A flag that enables or disables the annotations plugin dynamically.
     *
     * This property is used to control whether annotations should be included in the chart's configuration.
     * If set to `true`, the annotations (such as the "Standard Work Hours" line) will be displayed.
     * If set to `false`, the annotations will be omitted from the chart.
     *
     * This allows dynamic control over the chart's features, enabling you to customize the chart based on
     * different pages or user preferences.
     *
     * @input enableAnnotations - A boolean value that toggles the annotations plugin.
     *                            Defaults to `false` (no annotations).
     *                            Set to `true` to enable annotations in the chart.
     *
     * Example usage:
     * ```
     * <ngx-line-chart
     *   [data]="charts"
     *   [standardWorkHours]="organization?.standardWorkHoursPerDay"
     *   [enableAnnotations]="enableAnnotations"
     * ></ngx-line-chart>
     * ```
     */
    enableAnnotations: boolean;
    /**
     * The standard work hours per day that can be passed from the parent component.
     * If not provided, it defaults to `DEFAULT_STANDARD_WORK_HOURS_PER_DAY`.
     *
     * @input standardWorkHours - The number of standard work hours to be displayed on the chart.
     */
    standardWorkHours: number;
    /**
     * A boolean input property that determines whether the chart legend
     * should be displayed or hidden.
     *
     * @input lineChartLegend - When true, the chart legend is displayed.
     *                          When false, the chart legend is hidden.
     *                          Defaults to true if no value is provided.
     */
    lineChartLegend: boolean;
    /**
     * Private member to hold the actual data configuration for the chart.
     */
    private _data;
    /**
     * Public setter for the data property.
     * Sets the new value for data and updates the chart if applicable.
     */
    set data(value: ChartConfiguration['data']);
    /**
     * Public getter for the data property.
     * Allows external access to the data configuration.
     */
    get data(): ChartConfiguration['data'];
    /**
     * A reference to the `BaseChartDirective` instance in the component's view.
     *
     * @viewChild baseChartDirective - A reference to the `BaseChartDirective` instance that manages the Chart.js object
     *                                 inside the component, allowing direct control over the chart's rendering and behavior.
     */
    baseChartDirective: BaseChartDirective;
    constructor(themeService: NbThemeService, translate: TranslateService);
    ngOnInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    /**
     * Detects the current theme (light or dark) and returns appropriate label text
     * and background colors.
     *
     * @returns An object containing the label text color and background color for the current theme.
     */
    getThemeColors(): {
        labelTextColor: string;
        labelBackgroundColor: string;
    };
    /**
     * Generates the annotation configuration for the chart, including theme-based label colors
     * and other styling for the standard work hours line.
     *
     * This method dynamically applies theme-specific colors for the annotation label and
     * uses the standard work hours to determine the position of the horizontal line.
     *
     * @returns The final annotation configuration with dynamic label colors and styles applied.
     */
    getAnnotationConfig(): AnnotationPluginOptions;
    /**
     * Initializes a Chart with the given configuration options.
     * @param config - The configuration options for the Chart, including theme variables.
     */
    initializeChart(config: NbJSThemeOptions): void;
    private resetDatasetStyles;
    private applyHoverStyles;
    /**
     * Customizes the tooltip content for a chart.
     * @param tooltipItem - The tooltip item containing information about the data point.
     * @returns The customized tooltip string.
     */
    getTooltip(tooltipItem: TooltipItem<ChartType>): string;
    /**
     * Handles the click event on the chart.
     * When the user clicks on a specific chart element (data point),
     * this method can be used to trigger additional actions like showing details or navigating to another view.
     *
     * @param param0 - An object containing the event and active elements.
     * @param event - The event triggered by the chart click.
     * @param active - The active chart elements at the time of the click (e.g., the data points that were clicked on).
     */
    chartClicked({ event, active }: {
        event?: ChartEvent;
        active?: ActiveElement[];
    }): void;
    /**
     * Handles the hover event on the chart.
     * This method triggers when the user hovers over a specific chart element (data point),
     * and can be used to display information or modify the hover style.
     *
     * @param param0 - An object containing the event and active elements.
     * @param event - The event triggered by the hover action.
     * @param active - The active chart elements that are hovered over (e.g., the data points).
     */
    chartHovered({ event, active }: {
        event?: ChartEvent;
        active?: ActiveElement[];
    }): void;
    /**
     * Refreshes the chart by updating its data or options.
     * The method ensures that the chart is only updated if the `BaseChartDirective` is properly initialized.
     *
     * Example usage:
     * ```
     * this.refreshChart();
     * ```
     */
    private refreshChart;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<LineChartComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<LineChartComponent, "ngx-line-chart", never, { "enableAnnotations": { "alias": "enableAnnotations"; "required": false; }; "standardWorkHours": { "alias": "standardWorkHours"; "required": false; }; "lineChartLegend": { "alias": "lineChartLegend"; "required": false; }; "data": { "alias": "data"; "required": false; }; }, {}, never, never, false, never>;
}
