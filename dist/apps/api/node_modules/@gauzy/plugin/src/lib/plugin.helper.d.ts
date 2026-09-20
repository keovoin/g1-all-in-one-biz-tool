import { DynamicModule, Type } from '@nestjs/common';
import { PluginLifecycleMethods } from './plugin.interface';
/**
 * Get plugin entities classes from an array of plugins.
 * @param plugins An array of plugins containing entity metadata.
 * @returns An array of entity classes obtained from the provided plugins.
 */
export declare function getEntitiesFromPlugins(plugins?: Array<Type<any> | DynamicModule>): Array<Type<any>>;
/**
 * Get subscribers from an array of plugins.
 * @param plugins An array of plugins containing subscriber metadata.
 * @returns An array of subscriber classes obtained from the provided plugins.
 */
export declare function getSubscribersFromPlugins(plugins?: Array<Type<any> | DynamicModule>): Array<Type<any>>;
/**
 * Get plugin extensions from an array of plugins by reflecting metadata.
 * @param plugins An array of plugins containing extension metadata.
 * @returns An array of extensions obtained from the provided plugins.
 */
export declare function getPluginExtensions(plugins: Array<Type<any> | DynamicModule>): any[];
/**
 * Get plugin configuration from an array of plugins by reflecting metadata.
 * @param plugins An array of plugins containing configuration metadata.
 * @returns An array of configurations obtained from the provided plugins.
 */
export declare function getPluginConfigurations(plugins?: (Type<any> | DynamicModule)[]): any[];
/**
 * Get plugin modules from an array of plugins.
 * @param plugins An array of plugins.
 * @returns An array of modules obtained from the provided plugins.
 */
export declare function getPluginModules(plugins: Array<Type<any> | DynamicModule>): Array<Type<any>>;
/**
 * Checks if a plugin has a specific lifecycle method.
 * @param plugin The plugin instance to check.
 * @param lifecycleMethod The lifecycle method to check for.
 * @returns True if the plugin has the specified lifecycle method, false otherwise.
 */
export declare function hasLifecycleMethod<M extends keyof PluginLifecycleMethods>(plugin: any, lifecycleMethod: M): plugin is {
    [key in M]: PluginLifecycleMethods[M];
};
/**
 * Checks if a given type is a DynamicModule.
 * @param type The type to check.
 * @returns True if the type is a DynamicModule, false otherwise.
 */
export declare function isDynamicModule(type: Type<any> | DynamicModule): type is DynamicModule;
/**
 * Reflects metadata from a dynamic module, extracting information about controllers, providers,
 * imports, and exports.
 * @param module The dynamic module to reflect metadata from.
 * @returns An object containing metadata information about controllers, providers, imports, and exports.
 */
export declare function reflectDynamicModuleMetadata(module: Type<any>): {
    controllers: any;
    providers: any;
    imports: any;
    exports: any;
};
/**
 * Retrieves dynamic plugin modules based on the configuration.
 * @returns An array of DynamicModule instances extracted from the configuration.
 */
export declare function getDynamicPluginsModules(): DynamicModule[];
