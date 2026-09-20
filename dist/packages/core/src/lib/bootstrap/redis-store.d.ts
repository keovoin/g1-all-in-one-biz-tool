/**
 * Configures session store with Redis or falls back to in-memory session management.
 *
 * @param app - The Express application instance.
 * @param env - Environment variables for configuration.
 */
export declare function configureRedisSession(app: any): Promise<void>;
