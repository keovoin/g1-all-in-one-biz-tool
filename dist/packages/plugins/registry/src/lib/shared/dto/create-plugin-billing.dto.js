"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePluginBillingDTO = void 0;
const tslib_1 = require("tslib");
const contracts_1 = require("@gauzy/contracts");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class CreatePluginBillingDTO {
}
exports.CreatePluginBillingDTO = CreatePluginBillingDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Associated subscription ID',
        example: 'uuid-string'
    }),
    (0, class_validator_1.IsUUID)(4, { message: 'Subscription ID must be a valid UUID' }),
    tslib_1.__metadata("design:type", String)
], CreatePluginBillingDTO.prototype, "subscriptionId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Billing amount',
        example: 99.99,
        minimum: 0
    }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)({}, { message: 'Amount must be a valid number' }),
    (0, class_validator_1.Min)(0, { message: 'Amount must be greater than or equal to 0' }),
    tslib_1.__metadata("design:type", Number)
], CreatePluginBillingDTO.prototype, "amount", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Currency code',
        example: 'USD',
        default: 'USD'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Currency is required' }),
    tslib_1.__metadata("design:type", String)
], CreatePluginBillingDTO.prototype, "currency", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Billing date',
        example: '2025-01-01T00:00:00Z'
    }),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)({ message: 'Billing date must be a valid date' }),
    tslib_1.__metadata("design:type", Date)
], CreatePluginBillingDTO.prototype, "billingDate", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Due date for payment',
        example: '2025-01-15T00:00:00Z'
    }),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)({ message: 'Due date must be a valid date' }),
    tslib_1.__metadata("design:type", Date)
], CreatePluginBillingDTO.prototype, "dueDate", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Payment due date',
        example: '2025-01-30T00:00:00Z'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)({ message: 'Payment due date must be a valid date' }),
    tslib_1.__metadata("design:type", Date)
], CreatePluginBillingDTO.prototype, "paymentDueDate", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({
        enum: contracts_1.PluginBillingStatus,
        description: 'Billing status',
        default: contracts_1.PluginBillingStatus.PENDING
    }),
    (0, class_validator_1.IsEnum)(contracts_1.PluginBillingStatus, { message: 'Invalid billing status' }),
    tslib_1.__metadata("design:type", String)
], CreatePluginBillingDTO.prototype, "status", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({
        enum: contracts_1.PluginBillingPeriod,
        description: 'Billing period',
        example: contracts_1.PluginBillingPeriod.MONTHLY
    }),
    (0, class_validator_1.IsEnum)(contracts_1.PluginBillingPeriod, { message: 'Invalid billing period' }),
    tslib_1.__metadata("design:type", String)
], CreatePluginBillingDTO.prototype, "billingPeriod", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Billing period start date',
        example: '2025-01-01T00:00:00Z'
    }),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)({ message: 'Billing period start must be a valid date' }),
    tslib_1.__metadata("design:type", Date)
], CreatePluginBillingDTO.prototype, "billingPeriodStart", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Billing period end date',
        example: '2025-01-31T23:59:59Z'
    }),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)({ message: 'Billing period end must be a valid date' }),
    tslib_1.__metadata("design:type", Date)
], CreatePluginBillingDTO.prototype, "billingPeriodEnd", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Invoice number',
        example: 'INV-202501-0001'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], CreatePluginBillingDTO.prototype, "invoiceNumber", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Invoice URL',
        example: 'https://example.com/invoices/inv-123'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], CreatePluginBillingDTO.prototype, "invoiceUrl", void 0);
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
], CreatePluginBillingDTO.prototype, "taxAmount", void 0);
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
], CreatePluginBillingDTO.prototype, "taxRate", void 0);
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
], CreatePluginBillingDTO.prototype, "discountAmount", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Discount code',
        example: 'SAVE10'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], CreatePluginBillingDTO.prototype, "discountCode", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Billing description/notes',
        example: 'Monthly subscription fee for Premium plan'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], CreatePluginBillingDTO.prototype, "description", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Payment reference',
        example: 'PAY_12345'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], CreatePluginBillingDTO.prototype, "paymentReference", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Billing metadata',
        example: { source: 'automated', campaign: 'summer2025' }
    }),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", Object)
], CreatePluginBillingDTO.prototype, "metadata", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Tenant ID',
        example: 'uuid-string'
    }),
    (0, class_validator_1.IsUUID)(4, { message: 'Tenant ID must be a valid UUID' }),
    tslib_1.__metadata("design:type", String)
], CreatePluginBillingDTO.prototype, "tenantId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Organization ID',
        example: 'uuid-string'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(4, { message: 'Organization ID must be a valid UUID' }),
    tslib_1.__metadata("design:type", String)
], CreatePluginBillingDTO.prototype, "organizationId", void 0);
//# sourceMappingURL=create-plugin-billing.dto.js.map