"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionPlanOperationFactory = void 0;
const create_subscription_plan_strategy_1 = require("./create-subscription-plan.strategy");
const update_subscription_plan_strategy_1 = require("./update-subscription-plan.strategy");
/**
 * Factory for creating subscription plan operation strategies
 */
class SubscriptionPlanOperationFactory {
    /**
     * Get the appropriate strategy based on the plan data type
     * @param planData - The plan data to check
     * @returns The appropriate strategy for the operation
     */
    static getOperation(planData) {
        // If plan is UpdatePluginSubscriptionPlanDTO, use update strategy, otherwise use create strategy
        if (planData && 'id' in planData) {
            return this.updateOperation;
        }
        return this.createOperation;
    }
    /**
     * Execute the appropriate strategy for the given plan data
     * @param planData - The plan data to process
     * @param context - The operation context
     */
    static async execute(planData, context) {
        const strategy = this.getOperation(planData);
        return strategy.execute(planData, context);
    }
}
exports.SubscriptionPlanOperationFactory = SubscriptionPlanOperationFactory;
SubscriptionPlanOperationFactory.createOperation = new create_subscription_plan_strategy_1.CreateSubscriptionPlan();
SubscriptionPlanOperationFactory.updateOperation = new update_subscription_plan_strategy_1.UpdateSubscriptionPlanStrategy();
//# sourceMappingURL=subscription-plan-strategy.factory.js.map