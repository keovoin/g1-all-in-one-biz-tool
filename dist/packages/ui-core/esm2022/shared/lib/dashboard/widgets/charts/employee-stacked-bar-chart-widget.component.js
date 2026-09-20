import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { BaseEmployeeChartWidgetComponent, EMPLOYEE_CHART_WIDGET_PROVIDERS } from './base-employee-chart-widget.component';
import { EmployeeChartCardComponent } from './employee-chart-card.component';
import { EmployeeChartKind } from './employee-chart.utils';
import * as i0 from "@angular/core";
/**
 * Chart widget: how each month's expenses, bonus and profit divide that month's
 * revenue, as a stacked horizontal bar.
 *
 * The composition view of the HR dashboard's chart switcher. Each month's values
 * are normalized by its own `(expense + profit + bonus) / income` proportion, so
 * a strong month and a weak one are directly comparable.
 */
export class EmployeeStackedBarChartWidgetComponent extends BaseEmployeeChartWidgetComponent {
    constructor() {
        super(...arguments);
        /** Chart.js type of this widget's single rendering. */
        this.chartType = computed(() => this.chartTypeFor(EmployeeChartKind.STACKED_BAR), ...(ngDevMode ? [{ debugName: "chartType" }] : []));
        /** Stacked bar datasets for the current payload. */
        this.chartData = computed(() => this.chartDataFor(EmployeeChartKind.STACKED_BAR), ...(ngDevMode ? [{ debugName: "chartData" }] : []));
        /** Stacked bar options, themed with the active palette. */
        this.chartOptions = computed(() => this.chartOptionsFor(EmployeeChartKind.STACKED_BAR), ...(ngDevMode ? [{ debugName: "chartOptions" }] : []));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: EmployeeStackedBarChartWidgetComponent, deps: null, target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: EmployeeStackedBarChartWidgetComponent, isStandalone: true, selector: "ga-employee-stacked-bar-chart-widget", providers: EMPLOYEE_CHART_WIDGET_PROVIDERS, usesInheritance: true, ngImport: i0, template: "<ga-employee-chart-card\n\t[type]=\"chartType()\"\n\t[data]=\"chartData()\"\n\t[options]=\"chartOptions()\"\n\t[loading]=\"loading()\"\n\t[error]=\"error()\"\n\t[requiresEmployee]=\"requiresEmployee()\"\n\t[empty]=\"isEmpty()\"\n\t(retry)=\"refresh()\"\n></ga-employee-chart-card>\n", styles: ["@charset \"UTF-8\";:host{display:block;height:100%;width:100%;min-width:0}\n"], dependencies: [{ kind: "component", type: EmployeeChartCardComponent, selector: "ga-employee-chart-card", inputs: ["type", "data", "options", "loading", "error", "requiresEmployee", "empty"], outputs: ["retry"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: EmployeeStackedBarChartWidgetComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-employee-stacked-bar-chart-widget', standalone: true, imports: [EmployeeChartCardComponent], providers: EMPLOYEE_CHART_WIDGET_PROVIDERS, changeDetection: ChangeDetectionStrategy.OnPush, template: "<ga-employee-chart-card\n\t[type]=\"chartType()\"\n\t[data]=\"chartData()\"\n\t[options]=\"chartOptions()\"\n\t[loading]=\"loading()\"\n\t[error]=\"error()\"\n\t[requiresEmployee]=\"requiresEmployee()\"\n\t[empty]=\"isEmpty()\"\n\t(retry)=\"refresh()\"\n></ga-employee-chart-card>\n", styles: ["@charset \"UTF-8\";:host{display:block;height:100%;width:100%;min-width:0}\n"] }]
        }] });
//# sourceMappingURL=employee-stacked-bar-chart-widget.component.js.map