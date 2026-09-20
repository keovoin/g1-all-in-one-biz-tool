import { IQuery } from '@nestjs/cqrs';
export declare class GetPluginSettingsByPluginIdQuery implements IQuery {
    readonly pluginId: string;
    readonly relations?: string[];
    readonly tenantId?: string;
    readonly organizationId?: string;
    static readonly type = "[Plugin Setting] Get By Plugin ID";
    constructor(pluginId: string, relations?: string[], tenantId?: string, organizationId?: string);
}
