"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginSubscriptionPlanService = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@gauzy/core");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const plugin_subscription_plan_entity_1 = require("../entities/plugin-subscription-plan.entity");
const repositories_1 = require("../repositories");
let PluginSubscriptionPlanService = class PluginSubscriptionPlanService extends core_1.CrudService {
    constructor(typeOrmPluginSubscriptionPlanRepository, mikroOrmPluginSubscriptionPlanRepository) {
        super(typeOrmPluginSubscriptionPlanRepository, mikroOrmPluginSubscriptionPlanRepository);
        this.typeOrmPluginSubscriptionPlanRepository = typeOrmPluginSubscriptionPlanRepository;
        this.mikroOrmPluginSubscriptionPlanRepository = mikroOrmPluginSubscriptionPlanRepository;
    }
    /**
     * Create a new plugin subscription plan
     */
    async createPlan(createInput) {
        try {
            // Validate that the plan name is unique per plugin
            const existingPlan = await this.findOneOrFailByWhereOptions({
                pluginId: createInput.pluginId,
                name: createInput.name
            });
            if (existingPlan.success) {
                throw new common_1.BadRequestException(`A plan with name "${createInput.name}" already exists for this plugin`);
            }
            // Create and save the new plan
            const newPlan = plugin_subscription_plan_entity_1.PluginSubscriptionPlan.create(createInput);
            return this.save(newPlan);
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.BadRequestException(`Failed to create subscription plan: ${error.message}`);
        }
    }
    /**
     * Update an existing plugin subscription plan
     */
    async updatePlan(id, updateInput) {
        try {
            const { success: isExists, record: existingPlan } = await this.findOneOrFailByIdString(id);
            if (!isExists) {
                throw new common_1.NotFoundException(`Subscription plan with ID ${id} not found`);
            }
            // If updating name, ensure uniqueness per plugin
            if (updateInput.name && updateInput.name !== existingPlan.name) {
                const { record: duplicatePlan, success } = await this.findOneOrFailByWhereOptions({
                    pluginId: existingPlan.pluginId,
                    name: updateInput.name
                });
                if (success && duplicatePlan.id !== id) {
                    throw new common_1.BadRequestException(`A plan with name "${updateInput.name}" already exists for this plugin`);
                }
            }
            // Update the plan
            await this.update(id, updateInput);
            return await this.findOneByIdString(id);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException || error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.BadRequestException(`Failed to update subscription plan: ${error.message}`);
        }
    }
    /**
     * Delete a plugin subscription plan
     */
    async deletePlan(id) {
        try {
            const plan = await this.findOneByIdString(id);
            if (!plan) {
                throw new common_1.NotFoundException(`Subscription plan with ID ${id} not found`);
            }
            // Check if plan has active subscriptions
            // Note: This should be implemented when subscription relationships are available
            // const activeSubscriptions = await this.checkActiveSubscriptions(id);
            // if (activeSubscriptions > 0) {
            //     throw new BadRequestException('Cannot delete plan with active subscriptions');
            // }
            await this.delete(id);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException || error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.BadRequestException(`Failed to delete subscription plan: ${error.message}`);
        }
    }
    /**
     * Check if a plugin has any subscription plans
     * @param pluginId - The plugin ID
     * @returns Promise<boolean> indicating if the plugin has any plans
     */
    async hasPlans(pluginId) {
        try {
            const count = await this.count({
                where: { pluginId }
            });
            return count > 0;
        }
        catch (error) {
            // If there's an error checking, default to false (treat as free plugin)
            console.error(`Error checking if plugin ${pluginId} has plans:`, error);
            return false;
        }
    }
    /**
     * Get subscription plans by plugin ID
     */
    async getByPluginId(pluginId, relations = [], onlyActive = true) {
        try {
            const queryOptions = {
                where: {
                    pluginId,
                    ...(onlyActive && { isActive: true })
                },
                relations: (0, core_1.parseFindOptionsRelations)(relations),
                order: {
                    sortOrder: 'ASC',
                    price: 'ASC'
                }
            };
            return await this.find(queryOptions);
        }
        catch (error) {
            throw new common_1.BadRequestException(`Failed to get plans for plugin ${pluginId}: ${error.message}`);
        }
    }
    /**
     * Get active plans with optional filtering
     */
    async getActivePlans(pluginId, type, relations = []) {
        try {
            const queryOptions = {
                where: {
                    isActive: true,
                    ...(pluginId && { pluginId }),
                    ...(type && { type })
                },
                relations: (0, core_1.parseFindOptionsRelations)(relations),
                order: {
                    sortOrder: 'ASC',
                    price: 'ASC'
                }
            };
            return await this.find(queryOptions);
        }
        catch (error) {
            throw new common_1.BadRequestException(`Failed to get active plans: ${error.message}`);
        }
    }
    /**
     * Copy a subscription plan
     */
    async copyPlan(sourcePlanId, newName, newDescription, newPrice, tenantId, organizationId) {
        try {
            const sourcePlan = await this.findOneByIdString(sourcePlanId);
            if (!sourcePlan) {
                throw new common_1.NotFoundException(`Source plan with ID ${sourcePlanId} not found`);
            }
            // Check if new name already exists for this plugin
            const { success: nameExists } = await this.findOneOrFailByWhereOptions({
                pluginId: sourcePlan.pluginId,
                name: newName
            });
            if (nameExists) {
                throw new common_1.BadRequestException(`A plan with name "${newName}" already exists for this plugin`);
            }
            // Create new plan based on source
            const newPlan = plugin_subscription_plan_entity_1.PluginSubscriptionPlan.create({
                ...sourcePlan,
                id: undefined, // Remove ID to create new entity
                name: newName,
                description: newDescription || sourcePlan.description,
                price: newPrice !== undefined ? newPrice : sourcePlan.price,
                createdAt: undefined,
                updatedAt: undefined
            });
            return this.save(newPlan);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException || error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.BadRequestException(`Failed to copy subscription plan: ${error.message}`);
        }
    }
    /**
     * Bulk operations on plans
     */
    async bulkOperation(planIds, operation) {
        try {
            if (!planIds || planIds.length === 0) {
                throw new common_1.BadRequestException('Plan IDs are required for bulk operations');
            }
            switch (operation) {
                case 'activate':
                    switch (this.ormType) {
                        case core_1.MultiORMEnum.MikroORM:
                            await this.mikroOrmRepository.nativeUpdate({ id: { $in: planIds } }, { isActive: true });
                            break;
                        case core_1.MultiORMEnum.TypeORM:
                        default:
                            await this.typeOrmRepository.update(planIds, { isActive: true });
                            break;
                    }
                    break;
                case 'deactivate':
                    switch (this.ormType) {
                        case core_1.MultiORMEnum.MikroORM:
                            await this.mikroOrmRepository.nativeUpdate({ id: { $in: planIds } }, { isActive: false });
                            break;
                        case core_1.MultiORMEnum.TypeORM:
                        default:
                            await this.typeOrmRepository.update(planIds, { isActive: false });
                            break;
                    }
                    break;
                case 'delete':
                    // Check for active subscriptions before deletion
                    switch (this.ormType) {
                        case core_1.MultiORMEnum.MikroORM:
                            await this.mikroOrmRepository.nativeDelete({ id: { $in: planIds } });
                            break;
                        case core_1.MultiORMEnum.TypeORM:
                        default:
                            await this.typeOrmRepository.delete(planIds);
                            break;
                    }
                    break;
                default:
                    throw new common_1.BadRequestException(`Invalid operation: ${operation}`);
            }
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.BadRequestException(`Failed to perform bulk operation: ${error.message}`);
        }
    }
    /**
     * Get plan analytics
     */
    async getPlanAnalytics(planId, dateFrom, dateTo) {
        try {
            // Note: This is a placeholder implementation
            // Actual implementation should query subscription and billing data
            return {
                totalSubscriptions: 0,
                activeSubscriptions: 0,
                revenue: 0,
                conversionRate: 0
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(`Failed to get plan analytics: ${error.message}`);
        }
    }
    /**
     * Search plans with filtering
     */
    async searchPlans(findInput) {
        try {
            const queryOptions = {
                where: {
                    ...(findInput.pluginId && { pluginId: findInput.pluginId }),
                    ...(findInput.type && { type: findInput.type }),
                    ...(findInput.isActive !== undefined && { isActive: findInput.isActive }),
                    ...(findInput.isPopular !== undefined && { isPopular: findInput.isPopular }),
                    ...(findInput.isRecommended !== undefined && { isRecommended: findInput.isRecommended }),
                    ...(findInput.billingPeriod && { billingPeriod: findInput.billingPeriod })
                },
                order: {
                    sortOrder: 'ASC',
                    price: 'ASC'
                }
            };
            return await this.find(queryOptions);
        }
        catch (error) {
            throw new common_1.BadRequestException(`Failed to search plans: ${error.message}`);
        }
    }
    /**
     * Get plan by ID with relations
     */
    async getPlanById(id, relations = []) {
        try {
            const queryOptions = {
                where: { id },
                relations: (0, core_1.parseFindOptionsRelations)(relations)
            };
            const { success, record: plan } = await this.findOneOrFailByOptions(queryOptions);
            if (!success) {
                throw new common_1.NotFoundException(`Subscription plan with ID ${id} not found`);
            }
            return plan;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.BadRequestException(`Failed to get plan: ${error.message}`);
        }
    }
    /**
     *
     * @param pluginId - The plugin ID
     * @returns
     */
    async isSubscriptionRequired(pluginId) {
        try {
            const count = await this.count({
                where: [
                    {
                        pluginId,
                        isActive: true,
                        price: (0, typeorm_1.MoreThan)(0)
                    },
                    {
                        isActive: true,
                        plugin: {
                            requiresSubscription: true,
                            id: pluginId
                        }
                    }
                ]
            });
            return count > 0;
        }
        catch (error) {
            // If there's an error checking, default to false (treat as free plugin)
            console.error('Error checking if plugin %s requires subscription:', pluginId, error);
            return false;
        }
    }
};
exports.PluginSubscriptionPlanService = PluginSubscriptionPlanService;
exports.PluginSubscriptionPlanService = PluginSubscriptionPlanService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [repositories_1.TypeOrmPluginSubscriptionPlanRepository,
        repositories_1.MikroOrmPluginSubscriptionPlanRepository])
], PluginSubscriptionPlanService);
//# sourceMappingURL=plugin-subscription-plan.service.js.map