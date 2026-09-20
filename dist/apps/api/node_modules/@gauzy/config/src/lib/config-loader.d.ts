import { ApplicationPluginConfig } from '@gauzy/common';
/**
 * Merges provided configuration with the existing default configuration.
 *
 * @param {Partial<ApplicationPluginConfig>} providedConfig - The configuration values to merge.
 * @returns {Promise<void>} - Resolves once the configuration is successfully updated.
 */
export declare function defineConfig(providedConfig: Partial<ApplicationPluginConfig>): Promise<void>;
/**
 * Retrieves the current application configuration.
 *
 * @returns {Readonly<ApplicationPluginConfig>} - A frozen copy of the current configuration.
 */
export declare function getConfig(): Readonly<ApplicationPluginConfig>;
/**
 * Resets the configuration to its default values.
 */
export declare function resetConfig(): void;
