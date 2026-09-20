import { ID } from '@gauzy/contracts';
import { ICommand } from '@nestjs/cqrs';
export declare class CancelPluginSubscriptionCommand implements ICommand {
    readonly id: ID;
    readonly reason?: string;
    static readonly type = "[Plugin Subscription] Cancel";
    constructor(id: ID, reason?: string);
}
