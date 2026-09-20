"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveEnvironmentPath = resolveEnvironmentPath;
exports.getApiPublicPath = getApiPublicPath;
const path = require("path");
/**
 * Resolves a file path based on the current environment (production or development).
 *
 * @param {string} distPath - The relative path for the production environment.
 * @param {string} devPath - The relative path for the development environment.
 * @returns {string} - The resolved absolute file path.
 */
function resolveEnvironmentPath(distPath, devPath) {
    const isProduction = __dirname.includes(path.join('dist'));
    const relativePath = isProduction ? distPath : devPath;
    return path.resolve(process.cwd(), relativePath);
}
/**
 * Gets the public directory path for the API.
 *
 * @returns {string} - The resolved absolute public directory path.
 */
function getApiPublicPath() {
    return resolveEnvironmentPath('apps/api/public', 'apps/api/public');
}
//# sourceMappingURL=path-util.js.map