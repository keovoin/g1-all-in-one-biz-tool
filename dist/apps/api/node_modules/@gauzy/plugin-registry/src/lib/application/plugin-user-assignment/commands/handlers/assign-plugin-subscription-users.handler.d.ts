import { ICommandHandler } from '@nestjs/cqrs';
import { PluginSubscriptionAccessService } from '../../../../domain/services/plugin-subscription-access.service';
import { PluginSubscriptionService } from '../../../../domain/services/plugin-subscription.service';
import { PluginTenantService } from '../../../../domain/services/plugin-tenant.service';
import { PluginUserAssignmentService } from '../../../../domain/services/plugin-user-assignment.service';
import { AssignPluginSubscriptionUsersCommand } from '../assign-plugin-subscription-users.command';
export declare class AssignPluginSubscriptionUsersCommandHandler implements ICommandHandler<AssignPluginSubscriptionUsersCommand> {
    private readonly subscriptionAccessService;
    private readonly subscriptionService;
    private readonly userAssignmentService;
    private readonly pluginTenantService;
    constructor(subscriptionAccessService: PluginSubscriptionAccessService, subscriptionService: PluginSubscriptionService, userAssignmentService: PluginUserAssignmentService, pluginTenantService: PluginTenantService);
    /**
     * Execute assignment of users to plugin subscription
     *
     * Process:
     * 1. Validate assignment permission
     * 2. Find parent subscription (org/tenant level)
     * 3. Find or create PluginTenant for tracking
     * 4. Create child USER-scoped subscriptions
     * 5. Create user assignments in PluginTenant
     */
    execute(command: AssignPluginSubscriptionUsersCommand): Promise<{
        message: string;
        assignedUsers: number;
    }>;
}
