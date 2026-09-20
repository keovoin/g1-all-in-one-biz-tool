import { ID } from '@gauzy/contracts';
import { IQuery } from '@nestjs/cqrs';
export declare class GetPluginTenantsByPluginQuery implements IQuery {
    readonly pluginId: ID;
    readonly skip?: number;
    readonly take?: number;
    static readonly type = "[Plugin Tenant] Get By Plugin";
    constructor(pluginId: ID, skip?: number, take?: number);
}
