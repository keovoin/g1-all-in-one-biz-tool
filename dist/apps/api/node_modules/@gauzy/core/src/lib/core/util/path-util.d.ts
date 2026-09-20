/**
 * Resolves a file path based on the current environment (production or development).
 *
 * @param {string} distPath - The relative path for the production environment.
 * @param {string} devPath - The relative path for the development environment.
 * @returns {string} - The resolved absolute file path.
 */
export declare function resolveEnvironmentPath(distPath: string, devPath: string): string;
/**
 * Gets the public directory path for the API.
 *
 * @returns {string} - The resolved absolute public directory path.
 */
export declare function getApiPublicPath(): string;
