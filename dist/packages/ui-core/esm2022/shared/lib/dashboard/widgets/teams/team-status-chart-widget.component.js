import { ChangeDetectionStrategy, Component, ElementRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NbThemeService } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { BaseChartDirective } from 'ng2-charts';
import { BaseTeamsWidgetComponent } from './base-teams-widget.component';
import { TeamsWidgetStateComponent } from './teams-widget-state.component';
import { resolveTeamStatusPalette } from './team-status-chart.utils';
import * as i0 from "@angular/core";
/** Neutral palette used until the theme service has emitted, so `chartData` is never empty. */
const NEUTRAL_PALETTE = {
    online: 'green',
    working: 'orange',
    notWorking: 'crimson',
    textColor: 'gray'
};
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
export class TeamStatusChartWidgetComponent extends BaseTeamsWidgetComponent {
    constructor() {
        super();
        this._themeService = inject(NbThemeService);
        this._translateService = inject(TranslateService);
        this._elementRef = inject(ElementRef);
        /** Chart.js type; a plain field because the template binds it once. */
        this.chartType = 'doughnut';
        /** Colours of the active theme, refreshed whenever the user switches theme. */
        this.palette = signal(NEUTRAL_PALETTE, ...(ngDevMode ? [{ debugName: "palette" }] : []));
        /** Bumped on every language change, so the labels are re-translated. */
        this.langVersion = signal(0, ...(ngDevMode ? [{ debugName: "langVersion" }] : []));
        /** Teams currently online / working / not working, in slice order. */
        this.slices = computed(() => {
            const snapshot = this.snapshot();
            const online = snapshot?.teamsOnline ?? 0;
            const working = snapshot?.teamsWorking ?? 0;
            // `working` INCLUDES the online teams, exactly like the legacy statistics
            // object; clamped so a mid-refresh snapshot cannot produce a negative slice.
            return [online, Math.max(working - online, 0), snapshot?.teamsNotWorking ?? 0];
        }, ...(ngDevMode ? [{ debugName: "slices" }] : []));
        /** True when there is nothing to chart, which drives the empty state. */
        this.isEmpty = computed(() => this.slices().every((slice) => slice === 0), ...(ngDevMode ? [{ debugName: "isEmpty" }] : []));
        /** Fully built Chart.js dataset, including the count-carrying legend labels. */
        this.chartData = computed(() => {
            // Read so the labels are rebuilt after a language change.
            this.langVersion();
            const [online, working, notWorking] = this.slices();
            const palette = this.palette();
            return {
                labels: [
                    `${this._translateService.instant('DASHBOARD_PAGE.CHARTS.WORKING_NOW')}: ${online}`,
                    `${this._translateService.instant('DASHBOARD_PAGE.CHARTS.WORKING')}: ${working}`,
                    `${this._translateService.instant('DASHBOARD_PAGE.CHARTS.NOT_WORKING')}: ${notWorking}`
                ],
                datasets: [
                    {
                        data: [online, working, notWorking],
                        backgroundColor: [palette.online, palette.working, palette.notWorking],
                        // Fully transparent rather than a colour: a hover border drawn in
                        // any theme colour looks like a selection artefact.
                        hoverBorderColor: 'transparent',
                        borderWidth: 0
                    }
                ]
            };
        }, ...(ngDevMode ? [{ debugName: "chartData" }] : []));
        /** Chart.js v4 options — note that `legend`/`tooltip` live under `plugins`. */
        this.chartOptions = computed(() => ({
            responsive: true,
            // The widget host sizes the card; letting the chart keep its aspect ratio
            // would make it overflow a wide, short placement.
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { color: this.palette().textColor }
                },
                tooltip: {
                    enabled: true,
                    callbacks: {
                        // The label already carries the count, so the value would repeat it.
                        label: (item) => item.label ?? ''
                    }
                }
            }
        }), ...(ngDevMode ? [{ debugName: "chartOptions" }] : []));
        // The palette has to be re-resolved on every theme switch; `getJsTheme()`
        // re-emits, so this keeps the slices correct without a page reload.
        this._themeService
            .getJsTheme()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((theme) => this.palette.set(resolveTeamStatusPalette(theme?.variables, this._elementRef.nativeElement)));
        this._translateService.onLangChange
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => this.langVersion.update((version) => version + 1));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TeamStatusChartWidgetComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: TeamStatusChartWidgetComponent, isStandalone: true, selector: "ga-team-status-chart-widget", usesInheritance: true, ngImport: i0, template: "<ga-teams-widget-state\n\t[loading]=\"loading()\"\n\t[error]=\"error()\"\n\t[empty]=\"isEmpty()\"\n\t[skeletonRows]=\"3\"\n\temptyMessageKey=\"DASHBOARD_PAGE.BUILDER.WIDGETS.TEAM_STATUS_CHART.EMPTY\"\n\t(retry)=\"refresh()\"\n>\n\t<div class=\"chart-container\">\n\t\t<canvas baseChart [type]=\"chartType\" [data]=\"chartData()\" [options]=\"chartOptions()\"></canvas>\n\t</div>\n</ga-teams-widget-state>\n", styles: [":host{display:block;height:100%;width:100%;min-width:0}.chart-container{position:relative;height:100%;width:100%;min-height:160px}.chart-container canvas{max-width:100%}\n"], dependencies: [{ kind: "directive", type: BaseChartDirective, selector: "canvas[baseChart]", inputs: ["type", "legend", "data", "options", "plugins", "labels", "datasets"], outputs: ["chartClick", "chartHover"], exportAs: ["base-chart"] }, { kind: "component", type: TeamsWidgetStateComponent, selector: "ga-teams-widget-state", inputs: ["loading", "error", "empty", "emptyMessageKey", "skeletonRows"], outputs: ["retry"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TeamStatusChartWidgetComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-team-status-chart-widget', standalone: true, imports: [BaseChartDirective, TeamsWidgetStateComponent], changeDetection: ChangeDetectionStrategy.OnPush, template: "<ga-teams-widget-state\n\t[loading]=\"loading()\"\n\t[error]=\"error()\"\n\t[empty]=\"isEmpty()\"\n\t[skeletonRows]=\"3\"\n\temptyMessageKey=\"DASHBOARD_PAGE.BUILDER.WIDGETS.TEAM_STATUS_CHART.EMPTY\"\n\t(retry)=\"refresh()\"\n>\n\t<div class=\"chart-container\">\n\t\t<canvas baseChart [type]=\"chartType\" [data]=\"chartData()\" [options]=\"chartOptions()\"></canvas>\n\t</div>\n</ga-teams-widget-state>\n", styles: [":host{display:block;height:100%;width:100%;min-width:0}.chart-container{position:relative;height:100%;width:100%;min-height:160px}.chart-container canvas{max-width:100%}\n"] }]
        }], ctorParameters: () => [] });
//# sourceMappingURL=team-status-chart-widget.component.js.map