"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateOAuthClientDTO = void 0;
const tslib_1 = require("tslib");
/**
 * DTO for `PATCH /oauth/clients/:id`.
 *
 * Mutable subset of the create DTO. `clientId`, `clientSecretHash`, and
 * `codeSecret` are intentionally NOT updatable through this endpoint —
 * the secret is rotated via the dedicated `POST /oauth/clients/:id/rotate-secret`
 * endpoint, and `clientId` / `codeSecret` are immutable for the lifetime
 * of the row (rotating them would silently break every consumer).
 */
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const create_oauth_client_dto_1 = require("./create-oauth-client.dto");
class UpdateOAuthClientDTO extends (0, swagger_1.PartialType)((0, swagger_1.PickType)(create_oauth_client_dto_1.CreateOAuthClientDTO, [
    'name',
    'description',
    'redirectUris',
    'allowedScopes',
    'allowedGrantTypes',
    'pkceRequired',
    'accessTokenTtl',
    'refreshTokenTtl'
])) {
}
exports.UpdateOAuthClientDTO = UpdateOAuthClientDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Boolean }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    tslib_1.__metadata("design:type", Boolean)
], UpdateOAuthClientDTO.prototype, "isActive", void 0);
//# sourceMappingURL=update-oauth-client.dto.js.map