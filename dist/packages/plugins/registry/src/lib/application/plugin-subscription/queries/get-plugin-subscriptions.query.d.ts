import { IQuery } from '@nestjs/cqrs';
import { PluginSubscriptionQueryDTO } from '../../../shared';
export declare class GetPluginSubscriptionsQuery implements IQuery {
    readonly query: PluginSubscriptionQueryDTO;
    static readonly type = "[Plugin Subscription] Get All";
    constructor(query: PluginSubscriptionQueryDTO);
}
