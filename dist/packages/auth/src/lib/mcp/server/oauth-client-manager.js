"use strict";
/**
 * OAuth 2.0 Client Management
 *
 * Manages OAuth 2.0 client registration and validation for MCP authorization
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.oAuth2ClientManager = exports.OAuth2ClientManager = void 0;
const tslib_1 = require("tslib");
const crypto = tslib_1.__importStar(require("crypto"));
const bcryptjs_1 = tslib_1.__importDefault(require("bcryptjs"));
const security_logger_1 = require("../utils/security-logger");
class OAuth2ClientManager {
    constructor() {
        this.clients = new Map();
        // Default supported scopes for MCP
        this.DEFAULT_SCOPES = ['mcp.read', 'mcp.write', 'mcp.admin'];
        this.DEFAULT_GRANT_TYPES = ['authorization_code', 'refresh_token'];
        this.DEFAULT_RESPONSE_TYPES = ['code'];
        this.securityLogger = new security_logger_1.SecurityLogger();
    }
    /**
     * Register well-known MCP clients (ChatGPT, Claude) as public clients.
     *
     * These are the primary MCP ecosystem clients with stable, well-known redirect URIs.
     * Pre-registering them allows out-of-the-box connectivity without manual setup.
     *
     * - All default clients are public (no secrets stored)
     * - Registration is non-blocking: if a client ID already exists (e.g., admin registered
     *   a custom one), the default is silently skipped
     * - Additional clients can be registered dynamically via POST /oauth2/register
     */
    async registerDefaultClients() {
        const defaults = [
            {
                id: 'chatgpt-mcp-client',
                request: {
                    client_name: 'ChatGPT MCP Integration',
                    client_type: 'public',
                    redirect_uris: [
                        'https://chatgpt.com/oauth/callback',
                        'https://chat.openai.com/oauth/callback'
                    ],
                    grant_types: ['authorization_code', 'refresh_token'],
                    response_types: ['code'],
                    scope: 'mcp.read mcp.write',
                    logo_uri: 'https://openai.com/favicon.ico',
                    client_uri: 'https://chatgpt.com',
                    metadata: { integration_type: 'chatgpt', default_client: true }
                }
            },
            {
                id: 'claude-mcp-client',
                request: {
                    client_name: 'Claude MCP Integration',
                    client_type: 'public',
                    redirect_uris: [
                        'http://localhost:*',
                        'https://claude.ai/oauth/callback'
                    ],
                    grant_types: ['authorization_code'],
                    response_types: ['code'],
                    scope: 'mcp.read mcp.write',
                    logo_uri: 'https://claude.ai/favicon.ico',
                    client_uri: 'https://claude.ai',
                    metadata: { integration_type: 'claude', default_client: true }
                }
            }
        ];
        for (const { id, request } of defaults) {
            try {
                // Skip if a client with this ID already exists (admin may have registered a custom one)
                if (this.clients.has(id)) {
                    this.securityLogger.log(`Default client '${id}' skipped: already registered`);
                    continue;
                }
                await this.registerClient(request, id);
            }
            catch (err) {
                // Non-blocking: log and continue — default clients should never prevent server startup
                this.securityLogger.warn(`Default client '${id}' registration skipped: ${err.message}`);
            }
        }
        this.securityLogger.log(`Default MCP clients initialized (${this.clients.size} registered)`);
    }
    /**
     * Register a new OAuth 2.0 client (public or confidential)
     *
     * - Public clients: No client_secret is generated (e.g., SPAs, native apps)
     * - Confidential clients: A client_secret is generated and hashed (e.g., server-side apps)
     *
     * Clients can also be registered dynamically via POST /oauth2/register.
     */
    async registerClient(request, customClientId) {
        try {
            // Validate request
            this.validateClientRegistration(request);
            const clientId = customClientId || this.generateClientId();
            if (this.clients.has(clientId)) {
                throw new Error(`client_id already exists: ${clientId}`);
            }
            const clientType = request.client_type || 'confidential';
            const grantTypes = request.grant_types || this.DEFAULT_GRANT_TYPES;
            const responseTypes = request.response_types || this.DEFAULT_RESPONSE_TYPES;
            const scopes = this.parseAndValidateScopes(request.scope);
            // Generate client secret for confidential clients
            let clientSecret;
            let clientSecretHash;
            if (clientType === 'confidential') {
                clientSecret = this.generateClientSecret();
                clientSecretHash = await bcryptjs_1.default.hash(clientSecret, 12);
            }
            // Validate redirect URIs
            this.validateRedirectUris(request.redirect_uris, clientType);
            const client = {
                clientId,
                clientSecretHash,
                clientName: request.client_name,
                clientType,
                redirectUris: request.redirect_uris,
                grantTypes,
                responseTypes,
                scopes,
                logoUri: request.logo_uri,
                clientUri: request.client_uri,
                policyUri: request.policy_uri,
                tosUri: request.tos_uri,
                createdAt: new Date(),
                updatedAt: new Date(),
                isActive: true,
                metadata: request.metadata
            };
            // Store client
            this.clients.set(clientId, client);
            this.securityLogger.log(`OAuth 2.0 client registered: ${clientId} (${request.client_name})`);
            // Return registration response based on client type
            const baseResponse = {
                client_id: clientId,
                client_name: client.clientName,
                redirect_uris: client.redirectUris,
                grant_types: client.grantTypes,
                response_types: client.responseTypes,
                scope: client.scopes.join(' '),
                logo_uri: client.logoUri,
                client_uri: client.clientUri,
                policy_uri: client.policyUri,
                tos_uri: client.tosUri,
                client_id_issued_at: Math.floor(client.createdAt.getTime() / 1000)
            };
            const response = clientType === 'confidential'
                ? {
                    ...baseResponse,
                    client_type: 'confidential',
                    client_secret: clientSecret,
                    client_secret_expires_at: 0 // 0 = never expires
                }
                : {
                    ...baseResponse,
                    client_type: 'public',
                    client_secret: undefined,
                    client_secret_expires_at: undefined
                };
            return response;
        }
        catch (error) {
            this.securityLogger.error('Client registration failed:', error);
            throw new Error(`Client registration failed: ${error.message}`);
        }
    }
    /**
     * Validate client credentials
     */
    async validateClient(clientId, clientSecret) {
        const client = this.clients.get(clientId);
        if (!client || !client.isActive) {
            return null;
        }
        // Public clients don't require secret validation
        if (client.clientType === 'public') {
            return client;
        }
        // Confidential clients must provide valid secret
        if (!clientSecret || !client.clientSecretHash) {
            return null;
        }
        const isValidSecret = await bcryptjs_1.default.compare(clientSecret, client.clientSecretHash);
        return isValidSecret ? client : null;
    }
    /**
     * Get client by ID
     */
    getClient(clientId) {
        return this.clients.get(clientId) || null;
    }
    /**
     * Validate redirect URI for client
     */
    isValidRedirectUri(clientId, redirectUri) {
        const client = this.clients.get(clientId);
        if (!client)
            return false;
        let target;
        try {
            target = new URL(redirectUri);
        }
        catch {
            return false;
        }
        return client.redirectUris.some((uri) => {
            if (uri === redirectUri)
                return true;
            if (uri.includes('localhost:*')) {
                const isHttp = target.protocol === 'http:' || target.protocol === 'https:';
                return isHttp && (target.hostname === 'localhost' || target.hostname === '127.0.0.1' || target.hostname === '::1');
            }
            try {
                const spec = new URL(uri);
                return spec.origin === target.origin && spec.pathname === target.pathname;
            }
            catch {
                return false;
            }
        });
    }
    /**
     * Check if client supports grant type
     */
    supportsGrantType(clientId, grantType) {
        const client = this.clients.get(clientId);
        return client ? client.grantTypes.includes(grantType) : false;
    }
    /**
     * Check if client has required scopes
     */
    hasScope(clientId, requiredScope) {
        const client = this.clients.get(clientId);
        return client ? client.scopes.includes(requiredScope) : false;
    }
    /**
     * List all clients (for admin purposes)
     */
    listClients() {
        return Array.from(this.clients.values());
    }
    /**
     * Generate client ID
     */
    generateClientId() {
        return `mcp_${crypto.randomUUID().replace(/-/g, '')}`;
    }
    /**
     * Generate client secret
     */
    generateClientSecret() {
        // 64 bytes hex (~128 chars) prefixed for readability
        return `mcs_${crypto.randomBytes(64).toString('hex')}`;
    }
    /**
     * Validate client registration request
     */
    validateClientRegistration(request) {
        if (!request.client_name || request.client_name.trim().length === 0) {
            throw new Error('client_name is required');
        }
        if (!request.redirect_uris || request.redirect_uris.length === 0) {
            throw new Error('At least one redirect_uri is required');
        }
        // Validate client type
        if (request.client_type && !['confidential', 'public'].includes(request.client_type)) {
            throw new Error('client_type must be either confidential or public');
        }
    }
    /**
     * Validate redirect URIs
     */
    validateRedirectUris(redirectUris, clientType) {
        for (const uri of redirectUris) {
            try {
                const url = new URL(uri.includes('localhost:*') ? uri.replace(':*', ':3000') : uri);
                // Public clients should use secure URLs (except localhost for development)
                const isLoopback = url.hostname === 'localhost' || url.hostname === '127.0.0.1' || url.hostname === '::1';
                if (clientType === 'public' && url.protocol !== 'https:' && !isLoopback) {
                    throw new Error(`Public clients must use HTTPS redirect URIs: ${uri}`);
                }
            }
            catch (error) {
                throw new Error(`Invalid redirect URI: ${uri}`);
            }
        }
    }
    /**
     * Parse and validate scopes
     */
    parseAndValidateScopes(scopeString) {
        if (!scopeString) {
            return ['mcp.read']; // Default minimal scope
        }
        const requestedScopes = scopeString.split(' ').filter(s => s.length > 0);
        const validScopes = requestedScopes.filter(scope => this.DEFAULT_SCOPES.includes(scope));
        if (validScopes.length === 0) {
            throw new Error(`No valid scopes requested. Available: ${this.DEFAULT_SCOPES.join(', ')}`);
        }
        return validScopes;
    }
}
exports.OAuth2ClientManager = OAuth2ClientManager;
// Singleton instance
exports.oAuth2ClientManager = new OAuth2ClientManager();
//# sourceMappingURL=oauth-client-manager.js.map