import { ID } from '@gauzy/contracts';
import { ICommand } from '@nestjs/cqrs';
import { PurchasePluginSubscriptionDTO } from '../../../shared';
export declare class PurchasePluginSubscriptionCommand implements ICommand {
    readonly purchaseDto: PurchasePluginSubscriptionDTO;
    readonly tenantId: ID;
    readonly organizationId?: ID;
    readonly userId?: ID;
    static readonly type = "[Plugin Subscription] Purchase";
    constructor(purchaseDto: PurchasePluginSubscriptionDTO, tenantId: ID, organizationId?: ID, userId?: ID);
}
