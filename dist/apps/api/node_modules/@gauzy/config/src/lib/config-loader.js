"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defineConfig = defineConfig;
exports.getConfig = getConfig;
exports.resetConfig = resetConfig;
const utils_1 = require("@gauzy/utils");
const default_config_1 = require("./default-config");
let currentAppConfig = { ...default_config_1.defaultConfiguration };
/**
 * Merges provided configuration with the existing default configuration.
 *
 * @param {Partial<ApplicationPluginConfig>} providedConfig - The configuration values to merge.
 * @returns {Promise<void>} - Resolves once the configuration is successfully updated.
 */
async function defineConfig(providedConfig) {
    if (!providedConfig || typeof providedConfig !== 'object') {
        throw new Error('Invalid configuration provided. Expected a non-empty object.');
    }
    currentAppConfig = await (0, utils_1.deepMerge)(currentAppConfig, providedConfig);
}
/**
 * Retrieves the current application configuration.
 *
 * @returns {Readonly<ApplicationPluginConfig>} - A frozen copy of the current configuration.
 */
function getConfig() {
    return Object.freeze({ ...currentAppConfig });
}
/**
 * Resets the configuration to its default values.
 */
function resetConfig() {
    currentAppConfig = { ...default_config_1.defaultConfiguration };
    console.log('Gauzy Config Reset to Defaults');
}
//# sourceMappingURL=config-loader.js.map