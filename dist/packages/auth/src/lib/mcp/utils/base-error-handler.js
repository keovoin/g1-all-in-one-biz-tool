"use strict";
/**
 * Base Error Handler
 *
 * Centralized error handling utility following DRY and KISS principles
 * Provides consistent error formatting and logging across the MCP server
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseErrorHandler = void 0;
const security_logger_1 = require("./security-logger");
class BaseErrorHandler {
    constructor(logger = new security_logger_1.SecurityLogger()) {
        this.securityLogger = logger;
    }
    /**
     * Handle OAuth 2.0 errors with consistent formatting
     */
    handleOAuthError(res, error, statusCode) {
        const mapped = error.error === 'invalid_token' ? 401 :
            error.error === 'invalid_client' ? 401 :
                error.error === 'insufficient_scope' ? 403 :
                    error.error === 'server_error' ? 500 :
                        error.error === 'temporarily_unavailable' ? 503 :
                            400;
        const status = statusCode ?? mapped;
        this.setNoStoreJsonHeaders(res, true);
        if (status === 503 && !res.getHeader('Retry-After')) {
            res.setHeader('Retry-After', '120'); // seconds; tune as needed
        }
        res.status(status).json({
            error: error.error,
            error_description: error.errorDescription,
            ...(error.errorUri && { error_uri: error.errorUri }),
            ...(error.scope && { scope: error.scope }),
        });
    }
    /**
     * Handle OAuth redirect errors (for authorization endpoint)
     */
    handleOAuthRedirectError(res, redirectUri, error, description, errorUri, state, clientId) {
        try {
            const url = new URL(redirectUri);
            if (!/^https?:$/.test(url.protocol)) {
                throw new Error(`Unsupported redirect protocol: ${url.protocol}`);
            }
            url.searchParams.set('error', error);
            if (description) {
                const safeDescription = description.slice(0, 200);
                url.searchParams.set('error_description', safeDescription);
            }
            if (errorUri)
                url.searchParams.set('error_uri', errorUri);
            if (state)
                url.searchParams.set('state', state);
            this.securityLogger.warn('OAuth redirect error', {
                error,
                description,
                clientId,
                redirectUri: `${url.origin}${url.pathname}` // Log without query/fragment
            });
            this.setNoStoreHeaders(res);
            res.redirect(303, url.toString());
        }
        catch (urlError) {
            this.securityLogger.error('Invalid redirect URI in error handling', urlError);
            this.handleStandardError(res, {
                code: 'invalid_redirect_uri',
                message: 'Invalid redirect URI provided',
                statusCode: 400
            });
        }
    }
    /**
     * Handle standard HTTP errors
     */
    handleStandardError(res, error) {
        if (error.statusCode >= 500) {
            this.securityLogger.error('Standard error occurred', {
                code: error.code,
                message: error.message,
                statusCode: error.statusCode
            });
        }
        else {
            this.securityLogger.warn('Standard error occurred', {
                code: error.code,
                message: error.message,
                statusCode: error.statusCode
            });
        }
        this.setNoStoreJsonHeaders(res);
        res.status(error.statusCode).json({
            error: error.code,
            message: error.message,
            ...(error.details && { details: error.details }),
        });
    }
    /**
     * Handle validation errors
     */
    handleValidationError(res, field, message, statusCode = 400) {
        this.handleStandardError(res, {
            code: 'validation_error',
            message: `${field}: ${message}`,
            statusCode,
        });
    }
    /**
     * Handle authentication errors with proper WWW-Authenticate header
     */
    handleAuthError(res, error, resourceMetadataUrl) {
        if (resourceMetadataUrl) {
            const wwwAuthenticate = this.formatWWWAuthenticateHeader(resourceMetadataUrl, error);
            res.setHeader('WWW-Authenticate', wwwAuthenticate);
        }
        const status = error.error === 'insufficient_scope' ? 403 : 401;
        this.setNoStoreJsonHeaders(res, true);
        res.status(status).json({
            error: error.error,
            error_description: error.errorDescription,
            ...(error.errorUri && { error_uri: error.errorUri }),
            ...(error.scope && { scope: error.scope }),
        });
    }
    /**
     * Set no-store cache headers and optionally Content-Type and Vary headers
     */
    setNoStoreJsonHeaders(res, varyAuthorization = false) {
        res.setHeader('Cache-Control', 'no-store');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        res.setHeader('Content-Type', 'application/json');
        if (varyAuthorization) {
            res.vary('Authorization');
        }
    }
    /**
     * Set basic no-store cache headers (without Content-Type)
     */
    setNoStoreHeaders(res) {
        res.setHeader('Cache-Control', 'no-store');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
    }
    /**
     * Format WWW-Authenticate header according to RFC 9728
     */
    formatWWWAuthenticateHeader(resourceMetadataUrl, error) {
        const escapeValue = (value) => value
            .replace(/[\p{Cc}]/gu, '') // drop control chars
            .replace(/["\\\r\n]/g, '\\$&'); // quote specials
        let header = `Bearer resource_metadata="${escapeValue(resourceMetadataUrl)}"`;
        if (error) {
            header += `, error="${escapeValue(error.error)}"`;
            if (error.errorDescription) {
                header += `, error_description="${escapeValue(error.errorDescription)}"`;
            }
            if (error.errorUri) {
                header += `, error_uri="${escapeValue(error.errorUri)}"`;
            }
            if (error.scope) {
                header += `, scope="${escapeValue(error.scope)}"`;
            }
        }
        return header;
    }
    /**
     * Create standard authorization error objects
     */
    static createAuthError(error, description, scope, errorUri) {
        return {
            error,
            errorDescription: description,
            scope,
            errorUri,
        };
    }
}
exports.BaseErrorHandler = BaseErrorHandler;
//# sourceMappingURL=base-error-handler.js.map