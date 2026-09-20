"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginPlanAnalyticsDTO = exports.CopyPluginPlanDTO = exports.BulkPluginPlanOperationDTO = exports.PluginPlanPricingDTO = exports.PluginPlanFeaturesDTO = exports.PluginSubscriptionPlanQueryDTO = exports.UpdatePluginSubscriptionPlanDTO = exports.CreatePluginSubscriptionPlanDTO = void 0;
const tslib_1 = require("tslib");
const contracts_1 = require("@gauzy/contracts");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
/**
 * Helper function to transform string to boolean
 */
const transformToBoolean = ({ value }) => {
    if (value === 'true' || value === true)
        return true;
    if (value === 'false' || value === false)
        return false;
    if (value === '1' || value === 1)
        return true;
    if (value === '0' || value === 0)
        return false;
    return value;
};
/**
 * Helper function to transform string to number (optional)
 */
const transformToOptionalNumber = ({ value }) => {
    if (value === '' || value === null || value === undefined)
        return undefined;
    return Number(value);
};
/**
 * Base class for subscription plan fields with transformations
 */
class BaseSubscriptionPlanFieldsDTO {
}
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, description: 'Plan price' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Price is required' }),
    (0, class_validator_1.IsNumber)({}, { message: 'Price must be a valid number' }),
    (0, class_validator_1.Min)(0, { message: 'Price cannot be negative' }),
    (0, class_transformer_1.Type)(() => Number),
    tslib_1.__metadata("design:type", Number)
], BaseSubscriptionPlanFieldsDTO.prototype, "price", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Boolean, description: 'Whether this plan is marked as popular' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)({ message: 'isPopular must be a boolean' }),
    (0, class_transformer_1.Transform)(transformToBoolean),
    tslib_1.__metadata("design:type", Boolean)
], BaseSubscriptionPlanFieldsDTO.prototype, "isPopular", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Boolean, description: 'Whether this plan is recommended' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)({ message: 'isRecommended must be a boolean' }),
    (0, class_transformer_1.Transform)(transformToBoolean),
    tslib_1.__metadata("design:type", Boolean)
], BaseSubscriptionPlanFieldsDTO.prototype, "isRecommended", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Number, description: 'Trial period duration in days' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({}, { message: 'Trial days must be a number' }),
    (0, class_validator_1.Min)(0, { message: 'Trial days cannot be negative' }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_transformer_1.Transform)(transformToOptionalNumber),
    tslib_1.__metadata("design:type", Number)
], BaseSubscriptionPlanFieldsDTO.prototype, "trialDays", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Number, description: 'Setup fee for the plan' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({}, { message: 'Setup fee must be a number' }),
    (0, class_validator_1.Min)(0, { message: 'Setup fee cannot be negative' }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_transformer_1.Transform)(transformToOptionalNumber),
    tslib_1.__metadata("design:type", Number)
], BaseSubscriptionPlanFieldsDTO.prototype, "setupFee", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Number, description: 'Discount percentage for the plan' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({}, { message: 'Discount percentage must be a number' }),
    (0, class_validator_1.Min)(0, { message: 'Discount percentage cannot be negative' }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_transformer_1.Transform)(transformToOptionalNumber),
    tslib_1.__metadata("design:type", Number)
], BaseSubscriptionPlanFieldsDTO.prototype, "discountPercentage", void 0);
/**
 * Create Plugin Subscription Plan DTO
 */
class CreatePluginSubscriptionPlanDTO extends BaseSubscriptionPlanFieldsDTO {
}
exports.CreatePluginSubscriptionPlanDTO = CreatePluginSubscriptionPlanDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: String, description: 'Plan name' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Plan name is required' }),
    (0, class_validator_1.IsString)({ message: 'Name must be a string' }),
    (0, class_validator_1.MaxLength)(255, { message: 'Name cannot exceed 255 characters' }),
    tslib_1.__metadata("design:type", String)
], CreatePluginSubscriptionPlanDTO.prototype, "name", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String, description: 'Plan description' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Description must be a string' }),
    tslib_1.__metadata("design:type", String)
], CreatePluginSubscriptionPlanDTO.prototype, "description", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ enum: contracts_1.PluginSubscriptionType, description: 'Plan type' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Plan type is required' }),
    (0, class_validator_1.IsEnum)(contracts_1.PluginSubscriptionType, { message: 'Invalid plan type' }),
    tslib_1.__metadata("design:type", String)
], CreatePluginSubscriptionPlanDTO.prototype, "type", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ enum: contracts_1.CurrenciesEnum, description: 'Plan currency' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Currency is required' }),
    (0, class_validator_1.IsEnum)(contracts_1.CurrenciesEnum, { message: 'Invalid currency' }),
    tslib_1.__metadata("design:type", String)
], CreatePluginSubscriptionPlanDTO.prototype, "currency", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ enum: contracts_1.PluginBillingPeriod, description: 'Billing period' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Billing period is required' }),
    (0, class_validator_1.IsEnum)(contracts_1.PluginBillingPeriod, { message: 'Invalid billing period' }),
    tslib_1.__metadata("design:type", String)
], CreatePluginSubscriptionPlanDTO.prototype, "billingPeriod", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: [String], description: 'Plan features' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Features are required' }),
    (0, class_validator_1.IsArray)({ message: 'Features must be an array' }),
    (0, class_validator_1.IsString)({ each: true, message: 'Each feature must be a string' }),
    tslib_1.__metadata("design:type", Array)
], CreatePluginSubscriptionPlanDTO.prototype, "features", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Object, description: 'Plan limitations' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)({ message: 'Limitations must be an object' }),
    tslib_1.__metadata("design:type", Object)
], CreatePluginSubscriptionPlanDTO.prototype, "limitations", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Boolean, description: 'Is plan active' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)({ message: 'IsActive must be a boolean' }),
    (0, class_transformer_1.Transform)(transformToBoolean),
    tslib_1.__metadata("design:type", Boolean)
], CreatePluginSubscriptionPlanDTO.prototype, "isActive", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Object, description: 'Plan metadata' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)({ message: 'Metadata must be an object' }),
    tslib_1.__metadata("design:type", Object)
], CreatePluginSubscriptionPlanDTO.prototype, "metadata", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Number, description: 'Sort order' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({}, { message: 'Sort order must be a number' }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_transformer_1.Transform)(transformToOptionalNumber),
    tslib_1.__metadata("design:type", Number)
], CreatePluginSubscriptionPlanDTO.prototype, "sortOrder", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String, description: 'Plugin ID' }),
    (0, class_validator_1.IsUUID)(4, { message: 'Plugin ID must be a valid UUID' }),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", String)
], CreatePluginSubscriptionPlanDTO.prototype, "pluginId", void 0);
/**
 * Update Plugin Subscription Plan DTO
 */
class UpdatePluginSubscriptionPlanDTO {
}
exports.UpdatePluginSubscriptionPlanDTO = UpdatePluginSubscriptionPlanDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Unique identifier for the plugin',
        example: '123e4567-e89b-12d3-a456-426614174000'
    }),
    (0, class_validator_1.IsUUID)('4', { message: 'The plugin ID must be a valid UUID v4' }),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", String)
], UpdatePluginSubscriptionPlanDTO.prototype, "id", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Number, description: 'Plan price' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({}, { message: 'Price must be a valid number' }),
    (0, class_validator_1.Min)(0, { message: 'Price cannot 	be negative' }),
    (0, class_transformer_1.Type)(() => Number),
    tslib_1.__metadata("design:type", Number)
], UpdatePluginSubscriptionPlanDTO.prototype, "price", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Boolean, description: 'Whether this plan is marked as popular' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)({ message: 'isPopular must be a boolean' }),
    (0, class_transformer_1.Transform)(transformToBoolean),
    tslib_1.__metadata("design:type", Boolean)
], UpdatePluginSubscriptionPlanDTO.prototype, "isPopular", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Boolean, description: 'Whether this plan is recommended' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)({ message: 'isRecommended must be a boolean' }),
    (0, class_transformer_1.Transform)(transformToBoolean),
    tslib_1.__metadata("design:type", Boolean)
], UpdatePluginSubscriptionPlanDTO.prototype, "isRecommended", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Number, description: 'Trial period duration in days' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({}, { message: 'Trial days must be a number' }),
    (0, class_validator_1.Min)(0, { message: 'Trial days cannot be negative' }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_transformer_1.Transform)(transformToOptionalNumber),
    tslib_1.__metadata("design:type", Number)
], UpdatePluginSubscriptionPlanDTO.prototype, "trialDays", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Number, description: 'Setup fee for the plan' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({}, { message: 'Setup fee must be a number' }),
    (0, class_validator_1.Min)(0, { message: 'Setup fee cannot be negative' }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_transformer_1.Transform)(transformToOptionalNumber),
    tslib_1.__metadata("design:type", Number)
], UpdatePluginSubscriptionPlanDTO.prototype, "setupFee", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Number, description: 'Discount percentage for the plan' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({}, { message: 'Discount percentage must be a number' }),
    (0, class_validator_1.Min)(0, { message: 'Discount percentage cannot be negative' }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_transformer_1.Transform)(transformToOptionalNumber),
    tslib_1.__metadata("design:type", Number)
], UpdatePluginSubscriptionPlanDTO.prototype, "discountPercentage", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String, description: 'Plan name' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Name must be a string' }),
    (0, class_validator_1.MaxLength)(255, { message: 'Name cannot exceed 255 characters' }),
    tslib_1.__metadata("design:type", String)
], UpdatePluginSubscriptionPlanDTO.prototype, "name", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String, description: 'Plan description' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Description must be a string' }),
    tslib_1.__metadata("design:type", String)
], UpdatePluginSubscriptionPlanDTO.prototype, "description", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: contracts_1.PluginSubscriptionType, description: 'Plan type' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(contracts_1.PluginSubscriptionType, { message: 'Invalid plan type' }),
    tslib_1.__metadata("design:type", String)
], UpdatePluginSubscriptionPlanDTO.prototype, "type", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: contracts_1.CurrenciesEnum, description: 'Plan currency' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(contracts_1.CurrenciesEnum, { message: 'Invalid currency' }),
    tslib_1.__metadata("design:type", String)
], UpdatePluginSubscriptionPlanDTO.prototype, "currency", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: contracts_1.PluginBillingPeriod, description: 'Billing period' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(contracts_1.PluginBillingPeriod, { message: 'Invalid billing period' }),
    tslib_1.__metadata("design:type", String)
], UpdatePluginSubscriptionPlanDTO.prototype, "billingPeriod", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [String], description: 'Plan features' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)({ message: 'Features must be an array' }),
    (0, class_validator_1.IsString)({ each: true, message: 'Each feature must be a string' }),
    tslib_1.__metadata("design:type", Array)
], UpdatePluginSubscriptionPlanDTO.prototype, "features", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Object, description: 'Plan limitations' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)({ message: 'Limitations must be an object' }),
    tslib_1.__metadata("design:type", Object)
], UpdatePluginSubscriptionPlanDTO.prototype, "limitations", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Boolean, description: 'Is plan active' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)({ message: 'IsActive must be a boolean' }),
    (0, class_transformer_1.Transform)(transformToBoolean),
    tslib_1.__metadata("design:type", Boolean)
], UpdatePluginSubscriptionPlanDTO.prototype, "isActive", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Object, description: 'Plan metadata' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)({ message: 'Metadata must be an object' }),
    tslib_1.__metadata("design:type", Object)
], UpdatePluginSubscriptionPlanDTO.prototype, "metadata", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Number, description: 'Sort order' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({}, { message: 'Sort order must be a number' }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_transformer_1.Transform)(transformToOptionalNumber),
    tslib_1.__metadata("design:type", Number)
], UpdatePluginSubscriptionPlanDTO.prototype, "sortOrder", void 0);
/**
 * Plugin Subscription Plan Query DTO
 */
class PluginSubscriptionPlanQueryDTO {
}
exports.PluginSubscriptionPlanQueryDTO = PluginSubscriptionPlanQueryDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String, description: 'Plugin ID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    tslib_1.__metadata("design:type", String)
], PluginSubscriptionPlanQueryDTO.prototype, "pluginId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: contracts_1.PluginSubscriptionType, description: 'Plan type' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(contracts_1.PluginSubscriptionType),
    tslib_1.__metadata("design:type", String)
], PluginSubscriptionPlanQueryDTO.prototype, "type", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: contracts_1.PluginBillingPeriod, description: 'Billing period' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(contracts_1.PluginBillingPeriod),
    tslib_1.__metadata("design:type", String)
], PluginSubscriptionPlanQueryDTO.prototype, "billingPeriod", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Boolean, description: 'Is plan active' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    tslib_1.__metadata("design:type", Boolean)
], PluginSubscriptionPlanQueryDTO.prototype, "isActive", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Boolean, description: 'Is plan popular' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    tslib_1.__metadata("design:type", Boolean)
], PluginSubscriptionPlanQueryDTO.prototype, "isPopular", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Boolean, description: 'Is plan recommended' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    tslib_1.__metadata("design:type", Boolean)
], PluginSubscriptionPlanQueryDTO.prototype, "isRecommended", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Number, description: 'Minimum price filter' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    tslib_1.__metadata("design:type", Number)
], PluginSubscriptionPlanQueryDTO.prototype, "minPrice", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Number, description: 'Maximum price filter' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    tslib_1.__metadata("design:type", Number)
], PluginSubscriptionPlanQueryDTO.prototype, "maxPrice", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String, description: 'Currency filter' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], PluginSubscriptionPlanQueryDTO.prototype, "currency", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Boolean, description: 'Has trial filter' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    tslib_1.__metadata("design:type", Boolean)
], PluginSubscriptionPlanQueryDTO.prototype, "hasTrial", void 0);
/**
 * Plugin Plan Features DTO
 */
class PluginPlanFeaturesDTO {
}
exports.PluginPlanFeaturesDTO = PluginPlanFeaturesDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: [String], description: 'List of features' }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    tslib_1.__metadata("design:type", Array)
], PluginPlanFeaturesDTO.prototype, "features", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Object, description: 'Feature limitations' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    tslib_1.__metadata("design:type", Object)
], PluginPlanFeaturesDTO.prototype, "limitations", void 0);
/**
 * Plugin Plan Pricing DTO
 */
class PluginPlanPricingDTO {
}
exports.PluginPlanPricingDTO = PluginPlanPricingDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, description: 'Base price' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    tslib_1.__metadata("design:type", Number)
], PluginPlanPricingDTO.prototype, "price", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: String, description: 'Currency code' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], PluginPlanPricingDTO.prototype, "currency", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ enum: contracts_1.PluginBillingPeriod, description: 'Billing period' }),
    (0, class_validator_1.IsEnum)(contracts_1.PluginBillingPeriod),
    tslib_1.__metadata("design:type", String)
], PluginPlanPricingDTO.prototype, "billingPeriod", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Number, description: 'Setup fee' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    tslib_1.__metadata("design:type", Number)
], PluginPlanPricingDTO.prototype, "setupFee", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Number, description: 'Discount percentage' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    tslib_1.__metadata("design:type", Number)
], PluginPlanPricingDTO.prototype, "discountPercentage", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Number, description: 'Trial period in days' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    tslib_1.__metadata("design:type", Number)
], PluginPlanPricingDTO.prototype, "trialDays", void 0);
/**
 * Plugin Plan Bulk Operations DTO
 */
class BulkPluginPlanOperationDTO {
}
exports.BulkPluginPlanOperationDTO = BulkPluginPlanOperationDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: [String], description: 'Plan IDs to operate on' }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsUUID)(4, { each: true }),
    tslib_1.__metadata("design:type", Array)
], BulkPluginPlanOperationDTO.prototype, "planIds", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: String, description: 'Operation type', enum: ['activate', 'deactivate', 'delete'] }),
    (0, class_validator_1.IsEnum)(['activate', 'deactivate', 'delete']),
    tslib_1.__metadata("design:type", String)
], BulkPluginPlanOperationDTO.prototype, "operation", void 0);
/**
 * Plugin Plan Copy DTO
 */
class CopyPluginPlanDTO {
}
exports.CopyPluginPlanDTO = CopyPluginPlanDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: String, description: 'Source plan ID to copy from' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsUUID)(),
    tslib_1.__metadata("design:type", String)
], CopyPluginPlanDTO.prototype, "sourcePlanId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: String, description: 'New plan name' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], CopyPluginPlanDTO.prototype, "newName", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String, description: 'New plan description' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], CopyPluginPlanDTO.prototype, "newDescription", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Number, description: 'New plan price' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    tslib_1.__metadata("design:type", Number)
], CopyPluginPlanDTO.prototype, "newPrice", void 0);
/**
 * Plugin Plan Analytics DTO
 */
class PluginPlanAnalyticsDTO {
}
exports.PluginPlanAnalyticsDTO = PluginPlanAnalyticsDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: String, description: 'Plan ID' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsUUID)(),
    tslib_1.__metadata("design:type", String)
], PluginPlanAnalyticsDTO.prototype, "planId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String, description: 'Date range start (ISO string)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], PluginPlanAnalyticsDTO.prototype, "dateFrom", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String, description: 'Date range end (ISO string)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], PluginPlanAnalyticsDTO.prototype, "dateTo", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [String], description: 'Metrics to include' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    tslib_1.__metadata("design:type", Array)
], PluginPlanAnalyticsDTO.prototype, "metrics", void 0);
//# sourceMappingURL=plugin-subscription-plan.dto.js.map