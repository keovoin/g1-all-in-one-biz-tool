"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublishPluginDTO = exports.PluginPricingDTO = void 0;
const tslib_1 = require("tslib");
const contracts_1 = require("@gauzy/contracts");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class PluginPricingDTO {
}
exports.PluginPricingDTO = PluginPricingDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Pricing type' }),
    (0, class_validator_1.IsEnum)(contracts_1.PluginPricingType),
    tslib_1.__metadata("design:type", String)
], PluginPricingDTO.prototype, "type", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Plugin price' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    tslib_1.__metadata("design:type", Number)
], PluginPricingDTO.prototype, "price", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Currency code' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], PluginPricingDTO.prototype, "currency", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Billing period for subscription' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(contracts_1.PluginBillingPeriod),
    tslib_1.__metadata("design:type", String)
], PluginPricingDTO.prototype, "billingPeriod", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Trial period in days' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    tslib_1.__metadata("design:type", Number)
], PluginPricingDTO.prototype, "trialPeriodDays", void 0);
class PublishPluginDTO {
}
exports.PublishPluginDTO = PublishPluginDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Plugin name' }),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], PublishPluginDTO.prototype, "name", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Plugin description' }),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], PublishPluginDTO.prototype, "description", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Plugin version' }),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], PublishPluginDTO.prototype, "version", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Plugin category ID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], PublishPluginDTO.prototype, "categoryId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Plugin tags' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    tslib_1.__metadata("design:type", Array)
], PublishPluginDTO.prototype, "tags", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Plugin pricing information' }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => PluginPricingDTO),
    tslib_1.__metadata("design:type", PluginPricingDTO)
], PublishPluginDTO.prototype, "pricing", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Plugin icon URL' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], PublishPluginDTO.prototype, "iconUrl", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Plugin screenshot URLs' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    tslib_1.__metadata("design:type", Array)
], PublishPluginDTO.prototype, "screenshots", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Plugin documentation URL' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], PublishPluginDTO.prototype, "documentationUrl", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Plugin support URL' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], PublishPluginDTO.prototype, "supportUrl", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Plugin website URL' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], PublishPluginDTO.prototype, "websiteUrl", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Plugin license' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], PublishPluginDTO.prototype, "license", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Auto-publish after approval' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    tslib_1.__metadata("design:type", Boolean)
], PublishPluginDTO.prototype, "autoPublish", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Release notes' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], PublishPluginDTO.prototype, "releaseNotes", void 0);
//# sourceMappingURL=plugin-publish.dto.js.map