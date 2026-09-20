import { CanActivateFn } from '@angular/router';
/**
 * Guard for the `custom/:id` dashboard route.
 *
 * Applies the selected dashboard's saved widget layout BEFORE the widget host
 * component initializes, so the layout components deserialize the applied state.
 *
 * When navigating from one custom dashboard to another (same route config,
 * param-only change), Angular would re-use the component tree and the new
 * layout would not be re-applied. In that case the guard cancels the current
 * navigation and re-issues it through an intermediate componentless route so
 * the widget host is destroyed and re-created.
 */
export declare const customDashboardGuard: CanActivateFn;
/**
 * Guard for the standard dashboard tab routes (time-tracking, teams, etc.).
 *
 * Restores the Standard widget layout when a custom dashboard was active,
 * before the standard widget host initializes. No-op otherwise.
 */
export declare const standardDashboardGuard: CanActivateFn;
/**
 * Guard for the empty `/pages/dashboard` path.
 *
 * Redirects to the user's default custom dashboard when one exists,
 * otherwise to the standard time-tracking tab.
 */
export declare const defaultDashboardGuard: CanActivateFn;
