/**
 * OAuth 2.0 Authorization Configuration for MCP Server
 *
 * This module defines the configuration and types needed for OAuth 2.0 authorization
 * following RFC 9728 (OAuth 2.0 Protected Resource Metadata) and MCP specification.
 */
export interface AuthorizationServerConfig {
    /** The authorization server identifier (issuer URL) */
    issuer: string;
    /** Authorization endpoint URL */
    authorizationEndpoint: string;
    /** Token endpoint URL */
    tokenEndpoint: string;
    /** Optional dynamic client registration endpoint */
    registrationEndpoint?: string;
    /** Optional token introspection endpoint */
    introspectionEndpoint?: string;
    /** Supported grant types */
    grantTypesSupported: string[];
    /** Supported response types */
    responseTypesSupported: string[];
    /** Supported scopes */
    scopesSupported?: string[];
    /** PKCE code challenge methods supported */
    codeChallengeMethodsSupported?: string[];
}
export interface ProtectedResourceMetadata {
    /** The protected resource identifier */
    resource: string;
    /** List of authorization servers that can issue tokens for this resource */
    authorizationServers: string[];
    /** Optional scopes required for accessing this resource */
    scopesRequired?: string[];
    /** Optional bearer token methods supported */
    bearerMethodsSupported?: string[];
    /** Optional resource documentation URL */
    resourceDocumentation?: string;
    /** Optional policy URL */
    policyUri?: string;
    /** Optional terms of service URL */
    tosUri?: string;
}
export interface AuthorizationConfig {
    /** Whether authorization is enabled */
    enabled: boolean;
    /** The canonical resource URI for this MCP server */
    resourceUri: string;
    /** Authorization servers configuration */
    authorizationServers: AuthorizationServerConfig[];
    /** Required scopes for MCP operations */
    requiredScopes?: string[];
    /** JWT validation settings */
    jwt?: {
        /** Expected audience claim */
        audience?: string;
        /** Expected issuer claim */
        issuer?: string;
        /** Algorithm whitelist for JWT verification */
        algorithms?: string[];
        /** JWT verification public key or secret */
        publicKey?: string;
        /** JWKS URI for key discovery */
        jwksUri?: string;
    };
    /** Token introspection settings */
    introspection?: {
        /** Introspection endpoint URL */
        endpoint: string;
        /** Client credentials for introspection */
        clientId: string;
        clientSecret: string;
    };
    /** Cache settings for tokens and metadata */
    cache?: {
        /** Token cache TTL in seconds */
        tokenTtl?: number;
        /** Metadata cache TTL in seconds */
        metadataTtl?: number;
    };
}
export interface TokenValidationResult {
    /** Whether the token is valid */
    valid: boolean;
    /** The validated token payload */
    payload?: any;
    /** Error message if validation failed */
    error?: string;
    /** Token expiration timestamp */
    expires?: number;
    /** Scopes granted to the token */
    scopes?: string[];
    /** Subject (user) identifier */
    subject?: string;
    /** Client identifier */
    clientId?: string;
    /** Audience claim */
    audience?: string | string[];
}
export interface AuthorizationError {
    /** OAuth 2.0 error code */
    error: 'invalid_token' | 'insufficient_scope' | 'invalid_request' | 'access_denied' | 'invalid_client' | 'invalid_grant' | 'invalid_scope' | 'unsupported_grant_type' | 'server_error' | 'temporarily_unavailable' | 'unsupported_response_type';
    /** Human-readable error description */
    errorDescription?: string;
    /** URI to error documentation */
    errorUri?: string;
    /** Required scope for the operation */
    scope?: string;
}
/**
 * Default authorization configuration
 */
export declare const DEFAULT_AUTHORIZATION_CONFIG: Partial<AuthorizationConfig>;
/**
 * Environment variable keys for authorization configuration
 */
export declare const AUTH_ENV_KEYS: {
    readonly ENABLED: "MCP_AUTH_ENABLED";
    readonly RESOURCE_URI: "MCP_AUTH_RESOURCE_URI";
    readonly AUTHORIZATION_SERVERS: "MCP_AUTH_SERVERS";
    readonly REQUIRED_SCOPES: "MCP_AUTH_REQUIRED_SCOPES";
    readonly JWT_AUDIENCE: "MCP_AUTH_JWT_AUDIENCE";
    readonly JWT_ISSUER: "MCP_AUTH_JWT_ISSUER";
    readonly JWT_ALGORITHMS: "MCP_AUTH_JWT_ALGORITHMS";
    readonly JWT_PUBLIC_KEY: "MCP_AUTH_JWT_PUBLIC_KEY";
    readonly JWT_JWKS_URI: "MCP_AUTH_JWT_JWKS_URI";
    readonly INTROSPECTION_ENDPOINT: "MCP_AUTH_INTROSPECTION_ENDPOINT";
    readonly INTROSPECTION_CLIENT_ID: "MCP_AUTH_INTROSPECTION_CLIENT_ID";
    readonly INTROSPECTION_CLIENT_SECRET: "MCP_AUTH_INTROSPECTION_CLIENT_SECRET";
    readonly TOKEN_CACHE_TTL: "MCP_AUTH_TOKEN_CACHE_TTL";
    readonly METADATA_CACHE_TTL: "MCP_AUTH_METADATA_CACHE_TTL";
};
/**
 * Load authorization configuration from environment variables
 */
export declare function loadAuthorizationConfig(): AuthorizationConfig;
