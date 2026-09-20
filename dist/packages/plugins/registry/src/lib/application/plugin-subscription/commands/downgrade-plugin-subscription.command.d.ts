import { ID } from '@gauzy/contracts';
import { ICommand } from '@nestjs/cqrs';
export declare class DowngradePluginSubscriptionCommand implements ICommand {
    readonly subscriptionId: ID;
    readonly newPlanId: ID;
    readonly tenantId: ID;
    readonly organizationId?: ID;
    readonly userId?: ID;
    static readonly type = "[Plugin Subscription] Downgrade";
    constructor(subscriptionId: ID, newPlanId: ID, tenantId: ID, organizationId?: ID, userId?: ID);
}
