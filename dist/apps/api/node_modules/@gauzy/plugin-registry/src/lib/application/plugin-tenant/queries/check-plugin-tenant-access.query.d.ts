import { ID, IRole } from '@gauzy/contracts';
import { IQuery } from '@nestjs/cqrs';
export declare class CheckPluginTenantAccessQuery implements IQuery {
    readonly userId: ID;
    readonly pluginId: ID;
    readonly userRoles: IRole[];
    readonly tenantId?: ID;
    readonly organizationId?: ID;
    static readonly type = "[Plugin Tenant] Check Access";
    constructor(userId: ID, pluginId: ID, userRoles: IRole[], tenantId?: ID, organizationId?: ID);
}
