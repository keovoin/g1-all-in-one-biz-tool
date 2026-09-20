"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePluginBillingDTO = void 0;
const tslib_1 = require("tslib");
const contracts_1 = require("@gauzy/contracts");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class UpdatePluginBillingDTO {
}
exports.UpdatePluginBillingDTO = UpdatePluginBillingDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Billing amount',
        example: 99.99,
        minimum: 0
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)({}, { message: 'Amount must be a valid number' }),
    (0, class_validator_1.Min)(0, { message: 'Amount must be greater than or equal to 0' }),
    tslib_1.__metadata("design:type", Number)
], UpdatePluginBillingDTO.prototype, "amount", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Currency code',
        example: 'USD'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], UpdatePluginBillingDTO.prototype, "currency", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Billing date',
        example: '2025-01-01T00:00:00Z'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)({ message: 'Billing date must be a valid date' }),
    tslib_1.__metadata("design:type", Date)
], UpdatePluginBillingDTO.prototype, "billingDate", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Due date for payment',
        example: '2025-01-15T00:00:00Z'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)({ message: 'Due date must be a valid date' }),
    tslib_1.__metadata("design:type", Date)
], UpdatePluginBillingDTO.prototype, "dueDate", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Payment due date',
        example: '2025-01-30T00:00:00Z'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)({ message: 'Payment due date must be a valid date' }),
    tslib_1.__metadata("design:type", Date)
], UpdatePluginBillingDTO.prototype, "paymentDueDate", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: contracts_1.PluginBillingStatus,
        description: 'Billing status'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(contracts_1.PluginBillingStatus, { message: 'Invalid billing status' }),
    tslib_1.__metadata("design:type", String)
], UpdatePluginBillingDTO.prototype, "status", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Billing period start date',
        example: '2025-01-01T00:00:00Z'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)({ message: 'Billing period start must be a valid date' }),
    tslib_1.__metadata("design:type", Date)
], UpdatePluginBillingDTO.prototype, "billingPeriodStart", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Billing period end date',
        example: '2025-01-31T23:59:59Z'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)({ message: 'Billing period end must be a valid date' }),
    tslib_1.__metadata("design:type", Date)
], UpdatePluginBillingDTO.prototype, "billingPeriodEnd", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Invoice number',
        example: 'INV-202501-0001'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], UpdatePluginBillingDTO.prototype, "invoiceNumber", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Invoice URL',
        example: 'https://example.com/invoices/inv-123'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], UpdatePluginBillingDTO.prototype, "invoiceUrl", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Tax amount',
        example: 9.99,
        minimum: 0
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)({}, { message: 'Tax amount must be a valid number' }),
    (0, class_validator_1.Min)(0, { message: 'Tax amount must be greater than or equal to 0' }),
    tslib_1.__metadata("design:type", Number)
], UpdatePluginBillingDTO.prototype, "taxAmount", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Tax rate (as decimal)',
        example: 0.1,
        minimum: 0,
        maximum: 1
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)({}, { message: 'Tax rate must be a valid number' }),
    (0, class_validator_1.Min)(0, { message: 'Tax rate must be greater than or equal to 0' }),
    (0, class_validator_1.Max)(1, { message: 'Tax rate must be less than or equal to 1' }),
    tslib_1.__metadata("design:type", Number)
], UpdatePluginBillingDTO.prototype, "taxRate", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Discount amount',
        example: 5.0,
        minimum: 0
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)({}, { message: 'Discount amount must be a valid number' }),
    (0, class_validator_1.Min)(0, { message: 'Discount amount must be greater than or equal to 0' }),
    tslib_1.__metadata("design:type", Number)
], UpdatePluginBillingDTO.prototype, "discountAmount", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Discount code',
        example: 'SAVE10'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], UpdatePluginBillingDTO.prototype, "discountCode", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Billing description/notes',
        example: 'Monthly subscription fee for Premium plan'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], UpdatePluginBillingDTO.prototype, "description", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Payment reference',
        example: 'PAY_12345'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], UpdatePluginBillingDTO.prototype, "paymentReference", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Billing metadata',
        example: { source: 'automated', campaign: 'summer2025' }
    }),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", Object)
], UpdatePluginBillingDTO.prototype, "metadata", void 0);
//# sourceMappingURL=update-plugin-billing.dto.js.map