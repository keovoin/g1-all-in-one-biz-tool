import { IEventHandler } from '@nestjs/cqrs';
import { PluginBillingOverdueEvent } from '../plugin-billing-overdue.event';
/**
 * Event handler for PluginBillingOverdueEvent
 * Handles overdue billing scenarios and sends reminders
 */
export declare class PluginBillingOverdueHandler implements IEventHandler<PluginBillingOverdueEvent> {
    private readonly logger;
    /**
     * Handles the billing overdue event
     * @param event - The billing overdue event
     */
    handle(event: PluginBillingOverdueEvent): Promise<void>;
}
