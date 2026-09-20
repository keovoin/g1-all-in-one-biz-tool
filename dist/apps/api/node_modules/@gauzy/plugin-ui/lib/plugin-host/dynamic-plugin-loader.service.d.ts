import { Observable } from 'rxjs';
import { PluginUiDefinition } from '../plugin-ui.types';
import * as i0 from "@angular/core";
/**
 * Result of a dynamic plugin load operation.
 */
export interface DynamicPluginLoadResult {
    /** Whether the load was successful. */
    success: boolean;
    /** The plugin ID that was loaded. */
    pluginId: string;
    /** Error message if unsuccessful. */
    error?: string;
}
/**
 * Service for dynamically loading and unloading plugins after the initial
 * application bootstrap.
 *
 * Use this when plugins need to be added or removed at runtime — for example,
 * when a user enables/disables a feature, or when a plugin is installed
 * from a marketplace.
 *
 * Emits `plugin:dynamic-loaded` and `plugin:dynamic-unloaded` events on the
 * event bus so other parts of the system can react.
 *
 * @example
 * ```ts
 * const loader = inject(DynamicPluginLoaderService);
 *
 * // Load a declarative plugin at runtime
 * const result = await loader.loadPlugin({
 *   id: 'my-new-plugin',
 *   routes: [...],
 *   tabs: [...],
 *   bootstrap: (injector) => { ... }
 * });
 *
 * // Load a module-based plugin
 * const result = await loader.loadPlugin({
 *   id: 'heavy-plugin',
 *   loadModule: () => import('./heavy-plugin.module').then(m => m.HeavyModule)
 * });
 *
 * // Unload a plugin
 * await loader.unloadPlugin('my-new-plugin');
 *
 * // Observe loaded plugins
 * loader.loadedPluginIds$.subscribe(ids => console.log('Active plugins:', ids));
 * ```
 */
export declare class DynamicPluginLoaderService {
    private readonly _envInjector;
    private readonly _registry;
    private readonly _extRegistry;
    private readonly _eventBus;
    private readonly _settingsRegistry;
    private readonly _serviceRegistry;
    private readonly _stateService;
    /** Tracks dynamically loaded plugins: pluginId → { definition, instance?, injector? } */
    private readonly _loaded;
    /** Observable of loaded plugin IDs. */
    private readonly _loaded$;
    /**
     * Observable of all dynamically loaded plugin IDs.
     */
    get loadedPluginIds$(): Observable<string[]>;
    /**
     * Returns the currently loaded plugin IDs.
     */
    get loadedPluginIds(): string[];
    /**
     * Returns true if a plugin is currently loaded.
     */
    isLoaded(pluginId: string): boolean;
    /**
     * Dynamically loads and bootstraps a plugin after application startup.
     *
     * Supports both module-based plugins (with `module` or `loadModule`) and
     * declarative-only plugins (with `bootstrap` callback).
     *
     * @param definition The plugin definition to load.
     * @returns Result indicating success or failure.
     */
    loadPlugin(definition: PluginUiDefinition): Promise<DynamicPluginLoadResult>;
    /**
     * Unloads a dynamically loaded plugin.
     *
     * Invokes lifecycle hooks (`ngOnPluginBeforeDestroy`, `ngOnPluginDestroy`),
     * deregisters extensions, settings, services, event subscriptions, and state.
     *
     * @param pluginId The ID of the plugin to unload.
     * @returns Result indicating success or failure.
     */
    unloadPlugin(pluginId: string): Promise<DynamicPluginLoadResult>;
    /**
     * Reloads a plugin by unloading and re-loading it.
     * Useful for hot-reloading plugin configuration changes.
     */
    reloadPlugin(definition: PluginUiDefinition): Promise<DynamicPluginLoadResult>;
    /**
     * Loads a module-based plugin: resolves the module class, creates an
     * instance in the environment injector context, registers it, and
     * invokes lifecycle hooks.
     */
    private _loadModulePlugin;
    /**
     * Loads a declarative-only plugin by running its bootstrap callback
     * inside a child injector context that provides PLUGIN_OPTIONS and
     * PLUGIN_DEFINITION, consistent with module-based plugins.
     */
    private _loadDeclarativePlugin;
    /**
     * Emits the current set of loaded plugin IDs.
     */
    private _emitLoadedIds;
    static ɵfac: i0.ɵɵFactoryDeclaration<DynamicPluginLoaderService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<DynamicPluginLoaderService>;
}
