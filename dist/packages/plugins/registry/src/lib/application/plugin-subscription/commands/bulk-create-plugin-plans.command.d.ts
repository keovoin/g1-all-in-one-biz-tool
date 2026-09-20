import { ID } from '@gauzy/contracts';
import { ICommand } from '@nestjs/cqrs';
import { CreatePluginSubscriptionPlanDTO } from '../../../shared';
export declare class BulkCreatePluginPlansCommand implements ICommand {
    readonly plans: CreatePluginSubscriptionPlanDTO[];
    readonly tenantId?: ID;
    readonly organizationId?: ID;
    readonly userId?: ID;
    static readonly type = "[Plugin Subscription Plan] Create Multiple";
    constructor(plans: CreatePluginSubscriptionPlanDTO[], tenantId?: ID, organizationId?: ID, userId?: ID);
}
