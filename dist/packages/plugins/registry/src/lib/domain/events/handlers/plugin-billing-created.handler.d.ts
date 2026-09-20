import { IEventHandler } from '@nestjs/cqrs';
import { PluginSubscriptionService } from '../../services/plugin-subscription.service';
import { PluginBillingCreatedEvent } from '../plugin-billing-created.event';
/**
 * Event handler for PluginBillingCreatedEvent
 * Handles post-creation actions when a billing record is created
 */
export declare class PluginBillingCreatedHandler implements IEventHandler<PluginBillingCreatedEvent> {
    private readonly pluginSubscriptionService;
    private readonly logger;
    constructor(pluginSubscriptionService: PluginSubscriptionService);
    /**
     * Handles the billing created event
     * @param event - The billing created event
     */
    handle(event: PluginBillingCreatedEvent): Promise<void>;
}
