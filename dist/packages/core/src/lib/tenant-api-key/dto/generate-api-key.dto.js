"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenerateApiKeyDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const is_tenant_belongs_to_user_decorator_1 = require("../../shared/validators/is-tenant-belongs-to-user.decorator");
/**
 * DTO for generating a new API key for a tenant.
 */
class GenerateApiKeyDTO {
}
exports.GenerateApiKeyDTO = GenerateApiKeyDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: String,
        description: 'The unique identifier of the tenant.',
        format: 'uuid'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    (0, is_tenant_belongs_to_user_decorator_1.IsTenantBelongsToUser)(),
    tslib_1.__metadata("design:type", String)
], GenerateApiKeyDTO.prototype, "tenantId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: String,
        description: 'The name or label for the API key.'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], GenerateApiKeyDTO.prototype, "name", void 0);
//# sourceMappingURL=generate-api-key.dto.js.map