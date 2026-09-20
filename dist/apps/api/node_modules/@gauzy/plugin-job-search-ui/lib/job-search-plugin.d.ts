import { PluginUiDefinition } from '@gauzy/plugin-ui';
/**
 * Job Search (Browse) plugin definition.
 *
 * Registers the /pages/jobs/search route. The "Browse" nav item under the Jobs section
 * is managed dynamically by JobSearchModule based on the jobMatchingEntity$ observable,
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
export declare const JobSearchPlugin: PluginUiDefinition;
