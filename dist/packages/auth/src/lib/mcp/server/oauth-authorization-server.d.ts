/**
 * OAuth 2.0 Authorization Server
 *
 * Complete OAuth 2.0 authorization server implementation for MCP
 * Supports authorization code flow with PKCE, client credentials, and refresh tokens
 */
import express from 'express';
import { OAuth2TokenManager } from './oauth-token-manager';
export interface OAuth2ServerConfig {
    issuer: string;
    baseUrl: string;
    audience: string;
    enableClientRegistration: boolean;
    authorizationEndpoint: string;
    tokenEndpoint: string;
    jwksEndpoint: string;
    registrationEndpoint?: string;
    introspectionEndpoint?: string;
    userInfoEndpoint?: string;
    loginEndpoint?: string;
    sessionSecret: string;
    redisUrl?: string;
    userInfoProvider?: (userId: string) => Promise<UserInfo | null>;
    userAuthenticator?: (credentials: LoginCredentials) => Promise<AuthenticatedUser | null>;
}
export interface UserInfo {
    userId: string;
    email: string;
    name?: string;
    organizationId?: string;
    tenantId?: string;
    roles?: string[];
    emailVerified?: boolean;
    picture?: string;
}
export interface AuthenticatedUser extends UserInfo {
    accessToken?: string;
    refreshToken?: string;
}
export interface LoginCredentials {
    email: string;
    password: string;
}
export interface IntrospectionRequest {
    token: string;
    token_type_hint?: 'access_token' | 'refresh_token';
}
export interface AuthorizeRequest {
    response_type: string;
    client_id: string;
    redirect_uri: string;
    scope?: string;
    state?: string;
    code_challenge?: string;
    code_challenge_method?: 'S256' | 'plain';
}
export interface TokenRequest {
    grant_type: string;
    code?: string;
    redirect_uri?: string;
    client_id?: string;
    client_secret?: string;
    code_verifier?: string;
    refresh_token?: string;
    scope?: string;
}
export declare class OAuth2AuthorizationServer {
    private config;
    private app;
    private tokenManager;
    private oAuthValidator;
    private securityLogger;
    private errorHandler;
    private responseBuilder;
    private configManager;
    private userInfoProvider?;
    private authenticateUser?;
    private csrfProtection;
    private generateToken;
    constructor(config: OAuth2ServerConfig);
    /**
     * Extracts cookie domain from baseUrl for HTTPS connections
     * @param isHttps Whether the connection is HTTPS
     * @returns The hostname if valid domain, undefined for IPs/localhost or non-HTTPS
     */
    private extractCookieDomain;
    private initializeCSRFProtection;
    /**
     * Set user info provider for user consent and token claims
     */
    setUserInfoProvider(provider: (userId: string) => Promise<UserInfo | null>): void;
    /**
     * Set user authentication provider
     */
    setUserAuthenticator(authenticator: (credentials: LoginCredentials) => Promise<AuthenticatedUser | null>): void;
    /**
     * Validate required configuration and providers
     * Fails fast in production when required providers are not configured
     */
    private validateConfiguration;
    /**
     * Setup middleware
     */
    private setupMiddleware;
    /**
     * Setup OAuth 2.0 endpoints
     */
    private setupRoutes;
    /**
     * Handle test callback endpoint (for development/testing)
     */
    private handleTestCallback;
    /**
     * Handle authorization server metadata
     */
    private handleAuthorizationServerMetadata;
    /**
     * Handle JWKS endpoint
     */
    private handleJWKS;
    /**
     * Handle login page with CSRF token
     */
    private handleLoginPage;
    private static readonly ALLOWED_RETURN_PATHS;
    private normalizeReturnUrl;
    /**
     * Handle login submission
     */
    private handleLogin;
    /**
     * Handle authorization endpoint (user consent) with CSRF token from forms
     */
    private handleAuthorize;
    /**
     * Handle authorization consent submission
     */
    private handleAuthorizationConsent;
    /**
     * Handle token endpoint
     */
    private handleToken;
    /**
     * Handle authorization code grant
     */
    private handleAuthorizationCodeGrant;
    /**
     * Handle refresh token grant
     */
    private handleRefreshTokenGrant;
    /**
     * Handle client credentials grant
     */
    private handleClientCredentialsGrant;
    /**
     * Handle client registration
     */
    private handleClientRegistration;
    /**
     * Handle token introspection (RFC 7662)
     */
    private handleTokenIntrospection;
    /**
     * Handle user info endpoint (OpenID Connect)
     */
    private handleUserInfo;
    /**
     * Generate login form with CSRF token
     */
    private generateLoginForm;
    /**
     * Build login form HTML (simplified)
     */
    private buildLoginFormHtml;
    /**
     * Get common CSS styles for forms
     */
    private getCommonStyles;
    /**
     * Get human-readable error message
     */
    private getErrorMessage;
    /**
     * Generate user consent form with CSRF token
     */
    private generateConsentForm;
    /**
     * Get scope descriptions mapping
     */
    private getScopeDescriptions;
    /**
     * Build consent form HTML (simplified)
     */
    private buildConsentFormHtml;
    /**
     * Get consent form styles
     */
    private getConsentFormStyles;
    /**
     * Build user info section for consent form
     */
    private buildUserInfoSection;
    /**
     * Build scopes section for consent form
     */
    private buildScopesSection;
    /**
     * Build security notice section
     */
    private buildSecurityNotice;
    /**
     * Build consent form section
     */
    private buildConsentForm;
    /**
     * Build consent form footer
     */
    private buildConsentFooter;
    /**
     * Get Express app instance
     */
    getApp(): express.Application;
    /**
     * Get token manager instance
     */
    getTokenManager(): OAuth2TokenManager;
    /**
     * Get server statistics
     */
    getStats(): {
        clients: number;
        authorizationCodes: {
            totalCodes: number;
            activeCodes: number;
            expiredCodes: number;
        };
        tokens: {
            totalRefreshTokens: number;
            activeRefreshTokens: number;
            revokedTokens: number;
            keyId: string;
            algorithm: string;
        };
    };
    /**
     * Register error handling with CSRF error support
     */
    private setupErrorHandling;
}
