import { HttpClient } from '@angular/common/http';
import { IInvoiceEstimateHistory, IInvoiceEstimateHistoryFindInput } from '@gauzy/contracts';
import * as i0 from "@angular/core";
export declare class InvoiceEstimateHistoryService {
    private http;
    constructor(http: HttpClient);
    getAll(relations?: string[], findInput?: IInvoiceEstimateHistoryFindInput): Promise<{
        items: IInvoiceEstimateHistory[];
    }>;
    add(invoiceEstimateHistory: IInvoiceEstimateHistory): Promise<IInvoiceEstimateHistory>;
    delete(id: string): Promise<any>;
    static ɵfac: i0.ɵɵFactoryDeclaration<InvoiceEstimateHistoryService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<InvoiceEstimateHistoryService>;
}
