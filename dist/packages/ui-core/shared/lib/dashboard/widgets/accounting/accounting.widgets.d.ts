import { WidgetRegistryConfig } from '@gauzy/ui-core/core';
/**
 * Namespaced widget ids for the Accounting widgets.
 *
 * These strings are persisted inside every saved dashboard layout
 * (`IDashboardWidgetPlacement.widgetId`), so treat them as a public data
 * contract: renaming one orphans every placement that references it.
 */
export declare const ACCOUNTING_WIDGET_IDS: {
    readonly TOTAL_INCOME: "accounting.total-income";
    readonly TOTAL_EXPENSES: "accounting.total-expenses";
    readonly PROFIT: "accounting.profit";
    readonly TOTAL_BONUS: "accounting.total-bonus";
    readonly CASH_FLOW: "accounting.cash-flow";
    readonly EMPLOYEE_STATISTICS: "accounting.employee-statistics";
    readonly RECORDS_HISTORY: "accounting.records-history";
    readonly PROFIT_HISTORY: "accounting.profit-history";
};
/**
 * Registry entries for the Accounting widgets: the four KPIs, the cash-flow
 * chart, the per-employee breakdown table, and the two employee history reports
 * that used to be reachable only as modal dialogs.
 *
 * Registered by the dashboard feature (the integrator wires the
 * `WidgetRegistryService.registerWidgets` call) so they show up in the dashboard
 * builder's palette.
 */
export declare const ACCOUNTING_DASHBOARD_WIDGETS: WidgetRegistryConfig[];
