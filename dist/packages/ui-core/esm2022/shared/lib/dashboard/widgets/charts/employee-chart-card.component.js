import { ChangeDetectionStrategy, Component, ElementRef, NgZone, computed, inject, input, output, viewChild } from '@angular/core';
import { NbButtonModule, NbIconModule } from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';
import { BaseChartDirective } from 'ng2-charts';
import * as i0 from "@angular/core";
import * as i1 from "@nebular/theme";
import * as i2 from "@ngx-translate/core";
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
export class EmployeeChartCardComponent {
    constructor() {
        this._host = inject(ElementRef);
        this._zone = inject(NgZone);
        /** Chart.js chart type — `'bar'` or `'doughnut'` for the shipped widgets. */
        this.type = input('bar', ...(ngDevMode ? [{ debugName: "type" }] : []));
        /** Chart.js data object; `null` while the widget has nothing to draw. */
        this.data = input(null, ...(ngDevMode ? [{ debugName: "data" }] : []));
        /** Chart.js options, already themed by the widget. */
        this.options = input(null, ...(ngDevMode ? [{ debugName: "options" }] : []));
        /** Shows the skeleton instead of the chart. */
        this.loading = input(false, ...(ngDevMode ? [{ debugName: "loading" }] : []));
        /** Non-null switches the card into its error state. */
        this.error = input(null, ...(ngDevMode ? [{ debugName: "error" }] : []));
        /**
         * True when the widget cannot query anything until the user picks a member.
         *
         * Rendered as an actionable hint rather than an empty chart, because "no bars"
         * and "no member selected" are two very different answers.
         */
        this.requiresEmployee = input(false, ...(ngDevMode ? [{ debugName: "requiresEmployee" }] : []));
        /** True when the query succeeded but returned no months. */
        this.empty = input(false, ...(ngDevMode ? [{ debugName: "empty" }] : []));
        /** Emitted when the user asks for a re-fetch from the error state. */
        this.retry = output();
        /**
         * Chart data, never `null`.
         *
         * `BaseChartDirective` assigns whatever it is given straight onto the Chart.js
         * instance, and a `null` there throws inside the library rather than in our
         * template — so the empty structure is substituted here.
         */
        this.chartData = computed(() => this.data() ?? { labels: [], datasets: [] }, ...(ngDevMode ? [{ debugName: "chartData" }] : []));
        /** Chart options, normalized to `undefined` so Chart.js applies its defaults. */
        this.chartOptions = computed(() => this.options() ?? undefined, ...(ngDevMode ? [{ debugName: "chartOptions" }] : []));
        /** The rendered chart, absent in every state other than "ready". */
        this.chartDirective = viewChild(BaseChartDirective, ...(ngDevMode ? [{ debugName: "chartDirective" }] : []));
        /** Watches the widget's own box, see {@link scheduleResize}. */
        this.resizeObserver = null;
        /** Pending animation frame id, `0` when none is scheduled. */
        this.resizeFrame = 0;
    }
    /**
     * Starts observing the host box so the chart follows its grid cell.
     *
     * Chart.js only re-measures when its own container resizes, and on a dashboard
     * canvas the widget is resized by a CSS grid whose track sizes change without
     * any layout event the chart can see (another widget dropped next to it, the
     * width menu picking 4 → 8 columns, the browser window changing). Without this
     * the canvas keeps its first measured size and the chart renders stretched.
     */
    ngAfterViewInit() {
        if (typeof ResizeObserver === 'undefined') {
            return;
        }
        // Outside Angular: the observer fires on every animation frame of a drag,
        // and each notification would otherwise run a full change detection pass.
        this._zone.runOutsideAngular(() => {
            this.resizeObserver = new ResizeObserver(() => this.scheduleResize());
            this.resizeObserver.observe(this._host.nativeElement);
        });
    }
    /** Stops the observer and drops any pending frame. */
    ngOnDestroy() {
        if (this.resizeFrame) {
            cancelAnimationFrame(this.resizeFrame);
            this.resizeFrame = 0;
        }
        this.resizeObserver?.disconnect();
        this.resizeObserver = null;
    }
    /**
     * Coalesces a burst of resize notifications into one `chart.resize()`.
     *
     * Resizing a Chart.js chart re-renders it synchronously, so calling it per
     * observer notification during a drag would drop frames.
     */
    scheduleResize() {
        if (this.resizeFrame) {
            cancelAnimationFrame(this.resizeFrame);
        }
        this.resizeFrame = requestAnimationFrame(() => {
            this.resizeFrame = 0;
            // The chart is destroyed in every non-"ready" state, so this is a
            // no-op while the widget shows a skeleton or an error.
            this.chartDirective()?.chart?.resize();
        });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: EmployeeChartCardComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: EmployeeChartCardComponent, isStandalone: true, selector: "ga-employee-chart-card", inputs: { type: { classPropertyName: "type", publicName: "type", isSignal: true, isRequired: false, transformFunction: null }, data: { classPropertyName: "data", publicName: "data", isSignal: true, isRequired: false, transformFunction: null }, options: { classPropertyName: "options", publicName: "options", isSignal: true, isRequired: false, transformFunction: null }, loading: { classPropertyName: "loading", publicName: "loading", isSignal: true, isRequired: false, transformFunction: null }, error: { classPropertyName: "error", publicName: "error", isSignal: true, isRequired: false, transformFunction: null }, requiresEmployee: { classPropertyName: "requiresEmployee", publicName: "requiresEmployee", isSignal: true, isRequired: false, transformFunction: null }, empty: { classPropertyName: "empty", publicName: "empty", isSignal: true, isRequired: false, transformFunction: null } }, outputs: { retry: "retry" }, viewQueries: [{ propertyName: "chartDirective", first: true, predicate: BaseChartDirective, descendants: true, isSignal: true }], ngImport: i0, template: "@if (error()) {\n\t<div class=\"chart-state is-error\" role=\"alert\">\n\t\t<nb-icon icon=\"alert-triangle-outline\" status=\"danger\"></nb-icon>\n\t\t<!-- The visible label is generic and the message is only in `title`, which\n\t\t\tneeds a hover. `aria-label` gives screen-reader, keyboard and touch users\n\t\t\tthe same detail. -->\n\t\t<span\n\t\t\tclass=\"chart-state__text\"\n\t\t\t[title]=\"error()\"\n\t\t\t[attr.aria-label]=\"('DASHBOARD_PAGE.BUILDER.WIDGETS.ERROR' | translate) + ': ' + error()\"\n\t\t>\n\t\t\t{{ 'DASHBOARD_PAGE.BUILDER.WIDGETS.ERROR' | translate }}\n\t\t</span>\n\t\t<button nbButton ghost size=\"tiny\" status=\"basic\" type=\"button\" (click)=\"retry.emit()\">\n\t\t\t{{ 'DASHBOARD_PAGE.BUILDER.WIDGETS.RETRY' | translate }}\n\t\t</button>\n\t</div>\n} @else if (loading()) {\n\t<!-- <output> carries an implicit `status` live region, so no explicit role. -->\n\t<output\n\t\tclass=\"chart-skeleton\"\n\t\taria-busy=\"true\"\n\t\t[attr.aria-label]=\"'DASHBOARD_PAGE.BUILDER.WIDGETS.LOADING' | translate\"\n\t>\n\t\t<!-- `span`, not `div`: `<output>` only accepts phrasing content. -->\n\t\t<span class=\"skeleton-line skeleton-legend\"></span>\n\t\t<span class=\"skeleton-plot\"></span>\n\t</output>\n} @else if (requiresEmployee()) {\n\t<!-- `aria-live` so the switch out of the loading state is announced: only the\n\t\terror branch (`role=\"alert\"`) and the skeleton (`<output>`) are otherwise,\n\t\tand these two branches would change silently. -->\n\t<div class=\"chart-state\" aria-live=\"polite\">\n\t\t<nb-icon icon=\"person-outline\"></nb-icon>\n\t\t<!-- Shared with the HR KPI widgets: same condition, same wording. -->\n\t\t<span class=\"chart-state__text\">\n\t\t\t{{ 'DASHBOARD_PAGE.BUILDER.WIDGETS.HR.NO_EMPLOYEE' | translate }}\n\t\t</span>\n\t\t<span class=\"chart-state__hint\">\n\t\t\t{{ 'DASHBOARD_PAGE.BUILDER.WIDGETS.HR.NO_EMPLOYEE_HINT' | translate }}\n\t\t</span>\n\t</div>\n} @else if (empty()) {\n\t<div class=\"chart-state\" aria-live=\"polite\">\n\t\t<nb-icon icon=\"info-outline\"></nb-icon>\n\t\t<span class=\"chart-state__text\">\n\t\t\t{{ 'DASHBOARD_PAGE.CHARTS.NO_MONTH_DATA' | translate }}\n\t\t</span>\n\t</div>\n} @else {\n\t<!--\n\t\tChart.js sizes a responsive canvas from its PARENT box, so this wrapper must\n\t\tbe the element that owns the height (and be `position: relative`). The canvas\n\t\titself carries no inline size on purpose.\n\t-->\n\t<div class=\"chart-container\">\n\t\t<canvas baseChart [type]=\"type()\" [data]=\"chartData()\" [options]=\"chartOptions()\"></canvas>\n\t</div>\n}\n", styles: [":host{display:flex;flex-direction:column;height:100%;width:100%;min-width:0;min-height:0}.chart-container{position:relative;flex:1 1 0;width:100%;min-width:0;min-height:6rem}.chart-container canvas{display:block}.chart-state{display:flex;flex:1 1 auto;flex-direction:column;align-items:center;justify-content:center;gap:.25rem;min-height:0;padding:.5rem;text-align:center;color:var(--text-hint-color)}.chart-state nb-icon{height:20px;width:20px;font-size:20px}.chart-state__text{font-size:var(--text-caption-font-size);max-width:100%;overflow:hidden;overflow-wrap:anywhere}.chart-state__hint{font-size:var(--text-caption-2-font-size);max-width:22rem}.chart-state.is-error nb-icon{color:var(--color-danger-default)}.chart-skeleton{display:flex;flex:1 1 auto;flex-direction:column;gap:.75rem;min-height:0}.chart-skeleton .skeleton-line,.chart-skeleton .skeleton-plot{border-radius:var(--border-radius);background:linear-gradient(90deg,var(--background-basic-color-2) 25%,var(--background-basic-color-3) 37%,var(--background-basic-color-2) 63%);background-size:400% 100%;animation:ga-employee-chart-skeleton 1.4s ease infinite}.chart-skeleton .skeleton-legend{flex:0 0 auto;height:12px;width:60%;align-self:center}.chart-skeleton .skeleton-plot{flex:1 1 auto;min-height:4rem;width:100%}@media(prefers-reduced-motion:reduce){.chart-skeleton .skeleton-line,.chart-skeleton .skeleton-plot{animation:none}}@keyframes ga-employee-chart-skeleton{0%{background-position:100% 50%}to{background-position:0 50%}}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"], dependencies: [{ kind: "ngmodule", type: NbButtonModule }, { kind: "component", type: i1.NbButtonComponent, selector: "button[nbButton],a[nbButton],input[type=\"button\"][nbButton],input[type=\"submit\"][nbButton]", inputs: ["hero"] }, { kind: "ngmodule", type: NbIconModule }, { kind: "component", type: i1.NbIconComponent, selector: "nb-icon", inputs: ["icon", "pack", "options", "status", "config"] }, { kind: "ngmodule", type: TranslateModule }, { kind: "directive", type: BaseChartDirective, selector: "canvas[baseChart]", inputs: ["type", "legend", "data", "options", "plugins", "labels", "datasets"], outputs: ["chartClick", "chartHover"], exportAs: ["base-chart"] }, { kind: "pipe", type: i2.TranslatePipe, name: "translate" }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: EmployeeChartCardComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-employee-chart-card', standalone: true, imports: [NbButtonModule, NbIconModule, TranslateModule, BaseChartDirective], changeDetection: ChangeDetectionStrategy.OnPush, template: "@if (error()) {\n\t<div class=\"chart-state is-error\" role=\"alert\">\n\t\t<nb-icon icon=\"alert-triangle-outline\" status=\"danger\"></nb-icon>\n\t\t<!-- The visible label is generic and the message is only in `title`, which\n\t\t\tneeds a hover. `aria-label` gives screen-reader, keyboard and touch users\n\t\t\tthe same detail. -->\n\t\t<span\n\t\t\tclass=\"chart-state__text\"\n\t\t\t[title]=\"error()\"\n\t\t\t[attr.aria-label]=\"('DASHBOARD_PAGE.BUILDER.WIDGETS.ERROR' | translate) + ': ' + error()\"\n\t\t>\n\t\t\t{{ 'DASHBOARD_PAGE.BUILDER.WIDGETS.ERROR' | translate }}\n\t\t</span>\n\t\t<button nbButton ghost size=\"tiny\" status=\"basic\" type=\"button\" (click)=\"retry.emit()\">\n\t\t\t{{ 'DASHBOARD_PAGE.BUILDER.WIDGETS.RETRY' | translate }}\n\t\t</button>\n\t</div>\n} @else if (loading()) {\n\t<!-- <output> carries an implicit `status` live region, so no explicit role. -->\n\t<output\n\t\tclass=\"chart-skeleton\"\n\t\taria-busy=\"true\"\n\t\t[attr.aria-label]=\"'DASHBOARD_PAGE.BUILDER.WIDGETS.LOADING' | translate\"\n\t>\n\t\t<!-- `span`, not `div`: `<output>` only accepts phrasing content. -->\n\t\t<span class=\"skeleton-line skeleton-legend\"></span>\n\t\t<span class=\"skeleton-plot\"></span>\n\t</output>\n} @else if (requiresEmployee()) {\n\t<!-- `aria-live` so the switch out of the loading state is announced: only the\n\t\terror branch (`role=\"alert\"`) and the skeleton (`<output>`) are otherwise,\n\t\tand these two branches would change silently. -->\n\t<div class=\"chart-state\" aria-live=\"polite\">\n\t\t<nb-icon icon=\"person-outline\"></nb-icon>\n\t\t<!-- Shared with the HR KPI widgets: same condition, same wording. -->\n\t\t<span class=\"chart-state__text\">\n\t\t\t{{ 'DASHBOARD_PAGE.BUILDER.WIDGETS.HR.NO_EMPLOYEE' | translate }}\n\t\t</span>\n\t\t<span class=\"chart-state__hint\">\n\t\t\t{{ 'DASHBOARD_PAGE.BUILDER.WIDGETS.HR.NO_EMPLOYEE_HINT' | translate }}\n\t\t</span>\n\t</div>\n} @else if (empty()) {\n\t<div class=\"chart-state\" aria-live=\"polite\">\n\t\t<nb-icon icon=\"info-outline\"></nb-icon>\n\t\t<span class=\"chart-state__text\">\n\t\t\t{{ 'DASHBOARD_PAGE.CHARTS.NO_MONTH_DATA' | translate }}\n\t\t</span>\n\t</div>\n} @else {\n\t<!--\n\t\tChart.js sizes a responsive canvas from its PARENT box, so this wrapper must\n\t\tbe the element that owns the height (and be `position: relative`). The canvas\n\t\titself carries no inline size on purpose.\n\t-->\n\t<div class=\"chart-container\">\n\t\t<canvas baseChart [type]=\"type()\" [data]=\"chartData()\" [options]=\"chartOptions()\"></canvas>\n\t</div>\n}\n", styles: [":host{display:flex;flex-direction:column;height:100%;width:100%;min-width:0;min-height:0}.chart-container{position:relative;flex:1 1 0;width:100%;min-width:0;min-height:6rem}.chart-container canvas{display:block}.chart-state{display:flex;flex:1 1 auto;flex-direction:column;align-items:center;justify-content:center;gap:.25rem;min-height:0;padding:.5rem;text-align:center;color:var(--text-hint-color)}.chart-state nb-icon{height:20px;width:20px;font-size:20px}.chart-state__text{font-size:var(--text-caption-font-size);max-width:100%;overflow:hidden;overflow-wrap:anywhere}.chart-state__hint{font-size:var(--text-caption-2-font-size);max-width:22rem}.chart-state.is-error nb-icon{color:var(--color-danger-default)}.chart-skeleton{display:flex;flex:1 1 auto;flex-direction:column;gap:.75rem;min-height:0}.chart-skeleton .skeleton-line,.chart-skeleton .skeleton-plot{border-radius:var(--border-radius);background:linear-gradient(90deg,var(--background-basic-color-2) 25%,var(--background-basic-color-3) 37%,var(--background-basic-color-2) 63%);background-size:400% 100%;animation:ga-employee-chart-skeleton 1.4s ease infinite}.chart-skeleton .skeleton-legend{flex:0 0 auto;height:12px;width:60%;align-self:center}.chart-skeleton .skeleton-plot{flex:1 1 auto;min-height:4rem;width:100%}@media(prefers-reduced-motion:reduce){.chart-skeleton .skeleton-line,.chart-skeleton .skeleton-plot{animation:none}}@keyframes ga-employee-chart-skeleton{0%{background-position:100% 50%}to{background-position:0 50%}}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"] }]
        }], propDecorators: { type: [{ type: i0.Input, args: [{ isSignal: true, alias: "type", required: false }] }], data: [{ type: i0.Input, args: [{ isSignal: true, alias: "data", required: false }] }], options: [{ type: i0.Input, args: [{ isSignal: true, alias: "options", required: false }] }], loading: [{ type: i0.Input, args: [{ isSignal: true, alias: "loading", required: false }] }], error: [{ type: i0.Input, args: [{ isSignal: true, alias: "error", required: false }] }], requiresEmployee: [{ type: i0.Input, args: [{ isSignal: true, alias: "requiresEmployee", required: false }] }], empty: [{ type: i0.Input, args: [{ isSignal: true, alias: "empty", required: false }] }], retry: [{ type: i0.Output, args: ["retry"] }], chartDirective: [{ type: i0.ViewChild, args: [i0.forwardRef(() => BaseChartDirective), { isSignal: true }] }] } });
//# sourceMappingURL=employee-chart-card.component.js.map