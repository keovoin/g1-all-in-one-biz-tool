"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MerchantDTO = void 0;
const tslib_1 = require("tslib");
const mapped_types_1 = require("@nestjs/mapped-types");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const dto_1 = require("./../../currency/dto");
const dto_2 = require("./../../core/dto");
const dto_3 = require("./../../tags/dto");
/**
 * Merchant request DTO validation
 */
class MerchantDTO extends (0, mapped_types_1.IntersectionType)(dto_2.TenantOrganizationBaseDTO, dto_1.RelationalCurrencyDTO, dto_3.RelationalTagDTO) {
}
exports.MerchantDTO = MerchantDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, readOnly: true }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], MerchantDTO.prototype, "name", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, readOnly: true }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], MerchantDTO.prototype, "code", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, readOnly: true }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEmail)(),
    tslib_1.__metadata("design:type", String)
], MerchantDTO.prototype, "email", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String, readOnly: true }),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", String)
], MerchantDTO.prototype, "phone", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String, readOnly: true }),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", String)
], MerchantDTO.prototype, "description", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Boolean, readOnly: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    tslib_1.__metadata("design:type", Boolean)
], MerchantDTO.prototype, "active", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Object, readOnly: true }),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", Object)
], MerchantDTO.prototype, "logo", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String, readOnly: true }),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", Object)
], MerchantDTO.prototype, "logoId", void 0);
//# sourceMappingURL=merchant.dto.js.map