"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateOAuthClientDTO = void 0;
const tslib_1 = require("tslib");
/**
 * DTO for `POST /oauth/clients` — register a new third-party OAuth app.
 *
 * Note: `clientId`, `clientSecret`, and `codeSecret` are NOT accepted from
 * the client. They are generated server-side by `OAuthClientService.create`
 * and the plaintext secret is returned exactly once via the response DTO.
 */
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const contracts_1 = require("@gauzy/contracts");
class CreateOAuthClientDTO {
}
exports.CreateOAuthClientDTO = CreateOAuthClientDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: String, maxLength: 100, example: 'Activepieces' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    tslib_1.__metadata("design:type", String)
], CreateOAuthClientDTO.prototype, "name", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String, maxLength: 500, nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    tslib_1.__metadata("design:type", String)
], CreateOAuthClientDTO.prototype, "description", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: contracts_1.OAuthClientType, default: contracts_1.OAuthClientType.CONFIDENTIAL }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(contracts_1.OAuthClientType),
    tslib_1.__metadata("design:type", String)
], CreateOAuthClientDTO.prototype, "clientType", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({
        type: [String],
        example: ['https://cloud.activepieces.com/redirect']
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayNotEmpty)(),
    (0, class_validator_1.IsUrl)({
        // Restrict OAuth redirect URIs to http/https only — disallow
        // custom schemes (javascript:, data:, etc.) which are common
        // open-redirect / token-leak vectors. `require_tld:false` keeps
        // `http://localhost` working for development.
        protocols: ['http', 'https'],
        require_protocol: true,
        require_tld: false
    }, { each: true }),
    tslib_1.__metadata("design:type", Array)
], CreateOAuthClientDTO.prototype, "redirectUris", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [String], example: ['profile', 'email'] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    tslib_1.__metadata("design:type", Array)
], CreateOAuthClientDTO.prototype, "allowedScopes", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: contracts_1.OAuthGrantType,
        isArray: true,
        default: [contracts_1.OAuthGrantType.AUTHORIZATION_CODE]
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsEnum)(contracts_1.OAuthGrantType, { each: true }),
    tslib_1.__metadata("design:type", Array)
], CreateOAuthClientDTO.prototype, "allowedGrantTypes", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Boolean, default: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    tslib_1.__metadata("design:type", Boolean)
], CreateOAuthClientDTO.prototype, "pkceRequired", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Number, default: 86400, minimum: 60, maximum: 86400 * 7 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(60),
    (0, class_validator_1.Max)(86400 * 7),
    tslib_1.__metadata("design:type", Number)
], CreateOAuthClientDTO.prototype, "accessTokenTtl", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Number, default: 2592000, minimum: 60, maximum: 86400 * 90 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(60),
    (0, class_validator_1.Max)(86400 * 90),
    tslib_1.__metadata("design:type", Number)
], CreateOAuthClientDTO.prototype, "refreshTokenTtl", void 0);
//# sourceMappingURL=create-oauth-client.dto.js.map