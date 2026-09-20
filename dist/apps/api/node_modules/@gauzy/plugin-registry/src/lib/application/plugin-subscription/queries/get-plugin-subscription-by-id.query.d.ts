import { IQuery } from '@nestjs/cqrs';
export declare class GetPluginSubscriptionByIdQuery implements IQuery {
    readonly id: string;
    readonly relations?: string[];
    static readonly type = "[Plugin Subscription] Get By ID";
    constructor(id: string, relations?: string[]);
}
