import { CreatePluginSubscriptionPlanDTO, IPluginSubscriptionPlan } from '../../../shared';
import { ISubscriptionPlanOperation, SubscriptionPlanOperationContext } from './subscription-plan-operation.strategy';
/**
 * Strategy for creating new subscription plans
 */
export declare class CreateSubscriptionPlan implements ISubscriptionPlanOperation {
    /**
     * Create a new subscription plan
     * @param input - The plan data to create
     * @param context - The operation context containing pluginId, tenantId, etc.
     */
    execute(input: CreatePluginSubscriptionPlanDTO, context: SubscriptionPlanOperationContext): Promise<IPluginSubscriptionPlan>;
}
