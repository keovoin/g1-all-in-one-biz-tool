"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateMultiplePluginPlansDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const plugin_subscription_plan_dto_1 = require("./plugin-subscription-plan.dto");
/**
 * DTO for creating multiple plugin subscription plans at once
 */
class CreateMultiplePluginPlansDTO {
}
exports.CreateMultiplePluginPlansDTO = CreateMultiplePluginPlansDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({
        type: [plugin_subscription_plan_dto_1.CreatePluginSubscriptionPlanDTO],
        description: 'Array of plugin subscription plans to create'
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Plans array is required' }),
    (0, class_validator_1.IsArray)({ message: 'Plans must be an array' }),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => plugin_subscription_plan_dto_1.CreatePluginSubscriptionPlanDTO),
    tslib_1.__metadata("design:type", Array)
], CreateMultiplePluginPlansDTO.prototype, "plans", void 0);
//# sourceMappingURL=create-multiple-plugin-plans.dto.js.map