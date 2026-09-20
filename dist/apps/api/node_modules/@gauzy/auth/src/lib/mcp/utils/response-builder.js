"use strict";
/**
 * Response Builder
 *
 * Standardized response building utility following KISS principle
 * Ensures consistent response formats across all endpoints
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseBuilder = void 0;
const security_logger_1 = require("./security-logger");
const crypto_1 = require("crypto");
class ResponseBuilder {
    constructor(logger = new security_logger_1.SecurityLogger()) {
        this.securityLogger = logger;
    }
    /**
     * Send OAuth 2.0 token response with proper headers
     */
    sendTokenResponse(res, tokenData) {
        this.securityLogger.debug('Sending token response', {
            token_type: tokenData.token_type,
            expires_in: tokenData.expires_in,
            has_refresh_token: !!tokenData.refresh_token,
            scope: tokenData.scope
        });
        res.setHeader('Cache-Control', 'no-store');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        res.json(tokenData);
    }
    /**
     * Send token introspection response
     */
    sendIntrospectionResponse(res, introspectionData) {
        this.securityLogger.debug('Sending introspection response', {
            active: introspectionData.active,
            client_id: introspectionData.client_id,
            scope: introspectionData.scope
        });
        res.setHeader('Cache-Control', 'no-store');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        res.json(introspectionData);
    }
    /**
     * Send successful authorization redirect
     */
    sendAuthorizationRedirect(res, redirectUri, code, state) {
        try {
            const url = new URL(redirectUri);
            const isLoopback = url.hostname === 'localhost' ||
                url.hostname === '127.0.0.1' ||
                url.hostname === '::1';
            const httpsOk = url.protocol === 'https:';
            const httpOk = url.protocol === 'http:' && isLoopback;
            if (!httpsOk && !httpOk) {
                this.securityLogger.warn('Blocked authorization redirect due to disallowed scheme/host', {
                    protocol: url.protocol,
                    host: url.hostname
                });
                res.status(400).json({
                    error: 'invalid_redirect_uri',
                    error_description: 'Redirect URI must use https, or http on loopback (localhost/127.0.0.1)'
                });
                return;
            }
            url.searchParams.set('code', code);
            if (state) {
                url.searchParams.set('state', state);
            }
            this.securityLogger.debug('Sending authorization redirect', {
                redirect_uri_host: url.hostname,
                has_state: !!state,
                code_length: code.length
            });
            res.setHeader('Cache-Control', 'no-store');
            res.setHeader('Pragma', 'no-cache');
            res.setHeader('Expires', '0');
            res.redirect(303, url.toString());
        }
        catch (error) {
            this.securityLogger.error('Failed to build authorization redirect URL', { error, redirectUri });
            res.setHeader('Cache-Control', 'no-store');
            res.setHeader('Pragma', 'no-cache');
            res.setHeader('Expires', '0');
            res.status(400).json({
                error: 'invalid_redirect_uri',
                error_description: 'Invalid redirect URI format'
            });
        }
    }
    /**
     * Send JWKS response
     */
    sendJwksResponse(res, jwks) {
        this.securityLogger.debug('Sending JWKS response', {
            key_count: jwks.keys?.length || 0
        });
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
        // Sanitize: expose only public JWK members
        const sanitized = {
            keys: (jwks.keys || []).map((k) => {
                const { kty, use, key_ops, alg, kid, x5u, x5c, x5t, n, e, crv, x, y, ['x5t#S256']: x5tS256 } = k;
                const out = { kty, use, key_ops, alg, kid, x5u, x5c, x5t, n, e, crv, x, y };
                if (x5tS256)
                    out['x5t#S256'] = x5tS256;
                return Object.fromEntries(Object.entries(out).filter(([, v]) => v !== undefined));
            })
        };
        const body = JSON.stringify(sanitized);
        const etag = `W/"${(0, crypto_1.createHash)('sha256').update(body).digest('hex')}"`;
        res.setHeader('ETag', etag);
        const req = res.req;
        const ifNoneMatch = req?.headers?.['if-none-match'];
        if (ifNoneMatch && ifNoneMatch === etag) {
            res.status(304).end();
            return;
        }
        res.send(body);
    }
    /**
     * Send OAuth 2.0 server metadata
     */
    sendServerMetadata(res, metadata) {
        this.securityLogger.debug('Sending server metadata', {
            issuer: metadata.issuer,
            endpoints: Object.keys(metadata).filter(key => key.endsWith('_endpoint')).length
        });
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
        const body = JSON.stringify(metadata);
        res.setHeader('ETag', `W/"${(0, crypto_1.createHash)('sha256').update(body).digest('hex')}"`);
        const req = res.req;
        const ifNoneMatch = req?.headers?.['if-none-match'];
        if (ifNoneMatch && ifNoneMatch === res.getHeader('ETag')) {
            res.status(304).end();
            return;
        }
        res.send(body);
    }
    /**
     * Send protected resource metadata (RFC 9728)
     */
    sendResourceMetadata(res, metadata) {
        this.securityLogger.debug('Sending resource metadata', {
            resource: metadata.resource,
            authorization_servers_count: metadata.authorization_servers?.length || 0
        });
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
        const body = JSON.stringify(metadata);
        res.setHeader('ETag', `W/"${(0, crypto_1.createHash)('sha256').update(body).digest('hex')}"`);
        const req = res.req;
        const ifNoneMatch = req?.headers?.['if-none-match'];
        if (ifNoneMatch && ifNoneMatch === res.getHeader('ETag')) {
            res.status(304).end();
            return;
        }
        res.send(body);
    }
    /**
     * Send user info response (OpenID Connect)
     */
    sendUserInfoResponse(res, userInfo) {
        this.securityLogger.debug('Sending user info response', {
            sub: userInfo.sub,
            has_email: !!userInfo.email,
            has_profile: !!userInfo.name
        });
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Cache-Control', 'no-store');
        res.setHeader('Expires', '0');
        res.setHeader('Pragma', 'no-cache');
        const existingVary = res.getHeader('Vary');
        const vary = existingVary ? String(existingVary) : '';
        const parts = new Set(vary.split(',').map(v => v.trim()).filter(Boolean));
        parts.add('Authorization');
        res.setHeader('Vary', Array.from(parts).join(', '));
        res.json(userInfo);
    }
    /**
     * Send client registration response
     */
    sendClientRegistrationResponse(res, clientData) {
        this.securityLogger.debug('Sending client registration response', {
            client_id: clientData.client_id,
            client_type: clientData.client_type,
            grant_types: clientData.grant_types
        });
        res.setHeader('Cache-Control', 'no-store');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        res.setHeader('Content-Type', 'application/json');
        res.status(201).json(clientData);
    }
    /**
     * Send success response with optional data
     */
    sendSuccess(res, data, statusCode = 200) {
        res.status(statusCode);
        if ([204, 205, 304].includes(statusCode)) {
            res.end();
            return;
        }
        if (data !== undefined) {
            res.setHeader('Content-Type', 'application/json');
            res.json(data);
        }
        else {
            res.end();
        }
    }
    /**
     * Send HTML response (for login/consent pages)
     */
    sendHtml(res, html) {
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.setHeader('X-Frame-Options', 'DENY');
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('Content-Security-Policy', "default-src 'self'; frame-ancestors 'none'; base-uri 'none'");
        res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
        res.setHeader('Cache-Control', 'no-store');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        res.send(html);
    }
    /**
     * Set security headers for all responses
     */
    static setSecurityHeaders(res) {
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('X-Frame-Options', 'DENY');
        if (process.env.NODE_ENV === 'production') {
            res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
        }
        res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
        res.setHeader('Cross-Origin-Resource-Policy', 'same-origin');
        res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
    }
}
exports.ResponseBuilder = ResponseBuilder;
//# sourceMappingURL=response-builder.js.map