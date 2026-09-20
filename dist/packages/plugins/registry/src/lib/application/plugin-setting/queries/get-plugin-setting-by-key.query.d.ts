import { ID } from '@gauzy/contracts';
import { IQuery } from '@nestjs/cqrs';
export declare class GetPluginSettingsByKeyQuery implements IQuery {
    readonly pluginId: ID;
    readonly key: string;
    readonly pluginTenantId?: ID;
    readonly relations?: string[];
    readonly tenantId?: ID;
    readonly organizationId?: ID;
    static readonly type = "[Plugin Setting] Get By Key";
    constructor(pluginId: ID, key: string, pluginTenantId?: ID, relations?: string[], tenantId?: ID, organizationId?: ID);
}
