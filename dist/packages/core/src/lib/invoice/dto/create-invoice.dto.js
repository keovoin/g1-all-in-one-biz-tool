"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateInvoiceDTO = void 0;
const tslib_1 = require("tslib");
const contracts_1 = require("@gauzy/contracts");
const mapped_types_1 = require("@nestjs/mapped-types");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const dto_1 = require("./../../tags/dto");
const discount_invoice_dto_1 = require("./discount-invoice.dto");
const invoice_dto_1 = require("./invoice.dto");
const tax_invoice_dto_1 = require("./tax-invoice.dto");
class CreateInvoiceDTO extends (0, mapped_types_1.IntersectionType)(invoice_dto_1.InvoiceDTO, tax_invoice_dto_1.TaxInvoiceDTO, dto_1.RelationalTagDTO, discount_invoice_dto_1.DiscountInvoiceDTO) {
}
exports.CreateInvoiceDTO = CreateInvoiceDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Object, readOnly: true }),
    (0, class_validator_1.ValidateIf)((it) => !it.fromOrganizationId),
    (0, class_validator_1.IsObject)(),
    tslib_1.__metadata("design:type", Object)
], CreateInvoiceDTO.prototype, "fromOrganization", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, readOnly: true }),
    (0, class_validator_1.ValidateIf)((it) => !it.fromOrganization),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], CreateInvoiceDTO.prototype, "fromOrganizationId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String, readOnly: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], CreateInvoiceDTO.prototype, "sentTo", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String, enum: contracts_1.InvoiceTypeEnum, readOnly: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(contracts_1.InvoiceTypeEnum),
    tslib_1.__metadata("design:type", String)
], CreateInvoiceDTO.prototype, "invoiceType", void 0);
//# sourceMappingURL=create-invoice.dto.js.map