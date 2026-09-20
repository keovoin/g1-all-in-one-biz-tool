import { ITokenConfig } from './interfaces';
/**
 * Scoped Token Configuration
 * Provides access to a specific token type's configuration
 * Used for dependency injection with specific token types
 */
export declare class ScopedTokenConfig {
    private readonly config;
    constructor(config: ITokenConfig);
    /**
     * Get the token type this config is scoped to
     */
    get tokenType(): string;
    /**
     * Get the full configuration
     */
    get configuration(): ITokenConfig;
    /**
     * Get expiration in milliseconds
     */
    get expirationMs(): number | undefined;
    /**
     * Get inactivity threshold in milliseconds
     */
    get threshold(): number | undefined;
    /**
     * Check if rotation is allowed
     */
    get allowRotation(): boolean;
    /**
     * Check if multiple sessions are allowed
     */
    get allowMultipleSessions(): boolean;
    /**
     * Get max usage count
     */
    get maxUsageCount(): number | undefined;
}
