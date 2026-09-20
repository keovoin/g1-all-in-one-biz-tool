import { PluginUiDefinition } from '@gauzy/plugin-ui';
/**
 * Job Employee plugin definition.
 *
 * Registers the /pages/jobs/employee route and adds an "Employee" nav item under the Jobs section.
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
export declare const JobEmployeePlugin: PluginUiDefinition;
