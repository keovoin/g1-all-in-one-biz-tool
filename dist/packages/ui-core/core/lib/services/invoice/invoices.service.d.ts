import { HttpClient } from '@angular/common/http';
import { ID, IEstimateEmail, IInvoice, IInvoiceCreateInput, IInvoiceFindInput, IInvoiceUpdateInput, IPagination } from '@gauzy/contracts';
import * as i0 from "@angular/core";
export declare class InvoicesService {
    private http;
    private source;
    currentData: import("rxjs").Observable<boolean>;
    constructor(http: HttpClient);
    getAll(where: IInvoiceFindInput, relations?: string[]): Promise<IPagination<IInvoice>>;
    getHighestInvoiceNumber(tenantId: ID): Promise<IInvoice>;
    getById(id: ID, relations?: string[], findInput?: IInvoiceFindInput): Promise<IInvoice>;
    getPublicInvoice(id: ID, token: string, relations?: string[]): Promise<IInvoice>;
    add(invoice: IInvoiceCreateInput): Promise<IInvoice>;
    update(id: ID, updateInput: IInvoiceUpdateInput): Promise<IInvoice>;
    updateEstimate(id: ID, updateInput: IInvoiceUpdateInput): Promise<IInvoice>;
    updateAction(id: ID, updateInput: IInvoiceUpdateInput): Promise<IInvoice>;
    updateWithoutAuth(id: ID, token: IEstimateEmail['token'], input: IInvoiceUpdateInput): Promise<IInvoice>;
    edit(invoice: IInvoice): Promise<IInvoice>;
    generateLink(id: ID): Promise<IInvoice>;
    delete(id: ID): Promise<any>;
    sendEmail(email: string, invoiceNumber: number, invoiceId: ID, isEstimate: boolean, organizationId: ID, tenantId: ID): Promise<any>;
    changeValue(message: boolean): void;
    downloadInvoicePdf(invoiceId: ID): import("rxjs").Observable<Blob>;
    downloadInvoicePaymentPdf(invoiceId: ID): import("rxjs").Observable<Blob>;
    static ɵfac: i0.ɵɵFactoryDeclaration<InvoicesService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<InvoicesService>;
}
