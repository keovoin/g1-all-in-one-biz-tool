import { IJwtService } from './interfaces/jwt-service.interface';
import { ITokenConfig } from './interfaces';
export declare class TokenConfigRegistry {
    private readonly configs;
    private readonly jwtServices;
    /**
     * Register a new token type configuration
     */
    register(config: ITokenConfig): void;
    /**
     * Register JWT service for a token type
     */
    registerJwtService(tokenType: string, jwtService: IJwtService): void;
    /**
     * Get configuration for a token type
     */
    getConfig(tokenType: string): ITokenConfig;
    /**
     * Get JWT service for a token type
     */
    getJwtService(tokenType: string): IJwtService;
    /**
     * Check if a token type is registered
     */
    hasConfig(tokenType: string): boolean;
    /**
     * Get all registered token types
     */
    getRegisteredTypes(): string[];
    /**
     * Unregister a token type (for testing or dynamic configurations)
     */
    unregister(tokenType: string): void;
}
