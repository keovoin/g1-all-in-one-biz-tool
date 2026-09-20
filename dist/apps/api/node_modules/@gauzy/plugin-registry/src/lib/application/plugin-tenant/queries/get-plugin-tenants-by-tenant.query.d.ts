import { ID } from '@gauzy/contracts';
import { IQuery } from '@nestjs/cqrs';
export declare class GetPluginTenantsByTenantQuery implements IQuery {
    readonly tenantId: ID;
    readonly organizationId?: ID;
    readonly skip?: number;
    readonly take?: number;
    static readonly type = "[Plugin Tenant] Get By Tenant";
    constructor(tenantId: ID, organizationId?: ID, skip?: number, take?: number);
}
