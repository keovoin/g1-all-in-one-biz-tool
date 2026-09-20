import { ID } from '@gauzy/contracts';
import { IQuery } from '@nestjs/cqrs';
/**
 * Type of users to retrieve for a plugin tenant
 */
export type PluginTenantUserType = 'allowed' | 'denied' | 'all';
/**
 * Query to get users for a plugin tenant (allowed, denied, or all)
 */
export declare class GetPluginTenantUsersQuery implements IQuery {
    readonly pluginTenantId: ID;
    readonly userType: PluginTenantUserType;
    readonly skip?: number;
    readonly take?: number;
    readonly searchTerm?: string;
    static readonly type = "[Plugin Tenant] Get Users";
    constructor(pluginTenantId: ID, userType?: PluginTenantUserType, skip?: number, take?: number, searchTerm?: string);
}
