"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateSubscriptionPlanStrategy = void 0;
const plugin_subscription_1 = require("../../plugin-subscription");
/**
 * Strategy for updating existing subscription plans
 */
class UpdateSubscriptionPlanStrategy {
    /**
     * Update an existing subscription plan
     * @param data - The plan data to update
     * @param context - The operation context (should include planId for updates)
     */
    async execute(data, context) {
        const { commandBus, planId = data.id } = context;
        if (!planId) {
            throw new Error('Plan ID is required for update operation');
        }
        return commandBus.execute(new plugin_subscription_1.UpdatePluginSubscriptionPlanCommand(planId, data));
    }
}
exports.UpdateSubscriptionPlanStrategy = UpdateSubscriptionPlanStrategy;
//# sourceMappingURL=update-subscription-plan.strategy.js.map