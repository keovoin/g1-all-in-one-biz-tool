import { InjectionToken } from '@angular/core';
/**
 * InjectionToken that provides the application UI configuration.
 */
export const PLUGIN_UI_CONFIG = new InjectionToken('PLUGIN_UI_CONFIG');
/**
 * InjectionToken that provides the current plugin's options.
 * Set by PluginUiModule when creating each plugin instance.
 * Use `inject(PLUGIN_OPTIONS)` inside a plugin module to access its options.
 */
export const PLUGIN_OPTIONS = new InjectionToken('PLUGIN_OPTIONS');
/**
 * InjectionToken that provides the current plugin's definition.
 * Set by PluginUiModule when creating each plugin instance.
 * Use `inject(PLUGIN_DEFINITION)` to read declarative routes/navMenu/tabs/extensions
 * and call applyDeclarativeRegistrations() to apply them.
 */
export const PLUGIN_DEFINITION = new InjectionToken('PLUGIN_DEFINITION');
/**
 * Optional predicate to filter which plugins are activated at bootstrap.
 * When provided, plugins for which the predicate returns false (or resolves to false)
 * are skipped and never instantiated.
 *
 * @example
 * ```ts
 * { provide: PLUGIN_ACTIVATION_PREDICATE, useFactory: () => {
 *   const store = inject(Store);
 *   return (def: PluginUiDefinition) => {
 *     if (def.featureKey && !store.hasFeatureEnabled(def.featureKey)) return false;
 *     if (def.permissionKeys?.length && !store.hasAnyPermission(...def.permissionKeys)) return false;
 *     return true;
 *   };
 * }, deps: [Store] }
 * ```
 */
export const PLUGIN_ACTIVATION_PREDICATE = new InjectionToken('PLUGIN_ACTIVATION_PREDICATE');
// ─── Utility helpers ────────────────────────────────────────────────
function getNestedPlugins(p) {
    return p.plugins?.length ? p.plugins : undefined;
}
/**
 * Orders plugins by dependsOn so that dependencies are bootstrapped first.
 * Throws if a circular dependency is detected.
 *
 * @param plugins Flat plugin list (e.g. from flattenPlugins).
 * @returns Plugins reordered so each plugin comes after its dependsOn.
 */
export function orderPluginsByDependencies(plugins) {
    const byId = new Map(plugins.map((p) => [p.id, p]));
    const sorted = [];
    const visited = new Set();
    const visiting = new Set();
    function visit(id) {
        if (visited.has(id))
            return;
        if (visiting.has(id)) {
            throw new Error(`Plugin dependency cycle detected involving "${id}"`);
        }
        visiting.add(id);
        const def = byId.get(id);
        if (def?.dependsOn?.length) {
            for (const depId of def.dependsOn) {
                if (byId.has(depId)) {
                    visit(depId);
                }
            }
        }
        visiting.delete(id);
        visited.add(id);
        if (def)
            sorted.push(def);
    }
    for (const p of plugins) {
        visit(p.id);
    }
    return sorted;
}
/**
 * Flattens a plugin tree into a list of all plugins (including nested plugins).
 * Order is top-down: parent before children. For parent plugins with nested children,
 * only those with at least one of `module`, `loadModule`, or `bootstrap` are included
 * alongside their children (pure group parents with none of these are skipped).
 * Leaf plugins (no nested children) are always included.
 * Use orderPluginsByDependencies() afterward if plugins use dependsOn.
 *
 * @param plugins Top-level plugins array (may contain parents with nested plugins).
 * @returns Flat array in parent-before-children order.
 */
export function flattenPlugins(plugins) {
    const result = [];
    for (const p of plugins) {
        const nested = getNestedPlugins(p);
        if (nested?.length) {
            if (p.module || p.loadModule || p.bootstrap) {
                result.push(p);
            }
            result.push(...flattenPlugins(nested));
        }
        else {
            result.push(p);
        }
    }
    return result;
}
/**
 * Collects all plugin IDs from a plugin tree (including nested plugins).
 */
export function collectPluginIds(plugins) {
    const ids = [];
    for (const p of plugins) {
        ids.push(p.id);
        const nested = getNestedPlugins(p);
        if (nested?.length) {
            ids.push(...collectPluginIds(nested));
        }
    }
    return ids;
}
/**
 * Checks whether a specific plugin is present in the configuration.
 */
export function isPluginActive(config, pluginId) {
    return collectPluginIds(config.plugins).includes(pluginId);
}
/**
 * Returns all plugins whose `location` matches the given value.
 */
export function getPluginsByLocation(config, location) {
    return flattenPlugins(config.plugins).filter((p) => p.location === location);
}
/**
 * Returns the Angular module classes for all plugins that match a given location.
 */
export function getPluginModulesByLocation(config, location) {
    return getPluginsByLocation(config, location)
        .filter((p) => !!p.module)
        .map((p) => p.module);
}
/**
 * Recursively finds a plugin by ID in the plugin tree (includes module-less group parents).
 */
function findPluginById(plugins, pluginId) {
    for (const p of plugins) {
        if (p.id === pluginId)
            return p;
        const nested = getNestedPlugins(p);
        if (nested?.length) {
            const found = findPluginById(nested, pluginId);
            if (found)
                return found;
        }
    }
    return undefined;
}
/**
 * Returns the plugin definition for a given plugin ID.
 * Includes module-less group parents (unlike flattenPlugins), so it is consistent
 * with isPluginActive(config, pluginId).
 */
export function getPluginDefinition(config, pluginId) {
    return findPluginById(config.plugins, pluginId);
}
/**
 * Returns the plugin definition that provides the given module class.
 */
export function getPluginDefinitionByModule(config, moduleType) {
    return flattenPlugins(config.plugins).find((p) => p.module === moduleType);
}
//# sourceMappingURL=plugin-ui.types.js.map