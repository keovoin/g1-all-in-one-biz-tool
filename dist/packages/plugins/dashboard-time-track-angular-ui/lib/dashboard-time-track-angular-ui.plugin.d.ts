/**
 * Angular UI Plugin Definition for the Time Tracking dashboard tab.
 *
 * Registers the original Angular-based Time Tracking dashboard tab as a
 * standalone plugin, using `defineDeclarativePlugin`. Routes and tabs are
 * registered automatically at bootstrap via PluginUiModule.
 *
 * ## Usage
 *
 * Add to your plugin config:
 * ```typescript
 * import { DashboardTimeTrackAngularUiPlugin } from '@gauzy/plugin-dashboard-time-track-angular-ui';
 *
 * export const uiPluginConfig: PluginUiConfig = {
 *   plugins: [DashboardTimeTrackAngularUiPlugin]
 * };
 * ```
 */
export declare const DashboardTimeTrackAngularUiPlugin: import("@gauzy/plugin-ui").PluginUiDefinition;
