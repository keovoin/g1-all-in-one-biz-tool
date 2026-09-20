import { InjectionToken } from '@angular/core';
/**
 * Stream of the current {@link IDashboardWidgetContext}.
 *
 * Provided by the canvas host per widget instance, so each widget can receive a
 * context narrowed by its own placement configuration.
 */
export const DASHBOARD_WIDGET_CONTEXT = new InjectionToken('DASHBOARD_WIDGET_CONTEXT');
/**
 * The persisted per-instance configuration of the widget being rendered
 * (the placement's `config` object). Empty when the widget has no settings.
 */
export const DASHBOARD_WIDGET_CONFIG = new InjectionToken('DASHBOARD_WIDGET_CONFIG');
//# sourceMappingURL=dashboard-widget-context.js.map