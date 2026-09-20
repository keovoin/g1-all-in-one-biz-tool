"use strict";
/**
 * OAuth 2.0 Authorization Code Management
 *
 * Manages authorization codes for OAuth 2.0 authorization code flow
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.oAuth2AuthorizationCodeManager = exports.OAuth2AuthorizationCodeManager = void 0;
const tslib_1 = require("tslib");
const crypto = tslib_1.__importStar(require("crypto"));
const security_logger_1 = require("../utils/security-logger");
class OAuth2AuthorizationCodeManager {
    /**
     * Redact authorization code for logging (show first 4 + '...' + last 4 characters)
     */
    redactAuthorizationCode(code) {
        if (!code)
            return '[empty]';
        if (code.length <= 8)
            return '*'.repeat(code.length);
        return `${code.substring(0, 4)}...${code.substring(code.length - 4)}`;
    }
    constructor() {
        this.codes = new Map();
        // Authorization code expires in 10 minutes (recommended by RFC 6749)
        this.CODE_EXPIRATION_TIME = 10 * 60 * 1000; // 10 minutes
        this.MAX_CODES = 5000;
        this.securityLogger = new security_logger_1.SecurityLogger();
        // Cleanup expired codes every 5 minutes
        this.cleanupInterval = setInterval(() => {
            this.cleanupExpiredCodes();
        }, 5 * 60 * 1000);
        this.cleanupInterval.unref();
    }
    /**
     * Generate authorization code for user consent
     */
    generateAuthorizationCode(clientId, userId, redirectUri, scopes, options = {}) {
        const code = this.generateSecureCode();
        const now = new Date();
        const expiresAt = new Date(now.getTime() + this.CODE_EXPIRATION_TIME);
        const authCode = {
            code,
            clientId,
            userId,
            redirectUri,
            scopes,
            codeChallenge: options.codeChallenge,
            codeChallengeMethod: options.codeChallengeMethod,
            state: options.state,
            createdAt: now,
            expiresAt,
            isUsed: false,
            metadata: options.metadata
        };
        this.codes.set(code, authCode);
        this.securityLogger.debug(`Authorization code generated for user ${userId}, client ${clientId}`);
        return code;
    }
    /**
     * Exchange authorization code for token information
     */
    exchangeAuthorizationCode(code, clientId, redirectUri, codeVerifier) {
        const authCode = this.codes.get(code);
        if (!authCode) {
            this.securityLogger.warn(`Authorization code not found: ${this.redactAuthorizationCode(code)}`);
            return null;
        }
        // Check if code is expired
        if (new Date() > authCode.expiresAt) {
            this.securityLogger.warn(`Authorization code expired: ${this.redactAuthorizationCode(code)}`);
            this.codes.delete(code);
            return null;
        }
        // Check if code was already used
        if (authCode.isUsed) {
            this.securityLogger.warn(`Authorization code already used: ${this.redactAuthorizationCode(code)}`);
            this.codes.delete(code);
            return null;
        }
        // Validate client ID
        if (authCode.clientId !== clientId) {
            this.securityLogger.warn(`Client ID mismatch for code ${this.redactAuthorizationCode(code)}: expected ${authCode.clientId}, got ${clientId}`);
            return null;
        }
        // Validate redirect URI
        if (authCode.redirectUri !== redirectUri) {
            this.securityLogger.warn(`Redirect URI mismatch for code ${this.redactAuthorizationCode(code)}`);
            return null;
        }
        // Validate PKCE if present
        if (authCode.codeChallenge) {
            if (!codeVerifier) {
                this.securityLogger.warn(`PKCE code verifier missing for code ${this.redactAuthorizationCode(code)}`);
                return null;
            }
            if (!this.validatePKCE(authCode.codeChallenge, authCode.codeChallengeMethod, codeVerifier)) {
                this.securityLogger.warn(`PKCE validation failed for code ${this.redactAuthorizationCode(code)}`);
                return null;
            }
        }
        // Mark code as used
        authCode.isUsed = true;
        this.securityLogger.log(`Authorization code exchanged successfully for user ${authCode.userId}, client ${clientId}`);
        // Remove code after successful exchange
        setTimeout(() => {
            this.codes.delete(code);
        }, 1000); // Small delay to prevent race conditions
        return { ...authCode };
    }
    /**
     * Validate PKCE challenge
     */
    validatePKCE(codeChallenge, method, codeVerifier) {
        const m = method ?? 'S256';
        if (m === 'plain') {
            const challengeBuffer = Buffer.from(codeChallenge, 'utf8');
            const verifierBuffer = Buffer.from(codeVerifier, 'utf8');
            if (challengeBuffer.length !== verifierBuffer.length) {
                return false;
            }
            return crypto.timingSafeEqual(challengeBuffer, verifierBuffer);
        }
        else if (m === 'S256') {
            const hash = crypto
                .createHash('sha256')
                .update(codeVerifier, 'ascii')
                .digest('base64url');
            const challengeBuffer = Buffer.from(codeChallenge, 'utf8');
            const hashBuffer = Buffer.from(hash, 'utf8');
            if (challengeBuffer.length !== hashBuffer.length) {
                return false;
            }
            return crypto.timingSafeEqual(challengeBuffer, hashBuffer);
        }
        return false;
    }
    /**
     * Generate secure authorization code
     */
    generateSecureCode() {
        // Generate cryptographically secure random code
        const randomBytes = crypto.randomBytes(32);
        return randomBytes.toString('base64url');
    }
    /**
     * Clean up expired authorization codes
     */
    cleanupExpiredCodes() {
        const now = new Date();
        let cleanedCount = 0;
        for (const [code, authCode] of this.codes.entries()) {
            if (now > authCode.expiresAt || authCode.isUsed) {
                this.codes.delete(code);
                cleanedCount++;
            }
        }
        while (this.codes.size > this.MAX_CODES) {
            const oldest = this.codes.keys().next().value;
            if (!oldest)
                break;
            this.codes.delete(oldest);
            cleanedCount++;
        }
        if (cleanedCount > 0) {
            this.securityLogger.debug(`Cleaned up ${cleanedCount} expired/used authorization codes`);
        }
    }
    /**
     * Get authorization code details (for debugging)
     */
    getAuthorizationCode(code) {
        return this.codes.get(code) || null;
    }
    /**
     * Get statistics
     */
    getStats() {
        const now = new Date();
        let activeCodes = 0;
        let expiredCodes = 0;
        for (const authCode of this.codes.values()) {
            if (now > authCode.expiresAt || authCode.isUsed) {
                expiredCodes++;
            }
            else {
                activeCodes++;
            }
        }
        return {
            totalCodes: this.codes.size,
            activeCodes,
            expiredCodes
        };
    }
    /**
     * Cleanup and destroy
     */
    destroy() {
        if (this.cleanupInterval) {
            clearInterval(this.cleanupInterval);
        }
        this.codes.clear();
    }
}
exports.OAuth2AuthorizationCodeManager = OAuth2AuthorizationCodeManager;
// Singleton instance
exports.oAuth2AuthorizationCodeManager = new OAuth2AuthorizationCodeManager();
//# sourceMappingURL=oauth-authorization-code-manager.js.map