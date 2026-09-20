import { PluginUiDefinition } from '@gauzy/plugin-ui';
/**
 * Job Matching plugin definition.
 *
 * Registers the /pages/jobs/matching route. The "Matching" nav item under the Jobs section
 * is managed dynamically by JobMatchingModule based on the jobMatchingEntity$ observable,
 * which shows/hides it depending on whether job matching sync is active.
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
export declare const JobMatchingPlugin: PluginUiDefinition;
