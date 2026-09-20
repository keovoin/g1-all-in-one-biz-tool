import { ID, IPagination } from '@gauzy/contracts';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { AssignPluginUsersDTO, IPluginTenant, UnassignPluginUsersDTO } from '../../shared';
/**
 * Plugin User Assignment Controller
 * Handles user assignment operations for specific plugins
 */
export declare class PluginUserAssignmentController {
    private readonly commandBus;
    private readonly queryBus;
    constructor(commandBus: CommandBus, queryBus: QueryBus);
    /**
     * Get all users assigned to a specific plugin
     */
    getPluginUserAssignments(pluginId: ID, skip?: number, take?: number): Promise<any>;
    /**
     * Assign users to a plugin
     */
    assignUsersToPlugin(pluginId: ID, assignDto: AssignPluginUsersDTO): Promise<any>;
    /**
     * Unassign users from a plugin
     */
    unassignUsersFromPlugin(pluginId: ID, unassignDto: UnassignPluginUsersDTO): Promise<any>;
}
/**
 * User Plugin Assignment Controller
 * Handles plugin assignment operations for specific users
 */
export declare class UserPluginAssignmentController {
    private readonly queryBus;
    constructor(queryBus: QueryBus);
    /**
     * Get all plugins assigned to a specific user
     */
    getUserPluginAssignments(userId: ID, skip?: number, take?: number): Promise<IPagination<IPluginTenant>>;
    /**
     * Check if a user has access to a specific plugin
     */
    checkUserPluginAccess(userId: ID, pluginId: ID): Promise<{
        hasAccess: boolean;
    }>;
}
/**
 * Plugin User Assignment Management Controller
 * Handles general management operations for plugin user assignments
 */
export declare class PluginUserAssignmentManagementController {
    private readonly queryBus;
    constructor(queryBus: QueryBus);
    /**
     * Get all plugin user assignments
     */
    getAllPluginUserAssignments(skip?: number, take?: number): Promise<any>;
}
