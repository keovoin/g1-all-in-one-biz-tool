import { WidgetRegistryConfig } from '@gauzy/ui-core/core';
/**
 * Namespaced widget ids for the Time Tracking counters and list panels.
 *
 * These strings are persisted inside every saved dashboard layout
 * (`IDashboardWidgetPlacement.widgetId`), so treat them as a public data
 * contract: renaming one orphans every placement that references it.
 *
 * Note the deliberate pairing: `projects-worked` / `members-worked` are the
 * COUNTERS ("how many"), while `projects` / `members` are the list panels that
 * break the same range down row by row.
 */
export declare const TIME_TRACKING_WIDGET_IDS: {
    readonly MEMBERS_WORKED: "time-tracking.members-worked";
    readonly PROJECTS_WORKED: "time-tracking.projects-worked";
    readonly TODAY_ACTIVITY: "time-tracking.today-activity";
    readonly WORKED_TODAY: "time-tracking.worked-today";
    readonly WORKED_THIS_WEEK: "time-tracking.worked-this-week";
    readonly WEEKLY_ACTIVITY: "time-tracking.weekly-activity";
    readonly RECENT_ACTIVITIES: "time-tracking.recent-activities";
    readonly MANUAL_TIME: "time-tracking.manual-time";
    readonly TASKS: "time-tracking.tasks";
    readonly PROJECTS: "time-tracking.projects";
    readonly APPS_URLS: "time-tracking.apps-urls";
    readonly MEMBERS: "time-tracking.members";
};
/**
 * Registry entries for the Time Tracking widgets — six counters and the five
 * richer "window" panels the legacy dashboard renders below them.
 *
 * Registered by the plugin (the integrator wires the
 * `WidgetRegistryService.registerWidgets` call) so they show up in the dashboard
 * builder's palette under the "Time tracking" category.
 *
 * Permissions mirror the legacy dashboard exactly: only the two member-shaped
 * widgets were gated (`*ngxPermissionsOnly="CHANGE_SELECTED_EMPLOYEE"` on the
 * "Members worked" counter and on the whole "Members" window, which
 * `getMembers()` re-checked before fetching), because a user who cannot switch
 * employees only ever sees their own numbers — for which a member breakdown is
 * meaningless. The remaining panels carried no permission check on the page and
 * carry none here; the API still scopes every response to what the caller may see.
 *
 * NOTE: the page ROUTE itself is not permission-guarded either — its only
 * `canActivate` is `standardDashboardGuard`, which restores the Standard layout
 * (see `dashboard-time-track-angular-ui.constants.ts`). The
 * `ADMIN_DASHBOARD_VIEW` / `TIME_TRACKING_DASHBOARD` pair on the plugin's TAB
 * governs tab visibility, not access to the data these widgets read, so it is
 * deliberately NOT copied onto the widgets.
 */
export declare const DASHBOARD_TIME_TRACK_WIDGETS: WidgetRegistryConfig[];
