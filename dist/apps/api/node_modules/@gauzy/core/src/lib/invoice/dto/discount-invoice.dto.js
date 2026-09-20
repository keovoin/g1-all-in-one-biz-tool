"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscountInvoiceDTO = void 0;
const tslib_1 = require("tslib");
const contracts_1 = require("@gauzy/contracts");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class DiscountInvoiceDTO {
}
exports.DiscountInvoiceDTO = DiscountInvoiceDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Number, readOnly: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    tslib_1.__metadata("design:type", Number)
], DiscountInvoiceDTO.prototype, "discountValue", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, enum: contracts_1.DiscountTaxTypeEnum, readOnly: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(contracts_1.DiscountTaxTypeEnum),
    tslib_1.__metadata("design:type", String)
], DiscountInvoiceDTO.prototype, "discountType", void 0);
//# sourceMappingURL=discount-invoice.dto.js.map