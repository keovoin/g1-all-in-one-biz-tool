import { ID } from '@gauzy/contracts';
import { ICommand } from '@nestjs/cqrs';
/**
 * Operation type for managing plugin tenant users
 */
export type PluginTenantUserOperation = 'allow' | 'deny' | 'remove-allowed' | 'remove-denied' | 'unassign';
/**
 * Command to manage allowed/denied/unassigned users for a plugin tenant.
 * Supports operations: allow, deny, remove-allowed, remove-denied, unassign.
 */
export declare class ManagePluginTenantUsersCommand implements ICommand {
    readonly pluginTenantId: ID;
    readonly userIds: string[];
    readonly operation: PluginTenantUserOperation;
    readonly reason?: string;
    static readonly type = "[Plugin Tenant] Manage Users";
    constructor(pluginTenantId: ID, userIds: string[], operation: PluginTenantUserOperation, reason?: string);
}
