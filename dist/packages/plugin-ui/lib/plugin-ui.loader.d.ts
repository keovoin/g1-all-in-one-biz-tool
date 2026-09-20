import { PluginUiConfig } from './plugin-ui.types';
/**
 * Stores the application UI configuration.
 *
 * Freezes the configuration object to prevent accidental mutation after bootstrap.
 *
 * Must be called before Angular bootstraps so that `getPluginUiConfig()` can be used
 * safely from any module/service/component.
 */
export declare function setPluginUiConfig(config: PluginUiConfig): void;
/**
 * Retrieves the current application UI configuration.
 *
 * @throws If called before `setPluginUiConfig()` has been invoked.
 * @returns A frozen `PluginUiConfig` object.
 */
export declare function getPluginUiConfig(): Readonly<PluginUiConfig>;
/**
 * Resets the configuration to undefined. Primarily useful for testing.
 */
export declare function resetPluginUiConfig(): void;
