import { InvoiceStatusEnumType } from "@gauzy/contracts";
export declare class UpdateInvoiceActionDTO {
    readonly status: InvoiceStatusEnumType;
    readonly isEstimate: boolean;
    readonly internalNote: string;
    readonly isArchived: boolean;
    readonly paid: boolean;
    readonly alreadyPaid: number;
    readonly amountDue: number;
    /**
     * Recipient the invoice/estimate has been sent to.
     * The route whitelists the payload, so this must be declared to survive validation.
     */
    readonly sentTo: string;
}
