"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createJitsu = exports.parseConfig = exports.parseOptions = void 0;
const config_1 = require("@gauzy/config");
const js_1 = require("@jitsu/js");
const node_fetch_1 = require("node-fetch");
/**
 * Parses the options for Jitsu Analytics.
 * @param options The input options object.
 * @returns A record containing parsed Jitsu module options.
 */
const parseOptions = (options) => ({
    // If the 'isGlobal' property is defined in the input options, use its value; otherwise, default to true.
    isGlobal: options.isGlobal ?? true,
    // Parse the configuration using the 'parseConfig' function and assign the result to the 'config' property.
    config: (0, exports.parseConfig)(options.config) //
});
exports.parseOptions = parseOptions;
/**
 * Parse the configuration for Jitsu Analytics.
 * @param config The input configuration object.
 * @returns A record containing Jitsu configuration properties.
 */
const parseConfig = (config) => ({
    host: config.host || config_1.environment.jitsu.serverHost || '', // Use serverHost from environment or empty string as default
    writeKey: config.writeKey || config_1.environment.jitsu.serverWriteKey || '', // Use serverWriteKey from environment or empty string as default
    debug: config.debug || false, // Use debug from input config or false as default
    echoEvents: config.echoEvents || false // Use echoEvents from input config or false as default
});
exports.parseConfig = parseConfig;
/**
 * Create a Jitsu Analytics instance.
 * @param opts The JitsuOptions object for configuration.
 * @returns An instance of Jitsu Analytics.
 */
const createJitsu = (opts) => {
    // Parse the configuration options
    const config = (0, exports.parseConfig)(opts);
    if (!config.host || !config.writeKey) {
        return;
    }
    config.fetch = node_fetch_1.default; // Assign the 'fetch' function to 'fetch'
    // Create and return a Jitsu Analytics instance with the parsed configuration properties
    return (0, js_1.jitsuAnalytics)({
        ...config // Spread the parsed configuration properties
    });
};
exports.createJitsu = createJitsu;
//# sourceMappingURL=jitsu-helper.js.map