/**
 * Metadata keys used in plugins for defining various aspects like entities, subscribers, and configurations.
 */
export declare const PLUGIN_METADATA: {
    /**
     * Key representing the entities registered within the plugin.
     */
    readonly ENTITIES: "entities";
    /**
     * Key representing event subscribers within the plugin.
     */
    readonly SUBSCRIBERS: "subscribers";
    /**
     * Key representing the extensions registered within the plugin.
     */
    readonly EXTENSIONS: "extensions";
    /**
     * Key representing configuration settings of the plugin.
     */
    readonly CONFIGURATION: "configuration";
};
/**
 * Type definition for valid plugin metadata keys.
 */
export type PluginMetadataKey = (typeof PLUGIN_METADATA)[keyof typeof PLUGIN_METADATA];
