import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { NbSelectModule } from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';
import { BaseEmployeeChartWidgetComponent, EMPLOYEE_CHART_WIDGET_PROVIDERS } from './base-employee-chart-widget.component';
import { EmployeeChartCardComponent } from './employee-chart-card.component';
import { EMPLOYEE_CHART_KINDS, EMPLOYEE_CHART_KIND_LABELS, EMPLOYEE_CHART_TYPE_CONFIG_KEY, toEmployeeChartKind } from './employee-chart.utils';
import * as i0 from "@angular/core";
import * as i1 from "@nebular/theme";
import * as i2 from "@ngx-translate/core";
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
export class EmployeeStatisticsChartWidgetComponent extends BaseEmployeeChartWidgetComponent {
    constructor() {
        super(...arguments);
        /** Renderings offered by the dropdown, in the legacy switcher's order. */
        this.chartKinds = EMPLOYEE_CHART_KINDS;
        /**
         * The rendering currently on screen.
         *
         * Seeded from the placement's configuration; `toEmployeeChartKind` narrows an
         * unknown persisted value (a renamed kind, hand-edited JSON) back to the
         * default instead of rendering a blank canvas.
         */
        this.selectedKind = signal(toEmployeeChartKind(this.getConfig(EMPLOYEE_CHART_TYPE_CONFIG_KEY, null)), ...(ngDevMode ? [{ debugName: "selectedKind" }] : []));
        /** Chart.js type of the selected rendering. */
        this.chartType = computed(() => this.chartTypeFor(this.selectedKind()), ...(ngDevMode ? [{ debugName: "chartType" }] : []));
        /** Datasets of the selected rendering. */
        this.chartData = computed(() => this.chartDataFor(this.selectedKind()), ...(ngDevMode ? [{ debugName: "chartData" }] : []));
        /** Options of the selected rendering, themed with the active palette. */
        this.chartOptions = computed(() => this.chartOptionsFor(this.selectedKind()), ...(ngDevMode ? [{ debugName: "chartOptions" }] : []));
    }
    /**
     * Switches the rendering.
     *
     * Only the chart is rebuilt — the payload is untouched, so flipping between
     * views never issues a request.
     *
     * @param kind - The rendering the viewer picked.
     */
    onKindChange(kind) {
        this.selectedKind.set(toEmployeeChartKind(kind, this.selectedKind()));
    }
    /**
     * Translation key of a rendering's dropdown label.
     *
     * @param kind - The rendering to label.
     * @returns The translation key.
     */
    labelFor(kind) {
        return EMPLOYEE_CHART_KIND_LABELS[kind];
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: EmployeeStatisticsChartWidgetComponent, deps: null, target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: EmployeeStatisticsChartWidgetComponent, isStandalone: true, selector: "ga-employee-statistics-chart-widget", providers: EMPLOYEE_CHART_WIDGET_PROVIDERS, usesInheritance: true, ngImport: i0, template: "<div class=\"chart-switcher\">\n\t<div class=\"chart-switcher__toolbar\">\n\t\t<span class=\"chart-switcher__label\">{{ 'DASHBOARD_PAGE.CHARTS.CHART_TYPE' | translate }}</span>\n\n\t\t<!--\n\t\t\t`nb-select` is not a native <select>, so the label above cannot be\n\t\t\tassociated with it via `for`; the accessible name is set explicitly.\n\t\t-->\n\t\t<nb-select\n\t\t\tclass=\"chart-switcher__select\"\n\t\t\tsize=\"tiny\"\n\t\t\t[selected]=\"selectedKind()\"\n\t\t\t[attr.aria-label]=\"'DASHBOARD_PAGE.CHARTS.CHART_TYPE' | translate\"\n\t\t\t(selectedChange)=\"onKindChange($event)\"\n\t\t>\n\t\t\t@for (kind of chartKinds; track kind) {\n\t\t\t\t<nb-option [value]=\"kind\">{{ labelFor(kind) | translate }}</nb-option>\n\t\t\t}\n\t\t</nb-select>\n\t</div>\n\n\t<ga-employee-chart-card\n\t\tclass=\"chart-switcher__chart\"\n\t\t[type]=\"chartType()\"\n\t\t[data]=\"chartData()\"\n\t\t[options]=\"chartOptions()\"\n\t\t[loading]=\"loading()\"\n\t\t[error]=\"error()\"\n\t\t[requiresEmployee]=\"requiresEmployee()\"\n\t\t[empty]=\"isEmpty()\"\n\t\t(retry)=\"refresh()\"\n\t></ga-employee-chart-card>\n</div>\n", styles: [":host{display:block;height:100%;width:100%;min-width:0}.chart-switcher{display:grid;grid-template-rows:auto minmax(0,1fr);gap:.5rem;height:100%;min-height:0}.chart-switcher__toolbar{display:flex;align-items:center;justify-content:flex-end;gap:.5rem}.chart-switcher__label{color:var(--text-hint-color);font-size:var(--text-caption-font-size);white-space:nowrap}.chart-switcher__select{cursor:pointer;min-width:8.5rem;width:fit-content}.chart-switcher__chart{min-height:0}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"], dependencies: [{ kind: "ngmodule", type: NbSelectModule }, { kind: "component", type: i1.NbSelectComponent, selector: "nb-select", inputs: ["size", "status", "shape", "appearance", "optionsListClass", "optionsPanelClass", "optionsWidth", "outline", "filled", "hero", "disabled", "fullWidth", "placeholder", "compareWith", "selected", "multiple", "optionsOverlayOffset", "scrollStrategy"], outputs: ["selectedChange"] }, { kind: "component", type: i1.NbOptionComponent, selector: "nb-option", inputs: ["value", "disabled"], outputs: ["selectionChange"] }, { kind: "ngmodule", type: TranslateModule }, { kind: "component", type: EmployeeChartCardComponent, selector: "ga-employee-chart-card", inputs: ["type", "data", "options", "loading", "error", "requiresEmployee", "empty"], outputs: ["retry"] }, { kind: "pipe", type: i2.TranslatePipe, name: "translate" }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: EmployeeStatisticsChartWidgetComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-employee-statistics-chart-widget', standalone: true, imports: [NbSelectModule, TranslateModule, EmployeeChartCardComponent], providers: EMPLOYEE_CHART_WIDGET_PROVIDERS, changeDetection: ChangeDetectionStrategy.OnPush, template: "<div class=\"chart-switcher\">\n\t<div class=\"chart-switcher__toolbar\">\n\t\t<span class=\"chart-switcher__label\">{{ 'DASHBOARD_PAGE.CHARTS.CHART_TYPE' | translate }}</span>\n\n\t\t<!--\n\t\t\t`nb-select` is not a native <select>, so the label above cannot be\n\t\t\tassociated with it via `for`; the accessible name is set explicitly.\n\t\t-->\n\t\t<nb-select\n\t\t\tclass=\"chart-switcher__select\"\n\t\t\tsize=\"tiny\"\n\t\t\t[selected]=\"selectedKind()\"\n\t\t\t[attr.aria-label]=\"'DASHBOARD_PAGE.CHARTS.CHART_TYPE' | translate\"\n\t\t\t(selectedChange)=\"onKindChange($event)\"\n\t\t>\n\t\t\t@for (kind of chartKinds; track kind) {\n\t\t\t\t<nb-option [value]=\"kind\">{{ labelFor(kind) | translate }}</nb-option>\n\t\t\t}\n\t\t</nb-select>\n\t</div>\n\n\t<ga-employee-chart-card\n\t\tclass=\"chart-switcher__chart\"\n\t\t[type]=\"chartType()\"\n\t\t[data]=\"chartData()\"\n\t\t[options]=\"chartOptions()\"\n\t\t[loading]=\"loading()\"\n\t\t[error]=\"error()\"\n\t\t[requiresEmployee]=\"requiresEmployee()\"\n\t\t[empty]=\"isEmpty()\"\n\t\t(retry)=\"refresh()\"\n\t></ga-employee-chart-card>\n</div>\n", styles: [":host{display:block;height:100%;width:100%;min-width:0}.chart-switcher{display:grid;grid-template-rows:auto minmax(0,1fr);gap:.5rem;height:100%;min-height:0}.chart-switcher__toolbar{display:flex;align-items:center;justify-content:flex-end;gap:.5rem}.chart-switcher__label{color:var(--text-hint-color);font-size:var(--text-caption-font-size);white-space:nowrap}.chart-switcher__select{cursor:pointer;min-width:8.5rem;width:fit-content}.chart-switcher__chart{min-height:0}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"] }]
        }] });
//# sourceMappingURL=employee-statistics-chart-widget.component.js.map