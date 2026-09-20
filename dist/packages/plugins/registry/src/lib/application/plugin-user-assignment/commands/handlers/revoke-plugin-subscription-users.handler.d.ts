import { ICommandHandler } from '@nestjs/cqrs';
import { PluginSubscriptionAccessService } from '../../../../domain/services/plugin-subscription-access.service';
import { PluginSubscriptionService } from '../../../../domain/services/plugin-subscription.service';
import { PluginTenantService } from '../../../../domain/services/plugin-tenant.service';
import { PluginUserAssignmentService } from '../../../../domain/services/plugin-user-assignment.service';
import { RevokePluginSubscriptionUsersCommand } from '../../commands/revoke-plugin-subscription-users.command';
export declare class RevokePluginSubscriptionUsersCommandHandler implements ICommandHandler<RevokePluginSubscriptionUsersCommand> {
    private readonly subscriptionAccessService;
    private readonly subscriptionService;
    private readonly userAssignmentService;
    private readonly pluginTenantService;
    constructor(subscriptionAccessService: PluginSubscriptionAccessService, subscriptionService: PluginSubscriptionService, userAssignmentService: PluginUserAssignmentService, pluginTenantService: PluginTenantService);
    /**
     * Execute revocation of users from plugin subscription
     *
     * Process:
     * 1. Validate revocation permission
     * 2. Find parent subscription
     * 3. Find PluginTenant for tracking
     * 4. Revoke child subscriptions (set status to CANCELLED)
     * 5. Remove user assignments from PluginTenant
     */
    execute(command: RevokePluginSubscriptionUsersCommand): Promise<{
        message: string;
        revokedUsers: number;
    }>;
}
