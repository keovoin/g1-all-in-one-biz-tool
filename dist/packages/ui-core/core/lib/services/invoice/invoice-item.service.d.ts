import { HttpClient } from '@angular/common/http';
import { IInvoiceItem, IInvoiceItemCreateInput, IInvoiceItemFindInput } from '@gauzy/contracts';
import * as i0 from "@angular/core";
export declare class InvoiceItemService {
    private http;
    constructor(http: HttpClient);
    getAll(relations?: string[], findInput?: IInvoiceItemFindInput): Promise<{
        items: IInvoiceItem[];
    }>;
    add(invoiceItem: IInvoiceItem): Promise<IInvoiceItem>;
    update(id: string, invoiceItem: IInvoiceItem): Promise<IInvoiceItem>;
    delete(id: string): Promise<any>;
    createBulk(invoiceId: string, invoiceItem: IInvoiceItemCreateInput[]): Promise<IInvoiceItem[]>;
    static ɵfac: i0.ɵɵFactoryDeclaration<InvoiceItemService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<InvoiceItemService>;
}
