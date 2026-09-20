import { InjectionToken, Type } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import type { PageExtensionDefinition } from './plugin-extension/page-extension-slot.types';
import { PluginUiDefinition } from './plugin-ui.types';
import { PluginUiLifecycleMethods } from './plugin-ui.interface';
/**
 * Optional InjectionToken for the nav-menu builder service.
 * Provide via `PluginUiModule.init({ navBuilder: NavMenuBuilderService })`.
 * Used internally by `defineDeclarativePlugin` to wire up nav contributions.
 */
export declare const PLUGIN_NAV_BUILDER: InjectionToken<IDeclarativeNavBuilder>;
/**
 * Optional InjectionToken for the page-route registry service.
 * Provide via `PluginUiModule.init({ routeRegistry: PageRouteRegistryService })`.
 * Used internally by `defineDeclarativePlugin` to register plugin routes.
 */
export declare const PLUGIN_ROUTE_REGISTRY: InjectionToken<IDeclarativePageRouteRegistry>;
/**
 * Optional InjectionToken for the page-tab registry service.
 * Provide via `PluginUiModule.init({ tabRegistry: PageTabRegistryService })`.
 * Used internally by `defineDeclarativePlugin` to register plugin tabs.
 */
export declare const PLUGIN_TAB_REGISTRY: InjectionToken<IDeclarativePageTabRegistry>;
/**
 * Token for the dashboard widget registry.
 * Used internally by `defineDeclarativePlugin` to publish plugin widgets to the
 * dashboard builder's palette.
 */
export declare const PLUGIN_WIDGET_REGISTRY: InjectionToken<IDeclarativeWidgetRegistry>;
/**
 * Minimal interface for applying nav sections/items.
 * Implemented by NavMenuBuilderService from @gauzy/ui-core.
 */
export interface IDeclarativeNavBuilder {
    addNavMenuSection(config: unknown, before?: string): void;
    addNavMenuItems(configs: unknown[], sectionId: string, before?: string): void;
}
/**
 * Minimal interface for registering page routes.
 * Implemented by PageRouteRegistryService from @gauzy/ui-core.
 */
export interface IDeclarativePageRouteRegistry {
    registerPageRoute(config: unknown): void;
    registerPageRoutes(configs: unknown[]): void;
}
/**
 * Options for extension registration (e.g. pluginId for lifecycle cleanup).
 */
export interface IDeclarativeExtensionRegistryOptions {
    pluginId?: string;
}
/**
 * Minimal interface for registering extensions.
 * Implemented by PageExtensionRegistryService from @gauzy/plugin-ui.
 */
export interface IDeclarativeExtensionRegistry {
    register(extension: PageExtensionDefinition, options?: IDeclarativeExtensionRegistryOptions): void;
    registerAll(extensions: PageExtensionDefinition[], options?: IDeclarativeExtensionRegistryOptions): void;
}
/**
 * Minimal interface for registering page tabs.
 * Implemented by PageTabRegistryService from @gauzy/ui-core.
 */
export interface IDeclarativePageTabRegistry {
    registerPageTab(config: unknown): void;
    registerPageTabs(configs: unknown[]): void;
}
/**
 * Minimal interface for registering dashboard-builder widgets.
 * Implemented by WidgetRegistryService from @gauzy/ui-core.
 *
 * `registerOrReplaceWidget` is used (not `registerWidget`) so re-registering a
 * plugin — e.g. after it is toggled off and on — never throws on duplicate ids.
 */
export interface IDeclarativeWidgetRegistry {
    registerOrReplaceWidget(config: unknown): void;
}
/**
 * Minimal interface for plugin translation management (read + write).
 * Structurally compatible with @ngx-translate/core TranslateService (duck typing).
 */
export interface IPluginTranslateService {
    setTranslation(lang: string, translations: Record<string, any>, shouldMerge?: boolean): void;
    getTranslations(lang: string): Readonly<Record<string, any>> | undefined;
    getCurrentLang(): string;
    getFallbackLang(): string | null;
    /** Synchronous translation lookup. Returns the key itself if not found. */
    instant(key: string, params?: Record<string, unknown>): string;
    /** Reactive translation. Re-emits when language or translations change. */
    stream(key: string, params?: Record<string, unknown>): Observable<string>;
    /** Emits whenever the active language changes (after translations are loaded). */
    onLangChange: Observable<{
        lang: string;
    }>;
}
/**
 * Optional InjectionToken for the translate service.
 * Provide via `PluginUiModule.init({ translateService: TranslateService })`.
 * Used internally by `defineDeclarativePlugin` to merge plugin translations.
 */
export declare const PLUGIN_TRANSLATE_SERVICE: InjectionToken<IPluginTranslateService>;
/**
 * Minimal interface for the backing translate service (e.g. `TranslateService` from `@ngx-translate/core`).
 * Used by the built-in `TranslateAdapterService` inside `@gauzy/plugin-ui`.
 *
 * The host application provides the concrete service via:
 * ```typescript
 * { provide: PLUGIN_TRANSLATE_DELEGATE, useExisting: TranslateService }
 * ```
 */
export interface IPluginTranslateDelegate {
    setTranslation(lang: string, translations: Record<string, any>, shouldMerge?: boolean): void;
    getCurrentLang(): string;
    getFallbackLang(): string | null;
    instant(key: string, params?: Record<string, unknown>): string;
    stream(key: string, params?: Record<string, unknown>): Observable<string>;
    onLangChange: Observable<{
        lang: string;
    }>;
}
/**
 * Minimal interface for the backing translate store (e.g. `TranslateStore` from `@ngx-translate/core`).
 * Provides access to compiled translation data by language.
 *
 * The host application provides the concrete store via:
 * ```typescript
 * { provide: PLUGIN_TRANSLATE_STORE_DELEGATE, useExisting: TranslateStore }
 * ```
 */
export interface IPluginTranslateStoreDelegate {
    getTranslations(lang: string): Readonly<Record<string, any>> | undefined;
}
/**
 * InjectionToken for the host application's translate service (e.g. `TranslateService`).
 */
export declare const PLUGIN_TRANSLATE_DELEGATE: InjectionToken<IPluginTranslateDelegate>;
/**
 * InjectionToken for the host application's translate store (e.g. `TranslateStore`).
 */
export declare const PLUGIN_TRANSLATE_STORE_DELEGATE: InjectionToken<IPluginTranslateStoreDelegate>;
/**
 * Minimal interface for checking user permissions.
 * Implement by wrapping your app's permission service (e.g. Store.hasPermission).
 *
 * Provided via `PluginUiModule.init({ permissionChecker: ... })`.
 * Used by `PageExtensionRegistryService` to gate extension visibility.
 */
export interface IPluginPermissionChecker {
    /** Returns true if the user has the specified permission. */
    hasPermission(permission: string): boolean;
    /** Returns true if the user has ALL specified permissions. */
    hasAllPermissions(...permissions: string[]): boolean;
    /** Returns true if the user has ANY of the specified permissions. */
    hasAnyPermission(...permissions: string[]): boolean;
}
/**
 * Minimal interface for checking feature flags.
 * Implement by wrapping your app's feature store (e.g. Store.hasFeatureEnabled).
 *
 * Provided via `PluginUiModule.init({ featureChecker: ... })`.
 * Used by `PageExtensionRegistryService` to gate extension visibility.
 */
export interface IPluginFeatureChecker {
    /** Returns true if the specified feature is enabled. */
    isFeatureEnabled(featureKey: string): boolean;
}
/**
 * Optional InjectionToken for checking user permissions.
 * Provide via `PluginUiModule.init({ permissionChecker: PermissionAdapterService })`.
 * Used by `PageExtensionRegistryService._checkPermissions()`.
 */
export declare const PLUGIN_PERMISSION_CHECKER: InjectionToken<IPluginPermissionChecker>;
/**
 * Optional InjectionToken for checking feature flags.
 * Provide via `PluginUiModule.init({ featureChecker: FeatureAdapterService })`.
 * Used by `PageExtensionRegistryService._checkFeature()`.
 */
export declare const PLUGIN_FEATURE_CHECKER: InjectionToken<IPluginFeatureChecker>;
/**
 * Minimal interface for the application's backing store (e.g. `Store` from `@gauzy/ui-core/core`).
 *
 * Used by the built-in `PermissionAdapterService` and `FeatureAdapterService` inside
 * `@gauzy/plugin-ui`. The host application provides its store via:
 *
 * ```typescript
 * { provide: PLUGIN_APP_STORE, useExisting: Store }
 * ```
 *
 * This avoids a dependency from `@gauzy/plugin-ui` → `@gauzy/ui-core/core`.
 */
export interface IPluginAppStore {
    hasPermission(permission: any): boolean;
    hasAllPermissions(...permissions: any[]): boolean;
    hasAnyPermission(...permissions: any[]): boolean;
    hasFeatureEnabled(featureKey: any): boolean;
}
/**
 * InjectionToken for the host application's backing store.
 *
 * Provide via the root module's `providers` array:
 * ```typescript
 * { provide: PLUGIN_APP_STORE, useExisting: Store }
 * ```
 */
export declare const PLUGIN_APP_STORE: InjectionToken<IPluginAppStore>;
/**
 * Filters incoming translation data to only include keys that don't already
 * exist in the target. Recursively walks nested objects so that new nested
 * keys can be added without overriding existing leaf values.
 *
 * This ensures plugins can only ADD translations — never override core keys.
 *
 * @returns A filtered object containing only new keys, or `null` if nothing is new.
 */
export declare function filterNewTranslationKeys(existing: Record<string, any>, incoming: Record<string, any>): Record<string, any> | null;
/**
 * Options for defining a simple plugin.
 *
 * Supports the full range of declarative fields (routes, tabs, navMenu, etc.)
 * so `definePlugin()` can serve as the single API for both module-based and
 * feature-rich plugins.
 */
export interface DefinePluginOptions {
    /** Page-route registry location (e.g. 'jobs-sections', 'integrations-sections'). */
    location?: string;
    /** Plugin-specific options, available via `inject(PLUGIN_OPTIONS)`. */
    options?: Record<string, unknown>;
    /** Lazy-load the module. Use for code-splitting. */
    loadModule?: () => Promise<Type<any>>;
    /** Declarative page routes. */
    routes?: PluginUiDefinition['routes'];
    /** Declarative nav menu contributions. */
    navMenu?: PluginUiDefinition['navMenu'];
    /** Page tabs to register. */
    tabs?: PluginUiDefinition['tabs'];
    /** Extensions to register at bootstrap. */
    extensions?: PluginUiDefinition['extensions'];
    /** Plugin translations keyed by language code. */
    translations?: PluginUiDefinition['translations'];
    /** Translation namespace prefix. */
    translationNamespace?: PluginUiDefinition['translationNamespace'];
    /** Plugin settings schema. */
    settings?: PluginUiDefinition['settings'];
    /** Semantic version of this plugin. */
    version?: PluginUiDefinition['version'];
    /** Peer plugin requirements. */
    peerPlugins?: PluginUiDefinition['peerPlugins'];
    /** Plugin IDs that must be bootstrapped first. */
    dependsOn?: PluginUiDefinition['dependsOn'];
    /** Feature key for activation predicate. */
    featureKey?: PluginUiDefinition['featureKey'];
    /** Permission keys for activation predicate. */
    permissionKeys?: PluginUiDefinition['permissionKeys'];
    /** Loading strategy (only meaningful with loadModule). */
    loadStrategy?: PluginUiDefinition['loadStrategy'];
}
/**
 * Options for defining a plugin group (parent with child plugins).
 *
 * The `init` option signature is `(opts, base)` where:
 * - `opts` is `{ plugins: PluginUiDefinition[] }` (runtime plugin list to merge)
 * - `base` is the base `PluginUiDefinition` built from the group options
 *
 * The value returned by `definePluginGroup` has an `init` property (`initBound`) that
 * is the same function with `base` already bound, so it takes only
 * `(opts: { plugins: PluginUiDefinition[] })` and returns `PluginUiDefinition`.
 * See `definePluginGroup` for how `base` and `initBound` are constructed.
 */
export interface DefinePluginGroupOptions extends DefinePluginOptions {
    /** Default child plugins. */
    plugins: PluginUiDefinition[];
    /**
     * Optional init factory. Signature: `(opts, base)`.
     * When omitted, defaults to merging `opts.plugins` into base.
     */
    init?: (opts: {
        plugins: PluginUiDefinition[];
    }, base: PluginUiDefinition) => PluginUiDefinition;
}
/**
 * Creates a plugin definition from an NgModule.
 *
 * @param id Unique plugin identifier.
 * @param module Angular module class.
 * @param options Optional location, options, or plugins.
 *
 * @example
 * ```ts
 * export const JobEmployeePlugin = definePlugin('job-employee', JobEmployeeModule, {
 *   location: 'jobs-sections'
 * });
 * ```
 */
export declare function definePlugin(id: string, moduleOrLoad: Type<any> | (() => Promise<Type<any>>), options?: DefinePluginOptions): PluginUiDefinition;
/**
 * Creates a plugin group definition (parent with child plugins).
 *
 * The options `init` (see {@link DefinePluginGroupOptions}) has signature
 * `(opts, base)` where `opts` is `{ plugins: PluginUiDefinition[] }` and
 * `base` is the base `PluginUiDefinition`. The returned object's `init`
 * (`initBound`) is the same function with `base` already bound, so callers
 * pass only `(opts: { plugins: PluginUiDefinition[] })` and receive
 * `PluginUiDefinition`. This pre-binding avoids confusion between the raw
 * init signature and the convenience init on the returned object.
 *
 * @param id Unique plugin identifier.
 * @param module Angular module class (the parent layout/shell).
 * @param options Location, child plugins, and optional init factory.
 *
 * @example
 * ```ts
 * export const JobsPlugin = definePluginGroup('jobs', JobsModule, {
 *   location: 'jobs-sections',
 *   plugins: [JobEmployeePlugin, JobSearchPlugin],
 *   init: (opts, base) => ({ ...base, plugins: opts.plugins })
 * });
 * ```
 *
 * If `init` is omitted, a default merges `opts.plugins` into the base definition.
 */
export declare function definePluginGroup(id: string, module: Type<any>, options: DefinePluginGroupOptions): PluginUiDefinition & {
    init: (opts: {
        plugins: PluginUiDefinition[];
    }) => PluginUiDefinition;
};
/**
 * Extract Angular module classes from an array of UI plugin definitions.
 * Returns modules in top-down order (parent before children) for initialization.
 *
 * @param plugins An array of `PluginUiDefinition` entries (may contain parent plugins with nested plugins).
 * @returns An array of Angular module `Type` references, parent-first order.
 */
export declare function getUIPluginModules(plugins: PluginUiDefinition[]): Type<any>[];
/** Plugin definition with at least one of module or loadModule present (from flattenPlugins output). */
export type PluginUiDefinitionWithModuleOrLoader = PluginUiDefinition & ({
    module: Type<any>;
} | {
    loadModule: () => Promise<Type<any>>;
});
/**
 * Extract (definition, module) pairs from plugin definitions.
 * Includes plugins with either `module` or `loadModule`; for loadModule,
 * the module is resolved async in createPluginInstances.
 *
 * Uses flattenPlugins, then filters with !!p.module || !!p.loadModule so the returned
 * definition is narrowed to PluginUiDefinitionWithModuleOrLoader (at least one present).
 */
export declare function getUIPluginModulesWithDefinitions(plugins: PluginUiDefinition[]): Array<{
    definition: PluginUiDefinitionWithModuleOrLoader;
    module?: Type<any>;
    loadModule?: () => Promise<Type<any>>;
}>;
/**
 * All plugin lifecycle method names (including optional extended hooks).
 */
export declare const PLUGIN_LIFECYCLE_METHOD_NAMES: readonly ["ngOnPluginBootstrap", "ngOnPluginDestroy", "ngOnPluginAfterBootstrap", "ngOnPluginBeforeDestroy", "ngOnPluginBeforeRouteActivate", "ngOnPluginConfigChange"];
/**
 * Merges a plugin's `translations` into the host's ngx-translate bundle, under
 * `translationNamespace` when one is declared.
 *
 * 🛑 Extracted so that **module** plugins can reach it. `defineDeclarativePlugin` builds a
 * `bootstrap` callback that does this, but `PluginUiModule.bootstrapDeclarativePlugins()` only
 * runs `bootstrap` for plugins with **no** `module`/`loadModule`
 * (`bootstrapOnly = allFlat.filter((p) => !!p.bootstrap && !p.module && !p.loadModule)`), and
 * `applyDeclarativeRegistrations()` — the entry point a module plugin calls from
 * `ngOnPluginBootstrap` — handled routes/nav/tabs/extensions/widgets but never translations. A
 * module plugin that shipped `translations` therefore rendered every one of its keys as the raw
 * key at runtime.
 *
 * Timing is the reason this subscribes rather than merging once: calling `setTranslation()`
 * before the core HTTP loader completes marks the language "available" in `TranslateStore` and
 * makes ngx-translate skip the core load entirely. So merge for the language that is already
 * settled (if any), then again on every `onLangChange`.
 *
 * The merge is additive only — `filterNewTranslationKeys()` drops any key the host already has,
 * so a plugin can never override a core string.
 *
 * @param definition The plugin definition carrying `translations` / `translationNamespace`.
 * @param translateService The host translate service; a nullish value makes this a no-op.
 * @returns The `onLangChange` subscription, or `undefined` when nothing was wired up.
 */
export declare function applyPluginTranslations(definition: Pick<PluginUiDefinition, 'translations' | 'translationNamespace'>, translateService?: IPluginTranslateService | null): Subscription | undefined;
/**
 * Applies declarative registrations from a plugin definition.
 * Call this in the plugin module constructor (or ngOnPluginBootstrap) after
 * injecting PLUGIN_DEFINITION, NavMenuBuilderService, and PageRouteRegistryService.
 *
 * @param definition The plugin definition (from inject(PLUGIN_DEFINITION)).
 * @param services Nav builder and/or page route registry. Omit services you don't need.
 *   Pass `translateService` to also merge the plugin's `translations` — module plugins must,
 *   since their auto-generated `bootstrap` callback (which does it for bootstrap-only plugins)
 *   is never invoked. Omitting it preserves the previous behaviour exactly.
 *
 * @example
 * ```ts
 * constructor() {
 *   const def = inject(PLUGIN_DEFINITION);
 *   applyDeclarativeRegistrations(def, {
 *     navBuilder: inject(NavMenuBuilderService),
 *     pageRouteRegistry: inject(PageRouteRegistryService)
 *   });
 * }
 * ```
 */
export declare function applyDeclarativeRegistrations(definition: PluginUiDefinition, services: {
    navBuilder?: IDeclarativeNavBuilder;
    pageRouteRegistry?: IDeclarativePageRouteRegistry;
    pageTabRegistry?: IDeclarativePageTabRegistry;
    pageExtensionRegistry?: IDeclarativeExtensionRegistry;
    widgetRegistry?: IDeclarativeWidgetRegistry;
    translateService?: IPluginTranslateService | null;
}): void;
/**
 * Checks if a plugin instance implements a specific lifecycle method.
 *
 * Performs a runtime typeof check and narrows the type via a type predicate.
 *
 * @param plugin The plugin module instance to inspect.
 * @param lifecycleMethod The lifecycle method name to look for.
 * @returns `true` if the instance has a callable method with that name.
 */
export declare function hasPluginUiLifecycleMethod<M extends keyof PluginUiLifecycleMethods>(plugin: any, lifecycleMethod: M): plugin is {
    [key in M]: PluginUiLifecycleMethods[M];
};
/**
 * Creates a declarative plugin definition with a zero-boilerplate `bootstrap` callback.
 *
 * Use this instead of hand-writing a `bootstrap` function that manually calls
 * `injector.get(NavMenuBuilderService)` etc. The helper auto-generates the callback
 * using the optional InjectionTokens registered by `PluginUiModule.init(services)`.
 *
 * Services are looked up at bootstrap time (not at definition time), so they are
 * always fully initialized when the callback runs.
 *
 * @example
 * ```ts
 * // plugin.ts
 * export const MyPlugin = defineDeclarativePlugin('my-plugin', {
 *   location: 'my-sections',
 *   routes: [MY_ROUTE],
 *   tabs: [MY_TAB],
 * });
 *
 * // bootstrap.module.ts
 * PluginUiModule.init({
 *   navBuilder: NavMenuBuilderService,
 *   routeRegistry: PageRouteRegistryService,
 *   tabRegistry: PageTabRegistryService,
 * })
 * ```
 *
 * @param id Unique plugin identifier.
 * @param definition All other plugin fields except `id` and `bootstrap`.
 */
export declare function defineDeclarativePlugin(id: string, definition: Omit<PluginUiDefinition, 'id' | 'bootstrap'>): PluginUiDefinition;
