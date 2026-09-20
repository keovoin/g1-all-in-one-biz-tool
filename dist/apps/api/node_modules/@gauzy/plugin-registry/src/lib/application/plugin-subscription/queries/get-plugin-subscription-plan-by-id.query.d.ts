import { ID } from '@gauzy/contracts';
import { IQuery } from '@nestjs/cqrs';
export declare class GetPluginSubscriptionPlanByIdQuery implements IQuery {
    readonly id: ID;
    readonly relations: string[];
    static readonly type = "[Plugin Subscription Plan] Get By ID";
    constructor(id: ID, relations?: string[]);
}
