import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { AssignPluginSubscriptionDTO, CheckPluginSubscriptionAccessDTO, PluginSubscriptionAccessResponseDTO, RevokePluginSubscriptionAssignmentDTO } from '../../shared';
export declare class PluginSubscriptionAccessController {
    private readonly commandBus;
    private readonly queryBus;
    constructor(commandBus: CommandBus, queryBus: QueryBus);
    /**
     * Check if current user has access to the plugin
     */
    checkAccess(pluginId: string): Promise<PluginSubscriptionAccessResponseDTO>;
    /**
     * Check if a specific user has access to the plugin
     */
    checkUserAccess(pluginId: string, dto: CheckPluginSubscriptionAccessDTO): Promise<PluginSubscriptionAccessResponseDTO>;
    /**
     * Assign plugin subscription to users (for organization/tenant level subscriptions)
     */
    assignUsers(pluginId: string, dto: AssignPluginSubscriptionDTO): Promise<{
        message: string;
        assignedUsers: number;
    }>;
    /**
     * Revoke plugin subscription assignment from users
     */
    revokeUsers(pluginId: string, dto: RevokePluginSubscriptionAssignmentDTO): Promise<{
        message: string;
        revokedUsers: number;
    }>;
}
