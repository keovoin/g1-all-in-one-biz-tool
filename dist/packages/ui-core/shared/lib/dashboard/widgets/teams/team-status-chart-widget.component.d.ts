import { ChartType } from 'chart.js';
import { BaseTeamsWidgetComponent } from './base-teams-widget.component';
import * as i0 from "@angular/core";
/**
 * Doughnut of how the teams in scope are split between working now, worked
 * today and not working.
 *
 * This wraps `gz-doughnut-chart` as a widget — a component that was declared in
 * `dashboard.module.ts` but rendered by NO template, so it had never run.
 * Wrapping it surfaced three defects that are fixed here:
 *
 * 1. `ngOnChanges` dereferenced `changes['statistics']` unconditionally, so any
 *    other input change threw. There are no inputs at all now: the data comes
 *    from the ambient dashboard context.
 * 2. Its options used the Chart.js **v2** shape (`legend` / `tooltips` at the
 *    root, `elements.rectangle`), which Chart.js v4 — the version this repo ships
 *    — silently ignores, so the legend and tooltips never appeared.
 * 3. Its slice colours were the literals `green` / `orange` / `red`; they now
 *    come from the active theme (see {@link resolveTeamStatusPalette}).
 */
export declare class TeamStatusChartWidgetComponent extends BaseTeamsWidgetComponent {
    private readonly _themeService;
    private readonly _translateService;
    private readonly _elementRef;
    /** Chart.js type; a plain field because the template binds it once. */
    protected readonly chartType: ChartType;
    /** Colours of the active theme, refreshed whenever the user switches theme. */
    private readonly palette;
    /** Bumped on every language change, so the labels are re-translated. */
    private readonly langVersion;
    /** Teams currently online / working / not working, in slice order. */
    private readonly slices;
    /** True when there is nothing to chart, which drives the empty state. */
    protected readonly isEmpty: import("@angular/core").Signal<boolean>;
    /** Fully built Chart.js dataset, including the count-carrying legend labels. */
    protected readonly chartData: import("@angular/core").Signal<import("chart.js").ChartData<"doughnut", number[], unknown>>;
    /** Chart.js v4 options — note that `legend`/`tooltip` live under `plugins`. */
    protected readonly chartOptions: import("@angular/core").Signal<import("node_modules/chart.js/dist/types/utils")._DeepPartialObject<import("chart.js").CoreChartOptions<"doughnut"> & import("chart.js").ElementChartOptions<"doughnut"> & import("chart.js").PluginChartOptions<"doughnut"> & import("chart.js").DatasetChartOptions<"doughnut"> & import("chart.js").ScaleChartOptions<"doughnut"> & import("chart.js").DoughnutControllerChartOptions>>;
    constructor();
    static ɵfac: i0.ɵɵFactoryDeclaration<TeamStatusChartWidgetComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<TeamStatusChartWidgetComponent, "ga-team-status-chart-widget", never, {}, {}, never, never, true, never>;
}
