import { IEventHandler } from '@nestjs/cqrs';
import { PluginSubscriptionService } from '../../services/plugin-subscription.service';
import { PluginBillingPaidEvent } from '../plugin-billing-paid.event';
/**
 * Event handler for PluginBillingPaidEvent
 * Updates subscription status and handles post-payment actions
 */
export declare class PluginBillingPaidHandler implements IEventHandler<PluginBillingPaidEvent> {
    private readonly pluginSubscriptionService;
    private readonly logger;
    constructor(pluginSubscriptionService: PluginSubscriptionService);
    /**
     * Handles the billing paid event
     * @param event - The billing paid event
     */
    handle(event: PluginBillingPaidEvent): Promise<void>;
}
