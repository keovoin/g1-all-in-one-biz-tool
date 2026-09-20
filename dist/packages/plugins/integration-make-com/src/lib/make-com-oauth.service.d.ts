import { HttpService } from '@nestjs/axios';
import { Cache } from 'cache-manager';
import { ConfigService } from '@gauzy/config';
import { CommandBus } from '@nestjs/cqrs';
import { IntegrationService, IntegrationSettingService, IntegrationTenantService } from '@gauzy/core';
import { IMakeComOAuthTokens } from './interfaces/make-com.model';
import { MakeComService } from './make-com.service';
export declare class MakeComOAuthService {
    private readonly httpService;
    private readonly config;
    private readonly makeComService;
    private readonly integrationSettingService;
    private readonly integrationTenantService;
    private readonly integrationService;
    private readonly commandBus;
    private readonly cacheManager;
    private readonly logger;
    private static readonly STATE_TTL_MS;
    private static readonly STATE_CACHE_KEY_PREFIX;
    constructor(httpService: HttpService, config: ConfigService, makeComService: MakeComService, integrationSettingService: IntegrationSettingService, integrationTenantService: IntegrationTenantService, integrationService: IntegrationService, commandBus: CommandBus, cacheManager: Cache);
    /**
     * Generate a cryptographically secure random code verifier for PKCE.
     */
    private generateCodeVerifier;
    /**
     * Generate code challenge from code verifier using SHA256.
     */
    private generateCodeChallenge;
    /**
     * Generate the authorization URL for the Make.com OAuth v2 flow with PKCE.
     * Make.com requires code_challenge even for confidential clients.
     *
     * @see https://developers.make.com/api-documentation/authentication/oauth-flow/authorization-code-flow-with-refresh-token-confidential-clients
     */
    getAuthorizationUrl(options?: {
        state?: string;
        clientId?: string;
        organizationId?: string;
    }): Promise<string>;
    exchangeCodeForToken(code: string, state: string, codeVerifier?: string): Promise<IMakeComOAuthTokens>;
    /**
     * Get integration tenant by tenantId and organizationId
     */
    private getIntegrationTenant;
    /**
     * Get setting value from integration tenant
     */
    private getSettingValue;
    /**
     * Save the OAuth tokens as integration settings.
     */
    private saveIntegrationSettings;
    /**
     * Verify the state parameter to prevent CSRF attacks and return the PKCE code verifier.
     * Uses Redis-backed cache for multi-replica support and process restart durability.
     */
    verifyState(state: string): Promise<{
        isValid: boolean;
        codeVerifier?: string;
    }>;
    /**
     * Store the state parameter and PKCE code verifier for later verification.
     * Uses Redis-backed cache with TTL for multi-replica support and process restart durability.
     *
     * @param {string} state - The state parameter to store.
     * @param {string} codeVerifier - The PKCE code verifier to store.
     */
    private storeStateForVerification;
    /**
     * Clean up expired state parameters.
     * Note: With Redis-backed cache and TTL, this is no longer needed as Redis handles expiration automatically.
     * Kept for backward compatibility but does nothing.
     */
    private cleanupExpiredStates;
    /**
     * Handles the callback from Make.com OAuth flow.
     * Verifies the state parameter and exchanges the authorization code for tokens using PKCE.
     */
    handleAuthorizationCallback(code: string, state: string): Promise<void>;
    /**
     * Refreshes the access token for the Make.com integration.
     *
     * @param {string} integrationId - The ID of the integration to refresh the token for.
     * @returns {Promise<void>} A promise that resolves when the token has been refreshed.
     */
    refreshToken(integrationId: string): Promise<void>;
    /**
     * Get the access token for a Make.com integration.
     *
     * @param {string} integrationId - The ID of the integration.
     * @returns {Promise<string>} The access token.
     */
    getAccessToken(integrationId: string): Promise<string>;
}
