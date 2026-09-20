import { ID } from '@gauzy/contracts';
import { ICommand } from '@nestjs/cqrs';
import { UpdatePluginSubscriptionPlanDTO } from '../../../shared';
export declare class UpdatePluginSubscriptionPlanCommand implements ICommand {
    readonly id: ID;
    readonly updateDto: UpdatePluginSubscriptionPlanDTO;
    static readonly type = "[Plugin Subscription Plan] Update";
    constructor(id: ID, updateDto: UpdatePluginSubscriptionPlanDTO);
}
