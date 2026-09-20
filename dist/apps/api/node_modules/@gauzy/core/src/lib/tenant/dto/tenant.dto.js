"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class TenantDTO {
}
exports.TenantDTO = TenantDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, required: true }),
    (0, class_validator_1.IsNotEmpty)(),
    tslib_1.__metadata("design:type", String)
], TenantDTO.prototype, "name", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], TenantDTO.prototype, "logo", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    tslib_1.__metadata("design:type", Object)
], TenantDTO.prototype, "imageId", void 0);
//# sourceMappingURL=tenant.dto.js.map