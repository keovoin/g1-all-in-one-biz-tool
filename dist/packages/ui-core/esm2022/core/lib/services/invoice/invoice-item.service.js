import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { API_PREFIX } from '@gauzy/ui-core/common';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
export class InvoiceItemService {
    constructor(http) {
        this.http = http;
    }
    getAll(relations, findInput) {
        const data = JSON.stringify({ relations, findInput });
        return firstValueFrom(this.http.get(`${API_PREFIX}/invoice-item`, {
            params: { data }
        }));
    }
    add(invoiceItem) {
        return firstValueFrom(this.http.post(`${API_PREFIX}/invoice-item`, invoiceItem));
    }
    update(id, invoiceItem) {
        return firstValueFrom(this.http.put(`${API_PREFIX}/invoice-item/${id}`, invoiceItem));
    }
    delete(id) {
        return firstValueFrom(this.http.delete(`${API_PREFIX}/invoice-item/${id}`));
    }
    createBulk(invoiceId, invoiceItem) {
        return firstValueFrom(this.http.post(`${API_PREFIX}/invoice-item/bulk/${invoiceId}`, invoiceItem));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: InvoiceItemService, deps: [{ token: i1.HttpClient }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: InvoiceItemService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: InvoiceItemService, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: i1.HttpClient }] });
//# sourceMappingURL=invoice-item.service.js.map