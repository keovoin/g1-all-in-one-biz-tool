import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from '../../../components/components.module';
import { TeamsWidgetStateComponent } from '../teams/teams-widget-state.component';
import { BaseAccountingWidgetComponent } from './base-accounting-widget.component';
import * as i0 from "@angular/core";
import * as i1 from "../../../components/avatar/avatar.component";
import * as i2 from "@ngx-translate/core";
/**
 * Per-employee income / expenses / profit (and bonus) breakdown — the table at
 * the bottom of the Accounting page, on a canvas.
 *
 * It projects the SAME `/employee-statistics/aggregate` response as the four
 * Accounting KPIs and the cash-flow chart, so adding it to a canvas that already
 * shows them costs no extra request (see `AccountingStatisticsCacheService`).
 *
 * Two deliberate differences from the page's table:
 *
 * 1. The row is not a click target. On the page a click selects the employee and
 *    navigates to the HR dashboard; a widget cannot navigate the user away from
 *    their own dashboard, and silently rewriting the canvas-wide employee
 *    selection from a table row would re-scope every other widget on the canvas.
 *    The avatar keeps its own (existing) link to the employee's profile.
 * 2. The bonus column follows the organization's bonus type exactly like the page
 *    — no bonus scheme, no column, rather than a permanent zero.
 */
export class EmployeeStatisticsWidgetComponent extends BaseAccountingWidgetComponent {
    constructor() {
        super(...arguments);
        /** One row per employee with bookings in the range; empty before the first fetch. */
        this.rows = computed(() => this.statistics()?.employees ?? [], ...(ngDevMode ? [{ debugName: "rows" }] : []));
        /** True when the query succeeded but nobody in the organization has figures. */
        this.isEmpty = computed(() => this.rows().length === 0, ...(ngDevMode ? [{ debugName: "isEmpty" }] : []));
    }
    /**
     * Money figure of one row, formatted with the organization's currency and
     * symbol position.
     *
     * Exposed for the template rather than piped there so the widget does not have
     * to provide `CurrencyPipe`/`CurrencyPositionPipe` — the base class already
     * owns both, precisely because a canvas widget is built by the host's injector.
     *
     * @param amount - The raw amount of the row, possibly missing.
     * @returns The formatted figure.
     */
    format(amount) {
        return this.formatCurrency(amount ?? 0);
    }
    /**
     * Stable identity of a row for `@for`.
     *
     * Falls back to the index because the aggregate payload can carry a row whose
     * employee was deleted, and two such rows would otherwise collide on
     * `undefined` and make Angular re-create the list on every refresh.
     *
     * @param index - Position of the row.
     * @param row - The row being rendered.
     * @returns A key unique within the list.
     */
    trackRow(index, row) {
        return row?.employee?.id ?? `index:${index}`;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: EmployeeStatisticsWidgetComponent, deps: null, target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: EmployeeStatisticsWidgetComponent, isStandalone: true, selector: "ga-accounting-employee-statistics-widget", usesInheritance: true, ngImport: i0, template: "<ga-teams-widget-state\n\t[loading]=\"loading()\"\n\t[error]=\"error()\"\n\t[empty]=\"isEmpty()\"\n\t[skeletonRows]=\"4\"\n\temptyMessageKey=\"DASHBOARD_PAGE.BUILDER.WIDGETS.ACCOUNTING_EMPLOYEE_STATISTICS.EMPTY\"\n\t(retry)=\"refresh()\"\n>\n\t<!--\n\t\tA real <table>, unlike the page's stack of <div class=\"row\">: the widget is\n\t\tnarrow and scrollable, so screen readers need the column headers to be\n\t\tassociated with the cells rather than sitting in a decorative header strip.\n\t-->\n\t<div class=\"employee-statistics\">\n\t\t<table class=\"employee-statistics-table\">\n\t\t\t<caption class=\"visually-hidden\">\n\t\t\t\t{{\n\t\t\t\t\t'DASHBOARD_PAGE.BUILDER.WIDGETS.ACCOUNTING_EMPLOYEE_STATISTICS.TITLE' | translate\n\t\t\t\t}}\n\t\t\t</caption>\n\t\t\t<thead>\n\t\t\t\t<tr>\n\t\t\t\t\t<th scope=\"col\">{{ 'DASHBOARD_PAGE.DEVELOPER.EMPLOYEES' | translate }}</th>\n\t\t\t\t\t<th scope=\"col\" class=\"is-numeric\">\n\t\t\t\t\t\t{{ 'DASHBOARD_PAGE.DEVELOPER.TOTAL_INCOME' | translate }}\n\t\t\t\t\t</th>\n\t\t\t\t\t<th scope=\"col\" class=\"is-numeric\">\n\t\t\t\t\t\t{{ 'DASHBOARD_PAGE.DEVELOPER.TOTAL_EXPENSES' | translate }}\n\t\t\t\t\t</th>\n\t\t\t\t\t<th scope=\"col\" class=\"is-numeric\">{{ 'DASHBOARD_PAGE.DEVELOPER.PROFIT' | translate }}</th>\n\t\t\t\t\t@if (hasBonusType()) {\n\t\t\t\t\t\t<th scope=\"col\" class=\"is-numeric\">{{ 'DASHBOARD_PAGE.DEVELOPER.BONUS' | translate }}</th>\n\t\t\t\t\t}\n\t\t\t\t</tr>\n\t\t\t</thead>\n\t\t\t<tbody>\n\t\t\t\t@for (row of rows(); track trackRow($index, row)) {\n\t\t\t\t\t<tr>\n\t\t\t\t\t\t<td class=\"is-employee\">\n\t\t\t\t\t\t\t<ngx-avatar\n\t\t\t\t\t\t\t\tclass=\"report-table\"\n\t\t\t\t\t\t\t\t[name]=\"row?.employee?.user?.name\"\n\t\t\t\t\t\t\t\t[src]=\"row?.employee?.user?.imageUrl\"\n\t\t\t\t\t\t\t\t[id]=\"row?.employee?.id\"\n\t\t\t\t\t\t\t\t[employee]=\"row?.employee\"\n\t\t\t\t\t\t\t></ngx-avatar>\n\t\t\t\t\t\t</td>\n\t\t\t\t\t\t<td class=\"is-numeric\">{{ format(row?.income) }}</td>\n\t\t\t\t\t\t<td class=\"is-numeric\">{{ format(row?.expense) }}</td>\n\t\t\t\t\t\t<td class=\"is-numeric\">{{ format(row?.profit) }}</td>\n\t\t\t\t\t\t@if (hasBonusType()) {\n\t\t\t\t\t\t\t<td class=\"is-numeric\">{{ format(row?.bonus) }}</td>\n\t\t\t\t\t\t}\n\t\t\t\t\t</tr>\n\t\t\t\t}\n\t\t\t</tbody>\n\t\t</table>\n\t</div>\n</ga-teams-widget-state>\n", styles: [":host{display:block;height:100%;width:100%;min-width:0;overflow:hidden}.employee-statistics{height:100%;width:100%;overflow:auto}.employee-statistics-table{width:100%;border-collapse:collapse;font-size:var(--text-caption-font-size);color:var(--text-basic-color)}.employee-statistics-table th,.employee-statistics-table td{padding:.375rem .5rem;text-align:left;white-space:nowrap}.employee-statistics-table th{position:sticky;top:0;z-index:1;background-color:var(--card-background-color);color:var(--text-hint-color);font-weight:var(--text-subtitle-2-font-weight)}.employee-statistics-table tbody tr{border-top:1px solid var(--border-basic-color-3)}.employee-statistics-table .is-numeric{text-align:right;font-variant-numeric:tabular-nums}.employee-statistics-table .is-employee{width:100%;max-width:0;overflow:hidden;text-overflow:ellipsis}.visually-hidden{position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;clip-path:inset(50%);white-space:nowrap;border:0}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"], dependencies: [{ kind: "ngmodule", type: TranslateModule }, { kind: "ngmodule", type: ComponentsModule }, { kind: "component", type: i1.AvatarComponent, selector: "ngx-avatar", inputs: ["size", "src", "appendCaption", "caption", "id", "isOption", "employee", "value", "name"] }, { kind: "component", type: TeamsWidgetStateComponent, selector: "ga-teams-widget-state", inputs: ["loading", "error", "empty", "emptyMessageKey", "skeletonRows"], outputs: ["retry"] }, { kind: "pipe", type: i2.TranslatePipe, name: "translate" }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: EmployeeStatisticsWidgetComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-accounting-employee-statistics-widget', standalone: true, imports: [TranslateModule, ComponentsModule, TeamsWidgetStateComponent], changeDetection: ChangeDetectionStrategy.OnPush, template: "<ga-teams-widget-state\n\t[loading]=\"loading()\"\n\t[error]=\"error()\"\n\t[empty]=\"isEmpty()\"\n\t[skeletonRows]=\"4\"\n\temptyMessageKey=\"DASHBOARD_PAGE.BUILDER.WIDGETS.ACCOUNTING_EMPLOYEE_STATISTICS.EMPTY\"\n\t(retry)=\"refresh()\"\n>\n\t<!--\n\t\tA real <table>, unlike the page's stack of <div class=\"row\">: the widget is\n\t\tnarrow and scrollable, so screen readers need the column headers to be\n\t\tassociated with the cells rather than sitting in a decorative header strip.\n\t-->\n\t<div class=\"employee-statistics\">\n\t\t<table class=\"employee-statistics-table\">\n\t\t\t<caption class=\"visually-hidden\">\n\t\t\t\t{{\n\t\t\t\t\t'DASHBOARD_PAGE.BUILDER.WIDGETS.ACCOUNTING_EMPLOYEE_STATISTICS.TITLE' | translate\n\t\t\t\t}}\n\t\t\t</caption>\n\t\t\t<thead>\n\t\t\t\t<tr>\n\t\t\t\t\t<th scope=\"col\">{{ 'DASHBOARD_PAGE.DEVELOPER.EMPLOYEES' | translate }}</th>\n\t\t\t\t\t<th scope=\"col\" class=\"is-numeric\">\n\t\t\t\t\t\t{{ 'DASHBOARD_PAGE.DEVELOPER.TOTAL_INCOME' | translate }}\n\t\t\t\t\t</th>\n\t\t\t\t\t<th scope=\"col\" class=\"is-numeric\">\n\t\t\t\t\t\t{{ 'DASHBOARD_PAGE.DEVELOPER.TOTAL_EXPENSES' | translate }}\n\t\t\t\t\t</th>\n\t\t\t\t\t<th scope=\"col\" class=\"is-numeric\">{{ 'DASHBOARD_PAGE.DEVELOPER.PROFIT' | translate }}</th>\n\t\t\t\t\t@if (hasBonusType()) {\n\t\t\t\t\t\t<th scope=\"col\" class=\"is-numeric\">{{ 'DASHBOARD_PAGE.DEVELOPER.BONUS' | translate }}</th>\n\t\t\t\t\t}\n\t\t\t\t</tr>\n\t\t\t</thead>\n\t\t\t<tbody>\n\t\t\t\t@for (row of rows(); track trackRow($index, row)) {\n\t\t\t\t\t<tr>\n\t\t\t\t\t\t<td class=\"is-employee\">\n\t\t\t\t\t\t\t<ngx-avatar\n\t\t\t\t\t\t\t\tclass=\"report-table\"\n\t\t\t\t\t\t\t\t[name]=\"row?.employee?.user?.name\"\n\t\t\t\t\t\t\t\t[src]=\"row?.employee?.user?.imageUrl\"\n\t\t\t\t\t\t\t\t[id]=\"row?.employee?.id\"\n\t\t\t\t\t\t\t\t[employee]=\"row?.employee\"\n\t\t\t\t\t\t\t></ngx-avatar>\n\t\t\t\t\t\t</td>\n\t\t\t\t\t\t<td class=\"is-numeric\">{{ format(row?.income) }}</td>\n\t\t\t\t\t\t<td class=\"is-numeric\">{{ format(row?.expense) }}</td>\n\t\t\t\t\t\t<td class=\"is-numeric\">{{ format(row?.profit) }}</td>\n\t\t\t\t\t\t@if (hasBonusType()) {\n\t\t\t\t\t\t\t<td class=\"is-numeric\">{{ format(row?.bonus) }}</td>\n\t\t\t\t\t\t}\n\t\t\t\t\t</tr>\n\t\t\t\t}\n\t\t\t</tbody>\n\t\t</table>\n\t</div>\n</ga-teams-widget-state>\n", styles: [":host{display:block;height:100%;width:100%;min-width:0;overflow:hidden}.employee-statistics{height:100%;width:100%;overflow:auto}.employee-statistics-table{width:100%;border-collapse:collapse;font-size:var(--text-caption-font-size);color:var(--text-basic-color)}.employee-statistics-table th,.employee-statistics-table td{padding:.375rem .5rem;text-align:left;white-space:nowrap}.employee-statistics-table th{position:sticky;top:0;z-index:1;background-color:var(--card-background-color);color:var(--text-hint-color);font-weight:var(--text-subtitle-2-font-weight)}.employee-statistics-table tbody tr{border-top:1px solid var(--border-basic-color-3)}.employee-statistics-table .is-numeric{text-align:right;font-variant-numeric:tabular-nums}.employee-statistics-table .is-employee{width:100%;max-width:0;overflow:hidden;text-overflow:ellipsis}.visually-hidden{position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;clip-path:inset(50%);white-space:nowrap;border:0}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"] }]
        }] });
//# sourceMappingURL=employee-statistics-widget.component.js.map