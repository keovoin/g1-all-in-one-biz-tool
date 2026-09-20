import { PageRouteRegistryConfig } from '@gauzy/ui-core/core';
/**
 * Path segment of the Time Tracking tab under /pages/dashboard.
 *
 * Deliberately the SAME segment the Angular Time Tracking plugin registers: the two plugins are
 * two flavours of one page. Each registration carries a `preferredUiCanMatch` guard, so the
 * router hands `/pages/dashboard/time-tracking` to whichever flavour the tenant selected in
 * Settings → General ("Preferred UI"). Bookmarks, the dashboard tab and the default-dashboard
 * redirect therefore never change when a tenant switches.
 */
export declare const DASHBOARD_TIME_TRACK_PATH = "time-tracking";
/**
 * Route config for registering the React Time Tracking tab at dashboard-sections.
 * Picked up by createDashboardRoutes via getPageLocationRoutes('dashboard-sections').
 *
 * Includes DateRangePickerResolver and BookmarkQueryParamsResolver so that
 * navigating directly to this route (or hard-refreshing) initializes the
 * date-range state that useDateRangeFilters() depends on, and
 * `standardDashboardGuard` so a previously applied custom dashboard layout is
 * restored to the Standard one exactly like the Angular flavour does.
 */
export declare const DASHBOARD_TIME_TRACK_ROUTE: PageRouteRegistryConfig;
/** The path this tab used to live at ("dashboard-time-track") before it shared the Angular one. */
export declare const LEGACY_DASHBOARD_TIME_TRACK_PATH = "dashboard-time-track";
/**
 * Compatibility redirect for bookmarks / links to the old React path — the flavour is decided by
 * the tenant preference on the shared path, so both flavours' deep links keep working.
 */
export declare const LEGACY_DASHBOARD_TIME_TRACK_REDIRECT_ROUTE: PageRouteRegistryConfig;
