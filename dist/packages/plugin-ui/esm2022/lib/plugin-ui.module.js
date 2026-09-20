import { createEnvironmentInjector, EnvironmentInjector, inject, Injector, NgModule, provideAppInitializer, runInInjectionContext } from '@angular/core';
import { getPluginUiConfig } from './plugin-ui.loader';
import { PLUGIN_ACTIVATION_PREDICATE, PLUGIN_DEFINITION, PLUGIN_OPTIONS, flattenPlugins, orderPluginsByDependencies } from './plugin-ui.types';
import { getUIPluginModulesWithDefinitions, hasPluginUiLifecycleMethod, PLUGIN_NAV_BUILDER, PLUGIN_ROUTE_REGISTRY, PLUGIN_TAB_REGISTRY, PLUGIN_WIDGET_REGISTRY, PLUGIN_TRANSLATE_SERVICE, PLUGIN_PERMISSION_CHECKER, PLUGIN_FEATURE_CHECKER } from './plugin-ui.helper';
import { PageExtensionRegistryService } from './plugin-extension/page-extension-registry.service';
import { PluginUiRegistryService } from './plugin-ui-registry.service';
import { PluginHealthService } from './plugin-health.service';
import { validatePluginDependencies, logDependencyValidation } from './plugin-dependency-graph';
import { checkVersionCompatibility } from './plugin-version-compat';
import * as i0 from "@angular/core";
/** Maps PluginUiServices keys to their InjectionTokens. */
const SERVICE_TOKEN_MAP = {
    navBuilder: PLUGIN_NAV_BUILDER,
    routeRegistry: PLUGIN_ROUTE_REGISTRY,
    tabRegistry: PLUGIN_TAB_REGISTRY,
    widgetRegistry: PLUGIN_WIDGET_REGISTRY,
    translateService: PLUGIN_TRANSLATE_SERVICE,
    permissionChecker: PLUGIN_PERMISSION_CHECKER,
    featureChecker: PLUGIN_FEATURE_CHECKER
};
/**
 * Converts a `PluginUiServices` object into an array of `useExisting` providers.
 * Only services that are defined (non-nullish) produce a provider.
 */
function buildServiceProviders(services) {
    if (!services)
        return [];
    return Object.keys(services)
        .filter((key) => services[key] != null)
        .map((key) => ({ provide: SERVICE_TOKEN_MAP[key], useExisting: services[key] }));
}
/**
 * Angular module responsible for managing UI plugin lifecycles.
 *
 * Import `PluginUiModule.init()` in the root bootstrap module. During application
 * startup the module creates plugin instances in top-down order (parent before
 * children), then invokes `ngOnPluginBootstrap` / `ngOnPluginDestroy` lifecycle
 * hooks. Parent plugins (e.g. JobsPlugin) are initialized before their children.
 */
export class PluginUiModule {
    _envInjector = inject(EnvironmentInjector);
    _registry = inject(PluginUiRegistryService);
    _extRegistry = inject(PageExtensionRegistryService);
    _health = inject(PluginHealthService);
    /** Plugin instances and definitions created during app initializer. Stored so lifecycle methods can be called on destroy. */
    _plugins = [];
    /** Definitions of bootstrap-only plugins (no NgModule). Tracked separately for extension cleanup on destroy. */
    _declarativePluginDefs = [];
    /** Child EnvironmentInjectors created for declarative plugins with providers. Destroyed with the module. */
    _pluginEnvInjectors = [];
    /**
     * Configure the PluginUiModule.
     *
     * Returns a `ModuleWithProviders` that registers an app initializer
     * (via `provideAppInitializer`) which creates and bootstraps all
     * plugin instances at startup.
     *
     * Pass `services` to enable `defineDeclarativePlugin()` — the provided
     * service classes are bound to the internal InjectionTokens used by the
     * auto-generated `bootstrap` callbacks.
     *
     * @example
     * ```ts
     * PluginUiModule.init({
     *   navBuilder: NavMenuBuilderService,
     *   routeRegistry: PageRouteRegistryService,
     *   tabRegistry: PageTabRegistryService,
     *   translateService: TranslateService,
     * })
     * ```
     */
    static init(services) {
        return {
            ngModule: PluginUiModule,
            providers: [
                ...buildServiceProviders(services),
                provideAppInitializer(() => {
                    const pluginModule = inject(PluginUiModule);
                    return pluginModule.bootstrapPlugins();
                })
            ]
        };
    }
    /**
     * Lifecycle hook called when the module is being destroyed.
     * Deregisters plugin instances from the global registry and calls
     * `ngOnPluginDestroy` on each plugin.
     */
    ngOnDestroy() {
        this.invokeLifecycleMethodSync('ngOnPluginBeforeDestroy');
        // Deregister all instances from the registry unconditionally so every plugin is removed
        // regardless of whether it implements ngOnPluginDestroy.
        for (const { instance } of this._plugins) {
            this._registry.deregister(instance);
        }
        // Extension deregistration moved into closure so it runs per-plugin *after* each
        // ngOnPluginDestroy completes (avoids race where extensions were removed before hooks ran).
        this.invokeLifecycleMethod('ngOnPluginDestroy', (instance, def) => {
            if (def?.extensions?.length) {
                this._extRegistry.deregisterByPlugin(def.id);
            }
        }).catch((e) => {
            console.error('[PluginUiModule] Error during plugin destroy', e);
        });
        // Plugins without ngOnPluginDestroy: deregister extensions immediately (no async hook to wait for).
        for (const { instance, definition } of this._plugins) {
            if (!hasPluginUiLifecycleMethod(instance, 'ngOnPluginDestroy') && definition?.extensions?.length) {
                this._extRegistry.deregisterByPlugin(definition.id);
            }
        }
        // Deregister extensions registered by bootstrap-only (declarative) plugins.
        for (const definition of this._declarativePluginDefs) {
            if (definition.extensions?.length) {
                this._extRegistry.deregisterByPlugin(definition.id);
            }
        }
        // Destroy the child EnvironmentInjectors created for declarative plugins
        // so their providers' ngOnDestroy hooks run and references are released.
        for (const injector of this._pluginEnvInjectors) {
            try {
                injector.destroy();
            }
            catch (e) {
                console.error('[PluginUiModule] Error destroying plugin environment injector', e);
            }
        }
        this._pluginEnvInjectors.length = 0;
    }
    // ─── Bootstrap ───────────────────────────────────────────────
    /**
     * Creates all plugin instances and invokes `ngOnPluginBootstrap`.
     *
     * Called by the app initializer — at this point the root injector is
     * fully initialized, so `inject()` calls inside plugin classes resolve
     * correctly.
     */
    async bootstrapPlugins() {
        // ── Validate dependency graph and version compatibility ──
        try {
            const config = getPluginUiConfig();
            const allFlat = flattenPlugins(config.plugins);
            // Dependency graph validation (cycles, missing deps, duplicates)
            const depResult = validatePluginDependencies(allFlat);
            if (!depResult.valid) {
                logDependencyValidation(depResult);
            }
            // Version compatibility check (peerPlugins)
            const verResult = checkVersionCompatibility(allFlat);
            if (!verResult.compatible) {
                for (const issue of verResult.issues) {
                    if (issue.severity === 'error') {
                        console.error(`[PluginUiModule] [${issue.pluginId}] ${issue.message}`);
                    }
                    else {
                        console.warn(`[PluginUiModule] [${issue.pluginId}] ${issue.message}`);
                    }
                }
            }
        }
        catch (e) {
            // Config not available yet — skip validation
        }
        const plugins = await this.createPluginInstances();
        this._plugins.push(...plugins);
        for (const { instance } of plugins) {
            this._registry.register(instance);
        }
        // Invoke ngOnPluginBootstrap for all plugins
        await this.invokeLifecycleMethod('ngOnPluginBootstrap');
        // Invoke ngOnPluginAfterBootstrap for all plugins
        await this.invokeLifecycleMethod('ngOnPluginAfterBootstrap');
        // Record boot end *after* all lifecycle hooks complete so bootTimeMs
        // reflects the full bootstrap cost, not just instantiation.
        for (const { definition } of plugins) {
            this._health.recordBootEnd(definition.id);
        }
        // Handle bootstrap-only plugins (no module/loadModule — pure declarative registrations)
        await this.bootstrapDeclarativePlugins();
        // Preload plugins with loadStrategy: 'preload' (fire-and-forget after bootstrap)
        this.preloadPlugins();
    }
    /**
     * Fires off background module loads for plugins with `loadStrategy: 'preload'`.
     * Does not block bootstrap — errors are logged but not thrown.
     */
    preloadPlugins() {
        try {
            const config = getPluginUiConfig();
            const allFlat = flattenPlugins(config.plugins);
            const preloadable = allFlat.filter((p) => p.loadStrategy === 'preload' && p.loadModule);
            if (preloadable.length === 0)
                return;
            console.log(`[PluginUiModule] Preloading ${preloadable.length} plugin(s)…`);
            for (const plugin of preloadable) {
                plugin.loadModule()
                    .then(() => {
                    console.log(`[PluginUiModule] Preloaded '${plugin.id}'`);
                })
                    .catch((err) => {
                    console.warn(`[PluginUiModule] Failed to preload '${plugin.id}':`, err);
                });
            }
        }
        catch {
            // Config not available — skip preloading
        }
    }
    // ─── Private helpers ─────────────────────────────────────────
    /**
     * Reads the config and creates an instance of every plugin module
     * class inside the root `EnvironmentInjector` context, so that
     * `inject()` calls in class fields / constructors resolve correctly.
     * Plugins are filtered by PLUGIN_ACTIVATION_PREDICATE when provided.
     */
    async createPluginInstances() {
        const config = getPluginUiConfig();
        const pluginsWithModules = getUIPluginModulesWithDefinitions(config.plugins);
        const byDef = new Map(pluginsWithModules.map((p) => [p.definition, p]));
        const orderedDefs = orderPluginsByDependencies(pluginsWithModules.map((p) => p.definition));
        const orderedPlugins = orderedDefs
            .map((def) => {
            const entry = byDef.get(def);
            if (!entry) {
                console.warn(`[PluginUiModule] Definition not found when reordering (skipping): ${def?.id ?? 'unknown'}`);
                return null;
            }
            return entry;
        })
            .filter((p) => p != null);
        const predicate = this._envInjector.get(PLUGIN_ACTIVATION_PREDICATE, null);
        const oks = predicate == null
            ? orderedPlugins.map(() => true)
            : await Promise.all(orderedPlugins.map(async ({ definition }) => {
                try {
                    const result = predicate(definition);
                    return typeof result === 'boolean' ? result : await result;
                }
                catch {
                    return false;
                }
            }));
        const filtered = orderedPlugins.filter((_, i) => oks[i]);
        const plugins = [];
        for (const { definition, module: mod, loadModule } of filtered) {
            try {
                this._health.recordBootStart(definition.id);
                const resolvedModule = mod ?? (loadModule ? await loadModule() : null);
                if (!resolvedModule) {
                    // Clean up orphaned boot-start entry since this plugin has no module to bootstrap
                    this._health.reset(definition.id);
                    continue;
                }
                const options = definition.options ?? {};
                const childInjector = Injector.create({
                    providers: [
                        { provide: PLUGIN_OPTIONS, useValue: options },
                        { provide: PLUGIN_DEFINITION, useValue: definition }
                    ],
                    parent: this._envInjector
                });
                const instance = runInInjectionContext(childInjector, () => new resolvedModule());
                plugins.push({ instance, definition });
            }
            catch (e) {
                const trace = typeof e?.stack === 'string' ? e.stack : undefined;
                console.error(`Error creating UI plugin [${definition.id}]`, trace, e);
                this._health.recordError(definition.id, e);
            }
        }
        return plugins;
    }
    /**
     * Runs the `bootstrap` callback for plugins that declare it without an Angular NgModule.
     * These are lightweight, declarative-only plugins (routes, tabs, navMenu, extensions).
     * Respects PLUGIN_ACTIVATION_PREDICATE, so they can be gated by feature flags / permissions.
     */
    async bootstrapDeclarativePlugins() {
        const config = getPluginUiConfig();
        const allFlat = flattenPlugins(config.plugins);
        // Warn about plugins that define both bootstrap and module/loadModule — bootstrap is ignored in that case.
        for (const p of allFlat) {
            if (p.bootstrap && (p.module || p.loadModule)) {
                console.warn(`[PluginUiModule] Plugin [${p.id}] defines both "bootstrap" and "module"/"loadModule". ` +
                    `"bootstrap" is ignored — remove it or remove the module reference.`);
            }
        }
        const bootstrapOnly = allFlat.filter((p) => !!p.bootstrap && !p.module && !p.loadModule);
        const ordered = orderPluginsByDependencies(bootstrapOnly);
        const predicate = this._envInjector.get(PLUGIN_ACTIVATION_PREDICATE, null);
        for (const definition of ordered) {
            try {
                if (predicate) {
                    let active;
                    try {
                        const result = predicate(definition);
                        active = typeof result === 'boolean' ? result : await result;
                    }
                    catch {
                        active = false;
                    }
                    if (!active)
                        continue;
                }
                this._health.recordBootStart(definition.id);
                // Create a child EnvironmentInjector with plugin providers (if any)
                const pluginInjector = definition.providers?.length
                    ? createEnvironmentInjector(definition.providers, this._envInjector)
                    : this._envInjector;
                if (pluginInjector !== this._envInjector) {
                    this._pluginEnvInjectors.push(pluginInjector);
                }
                const result = runInInjectionContext(pluginInjector, () => definition.bootstrap(pluginInjector));
                if (result instanceof Promise)
                    await result;
                this._declarativePluginDefs.push(definition);
                this._health.recordBootEnd(definition.id);
            }
            catch (e) {
                const trace = typeof e?.stack === 'string' ? e.stack : undefined;
                console.error(`[PluginUiModule] Error in bootstrap for plugin [${definition.id}]`, trace, e);
                this._health.recordError(definition.id, e);
            }
        }
    }
    /**
     * Invokes a specified lifecycle method on each plugin instance,
     * optionally running a closure afterward.
     *
     * @param lifecycleMethod The lifecycle method name to invoke.
     * @param closure Optional callback executed after each invocation. Receives (instance, definition).
     */
    async invokeLifecycleMethod(lifecycleMethod, closure) {
        for (const { instance, definition } of this._plugins) {
            if (hasPluginUiLifecycleMethod(instance, lifecycleMethod)) {
                try {
                    await instance[lifecycleMethod]();
                    if (typeof closure === 'function') {
                        closure(instance, definition);
                    }
                }
                catch (e) {
                    const name = instance.constructor?.name || '(anonymous plugin)';
                    const trace = typeof e?.stack === 'string' ? e.stack : undefined;
                    console.error(`Error in ${String(lifecycleMethod)} for plugin [${name}]`, trace, e);
                }
            }
        }
    }
    /**
     * Invokes a synchronous lifecycle method on each plugin instance.
     * Used for ngOnPluginBeforeDestroy (Angular's ngOnDestroy is synchronous).
     */
    invokeLifecycleMethodSync(lifecycleMethod) {
        for (const { instance } of this._plugins) {
            if (hasPluginUiLifecycleMethod(instance, lifecycleMethod)) {
                try {
                    const result = instance[lifecycleMethod]();
                    if (result instanceof Promise) {
                        // If it returned a Promise, we can't await in sync context - log and continue
                        result.catch((e) => {
                            const name = instance.constructor?.name || '(anonymous plugin)';
                            console.error(`Error in ${String(lifecycleMethod)} for plugin [${name}]`, e);
                        });
                    }
                }
                catch (e) {
                    const name = instance.constructor?.name || '(anonymous plugin)';
                    const trace = typeof e?.stack === 'string' ? e.stack : undefined;
                    console.error(`Error in ${String(lifecycleMethod)} for plugin [${name}]`, trace, e);
                }
            }
        }
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: PluginUiModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
    static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: PluginUiModule });
    static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: PluginUiModule });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: PluginUiModule, decorators: [{
            type: NgModule,
            args: [{}]
        }] });
//# sourceMappingURL=plugin-ui.module.js.map