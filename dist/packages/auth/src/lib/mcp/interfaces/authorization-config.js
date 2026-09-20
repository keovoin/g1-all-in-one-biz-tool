"use strict";
/**
 * OAuth 2.0 Authorization Configuration for MCP Server
 *
 * This module defines the configuration and types needed for OAuth 2.0 authorization
 * following RFC 9728 (OAuth 2.0 Protected Resource Metadata) and MCP specification.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AUTH_ENV_KEYS = exports.DEFAULT_AUTHORIZATION_CONFIG = void 0;
exports.loadAuthorizationConfig = loadAuthorizationConfig;
/**
 * Default authorization configuration
 */
exports.DEFAULT_AUTHORIZATION_CONFIG = {
    enabled: false,
    requiredScopes: [],
    jwt: {
        algorithms: ['RS256'],
    },
    cache: {
        tokenTtl: 300, // 5 minutes
        metadataTtl: 3600, // 1 hour
    },
};
/**
 * Environment variable keys for authorization configuration
 */
exports.AUTH_ENV_KEYS = {
    ENABLED: 'MCP_AUTH_ENABLED',
    RESOURCE_URI: 'MCP_AUTH_RESOURCE_URI',
    AUTHORIZATION_SERVERS: 'MCP_AUTH_SERVERS',
    REQUIRED_SCOPES: 'MCP_AUTH_REQUIRED_SCOPES',
    JWT_AUDIENCE: 'MCP_AUTH_JWT_AUDIENCE',
    JWT_ISSUER: 'MCP_AUTH_JWT_ISSUER',
    JWT_ALGORITHMS: 'MCP_AUTH_JWT_ALGORITHMS',
    JWT_PUBLIC_KEY: 'MCP_AUTH_JWT_PUBLIC_KEY',
    JWT_JWKS_URI: 'MCP_AUTH_JWT_JWKS_URI',
    INTROSPECTION_ENDPOINT: 'MCP_AUTH_INTROSPECTION_ENDPOINT',
    INTROSPECTION_CLIENT_ID: 'MCP_AUTH_INTROSPECTION_CLIENT_ID',
    INTROSPECTION_CLIENT_SECRET: 'MCP_AUTH_INTROSPECTION_CLIENT_SECRET',
    TOKEN_CACHE_TTL: 'MCP_AUTH_TOKEN_CACHE_TTL',
    METADATA_CACHE_TTL: 'MCP_AUTH_METADATA_CACHE_TTL',
};
/**
 * Load authorization configuration from environment variables
 */
function loadAuthorizationConfig() {
    const config = {
        ...exports.DEFAULT_AUTHORIZATION_CONFIG,
        enabled: process.env[exports.AUTH_ENV_KEYS.ENABLED] === 'true',
        resourceUri: process.env[exports.AUTH_ENV_KEYS.RESOURCE_URI] || '',
        authorizationServers: [],
    };
    // Parse authorization servers from environment
    const serversEnv = process.env[exports.AUTH_ENV_KEYS.AUTHORIZATION_SERVERS];
    if (serversEnv) {
        try {
            config.authorizationServers = JSON.parse(serversEnv);
        }
        catch (error) {
            console.warn('Failed to parse authorization servers configuration:', error);
        }
    }
    // Parse required scopes
    const scopesEnv = process.env[exports.AUTH_ENV_KEYS.REQUIRED_SCOPES];
    if (scopesEnv) {
        config.requiredScopes = scopesEnv.split(',').map(s => s.trim());
    }
    // JWT configuration
    if (config.jwt) {
        config.jwt.audience = process.env[exports.AUTH_ENV_KEYS.JWT_AUDIENCE];
        config.jwt.issuer = process.env[exports.AUTH_ENV_KEYS.JWT_ISSUER];
        config.jwt.publicKey = process.env[exports.AUTH_ENV_KEYS.JWT_PUBLIC_KEY];
        config.jwt.jwksUri = process.env[exports.AUTH_ENV_KEYS.JWT_JWKS_URI];
        const algorithmsEnv = process.env[exports.AUTH_ENV_KEYS.JWT_ALGORITHMS];
        if (algorithmsEnv) {
            config.jwt.algorithms = algorithmsEnv.split(',').map(a => a.trim());
        }
    }
    // Introspection configuration
    const introspectionEndpoint = process.env[exports.AUTH_ENV_KEYS.INTROSPECTION_ENDPOINT];
    const introspectionClientId = process.env[exports.AUTH_ENV_KEYS.INTROSPECTION_CLIENT_ID];
    const introspectionClientSecret = process.env[exports.AUTH_ENV_KEYS.INTROSPECTION_CLIENT_SECRET];
    if (introspectionEndpoint && introspectionClientId && introspectionClientSecret) {
        config.introspection = {
            endpoint: introspectionEndpoint,
            clientId: introspectionClientId,
            clientSecret: introspectionClientSecret,
        };
    }
    // Cache configuration
    if (config.cache) {
        const tokenTtl = process.env[exports.AUTH_ENV_KEYS.TOKEN_CACHE_TTL];
        if (tokenTtl) {
            config.cache.tokenTtl = parseInt(tokenTtl, 10);
        }
        const metadataTtl = process.env[exports.AUTH_ENV_KEYS.METADATA_CACHE_TTL];
        if (metadataTtl) {
            config.cache.metadataTtl = parseInt(metadataTtl, 10);
        }
    }
    return config;
}
//# sourceMappingURL=authorization-config.js.map