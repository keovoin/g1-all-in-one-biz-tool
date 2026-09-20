import { IQuery } from '@nestjs/cqrs';
import { PluginSubscriptionPlanQueryDTO } from '../../../shared';
export declare class ListPluginSubscriptionPlansQuery implements IQuery {
    readonly queryDto: PluginSubscriptionPlanQueryDTO;
    readonly relations: string[];
    static readonly type = "[Plugin Subscription Plan] List";
    constructor(queryDto: PluginSubscriptionPlanQueryDTO, relations?: string[]);
}
