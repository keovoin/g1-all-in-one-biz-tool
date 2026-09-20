import { ID } from '@gauzy/contracts';
import { ICommand } from '@nestjs/cqrs';
export declare class DeletePluginSubscriptionPlanCommand implements ICommand {
    readonly id: ID;
    static readonly type = "[Plugin Subscription Plan] Delete";
    constructor(id: ID);
}
