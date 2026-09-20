"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePluginDTO = void 0;
const tslib_1 = require("tslib");
const contracts_1 = require("@gauzy/contracts");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const plugin_subscription_plan_dto_1 = require("./plugin-subscription-plan.dto");
const plugin_version_dto_1 = require("./plugin-version.dto");
class CreatePluginDTO {
}
exports.CreatePluginDTO = CreatePluginDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: String, description: 'Plugin name' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Plugin name is required' }),
    (0, class_validator_1.IsString)({ message: 'Plugin name must be a string' }),
    tslib_1.__metadata("design:type", String)
], CreatePluginDTO.prototype, "name", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String, description: 'Plugin description' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Description must be a string' }),
    tslib_1.__metadata("design:type", String)
], CreatePluginDTO.prototype, "description", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ enum: contracts_1.PluginType, description: 'Type of the plugin' }),
    (0, class_validator_1.IsEnum)(contracts_1.PluginType, { message: 'Invalid plugin type' }),
    tslib_1.__metadata("design:type", String)
], CreatePluginDTO.prototype, "type", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ enum: contracts_1.PluginStatus, description: 'Status of the plugin' }),
    (0, class_validator_1.IsEnum)(contracts_1.PluginStatus, { message: 'Invalid plugin status' }),
    tslib_1.__metadata("design:type", String)
], CreatePluginDTO.prototype, "status", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Boolean, description: 'Plugin is active or not', default: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)({ message: 'isActive must be a boolean' }),
    tslib_1.__metadata("design:type", Boolean)
], CreatePluginDTO.prototype, "isActive", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String, description: 'Plugin category ID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(4, { message: 'Category ID must be a valid UUID' }),
    tslib_1.__metadata("design:type", String)
], CreatePluginDTO.prototype, "categoryId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String, description: 'Plugin author' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Author must be a string' }),
    tslib_1.__metadata("design:type", String)
], CreatePluginDTO.prototype, "author", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String, description: 'Plugin license' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'License must be a string' }),
    tslib_1.__metadata("design:type", String)
], CreatePluginDTO.prototype, "license", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String, description: 'Homepage URL' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Homepage URL must be a string' }),
    tslib_1.__metadata("design:type", String)
], CreatePluginDTO.prototype, "homepage", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: String, description: 'Repository URL', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Repository URL must be a string' }),
    tslib_1.__metadata("design:type", String)
], CreatePluginDTO.prototype, "repository", void 0);
tslib_1.__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_validator_1.IsNotEmptyObject)({ nullable: true }, {
        message: 'Version is required',
        each: true
    }),
    (0, class_transformer_1.Type)(() => plugin_version_dto_1.PluginVersionDTO),
    tslib_1.__metadata("design:type", plugin_version_dto_1.PluginVersionDTO)
], CreatePluginDTO.prototype, "version", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [String], description: 'Plugin tags' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)({ message: 'Tags must be an array' }),
    (0, class_validator_1.IsString)({ each: true, message: 'Each tag must be a string' }),
    tslib_1.__metadata("design:type", Array)
], CreatePluginDTO.prototype, "tags", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Boolean, description: 'Whether plugin requires subscription', default: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => Boolean(value)),
    (0, class_validator_1.IsBoolean)({ message: 'requiresSubscription must be a boolean' }),
    tslib_1.__metadata("design:type", Boolean)
], CreatePluginDTO.prototype, "requiresSubscription", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String, description: 'ID of user who uploaded the plugin' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(4, { message: 'Uploaded by ID must be a valid UUID' }),
    tslib_1.__metadata("design:type", String)
], CreatePluginDTO.prototype, "uploadedById", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Array, description: 'Subscription plans for the plugin' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)({ message: 'Subscription plans must be an array' }),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => plugin_subscription_plan_dto_1.CreatePluginSubscriptionPlanDTO),
    tslib_1.__metadata("design:type", Array)
], CreatePluginDTO.prototype, "subscriptionPlans", void 0);
//# sourceMappingURL=create-plugin.dto.js.map