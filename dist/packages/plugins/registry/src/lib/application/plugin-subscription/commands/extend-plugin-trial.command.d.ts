import { ID } from '@gauzy/contracts';
import { ICommand } from '@nestjs/cqrs';
export declare class ExtendPluginTrialCommand implements ICommand {
    readonly subscriptionId: ID;
    readonly extensionDays: number;
    readonly reason?: string;
    readonly tenantId?: ID;
    readonly organizationId?: ID;
    readonly userId?: ID;
    static readonly type = "[Plugin Subscription] Extend Trial";
    constructor(subscriptionId: ID, extensionDays: number, reason?: string, tenantId?: ID, organizationId?: ID, userId?: ID);
}
