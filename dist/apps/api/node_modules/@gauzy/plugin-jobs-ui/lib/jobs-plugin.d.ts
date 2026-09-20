import { PluginUiDefinition } from '@gauzy/plugin-ui';
/**
 * Plugin definition for the Jobs plugin group with configurable child plugins.
 */
export interface JobsPluginDefinition extends PluginUiDefinition {
    init(opts: {
        plugins: PluginUiDefinition[];
    }): PluginUiDefinition;
}
/**
 * Jobs plugin group. Parent module (JobsModule) is initialized first, then
 * child plugins. Child plugins register their routes and nav items under
 * location 'jobs-sections'. The jobs route is defined in pages.routes.ts.
 *
 * Uses imperative registration in JobsModule constructor.
 *
 * @example In plugin-ui.config.ts:
 * ```ts
 * plugins: [JobsPlugin]
 * ```
 *
 * @example Customize child plugins with init:
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
export declare const JobsPlugin: JobsPluginDefinition;
