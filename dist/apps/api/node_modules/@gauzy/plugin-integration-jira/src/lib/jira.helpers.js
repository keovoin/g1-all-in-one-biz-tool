"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseOptions = exports.parseConfig = void 0;
/**
 * Parses the provided Jira configuration object and returns a new JiraConfig object.
 *
 * @param {JiraConfig} config - The Jira configuration object.
 * @returns {JiraConfig} The parsed Jira configuration.
 */
const parseConfig = (config) => ({
    appName: config.appName,
    appDescription: config.appDescription,
    appKey: config.appKey,
    baseUrl: config.baseUrl,
    vendorName: config.vendorName,
    vendorUrl: config.vendorUrl
});
exports.parseConfig = parseConfig;
/**
 * Parses the provided Jira module options and returns a new JiraModuleOptions object.
 *
 * @param {JiraModuleOptions} options - The Jira module options.
 * @returns {JiraModuleOptions} The parsed Jira module options.
 */
const parseOptions = (options) => ({
    isGlobal: options.isGlobal || false,
    path: options.path,
    config: (0, exports.parseConfig)(options.config)
});
exports.parseOptions = parseOptions;
//# sourceMappingURL=jira.helpers.js.map