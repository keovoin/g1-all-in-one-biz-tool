import { Route } from '@angular/router';
import { PageRouteRegistryConfig } from '@gauzy/ui-core/core';
/** Path for the job proposal template tab under /pages/jobs. */
export declare const JOB_PROPOSAL_TEMPLATE_PATH = "proposal-template";
/** Full path for the job proposal template page. */
export declare const JOB_PROPOSAL_TEMPLATE_PAGE_LINK = "/pages/jobs/proposal-template";
/**
 * Route config for registering the job proposal template section at jobs-sections.
 * Used by JobProposalTemplatePlugin for declarative route registration.
 */
export declare const JOB_PROPOSAL_TEMPLATE_PAGE_ROUTE: PageRouteRegistryConfig;
/**
 * Returns the routes for the job proposal template section.
 *
 * @returns Route array for the ROUTES provider in JobProposalTemplateModule
 */
export declare function getJobProposalTemplateRoutes(): Route[];
