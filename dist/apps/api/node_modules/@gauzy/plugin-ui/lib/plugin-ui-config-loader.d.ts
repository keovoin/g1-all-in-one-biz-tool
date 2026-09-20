import { PluginUiConfig } from './plugin-ui.types';
/**
 * Config loader function type. Applications provide this to load their
 * own UI configuration (e.g. from a compile-time module or runtime endpoint).
 */
export type PluginUiConfigLoader = () => Promise<{
    uiPluginConfig: PluginUiConfig;
}>;
/**
 * Loads, validates, and stores the application UI configuration,
 * making it available via `getPluginUiConfig()` from `@gauzy/plugin-ui`.
 *
 * Must be awaited **before** `platformBrowser().bootstrapModule()`
 * so that every Angular module, service, and component can safely
 * call `getPluginUiConfig()` during initialization.
 *
 * The config source is supplied by the host application (e.g. a compile-time
 * TypeScript module or a JSON endpoint), keeping the door open for runtime
 * sources without changing the plugin-ui package.
 *
 * @param configuration Async function that returns the application's UI config.
 * @throws If the configuration is structurally invalid.
 *
 * @example
 * ```ts
 * loadPluginUiConfig(() => import('./app/plugin-ui.config'))
 *   .then(() => platformBrowser().bootstrapModule(AppBootstrapModule))
 *   .catch((err) => console.error(err));
 * ```
 */
export declare function loadPluginUiConfig(configuration: PluginUiConfigLoader): Promise<void>;
