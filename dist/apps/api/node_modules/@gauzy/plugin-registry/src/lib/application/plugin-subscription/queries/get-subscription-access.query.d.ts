import { ID } from '@gauzy/contracts';
import { IQuery } from '@nestjs/cqrs';
export declare class GetSubscriptionAccessQuery implements IQuery {
    readonly pluginId: ID;
    readonly tenantId: ID;
    readonly organizationId?: ID;
    readonly userId?: ID;
    static readonly type = "[Plugin Subscription Access] Get Access";
    constructor(pluginId: ID, tenantId: ID, organizationId?: ID, userId?: ID);
}
