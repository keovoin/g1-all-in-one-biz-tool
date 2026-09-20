import { PluginUiDefinition } from '@gauzy/plugin-ui';
/**
 * Job Proposal Template plugin definition.
 *
 * Registers the /pages/jobs/proposal-template route. The module adds the nav item
 * dynamically with conditional add button using Store.hasAnyPermission().
 *
 * @example In plugin-ui.config.ts (as child of JobsPlugin):
 * ```ts
 * plugins: [
 *   JobsPlugin.init({
 *     plugins: [
 *       JobProposalPlugin,
 *       JobEmployeePlugin,
 *       JobSearchPlugin,
 *       JobMatchingPlugin,
 *       JobProposalTemplatePlugin
 *     ]
 *   })
 * ]
 * ```
 */
export declare const JobProposalTemplatePlugin: PluginUiDefinition;
