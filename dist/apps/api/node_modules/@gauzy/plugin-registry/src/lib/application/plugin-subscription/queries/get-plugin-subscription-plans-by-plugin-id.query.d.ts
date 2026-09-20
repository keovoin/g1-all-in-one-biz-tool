import { ID } from '@gauzy/contracts';
import { IQuery } from '@nestjs/cqrs';
export declare class GetPluginSubscriptionPlansByPluginIdQuery implements IQuery {
    readonly pluginId: ID;
    readonly relations: string[];
    static readonly type = "[Plugin Subscription Plan] Get By Plugin ID";
    constructor(pluginId: ID, relations?: string[]);
}
