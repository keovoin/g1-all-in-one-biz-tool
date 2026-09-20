/**
 * OAuth 2.0 Authorization Code Management
 *
 * Manages authorization codes for OAuth 2.0 authorization code flow
 */
export interface AuthorizationCode {
    code: string;
    clientId: string;
    userId: string;
    redirectUri: string;
    scopes: string[];
    codeChallenge?: string;
    codeChallengeMethod?: 'S256' | 'plain';
    state?: string;
    createdAt: Date;
    expiresAt: Date;
    isUsed: boolean;
    metadata?: Record<string, any>;
}
export interface AuthorizationRequest {
    clientId: string;
    redirectUri: string;
    scopes: string[];
    state?: string;
    codeChallenge?: string;
    codeChallengeMethod?: 'S256' | 'plain';
    responseType: string;
}
export interface TokenExchangeRequest {
    code: string;
    clientId: string;
    clientSecret?: string;
    redirectUri: string;
    grantType: string;
    codeVerifier?: string;
}
export declare class OAuth2AuthorizationCodeManager {
    private codes;
    private securityLogger;
    private cleanupInterval;
    private readonly CODE_EXPIRATION_TIME;
    private readonly MAX_CODES;
    /**
     * Redact authorization code for logging (show first 4 + '...' + last 4 characters)
     */
    private redactAuthorizationCode;
    constructor();
    /**
     * Generate authorization code for user consent
     */
    generateAuthorizationCode(clientId: string, userId: string, redirectUri: string, scopes: string[], options?: {
        state?: string;
        codeChallenge?: string;
        codeChallengeMethod?: 'S256' | 'plain';
        metadata?: Record<string, any>;
    }): string;
    /**
     * Exchange authorization code for token information
     */
    exchangeAuthorizationCode(code: string, clientId: string, redirectUri: string, codeVerifier?: string): AuthorizationCode | null;
    /**
     * Validate PKCE challenge
     */
    private validatePKCE;
    /**
     * Generate secure authorization code
     */
    private generateSecureCode;
    /**
     * Clean up expired authorization codes
     */
    private cleanupExpiredCodes;
    /**
     * Get authorization code details (for debugging)
     */
    getAuthorizationCode(code: string): AuthorizationCode | null;
    /**
     * Get statistics
     */
    getStats(): {
        totalCodes: number;
        activeCodes: number;
        expiredCodes: number;
    };
    /**
     * Cleanup and destroy
     */
    destroy(): void;
}
export declare const oAuth2AuthorizationCodeManager: OAuth2AuthorizationCodeManager;
