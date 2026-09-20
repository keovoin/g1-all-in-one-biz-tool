import { WidgetRegistryConfig } from '@gauzy/ui-core/core';
/**
 * Namespaced widget ids for the employee statistics charts.
 *
 * These strings are persisted inside every saved dashboard layout
 * (`IDashboardWidgetPlacement.widgetId`), so treat them as a public data
 * contract: renaming one orphans every placement that references it.
 */
export declare const CHART_WIDGET_IDS: {
    readonly EMPLOYEE_DOUGHNUT: "charts.employee-doughnut";
    readonly EMPLOYEE_HORIZONTAL_BAR: "charts.employee-horizontal-bar";
    readonly EMPLOYEE_STACKED_BAR: "charts.employee-stacked-bar";
    readonly EMPLOYEE_STATISTICS: "charts.employee-statistics";
};
/**
 * Registry entries for the four employee statistics chart widgets.
 *
 * Registered by the dashboard feature (the integrator wires the
 * `WidgetRegistryService.registerWidgets` call) so they show up in the dashboard
 * builder's palette under the "HR" category — the same dashboard the source
 * charts belong to, and the category that matches per-member data.
 */
export declare const CHART_DASHBOARD_WIDGETS: WidgetRegistryConfig[];
