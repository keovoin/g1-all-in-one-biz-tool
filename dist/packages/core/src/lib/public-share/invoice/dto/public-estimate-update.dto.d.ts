import { EstimateStatusTypesEnum, IInvoiceUpdateInput } from "@gauzy/contracts";
export declare class PublicEstimateUpdateDTO implements IInvoiceUpdateInput {
    readonly isEstimate: boolean;
    readonly status: EstimateStatusTypesEnum;
}
