"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.OAuthClient = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const contracts_1 = require("@gauzy/contracts");
const entity_1 = require("../../core/decorators/entity");
const internal_1 = require("../../core/entities/internal");
const export_redact_decorator_1 = require("../../export-import/export-redact.decorator");
let OAuthClient = class OAuthClient extends internal_1.TenantBaseEntity {
    // ---------------------------------------------------------------------------
    // Helpers
    // ---------------------------------------------------------------------------
    /**
     * Whether the supplied redirect URI is in this client's allowlist.
     * Exact-match comparison (no wildcard, no path-prefix), matching the
     * behavior of the previous single-app `isOAuthAppRedirectUriAllowed`.
     */
    isRedirectUriAllowed(redirectUri) {
        return Array.isArray(this.redirectUris) && this.redirectUris.includes(redirectUri);
    }
    /**
     * Whether every requested scope is contained in `allowedScopes`.
     * Empty / undefined input is treated as "no scopes requested" → allowed.
     */
    areScopesAllowed(requestedScope) {
        if (!requestedScope)
            return true;
        const requested = requestedScope.split(/\s+/).filter(Boolean);
        return requested.every((s) => this.allowedScopes.includes(s));
    }
    /**
     * Whether this client is allowed to use the given grant type.
     */
    isGrantTypeAllowed(grantType) {
        return this.allowedGrantTypes.includes(grantType);
    }
};
exports.OAuthClient = OAuthClient;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: String, maxLength: 100 }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    (0, entity_1.ColumnIndex)({ unique: true }),
    (0, entity_1.MultiORMColumn)({ type: 'varchar', length: 100, nullable: false }),
    tslib_1.__metadata("design:type", String)
], OAuthClient.prototype, "clientId", void 0);
tslib_1.__decorate([
    (0, export_redact_decorator_1.ExportRedacted)({ blank: true }),
    (0, entity_1.MultiORMColumn)({ type: 'varchar', length: 255, nullable: true, select: false }),
    tslib_1.__metadata("design:type", String)
], OAuthClient.prototype, "clientSecretHash", void 0);
tslib_1.__decorate([
    (0, export_redact_decorator_1.ExportRedacted)(),
    (0, entity_1.MultiORMColumn)({ type: 'varchar', length: 255, nullable: false, select: false }),
    tslib_1.__metadata("design:type", String)
], OAuthClient.prototype, "codeSecret", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: String, maxLength: 100 }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    (0, entity_1.MultiORMColumn)({ type: 'varchar', length: 100, nullable: false }),
    tslib_1.__metadata("design:type", String)
], OAuthClient.prototype, "name", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String, maxLength: 500, nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    (0, entity_1.MultiORMColumn)({ type: 'varchar', length: 500, nullable: true }),
    tslib_1.__metadata("design:type", String)
], OAuthClient.prototype, "description", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ enum: contracts_1.OAuthClientType, enumName: 'OAuthClientType' }),
    (0, class_validator_1.IsEnum)(contracts_1.OAuthClientType),
    (0, entity_1.MultiORMColumn)({
        type: 'simple-enum',
        enum: contracts_1.OAuthClientType,
        default: contracts_1.OAuthClientType.CONFIDENTIAL
    }),
    tslib_1.__metadata("design:type", String)
], OAuthClient.prototype, "clientType", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: [String] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayNotEmpty)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, entity_1.JsonColumn)({ nullable: false }),
    tslib_1.__metadata("design:type", Array)
], OAuthClient.prototype, "redirectUris", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: [String] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, entity_1.JsonColumn)({ nullable: false }),
    tslib_1.__metadata("design:type", Array)
], OAuthClient.prototype, "allowedScopes", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ enum: contracts_1.OAuthGrantType, enumName: 'OAuthGrantType', isArray: true }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsEnum)(contracts_1.OAuthGrantType, { each: true }),
    (0, entity_1.JsonColumn)({ nullable: false }),
    tslib_1.__metadata("design:type", Array)
], OAuthClient.prototype, "allowedGrantTypes", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: Boolean }),
    (0, class_validator_1.IsBoolean)(),
    (0, entity_1.MultiORMColumn)({ type: 'boolean', default: false }),
    tslib_1.__metadata("design:type", Boolean)
], OAuthClient.prototype, "pkceRequired", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, description: 'Access token TTL in seconds (max 7 days)' }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(60),
    (0, class_validator_1.Max)(86400 * 7),
    (0, entity_1.MultiORMColumn)({ type: 'int', default: 86400 }),
    tslib_1.__metadata("design:type", Number)
], OAuthClient.prototype, "accessTokenTtl", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, description: 'Refresh token TTL in seconds (max 90 days)' }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(60),
    (0, class_validator_1.Max)(86400 * 90),
    (0, entity_1.MultiORMColumn)({ type: 'int', default: 2592000 }),
    tslib_1.__metadata("design:type", Number)
], OAuthClient.prototype, "refreshTokenTtl", void 0);
exports.OAuthClient = OAuthClient = tslib_1.__decorate([
    (0, entity_1.MultiORMEntity)('oauth_clients')
], OAuthClient);
//# sourceMappingURL=oauth-client.entity.js.map