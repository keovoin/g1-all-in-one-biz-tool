import { ID } from '@gauzy/contracts';
import { IQuery } from '@nestjs/cqrs';
export declare class GetActivePluginSubscriptionQuery implements IQuery {
    readonly pluginId: ID;
    readonly tenantId: ID;
    readonly organizationId?: ID;
    readonly subscriberId?: ID;
    static readonly type = "[Plugin Subscription] Get Active";
    constructor(pluginId: ID, tenantId: ID, organizationId?: ID, subscriberId?: ID);
}
