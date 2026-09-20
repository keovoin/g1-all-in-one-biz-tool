import { IPluginSubscriptionPlan, UpdatePluginSubscriptionPlanDTO } from '../../../shared';
import { ISubscriptionPlanOperation, SubscriptionPlanOperationContext } from './subscription-plan-operation.strategy';
/**
 * Strategy for updating existing subscription plans
 */
export declare class UpdateSubscriptionPlanStrategy implements ISubscriptionPlanOperation {
    /**
     * Update an existing subscription plan
     * @param data - The plan data to update
     * @param context - The operation context (should include planId for updates)
     */
    execute(data: UpdatePluginSubscriptionPlanDTO, context: SubscriptionPlanOperationContext): Promise<IPluginSubscriptionPlan>;
}
