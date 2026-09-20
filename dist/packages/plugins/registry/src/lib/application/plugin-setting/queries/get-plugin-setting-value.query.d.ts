import { ID } from '@gauzy/contracts';
import { IQuery } from '@nestjs/cqrs';
export declare class GetPluginSettingValueQuery implements IQuery {
    readonly pluginId: ID;
    readonly key: string;
    readonly pluginTenantId?: ID;
    readonly tenantId?: ID;
    readonly organizationId?: ID;
    static readonly type = "[Plugin Setting] Get Value";
    constructor(pluginId: ID, key: string, pluginTenantId?: ID, tenantId?: ID, organizationId?: ID);
}
