import { ICommand } from '@nestjs/cqrs';
import { CreatePluginSubscriptionDTO } from '../../../shared';
export declare class CreatePluginSubscriptionCommand implements ICommand {
    readonly createDto: CreatePluginSubscriptionDTO;
    static readonly type = "[Plugin Subscription] Create";
    constructor(createDto: CreatePluginSubscriptionDTO);
}
