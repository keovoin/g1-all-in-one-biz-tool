"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OAuthClientWithSecretResponseDTO = exports.OAuthClientResponseDTO = void 0;
const tslib_1 = require("tslib");
/**
 * Response DTOs for the OAuth client registry.
 *
 * `OAuthClientResponseDTO` — what every read endpoint returns. Strips
 *   the secret hash and the per-client `codeSecret` so they can never
 *   leak via JSON serialization, even if a future change accidentally
 *   removes the `select: false` flag from the entity.
 *
 * `OAuthClientWithSecretResponseDTO` — what `POST /oauth/clients` and
 *   `POST /oauth/clients/:id/rotate-secret` return EXACTLY ONCE. The
 *   plaintext `clientSecret` is included so the operator can copy it
 *   into the third-party app's settings; it is never persisted in
 *   plaintext and never returned by any read endpoint.
 */
const swagger_1 = require("@nestjs/swagger");
class OAuthClientResponseDTO {
    static fromEntity(entity) {
        const dto = new OAuthClientResponseDTO();
        dto.id = entity.id;
        dto.clientId = entity.clientId;
        dto.name = entity.name;
        dto.description = entity.description ?? null;
        dto.clientType = entity.clientType;
        dto.redirectUris = entity.redirectUris;
        dto.allowedScopes = entity.allowedScopes;
        dto.allowedGrantTypes = entity.allowedGrantTypes;
        dto.pkceRequired = entity.pkceRequired;
        dto.accessTokenTtl = entity.accessTokenTtl;
        dto.refreshTokenTtl = entity.refreshTokenTtl;
        dto.isActive = entity.isActive;
        dto.tenantId = entity.tenantId ?? null;
        dto.createdAt = entity.createdAt;
        dto.updatedAt = entity.updatedAt;
        return dto;
    }
}
exports.OAuthClientResponseDTO = OAuthClientResponseDTO;
class OAuthClientWithSecretResponseDTO extends OAuthClientResponseDTO {
    static fromEntityWithSecret(entity, plaintextSecret) {
        const base = OAuthClientResponseDTO.fromEntity(entity);
        const dto = Object.assign(new OAuthClientWithSecretResponseDTO(), base);
        dto.clientSecret = plaintextSecret;
        return dto;
    }
}
exports.OAuthClientWithSecretResponseDTO = OAuthClientWithSecretResponseDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        description: 'Plaintext client secret. Returned exactly once on creation or rotation. Store it immediately — it cannot be retrieved again.'
    }),
    tslib_1.__metadata("design:type", String)
], OAuthClientWithSecretResponseDTO.prototype, "clientSecret", void 0);
//# sourceMappingURL=oauth-client.response.dto.js.map