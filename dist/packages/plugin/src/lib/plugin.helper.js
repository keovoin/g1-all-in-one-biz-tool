"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEntitiesFromPlugins = getEntitiesFromPlugins;
exports.getSubscribersFromPlugins = getSubscribersFromPlugins;
exports.getPluginExtensions = getPluginExtensions;
exports.getPluginConfigurations = getPluginConfigurations;
exports.getPluginModules = getPluginModules;
exports.hasLifecycleMethod = hasLifecycleMethod;
exports.isDynamicModule = isDynamicModule;
exports.reflectDynamicModuleMetadata = reflectDynamicModuleMetadata;
exports.getDynamicPluginsModules = getDynamicPluginsModules;
const constants_1 = require("@nestjs/common/constants");
const config_1 = require("@gauzy/config");
const utils_1 = require("@gauzy/utils");
const plugin_metadata_1 = require("./plugin-metadata");
/**
 * Get plugin classes from an array of plugins by reflecting metadata.
 * @param plugins An array of plugins containing metadata.
 * @param metadataKey The metadata key to retrieve from plugins.
 * @returns An array of classes obtained from the provided plugins and metadata key.
 */
function getClassesFromPlugins(plugins, metadataKey) {
    if (!plugins) {
        return [];
    }
    return plugins.flatMap((plugin) => reflectMetadata(plugin, metadataKey) ?? []);
}
/**
 * Get plugin entities classes from an array of plugins.
 * @param plugins An array of plugins containing entity metadata.
 * @returns An array of entity classes obtained from the provided plugins.
 */
function getEntitiesFromPlugins(plugins) {
    return getClassesFromPlugins(plugins, plugin_metadata_1.PLUGIN_METADATA.ENTITIES);
}
/**
 * Get subscribers from an array of plugins.
 * @param plugins An array of plugins containing subscriber metadata.
 * @returns An array of subscriber classes obtained from the provided plugins.
 */
function getSubscribersFromPlugins(plugins) {
    return getClassesFromPlugins(plugins, plugin_metadata_1.PLUGIN_METADATA.SUBSCRIBERS);
}
/**
 * Get plugin extensions from an array of plugins by reflecting metadata.
 * @param plugins An array of plugins containing extension metadata.
 * @returns An array of extensions obtained from the provided plugins.
 */
function getPluginExtensions(plugins) {
    if (!plugins) {
        return [];
    }
    return plugins.flatMap((plugin) => reflectMetadata(plugin, plugin_metadata_1.PLUGIN_METADATA.EXTENSIONS) ?? []);
}
/**
 * Get plugin configuration from an array of plugins by reflecting metadata.
 * @param plugins An array of plugins containing configuration metadata.
 * @returns An array of configurations obtained from the provided plugins.
 */
function getPluginConfigurations(plugins = []) {
    if (!plugins) {
        return [];
    }
    return plugins.flatMap((plugin) => reflectMetadata(plugin, plugin_metadata_1.PLUGIN_METADATA.CONFIGURATION) || []);
}
/**
 * Get plugin modules from an array of plugins.
 * @param plugins An array of plugins.
 * @returns An array of modules obtained from the provided plugins.
 */
function getPluginModules(plugins) {
    return plugins.map((plugin) => {
        if (isDynamicModule(plugin)) {
            const { module } = plugin;
            return module;
        }
        return plugin;
    });
}
/**
 * Reflect metadata for a given metatype and metadata key.
 * @param metatype The type or dynamic module to reflect metadata from.
 * @param metadataKey The key for the metadata to be reflected.
 * @returns The metadata associated with the given key.
 */
function reflectMetadata(metatype, metadataKey) {
    // Extract the module property if the metatype is a DynamicModule
    const target = isDynamicModule(metatype) ? metatype.module : metatype;
    // Retrieve and return metadata for the specified key
    return Reflect.getMetadata(metadataKey, target);
}
/**
 * Checks if a plugin has a specific lifecycle method.
 * @param plugin The plugin instance to check.
 * @param lifecycleMethod The lifecycle method to check for.
 * @returns True if the plugin has the specified lifecycle method, false otherwise.
 */
function hasLifecycleMethod(plugin, lifecycleMethod) {
    return typeof plugin[lifecycleMethod] === 'function';
}
/**
 * Checks if a given type is a DynamicModule.
 * @param type The type to check.
 * @returns True if the type is a DynamicModule, false otherwise.
 */
function isDynamicModule(type) {
    return !!type.module;
}
/**
 * Reflects metadata from a dynamic module, extracting information about controllers, providers,
 * imports, and exports.
 * @param module The dynamic module to reflect metadata from.
 * @returns An object containing metadata information about controllers, providers, imports, and exports.
 */
function reflectDynamicModuleMetadata(module) {
    return {
        controllers: reflectMetadata(module, constants_1.MODULE_METADATA.CONTROLLERS) || [],
        providers: reflectMetadata(module, constants_1.MODULE_METADATA.PROVIDERS) || [],
        imports: reflectMetadata(module, constants_1.MODULE_METADATA.IMPORTS) || [],
        exports: reflectMetadata(module, constants_1.MODULE_METADATA.EXPORTS) || []
    };
}
/**
 * Retrieves dynamic plugin modules based on the configuration.
 * @returns An array of DynamicModule instances extracted from the configuration.
 */
function getDynamicPluginsModules() {
    const plugins = (0, config_1.getConfig)().plugins;
    return plugins
        .map((plugin) => {
        const pluginModule = isDynamicModule(plugin) ? plugin.module : plugin;
        const { imports, providers, exports } = reflectDynamicModuleMetadata(pluginModule);
        return {
            module: pluginModule,
            imports,
            exports,
            providers: [...providers]
        };
    })
        .filter(utils_1.isNotEmpty);
}
//# sourceMappingURL=plugin.helper.js.map