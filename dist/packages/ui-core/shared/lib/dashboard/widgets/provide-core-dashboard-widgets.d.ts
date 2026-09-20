import { EnvironmentProviders } from '@angular/core';
/**
 * Every dashboard-builder widget contributed by the core application, as
 * opposed to the ones plugins publish through their declarative `widgets` field.
 *
 * These are configuration objects only — each one's component is fetched on
 * demand by `WidgetRegistryService.resolveComponent()`, so a canvas only pays
 * for the widgets it actually renders.
 */
export declare const CORE_DASHBOARD_WIDGETS: import("@gauzy/ui-core/core").WidgetRegistryConfig[];
/**
 * Publishes the core dashboard widgets (Accounting, HR, employee charts, Teams)
 * to the widget registry, so they appear in the dashboard builder's palette and
 * can be placed on any custom dashboard canvas.
 *
 * IMPORTANT: provide this at the ROOT (the bootstrap module).
 * `provideAppInitializer` inside a lazily-created child EnvironmentInjector
 * never runs — exactly the trap plugin widget registration hit.
 *
 * @returns Environment providers to spread into the root providers array.
 */
export declare function provideCoreDashboardWidgets(): EnvironmentProviders;
