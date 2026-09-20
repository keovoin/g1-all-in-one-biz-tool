import { IQuery } from '@nestjs/cqrs';
export declare class GetPluginSettingsByTenantIdQuery implements IQuery {
    readonly pluginTenantId: string;
    readonly relations?: string[];
    readonly tenantId?: string;
    readonly organizationId?: string;
    static readonly type = "[Plugin Setting] Get By Tenant ID";
    constructor(pluginTenantId: string, relations?: string[], tenantId?: string, organizationId?: string);
}
