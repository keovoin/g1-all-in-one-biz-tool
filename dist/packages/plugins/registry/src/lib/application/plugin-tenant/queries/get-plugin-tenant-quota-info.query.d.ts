import { ID } from '@gauzy/contracts';
import { IQuery } from '@nestjs/cqrs';
export declare class GetPluginTenantQuotaInfoQuery implements IQuery {
    readonly pluginTenantId: ID;
    static readonly type = "[Plugin Tenant] Get Quota Info";
    constructor(pluginTenantId: ID);
}
