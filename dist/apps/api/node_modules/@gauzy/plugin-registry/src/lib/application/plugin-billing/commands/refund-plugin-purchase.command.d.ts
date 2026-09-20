import { ID } from '@gauzy/contracts';
import { ICommand } from '@nestjs/cqrs';
export declare class RefundPluginPurchaseCommand implements ICommand {
    readonly subscriptionId: ID;
    readonly refundReason: string;
    readonly refundAmount?: number;
    readonly tenantId?: ID;
    readonly organizationId?: string;
    readonly userId?: ID;
    static readonly type = "[Plugin Purchase] Refund";
    constructor(subscriptionId: ID, refundReason: string, refundAmount?: number, tenantId?: ID, organizationId?: string, userId?: ID);
}
