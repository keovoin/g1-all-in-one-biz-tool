import { ModuleWithProviders, OnDestroy, Type } from '@angular/core';
import { IDeclarativeNavBuilder, IDeclarativePageRouteRegistry, IDeclarativePageTabRegistry, IDeclarativeWidgetRegistry, IPluginTranslateService, IPluginPermissionChecker, IPluginFeatureChecker } from './plugin-ui.helper';
import * as i0 from "@angular/core";
/**
 * Service bindings for `PluginUiModule.init()`.
 *
 * Each key maps to an Angular service class that will be bound to the
 * corresponding internal InjectionToken via `useExisting`. All fields
 * are optional — omit any service you don't need.
 */
export interface PluginUiServices {
    /** Nav-menu builder (bound to PLUGIN_NAV_BUILDER). */
    navBuilder?: Type<IDeclarativeNavBuilder>;
    /** Page-route registry (bound to PLUGIN_ROUTE_REGISTRY). */
    routeRegistry?: Type<IDeclarativePageRouteRegistry>;
    /** Page-tab registry (bound to PLUGIN_TAB_REGISTRY). */
    tabRegistry?: Type<IDeclarativePageTabRegistry>;
    /** Dashboard widget registry (bound to PLUGIN_WIDGET_REGISTRY). */
    widgetRegistry?: Type<IDeclarativeWidgetRegistry>;
    /** Translate service for plugin translations (bound to PLUGIN_TRANSLATE_SERVICE). */
    translateService?: Type<IPluginTranslateService>;
    /** Permission checker for extension visibility (bound to PLUGIN_PERMISSION_CHECKER). */
    permissionChecker?: Type<IPluginPermissionChecker>;
    /** Feature flag checker for extension visibility (bound to PLUGIN_FEATURE_CHECKER). */
    featureChecker?: Type<IPluginFeatureChecker>;
}
/**
 * Angular module responsible for managing UI plugin lifecycles.
 *
 * Import `PluginUiModule.init()` in the root bootstrap module. During application
 * startup the module creates plugin instances in top-down order (parent before
 * children), then invokes `ngOnPluginBootstrap` / `ngOnPluginDestroy` lifecycle
 * hooks. Parent plugins (e.g. JobsPlugin) are initialized before their children.
 */
export declare class PluginUiModule implements OnDestroy {
    private readonly _envInjector;
    private readonly _registry;
    private readonly _extRegistry;
    private readonly _health;
    /** Plugin instances and definitions created during app initializer. Stored so lifecycle methods can be called on destroy. */
    private readonly _plugins;
    /** Definitions of bootstrap-only plugins (no NgModule). Tracked separately for extension cleanup on destroy. */
    private readonly _declarativePluginDefs;
    /** Child EnvironmentInjectors created for declarative plugins with providers. Destroyed with the module. */
    private readonly _pluginEnvInjectors;
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
    static init(services?: PluginUiServices): ModuleWithProviders<PluginUiModule>;
    /**
     * Lifecycle hook called when the module is being destroyed.
     * Deregisters plugin instances from the global registry and calls
     * `ngOnPluginDestroy` on each plugin.
     */
    ngOnDestroy(): void;
    /**
     * Creates all plugin instances and invokes `ngOnPluginBootstrap`.
     *
     * Called by the app initializer — at this point the root injector is
     * fully initialized, so `inject()` calls inside plugin classes resolve
     * correctly.
     */
    bootstrapPlugins(): Promise<void>;
    /**
     * Fires off background module loads for plugins with `loadStrategy: 'preload'`.
     * Does not block bootstrap — errors are logged but not thrown.
     */
    private preloadPlugins;
    /**
     * Reads the config and creates an instance of every plugin module
     * class inside the root `EnvironmentInjector` context, so that
     * `inject()` calls in class fields / constructors resolve correctly.
     * Plugins are filtered by PLUGIN_ACTIVATION_PREDICATE when provided.
     */
    private createPluginInstances;
    /**
     * Runs the `bootstrap` callback for plugins that declare it without an Angular NgModule.
     * These are lightweight, declarative-only plugins (routes, tabs, navMenu, extensions).
     * Respects PLUGIN_ACTIVATION_PREDICATE, so they can be gated by feature flags / permissions.
     */
    private bootstrapDeclarativePlugins;
    /**
     * Invokes a specified lifecycle method on each plugin instance,
     * optionally running a closure afterward.
     *
     * @param lifecycleMethod The lifecycle method name to invoke.
     * @param closure Optional callback executed after each invocation. Receives (instance, definition).
     */
    private invokeLifecycleMethod;
    /**
     * Invokes a synchronous lifecycle method on each plugin instance.
     * Used for ngOnPluginBeforeDestroy (Angular's ngOnDestroy is synchronous).
     */
    private invokeLifecycleMethodSync;
    static ɵfac: i0.ɵɵFactoryDeclaration<PluginUiModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<PluginUiModule, never, never, never>;
    static ɵinj: i0.ɵɵInjectorDeclaration<PluginUiModule>;
}
