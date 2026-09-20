import { Route } from '@angular/router';
import { PageRouteRegistryConfig, PageRouteRegistryService, PageRouteLocationId } from '@gauzy/ui-core/core';
/** Location where job child plugins (Employee, Search, Matching, etc.) register their routes. */
export declare const JOBS_SECTIONS_LOCATION: PageRouteLocationId;
/**
 * Route config for registering the jobs section at page-sections.
 * Used by JobsPlugin for declarative route registration.
 */
export declare const JOBS_PAGE_ROUTE: PageRouteRegistryConfig;
/**
 * Builds the child routes for the jobs section: layout + redirect + plugin-contributed tabs.
 *
 * @param _pageRouteRegistryService Page route registry to fetch routes from JOBS_SECTIONS_LOCATION
 * @returns Route array for the ROUTES provider in JobsModule
 */
export declare function getJobsRoutes(_pageRouteRegistryService: PageRouteRegistryService): Route[];
