import { ID, PluginSubscriptionType } from '@gauzy/contracts';
import { CrudService } from '@gauzy/core';
import { IPluginSubscriptionPlan, IPluginSubscriptionPlanCreateInput, IPluginSubscriptionPlanFindInput, IPluginSubscriptionPlanUpdateInput } from '../../shared/models/plugin-subscription.model';
import { PluginSubscriptionPlan } from '../entities/plugin-subscription-plan.entity';
import { MikroOrmPluginSubscriptionPlanRepository, TypeOrmPluginSubscriptionPlanRepository } from '../repositories';
export declare class PluginSubscriptionPlanService extends CrudService<PluginSubscriptionPlan> {
    readonly typeOrmPluginSubscriptionPlanRepository: TypeOrmPluginSubscriptionPlanRepository;
    readonly mikroOrmPluginSubscriptionPlanRepository: MikroOrmPluginSubscriptionPlanRepository;
    constructor(typeOrmPluginSubscriptionPlanRepository: TypeOrmPluginSubscriptionPlanRepository, mikroOrmPluginSubscriptionPlanRepository: MikroOrmPluginSubscriptionPlanRepository);
    /**
     * Create a new plugin subscription plan
     */
    createPlan(createInput: Partial<IPluginSubscriptionPlanCreateInput> & {
        name: string;
        pluginId: ID;
    }): Promise<IPluginSubscriptionPlan>;
    /**
     * Update an existing plugin subscription plan
     */
    updatePlan(id: ID, updateInput: IPluginSubscriptionPlanUpdateInput): Promise<IPluginSubscriptionPlan>;
    /**
     * Delete a plugin subscription plan
     */
    deletePlan(id: ID): Promise<void>;
    /**
     * Check if a plugin has any subscription plans
     * @param pluginId - The plugin ID
     * @returns Promise<boolean> indicating if the plugin has any plans
     */
    hasPlans(pluginId: ID): Promise<boolean>;
    /**
     * Get subscription plans by plugin ID
     */
    getByPluginId(pluginId: ID, relations?: string[], onlyActive?: boolean): Promise<IPluginSubscriptionPlan[]>;
    /**
     * Get active plans with optional filtering
     */
    getActivePlans(pluginId?: ID, type?: PluginSubscriptionType, relations?: string[]): Promise<IPluginSubscriptionPlan[]>;
    /**
     * Copy a subscription plan
     */
    copyPlan(sourcePlanId: ID, newName: string, newDescription?: string, newPrice?: number, tenantId?: ID, organizationId?: ID): Promise<IPluginSubscriptionPlan>;
    /**
     * Bulk operations on plans
     */
    bulkOperation(planIds: string[], operation: 'activate' | 'deactivate' | 'delete'): Promise<void>;
    /**
     * Get plan analytics
     */
    getPlanAnalytics(planId: ID, dateFrom?: Date, dateTo?: Date): Promise<{
        totalSubscriptions: number;
        activeSubscriptions: number;
        revenue: number;
        conversionRate: number;
    }>;
    /**
     * Search plans with filtering
     */
    searchPlans(findInput: IPluginSubscriptionPlanFindInput): Promise<IPluginSubscriptionPlan[]>;
    /**
     * Get plan by ID with relations
     */
    getPlanById(id: ID, relations?: string[]): Promise<IPluginSubscriptionPlan>;
    /**
     *
     * @param pluginId - The plugin ID
     * @returns
     */
    isSubscriptionRequired(pluginId: ID): Promise<boolean>;
}
