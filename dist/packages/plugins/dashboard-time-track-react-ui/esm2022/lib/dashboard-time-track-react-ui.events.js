import { definePluginEvent } from '@gauzy/plugin-ui';
/**
 * Emitted every time the React Time Tracking dashboard (re)loads its counters — on selection
 * changes, manual Refresh, the 5-minute auto-refresh and when a hidden widget is re-shown.
 * Other plugins can listen to this event to react to data changes.
 *
 * @example
 * ```ts
 * // Subscribe from another plugin:
 * const handle = bindEventToBus(DashboardRefreshedEvent, eventBus);
 * handle.on().subscribe(event => {
 *   console.log('Dashboard refreshed:', event.payload.employeesCount);
 * });
 * ```
 */
export const DashboardRefreshedEvent = definePluginEvent('dashboard-time-track-react-ui', 'dashboard-time-track-react-ui:dashboard-refreshed', 'Emitted when the React Time Tracking dashboard data is refreshed.');
/**
 * Emitted when a widget's or window's visibility is toggled from the "Manage widgets" popover.
 */
export const WidgetVisibilityChangedEvent = definePluginEvent('dashboard-time-track-react-ui', 'dashboard-time-track-react-ui:widget-visibility-changed', 'Emitted when a dashboard widget or window is shown or hidden.');
//# sourceMappingURL=dashboard-time-track-react-ui.events.js.map