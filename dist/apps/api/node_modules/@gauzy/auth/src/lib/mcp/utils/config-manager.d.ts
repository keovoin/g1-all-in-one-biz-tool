/**
 * Configuration Manager
 *
 * Centralized configuration management following DRY principle
 * Provides consistent configuration parsing and validation
 */
import { AuthorizationConfig } from '../interfaces/authorization-config';
import { OAuth2ServerConfig } from '../server/oauth-authorization-server';
export interface ServerConfig {
    host: string;
    port: number;
    mcpAuthUrl: string;
    baseUrl: string;
    environment: 'development' | 'production' | 'stage';
    sessionSecret: string;
    corsOrigins: string[];
    trustedProxies: string[];
    rateLimitEnabled: boolean;
    rateLimitTtl: number;
    rateLimitMax: number;
    redisUrl?: string;
    oauth: AuthorizationConfig;
}
export declare class ConfigManager {
    private static instance;
    private config;
    private securityLogger;
    private constructor();
    private normalizeBaseUrl;
    private normalizeAuthUrl;
    private deepClone;
    private getEnvEnvironment;
    static getInstance(): ConfigManager;
    /**
     * Get the current configuration
     */
    getConfig(): ServerConfig;
    /**
     * Get OAuth configuration
     */
    getOAuthConfig(): AuthorizationConfig;
    /**
     * Get OAuth server configuration for embedded server
     */
    getOAuthServerConfig(): OAuth2ServerConfig;
    /**
     * Load configuration from environment variables with validation
     */
    private loadConfiguration;
    /**
     * Load OAuth 2.0 configuration with defaults
     */
    private loadOAuthConfiguration;
    /**
     * Validate configuration for common issues
     */
    private validateConfiguration;
    /**
     * Helper methods for environment variable parsing
     */
    private getEnvString;
    private getRequiredEnvString;
    private getEnvNumber;
    private getEnvBoolean;
    private parseStringArray;
}
