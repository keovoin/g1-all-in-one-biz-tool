"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateSubscriptionPlan = void 0;
const plugin_subscription_1 = require("../../plugin-subscription");
/**
 * Strategy for creating new subscription plans
 */
class CreateSubscriptionPlan {
    /**
     * Create a new subscription plan
     * @param input - The plan data to create
     * @param context - The operation context containing pluginId, tenantId, etc.
     */
    async execute(input, context) {
        const { tenantId, organizationId, userId, commandBus, pluginId } = context;
        if (pluginId) {
            input.pluginId = pluginId;
        }
        // The pluginId should already be included in the input DTO
        return commandBus.execute(new plugin_subscription_1.CreatePluginSubscriptionPlanCommand(input, tenantId, organizationId, userId));
    }
}
exports.CreateSubscriptionPlan = CreateSubscriptionPlan;
//# sourceMappingURL=create-subscription-plan.strategy.js.map