import { Route } from '@angular/router';
import { PageRouteRegistryConfig, PageRouteRegistryService } from '@gauzy/ui-core/core';
/** Location where the proposals route is registered under Sales (path: 'proposals'). */
export declare const SALES_SECTIONS_LOCATION = "sales-sections";
/** Location where additional proposal child routes can be registered by other plugins. */
export declare const PROPOSALS_SECTIONS_LOCATION = "proposals-sections";
/** Full path for the proposals page under Sales. */
export declare const JOB_PROPOSAL_PAGE_LINK = "/pages/sales/proposals";
/**
 * Route config for registering proposals under Sales.
 * Includes the full route tree: path 'proposals' with loadChildren, and the loaded
 * module provides the layout with child routes (list, register, details, edit).
 */
export declare const JOB_PROPOSAL_SALES_ROUTE: PageRouteRegistryConfig;
/**
 * Returns the routes for the proposals section.
 * Uses ProposalLayoutComponent as parent with static child routes merged with
 * any additional routes registered at proposals-sections by other plugins.
 *
 * @param registry Page route registry to fetch extra child routes from proposals-sections
 * @returns Route array for the ROUTES provider in JobProposalModule
 */
export declare function getProposalsRoutes(pageRouteRegistryService: PageRouteRegistryService): Route[];
