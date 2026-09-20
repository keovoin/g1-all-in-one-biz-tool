"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePluginDTO = void 0;
const tslib_1 = require("tslib");
const contracts_1 = require("@gauzy/contracts");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const create_plugin_dto_1 = require("./create-plugin.dto");
const plugin_subscription_plan_dto_1 = require("./plugin-subscription-plan.dto");
const update_plugin_version_dto_1 = require("./update-plugin-version.dto");
class UpdatePluginDTO extends (0, swagger_1.PartialType)((0, swagger_1.OmitType)(create_plugin_dto_1.CreatePluginDTO, ['version', 'subscriptionPlans'])) {
}
exports.UpdatePluginDTO = UpdatePluginDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Unique identifier for the plugin',
        example: '123e4567-e89b-12d3-a456-426614174000'
    }),
    (0, class_validator_1.IsUUID)('4', { message: 'The plugin ID must be a valid UUID v4' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'The plugin ID is required' }),
    tslib_1.__metadata("design:type", String)
], UpdatePluginDTO.prototype, "id", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: String, description: 'Plugin name' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], UpdatePluginDTO.prototype, "name", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: String, description: 'Plugin description' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], UpdatePluginDTO.prototype, "description", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ enum: contracts_1.PluginType, description: 'Type of the plugin' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(contracts_1.PluginType),
    tslib_1.__metadata("design:type", String)
], UpdatePluginDTO.prototype, "type", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ enum: contracts_1.PluginStatus, description: 'Status of the plugin' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(contracts_1.PluginStatus),
    tslib_1.__metadata("design:type", String)
], UpdatePluginDTO.prototype, "status", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: Boolean, description: 'Plugin is active or not' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, class_transformer_1.Transform)(({ value }) => {
        if (typeof value === 'boolean')
            return value;
        if (typeof value === 'string')
            return value.trim().toLowerCase() === 'true';
        return value;
    }),
    tslib_1.__metadata("design:type", Boolean)
], UpdatePluginDTO.prototype, "isActive", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: String, description: 'Repository URL' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], UpdatePluginDTO.prototype, "repository", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: String, description: 'Author' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], UpdatePluginDTO.prototype, "author", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: String, description: 'License' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], UpdatePluginDTO.prototype, "license", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: String, description: 'Homepage URL' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], UpdatePluginDTO.prototype, "homepage", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: Boolean, description: 'Is subscription plan enabled', default: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, class_transformer_1.Transform)(({ value }) => {
        if (value === 'true' || value === true)
            return true;
        if (value === 'false' || value === false)
            return false;
        return value;
    }),
    tslib_1.__metadata("design:type", Boolean)
], UpdatePluginDTO.prototype, "requiresSubscription", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Updated version details for the plugin',
        required: false,
        type: update_plugin_version_dto_1.UpdatePluginVersionDTO
    }),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => update_plugin_version_dto_1.UpdatePluginVersionDTO),
    tslib_1.__metadata("design:type", Object)
], UpdatePluginDTO.prototype, "version", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Subscription plans to create or update. Plans with an id will be updated, plans without an id will be created',
        required: false,
        type: [plugin_subscription_plan_dto_1.UpdatePluginSubscriptionPlanDTO]
    }),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => plugin_subscription_plan_dto_1.UpdatePluginSubscriptionPlanDTO),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    tslib_1.__metadata("design:type", Array)
], UpdatePluginDTO.prototype, "subscriptionPlans", void 0);
//# sourceMappingURL=update-plugin.dto.js.map