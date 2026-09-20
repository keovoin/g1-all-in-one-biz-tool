import { ID } from '@gauzy/contracts';
import { IQuery } from '@nestjs/cqrs';
export declare class CheckUserSubscriptionAccessQuery implements IQuery {
    readonly pluginId: ID;
    readonly userId: ID;
    readonly tenantId: ID;
    readonly organizationId?: ID;
    static readonly type = "[Plugin Subscription Access] Check User Access";
    constructor(pluginId: ID, userId: ID, tenantId: ID, organizationId?: ID);
}
