import { ID } from '@gauzy/contracts';
import { ICommand } from '@nestjs/cqrs';
/**
 * Command to assign users to a plugin
 */
export declare class AssignUsersToPluginCommand implements ICommand {
    readonly pluginId: ID;
    readonly userIds: string[];
    readonly tenantId: ID;
    readonly organizationId?: ID;
    readonly reason?: string;
    static readonly type = "[Plugin User Assignment] Assign Users To Plugin";
    constructor(pluginId: ID, userIds: string[], tenantId: ID, organizationId?: ID, reason?: string);
}
/**
 * Command to unassign users from a plugin
 */
export declare class UnassignUsersFromPluginCommand implements ICommand {
    readonly pluginId: ID;
    readonly userIds: string[];
    readonly tenantId: ID;
    readonly organizationId?: ID;
    readonly reason?: string;
    static readonly type = "[Plugin User Assignment] Unassign Users From Plugin";
    constructor(pluginId: ID, userIds: string[], tenantId: ID, organizationId?: ID, reason?: string);
}
/**
 * Command to bulk assign users to multiple plugins
 */
export declare class BulkAssignUsersToPluginsCommand implements ICommand {
    readonly pluginIds: ID[];
    readonly userIds: string[];
    readonly tenantId: ID;
    readonly organizationId?: ID;
    readonly reason?: string;
    static readonly type = "[Plugin User Assignment] Bulk Assign Users To Plugins";
    constructor(pluginIds: ID[], userIds: string[], tenantId: ID, organizationId?: ID, reason?: string);
}
