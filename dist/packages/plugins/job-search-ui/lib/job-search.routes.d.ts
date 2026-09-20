import { Route } from '@angular/router';
import { PageRouteRegistryConfig } from '@gauzy/ui-core/core';
/** Path for the job search (browse) tab under /pages/jobs. */
export declare const JOB_SEARCH_PATH = "search";
/** Full path for the job search page. */
export declare const JOB_SEARCH_PAGE_LINK = "/pages/jobs/search";
/**
 * Route config for registering the job search (browse) section at jobs-sections.
 * Used by JobSearchPlugin for declarative route registration.
 */
export declare const JOB_SEARCH_PAGE_ROUTE: PageRouteRegistryConfig;
/**
 * Returns the routes for the job search (browse) section.
 *
 * @returns Route array for the ROUTES provider in JobSearchModule
 */
export declare function getJobSearchRoutes(): Route[];
