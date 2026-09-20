import { IQuery } from '@nestjs/cqrs';
export declare class GetExpiringSubscriptionsQuery implements IQuery {
    readonly days: number;
    static readonly type = "[Plugin Subscription] Get Expiring";
    constructor(days?: number);
}
