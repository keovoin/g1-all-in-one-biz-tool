"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantBaseDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const validators_1 = require("./../../shared/validators");
class TenantBaseDTO {
}
exports.TenantBaseDTO = TenantBaseDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Object }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    (0, validators_1.IsTenantBelongsToUser)(),
    tslib_1.__metadata("design:type", Object)
], TenantBaseDTO.prototype, "tenant", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    (0, validators_1.IsTenantBelongsToUser)(),
    tslib_1.__metadata("design:type", String)
], TenantBaseDTO.prototype, "tenantId", void 0);
//# sourceMappingURL=tenant-base.dto.js.map