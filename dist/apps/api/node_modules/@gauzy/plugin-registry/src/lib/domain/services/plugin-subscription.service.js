"use strict";
var PluginSubscriptionService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginSubscriptionService = void 0;
const tslib_1 = require("tslib");
const contracts_1 = require("@gauzy/contracts");
const core_1 = require("@gauzy/core");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const repositories_1 = require("../repositories");
let PluginSubscriptionService = PluginSubscriptionService_1 = class PluginSubscriptionService extends core_1.TenantAwareCrudService {
    constructor(typeOrmPluginSubscriptionRepository, mikroOrmPluginSubscriptionRepository) {
        super(typeOrmPluginSubscriptionRepository, mikroOrmPluginSubscriptionRepository);
        this.typeOrmPluginSubscriptionRepository = typeOrmPluginSubscriptionRepository;
        this.mikroOrmPluginSubscriptionRepository = mikroOrmPluginSubscriptionRepository;
        this.logger = new common_1.Logger(PluginSubscriptionService_1.name);
    }
    /**
     * Create child subscriptions for users
     * @param parentSubscriptionId - The ID of the parent subscription
     * @param userIds - Array of user IDs to create subscriptions for
     * @param tenantId - The tenant ID
     * @param organizationId - The organization ID (optional)
     * @returns Promise<PluginSubscription[]> - The created child subscriptions
     */
    async createChildSubscriptions(parentSubscriptionId, userIds, tenantId, organizationId) {
        // Find the parent subscription
        const { success, record: parent } = await this.findOneOrFailByIdString(parentSubscriptionId, {
            relations: ['plugin', 'pluginTenant']
        });
        if (!success || !parent) {
            throw new Error('Parent subscription not found');
        }
        if (!parent.pluginId) {
            throw new Error('Parent subscription pluginId is missing');
        }
        if (!parent.pluginTenantId) {
            throw new Error('Parent subscription pluginTenantId is missing');
        }
        // Find existing child subscriptions in a single query
        const existingChildren = await this.find({
            where: {
                parentId: parentSubscriptionId,
                subscriberId: (0, typeorm_1.In)(userIds),
                tenantId
            },
            select: ['subscriberId']
        });
        const existingUserIds = new Set(existingChildren.map((child) => child.subscriberId));
        const newUserIds = userIds.filter((userId) => !existingUserIds.has(userId));
        if (newUserIds.length === 0) {
            return [];
        }
        // Create child subscriptions in parallel (create() already persists)
        const createdChildren = await Promise.all(newUserIds.map((userId) => this.create({
            pluginId: parent.pluginId,
            pluginTenantId: parent.pluginTenantId,
            planId: parent.planId,
            parentId: parentSubscriptionId,
            subscriberId: userId,
            tenantId,
            organizationId,
            status: parent.status,
            scope: contracts_1.PluginScope.USER,
            startDate: new Date(),
            endDate: parent.endDate,
            autoRenew: false,
            metadata: {
                createdFrom: 'assignment',
                parentSubscriptionId,
                assignedAt: new Date().toISOString()
            }
        })));
        this.logger.log(`Created ${createdChildren.length} child subscriptions for parent ${parentSubscriptionId}`);
        return createdChildren;
    }
    /**
     * Revoke child subscriptions for users
     * @param parentSubscriptionId - The ID of the parent subscription
     * @param userIds - Array of user IDs to revoke subscriptions for
     * @returns Promise<PluginSubscription[]> - The revoked child subscriptions
     */
    async revokeChildSubscriptions(parentSubscriptionId, userIds) {
        const revokedSubscriptions = [];
        for (const userId of userIds) {
            // Find child subscription
            const { record: childSubscription, success } = await this.findOneOrFailByWhereOptions({
                parentId: parentSubscriptionId,
                subscriberId: userId,
                status: (0, typeorm_1.In)([contracts_1.PluginSubscriptionStatus.ACTIVE, contracts_1.PluginSubscriptionStatus.PENDING])
            });
            if (success) {
                // Update status to cancelled/revoked
                const updated = await this.update(childSubscription.id, {
                    status: contracts_1.PluginSubscriptionStatus.CANCELLED,
                    cancelledAt: new Date(),
                    cancellationReason: 'Access revoked by administrator'
                });
                if (updated) {
                    // Fetch the updated subscription and manually update metadata
                    const { record: updatedSubscription, success } = await this.findOneOrFailByIdString(childSubscription.id);
                    if (success) {
                        // Update metadata separately if needed
                        updatedSubscription.metadata = {
                            ...updatedSubscription.metadata,
                            revokedAt: new Date().toISOString(),
                            revokedBy: 'administrator'
                        };
                        // Save the metadata changes
                        await this.save(updatedSubscription);
                        revokedSubscriptions.push(updatedSubscription);
                    }
                }
            }
        }
        return revokedSubscriptions;
    }
    upsert(entity) {
        return this.upsert(entity);
    }
};
exports.PluginSubscriptionService = PluginSubscriptionService;
exports.PluginSubscriptionService = PluginSubscriptionService = PluginSubscriptionService_1 = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [repositories_1.TypeOrmPluginSubscriptionRepository,
        repositories_1.MikroOrmPluginSubscriptionRepository])
], PluginSubscriptionService);
//# sourceMappingURL=plugin-subscription.service.js.map