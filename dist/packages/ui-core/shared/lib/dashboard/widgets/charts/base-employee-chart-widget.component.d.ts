import { CurrencyPipe } from '@angular/common';
import { OnInit } from '@angular/core';
import { ChartConfiguration, ChartType } from 'chart.js';
import { IMonthAggregatedEmployeeStatistics } from '@gauzy/contracts';
import { IDashboardWidgetContext } from '@gauzy/ui-core/core';
import { CurrencyPositionPipe } from '../../../pipes/currency-position.pipe';
import { BaseDashboardWidgetComponent } from '../../widget-host/base-dashboard-widget.component';
import { EmployeeChartKind, IEmployeeChartContext, IEmployeeChartPalette } from './employee-chart.utils';
import * as i0 from "@angular/core";
/**
 * Providers every concrete employee chart widget must declare.
 *
 * `CurrencyPipe` is locale-bound and `CurrencyPositionPipe` is a plain
 * `@Pipe()` class, so neither is available in the root injector. They cannot be
 * declared on this `@Directive()` either — an abstract directive contributes no
 * providers to the component that extends it — hence the shared constant.
 */
export declare const EMPLOYEE_CHART_WIDGET_PROVIDERS: (typeof CurrencyPositionPipe | typeof CurrencyPipe)[];
/**
 * Shared data + theming layer for every employee chart widget.
 *
 * All four charts are renderings of the very same
 * `/employee-statistics/months` payload, so they all subscribe to the ambient
 * dashboard context here and fetch through
 * {@link EmployeeMonthStatisticsCacheService}. The cache collapses identical
 * in-flight requests into one — which is what makes it cheap to put the doughnut
 * next to the bar chart on one canvas.
 *
 * Subclasses only decide WHICH rendering they show; they never fetch, never
 * resolve colours and never build datasets.
 */
export declare abstract class BaseEmployeeChartWidgetComponent extends BaseDashboardWidgetComponent implements OnInit {
    private readonly _statisticsCache;
    private readonly _themeService;
    private readonly _translateService;
    private readonly _currencyPipe;
    private readonly _currencyPositionPipe;
    private readonly _host;
    /** Manual re-fetch trigger, fed by {@link refresh}. */
    private readonly _reload$;
    /** Monthly rows of the current selection; empty until the first fetch lands. */
    protected readonly statistics: import("@angular/core").WritableSignal<IMonthAggregatedEmployeeStatistics[]>;
    /** Context the current payload was fetched for; powers currency formatting. */
    protected readonly widgetContext: import("@angular/core").WritableSignal<IDashboardWidgetContext>;
    /** Chart colours of the active theme. */
    protected readonly palette: import("@angular/core").WritableSignal<IEmployeeChartPalette>;
    /** Translated series names; re-emitted on every language change. */
    protected readonly seriesLabels: import("@angular/core").WritableSignal<{
        revenue: string;
        expenses: string;
        profit: string;
        bonus: string;
    }>;
    /** The employee the charts describe, or `null` when none is selected. */
    protected readonly employeeId: import("@angular/core").Signal<string>;
    /**
     * True when the widget has nothing to query.
     *
     * `/employee-statistics/months` is per-employee, so with the page selector on
     * "All employees" there is no request to make — the card shows an actionable
     * hint instead of an empty plot.
     */
    protected readonly requiresEmployee: import("@angular/core").Signal<boolean>;
    /** True when the query succeeded but the range contains no months. */
    protected readonly isEmpty: import("@angular/core").Signal<boolean>;
    /** Everything the dataset builders need beyond the raw statistics. */
    protected readonly chartContext: import("@angular/core").Signal<IEmployeeChartContext>;
    /**
     * Starts the statistics, theme and translation subscriptions.
     *
     * Deliberately does NOT call `super.ngOnInit()`: the base class' default is to
     * call {@link refresh} on every context emission, which here would push an
     * extra value through the reload trigger and fetch the same payload twice.
     * This class subscribes to `context$` itself instead.
     */
    ngOnInit(): void;
    /**
     * Re-fetches the statistics, clearing any previous error first.
     *
     * Invoked by the widget host's refresh control and by the card's retry button.
     */
    refresh(): void;
    /**
     * Chart.js data for one rendering of the current payload.
     *
     * Exposed to subclasses (rather than each of them owning a builder) so the
     * switcher widget can flip between renderings without duplicating anything.
     *
     * @param kind - Which rendering to build.
     * @returns A Chart.js data object.
     */
    protected chartDataFor(kind: EmployeeChartKind): ChartConfiguration['data'];
    /**
     * Chart.js options for one rendering, themed with the active palette.
     *
     * @param kind - Which rendering to configure.
     * @returns Chart.js options.
     */
    protected chartOptionsFor(kind: EmployeeChartKind): ChartConfiguration['options'];
    /**
     * Chart.js chart type for one rendering.
     *
     * @param kind - Which rendering to type.
     * @returns The Chart.js type name.
     */
    protected chartTypeFor(kind: EmployeeChartKind): ChartType;
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
    /**
     * Wires `context$` (plus manual reloads) to the cached months endpoint and
     * mirrors the request lifecycle into the `loading` / `error` signals.
     */
    private observeStatistics;
    /**
     * One request for the given context, or an empty payload when there is
     * nothing to ask for.
     *
     * @param context - The context to query for.
     * @returns The monthly rows, or `null` when the request failed.
     */
    private fetchStatistics;
    static ɵfac: i0.ɵɵFactoryDeclaration<BaseEmployeeChartWidgetComponent, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<BaseEmployeeChartWidgetComponent, never, never, {}, {}, never, never, true, never>;
}
