import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { BaseEmployeeChartWidgetComponent, EMPLOYEE_CHART_WIDGET_PROVIDERS } from './base-employee-chart-widget.component';
import { EmployeeChartCardComponent } from './employee-chart-card.component';
import { EmployeeChartKind } from './employee-chart.utils';
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
export class EmployeeDoughnutChartWidgetComponent extends BaseEmployeeChartWidgetComponent {
    constructor() {
        super(...arguments);
        /** Chart.js type of this widget's single rendering. */
        this.chartType = computed(() => this.chartTypeFor(EmployeeChartKind.DOUGHNUT), ...(ngDevMode ? [{ debugName: "chartType" }] : []));
        /** Doughnut slices for the current payload. */
        this.chartData = computed(() => this.chartDataFor(EmployeeChartKind.DOUGHNUT), ...(ngDevMode ? [{ debugName: "chartData" }] : []));
        /** Doughnut options, themed with the active palette. */
        this.chartOptions = computed(() => this.chartOptionsFor(EmployeeChartKind.DOUGHNUT), ...(ngDevMode ? [{ debugName: "chartOptions" }] : []));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: EmployeeDoughnutChartWidgetComponent, deps: null, target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: EmployeeDoughnutChartWidgetComponent, isStandalone: true, selector: "ga-employee-doughnut-chart-widget", providers: EMPLOYEE_CHART_WIDGET_PROVIDERS, usesInheritance: true, ngImport: i0, template: "<ga-employee-chart-card\n\t[type]=\"chartType()\"\n\t[data]=\"chartData()\"\n\t[options]=\"chartOptions()\"\n\t[loading]=\"loading()\"\n\t[error]=\"error()\"\n\t[requiresEmployee]=\"requiresEmployee()\"\n\t[empty]=\"isEmpty()\"\n\t(retry)=\"refresh()\"\n></ga-employee-chart-card>\n", styles: ["@charset \"UTF-8\";:host{display:block;height:100%;width:100%;min-width:0}\n"], dependencies: [{ kind: "component", type: EmployeeChartCardComponent, selector: "ga-employee-chart-card", inputs: ["type", "data", "options", "loading", "error", "requiresEmployee", "empty"], outputs: ["retry"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: EmployeeDoughnutChartWidgetComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-employee-doughnut-chart-widget', standalone: true, imports: [EmployeeChartCardComponent], providers: EMPLOYEE_CHART_WIDGET_PROVIDERS, changeDetection: ChangeDetectionStrategy.OnPush, template: "<ga-employee-chart-card\n\t[type]=\"chartType()\"\n\t[data]=\"chartData()\"\n\t[options]=\"chartOptions()\"\n\t[loading]=\"loading()\"\n\t[error]=\"error()\"\n\t[requiresEmployee]=\"requiresEmployee()\"\n\t[empty]=\"isEmpty()\"\n\t(retry)=\"refresh()\"\n></ga-employee-chart-card>\n", styles: ["@charset \"UTF-8\";:host{display:block;height:100%;width:100%;min-width:0}\n"] }]
        }] });
//# sourceMappingURL=employee-doughnut-chart-widget.component.js.map