import { PluginMetadata } from './plugin.interface';
/**
 * Decorator function for extending NestJS features with additional metadata.
 *
 * @param pluginMetadata Metadata to be applied to the target class.
 * @returns Class decorator function.
 */
export declare function GauzyCorePlugin(pluginMetadata: PluginMetadata): ClassDecorator;
