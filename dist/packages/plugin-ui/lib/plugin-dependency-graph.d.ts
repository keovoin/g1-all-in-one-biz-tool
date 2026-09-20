import type { PluginUiDefinition } from './plugin-ui.types';
/**
 * Severity levels for dependency validation issues.
 */
export type DependencyIssueSeverity = 'error' | 'warning' | 'info';
/**
 * A single dependency validation issue.
 */
export interface DependencyIssue {
    /** The plugin that has the issue. */
    pluginId: string;
    /** Severity of the issue. */
    severity: DependencyIssueSeverity;
    /** Human-readable message. */
    message: string;
    /** Category of the issue. */
    category: 'missing-dep' | 'cycle' | 'self-dep' | 'duplicate-id' | 'orphan';
}
/**
 * Result of a dependency graph validation.
 */
export interface DependencyValidationResult {
    /** Whether the graph is valid (no errors). */
    valid: boolean;
    /** All issues found. */
    issues: DependencyIssue[];
    /** Only error-level issues. */
    errors: DependencyIssue[];
    /** Only warning-level issues. */
    warnings: DependencyIssue[];
    /** Topological order (if no cycles). */
    topologicalOrder: string[];
    /** Dependency depth per plugin (max distance from root). */
    depths: Map<string, number>;
}
/**
 * Validates a flat list of plugin definitions for dependency issues.
 *
 * Checks for:
 * - **Missing dependencies**: `dependsOn` references a plugin ID not in the list
 * - **Circular dependencies**: A → B → C → A creates a cycle
 * - **Self-dependencies**: Plugin depends on itself
 * - **Duplicate IDs**: Multiple plugins share the same ID
 * - **Orphan plugins**: Plugins that no other plugin depends on and depend on nothing (info-level)
 *
 * @example
 * ```ts
 * import { validatePluginDependencies, flattenPlugins } from '@gauzy/plugin-ui';
 *
 * const allPlugins = flattenPlugins(config.plugins);
 * const result = validatePluginDependencies(allPlugins);
 *
 * if (!result.valid) {
 *   for (const issue of result.errors) {
 *     console.error(`[${issue.pluginId}] ${issue.message}`);
 *   }
 * }
 *
 * // Topological order for safe initialization
 * console.log('Boot order:', result.topologicalOrder);
 * ```
 *
 * @param plugins Flat list of plugin definitions (use `flattenPlugins()` first).
 * @returns Validation result with issues and topological ordering.
 */
export declare function validatePluginDependencies(plugins: PluginUiDefinition[]): DependencyValidationResult;
/**
 * Logs validation results to the console with appropriate log levels.
 *
 * @param result The validation result from `validatePluginDependencies()`.
 */
export declare function logDependencyValidation(result: DependencyValidationResult): void;
