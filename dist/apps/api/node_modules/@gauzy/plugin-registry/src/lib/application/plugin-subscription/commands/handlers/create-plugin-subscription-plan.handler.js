"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePluginSubscriptionPlanCommandHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const domain_1 = require("../../../../domain");
const create_plugin_subscription_plan_command_1 = require("../create-plugin-subscription-plan.command");
let CreatePluginSubscriptionPlanCommandHandler = class CreatePluginSubscriptionPlanCommandHandler {
    constructor(pluginSubscriptionPlanService) {
        this.pluginSubscriptionPlanService = pluginSubscriptionPlanService;
    }
    async execute(command) {
        const { createDto, tenantId, organizationId, userId } = command;
        try {
            const { pluginId } = createDto;
            // Add required defaults and context
            const planData = {
                ...createDto,
                pluginId,
                ...(tenantId && { tenantId }),
                ...(organizationId && { organizationId }),
                ...(userId && { createdById: userId }),
                isActive: createDto.isActive ?? true
            };
            if (!planData.pluginId) {
                throw new common_1.BadRequestException('Plugin ID is required to create a subscription plan');
            }
            return this.pluginSubscriptionPlanService.createPlan(planData);
        }
        catch (error) {
            throw new common_1.BadRequestException(`Failed to create plugin subscription plan: ${error.message}`);
        }
    }
};
exports.CreatePluginSubscriptionPlanCommandHandler = CreatePluginSubscriptionPlanCommandHandler;
exports.CreatePluginSubscriptionPlanCommandHandler = CreatePluginSubscriptionPlanCommandHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(create_plugin_subscription_plan_command_1.CreatePluginSubscriptionPlanCommand),
    tslib_1.__metadata("design:paramtypes", [domain_1.PluginSubscriptionPlanService])
], CreatePluginSubscriptionPlanCommandHandler);
//# sourceMappingURL=create-plugin-subscription-plan.handler.js.map