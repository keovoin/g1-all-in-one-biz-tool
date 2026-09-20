import { DestroyRef, InjectionToken } from '@angular/core';
import { flattenPlugins } from './plugin-ui.types';
import { PageExtensionRegistryService } from './plugin-extension/page-extension-registry.service';
import { PluginSettingsRegistryService } from './plugin-host/plugin-settings-registry.service';
import { namespaceTranslations } from './plugin-i18n-namespace';
// ─── Declarative service tokens ──────────────────────────────────────────────
/**
 * Optional InjectionToken for the nav-menu builder service.
 * Provide via `PluginUiModule.init({ navBuilder: NavMenuBuilderService })`.
 * Used internally by `defineDeclarativePlugin` to wire up nav contributions.
 */
export const PLUGIN_NAV_BUILDER = new InjectionToken('PLUGIN_NAV_BUILDER');
/**
 * Optional InjectionToken for the page-route registry service.
 * Provide via `PluginUiModule.init({ routeRegistry: PageRouteRegistryService })`.
 * Used internally by `defineDeclarativePlugin` to register plugin routes.
 */
export const PLUGIN_ROUTE_REGISTRY = new InjectionToken('PLUGIN_ROUTE_REGISTRY');
/**
 * Optional InjectionToken for the page-tab registry service.
 * Provide via `PluginUiModule.init({ tabRegistry: PageTabRegistryService })`.
 * Used internally by `defineDeclarativePlugin` to register plugin tabs.
 */
export const PLUGIN_TAB_REGISTRY = new InjectionToken('PLUGIN_TAB_REGISTRY');
/**
 * Token for the dashboard widget registry.
 * Used internally by `defineDeclarativePlugin` to publish plugin widgets to the
 * dashboard builder's palette.
 */
export const PLUGIN_WIDGET_REGISTRY = new InjectionToken('PLUGIN_WIDGET_REGISTRY');
/**
 * Optional InjectionToken for the translate service.
 * Provide via `PluginUiModule.init({ translateService: TranslateService })`.
 * Used internally by `defineDeclarativePlugin` to merge plugin translations.
 */
export const PLUGIN_TRANSLATE_SERVICE = new InjectionToken('PLUGIN_TRANSLATE_SERVICE');
/**
 * InjectionToken for the host application's translate service (e.g. `TranslateService`).
 */
export const PLUGIN_TRANSLATE_DELEGATE = new InjectionToken('PLUGIN_TRANSLATE_DELEGATE');
/**
 * InjectionToken for the host application's translate store (e.g. `TranslateStore`).
 */
export const PLUGIN_TRANSLATE_STORE_DELEGATE = new InjectionToken('PLUGIN_TRANSLATE_STORE_DELEGATE');
/**
 * Optional InjectionToken for checking user permissions.
 * Provide via `PluginUiModule.init({ permissionChecker: PermissionAdapterService })`.
 * Used by `PageExtensionRegistryService._checkPermissions()`.
 */
export const PLUGIN_PERMISSION_CHECKER = new InjectionToken('PLUGIN_PERMISSION_CHECKER');
/**
 * Optional InjectionToken for checking feature flags.
 * Provide via `PluginUiModule.init({ featureChecker: FeatureAdapterService })`.
 * Used by `PageExtensionRegistryService._checkFeature()`.
 */
export const PLUGIN_FEATURE_CHECKER = new InjectionToken('PLUGIN_FEATURE_CHECKER');
/**
 * InjectionToken for the host application's backing store.
 *
 * Provide via the root module's `providers` array:
 * ```typescript
 * { provide: PLUGIN_APP_STORE, useExisting: Store }
 * ```
 */
export const PLUGIN_APP_STORE = new InjectionToken('PLUGIN_APP_STORE');
/**
 * Filters incoming translation data to only include keys that don't already
 * exist in the target. Recursively walks nested objects so that new nested
 * keys can be added without overriding existing leaf values.
 *
 * This ensures plugins can only ADD translations — never override core keys.
 *
 * @returns A filtered object containing only new keys, or `null` if nothing is new.
 */
export function filterNewTranslationKeys(existing, incoming) {
    const result = {};
    let hasNewKeys = false;
    for (const [key, value] of Object.entries(incoming)) {
        if (!(key in existing)) {
            // Key doesn't exist in core — include it entirely
            result[key] = value;
            hasNewKeys = true;
        }
        else if (typeof value === 'object' &&
            value !== null &&
            !Array.isArray(value) &&
            typeof existing[key] === 'object' &&
            existing[key] !== null &&
            !Array.isArray(existing[key])) {
            // Both are objects — recurse to find new nested keys
            const nested = filterNewTranslationKeys(existing[key], value);
            if (nested) {
                result[key] = nested;
                hasNewKeys = true;
            }
        }
        // Leaf key already exists in core → skip (never override)
    }
    return hasNewKeys ? result : null;
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
export function definePlugin(id, moduleOrLoad, options) {
    const isLoader = typeof moduleOrLoad === 'function' && !moduleOrLoad.prototype;
    return {
        id,
        module: isLoader ? undefined : moduleOrLoad,
        loadModule: isLoader ? moduleOrLoad : options?.loadModule,
        location: options?.location,
        options: options?.options,
        routes: options?.routes,
        navMenu: options?.navMenu,
        tabs: options?.tabs,
        extensions: options?.extensions,
        translations: options?.translations,
        translationNamespace: options?.translationNamespace,
        settings: options?.settings,
        version: options?.version,
        peerPlugins: options?.peerPlugins,
        dependsOn: options?.dependsOn,
        featureKey: options?.featureKey,
        permissionKeys: options?.permissionKeys,
        loadStrategy: options?.loadStrategy
    };
}
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
export function definePluginGroup(id, module, options) {
    const base = {
        id,
        module,
        location: options.location,
        plugins: options.plugins,
        options: options.options
    };
    const init = options.init ??
        ((opts, b) => ({
            ...b,
            plugins: opts.plugins
        }));
    const initBound = (opts) => init(opts, base);
    return Object.assign(base, { init: initBound });
}
/**
 * Extract Angular module classes from an array of UI plugin definitions.
 * Returns modules in top-down order (parent before children) for initialization.
 *
 * @param plugins An array of `PluginUiDefinition` entries (may contain parent plugins with nested plugins).
 * @returns An array of Angular module `Type` references, parent-first order.
 */
export function getUIPluginModules(plugins) {
    const flat = flattenPlugins(plugins);
    return flat.filter((p) => !!p.module).map((p) => p.module);
}
/**
 * Extract (definition, module) pairs from plugin definitions.
 * Includes plugins with either `module` or `loadModule`; for loadModule,
 * the module is resolved async in createPluginInstances.
 *
 * Uses flattenPlugins, then filters with !!p.module || !!p.loadModule so the returned
 * definition is narrowed to PluginUiDefinitionWithModuleOrLoader (at least one present).
 */
export function getUIPluginModulesWithDefinitions(plugins) {
    const flat = flattenPlugins(plugins);
    return flat
        .filter((p) => !!p.module || !!p.loadModule)
        .map((definition) => ({
        definition,
        module: definition.module,
        loadModule: definition.loadModule
    }));
}
/**
 * All plugin lifecycle method names (including optional extended hooks).
 */
export const PLUGIN_LIFECYCLE_METHOD_NAMES = [
    'ngOnPluginBootstrap',
    'ngOnPluginDestroy',
    'ngOnPluginAfterBootstrap',
    'ngOnPluginBeforeDestroy',
    'ngOnPluginBeforeRouteActivate',
    'ngOnPluginConfigChange'
];
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
export function applyPluginTranslations(definition, translateService) {
    if (!definition.translations || !translateService)
        return undefined;
    // Namespace isolation: wrap the bundle under the namespace key so plugins never
    // collide with core or with each other.
    const translations = definition.translationNamespace
        ? namespaceTranslations(definition.translationNamespace, definition.translations)
        : definition.translations;
    const mergeForLang = (lang) => {
        const fallbackLang = translateService.getFallbackLang() || 'en';
        const data = translations[lang] ?? translations[fallbackLang];
        if (!data)
            return;
        const existing = translateService.getTranslations(lang);
        // An empty bundle means core has not loaded yet — merging now would suppress its
        // HTTP load. `onLangChange` fires again once it has, and this runs then.
        if (existing && Object.keys(existing).length > 0) {
            const newKeys = filterNewTranslationKeys(existing, data);
            if (newKeys) {
                translateService.setTranslation(lang, newKeys, true);
            }
        }
    };
    const currentLang = translateService.getCurrentLang();
    if (currentLang) {
        mergeForLang(currentLang);
    }
    return translateService.onLangChange.subscribe(({ lang }) => mergeForLang(lang));
}
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
export function applyDeclarativeRegistrations(definition, services) {
    const { navBuilder, pageRouteRegistry, pageTabRegistry, pageExtensionRegistry, widgetRegistry, translateService } = services;
    if (pageRouteRegistry && definition.routes?.length) {
        for (const r of definition.routes) {
            pageRouteRegistry.registerPageRoute(r);
        }
    }
    if (navBuilder && definition.navMenu?.length) {
        for (const entry of definition.navMenu) {
            if (entry.type === 'section') {
                navBuilder.addNavMenuItems(entry.items, entry.sectionId, entry.before);
            }
            else {
                navBuilder.addNavMenuSection(entry.config, entry.before);
            }
        }
    }
    if (pageTabRegistry && definition.tabs?.length) {
        for (const tab of definition.tabs) {
            // Map PluginTabInput.path → PageTabRegistryConfig.route (used by NbRouteTabset)
            pageTabRegistry.registerPageTab({ ...tab, route: tab.path });
        }
    }
    if (pageExtensionRegistry && definition.extensions?.length) {
        pageExtensionRegistry.registerAll(definition.extensions, { pluginId: definition.id });
    }
    // Dashboard-builder widgets contributed by this plugin. Registered here —
    // alongside routes/tabs/nav — rather than through plugin `providers`,
    // because declarative providers live in a child EnvironmentInjector whose
    // app initializers never run (APP_INITIALIZER fires only for the root).
    if (widgetRegistry && definition.widgets?.length) {
        for (const widget of definition.widgets) {
            // Isolated per widget: `registerOrReplaceWidget` throws on a malformed
            // entry, and letting that escape would abort the rest of
            // `defineDeclarativePlugin` — translations and settings included — over
            // one bad widget.
            try {
                widgetRegistry.registerOrReplaceWidget(widget);
            }
            catch (error) {
                console.error(`[${definition.id}] failed to register a dashboard widget`, error);
            }
        }
    }
    // Opt-in: only a caller that passes `translateService` gets its translations merged, so
    // every existing call site keeps its exact previous behaviour. The subscription is
    // deliberately not retained — a module plugin lives for the application lifetime, which is
    // the same lifetime `defineDeclarativePlugin` gives it when no `DestroyRef` is available.
    applyPluginTranslations(definition, translateService);
}
/**
 * Checks if a plugin instance implements a specific lifecycle method.
 *
 * Performs a runtime typeof check and narrows the type via a type predicate.
 *
 * @param plugin The plugin module instance to inspect.
 * @param lifecycleMethod The lifecycle method name to look for.
 * @returns `true` if the instance has a callable method with that name.
 */
export function hasPluginUiLifecycleMethod(plugin, lifecycleMethod) {
    return typeof plugin?.[lifecycleMethod] === 'function';
}
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
export function defineDeclarativePlugin(id, definition) {
    const plugin = { ...definition, id };
    plugin.bootstrap = (injector) => {
        // Apply all declarative registrations (nav, routes, tabs, extensions) using the injected services.
        applyDeclarativeRegistrations(plugin, {
            navBuilder: injector.get(PLUGIN_NAV_BUILDER, null) ?? undefined,
            pageRouteRegistry: injector.get(PLUGIN_ROUTE_REGISTRY, null) ?? undefined,
            pageTabRegistry: injector.get(PLUGIN_TAB_REGISTRY, null) ?? undefined,
            pageExtensionRegistry: injector.get(PageExtensionRegistryService, null) ?? undefined,
            widgetRegistry: injector.get(PLUGIN_WIDGET_REGISTRY, null) ?? undefined
        });
        // Merge plugin translations into the global @ngx-translate namespace.
        // Safe merge: only adds new keys, never overrides core translations.
        //
        // IMPORTANT: Plugin translations must be merged AFTER core translations
        // are loaded. Calling setTranslation() before the core HTTP loader
        // completes would mark the language as "available" in TranslateStore,
        // causing ngx-translate to skip the HTTP load entirely — breaking
        // all core translations.
        //
        // Strategy: subscribe to onLangChange (fires after core translations
        // are loaded) and merge plugin translations on each language switch.
        // Also handle the case where the language was already loaded before
        // plugin bootstrap (merge immediately for the current language).
        if (plugin.translations) {
            const langSub = applyPluginTranslations(plugin, injector.get(PLUGIN_TRANSLATE_SERVICE, null));
            // Auto-unsubscribe when the injector is destroyed (e.g., dynamic plugin unload).
            // For statically bootstrapped plugins, DestroyRef may not be available — in that
            // case the subscription intentionally lives for the app lifetime.
            if (langSub) {
                const destroyRef = injector.get(DestroyRef, null);
                if (destroyRef) {
                    destroyRef.onDestroy(() => langSub.unsubscribe());
                }
            }
        }
        // Register plugin settings schema with the settings registry.
        if (plugin.settings) {
            const settingsRegistry = injector.get(PluginSettingsRegistryService, null);
            if (settingsRegistry) {
                settingsRegistry.register(id, plugin.settings);
            }
        }
    };
    return plugin;
}
//# sourceMappingURL=plugin-ui.helper.js.map