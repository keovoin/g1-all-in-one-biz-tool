import { PluginUiDefinition } from '@gauzy/plugin-ui';
/**
 * Job Proposals plugin definition.
 *
 * Registers the proposals route at sales-sections (path: proposals) with
 * child routes (list, register, details, edit) defined in the loaded module.
 * The module adds the nav item dynamically with conditional add using Store.hasAnyPermission().
 *
 * @example In plugin-ui.config.ts:
 * ```ts
 * plugins: [JobProposalPlugin]
 * ```
 */
export declare const JobProposalPlugin: PluginUiDefinition;
