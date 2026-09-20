import { type PluginUiDefinition, type DynamicPluginLoadResult } from '@gauzy/plugin-ui';
/**
 * React hook for dynamically loading and unloading plugins.
 *
 * Provides imperative `load` / `unload` / `reload` functions and
 * reactive state for tracking which plugins are currently loaded.
 *
 * @example
 * ```tsx
 * function PluginManager() {
 *   const { loadedIds, load, unload, reload, loading, lastResult } = useDynamicPlugin();
 *
 *   const handleInstall = async () => {
 *     const result = await load({
 *       id: 'analytics',
 *       bootstrap: (injector) => { ... }
 *     });
 *     if (!result.success) alert(result.error);
 *   };
 *
 *   return (
 *     <div>
 *       <h3>Active Plugins: {loadedIds.join(', ')}</h3>
 *       <button onClick={handleInstall} disabled={loading}>Install Analytics</button>
 *       <button onClick={() => unload('analytics')}>Remove Analytics</button>
 *     </div>
 *   );
 * }
 * ```
 */
export declare function useDynamicPlugin(): {
    /** Currently loaded plugin IDs (reactive). */
    loadedIds: string[];
    /** Load a plugin definition at runtime. */
    load: (definition: PluginUiDefinition) => Promise<DynamicPluginLoadResult>;
    /** Unload a plugin by ID. */
    unload: (pluginId: string) => Promise<DynamicPluginLoadResult>;
    /** Reload a plugin (unload + load). */
    reload: (definition: PluginUiDefinition) => Promise<DynamicPluginLoadResult>;
    /** Check if a plugin is loaded. */
    isLoaded: (pluginId: string) => boolean;
    /** Whether a load/unload operation is in progress. */
    loading: boolean;
    /** Result of the last load/unload operation. */
    lastResult: DynamicPluginLoadResult | null;
};
