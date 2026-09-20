/**
 * OAuth 2.0 Token Validation Utilities
 *
 * This module provides utilities for validating OAuth 2.0 access tokens
 * according to RFC 6749, RFC 7662, and RFC 8707 specifications.
 */
import { Request } from 'express';
import { AuthorizationConfig, TokenValidationResult, AuthorizationError } from '../interfaces';
export declare class OAuthValidator {
    private config;
    private tokenCache;
    private securityLogger;
    private josePromise;
    constructor(config: AuthorizationConfig);
    /**
     * Dynamically import jose library to handle ESM compatibility
     */
    private getJose;
    /**
     * Normalize scopes from various formats to string array
     */
    private normalizeScopes;
    /**
     * Extract Bearer token from Authorization header
     */
    extractBearerToken(req: Request): string | null;
    /**
     * Validate access token according to OAuth 2.0 specifications
     */
    validateToken(token: string, requiredScopes?: string[]): Promise<TokenValidationResult>;
    /**
     * Validate JWT token using production libraries (RFC 7519)
     */
    private validateJWT;
    /**
     * Introspect token using OAuth 2.0 Token Introspection (RFC 7662)
     */
    private introspectToken;
    /**
     * Validate that token has required scopes
     */
    private validateScopes;
    /**
     * Validate audience claim according to RFC 8707
     */
    private validateAudience;
    /**
     * Cache token validation result
     */
    private cacheToken;
    /**
     * Get cached token validation result
     */
    private getCachedToken;
    /**
     * Clean up expired cache entries
     */
    private cleanupCache;
    /**
     * Create OAuth 2.0 error response
     */
    static createAuthorizationError(error: AuthorizationError['error'], description?: string, scope?: string, errorUri?: string): AuthorizationError;
    /**
     * Format WWW-Authenticate header for 401 responses (RFC 9728 Section 5.1)
     */
    static formatWWWAuthenticateHeader(resourceMetadataUrl: string, error?: AuthorizationError): string;
}
