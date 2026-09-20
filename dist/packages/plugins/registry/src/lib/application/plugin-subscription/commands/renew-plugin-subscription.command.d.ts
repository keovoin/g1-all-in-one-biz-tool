import { ID } from '@gauzy/contracts';
import { ICommand } from '@nestjs/cqrs';
export declare class RenewPluginSubscriptionCommand implements ICommand {
    readonly id: ID;
    static readonly type = "[Plugin Subscription] Renew";
    constructor(id: ID);
}
