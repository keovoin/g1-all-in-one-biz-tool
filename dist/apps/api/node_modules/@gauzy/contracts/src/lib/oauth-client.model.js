"use strict";
/**
 * Contract for the multi-app OAuth client registry.
 *
 * Added as part of the single-app → multi-app OAuth refactor.
 * In the previous (single-app) implementation, the one and only OAuth client
 * was hardcoded via `GAUZY_OAUTH_APP_CLIENT_*` env vars and shared by every
 * third-party integration (Activepieces). This contract describes a real
 * registry row so each third party (Activepieces, n8n, Make.com, …) gets
 * isolated credentials, redirect URIs, and scopes.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.OAuthGrantType = exports.OAuthClientType = void 0;
/**
 * Confidential clients can keep a secret (server-to-server). Public clients
 * (SPAs, mobile) cannot, and must use PKCE — PKCE itself is deferred to a
 * later phase, but the column is reserved on the entity now.
 */
var OAuthClientType;
(function (OAuthClientType) {
    OAuthClientType["CONFIDENTIAL"] = "confidential";
    OAuthClientType["PUBLIC"] = "public";
})(OAuthClientType || (exports.OAuthClientType = OAuthClientType = {}));
/**
 * Grant types this provider may support per client. Today only
 * `authorization_code` is implemented end-to-end; the others are reserved
 * so the registry shape doesn't need a migration when they ship.
 */
var OAuthGrantType;
(function (OAuthGrantType) {
    OAuthGrantType["AUTHORIZATION_CODE"] = "authorization_code";
    OAuthGrantType["REFRESH_TOKEN"] = "refresh_token";
    OAuthGrantType["CLIENT_CREDENTIALS"] = "client_credentials";
})(OAuthGrantType || (exports.OAuthGrantType = OAuthGrantType = {}));
//# sourceMappingURL=oauth-client.model.js.map