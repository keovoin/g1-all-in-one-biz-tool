import { ID } from '@gauzy/contracts';
import { TenantAwareCrudService } from '@gauzy/core';
import { IPluginSubscription } from '../../shared';
import { PluginSubscription } from '../entities';
import { MikroOrmPluginSubscriptionRepository, TypeOrmPluginSubscriptionRepository } from '../repositories';
export declare class PluginSubscriptionService extends TenantAwareCrudService<PluginSubscription> {
    readonly typeOrmPluginSubscriptionRepository: TypeOrmPluginSubscriptionRepository;
    readonly mikroOrmPluginSubscriptionRepository: MikroOrmPluginSubscriptionRepository;
    private readonly logger;
    constructor(typeOrmPluginSubscriptionRepository: TypeOrmPluginSubscriptionRepository, mikroOrmPluginSubscriptionRepository: MikroOrmPluginSubscriptionRepository);
    /**
     * Create child subscriptions for users
     * @param parentSubscriptionId - The ID of the parent subscription
     * @param userIds - Array of user IDs to create subscriptions for
     * @param tenantId - The tenant ID
     * @param organizationId - The organization ID (optional)
     * @returns Promise<PluginSubscription[]> - The created child subscriptions
     */
    createChildSubscriptions(parentSubscriptionId: ID, userIds: ID[], tenantId: ID, organizationId?: ID): Promise<PluginSubscription[]>;
    /**
     * Revoke child subscriptions for users
     * @param parentSubscriptionId - The ID of the parent subscription
     * @param userIds - Array of user IDs to revoke subscriptions for
     * @returns Promise<PluginSubscription[]> - The revoked child subscriptions
     */
    revokeChildSubscriptions(parentSubscriptionId: ID, userIds: ID[]): Promise<PluginSubscription[]>;
    upsert(entity: IPluginSubscription): Promise<IPluginSubscription>;
}
