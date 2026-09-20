import { ID } from '@gauzy/contracts';
import { IQuery } from '@nestjs/cqrs';
export declare class GetPluginSettingsByCategoryQuery implements IQuery {
    readonly pluginId: ID;
    readonly categoryId: ID;
    readonly pluginTenantId?: ID;
    readonly relations?: string[];
    readonly tenantId?: ID;
    readonly organizationId?: ID;
    static readonly type = "[Plugin Setting] Get By Category";
    constructor(pluginId: ID, categoryId: ID, pluginTenantId?: ID, relations?: string[], tenantId?: ID, organizationId?: ID);
}
