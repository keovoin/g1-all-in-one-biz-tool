import { ID } from '@gauzy/contracts';
import { ICommand } from '@nestjs/cqrs';
export declare class UpgradePluginSubscriptionCommand implements ICommand {
    readonly subscriptionId: ID;
    readonly newPlanId: ID;
    readonly tenantId: ID;
    readonly organizationId?: ID;
    readonly userId?: ID;
    static readonly type = "[Plugin Subscription] Upgrade";
    constructor(subscriptionId: ID, newPlanId: ID, tenantId: ID, organizationId?: ID, userId?: ID);
}
