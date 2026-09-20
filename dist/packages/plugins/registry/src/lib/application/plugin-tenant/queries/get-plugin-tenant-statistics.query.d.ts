import { IQuery } from '@nestjs/cqrs';
export declare class GetPluginTenantStatisticsQuery implements IQuery {
    readonly tenantId?: string;
    readonly organizationId?: string;
    static readonly type = "[Plugin Tenant] Get Statistics";
    constructor(tenantId?: string, organizationId?: string);
}
