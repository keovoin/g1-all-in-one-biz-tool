import { ChangeDetectionStrategy, Component, ElementRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NbThemeService } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { combineLatest } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { LineChartModule } from '../../../report/charts/line-chart/line-chart.module';
// Reuses the chart palette the employee chart widgets already resolve: a
// `<canvas>` cannot read a CSS custom property, so every chart in the dashboard
// has to look its colours up in TypeScript, and doing it twice would let the two
// families of charts drift apart.
import { resolveEmployeeChartPalette } from '../charts/employee-chart.utils';
import { TeamsWidgetStateComponent } from '../teams/teams-widget-state.component';
import { BaseAccountingWidgetComponent } from './base-accounting-widget.component';
import { CASH_FLOW_SERIES_KEYS, DEFAULT_CASH_FLOW_LABELS, buildCashFlowChartData } from './cash-flow-chart.utils';
import * as i0 from "@angular/core";
import * as i1 from "../../../report/charts/line-chart/line-chart.component";
/**
 * Cash flow over the selected period: income, expenses, profit and bonus plotted
 * against the aggregate payload's date buckets.
 *
 * This is the Accounting page's `<ngx-line-chart>` on a canvas. The chart
 * component itself is reused untouched — it owns the Chart.js options, the theme
 * subscription and the hover behaviour — so this widget only has to supply the
 * datasets and the three states the page never had (loading, error, empty).
 *
 * It reads the very same `/employee-statistics/aggregate` response as the four
 * Accounting KPIs and the employee breakdown table, so a canvas showing all six
 * still issues ONE request per context change (see
 * `AccountingStatisticsCacheService`).
 */
export class CashFlowWidgetComponent extends BaseAccountingWidgetComponent {
    constructor() {
        super();
        this._themeService = inject(NbThemeService);
        this._translateService = inject(TranslateService);
        this._host = inject(ElementRef);
        /** Chart colours of the active theme; re-resolved on every theme switch. */
        this.palette = signal(resolveEmployeeChartPalette(null), ...(ngDevMode ? [{ debugName: "palette" }] : []));
        /** Translated series names; re-emitted on every language change. */
        this.seriesLabels = signal(DEFAULT_CASH_FLOW_LABELS, ...(ngDevMode ? [{ debugName: "seriesLabels" }] : []));
        /** Date buckets of the current payload, or an empty list before the first fetch. */
        this.chartRows = computed(() => this.statistics()?.chart ?? [], ...(ngDevMode ? [{ debugName: "chartRows" }] : []));
        /** True when the query succeeded but the range contains no bucket to plot. */
        this.isEmpty = computed(() => this.chartRows().length === 0, ...(ngDevMode ? [{ debugName: "isEmpty" }] : []));
        /** Fully built datasets for `ngx-line-chart`. */
        this.chartData = computed(() => buildCashFlowChartData(this.chartRows(), this.palette(), this.seriesLabels()), ...(ngDevMode ? [{ debugName: "chartData" }] : []));
        this.observeTheme();
        this.observeSeriesLabels();
    }
    /** Keeps {@link palette} in sync with the active Nebular theme. */
    observeTheme() {
        this._themeService
            .getJsTheme()
            .pipe(map((config) => config?.variables), tap((variables) => this.palette.set(resolveEmployeeChartPalette(variables, this._host.nativeElement))), takeUntilDestroyed(this.destroyRef))
            .subscribe();
    }
    /**
     * Keeps {@link seriesLabels} translated.
     *
     * `stream()` rather than `instant()`: a widget is created the moment it is
     * dropped on a canvas, which can be before the language file has resolved, and
     * `instant()` would then bake the raw translation keys into the legend for the
     * rest of the session.
     */
    observeSeriesLabels() {
        combineLatest([
            this._translateService.stream(CASH_FLOW_SERIES_KEYS.income),
            this._translateService.stream(CASH_FLOW_SERIES_KEYS.expense),
            this._translateService.stream(CASH_FLOW_SERIES_KEYS.profit),
            this._translateService.stream(CASH_FLOW_SERIES_KEYS.bonus)
        ])
            .pipe(map(([income, expense, profit, bonus]) => ({ income, expense, profit, bonus })), tap((labels) => this.seriesLabels.set(labels)), takeUntilDestroyed(this.destroyRef))
            .subscribe();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CashFlowWidgetComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: CashFlowWidgetComponent, isStandalone: true, selector: "ga-accounting-cash-flow-widget", usesInheritance: true, ngImport: i0, template: "<ga-teams-widget-state\n\t[loading]=\"loading()\"\n\t[error]=\"error()\"\n\t[empty]=\"isEmpty()\"\n\t[skeletonRows]=\"3\"\n\temptyMessageKey=\"DASHBOARD_PAGE.BUILDER.WIDGETS.ACCOUNTING_CASH_FLOW.EMPTY\"\n\t(retry)=\"refresh()\"\n>\n\t<div class=\"cash-flow-chart\">\n\t\t<ngx-line-chart [data]=\"chartData()\"></ngx-line-chart>\n\t</div>\n</ga-teams-widget-state>\n", styles: [":host{display:block;height:100%;width:100%;min-width:0;overflow:hidden}.cash-flow-chart{height:100%;width:100%;min-height:0}.cash-flow-chart ::ng-deep ngx-line-chart{display:block;height:100%}.cash-flow-chart ::ng-deep ngx-line-chart .chart{height:100%;min-height:0}\n"], dependencies: [{ kind: "ngmodule", type: LineChartModule }, { kind: "component", type: i1.LineChartComponent, selector: "ngx-line-chart", inputs: ["enableAnnotations", "standardWorkHours", "lineChartLegend", "data"] }, { kind: "component", type: TeamsWidgetStateComponent, selector: "ga-teams-widget-state", inputs: ["loading", "error", "empty", "emptyMessageKey", "skeletonRows"], outputs: ["retry"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CashFlowWidgetComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-accounting-cash-flow-widget', standalone: true, imports: [LineChartModule, TeamsWidgetStateComponent], changeDetection: ChangeDetectionStrategy.OnPush, template: "<ga-teams-widget-state\n\t[loading]=\"loading()\"\n\t[error]=\"error()\"\n\t[empty]=\"isEmpty()\"\n\t[skeletonRows]=\"3\"\n\temptyMessageKey=\"DASHBOARD_PAGE.BUILDER.WIDGETS.ACCOUNTING_CASH_FLOW.EMPTY\"\n\t(retry)=\"refresh()\"\n>\n\t<div class=\"cash-flow-chart\">\n\t\t<ngx-line-chart [data]=\"chartData()\"></ngx-line-chart>\n\t</div>\n</ga-teams-widget-state>\n", styles: [":host{display:block;height:100%;width:100%;min-width:0;overflow:hidden}.cash-flow-chart{height:100%;width:100%;min-height:0}.cash-flow-chart ::ng-deep ngx-line-chart{display:block;height:100%}.cash-flow-chart ::ng-deep ngx-line-chart .chart{height:100%;min-height:0}\n"] }]
        }], ctorParameters: () => [] });
//# sourceMappingURL=cash-flow-widget.component.js.map