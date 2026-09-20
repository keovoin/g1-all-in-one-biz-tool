import { WidgetRegistryConfig } from '@gauzy/ui-core/core';
/**
 * Namespaced widget ids for the Human Resources info blocks.
 *
 * These strings are persisted inside every saved dashboard layout
 * (`IDashboardWidgetPlacement.widgetId`), so treat them as a public data
 * contract: renaming one orphans every placement that references it.
 */
export declare const HR_WIDGET_IDS: {
    readonly TOTAL_INCOME: "hr.total-income";
    readonly INCOME: "hr.income";
    readonly DIRECT_INCOME: "hr.direct-income";
    readonly EXPENSES_WITHOUT_SALARY: "hr.expenses-without-salary";
    readonly TOTAL_EXPENSES: "hr.total-expenses";
    readonly PROFIT: "hr.profit";
    readonly TOTAL_DIRECT_BONUS: "hr.total-direct-bonus";
    readonly PROFIT_BONUS: "hr.profit-bonus";
    readonly REVENUE_BONUS: "hr.revenue-bonus";
};
/**
 * Registry entries for the nine Human Resources info-block widgets.
 *
 * Every block is a projection of the same `/employee-statistics/months` payload;
 * `EmployeeMonthStatisticsCacheService` collapses them into a single request per
 * scope, so a canvas holding all nine still issues one call — and shares it with
 * any employee chart widget pinned to the same person.
 *
 * Registered by the integrator (via `WidgetRegistryService.registerWidgets`) so
 * they show up in the dashboard builder's palette under "Human Resources".
 */
export declare const HR_DASHBOARD_WIDGETS: WidgetRegistryConfig[];
