import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { RecordsHistoryModule } from '../../records-history/records-history.module';
import { TeamsWidgetStateComponent } from '../teams/teams-widget-state.component';
import { BaseEmployeeHistoryWidgetComponent } from './base-employee-history-widget.component';
import { RECORDS_HISTORY_TYPE_CONFIG_KEY, toRecordsHistoryType } from './records-history.constants';
import * as i0 from "@angular/core";
import * as i1 from "../../records-history/records-history.component";
/**
 * The Human Resources "records history" table, inline on a canvas.
 *
 * `RecordsHistoryComponent` only ever existed as a modal: the HR page fetched
 * the rows and handed them to `NbDialogService`. This widget reuses that exact
 * component — same columns, same pagination, same empty message — and supplies
 * what the opener used to supply: the employee in scope and the rows for the
 * configured history.
 *
 * WHICH history it shows is a per-placement setting, so one canvas can carry an
 * income table next to an expenses one.
 */
export class RecordsHistoryWidgetComponent extends BaseEmployeeHistoryWidgetComponent {
    constructor() {
        super(...arguments);
        /**
         * The history this placement renders.
         *
         * A plain field, not a signal: the placement's configuration is injected once
         * when the host builds the widget and cannot change without re-creating it.
         * `toRecordsHistoryType` narrows an unusable persisted value back to the
         * default instead of rendering a table with no columns.
         */
        this.historyType = toRecordsHistoryType(this.getConfig(RECORDS_HISTORY_TYPE_CONFIG_KEY, null));
        /**
         * The rows to render.
         *
         * An empty array — never `null` — so the wrapped table can always be bound;
         * it renders its own "no records" message, which is why this widget declares
         * no empty state of its own.
         */
        this.records = computed(() => this.payload() ?? [], ...(ngDevMode ? [{ debugName: "records" }] : []));
    }
    /**
     * Fetches the configured history for the employee in scope.
     *
     * Shared with every other widget reading the same history for the same
     * employee and range — including the Profit History widget, which needs the
     * income and expenses histories.
     *
     * @param context - The context to query for.
     * @param employeeId - The employee in scope.
     * @returns The history rows.
     */
    fetch(context, employeeId) {
        return this.statisticsCache.getStatisticsHistory(context, employeeId, this.historyType);
    }
    /**
     * Drops this widget's cached history so a manual refresh really re-fetches.
     *
     * @param context - The context the rows were fetched for.
     * @param employeeId - The employee in scope.
     */
    invalidate(context, employeeId) {
        this.statisticsCache.invalidateHistory(context, employeeId, this.historyType);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: RecordsHistoryWidgetComponent, deps: null, target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: RecordsHistoryWidgetComponent, isStandalone: true, selector: "ga-accounting-records-history-widget", usesInheritance: true, ngImport: i0, template: "<!--\n\t`empty` carries the \"no employee selected\" case only: once an employee IS in\n\tscope the wrapped table renders its own \"no records\" message, so a second empty\n\tstate here would hide it.\n-->\n<ga-teams-widget-state\n\t[loading]=\"loading()\"\n\t[error]=\"error()\"\n\t[empty]=\"requiresEmployee()\"\n\t[skeletonRows]=\"5\"\n\temptyMessageKey=\"DASHBOARD_PAGE.BUILDER.WIDGETS.HR.NO_EMPLOYEE\"\n\t(retry)=\"refresh()\"\n>\n\t<ngx-records-history [type]=\"historyType\" [records]=\"records()\"></ngx-records-history>\n</ga-teams-widget-state>\n", styles: [":host{display:block;height:100%;width:100%;min-width:0;overflow:hidden}ngx-records-history{display:block;height:100%;width:100%;min-width:0;overflow:auto}\n"], dependencies: [{ kind: "ngmodule", type: RecordsHistoryModule }, { kind: "component", type: i1.RecordsHistoryComponent, selector: "ngx-records-history", inputs: ["type", "records"] }, { kind: "component", type: TeamsWidgetStateComponent, selector: "ga-teams-widget-state", inputs: ["loading", "error", "empty", "emptyMessageKey", "skeletonRows"], outputs: ["retry"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: RecordsHistoryWidgetComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-accounting-records-history-widget', standalone: true, imports: [RecordsHistoryModule, TeamsWidgetStateComponent], changeDetection: ChangeDetectionStrategy.OnPush, template: "<!--\n\t`empty` carries the \"no employee selected\" case only: once an employee IS in\n\tscope the wrapped table renders its own \"no records\" message, so a second empty\n\tstate here would hide it.\n-->\n<ga-teams-widget-state\n\t[loading]=\"loading()\"\n\t[error]=\"error()\"\n\t[empty]=\"requiresEmployee()\"\n\t[skeletonRows]=\"5\"\n\temptyMessageKey=\"DASHBOARD_PAGE.BUILDER.WIDGETS.HR.NO_EMPLOYEE\"\n\t(retry)=\"refresh()\"\n>\n\t<ngx-records-history [type]=\"historyType\" [records]=\"records()\"></ngx-records-history>\n</ga-teams-widget-state>\n", styles: [":host{display:block;height:100%;width:100%;min-width:0;overflow:hidden}ngx-records-history{display:block;height:100%;width:100%;min-width:0;overflow:auto}\n"] }]
        }] });
//# sourceMappingURL=records-history-widget.component.js.map