import { ID, PluginSubscriptionType } from '@gauzy/contracts';
import { IQuery } from '@nestjs/cqrs';
export declare class GetActivePluginPlansQuery implements IQuery {
    readonly pluginId?: ID;
    readonly type?: PluginSubscriptionType;
    readonly relations: string[];
    static readonly type = "[Plugin Subscription Plan] Get Active Plans";
    constructor(pluginId?: ID, type?: PluginSubscriptionType, relations?: string[]);
}
