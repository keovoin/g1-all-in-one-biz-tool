import { ID } from '@gauzy/contracts';
import { ICommand } from '@nestjs/cqrs';
export declare class DeletePluginSubscriptionCommand implements ICommand {
    readonly subscriptionId: ID;
    readonly pluginTenantId: ID;
    static readonly type = "[Plugin Subscription] Delete";
    constructor(subscriptionId: ID, pluginTenantId: ID);
}
