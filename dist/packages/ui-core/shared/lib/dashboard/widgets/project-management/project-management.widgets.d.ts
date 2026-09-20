import { WidgetRegistryConfig } from '@gauzy/ui-core/core';
/**
 * Namespaced widget ids for the Project Management dashboard.
 *
 * These strings are persisted inside every saved dashboard layout
 * (`IDashboardWidgetPlacement.widgetId`), so treat them as a public data
 * contract: renaming one orphans every placement that references it.
 */
export declare const PROJECT_MANAGEMENT_WIDGET_IDS: {
    readonly MY_TASKS: "project-management.my-tasks";
    readonly MOST_VIEWED_PROJECTS: "project-management.most-viewed-projects";
    readonly RECENTLY_ASSIGNED: "project-management.recently-assigned";
    readonly INBOX: "project-management.inbox";
};
/**
 * Registry entries for the Project Management dashboard widgets.
 *
 * The integrator wires the `WidgetRegistryService.registerWidgets` call; these
 * entries only describe the widgets so they show up in the dashboard builder's
 * palette under the "Project Management" category.
 *
 * This module holds config objects ONLY — every component is reached through a
 * dynamic `loadComponent` import, which is what keeps the widgets out of the
 * root bundle that `provideCoreDashboardWidgets()` is referenced from.
 */
export declare const PROJECT_MANAGEMENT_DASHBOARD_WIDGETS: WidgetRegistryConfig[];
