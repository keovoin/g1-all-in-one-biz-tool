import { EventBus, ICommandHandler } from '@nestjs/cqrs';
import { PluginBilling, PluginBillingFactory, PluginBillingService } from '../../../../domain';
import { PluginBillingCreateCommand } from '../plugin-billing-create.command';
/**
 * Handler for creating plugin billing records
 * Implements CQRS pattern for separation of concerns
 */
export declare class PluginBillingCreateHandler implements ICommandHandler<PluginBillingCreateCommand> {
    private readonly pluginBillingService;
    private readonly pluginBillingFactory;
    private readonly eventBus;
    private readonly logger;
    constructor(pluginBillingService: PluginBillingService, pluginBillingFactory: PluginBillingFactory, eventBus: EventBus);
    /**
     * Executes the billing creation command
     * @param command - The billing creation command
     * @returns The created billing record
     */
    execute(command: PluginBillingCreateCommand): Promise<PluginBilling>;
    /**
     * Validates the billing input
     * @param input - The billing creation input
     */
    private validateBillingInput;
}
