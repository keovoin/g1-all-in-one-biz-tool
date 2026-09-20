import { ConfigService } from '@gauzy/config';
/**
 * Resolved view of a single OAuth client used by the auth pipeline.
 *
 * Loaded from the `oauth_clients` registry by
 * `AuthService.resolveOAuthClient`. The plaintext `clientSecret` is NEVER
 * present here — `/token` validates the presented secret against the
 * stored `clientSecretHash` via `OAuthClientService.validateClientSecret`
 * (constant-time scrypt compare).
 */
export interface OAuthAppConfig {
    clientId: string;
    clientSecretHash: string | null;
    redirectUris: string[];
    codeSecret: string;
    name: string;
    description?: string | null;
    allowedScopes: string[];
    allowedGrantTypes: string[];
    pkceRequired: boolean;
    accessTokenTtl: number;
    /** Owning tenant. `null` => global client usable by any tenant. */
    tenantId?: string | null;
    clientType?: string;
}
export interface OAuthAppPendingRequest {
    requestId: string;
    clientId: string;
    redirectUri: string;
    scope?: string;
    state?: string;
    createdAt: number;
}
export interface OAuthAppAuthorizationRequest {
    userId: string;
    tenantId: string;
    clientId: string;
    redirectUri: string;
    scope?: string;
    state?: string;
}
export interface OAuthAppTokenRequest {
    code: string;
    clientId: string;
    clientSecret: string;
    redirectUri: string;
}
export interface OAuthAppTokenResponse {
    accessToken: string;
    expiresIn: number;
    tokenType: string;
    scope: string;
}
/**
 * Base class for social authentication.
 */
export declare abstract class BaseSocialAuth {
    /**
     * Validate OAuth login email.
     *
     * @param args - Arguments for validating OAuth login email.
     * @returns The result of the validation.
     */
    abstract validateOAuthLoginEmail(args: []): any;
}
export declare class SocialAuthService extends BaseSocialAuth {
    protected readonly configService: ConfigService;
    protected readonly clientBaseUrl: string;
    constructor();
    validateOAuthLoginEmail(args: []): any;
    /**
     * Get the client base URL for frontend redirects.
     */
    getClientBaseUrl(): string;
    /**
     * Resolve a single OAuth client by its public `clientId`. The concrete
     * subclass (`AuthService`) loads from the `oauth_clients` registry.
     * Throws if the client does not exist or is inactive — callers map
     * that to `400 invalid_client`.
     */
    resolveOAuthClient(_clientId: string): Promise<OAuthAppConfig>;
    /**
     * Whether the supplied redirect URI is allow-listed for the given
     * resolved OAuth client config. Exact-match, no wildcards.
     */
    isOAuthAppRedirectUriAllowed(redirectUri: string, config: OAuthAppConfig): boolean;
    /**
     * Store a pending OAuth authorization request in cache.
     */
    storeOAuthAppPendingRequest(_request: OAuthAppPendingRequest): Promise<void>;
    /**
     * Retrieve a pending OAuth authorization request from cache.
     */
    getOAuthAppPendingRequest(_requestId: string): Promise<OAuthAppPendingRequest | null>;
    /**
     * Delete a pending OAuth authorization request from cache.
     */
    deleteOAuthAppPendingRequest(_requestId: string): Promise<void>;
    createOAuthAppAuthorizationCode(_request: OAuthAppAuthorizationRequest): Promise<string>;
    exchangeOAuthAppAuthorizationCode(_request: OAuthAppTokenRequest): Promise<OAuthAppTokenResponse>;
    /**
     * Generate a hash for the provided password using scrypt.
     *
     * @param password - The password to hash.
     * @returns A promise that resolves to the hashed password.
     */
    getPasswordHash(password: string): Promise<string>;
    /**
     * Redirect the user based on the success status.
     *
     * @param success - Indicates whether the operation was successful.
     * @param auth - Object containing JWT and userId.
     * @param res - Express response object.
     * @returns The redirect response.
     */
    routeRedirect(success: boolean, auth: {
        jwt: string;
        userId: string;
    }, res: any): Promise<any>;
}
