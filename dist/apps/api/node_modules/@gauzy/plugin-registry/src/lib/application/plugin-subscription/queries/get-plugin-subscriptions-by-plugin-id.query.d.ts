import { IQuery } from '@nestjs/cqrs';
export declare class GetPluginSubscriptionsByPluginIdQuery implements IQuery {
    readonly pluginId: string;
    readonly relations?: string[];
    static readonly type = "[Plugin Subscription] Get By Plugin ID";
    constructor(pluginId: string, relations?: string[]);
}
