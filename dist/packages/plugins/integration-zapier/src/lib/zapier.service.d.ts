import { HttpService } from '@nestjs/axios';
import { CommandBus } from '@nestjs/cqrs';
import { ConfigService } from '@gauzy/config';
import { IIntegrationTenant, IIntegrationSetting, ID } from '@gauzy/contracts';
import { IntegrationSettingService, IntegrationService, IntegrationTenantService } from '@gauzy/core';
import { IZapierAccessTokens, IZapierEndpoint, IZapierIntegrationSettings } from './zapier.types';
import { IZapierCreateZapInput, IZapierZap, IZapierZapTemplate } from '@gauzy/contracts';
export declare class ZapierService {
    private readonly _httpService;
    private readonly _commandBus;
    private readonly _integrationSettingService;
    private readonly _integrationService;
    private readonly _integrationTenantService;
    private readonly config;
    private readonly logger;
    constructor(_httpService: HttpService, _commandBus: CommandBus, _integrationSettingService: IntegrationSettingService, _integrationService: IntegrationService, _integrationTenantService: IntegrationTenantService, config: ConfigService);
    /**
     * Fetch data from an external integration API using HTTP GET request.
     *
     * @param {string} url - The URL to fetch data from.
     * @param {string} token - Bearer token for authorization.
     * @returns {Promise<any>} - A promise resolving to the fetched data.
     */
    fetchIntegration<T = any>(url: string, token: string): Promise<any>;
    /**
     * Enhanced method to refresh the token with clearer error handling
     *
     * @param {ID} integrationId - The ID of the integration.
     * @returns {Promise<any>} - The new tokens.
     * @throws {NotFoundException} - When no settings are found for the given integration ID
     * @throws {BadRequestException} - When the refresh token is missing
     */
    refreshToken(integrationId: ID): Promise<IZapierAccessTokens>;
    /**
     * Retrieve the Zapier access token for a given integration.
     *
     * @param {ID} integrationId - The ID of the integration.
     * @returns {Promise<IIntegrationSetting>} - The integration setting containing the access token.
     * @throws {NotFoundException} - If the access token is not found.
     */
    getZapierToken(integrationId: ID): Promise<IIntegrationSetting>;
    /**
     * Generate the authorization URL for the Zapier OAuth flow.
     * @param options.clientId - The OAuth client ID
     * @param options.state - The state parameter for CSRF protection (required)
     * @returns The authorization URL
     * @throws BadRequestException if state is missing or invalid
     */
    getAuthorizationUrl(options?: {
        clientId?: string;
        state?: string;
    }): string;
    /**
     * Validate redirect URI against allowed domains
     */
    private validateRedirectUri;
    /**
     * Validates and atomically deletes the state parameter
     * @param state The state parameter to validate
     * @param tenantId The tenant ID
     * @returns The parsed state if valid, null otherwise
     */
    validateAndDeleteState(state: string, tenantId: string): Promise<{
        state: string;
        expiresAt?: string;
    }>;
    /**
     * Validates the state parameter without deleting it.
     * Searches across all tenants by state value so it works from @Public() endpoints.
     *
     * @param state The state parameter to validate
     * @returns The parsed state data if valid (includes tenantId and integrationId)
     * @throws {BadRequestException} If state is invalid or expired
     */
    parseAuthState(state: string): Promise<{
        state: string;
        tenantId?: string;
        integrationId?: string;
        expiresAt?: string;
    }>;
    /**
     * Stores the state parameter with an expiration timestamp
     * @param state The state parameter to store
     * @param tenantId The tenant ID
     * @param integrationId The integration ID
     * @param organizationId Optional organization ID
     */
    private storeStateWithExpiration;
    /**
     * Store integration credentials using server-side config.
     * Client credentials (client_id, client_secret) are read from environment variables
     * and are never exposed to or stored in tenant records.
     */
    storeIntegrationCredentials(input: {
        organizationId: string;
        state: string;
    }): Promise<IIntegrationTenant>;
    /**
     * Complete the OAuth flow by exchanging the authorization code for tokens.
     * Accepts tenantId as a parameter so it works from @Public() callback endpoints.
     *
     * @param code The authorization code from Zapier
     * @param state The state parameter for CSRF validation
     * @param tenantId The tenant ID (from parsed state or RequestContext)
     */
    completeOAuthFlow(code: string, state: string, tenantId?: string): Promise<IIntegrationTenant>;
    /**
     * Fetches and returns a list of triggers from Zapier.
     *
     * @param {string} token - The access token for authentication with the Zapier API.
     * @returns {Promise<IZapierEndpoint[]>} - A promise that resolves to an array of Zapier triggers.
     * @throws {Error} - Throws an error if the fetch operation fails.
     */
    fetchTriggers(token: string): Promise<IZapierEndpoint[]>;
    /**
     * Fetches and returns a list of actions from Zapier.
     *
     * @param {string} token - The access token for authentication with the Zapier API.
     * @returns {Promise<IZapierEndpoint[]>} - A promise that resolves to an array of Zapier actions.
     * @throws {Error} - Throws an error if the fetch operation fails.
     */
    fetchActions(token: string): Promise<IZapierEndpoint[]>;
    /**
     * Fetches the list of Zaps belonging to the authenticated user.
     * See https://docs.zapier.com/powered-by-zapier/api-reference/zaps/get-zaps-[v2]
     *
     * @param {string} token - The access token for authentication with the Zapier API.
     * @returns {Promise<IZapierZap[]>} - A promise that resolves to an array of Zaps.
     */
    fetchZaps(token: string): Promise<IZapierZap[]>;
    /**
     * Creates a new Zap on behalf of the authenticated user.
     * See https://docs.zapier.com/powered-by-zapier/api-reference/zaps/create-a-zap
     *
     * @param {IZapierCreateZapInput} input - The Zap creation payload (title and steps).
     * @param {string} token - The access token for authentication with the Zapier API.
     * @returns {Promise<IZapierZap>} - A promise that resolves to the created Zap.
     */
    createZap(input: IZapierCreateZapInput, token: string): Promise<IZapierZap>;
    /**
     * Fetches publicly available Zap templates from Zapier.
     * See https://docs.zapier.com/powered-by-zapier/api-reference/zap-templates/get-zap-templates
     *
     * Zap templates are a public endpoint and do not require an OAuth access token.
     * Per the Zapier docs, the endpoint lives at /v1/zap-templates and requires the
     * server-configured `client_id` to be passed as a query parameter.
     * See https://docs.zapier.com/powered-by-zapier/api-reference/zap-templates/get-zap-templates
     *
     * @param {number} [limit] - Optional page size to forward to Zapier.
     * @returns {Promise<IZapierZapTemplate[]>} - A promise that resolves to an array of Zap templates.
     */
    fetchZapTemplates(limit?: number): Promise<IZapierZapTemplate[]>;
    /**
     * Retrieves the Zapier integration tenant associated with the given access token.
     * @param token - The OAuth access token to verify.
     * @returns The matching IIntegrationTenant.
     * @throws NotFoundException if the token is invalid or no Zapier integration is found.
     */
    findIntegrationByToken(token: string): Promise<IIntegrationTenant>;
    /**
     * Find the Zapier IntegrationTenant for a given tenantId and (optionally) organizationId.
     * When organizationId is provided the lookup is scoped to that org, preventing
     * ambiguous matches in tenants with multiple organizations.
     *
     * @param tenantId - The tenant ID (from JWT)
     * @param organizationId - The organization ID (from JWT, optional)
     * @returns The matching IIntegrationTenant
     * @throws NotFoundException if no Zapier integration exists for this tenant
     */
    findIntegrationByTenantId(tenantId: string, organizationId?: string): Promise<IIntegrationTenant>;
    /**
     * Resolve the Zapier integration from a Bearer token.
     * Tries opaque token lookup first (backward compatibility), then
     * falls back to JWT verification + tenantId lookup for tokens
     * issued by the multi-app OAuth system.
     *
     * @param token - The Bearer token (opaque or JWT)
     * @returns The matching IIntegrationTenant
     * @throws NotFoundException if neither lookup succeeds
     */
    resolveIntegrationFromBearerToken(token: string): Promise<IIntegrationTenant>;
    /**
     * Verify a JWT token issued by the multi-app OAuth system.
     *
     * @param token - The JWT token to verify
     * @returns The decoded payload containing id (userId) and tenantId
     * @throws UnauthorizedException if the token is invalid or expired
     */
    verifyJwtToken(token: string): {
        id: string;
        tenantId: string;
        organizationId?: string;
    };
    /**
     * Resolve the tenant integration by searching for a Gauzy-issued authorization code.
     * Auth codes are stored per-integration with tenantId, so this reliably maps
     * the code to the correct tenant regardless of shared global client_id.
     *
     * @param code - The Gauzy-issued authorization code
     * @returns The matching IIntegrationTenant
     * @throws NotFoundException if the code is invalid or expired
     */
    findIntegrationByAuthCode(code: string): Promise<IIntegrationTenant>;
    /**
     * Resolve the tenant integration by searching for a Gauzy-issued refresh token.
     * Refresh tokens are stored per-integration with tenantId, so this reliably maps
     * the token to the correct tenant regardless of shared global client_id.
     *
     * @param refreshToken - The Gauzy-issued refresh token
     * @returns The matching IIntegrationTenant
     * @throws NotFoundException if the token is invalid
     */
    findIntegrationByGauzyRefreshToken(refreshToken: string): Promise<IIntegrationTenant>;
    /**
     * Validate that the provided client_id and client_secret match the server-side
     * Zapier OAuth configuration. This replaces the old approach of looking up
     * credentials in tenant integration records.
     *
     * @param clientId - The client_id from the request
     * @param clientSecret - The client_secret from the request
     * @throws BadRequestException if credentials don't match server config
     */
    validateServerClientCredentials(clientId: string, clientSecret: string): void;
    /**
     * Store access and refresh tokens for an integration
     * @param integrationId - The integration ID
     * @param accessToken - The access token to store
     * @param refreshToken - The refresh token to store
     */
    storeTokens(integrationId: ID, accessToken: string, refreshToken: string): Promise<void>;
    /**
     * Generates and stores new access and refresh tokens for an integration
     * @param integrationId The integration ID
     * @returns The generated tokens
     */
    generateAndStoreNewTokens(integrationId: ID): Promise<IZapierAccessTokens>;
    /**
     * Refresh token using refresh token (alternative to refreshToken method)
     * @param integrationId - The integration ID
     * @param refreshToken - The refresh token to verify
     * @returns New access and refresh tokens
     * @throws NotFoundException if integration or refresh token is invalid
     */
    refreshTokenByRefreshToken(integrationId: ID, refreshToken: string): Promise<IZapierAccessTokens>;
    /**
     * Store a short-lived authorization code for the OAuth flow.
     * The code is single-use and expires in 10 minutes.
     *
     * @param integrationId The integration ID
     * @param code The authorization code
     * @param redirectUri The redirect URI used in the authorization request
     */
    storeAuthCode(integrationId: ID, code: string, redirectUri: string): Promise<void>;
    /**
     * Validate and consume an authorization code (single-use, atomic delete).
     * Uses a conditional delete (id + original settingsValue) to prevent
     * concurrent requests from both validating and minting tokens.
     *
     * @param integrationId The integration ID
     * @param code The authorization code to validate
     * @param redirectUri The redirect URI to verify against the stored one
     * @throws BadRequestException if code is invalid, expired, already consumed, or redirect_uri mismatch
     */
    validateAndConsumeAuthCode(integrationId: ID, code: string, redirectUri: string): Promise<void>;
    /**
     * Retrieves the Zapier integration settings for the current tenant.
     *
     * @param {string} [organizationId] - Optional organization ID to filter settings
     * @returns {Promise<IZapierIntegrationSettings>} A promise that resolves with the tenant's Zapier integration settings
     */
    getIntegrationSettings(organizationId?: string): Promise<IZapierIntegrationSettings>;
}
