import { ID } from '@gauzy/contracts';
import { ICommand } from '@nestjs/cqrs';
import { CreatePluginSubscriptionPlanDTO } from '../../../shared';
export declare class CreatePluginSubscriptionPlanCommand implements ICommand {
    readonly createDto: CreatePluginSubscriptionPlanDTO;
    readonly tenantId?: ID;
    readonly organizationId?: ID;
    readonly userId?: ID;
    static readonly type = "[Plugin Subscription Plan] Create";
    constructor(createDto: CreatePluginSubscriptionPlanDTO, tenantId?: ID, organizationId?: ID, userId?: ID);
}
