/**
 * Load environment variables from a specified file.
 *
 * @param {string} envPath - The absolute path to the .env file.
 * @param {object} options - Options for dotenv configuration.
 * @param {boolean} [options.override=false] - Whether to override existing environment variables.
 */
export declare function loadEnvFile(envPath: string, options?: {
    override?: boolean;
    quiet?: boolean;
}): void;
/**
 * Load environment variables from .env and .env.local files.
 */
export declare function loadEnv(): void;
