import { Route } from '@angular/router';
import { PageRouteRegistryConfig } from '@gauzy/ui-core/core';
/** Path for the upwork integration section under /pages/integrations. */
export declare const INTEGRATION_UPWORK_PATH = "upwork";
/** Full path for the upwork integration page. */
export declare const INTEGRATION_UPWORK_PAGE_LINK = "/pages/integrations/upwork";
/**
 * Route config for registering the upwork integration section at integrations-sections.
 * Used by IntegrationUpworkPlugin for declarative route registration.
 */
export declare const INTEGRATION_UPWORK_PAGE_ROUTE: PageRouteRegistryConfig;
/**
 * Returns the routes for the upwork integration section.
 *
 * @returns Route array for the ROUTES provider in IntegrationUpworkUiModule
 */
export declare function getUpworkRoutes(): Route[];
