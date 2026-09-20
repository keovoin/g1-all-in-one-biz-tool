"use strict";
/**
 * OAuth 2.0 JWT Token Management
 *
 * Manages JWT access tokens and refresh tokens for OAuth 2.0 flows
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.OAuth2TokenManager = void 0;
const tslib_1 = require("tslib");
const crypto = tslib_1.__importStar(require("node:crypto"));
const security_logger_1 = require("../utils/security-logger");
class OAuth2TokenManager {
    constructor(issuer, audience, keyPair) {
        this.issuer = issuer;
        this.audience = audience;
        this.refreshTokens = new Map();
        this.josePromise = null;
        // Token expiration times
        this.ACCESS_TOKEN_EXPIRATION = 15 * 60; // 15 minutes
        this.REFRESH_TOKEN_EXPIRATION = 30 * 24 * 60 * 60; // 30 days
        this.MAX_REFRESH_TOKENS = 10000;
        this.CLOCK_SKEW_SECONDS = 30;
        this.securityLogger = new security_logger_1.SecurityLogger();
        // Use provided key pair or generate new one
        this.keyPair = keyPair || this.generateKeyPair();
        this.cleanupInterval = setInterval(() => this.cleanupExpiredTokens(), 60 * 60 * 1000);
        // Do not keep process alive just for cleanup
        this.cleanupInterval.unref();
    }
    /**
     * Dynamically import jose library to handle ESM compatibility
     */
    async getJose() {
        if (!this.josePromise) {
            this.josePromise = Promise.resolve().then(() => tslib_1.__importStar(require('jose')));
        }
        return this.josePromise;
    }
    /**
     * Generate JWT token pair (access + refresh tokens)
     */
    async generateTokenPair(userId, clientId, scopes, options = {}) {
        const now = Math.floor(Date.now() / 1000);
        const scopeString = scopes.join(' ');
        const jti = crypto.randomUUID();
        // Create access token payload
        const reserved = ['sub', 'aud', 'iss', 'iat', 'exp', 'nbf', 'jti', 'client_id', 'scope', 'token_type'];
        const safeCustomClaims = Object.fromEntries(Object.entries(options.customClaims ?? {}).filter(([k]) => !reserved.includes(k)));
        const accessTokenPayload = {
            sub: userId,
            aud: this.audience,
            iss: this.issuer,
            iat: now,
            exp: now + this.ACCESS_TOKEN_EXPIRATION,
            // Tolerate small clock skew
            nbf: now - this.CLOCK_SKEW_SECONDS,
            jti,
            client_id: clientId,
            scope: scopeString,
            token_type: 'access_token',
            ...safeCustomClaims
        };
        // Sign access token
        const accessToken = await this.signToken(accessTokenPayload);
        let refreshToken;
        // Generate refresh token if requested
        if (options.includeRefreshToken) {
            const refreshTokenId = crypto.randomUUID();
            const refreshTokenExpires = new Date(Date.now() + (this.REFRESH_TOKEN_EXPIRATION * 1000));
            // Store refresh token metadata
            this.refreshTokens.set(refreshTokenId, {
                tokenId: refreshTokenId,
                userId,
                clientId,
                scopes,
                createdAt: new Date(),
                expiresAt: refreshTokenExpires,
                isRevoked: false
            });
            // Create refresh token payload
            const reserved = ['sub', 'aud', 'iss', 'iat', 'exp', 'nbf', 'jti', 'client_id', 'scope', 'token_type'];
            const safeCustomClaims = Object.fromEntries(Object.entries(options.customClaims ?? {}).filter(([k]) => !reserved.includes(k)));
            const refreshTokenPayload = {
                sub: userId,
                aud: this.audience,
                iss: this.issuer,
                iat: now,
                exp: now + this.REFRESH_TOKEN_EXPIRATION,
                // Tolerate small clock skew like access tokens
                nbf: now - this.CLOCK_SKEW_SECONDS,
                jti: refreshTokenId,
                client_id: clientId,
                scope: scopeString,
                token_type: 'refresh_token',
                ...safeCustomClaims
            };
            refreshToken = await this.signToken(refreshTokenPayload);
        }
        this.securityLogger.debug(`Token pair generated for user ${userId}, client ${clientId}`);
        return {
            accessToken,
            refreshToken,
            tokenType: 'Bearer',
            expiresIn: this.ACCESS_TOKEN_EXPIRATION,
            scope: scopeString,
            issuedAt: now
        };
    }
    /**
     * Refresh access token using refresh token
     */
    async refreshAccessToken(refreshTokenString, clientId) {
        try {
            // Verify refresh token
            const payload = await this.verifyToken(refreshTokenString);
            if (payload.token_type !== 'refresh_token') {
                this.securityLogger.warn('Invalid token type for refresh');
                return null;
            }
            // Check refresh token metadata
            const refreshTokenMeta = this.refreshTokens.get(payload.jti);
            if (!refreshTokenMeta || refreshTokenMeta.isRevoked) {
                this.securityLogger.warn(`Refresh token not found or revoked: ${payload.jti}`);
                return null;
            }
            // Validate client
            if (refreshTokenMeta.clientId !== clientId) {
                this.securityLogger.warn(`Client mismatch for refresh token: ${payload.jti}`);
                return null;
            }
            // Check expiration
            if (new Date() > refreshTokenMeta.expiresAt) {
                this.securityLogger.warn(`Refresh token expired: ${payload.jti}`);
                this.refreshTokens.delete(payload.jti);
                return null;
            }
            // Generate new access token
            const newTokenPair = await this.generateTokenPair(refreshTokenMeta.userId, refreshTokenMeta.clientId, refreshTokenMeta.scopes, { includeRefreshToken: false });
            this.securityLogger.log(`Access token refreshed for user ${refreshTokenMeta.userId}`);
            return newTokenPair;
        }
        catch (error) {
            this.securityLogger.error('Refresh token validation failed:', error);
            return null;
        }
    }
    /**
     * Revoke refresh token
     */
    revokeToken(tokenId) {
        const refreshToken = this.refreshTokens.get(tokenId);
        if (refreshToken) {
            refreshToken.isRevoked = true;
            this.securityLogger.log(`Refresh token revoked: ${tokenId}`);
            return true;
        }
        return false;
    }
    /**
     * Sign JWT token
     */
    async signToken(payload) {
        try {
            const jose = await this.getJose();
            if (this.keyPair.algorithm === 'RS256') {
                // Use jose for RS256
                const privateKey = await jose.importPKCS8(this.keyPair.privateKey, 'RS256');
                const token = await new jose.SignJWT(payload)
                    .setProtectedHeader({
                    alg: 'RS256',
                    typ: 'JWT',
                    kid: this.keyPair.keyId
                })
                    .sign(privateKey);
                return token;
            }
            else {
                // Use jose for ES256
                const privateKey = await jose.importPKCS8(this.keyPair.privateKey, 'ES256');
                const token = await new jose.SignJWT(payload)
                    .setProtectedHeader({
                    alg: 'ES256',
                    typ: 'JWT',
                    kid: this.keyPair.keyId
                })
                    .sign(privateKey);
                return token;
            }
        }
        catch (error) {
            this.securityLogger.error('Token signing failed', error);
            throw new Error(`Failed to sign token: ${error.message}`);
        }
    }
    /**
     * Verify JWT token
     */
    async verifyToken(token) {
        try {
            const jose = await this.getJose();
            if (this.keyPair.algorithm === 'RS256') {
                // RS256 verification using jose library
                const publicKey = await jose.importSPKI(this.keyPair.publicKey, 'RS256');
                const { payload } = await jose.jwtVerify(token, publicKey, {
                    algorithms: ['RS256'],
                    issuer: this.issuer,
                    audience: this.audience,
                    clockTolerance: 30
                });
                return payload;
            }
            else if (this.keyPair.algorithm === 'ES256') {
                // ES256 verification using jose library
                const publicKey = await jose.importSPKI(this.keyPair.publicKey, 'ES256');
                const { payload } = await jose.jwtVerify(token, publicKey, {
                    issuer: this.issuer,
                    audience: this.audience,
                    algorithms: ['ES256'],
                    clockTolerance: 30
                });
                return payload;
            }
            else {
                throw new Error(`Unsupported algorithm: ${this.keyPair.algorithm}`);
            }
        }
        catch (error) {
            this.securityLogger.error('Token verification failed', error);
            throw new Error(`Token verification failed: ${error.message}`);
        }
    }
    /**
     * Get public key for JWT verification (JWKS format)
     */
    getPublicKeyJWKS() {
        if (this.keyPair.algorithm === 'RS256') {
            // Convert PEM to JWK format for RSA
            const publicKey = crypto.createPublicKey(this.keyPair.publicKey);
            const jwk = publicKey.export({ format: 'jwk' });
            return {
                kty: 'RSA',
                use: 'sig',
                alg: 'RS256',
                kid: this.keyPair.keyId,
                n: jwk.n,
                e: jwk.e
            };
        }
        else if (this.keyPair.algorithm === 'ES256') {
            // Convert PEM to JWK format for ECDSA
            const publicKey = crypto.createPublicKey(this.keyPair.publicKey);
            const jwk = publicKey.export({ format: 'jwk' });
            return {
                kty: 'EC',
                use: 'sig',
                alg: 'ES256',
                kid: this.keyPair.keyId,
                crv: jwk.crv,
                x: jwk.x,
                y: jwk.y
            };
        }
        else {
            throw new Error(`Unsupported algorithm for JWK conversion: ${this.keyPair.algorithm}`);
        }
    }
    /**
     * Get JWKS (JSON Web Key Set)
     */
    getJWKS() {
        return {
            keys: [this.getPublicKeyJWKS()]
        };
    }
    /**
     * Get public key in PEM format for JWT validation
     */
    getPublicKeyPEM() {
        return this.keyPair.publicKey;
    }
    /**
     * Generate key pair for JWT signing (RSA or ECDSA)
     */
    generateKeyPair(algorithm = 'RS256') {
        const keyId = crypto.randomUUID();
        if (algorithm === 'RS256') {
            this.securityLogger.log('Generating new RSA key pair for JWT signing');
            const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
                modulusLength: 2048,
                publicKeyEncoding: {
                    type: 'spki',
                    format: 'pem'
                },
                privateKeyEncoding: {
                    type: 'pkcs8',
                    format: 'pem'
                }
            });
            return {
                publicKey,
                privateKey,
                keyId,
                algorithm: 'RS256'
            };
        }
        else if (algorithm === 'ES256') {
            this.securityLogger.log('Generating new ECDSA P-256 key pair for JWT signing');
            const { publicKey, privateKey } = crypto.generateKeyPairSync('ec', {
                namedCurve: 'prime256v1', // P-256 curve for ES256
                publicKeyEncoding: {
                    type: 'spki',
                    format: 'pem'
                },
                privateKeyEncoding: {
                    type: 'pkcs8',
                    format: 'pem'
                }
            });
            return {
                publicKey,
                privateKey,
                keyId,
                algorithm: 'ES256'
            };
        }
        else {
            throw new Error(`Unsupported algorithm: ${algorithm}`);
        }
    }
    /**
     * Clean up expired refresh tokens
     */
    cleanupExpiredTokens() {
        const now = new Date();
        let cleanedCount = 0;
        for (const [tokenId, refreshToken] of this.refreshTokens.entries()) {
            if (now > refreshToken.expiresAt || refreshToken.isRevoked) {
                this.refreshTokens.delete(tokenId);
                cleanedCount++;
            }
        }
        // Evict oldest if above cap
        while (this.refreshTokens.size > this.MAX_REFRESH_TOKENS) {
            const oldest = this.refreshTokens.keys().next().value;
            if (!oldest)
                break;
            this.refreshTokens.delete(oldest);
            cleanedCount++;
        }
        if (cleanedCount > 0) {
            this.securityLogger.debug(`Cleaned up ${cleanedCount} expired refresh tokens`);
        }
    }
    /**
     * Get token statistics
     */
    getStats() {
        const now = new Date();
        let activeTokens = 0;
        let revokedTokens = 0;
        for (const refreshToken of this.refreshTokens.values()) {
            if (refreshToken.isRevoked) {
                revokedTokens++;
            }
            else if (now <= refreshToken.expiresAt) {
                activeTokens++;
            }
        }
        return {
            totalRefreshTokens: this.refreshTokens.size,
            activeRefreshTokens: activeTokens,
            revokedTokens,
            keyId: this.keyPair.keyId,
            algorithm: this.keyPair.algorithm
        };
    }
    /**
     * Cleanup and destroy
     */
    destroy() {
        if (this.cleanupInterval) {
            clearInterval(this.cleanupInterval);
        }
        this.refreshTokens.clear();
    }
}
exports.OAuth2TokenManager = OAuth2TokenManager;
//# sourceMappingURL=oauth-token-manager.js.map