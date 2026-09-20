import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { PluginSubscription } from '../../domain';
import { PluginSubscriptionQueryDTO, PurchasePluginSubscriptionDTO, UpdatePluginSubscriptionDTO } from '../../shared';
export declare class PluginSubscriptionController {
    private readonly commandBus;
    private readonly queryBus;
    constructor(commandBus: CommandBus, queryBus: QueryBus);
    create(pluginId: string, purchaseDto: PurchasePluginSubscriptionDTO): Promise<PluginSubscription>;
    findAll(pluginId: string, query: PluginSubscriptionQueryDTO, expiring?: boolean, days?: number, active?: boolean, relations?: string[]): Promise<PluginSubscription[]>;
    getCurrentSubscription(pluginId: string): Promise<PluginSubscription | null>;
    findOne(id: string): Promise<PluginSubscription>;
    updateStatus(pluginId: string, id: string, updateDto: {
        status: 'cancelled' | 'renewed' | 'active' | 'expired' | 'suspended';
        reason?: string;
    }): Promise<PluginSubscription>;
    update(id: string, updateDto: UpdatePluginSubscriptionDTO): Promise<PluginSubscription>;
    upgrade(id: string, body: {
        planId: string;
    }): Promise<PluginSubscription>;
    downgrade(id: string, body: {
        planId: string;
    }): Promise<PluginSubscription>;
    delete(subscriberId: string, pluginTenantId: string): Promise<void>;
}
