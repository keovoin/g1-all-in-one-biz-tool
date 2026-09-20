import { ID } from '@gauzy/contracts';
import { IQuery } from '@nestjs/cqrs';
export declare class GetPluginTenantByPluginQuery implements IQuery {
    readonly pluginId: ID;
    readonly tenantId: ID;
    readonly organizationId?: ID;
    constructor(pluginId: ID, tenantId: ID, organizationId?: ID);
}
