import { IInvoice, IInvoiceEstimateHistory } from '@gauzy/contracts';
import { TenantOrganizationBaseEntity, User } from '../core/entities/internal';
export declare class InvoiceEstimateHistory extends TenantOrganizationBaseEntity implements IInvoiceEstimateHistory {
    action: string;
    title?: string;
    user: User;
    userId: string;
    invoice: IInvoice;
    invoiceId: string;
}
