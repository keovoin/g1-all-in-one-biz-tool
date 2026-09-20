import { CreatePluginSubscriptionPlanDTO, IPluginSubscriptionPlan, UpdatePluginSubscriptionPlanDTO } from '../../../shared';
import { ISubscriptionPlanOperation, PlanOperationDTO, SubscriptionPlanOperationContext } from './subscription-plan-operation.strategy';
/**
 * Factory for creating subscription plan operation strategies
 */
export declare class SubscriptionPlanOperationFactory {
    private static readonly createOperation;
    private static readonly updateOperation;
    /**
     * Get the appropriate strategy based on the plan data type
     * @param planData - The plan data to check
     * @returns The appropriate strategy for the operation
     */
    static getOperation(planData: PlanOperationDTO): ISubscriptionPlanOperation;
    /**
     * Execute the appropriate strategy for the given plan data
     * @param planData - The plan data to process
     * @param context - The operation context
     */
    static execute(planData: CreatePluginSubscriptionPlanDTO | UpdatePluginSubscriptionPlanDTO, context: SubscriptionPlanOperationContext): Promise<IPluginSubscriptionPlan>;
}
