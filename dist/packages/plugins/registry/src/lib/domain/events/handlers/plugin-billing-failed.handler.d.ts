import { IEventHandler } from '@nestjs/cqrs';
import { PluginSubscriptionService } from '../../services/plugin-subscription.service';
import { PluginBillingFailedEvent } from '../plugin-billing-failed.event';
/**
 * Event handler for PluginBillingFailedEvent
 * Handles failed payment scenarios and notifies relevant parties
 */
export declare class PluginBillingFailedHandler implements IEventHandler<PluginBillingFailedEvent> {
    private readonly pluginSubscriptionService;
    private readonly logger;
    constructor(pluginSubscriptionService: PluginSubscriptionService);
    /**
     * Handles the billing failed event
     * @param event - The billing failed event
     */
    handle(event: PluginBillingFailedEvent): Promise<void>;
}
