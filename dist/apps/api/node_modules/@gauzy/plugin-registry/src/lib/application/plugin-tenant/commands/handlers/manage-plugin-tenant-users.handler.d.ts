import { UserService } from '@gauzy/core';
import { ICommandHandler } from '@nestjs/cqrs';
import { PluginSubscriptionAccessService, PluginSubscriptionService, PluginTenantService } from '../../../../domain';
import { IPluginTenant } from '../../../../shared';
import { ManagePluginTenantUsersCommand } from '../manage-plugin-tenant-users.command';
/**
 * Response for user management operations
 */
export interface ManagePluginTenantUsersResult {
    pluginTenant: IPluginTenant;
    affectedUserIds: string[];
    operation: string;
    message: string;
}
export declare class ManagePluginTenantUsersCommandHandler implements ICommandHandler<ManagePluginTenantUsersCommand> {
    private readonly pluginTenantService;
    private readonly userService;
    private readonly pluginSubscriptionService;
    private readonly pluginSubscriptionAccessService;
    private readonly logger;
    constructor(pluginTenantService: PluginTenantService, userService: UserService, pluginSubscriptionService: PluginSubscriptionService, pluginSubscriptionAccessService: PluginSubscriptionAccessService);
    /**
     * Executes the manage plugin tenant users command
     *
     * @param command - The command containing user management data
     * @returns The result of the operation with updated plugin tenant
     * @throws BadRequestException if validation fails
     * @throws NotFoundException if plugin tenant or users not found
     */
    execute(command: ManagePluginTenantUsersCommand): Promise<ManagePluginTenantUsersResult>;
    /**
     * Validate that all user IDs exist and return user entities
     */
    private validateAndGetUsers;
    private validate;
}
