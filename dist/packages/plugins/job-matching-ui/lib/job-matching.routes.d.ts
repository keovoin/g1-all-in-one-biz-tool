import { Route } from '@angular/router';
import { PageRouteRegistryConfig } from '@gauzy/ui-core/core';
/** Path for the job matching tab under /pages/jobs. */
export declare const JOB_MATCHING_PATH = "matching";
/** Full path for the job matching page. */
export declare const JOB_MATCHING_PAGE_LINK = "/pages/jobs/matching";
/**
 * Route config for registering the job matching section at jobs-sections.
 * Used by JobMatchingPlugin for declarative route registration.
 */
export declare const JOB_MATCHING_PAGE_ROUTE: PageRouteRegistryConfig;
/**
 * Returns the routes for the job matching section.
 *
 * @returns Route array for the ROUTES provider in JobMatchingModule
 */
export declare function getJobMatchingRoutes(): Route[];
