import { ID } from '@gauzy/contracts';
import { IQuery } from '@nestjs/cqrs';
/**
 * Query to get plugin user assignments
 */
export declare class GetPluginUserAssignmentsQuery implements IQuery {
    readonly pluginId: ID;
    readonly tenantId: ID;
    readonly organizationId?: ID;
    readonly skip?: number;
    readonly take?: number;
    static readonly type = "[Plugin User Assignment] Get Plugin User Assignments";
    constructor(pluginId: ID, tenantId: ID, organizationId?: ID, skip?: number, take?: number);
}
/**
 * Query to get user plugin assignments
 */
export declare class GetUserPluginAssignmentsQuery implements IQuery {
    readonly userId: ID;
    readonly tenantId: ID;
    readonly organizationId?: ID;
    readonly skip?: number;
    readonly take?: number;
    static readonly type = "[Plugin User Assignment] Get User Plugin Assignments";
    constructor(userId: ID, tenantId: ID, organizationId?: ID, skip?: number, take?: number);
}
/**
 * Query to check user plugin access
 */
export declare class CheckUserPluginAccessQuery implements IQuery {
    readonly pluginId: ID;
    readonly userId: ID;
    readonly tenantId: ID;
    readonly organizationId?: ID;
    static readonly type = "[Plugin User Assignment] Check User Plugin Access";
    constructor(pluginId: ID, userId: ID, tenantId: ID, organizationId?: ID);
}
/**
 * Query to get all plugin user assignments
 */
export declare class GetAllPluginUserAssignmentsQuery implements IQuery {
    readonly tenantId: ID;
    readonly organizationId?: ID;
    readonly skip?: number;
    readonly take?: number;
    static readonly type = "[Plugin User Assignment] Get All Plugin User Assignments";
    constructor(tenantId: ID, organizationId?: ID, skip?: number, take?: number);
}
