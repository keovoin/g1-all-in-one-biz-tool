/**
 * OAuth 2.0 Client Management
 *
 * Manages OAuth 2.0 client registration and validation for MCP authorization
 */
import { ClientRegistrationResponse } from '../interfaces';
export interface OAuth2Client {
    clientId: string;
    clientSecret?: string;
    clientSecretHash?: string;
    clientName: string;
    clientType: 'confidential' | 'public';
    redirectUris: string[];
    grantTypes: string[];
    responseTypes: string[];
    scopes: string[];
    logoUri?: string;
    clientUri?: string;
    policyUri?: string;
    tosUri?: string;
    createdAt: Date;
    updatedAt: Date;
    isActive: boolean;
    metadata?: Record<string, any>;
}
export interface ClientRegistrationRequest {
    client_name: string;
    client_type?: 'confidential' | 'public';
    redirect_uris: string[];
    grant_types?: string[];
    response_types?: string[];
    scope?: string;
    logo_uri?: string;
    client_uri?: string;
    policy_uri?: string;
    tos_uri?: string;
    metadata?: Record<string, any>;
}
export declare class OAuth2ClientManager {
    private clients;
    private securityLogger;
    private readonly DEFAULT_SCOPES;
    private readonly DEFAULT_GRANT_TYPES;
    private readonly DEFAULT_RESPONSE_TYPES;
    constructor();
    /**
     * Register well-known MCP clients (ChatGPT, Claude) as public clients.
     *
     * These are the primary MCP ecosystem clients with stable, well-known redirect URIs.
     * Pre-registering them allows out-of-the-box connectivity without manual setup.
     *
     * - All default clients are public (no secrets stored)
     * - Registration is non-blocking: if a client ID already exists (e.g., admin registered
     *   a custom one), the default is silently skipped
     * - Additional clients can be registered dynamically via POST /oauth2/register
     */
    registerDefaultClients(): Promise<void>;
    /**
     * Register a new OAuth 2.0 client (public or confidential)
     *
     * - Public clients: No client_secret is generated (e.g., SPAs, native apps)
     * - Confidential clients: A client_secret is generated and hashed (e.g., server-side apps)
     *
     * Clients can also be registered dynamically via POST /oauth2/register.
     */
    registerClient(request: ClientRegistrationRequest, customClientId?: string): Promise<ClientRegistrationResponse>;
    /**
     * Validate client credentials
     */
    validateClient(clientId: string, clientSecret?: string): Promise<OAuth2Client | null>;
    /**
     * Get client by ID
     */
    getClient(clientId: string): OAuth2Client | null;
    /**
     * Validate redirect URI for client
     */
    isValidRedirectUri(clientId: string, redirectUri: string): boolean;
    /**
     * Check if client supports grant type
     */
    supportsGrantType(clientId: string, grantType: string): boolean;
    /**
     * Check if client has required scopes
     */
    hasScope(clientId: string, requiredScope: string): boolean;
    /**
     * List all clients (for admin purposes)
     */
    listClients(): OAuth2Client[];
    /**
     * Generate client ID
     */
    private generateClientId;
    /**
     * Generate client secret
     */
    private generateClientSecret;
    /**
     * Validate client registration request
     */
    private validateClientRegistration;
    /**
     * Validate redirect URIs
     */
    private validateRedirectUris;
    /**
     * Parse and validate scopes
     */
    private parseAndValidateScopes;
}
export declare const oAuth2ClientManager: OAuth2ClientManager;
