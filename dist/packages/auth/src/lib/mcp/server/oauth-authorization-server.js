"use strict";
/**
 * OAuth 2.0 Authorization Server
 *
 * Complete OAuth 2.0 authorization server implementation for MCP
 * Supports authorization code flow with PKCE, client credentials, and refresh tokens
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.OAuth2AuthorizationServer = void 0;
const tslib_1 = require("tslib");
const express_1 = tslib_1.__importDefault(require("express"));
const express_rate_limit_1 = require("express-rate-limit");
const helmet_1 = tslib_1.__importDefault(require("helmet"));
const express_session_1 = tslib_1.__importDefault(require("express-session"));
const cookie_parser_1 = tslib_1.__importDefault(require("cookie-parser"));
const utils_1 = require("../utils");
const escape_html_1 = tslib_1.__importDefault(require("escape-html"));
const csrf_csrf_1 = require("csrf-csrf");
const oauth_client_manager_1 = require("./oauth-client-manager");
const oauth_authorization_code_manager_1 = require("./oauth-authorization-code-manager");
const oauth_token_manager_1 = require("./oauth-token-manager");
const oauth_validator_1 = require("./oauth-validator");
class OAuth2AuthorizationServer {
    constructor(config) {
        this.config = config;
        this.securityLogger = new utils_1.SecurityLogger();
        this.errorHandler = new utils_1.BaseErrorHandler();
        this.responseBuilder = new utils_1.ResponseBuilder();
        this.configManager = utils_1.ConfigManager.getInstance();
        this.tokenManager = new oauth_token_manager_1.OAuth2TokenManager(config.issuer, config.audience);
        this.initializeCSRFProtection();
        // Create basic authorization config for the validator
        const authConfig = {
            enabled: true,
            resourceUri: config.audience,
            authorizationServers: [{
                    issuer: config.issuer,
                    authorizationEndpoint: config.authorizationEndpoint,
                    tokenEndpoint: config.tokenEndpoint,
                    grantTypesSupported: ['authorization_code', 'refresh_token', 'client_credentials'],
                    responseTypesSupported: ['code']
                }],
            jwt: {
                audience: config.audience,
                issuer: config.issuer,
                algorithms: this.tokenManager.getJWKS().keys?.map((k) => k.alg).filter(Boolean) || ['RS256'],
                jwksUri: `${config.baseUrl}${config.jwksEndpoint}`
            }
        };
        // Don't set publicKey - use JWKS only for better caching and key rotation support
        this.oAuthValidator = new oauth_validator_1.OAuthValidator(authConfig);
        // Initialize optional providers from config before validation
        // This ensures validateConfiguration() can see and validate them
        if (config.userInfoProvider) {
            this.userInfoProvider = config.userInfoProvider;
        }
        if (config.userAuthenticator) {
            this.authenticateUser = config.userAuthenticator;
        }
        this.app = (0, express_1.default)();
        this.setupMiddleware();
        this.setupRoutes();
        this.setupErrorHandling();
        // Validate configuration during initialization
        this.validateConfiguration();
    }
    /**
     * Extracts cookie domain from baseUrl for HTTPS connections
     * @param isHttps Whether the connection is HTTPS
     * @returns The hostname if valid domain, undefined for IPs/localhost or non-HTTPS
     */
    extractCookieDomain(isHttps) {
        if (!isHttps) {
            return undefined;
        }
        try {
            const baseUrlObj = new URL(this.config.baseUrl);
            const hostname = baseUrlObj.hostname;
            // Don't set domain for localhost or IP addresses (IPv4 or IPv6)
            const isIPv4 = /^\d+\.\d+\.\d+\.\d+$/.test(hostname);
            const isIPv6 = hostname.includes(':') || hostname.startsWith('[');
            if (hostname === 'localhost' || isIPv4 || isIPv6) {
                return undefined;
            }
            // Don't set domain for ngrok URLs or other temporary proxy services
            // These services provide unique subdomains and setting a root domain would break cookies
            const isNgrok = hostname.endsWith('.ngrok.io') || hostname.endsWith('.ngrok-free.app') || hostname.endsWith('.ngrok-free.dev');
            const isCloudflare = hostname.includes('cloudflare-tunnel') || hostname.endsWith('.trycloudflare.com');
            const isTemporaryProxy = isNgrok || isCloudflare || hostname.endsWith('.localhost.run');
            if (isTemporaryProxy) {
                // For temporary proxy services, don't set domain - let browser handle it
                this.securityLogger.debug('Detected temporary proxy service, not setting cookie domain', { hostname });
                return undefined;
            }
            // Return hostname for valid domain names
            return hostname;
        }
        catch (error) {
            this.securityLogger.error('Failed to parse baseUrl for cookie domain', { error });
            return undefined;
        }
    }
    initializeCSRFProtection() {
        const isHttps = this.config.baseUrl.startsWith('https');
        // Extract domain from baseUrl for cookie configuration
        const hostname = this.extractCookieDomain(isHttps);
        let cookieDomain;
        // Only set cookie domain if we have a valid hostname that's not a proxy service
        if (hostname) {
            const parts = hostname.split('.');
            if (parts.length >= 2) {
                // For subdomain sharing: use registrable root domain (e.g., 'example.com' from 'api.example.com')
                // This allows cookies to be shared across subdomains
                cookieDomain = parts.slice(-2).join('.');
            }
        }
        // Choose cookie name based on whether we're setting a domain
        // For proxy services (ngrok), use __Host- prefix which doesn't allow domain attribute
        const csrfCookieName = isHttps
            ? (cookieDomain ? '__Secure-mcp.x-csrf-token' : '__Host-mcp.x-csrf-token')
            : 'mcp-csrf-token';
        const { generateCsrfToken, doubleCsrfProtection, } = (0, csrf_csrf_1.doubleCsrf)({
            getSecret: () => this.config.sessionSecret,
            getSessionIdentifier: (req) => {
                // Always prefer session ID if available (most reliable)
                const sessionId = req.sessionID;
                if (sessionId) {
                    return sessionId;
                }
                // For non-HTTPS development, use simple IP-based identifier
                if (!isHttps) {
                    return `local-session-${req.ip || '127.0.0.1'}`;
                }
                // HTTPS fallback: Use a combination of IP and a hash of User-Agent
                // This provides better session continuity when actual sessions aren't available
                const ip = req.ip || req.connection.remoteAddress || 'unknown-ip';
                const userAgent = req.get('User-Agent') || 'unknown-agent';
                const identifier = `https-fallback-${ip}-${userAgent.substring(0, 50)}`;
                this.securityLogger.warn('CSRF using fallback identifier (no session)', {
                    hasIp: !!req.ip,
                    hasUserAgent: !!req.get('User-Agent'),
                    protocol: req.protocol,
                    secure: req.secure
                });
                return identifier;
            },
            cookieName: csrfCookieName,
            cookieOptions: {
                httpOnly: true,
                sameSite: 'lax',
                // Set secure based on config - trust proxy will ensure cookies work correctly
                secure: isHttps,
                path: '/',
                // Only set domain for HTTPS if we have a valid, non-proxy domain
                ...(cookieDomain && isHttps ? { domain: cookieDomain } : {}),
            },
            size: 64,
            ignoredMethods: ['GET', 'HEAD', 'OPTIONS'],
            getCsrfTokenFromRequest: (req) => {
                return req.body._csrf || req.headers['x-csrf-token'];
            },
        });
        this.csrfProtection = doubleCsrfProtection;
        this.generateToken = generateCsrfToken;
        // Log CSRF configuration for debugging
        this.securityLogger.info('CSRF protection initialized', {
            isHttps,
            cookieDomain: cookieDomain || 'not-set',
            cookieName: csrfCookieName,
            secure: isHttps,
            sameSite: 'lax',
            domainSet: !!cookieDomain
        });
    }
    /**
     * Set user info provider for user consent and token claims
     */
    setUserInfoProvider(provider) {
        this.userInfoProvider = provider;
    }
    /**
     * Set user authentication provider
     */
    setUserAuthenticator(authenticator) {
        this.authenticateUser = authenticator;
    }
    /**
     * Validate required configuration and providers
     * Fails fast in production when required providers are not configured
     */
    validateConfiguration() {
        const serverConfig = this.configManager.getConfig();
        const errors = [];
        // Check for required providers
        if (!this.authenticateUser) {
            errors.push('User authenticator is not configured. Call setUserAuthenticator() to provide authentication logic.');
        }
        if (!this.userInfoProvider) {
            errors.push('User info provider is not configured. Call setUserInfoProvider() to provide user information retrieval logic.');
        }
        // If there are configuration errors
        if (errors.length > 0) {
            const errorMessage = `OAuth2 Authorization Server configuration validation failed:\n${errors.map(e => `  - ${e}`).join('\n')}`;
            // Log all errors
            errors.forEach(error => {
                this.securityLogger.error(`Configuration error: ${error}`);
            });
            // In production, fail fast by throwing an error
            if (serverConfig.environment === 'production') {
                this.securityLogger.error('CRITICAL: Server cannot start with missing required providers in production environment');
                throw new Error(errorMessage);
            }
            else {
                // In non-production, log warning
                this.securityLogger.warn('WARNING: Server is starting with incomplete configuration. This is only allowed in non-production environments.');
                this.securityLogger.warn(errorMessage);
            }
        }
        else {
            this.securityLogger.info('OAuth2 Authorization Server configuration validated successfully');
        }
    }
    /**
     * Setup middleware
     */
    setupMiddleware() {
        // Configure trust proxy to honor X-Forwarded-For headers from trusted proxies
        // This must be set before any middleware that uses req.ip or rate limiting
        const serverConfig = this.configManager.getConfig();
        const isHttps = this.config.baseUrl.startsWith('https');
        if (serverConfig.trustedProxies && serverConfig.trustedProxies.length > 0) {
            this.app.set('trust proxy', serverConfig.trustedProxies);
            this.securityLogger.info(`Trust proxy enabled for: ${serverConfig.trustedProxies.join(', ')}`);
        }
        else if (isHttps || serverConfig.environment === 'production') {
            // For HTTPS or production environments, trust the first proxy
            // This is safe for services like ngrok, Cloudflare, AWS ALB, etc.
            this.app.set('trust proxy', 1);
            this.securityLogger.info('Trust proxy enabled for first proxy (HTTPS/production mode)');
        }
        else {
            this.securityLogger.info('Trust proxy not configured (development mode)');
        }
        // Cookie parser
        this.app.use((0, cookie_parser_1.default)());
        // Extract domain from baseUrl for session cookie configuration
        // Use root domain for session cookie to match CSRF cookie subdomain sharing
        const hostname = this.extractCookieDomain(isHttps);
        let sessionCookieDomain;
        // Only set cookie domain if we have a valid hostname that's not a proxy service
        if (hostname) {
            const parts = hostname.split('.');
            if (parts.length >= 2) {
                // Use root domain (e.g., 'example.com' from 'api.example.com') to match CSRF cookie behavior
                // This ensures sessions and CSRF tokens have the same scope for subdomain sharing
                sessionCookieDomain = parts.slice(-2).join('.');
            }
        }
        // Session management
        // IMPORTANT: For environments proxy (Cloudflare, etc), we need to use 'auto' for secure
        // This allows Express to determine secure based on req.secure (which respects X-Forwarded-Proto)
        const sessionConfig = {
            secret: this.config.sessionSecret,
            name: 'mcp-oauth-session',
            resave: false,
            saveUninitialized: false,
            cookie: {
                // Use 'auto' to let express-session determine secure based on req.secure
                // This works correctly with trust proxy and X-Forwarded-Proto header
                secure: isHttps ? 'auto' : false,
                httpOnly: true,
                maxAge: 1000 * 60 * 60 * 24, // 24 hours
                sameSite: 'lax',
                // Only set domain for HTTPS if we have a valid, non-proxy domain
                ...(sessionCookieDomain && isHttps ? { domain: sessionCookieDomain } : {}),
            },
            rolling: true,
            proxy: isHttps || serverConfig.environment === 'production' // Trust proxy for session
        };
        // Add Redis store if URL is provided (prioritize REDIS_URL env var for production durability)
        const redisUrl = serverConfig.redisUrl;
        if (redisUrl) {
            try {
                const RedisStore = require('connect-redis').default;
                const Redis = require('ioredis');
                const redisClient = new Redis(redisUrl, {
                    // Production-ready Redis configuration
                    retryDelayOnFailover: 100,
                    enableReadyCheck: false,
                    maxRetriesPerRequest: 3,
                    lazyConnect: true,
                    // Log connection events for better monitoring
                    connectionName: 'mcp-oauth-session-store'
                });
                // Handle Redis connection events
                redisClient.on('connect', () => {
                    this.securityLogger.info('Redis session store connected');
                });
                redisClient.on('error', (error) => {
                    this.securityLogger.error('Redis session store error:', error);
                });
                redisClient.on('ready', () => {
                    this.securityLogger.info('Redis session store ready');
                });
                sessionConfig.store = new RedisStore({
                    client: redisClient,
                    prefix: 'mcp-oauth-sess:',
                    ttl: 60 * 60 * 24 // 24 hours TTL
                });
                this.securityLogger.info('Redis session store configured successfully');
            }
            catch (error) {
                this.securityLogger.error('Failed to configure Redis store, falling back to memory store:', error);
                if (serverConfig.environment === 'production') {
                    this.securityLogger.error('CRITICAL: Production deployment requires persistent session storage!');
                }
            }
        }
        if (!sessionConfig.store && serverConfig.environment === 'production') {
            this.securityLogger.error('CRITICAL: Using in-memory session store in production. Configure REDIS_URL environment variable for session durability and scalability!');
        }
        else if (!sessionConfig.store) {
            this.securityLogger.info('Using in-memory session store for development');
        }
        this.app.use((0, express_session_1.default)(sessionConfig));
        // Debug middleware to log session details (placed AFTER session middleware)
        // Only enable in development
        if (serverConfig.environment === 'development') {
            this.app.use((req, res, next) => {
                if (req.method === 'POST' || (req.method === 'GET' && req.path.includes('/login'))) {
                    const sessionId = req.sessionID;
                    const cookies = req.cookies || {};
                    this.securityLogger.debug(`${req.method} Request Details`, {
                        path: req.path,
                        protocol: req.protocol,
                        secure: req.secure,
                        ip: req.ip,
                        xForwardedProto: req.get('x-forwarded-proto'),
                        xForwardedHost: req.get('x-forwarded-host'),
                        host: req.get('host'),
                        hasSessionId: !!sessionId,
                        sessionIdPrefix: sessionId ? sessionId.substring(0, 8) : 'none',
                        cookieCount: Object.keys(cookies).length,
                        cookies: Object.keys(cookies),
                        trustProxy: this.app.get('trust proxy')
                    });
                }
                next();
            });
        }
        // Log session configuration for debugging
        this.securityLogger.info('Session configuration initialized', {
            cookieName: sessionConfig.name,
            cookieDomain: sessionCookieDomain || 'not-set',
            secure: sessionConfig.cookie?.secure,
            sameSite: sessionConfig.cookie?.sameSite,
            httpOnly: sessionConfig.cookie?.httpOnly,
            hasStore: !!sessionConfig.store,
            domainSet: !!sessionCookieDomain,
            isHttps,
            proxy: sessionConfig.proxy,
            trustProxySetting: this.app.get('trust proxy')
        });
        // Security headers
        // Extract origin from baseUrl for CSP (handles subdomain and scheme issues)
        let baseUrlOrigin;
        try {
            const baseUrlObj = new URL(this.config.baseUrl);
            baseUrlOrigin = baseUrlObj.origin;
            this.securityLogger.info('CSP Configuration', {
                baseUrl: this.config.baseUrl,
                baseUrlOrigin,
                protocol: baseUrlObj.protocol,
                hostname: baseUrlObj.hostname,
                port: baseUrlObj.port
            });
        }
        catch (error) {
            this.securityLogger.error('Invalid baseUrl in configuration', { baseUrl: this.config.baseUrl, error });
            throw new Error(`Failed to parse baseUrl: ${this.config.baseUrl}`);
        }
        // Dynamic CSP configuration for all environments
        // We need to dynamically set CSP based on the actual request origin to support proxies
        this.securityLogger.info('Configuring dynamic CSP for all environments', {
            baseUrl: this.config.baseUrl,
            baseUrlOrigin,
            isHttps
        });
        // Use helmet without CSP - we implement dynamic CSP below for proxy support
        // CodeQL: Intentionally disabled - custom dynamic CSP follows (lines 514-552)
        this.app.use((0, helmet_1.default)({
            contentSecurityPolicy: false // Disable helmet's CSP, we'll set it dynamically
        }));
        // Dynamic CSP middleware that sets CSP based on actual request origin
        this.app.use((req, res, next) => {
            // Set CSP header with static 'self' for form-action
            // Do NOT dynamically add request origin as it can be spoofed via X-Forwarded-Host
            const csp = [
                `default-src 'self'`,
                `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net`,
                `font-src 'self' https://fonts.gstatic.com https://cdn.jsdelivr.net`,
                `img-src 'self' data: https:`,
                `script-src 'self' 'unsafe-inline' https://static.cloudflareinsights.com`,
                `connect-src 'self' https://cloudflareinsights.com https://cdn.jsdelivr.net`,
                `object-src 'none'`,
                `base-uri 'self'`,
                `form-action 'self'`,
                `frame-ancestors 'none'`
            ].join('; ');
            res.setHeader('Content-Security-Policy', csp);
            // Log CSP for debugging on auth pages (only for GET requests to avoid spam)
            if ((req.path.includes('/authorize') || req.path.includes('/login')) && req.method === 'GET') {
                this.securityLogger.info('Dynamic CSP set', {
                    path: req.path,
                    method: req.method
                });
            }
            next();
        });
        // Rate limiting
        const authRateLimit = (0, express_rate_limit_1.rateLimit)({
            windowMs: 15 * 60 * 1000, // 15 minutes
            max: 100, // requests per windowMs
            message: {
                error: 'too_many_requests',
                error_description: 'Rate limit exceeded'
            },
            standardHeaders: true,
            legacyHeaders: false
        });
        this.app.use(authRateLimit);
        // Body parsing
        this.app.use(express_1.default.json({ limit: '10mb' }));
        this.app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
    }
    /**
     * Setup OAuth 2.0 endpoints
     */
    setupRoutes() {
        // Authorization Server Metadata (RFC 8414)
        this.app.get('/.well-known/oauth-authorization-server', (req, res) => {
            this.handleAuthorizationServerMetadata(req, res);
        });
        // JWKS endpoint (RFC 7517)
        this.app.get(this.config.jwksEndpoint, (req, res) => {
            this.handleJWKS(req, res);
        });
        // Login endpoints with CSRF protection
        if (this.config.loginEndpoint) {
            // GET request doesn't need CSRF protection - just generate token
            this.app.get(this.config.loginEndpoint, (req, res) => {
                this.handleLoginPage(req, res);
            });
            // POST request needs CSRF protection
            this.app.post(this.config.loginEndpoint, this.csrfProtection, (req, res) => {
                this.handleLogin(req, res);
            });
        }
        // Authorization endpoint (GET doesn't need CSRF, POST does)
        this.app.get(this.config.authorizationEndpoint, (req, res) => {
            this.handleAuthorize(req, res);
        });
        // Authorization consent (POST) with CSRF protection
        this.app.post(this.config.authorizationEndpoint, this.csrfProtection, (req, res) => {
            this.handleAuthorizationConsent(req, res);
        });
        // Token endpoint (RFC 6749 Section 3.2)
        this.app.post(this.config.tokenEndpoint, (req, res) => {
            this.handleToken(req, res);
        });
        // Client registration endpoint (RFC 7591)
        if (this.config.registrationEndpoint) {
            this.app.post(this.config.registrationEndpoint, (req, res) => {
                this.handleClientRegistration(req, res);
            });
        }
        // Token introspection endpoint (RFC 7662)
        if (this.config.introspectionEndpoint) {
            this.app.post(this.config.introspectionEndpoint, (req, res) => {
                this.handleTokenIntrospection(req, res);
            });
        }
        // User info endpoint (OpenID Connect)
        if (this.config.userInfoEndpoint) {
            this.app.get(this.config.userInfoEndpoint, (req, res) => {
                this.handleUserInfo(req, res);
            });
        }
        // Simple callback endpoint for testing
        this.app.get('/callback', (req, res) => {
            this.handleTestCallback(req, res);
        });
    }
    /**
     * Handle test callback endpoint (for development/testing)
     */
    handleTestCallback(req, res) {
        const { code, state, error, error_description } = req.query;
        if (error) {
            res.status(400).send(`
				<!DOCTYPE html>
				<html>
				<head>
					<title>OAuth Callback - Error</title>
					<meta charset="utf-8">
					<meta name="viewport" content="width=device-width, initial-scale=1">
					<style>
						body { font-family: Arial, sans-serif; max-width: 600px; margin: 100px auto; padding: 20px; background: #f5f5f5; }
						.card { border: 1px solid #dc3545; border-radius: 8px; padding: 30px; background: #fff; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
						.error { color: #dc3545; }
						.code { background: #f8f9fa; border: 1px solid #dee2e6; border-radius: 4px; padding: 10px; font-family: monospace; word-break: break-all; }
					</style>
				</head>
				<body>
					<div class="card">
						<h1 class="error">❌ OAuth Authorization Failed</h1>
						<p><strong>Error:</strong> ${(0, escape_html_1.default)(error)}</p>
						<p><strong>Description:</strong> ${(0, escape_html_1.default)(error_description || 'No description provided')}</p>
						${state ? `<p><strong>State:</strong> ${(0, escape_html_1.default)(state)}</p>` : ''}
					</div>
				</body>
				</html>
			`);
            return;
        }
        if (code) {
            res.send(`
				<!DOCTYPE html>
				<html>
				<head>
					<title>OAuth Callback - Success</title>
					<meta charset="utf-8">
					<meta name="viewport" content="width=device-width, initial-scale=1">
					<style>
						body { font-family: Arial, sans-serif; max-width: 600px; margin: 100px auto; padding: 20px; background: #f5f5f5; }
						.card { border: 1px solid #28a745; border-radius: 8px; padding: 30px; background: #fff; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
						.success { color: #28a745; }
						.code { background: #f8f9fa; border: 1px solid #dee2e6; border-radius: 4px; padding: 10px; font-family: monospace; word-break: break-all; margin: 10px 0; }
						.copy-btn { background: #007bff; color: white; border: none; padding: 8px 15px; border-radius: 4px; cursor: pointer; margin-left: 10px; }
						.copy-btn:hover { background: #0056b3; }
						.instructions { background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 6px; padding: 15px; margin: 20px 0; }
					</style>
				</head>
				<body>
					<div class="card">
						<h1 class="success">✅ OAuth Authorization Successful!</h1>
						<p>Authorization code received successfully. Use this code in your token exchange request:</p>

						<div class="instructions">
							<strong>📋 Next Steps:</strong>
							<ol>
								<li>Copy the authorization code below</li>
								<li>Use it in Postman for the token exchange (Step 5)</li>
								<li>You have ~10 minutes before this code expires</li>
							</ol>
						</div>

						<p><strong>Authorization Code:</strong></p>
						<div class="code" id="authCode">${(0, escape_html_1.default)(code)}</div>
						<button class="copy-btn" onclick="copyToClipboard()">📋 Copy Code</button>

						${state ? `
							<p style="margin-top: 20px;"><strong>State:</strong></p>
							<div class="code">${(0, escape_html_1.default)(state)}</div>
						` : ''}

						<div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 14px; color: #666;">
							<strong>🔧 Token Exchange Request:</strong><br>
							Use this code in your Postman POST request to:<br>
							<code>http://localhost:3001/oauth2/token</code>
						</div>
					</div>

					<script>
						function copyToClipboard() {
							const codeElement = document.getElementById('authCode');
							const code = codeElement.textContent;
							navigator.clipboard.writeText(code).then(() => {
								alert('Authorization code copied to clipboard!');
							});
						}
					</script>
				</body>
				</html>
			`);
        }
        else {
            res.status(400).send(`
				<!DOCTYPE html>
				<html>
				<head><title>OAuth Callback - Invalid</title></head>
				<body>
					<h1>❌ Invalid Callback</h1>
					<p>No authorization code or error received.</p>
				</body>
				</html>
			`);
        }
    }
    /**
     * Handle authorization server metadata
     */
    handleAuthorizationServerMetadata(req, res) {
        const metadata = {
            issuer: this.config.issuer,
            authorization_endpoint: `${this.config.baseUrl}${this.config.authorizationEndpoint}`,
            token_endpoint: `${this.config.baseUrl}${this.config.tokenEndpoint}`,
            jwks_uri: `${this.config.baseUrl}${this.config.jwksEndpoint}`,
            registration_endpoint: this.config.registrationEndpoint ?
                `${this.config.baseUrl}${this.config.registrationEndpoint}` : undefined,
            introspection_endpoint: this.config.introspectionEndpoint ?
                `${this.config.baseUrl}${this.config.introspectionEndpoint}` : undefined,
            userinfo_endpoint: this.config.userInfoEndpoint ?
                `${this.config.baseUrl}${this.config.userInfoEndpoint}` : undefined,
            scopes_supported: ['openid', 'profile', 'email', 'roles', 'mcp.read', 'mcp.write', 'mcp.admin'],
            response_types_supported: ['code'],
            grant_types_supported: ['authorization_code', 'refresh_token', 'client_credentials'],
            code_challenge_methods_supported: ['S256', 'plain'],
            token_endpoint_auth_methods_supported: ['client_secret_post', 'client_secret_basic'],
            revocation_endpoint_auth_methods_supported: ['client_secret_post', 'client_secret_basic']
        };
        this.responseBuilder.sendServerMetadata(res, metadata);
    }
    /**
     * Handle JWKS endpoint
     */
    handleJWKS(req, res) {
        try {
            const jwks = this.tokenManager.getJWKS();
            this.responseBuilder.sendJwksResponse(res, jwks);
        }
        catch (error) {
            this.securityLogger.error('JWKS endpoint error:', error);
            this.errorHandler.handleStandardError(res, {
                code: 'server_error',
                message: 'Failed to retrieve key set',
                statusCode: 500
            });
            return;
        }
    }
    /**
     * Handle login page with CSRF token
     */
    handleLoginPage(req, res) {
        const error = req.query.error;
        const rawReturnUrl = req.query.return_url || this.config.authorizationEndpoint;
        const safeReturnUrl = this.normalizeReturnUrl(rawReturnUrl);
        // Check session availability
        const sessionId = req.sessionID;
        if (!sessionId) {
            this.securityLogger.warn('No session ID available when loading login page', {
                ip: req.ip,
                userAgent: req.get('User-Agent'),
                cookies: Object.keys(req.cookies || {})
            });
        }
        // Generate CSRF token for the form
        const csrfToken = this.generateToken(req, res);
        // Sanitize returnUrl to avoid logging sensitive query params
        const sanitizedReturnUrl = safeReturnUrl.split('?')[0];
        this.securityLogger.debug('Generated CSRF token for login form', {
            hasSessionId: !!sessionId,
            sessionIdPrefix: sessionId ? sessionId.substring(0, 8) : 'none',
            returnUrl: sanitizedReturnUrl,
            csrfTokenLength: csrfToken?.length || 0,
            ip: req.ip,
            protocol: req.protocol,
            secure: req.secure
        });
        res.send(this.generateLoginForm(error, safeReturnUrl, csrfToken));
    }
    normalizeReturnUrl(input) {
        if (!input)
            return this.config.authorizationEndpoint;
        try {
            // Allow only relative paths, and only if in allowlist, always strip query/fragment
            if (input.startsWith('/')) {
                const [path] = input.split('?'); // ignore query string for allowlist check
                if (OAuth2AuthorizationServer.ALLOWED_RETURN_PATHS.includes(path)) {
                    return path; // Only return the clean, allowlisted path
                }
                return this.config.authorizationEndpoint;
            }
            // For absolute URLs: must match same origin and be a permitted endpoint
            const u = new URL(input, this.config.baseUrl);
            const base = new URL(this.config.baseUrl);
            if (u.origin === base.origin) {
                const path = u.pathname;
                if (OAuth2AuthorizationServer.ALLOWED_RETURN_PATHS.includes(path)) {
                    // Only return the canonical absolute URL without user-provided query/fragment
                    return (new URL(path, this.config.baseUrl)).toString();
                }
            }
            return this.config.authorizationEndpoint;
        }
        catch {
            return this.config.authorizationEndpoint;
        }
    }
    /**
     * Handle login submission
     */
    async handleLogin(req, res) {
        try {
            const sessionId = req.sessionID;
            const csrfTokenFromRequest = req.body._csrf || req.headers['x-csrf-token'];
            const cookies = req.cookies || {};
            this.securityLogger.info('Processing login submission', {
                hasSessionId: !!sessionId,
                sessionIdPrefix: sessionId ? sessionId.substring(0, 8) : 'none',
                ip: req.ip,
                protocol: req.protocol,
                secure: req.secure,
                hasCsrfToken: !!csrfTokenFromRequest,
                csrfTokenLength: csrfTokenFromRequest?.length || 0,
                cookies: Object.keys(cookies),
                hasCsrfCookie: !!(cookies['__Host-mcp.x-csrf-token'] || cookies['__Secure-mcp.x-csrf-token'] || cookies['mcp-csrf-token']),
                hasSessionCookie: !!cookies['mcp-oauth-session']
            });
            const { email, password, return_url } = req.body;
            const returnUrl = return_url || this.config.authorizationEndpoint;
            if (!email || !password) {
                const normalizedReturnUrl = this.normalizeReturnUrl(returnUrl);
                return res.redirect(`${this.config.loginEndpoint}?error=missing_credentials&return_url=${encodeURIComponent(normalizedReturnUrl)}`);
            }
            // Authenticate user using configured authenticator
            let user = null;
            if (this.authenticateUser) {
                user = await this.authenticateUser({ email, password });
            }
            else {
                // No authenticator configured
                this.securityLogger.error('User authenticator not configured');
                return res.redirect(`${this.config.loginEndpoint}?error=server_error`);
            }
            if (!user) {
                const normalizedReturnUrl = this.normalizeReturnUrl(returnUrl);
                return res.redirect(`${this.config.loginEndpoint}?error=invalid_credentials&return_url=${encodeURIComponent(normalizedReturnUrl)}`);
            }
            // Set user session
            if (!req.session) {
                return res.status(500).json({ error: 'Session not available' });
            }
            const session = req.session;
            session.user = user;
            session.isAuthenticated = true;
            this.securityLogger.info('User authenticated successfully', { userId: user.userId, email: user.email });
            // Check if we have stored OAuth parameters from the original authorization request
            if (session.oauthParams) {
                // Restore the original OAuth authorization URL with all parameters
                const oauthParams = session.oauthParams;
                const authUrl = new URL(this.config.authorizationEndpoint, this.config.baseUrl);
                // Add all OAuth parameters back to the authorization URL
                authUrl.searchParams.set('response_type', oauthParams.response_type);
                authUrl.searchParams.set('client_id', oauthParams.client_id);
                authUrl.searchParams.set('redirect_uri', oauthParams.redirect_uri);
                if (oauthParams.scope)
                    authUrl.searchParams.set('scope', oauthParams.scope);
                if (oauthParams.state)
                    authUrl.searchParams.set('state', oauthParams.state);
                if (oauthParams.code_challenge)
                    authUrl.searchParams.set('code_challenge', oauthParams.code_challenge);
                if (oauthParams.code_challenge_method)
                    authUrl.searchParams.set('code_challenge_method', oauthParams.code_challenge_method);
                // Clear the stored OAuth parameters
                delete session.oauthParams;
                this.securityLogger.debug(`Redirecting to authorization with restored OAuth params: ${authUrl.toString()}`);
                return res.redirect(authUrl.toString());
            }
            // Fallback: use the normalized return URL (without OAuth parameters)
            const safeReturnUrl = this.normalizeReturnUrl(returnUrl);
            res.redirect(safeReturnUrl);
        }
        catch (error) {
            this.securityLogger.error('Login error:', error);
            res.redirect(`${this.config.loginEndpoint}?error=server_error`);
        }
    }
    /**
     * Handle authorization endpoint (user consent) with CSRF token from forms
     */
    handleAuthorize(req, res) {
        try {
            const params = req.query;
            // Validate required parameters
            const validation = utils_1.BaseValidator.validateAuthorizeRequest(params);
            if (!validation.valid) {
                return this.errorHandler.handleStandardError(res, {
                    code: validation.error,
                    message: validation.errorDescription,
                    statusCode: 400
                });
            }
            // Get client information
            const client = oauth_client_manager_1.oAuth2ClientManager.getClient(params.client_id);
            if (!client) {
                return this.errorHandler.handleStandardError(res, {
                    code: 'invalid_client',
                    message: 'Client not found',
                    statusCode: 400
                });
            }
            // Validate redirect URI
            if (!oauth_client_manager_1.oAuth2ClientManager.isValidRedirectUri(params.client_id, params.redirect_uri)) {
                return this.errorHandler.handleStandardError(res, {
                    code: 'invalid_request',
                    message: 'Invalid redirect URI',
                    statusCode: 400
                });
            }
            // Enforce PKCE for public clients
            if (client.clientType === 'public') {
                const serverConfig = this.configManager.getConfig();
                if (!params.code_challenge || (serverConfig.environment === 'production' && params.code_challenge_method !== 'S256')) {
                    return this.errorHandler.handleOAuthRedirectError(res, params.redirect_uri, 'invalid_request', 'PKCE (S256) is required for public clients', params.state, params.client_id);
                }
            }
            // Check if user is authenticated
            const session = req.session;
            if (!session || !session.isAuthenticated || !session.user) {
                // Ensure session exists before storing OAuth parameters
                if (session) {
                    // Store OAuth parameters in session before redirecting to login
                    session.oauthParams = {
                        response_type: params.response_type,
                        client_id: params.client_id,
                        redirect_uri: params.redirect_uri,
                        scope: params.scope,
                        state: params.state,
                        code_challenge: params.code_challenge,
                        code_challenge_method: params.code_challenge_method,
                        originalUrl: req.originalUrl
                    };
                }
                // Redirect to login with return URL
                const safeOriginal = this.normalizeReturnUrl(req.originalUrl);
                const loginUrl = `${this.config.loginEndpoint}?return_url=${encodeURIComponent(safeOriginal)}`;
                return res.redirect(loginUrl);
            }
            // Generate CSRF token for consent form
            const csrfToken = this.generateToken(req, res);
            // Show consent form for authenticated user
            res.send(this.generateConsentForm(params, client, session.user, csrfToken));
        }
        catch (error) {
            this.securityLogger.error('Authorization endpoint error:', error);
            this.errorHandler.handleStandardError(res, {
                code: 'server_error',
                message: 'Internal server error',
                statusCode: 500
            });
            return;
        }
    }
    /**
     * Handle authorization consent submission
     */
    handleAuthorizationConsent(req, res) {
        try {
            const { client_id, redirect_uri, scope, state, code_challenge, code_challenge_method, user_consent } = req.body;
            // Check user session
            const session = req.session;
            if (!session || !session.isAuthenticated || !session.user) {
                if (!oauth_client_manager_1.oAuth2ClientManager.isValidRedirectUri(client_id, redirect_uri)) {
                    return this.errorHandler.handleStandardError(res, {
                        code: 'invalid_request',
                        message: 'Invalid redirect URI',
                        statusCode: 400
                    });
                }
                return this.errorHandler.handleOAuthRedirectError(res, redirect_uri, 'access_denied', 'User not authenticated', state);
            }
            // Validate consent
            if (user_consent !== 'approve') {
                if (!oauth_client_manager_1.oAuth2ClientManager.isValidRedirectUri(client_id, redirect_uri)) {
                    return this.errorHandler.handleStandardError(res, {
                        code: 'invalid_request',
                        message: 'Invalid redirect URI',
                        statusCode: 400
                    });
                }
                return this.errorHandler.handleOAuthRedirectError(res, redirect_uri, 'access_denied', 'User denied authorization', state);
            }
            const user = session.user;
            // Load client and clamp scopes to what's registered
            const client = oauth_client_manager_1.oAuth2ClientManager.getClient(client_id);
            if (!client) {
                return this.errorHandler.handleStandardError(res, {
                    code: 'invalid_client',
                    message: 'Client not found',
                    statusCode: 400
                });
            }
            const requestedScopes = scope ? scope.split(' ') : ['mcp.read'];
            const grantedScopes = requestedScopes.filter(s => client.scopes.includes(s));
            if (grantedScopes.length === 0) {
                if (!oauth_client_manager_1.oAuth2ClientManager.isValidRedirectUri(client_id, redirect_uri)) {
                    return this.errorHandler.handleStandardError(res, {
                        code: 'invalid_scope',
                        message: 'No permitted scopes requested',
                        statusCode: 400
                    });
                }
                return this.errorHandler.handleOAuthRedirectError(res, redirect_uri, 'invalid_scope', 'No permitted scopes requested', state, client_id);
            }
            // Re-validate redirect URI (defense-in-depth)
            if (!oauth_client_manager_1.oAuth2ClientManager.isValidRedirectUri(client_id, redirect_uri)) {
                return this.errorHandler.handleStandardError(res, {
                    code: 'invalid_request',
                    message: 'Invalid redirect URI',
                    statusCode: 400
                });
            }
            // Generate authorization code
            const code = oauth_authorization_code_manager_1.oAuth2AuthorizationCodeManager.generateAuthorizationCode(client_id, user.userId, redirect_uri, grantedScopes, {
                state,
                codeChallenge: code_challenge,
                codeChallengeMethod: code_challenge_method
            });
            // Log authorization grant
            this.securityLogger.info('Authorization code granted', {
                userId: user.userId,
                clientId: client_id,
                scopes: grantedScopes.join(' '),
                codeChallenge: code_challenge ? 'present' : 'absent'
            });
            // Redirect with authorization code
            this.responseBuilder.sendAuthorizationRedirect(res, redirect_uri, code, state);
        }
        catch (error) {
            this.securityLogger.error('Authorization consent error:', error);
            this.errorHandler.handleStandardError(res, {
                code: 'server_error',
                message: 'Internal server error',
                statusCode: 500
            });
            return;
        }
    }
    /**
     * Handle token endpoint
     */
    async handleToken(req, res) {
        try {
            const params = req.body;
            // Validate grant type
            if (!params.grant_type) {
                this.errorHandler.handleOAuthError(res, utils_1.BaseErrorHandler.createAuthError('invalid_request', 'grant_type parameter is required'), 400);
                return;
            }
            switch (params.grant_type) {
                case 'authorization_code':
                    await this.handleAuthorizationCodeGrant(req, res, params);
                    break;
                case 'refresh_token':
                    await this.handleRefreshTokenGrant(req, res, params);
                    break;
                case 'client_credentials':
                    await this.handleClientCredentialsGrant(req, res, params);
                    break;
                default:
                    this.errorHandler.handleOAuthError(res, utils_1.BaseErrorHandler.createAuthError('unsupported_grant_type', `Grant type ${params.grant_type} is not supported`), 400);
                    break;
            }
        }
        catch (error) {
            this.securityLogger.error('Token endpoint error:', error);
            this.errorHandler.handleStandardError(res, {
                code: 'server_error',
                message: 'Internal server error',
                statusCode: 500
            });
            return;
        }
    }
    /**
     * Handle authorization code grant
     */
    async handleAuthorizationCodeGrant(req, res, params) {
        try {
            // Validate required parameters
            if (!params.code || !params.redirect_uri || !params.client_id) {
                this.securityLogger.error('Token exchange: Missing required parameters', {
                    hasCode: !!params.code,
                    hasRedirectUri: !!params.redirect_uri,
                    hasClientId: !!params.client_id
                });
                this.errorHandler.handleOAuthError(res, utils_1.BaseErrorHandler.createAuthError('invalid_request', 'Missing required parameters'), 400);
                return;
            }
            // Validate client
            const client = await oauth_client_manager_1.oAuth2ClientManager.validateClient(params.client_id, params.client_secret);
            if (!client) {
                this.securityLogger.error('Token exchange: Client authentication failed', {
                    clientId: params.client_id,
                    hasClientSecret: !!params.client_secret
                });
                this.errorHandler.handleOAuthError(res, utils_1.BaseErrorHandler.createAuthError('invalid_client', 'Client authentication failed'), 401);
                return;
            }
            this.securityLogger.debug('Token exchange: Client validated', { clientId: params.client_id });
            // Exchange authorization code
            const authCode = oauth_authorization_code_manager_1.oAuth2AuthorizationCodeManager.exchangeAuthorizationCode(params.code, params.client_id, params.redirect_uri, params.code_verifier);
            if (!authCode) {
                this.securityLogger.error('Token exchange: Invalid authorization code', {
                    clientId: params.client_id,
                    redirectUri: params.redirect_uri,
                    hasCodeVerifier: !!params.code_verifier
                });
                this.errorHandler.handleOAuthError(res, utils_1.BaseErrorHandler.createAuthError('invalid_grant', 'Invalid authorization code'), 400);
                return;
            }
            this.securityLogger.debug('Token exchange: Authorization code validated', {
                clientId: params.client_id,
                userId: authCode.userId,
                scopes: authCode.scopes.join(' ')
            });
            // Generate tokens
            const tokenPair = await this.tokenManager.generateTokenPair(authCode.userId, params.client_id, authCode.scopes, { includeRefreshToken: true });
            this.securityLogger.info('Token exchange: Success', {
                clientId: params.client_id,
                userId: authCode.userId,
                scopes: authCode.scopes.join(' ')
            });
            this.responseBuilder.sendTokenResponse(res, {
                access_token: tokenPair.accessToken,
                token_type: tokenPair.tokenType,
                expires_in: tokenPair.expiresIn,
                refresh_token: tokenPair.refreshToken,
                scope: tokenPair.scope
            });
        }
        catch (error) {
            this.securityLogger.error('Token exchange: Unexpected error', {
                error: error.message,
                stack: error.stack,
                clientId: params.client_id
            });
            this.errorHandler.handleOAuthError(res, utils_1.BaseErrorHandler.createAuthError('server_error', 'Internal server error during token exchange'), 500);
        }
    }
    /**
     * Handle refresh token grant
     */
    async handleRefreshTokenGrant(req, res, params) {
        if (!params.refresh_token || !params.client_id) {
            this.errorHandler.handleOAuthError(res, utils_1.BaseErrorHandler.createAuthError('invalid_request', 'Missing required parameters'), 400);
            return;
        }
        // Validate client
        const client = await oauth_client_manager_1.oAuth2ClientManager.validateClient(params.client_id, params.client_secret);
        if (!client) {
            this.errorHandler.handleOAuthError(res, utils_1.BaseErrorHandler.createAuthError('invalid_client', 'Client authentication failed'), 401);
            return;
        }
        // Refresh tokens
        const newTokenPair = await this.tokenManager.refreshAccessToken(params.refresh_token, params.client_id);
        if (!newTokenPair) {
            this.errorHandler.handleOAuthError(res, utils_1.BaseErrorHandler.createAuthError('invalid_grant', 'Invalid refresh token'), 400);
            return;
        }
        this.responseBuilder.sendTokenResponse(res, {
            access_token: newTokenPair.accessToken,
            token_type: newTokenPair.tokenType,
            expires_in: newTokenPair.expiresIn,
            scope: newTokenPair.scope
        });
    }
    /**
     * Handle client credentials grant
     */
    async handleClientCredentialsGrant(req, res, params) {
        // Validate client credentials
        const client = await oauth_client_manager_1.oAuth2ClientManager.validateClient(params.client_id, params.client_secret);
        if (!client) {
            this.errorHandler.handleOAuthError(res, utils_1.BaseErrorHandler.createAuthError('invalid_client', 'Client authentication failed'), 401);
            return;
        }
        // Parse requested scopes
        const requestedScopes = params.scope ? params.scope.split(' ') : ['mcp.read'];
        const allowedScopes = requestedScopes.filter(scope => client.scopes.includes(scope));
        if (allowedScopes.length === 0) {
            this.errorHandler.handleOAuthError(res, utils_1.BaseErrorHandler.createAuthError('invalid_scope', 'No valid scopes requested'), 400);
            return;
        }
        // Generate client credentials token (no refresh token)
        const tokenPair = await this.tokenManager.generateTokenPair(params.client_id, // Use client ID as subject for client credentials
        params.client_id, allowedScopes, {
            includeRefreshToken: false,
            customClaims: { token_use: 'client_credentials' }
        });
        this.responseBuilder.sendTokenResponse(res, {
            access_token: tokenPair.accessToken,
            token_type: tokenPair.tokenType,
            expires_in: tokenPair.expiresIn,
            scope: tokenPair.scope
        });
    }
    /**
     * Handle client registration
     */
    async handleClientRegistration(req, res) {
        try {
            const registrationResponse = await oauth_client_manager_1.oAuth2ClientManager.registerClient(req.body);
            this.responseBuilder.sendClientRegistrationResponse(res, registrationResponse);
        }
        catch (error) {
            this.securityLogger.error('Client registration error:', error);
            this.errorHandler.handleStandardError(res, {
                code: 'invalid_request',
                message: error.message,
                statusCode: 400
            });
            return;
        }
    }
    /**
     * Handle token introspection (RFC 7662)
     */
    async handleTokenIntrospection(req, res) {
        try {
            const { token } = req.body;
            if (!token) {
                this.errorHandler.handleOAuthError(res, utils_1.BaseErrorHandler.createAuthError('invalid_request', 'token parameter is required'), 400);
                return;
            }
            // Validate the requesting client (simplified - in production, implement proper client auth)
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith('Basic ')) {
                this.errorHandler.handleOAuthError(res, utils_1.BaseErrorHandler.createAuthError('invalid_client', 'Client authentication (Basic) required'), 401);
                return;
            }
            const credentials = Buffer.from(authHeader.slice('Basic '.length), 'base64').toString('utf8');
            const sep = credentials.indexOf(':');
            const clientId = sep >= 0 ? credentials.slice(0, sep) : '';
            const clientSecret = sep >= 0 ? credentials.slice(sep + 1) : '';
            const client = await oauth_client_manager_1.oAuth2ClientManager.validateClient(clientId, clientSecret);
            if (!client) {
                return this.errorHandler.handleOAuthError(res, utils_1.BaseErrorHandler.createAuthError('invalid_request', 'Invalid client credentials'), 401);
            }
            // Validate the token
            const validation = await this.oAuthValidator.validateToken(token);
            if (!validation.valid) {
                // Token is invalid or expired
                this.responseBuilder.sendIntrospectionResponse(res, {
                    active: false
                });
                return;
            }
            // Token is active, return token information
            const response = {
                active: true,
                scope: validation.scopes?.join(' '),
                client_id: validation.clientId,
                username: validation.subject,
                token_type: 'Bearer',
                exp: validation.expires,
                iat: validation.payload?.iat,
                sub: validation.subject,
                aud: validation.audience,
                iss: this.config.issuer,
                jti: validation.payload?.jti
            };
            // Add additional claims if available
            if (validation.payload?.organizationId) {
                response.organization_id = validation.payload.organizationId;
            }
            if (validation.payload?.tenantId) {
                response.tenant_id = validation.payload.tenantId;
            }
            if (validation.payload?.roles) {
                response.roles = validation.payload.roles;
            }
            this.securityLogger.info('Token introspection performed', {
                active: response.active,
                clientId: validation.clientId,
                subject: validation.subject
            });
            this.responseBuilder.sendIntrospectionResponse(res, response);
        }
        catch (error) {
            this.securityLogger.error('Token introspection error:', error);
            this.errorHandler.handleStandardError(res, {
                code: 'server_error',
                message: 'Internal server error',
                statusCode: 500
            });
            return;
        }
    }
    /**
     * Handle user info endpoint (OpenID Connect)
     */
    async handleUserInfo(req, res) {
        try {
            // Extract access token (robust parsing)
            const token = this.oAuthValidator.extractBearerToken(req);
            if (!token) {
                const resourceMetadataUrl = `${this.config.baseUrl}/.well-known/oauth-protected-resource`;
                const authError = utils_1.BaseErrorHandler.createAuthError('invalid_token', 'Bearer token required');
                return this.errorHandler.handleAuthError(res, authError, resourceMetadataUrl);
            }
            // Validate the access token
            const validation = await this.oAuthValidator.validateToken(token);
            if (!validation.valid) {
                const resourceMetadataUrl = `${this.config.baseUrl}/.well-known/oauth-protected-resource`;
                const authError = utils_1.BaseErrorHandler.createAuthError('invalid_token', validation.error || 'Token validation failed');
                return this.errorHandler.handleAuthError(res, authError, resourceMetadataUrl);
            }
            // Check if token has required scope for userinfo
            const hasUserInfoScope = validation.scopes?.some(scope => scope === 'openid' || scope === 'profile' || scope === 'email');
            if (!hasUserInfoScope) {
                const resourceMetadataUrl = `${this.config.baseUrl}/.well-known/oauth-protected-resource`;
                const authError = utils_1.BaseErrorHandler.createAuthError('insufficient_scope', 'Token lacks required scope (openid/profile/email)');
                return this.errorHandler.handleAuthError(res, authError, resourceMetadataUrl);
            }
            // Get user information
            let userInfo = null;
            if (this.userInfoProvider) {
                userInfo = await this.userInfoProvider(validation.subject);
            }
            else {
                // No user info provider configured
                this.securityLogger.error('User info provider not configured');
                this.errorHandler.handleStandardError(res, {
                    code: 'server_error',
                    message: 'User information service not available',
                    statusCode: 500
                });
                return;
            }
            if (!userInfo) {
                this.errorHandler.handleStandardError(res, {
                    code: 'user_not_found',
                    message: 'User information not available',
                    statusCode: 404
                });
                return;
            }
            // Build userinfo response based on scopes
            const userInfoResponse = {
                sub: userInfo.userId
            };
            // Add claims based on granted scopes
            if (validation.scopes?.includes('profile')) {
                userInfoResponse.name = userInfo.name;
                userInfoResponse.picture = userInfo.picture;
            }
            if (validation.scopes?.includes('email')) {
                userInfoResponse.email = userInfo.email;
                userInfoResponse.email_verified = userInfo.emailVerified ?? true;
            }
            // Add custom claims
            if (userInfo.organizationId) {
                userInfoResponse.organization_id = userInfo.organizationId;
            }
            if (userInfo.tenantId) {
                userInfoResponse.tenant_id = userInfo.tenantId;
            }
            if (userInfo.roles && validation.scopes?.includes('roles')) {
                userInfoResponse.roles = userInfo.roles;
            }
            this.securityLogger.info('User info retrieved', {
                userId: userInfo.userId,
                scopes: validation.scopes?.join(' ')
            });
            this.responseBuilder.sendUserInfoResponse(res, userInfoResponse);
        }
        catch (error) {
            this.securityLogger.error('User info endpoint error:', error);
            this.errorHandler.handleStandardError(res, {
                code: 'server_error',
                message: 'Internal server error',
                statusCode: 500
            });
            return;
        }
    }
    /**
     * Generate login form with CSRF token
     */
    generateLoginForm(error, returnUrl, csrfToken) {
        const errorMessage = error ? this.getErrorMessage(error) : '';
        return this.buildLoginFormHtml(errorMessage, returnUrl, csrfToken);
    }
    /**
     * Build login form HTML (simplified)
     */
    buildLoginFormHtml(errorMessage, returnUrl, csrfToken) {
        // Use relative URL for form action - works universally with CSP 'self'
        return `
			<!DOCTYPE html>
			<html>
			<head>
				<title>Sign In - Gauzy MCP OAuth Server</title>
				<meta charset="utf-8">
				<meta name="viewport" content="width=device-width, initial-scale=1">
				${this.getCommonStyles()}
			</head>
			<body>
				<div class="card">
					<div class="logo">
						<h1>🔐 MCP OAuth</h1>
						<p>Sign in to authorize applications</p>
					</div>

					${errorMessage ? `<div class="error">${(0, escape_html_1.default)(errorMessage)}</div>` : ''}

					<form method="POST" action="${(0, escape_html_1.default)(this.config.loginEndpoint || '')}">
            			<input type="hidden" name="_csrf" value="${(0, escape_html_1.default)(csrfToken || '')}" />
						<input type="hidden" name="return_url" value="${(0, escape_html_1.default)(returnUrl || '')}">

						<div class="form-group">
							<label for="email">Email Address</label>
							<input type="email" id="email" name="email" required placeholder="Enter your email address">
						</div>

						<div class="form-group">
							<label for="password">Password</label>
							<input type="password" id="password" name="password" required placeholder="Enter your password">
						</div>

						<button type="submit" class="btn btn-primary">Sign In</button>
					</form>
				</div>
			</body>
			</html>
		`;
    }
    /**
     * Get common CSS styles for forms
     */
    getCommonStyles() {
        return `
			<style>
				body { font-family: Arial, sans-serif; max-width: 400px; margin: 100px auto; padding: 20px; background: #f5f5f5; }
				.card { border: 1px solid #ddd; border-radius: 8px; padding: 30px; background: #fff; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
				.logo { text-align: center; margin-bottom: 30px; }
				.logo h1 { color: #333; margin: 0; font-size: 24px; }
				.logo p { color: #666; margin: 5px 0 0 0; font-size: 14px; }
				.form-group { margin-bottom: 20px; }
				label { display: block; margin-bottom: 5px; color: #333; font-weight: bold; }
				input[type="email"], input[type="password"] { width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 16px; box-sizing: border-box; }
				input[type="email"]:focus, input[type="password"]:focus { outline: none; border-color: #007bff; }
				.btn { width: 100%; padding: 12px; border: none; border-radius: 4px; cursor: pointer; font-size: 16px; margin-top: 10px; }
				.btn-primary { background: #007bff; color: white; }
				.btn-primary:hover { background: #0056b3; }
				.error { color: #dc3545; margin-bottom: 15px; padding: 10px; background: #f8d7da; border: 1px solid #f5c6cb; border-radius: 4px; }
				.demo-info { margin-top: 20px; padding: 15px; background: #e7f3ff; border: 1px solid #bee5eb; border-radius: 4px; font-size: 14px; }
				.demo-info strong { color: #0c5460; }
			</style>
		`;
    }
    /**
     * Get human-readable error message
     */
    getErrorMessage(error) {
        const messages = {
            'missing_credentials': 'Please enter both email and password.',
            'invalid_credentials': 'Invalid email or password. Please try again.',
            'server_error': 'An error occurred. Please try again later.'
        };
        return messages[error] || 'An error occurred during sign in.';
    }
    /**
     * Generate user consent form with CSRF token
     */
    generateConsentForm(params, client, user, csrfToken) {
        const scopes = params.scope ? params.scope.split(' ') : ['mcp.read'];
        const scopeDescriptions = this.getScopeDescriptions();
        return this.buildConsentFormHtml(params, client, user, scopes, scopeDescriptions, csrfToken);
    }
    /**
     * Get scope descriptions mapping
     */
    getScopeDescriptions() {
        return {
            'mcp.read': 'Read access to your MCP data and tools',
            'mcp.write': 'Write access to modify your MCP data',
            'mcp.admin': 'Administrative access to manage your MCP resources',
            'openid': 'Access to your identity information',
            'profile': 'Access to your basic profile information',
            'email': 'Access to your email address',
            'roles': 'Access to your role and permission information'
        };
    }
    /**
     * Build consent form HTML (simplified)
     */
    buildConsentFormHtml(params, client, user, scopes, scopeDescriptions, csrfToken) {
        return `
			<!DOCTYPE html>
			<html>
			<head>
				<title>Authorize ${(0, escape_html_1.default)(client.clientName)}</title>
				<meta charset="utf-8">
				<meta name="viewport" content="width=device-width, initial-scale=1">
				${this.getConsentFormStyles()}
			</head>
			<body>
				<div class="card">
					<div class="header">
						${client.logoUri ? `<img src="${(0, escape_html_1.default)(client.logoUri)}" alt="${(0, escape_html_1.default)(client.clientName)}" class="app-icon">` : ''}
						<h1>Authorize ${(0, escape_html_1.default)(client.clientName)}</h1>
						<p class="subtitle">${(0, escape_html_1.default)(client.clientName)} wants to access your MCP account</p>
					</div>

					${user ? this.buildUserInfoSection(user) : ''}
					${this.buildScopesSection(scopes || [], scopeDescriptions || {})}
					${this.buildSecurityNotice(client.clientName)}
					${this.buildConsentForm(params, csrfToken)}
					${this.buildConsentFooter(params, client.clientName)}
				</div>
			</body>
			</html>
		`;
    }
    /**
     * Get consent form styles
     */
    getConsentFormStyles() {
        return `
			<style>
				body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; background: #f5f5f5; }
				.card { border: 1px solid #ddd; border-radius: 8px; padding: 30px; background: #fff; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
				.header { text-align: center; margin-bottom: 30px; }
				.app-icon { width: 64px; height: 64px; border-radius: 8px; margin-bottom: 20px; }
				h1 { color: #333; margin-bottom: 10px; font-size: 24px; }
				.subtitle { color: #666; margin-bottom: 20px; }
				.user-info { background: #e7f3ff; border: 1px solid #bee5eb; border-radius: 6px; padding: 15px; margin-bottom: 25px; }
				.user-info strong { color: #0c5460; }
				.scopes { margin: 20px 0; }
				.scopes h3 { color: #333; margin-bottom: 15px; font-size: 16px; }
				.scope { padding: 12px; margin: 8px 0; background: #f8f9fa; border-left: 4px solid #007bff; border-radius: 4px; }
				.scope-name { font-weight: bold; color: #007bff; }
				.scope-desc { color: #666; font-size: 14px; margin-top: 4px; }
				.warning { background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 6px; padding: 15px; margin: 20px 0; }
				.warning strong { color: #856404; }
				.buttons { margin-top: 30px; text-align: center; }
				button { padding: 14px 30px; margin: 0 10px; border: none; border-radius: 6px; cursor: pointer; font-size: 16px; font-weight: bold; transition: all 0.2s; }
				.approve { background: #28a745; color: white; }
				.deny { background: #6c757d; color: white; }
				.approve:hover { background: #218838; transform: translateY(-1px); }
				.deny:hover { background: #545b62; transform: translateY(-1px); }
				.footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #999; text-align: center; }
				.security-info { margin-top: 15px; font-size: 11px; color: #666; }
			</style>
		`;
    }
    /**
     * Build user info section for consent form
     */
    buildUserInfoSection(user) {
        return `
			<div class="user-info">
				<strong>Signed in as:</strong> ${(0, escape_html_1.default)(user.name || user.email)}<br>
				<small>${(0, escape_html_1.default)(user.email)}${user.organizationId ? ` • ${(0, escape_html_1.default)(user.organizationId)}` : ''}</small>
			</div>
		`;
    }
    /**
     * Build scopes section for consent form
     */
    buildScopesSection(scopes, scopeDescriptions) {
        const scopeItems = scopes.map(scope => `
			<div class="scope">
				<div class="scope-name">${(0, escape_html_1.default)(scope)}</div>
				<div class="scope-desc">${(0, escape_html_1.default)(scopeDescriptions[scope] || 'Custom permission for this application')}</div>
			</div>
		`).join('');
        return `
			<div class="scopes">
				<h3>📋 Requested Permissions</h3>
				${scopeItems}
			</div>
		`;
    }
    /**
     * Build security notice section
     */
    buildSecurityNotice(clientName) {
        return `
			<div class="warning">
				<strong>⚠️ Security Notice:</strong> Only authorize applications you trust. This will give ${(0, escape_html_1.default)(clientName)} access to the permissions listed above.
			</div>
		`;
    }
    /**
     * Build consent form section
     */
    buildConsentForm(params, csrfToken) {
        // Use relative URL for form action - works universally with CSP 'self'
        return `
			<form method="POST" action="${(0, escape_html_1.default)(this.config.authorizationEndpoint)}">
            	<input type="hidden" name="_csrf" value="${(0, escape_html_1.default)(csrfToken || '')}" />
				<input type="hidden" name="client_id" value="${(0, escape_html_1.default)(params.client_id)}">
				<input type="hidden" name="redirect_uri" value="${(0, escape_html_1.default)(params.redirect_uri)}">
				<input type="hidden" name="scope" value="${(0, escape_html_1.default)(params.scope || '')}">
				<input type="hidden" name="state" value="${(0, escape_html_1.default)(params.state || '')}">
				<input type="hidden" name="code_challenge" value="${(0, escape_html_1.default)(params.code_challenge || '')}">
				<input type="hidden" name="code_challenge_method" value="${(0, escape_html_1.default)(params.code_challenge_method || '')}">

				<div class="buttons">
					<button type="submit" name="user_consent" value="approve" class="approve">✓ Authorize</button>
					<button type="submit" name="user_consent" value="deny" class="deny">✗ Deny</button>
				</div>
			</form>
		`;
    }
    /**
     * Build consent form footer
     */
    buildConsentFooter(params, clientName) {
        return `
			<div class="footer">
				<p>By clicking "Authorize", you allow ${(0, escape_html_1.default)(clientName)} to access your account using the permissions above.</p>
				<div class="security-info">
					<strong>Client ID:</strong> ${(0, escape_html_1.default)(params.client_id)}<br>
					<strong>Redirect URI:</strong> ${(0, escape_html_1.default)(params.redirect_uri)}<br>
					${params.state ? `<strong>State:</strong> ${(0, escape_html_1.default)(params.state)}<br>` : ''}
					<strong>PKCE:</strong> ${params.code_challenge ? 'Enabled (Enhanced Security)' : 'Not Used'}
				</div>
			</div>
		`;
    }
    /**
     * Get Express app instance
     */
    getApp() {
        return this.app;
    }
    /**
     * Get token manager instance
     */
    getTokenManager() {
        return this.tokenManager;
    }
    /**
     * Get server statistics
     */
    getStats() {
        return {
            clients: oauth_client_manager_1.oAuth2ClientManager.listClients().length,
            authorizationCodes: oauth_authorization_code_manager_1.oAuth2AuthorizationCodeManager.getStats(),
            tokens: this.tokenManager.getStats()
        };
    }
    /**
     * Register error handling with CSRF error support
     */
    setupErrorHandling() {
        this.app.use((error, req, res, next) => {
            if (error?.code === 'EBADCSRFTOKEN') {
                // Enhanced logging for CSRF failures to aid debugging
                const sessionId = req.sessionID;
                const csrfTokenFromRequest = req.body._csrf || req.headers['x-csrf-token'];
                const cookies = req.cookies;
                this.securityLogger.warn('CSRF token validation failed', {
                    ip: req.ip,
                    userAgent: req.get('User-Agent'),
                    url: req.originalUrl,
                    method: req.method,
                    hasSessionId: !!sessionId,
                    sessionId: sessionId ? `${sessionId.substring(0, 8)}...` : 'none',
                    hasCsrfToken: !!csrfTokenFromRequest,
                    csrfTokenLength: csrfTokenFromRequest?.length || 0,
                    hasCsrfCookie: !!(cookies['__Host-mcp.x-csrf-token'] || cookies['__Secure-mcp.x-csrf-token'] || cookies['mcp-csrf-token']),
                    hasSessionCookie: !!cookies['mcp-oauth-session'],
                    referer: req.get('Referer'),
                    origin: req.get('Origin')
                });
                // For OAuth redirects, send error to redirect_uri if available
                if (req.body.client_id && req.body.redirect_uri && req.body.state) {
                    if (oauth_client_manager_1.oAuth2ClientManager.isValidRedirectUri(req.body.client_id, req.body.redirect_uri)) {
                        this.errorHandler.handleOAuthRedirectError(res, req.body.redirect_uri, 'invalid_request', 'CSRF protection failed', req.body.state, req.body.client_id);
                        return;
                    }
                    this.securityLogger.warn('Blocked CSRF redirect to unregistered redirect_uri', {
                        clientId: req.body.client_id,
                        redirectUri: req.body.redirect_uri
                    });
                }
                // Fallback JSON error
                this.errorHandler.handleStandardError(res, {
                    code: 'invalid_request',
                    message: 'CSRF protection failed. Please try again.',
                    statusCode: 403
                });
                return;
            }
            // Handle other errors
            this.securityLogger.error('Unhandled error:', error);
            this.errorHandler.handleStandardError(res, {
                code: 'server_error',
                message: 'Internal server error',
                statusCode: 500
            });
        });
    }
}
exports.OAuth2AuthorizationServer = OAuth2AuthorizationServer;
// Allowlist of permitted relative return URLs for redirection (add your app's expected endpoints here)
OAuth2AuthorizationServer.ALLOWED_RETURN_PATHS = [
    '/oauth2/authorize', // OAuth authorization endpoint
    '/oauth2/callback', // OAuth callback endpoint
    '/callback', // Test callback endpoint
    '/dashboard',
    '/profile',
    // Add other safe endpoints as appropriate
];
//# sourceMappingURL=oauth-authorization-server.js.map