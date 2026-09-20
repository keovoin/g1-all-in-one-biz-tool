"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaxInvoiceDTO = void 0;
const tslib_1 = require("tslib");
const contracts_1 = require("@gauzy/contracts");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class TaxInvoiceDTO {
}
exports.TaxInvoiceDTO = TaxInvoiceDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, enum: contracts_1.DiscountTaxTypeEnum }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(contracts_1.DiscountTaxTypeEnum),
    tslib_1.__metadata("design:type", String)
], TaxInvoiceDTO.prototype, "taxType", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, enum: contracts_1.DiscountTaxTypeEnum }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(contracts_1.DiscountTaxTypeEnum),
    tslib_1.__metadata("design:type", String)
], TaxInvoiceDTO.prototype, "tax2Type", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Number, readOnly: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    tslib_1.__metadata("design:type", Number)
], TaxInvoiceDTO.prototype, "tax", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Number, readOnly: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    tslib_1.__metadata("design:type", Number)
], TaxInvoiceDTO.prototype, "tax2", void 0);
//# sourceMappingURL=tax-invoice.dto.js.map