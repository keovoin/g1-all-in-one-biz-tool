/**
 * OAuth 2.0 JWT Token Management
 *
 * Manages JWT access tokens and refresh tokens for OAuth 2.0 flows
 */
export interface TokenPair {
    accessToken: string;
    refreshToken?: string;
    tokenType: 'Bearer';
    expiresIn: number;
    scope: string;
    issuedAt: number;
}
export interface TokenPayload {
    sub: string;
    aud: string;
    iss: string;
    iat: number;
    exp: number;
    nbf?: number;
    jti: string;
    client_id: string;
    scope: string;
    token_type: 'access_token' | 'refresh_token';
    [key: string]: any;
}
export interface RefreshToken {
    tokenId: string;
    userId: string;
    clientId: string;
    scopes: string[];
    createdAt: Date;
    expiresAt: Date;
    isRevoked: boolean;
    parentTokenId?: string;
}
interface KeyPair {
    publicKey: string;
    privateKey: string;
    keyId: string;
    algorithm: 'RS256' | 'ES256';
}
export declare class OAuth2TokenManager {
    private issuer;
    private audience;
    private securityLogger;
    private refreshTokens;
    private keyPair;
    private cleanupInterval;
    private josePromise;
    private readonly ACCESS_TOKEN_EXPIRATION;
    private readonly REFRESH_TOKEN_EXPIRATION;
    private readonly MAX_REFRESH_TOKENS;
    private readonly CLOCK_SKEW_SECONDS;
    constructor(issuer: string, audience: string, keyPair?: KeyPair);
    /**
     * Dynamically import jose library to handle ESM compatibility
     */
    private getJose;
    /**
     * Generate JWT token pair (access + refresh tokens)
     */
    generateTokenPair(userId: string, clientId: string, scopes: string[], options?: {
        includeRefreshToken?: boolean;
        customClaims?: Record<string, any>;
    }): Promise<TokenPair>;
    /**
     * Refresh access token using refresh token
     */
    refreshAccessToken(refreshTokenString: string, clientId: string): Promise<TokenPair | null>;
    /**
     * Revoke refresh token
     */
    revokeToken(tokenId: string): boolean;
    /**
     * Sign JWT token
     */
    private signToken;
    /**
     * Verify JWT token
     */
    private verifyToken;
    /**
     * Get public key for JWT verification (JWKS format)
     */
    getPublicKeyJWKS(): any;
    /**
     * Get JWKS (JSON Web Key Set)
     */
    getJWKS(): {
        keys: any[];
    };
    /**
     * Get public key in PEM format for JWT validation
     */
    getPublicKeyPEM(): string;
    /**
     * Generate key pair for JWT signing (RSA or ECDSA)
     */
    private generateKeyPair;
    /**
     * Clean up expired refresh tokens
     */
    private cleanupExpiredTokens;
    /**
     * Get token statistics
     */
    getStats(): {
        totalRefreshTokens: number;
        activeRefreshTokens: number;
        revokedTokens: number;
        keyId: string;
        algorithm: string;
    };
    /**
     * Cleanup and destroy
     */
    destroy(): void;
}
export {};
