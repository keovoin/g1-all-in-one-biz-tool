import { IQuery } from '@nestjs/cqrs';
export declare class GetPluginSubscriptionsBySubscriberIdQuery implements IQuery {
    readonly subscriberId: string;
    readonly relations?: string[];
    static readonly type = "[Plugin Subscription] Get By Subscriber ID";
    constructor(subscriberId: string, relations?: string[]);
}
