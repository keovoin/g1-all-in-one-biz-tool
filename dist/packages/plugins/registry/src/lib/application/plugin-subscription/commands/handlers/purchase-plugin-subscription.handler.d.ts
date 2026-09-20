import { CommandBus, ICommandHandler } from '@nestjs/cqrs';
import { PluginSubscriptionPlanService, PluginSubscriptionService, PluginTenantService } from '../../../../domain';
import { IPluginSubscription } from '../../../../shared';
import { PurchasePluginSubscriptionCommand } from '../purchase-plugin-subscription.command';
export declare class PurchasePluginSubscriptionCommandHandler implements ICommandHandler<PurchasePluginSubscriptionCommand> {
    private readonly pluginSubscriptionService;
    private readonly pluginTenantService;
    private readonly pluginSubscriptionPlanService;
    private readonly commandBus;
    constructor(pluginSubscriptionService: PluginSubscriptionService, pluginTenantService: PluginTenantService, pluginSubscriptionPlanService: PluginSubscriptionPlanService, commandBus: CommandBus);
    /**
     * Execute plugin subscription purchase with proper handling for free vs paid plans.
     *
     * Business Rules:
     * 1. Free Plans: Automatically create USER-scoped subscriptions with immediate ACTIVE status
     * 2. Paid Plans: Create subscriptions at the requested scope (TENANT/ORGANIZATION/USER) with PENDING status until payment
     * 3. Trial Plans: Create subscriptions with TRIAL status and set trial end date
     *
     * @param command - The purchase command with subscription details
     * @returns The created subscription
     */
    execute(command: PurchasePluginSubscriptionCommand): Promise<IPluginSubscription>;
    /**
     * Calculate subscription end date based on billing period
     * @param billingPeriod - The billing period
     * @returns The end date for the subscription
     */
    private calculateSubscriptionEndDate;
}
