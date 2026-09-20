import { ID } from '@gauzy/contracts';
import { ICommand } from '@nestjs/cqrs';
export declare class AutoRenewPluginSubscriptionCommand implements ICommand {
    readonly subscriptionId: ID;
    readonly tenantId: ID;
    readonly organizationId?: ID;
    static readonly type = "[Plugin Subscription] Auto Renew";
    constructor(subscriptionId: ID, tenantId: ID, organizationId?: ID);
}
