import { ID } from '@gauzy/contracts';
import { ICommand } from '@nestjs/cqrs';
import { UpdatePluginSubscriptionDTO } from '../../../shared';
export declare class UpdatePluginSubscriptionCommand implements ICommand {
    readonly id: ID;
    readonly updateDto: UpdatePluginSubscriptionDTO;
    static readonly type = "[Plugin Subscription] Update";
    constructor(id: ID, updateDto: UpdatePluginSubscriptionDTO);
}
