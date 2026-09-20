/**
 * `OAuthClient` — registry row for the multi-app OAuth Authorization Server.
 *
 * What changed from the single-app version:
 *
 * Previously, there was no entity at all. The single OAuth client was
 * hardcoded via `GAUZY_OAUTH_APP_*` env vars in `packages/config` and
 * read by `SocialAuthService.getOAuthAppConfig()`. Every third party
 * (only Activepieces existed) shared the same `client_id`/`client_secret`.
 *
 * This entity persists one row per registered third party (Activepieces,
 * n8n, Make.com, future apps) so each gets isolated credentials, redirect
 * URIs, and scopes. The row is owned by a tenant via the inherited
 * nullable `tenantId` from `TenantBaseEntity` — null means a global,
 * cross-tenant client (matches the previous single-app behavior used by
 * the legacy seed).
 *
 * NOTE: `accessTokenTtl` and `refreshTokenTtl` are stored on the row so
 * the registry shape is final, but per-client TTL enforcement is deferred
 * to a follow-up PR — token issuance still uses the global
 * `JWT_TOKEN_EXPIRATION_TIME` for now.
 */
import { IOAuthClient, OAuthClientType, OAuthGrantType } from '@gauzy/contracts';
import { TenantBaseEntity } from '../../core/entities/internal';
export declare class OAuthClient extends TenantBaseEntity implements IOAuthClient {
    /**
     * Public client identifier exposed to third parties.
     * Generated as `gauzy_<base64url>` by `OAuthClientService.create`.
     */
    clientId: string;
    /**
     * scrypt-hashed client secret (via `@gauzy/utils` `hashPassword`).
     * Null only for `public` clients.
     * The plaintext is returned EXACTLY ONCE on creation / rotation
     * and is never persisted in plaintext or returned by any read endpoint.
     */
    clientSecretHash: string | null;
    /**
     * Per-client HMAC secret used to sign authorization codes
     * (`v1.<payload>.<sig>` format). Stored per-client so revoking one
     * third party cannot forge codes for another. Never returned by the API.
     */
    codeSecret: string;
    name: string;
    description?: string | null;
    clientType: OAuthClientType;
    redirectUris: string[];
    allowedScopes: string[];
    allowedGrantTypes: OAuthGrantType[];
    pkceRequired: boolean;
    accessTokenTtl: number;
    refreshTokenTtl: number;
    /**
     * Whether the supplied redirect URI is in this client's allowlist.
     * Exact-match comparison (no wildcard, no path-prefix), matching the
     * behavior of the previous single-app `isOAuthAppRedirectUriAllowed`.
     */
    isRedirectUriAllowed(redirectUri: string): boolean;
    /**
     * Whether every requested scope is contained in `allowedScopes`.
     * Empty / undefined input is treated as "no scopes requested" → allowed.
     */
    areScopesAllowed(requestedScope?: string): boolean;
    /**
     * Whether this client is allowed to use the given grant type.
     */
    isGrantTypeAllowed(grantType: OAuthGrantType): boolean;
}
