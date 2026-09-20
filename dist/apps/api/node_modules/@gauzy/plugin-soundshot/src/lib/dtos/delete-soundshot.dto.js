"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteSoundshotDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class DeleteSoundshotDTO {
}
exports.DeleteSoundshotDTO = DeleteSoundshotDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'If true, forcefully deletes the soundshot, bypassing soft-delete logic. Optional.',
        example: false,
        type: Boolean,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, class_transformer_1.Type)(() => Boolean),
    tslib_1.__metadata("design:type", Boolean)
], DeleteSoundshotDTO.prototype, "forceDelete", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Organization ID associated with the soundshot. Optional, must be a valid UUID if provided.',
        example: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
        type: String,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    tslib_1.__metadata("design:type", String)
], DeleteSoundshotDTO.prototype, "organizationId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Tenant ID associated with the soundshot. Optional, must be a valid UUID if provided.',
        example: 'f1e2d3c4-b5a6-7c8d-9e0f-1a2b3c4d5e6f',
        type: String,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    tslib_1.__metadata("design:type", String)
], DeleteSoundshotDTO.prototype, "tenantId", void 0);
//# sourceMappingURL=delete-soundshot.dto.js.map