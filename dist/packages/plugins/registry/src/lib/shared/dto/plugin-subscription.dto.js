"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionBillingDTO = exports.PluginAccessCheckDTO = exports.RenewPluginSubscriptionDTO = exports.CancelPluginSubscriptionDTO = exports.PurchasePluginSubscriptionDTO = exports.PluginSubscriptionQueryDTO = exports.UpdatePluginSubscriptionDTO = exports.CreatePluginSubscriptionDTO = void 0;
const tslib_1 = require("tslib");
const contracts_1 = require("@gauzy/contracts");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
/**
 * Create Plugin Subscription DTO
 */
class CreatePluginSubscriptionDTO {
}
exports.CreatePluginSubscriptionDTO = CreatePluginSubscriptionDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: String, description: 'Plugin ID' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Plugin ID is required' }),
    (0, class_validator_1.IsUUID)(4, { message: 'Plugin ID must be a valid UUID' }),
    tslib_1.__metadata("design:type", String)
], CreatePluginSubscriptionDTO.prototype, "pluginId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: String, description: 'Subscription Plan ID' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Subscription Plan ID is required' }),
    (0, class_validator_1.IsUUID)(4, { message: 'Subscription Plan ID must be a valid UUID' }),
    tslib_1.__metadata("design:type", String)
], CreatePluginSubscriptionDTO.prototype, "subscriptionPlanId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ enum: contracts_1.PluginScope, description: 'Plugin scope' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Scope is required' }),
    (0, class_validator_1.IsEnum)(contracts_1.PluginScope, { message: 'Invalid plugin scope' }),
    tslib_1.__metadata("design:type", String)
], CreatePluginSubscriptionDTO.prototype, "scope", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: String, description: 'Plugin Tenant ID' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Plugin Tenant ID is required' }),
    (0, class_validator_1.IsUUID)(4, { message: 'Plugin Tenant ID must be a valid UUID' }),
    tslib_1.__metadata("design:type", String)
], CreatePluginSubscriptionDTO.prototype, "pluginTenantId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ enum: contracts_1.PluginSubscriptionStatus, description: 'Subscription status' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Status is required' }),
    (0, class_validator_1.IsEnum)(contracts_1.PluginSubscriptionStatus, { message: 'Invalid subscription status' }),
    tslib_1.__metadata("design:type", String)
], CreatePluginSubscriptionDTO.prototype, "status", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String, description: 'Subscription start date' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)({}, { message: 'Start date must be a valid date string' }),
    tslib_1.__metadata("design:type", String)
], CreatePluginSubscriptionDTO.prototype, "startDate", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String, description: 'Subscription end date' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)({}, { message: 'End date must be a valid date string' }),
    tslib_1.__metadata("design:type", String)
], CreatePluginSubscriptionDTO.prototype, "endDate", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String, description: 'Trial end date' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)({}, { message: 'Trial end date must be a valid date string' }),
    tslib_1.__metadata("design:type", String)
], CreatePluginSubscriptionDTO.prototype, "trialEndDate", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: Boolean, description: 'Auto-renewal enabled' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Auto renew setting is required' }),
    (0, class_validator_1.IsBoolean)({ message: 'Auto renew must be a boolean' }),
    tslib_1.__metadata("design:type", Boolean)
], CreatePluginSubscriptionDTO.prototype, "autoRenew", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Object, description: 'Subscription metadata' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)({ message: 'Metadata must be an object' }),
    tslib_1.__metadata("design:type", Object)
], CreatePluginSubscriptionDTO.prototype, "metadata", void 0);
/**
 * Update Plugin Subscription DTO
 */
class UpdatePluginSubscriptionDTO {
}
exports.UpdatePluginSubscriptionDTO = UpdatePluginSubscriptionDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: contracts_1.PluginSubscriptionStatus, description: 'Subscription status' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(contracts_1.PluginSubscriptionStatus, { message: 'Invalid subscription status' }),
    tslib_1.__metadata("design:type", String)
], UpdatePluginSubscriptionDTO.prototype, "status", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String, description: 'Subscription start date' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)({}, { message: 'Start date must be a valid date string' }),
    tslib_1.__metadata("design:type", String)
], UpdatePluginSubscriptionDTO.prototype, "startDate", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String, description: 'Subscription end date' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)({}, { message: 'End date must be a valid date string' }),
    tslib_1.__metadata("design:type", String)
], UpdatePluginSubscriptionDTO.prototype, "endDate", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String, description: 'Trial end date' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)({}, { message: 'Trial end date must be a valid date string' }),
    tslib_1.__metadata("design:type", String)
], UpdatePluginSubscriptionDTO.prototype, "trialEndDate", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Boolean, description: 'Auto-renewal enabled' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)({ message: 'Auto renew must be a boolean' }),
    tslib_1.__metadata("design:type", Boolean)
], UpdatePluginSubscriptionDTO.prototype, "autoRenew", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Object, description: 'Subscription metadata' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)({ message: 'Metadata must be an object' }),
    tslib_1.__metadata("design:type", Object)
], UpdatePluginSubscriptionDTO.prototype, "metadata", void 0);
/**
 * Plugin Subscription Query DTO
 */
class PluginSubscriptionQueryDTO {
}
exports.PluginSubscriptionQueryDTO = PluginSubscriptionQueryDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String, description: 'Plugin ID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    tslib_1.__metadata("design:type", String)
], PluginSubscriptionQueryDTO.prototype, "pluginId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String, description: 'Plugin Tenant ID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    tslib_1.__metadata("design:type", String)
], PluginSubscriptionQueryDTO.prototype, "pluginTenantId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String, description: 'Subscriber ID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    tslib_1.__metadata("design:type", String)
], PluginSubscriptionQueryDTO.prototype, "subscriberId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: contracts_1.PluginSubscriptionStatus, description: 'Subscription status' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(contracts_1.PluginSubscriptionStatus),
    tslib_1.__metadata("design:type", String)
], PluginSubscriptionQueryDTO.prototype, "status", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: contracts_1.PluginSubscriptionType, description: 'Subscription type' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(contracts_1.PluginSubscriptionType),
    tslib_1.__metadata("design:type", String)
], PluginSubscriptionQueryDTO.prototype, "subscriptionType", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: contracts_1.PluginScope, description: 'Subscription scope' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(contracts_1.PluginScope),
    tslib_1.__metadata("design:type", String)
], PluginSubscriptionQueryDTO.prototype, "scope", void 0);
/**
 * Purchase Plugin Subscription DTO
 */
class PurchasePluginSubscriptionDTO {
}
exports.PurchasePluginSubscriptionDTO = PurchasePluginSubscriptionDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: String, description: 'Plugin ID' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsUUID)(),
    tslib_1.__metadata("design:type", String)
], PurchasePluginSubscriptionDTO.prototype, "pluginId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String, description: 'Plan ID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    tslib_1.__metadata("design:type", String)
], PurchasePluginSubscriptionDTO.prototype, "planId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ enum: contracts_1.PluginScope, description: 'Subscription scope' }),
    (0, class_validator_1.IsEnum)(contracts_1.PluginScope),
    tslib_1.__metadata("design:type", String)
], PurchasePluginSubscriptionDTO.prototype, "scope", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: Boolean, description: 'Auto-renewal enabled' }),
    (0, class_validator_1.IsBoolean)(),
    tslib_1.__metadata("design:type", Boolean)
], PurchasePluginSubscriptionDTO.prototype, "autoRenew", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String, description: 'Payment method' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], PurchasePluginSubscriptionDTO.prototype, "paymentMethod", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String, description: 'Promo code' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], PurchasePluginSubscriptionDTO.prototype, "promoCode", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Object, description: 'Additional metadata' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    tslib_1.__metadata("design:type", Object)
], PurchasePluginSubscriptionDTO.prototype, "metadata", void 0);
/**
 * Cancel Plugin Subscription DTO
 */
class CancelPluginSubscriptionDTO {
}
exports.CancelPluginSubscriptionDTO = CancelPluginSubscriptionDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String, description: 'Cancellation reason' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], CancelPluginSubscriptionDTO.prototype, "reason", void 0);
/**
 * Renew Plugin Subscription DTO
 */
class RenewPluginSubscriptionDTO {
}
exports.RenewPluginSubscriptionDTO = RenewPluginSubscriptionDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: contracts_1.PluginBillingPeriod, description: 'New billing period' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(contracts_1.PluginBillingPeriod),
    tslib_1.__metadata("design:type", String)
], RenewPluginSubscriptionDTO.prototype, "billingPeriod", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String, description: 'Payment method' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], RenewPluginSubscriptionDTO.prototype, "paymentMethod", void 0);
/**
 * Plugin Access Check DTO
 */
class PluginAccessCheckDTO {
}
exports.PluginAccessCheckDTO = PluginAccessCheckDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: String, description: 'Plugin ID' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsUUID)(),
    tslib_1.__metadata("design:type", String)
], PluginAccessCheckDTO.prototype, "pluginId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String, description: 'Subscriber ID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    tslib_1.__metadata("design:type", String)
], PluginAccessCheckDTO.prototype, "subscriberId", void 0);
/**
 * Subscription Billing DTO
 */
class SubscriptionBillingDTO {
}
exports.SubscriptionBillingDTO = SubscriptionBillingDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, description: 'Billing amount' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    tslib_1.__metadata("design:type", Number)
], SubscriptionBillingDTO.prototype, "amount", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: String, description: 'Currency code' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], SubscriptionBillingDTO.prototype, "currency", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: String, description: 'Billing date' }),
    (0, class_validator_1.IsDateString)(),
    tslib_1.__metadata("design:type", String)
], SubscriptionBillingDTO.prototype, "billingDate", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String, description: 'Payment method' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], SubscriptionBillingDTO.prototype, "paymentMethod", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String, description: 'Invoice URL' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], SubscriptionBillingDTO.prototype, "invoiceUrl", void 0);
//# sourceMappingURL=plugin-subscription.dto.js.map