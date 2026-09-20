import { ID } from '@gauzy/contracts';
import { ICommand } from '@nestjs/cqrs';
export declare class ExtendTrialSubscriptionCommand implements ICommand {
    readonly subscriptionId: ID;
    readonly days: number;
    readonly tenantId: ID;
    readonly organizationId?: ID;
    readonly userId?: ID;
    static readonly type = "[Plugin Subscription] Extend Trial";
    constructor(subscriptionId: ID, days: number, tenantId: ID, organizationId?: ID, userId?: ID);
}
