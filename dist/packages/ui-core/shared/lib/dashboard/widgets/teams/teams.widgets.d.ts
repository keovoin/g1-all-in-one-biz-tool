import { WidgetRegistryConfig } from '@gauzy/ui-core/core';
/**
 * Namespaced widget ids for the Teams dashboard.
 *
 * These strings are persisted inside every saved dashboard layout
 * (`IDashboardWidgetPlacement.widgetId`), so treat them as a public data
 * contract: renaming one orphans every placement that references it.
 */
export declare const TEAMS_WIDGET_IDS: {
    readonly COUNT: "teams.count";
    readonly MEMBERS_WORKED: "teams.members-worked";
    readonly PROJECTS_WORKED: "teams.projects-worked";
    readonly ACTIVITY: "teams.activity";
    readonly TEAM_CARDS: "teams.team-cards";
    readonly TEAM_MEMBERS: "teams.team-members";
    readonly OVERVIEW: "teams.overview";
    readonly MEMBER_DETAILS: "teams.member-details";
    readonly STATUS_CHART: "teams.status-chart";
    readonly DATA_ENTRY_SHORTCUTS: "shortcuts.data-entry";
};
/**
 * Registry entries for the Teams dashboard widgets.
 *
 * The integrator wires the `WidgetRegistryService.registerWidgets` call; these
 * entries only describe the widgets so they show up in the dashboard builder's
 * palette under the "Teams" category.
 *
 * The last entry is the odd one out: the data-entry shortcuts are a navigation
 * widget with nothing to do with teams, so it is categorized as `other` and
 * carries the accounting permissions of the pages it links to. It lives in this
 * file because it was wrapped as a widget in the same pass — moving it to an
 * accounting bundle later only requires moving the entry, not the id.
 */
export declare const TEAMS_DASHBOARD_WIDGETS: WidgetRegistryConfig[];
