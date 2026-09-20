import { Route } from '@angular/router';
import { PluginRouteInput } from '@gauzy/plugin-ui';
/** Path for the Ever Async integration section under /pages/integrations. */
export declare const INTEGRATION_EVER_ASYNC_PATH = "ever-async";
/** Full path for the Ever Async integration page. */
export declare const INTEGRATION_EVER_ASYNC_PAGE_LINK = "/pages/integrations/ever-async";
/**
 * Route config for registering the Ever Async integration section at integrations-sections.
 * Used by IntegrationEverAsyncPlugin for declarative route registration.
 */
export declare const INTEGRATION_EVER_ASYNC_PAGE_ROUTE: PluginRouteInput;
/**
 * Returns the routes for the Ever Async integration section.
 *
 * @returns Route array for the ROUTES provider in IntegrationEverAsyncUiModule
 */
export declare function getEverAsyncRoutes(): Route[];
