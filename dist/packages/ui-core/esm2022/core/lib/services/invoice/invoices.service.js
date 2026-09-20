import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { API_PREFIX, toParams } from '@gauzy/ui-core/common';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
export class InvoicesService {
    constructor(http) {
        this.http = http;
        this.source = new BehaviorSubject(false);
        this.currentData = this.source.asObservable();
    }
    getAll(where, relations = []) {
        return firstValueFrom(this.http.get(`${API_PREFIX}/invoices`, {
            params: toParams({ where, relations })
        }));
    }
    getHighestInvoiceNumber(tenantId) {
        return firstValueFrom(this.http.get(`${API_PREFIX}/invoices/highest`, {
            params: toParams({ tenantId })
        }));
    }
    getById(id, relations, findInput) {
        const data = JSON.stringify({ relations, findInput });
        return firstValueFrom(this.http.get(`${API_PREFIX}/invoices/${id}`, {
            params: { data }
        }));
    }
    getPublicInvoice(id, token, relations = []) {
        return firstValueFrom(this.http.get(`${API_PREFIX}/public/invoice/${id}/${token}`, {
            params: toParams({ relations })
        }));
    }
    add(invoice) {
        return firstValueFrom(this.http.post(`${API_PREFIX}/invoices`, invoice));
    }
    update(id, updateInput) {
        return firstValueFrom(this.http.put(`${API_PREFIX}/invoices/${id}`, updateInput));
    }
    updateEstimate(id, updateInput) {
        return firstValueFrom(this.http.put(`${API_PREFIX}/invoices/${id}/estimate`, updateInput));
    }
    updateAction(id, updateInput) {
        return firstValueFrom(this.http.put(`${API_PREFIX}/invoices/${id}/action`, updateInput));
    }
    updateWithoutAuth(id, token, input) {
        return firstValueFrom(this.http.put(`${API_PREFIX}/public/invoice/${id}/${token}`, input));
    }
    edit(invoice) {
        return firstValueFrom(this.http.put(`${API_PREFIX}/invoices/${invoice.id}`, invoice));
    }
    generateLink(id) {
        return firstValueFrom(this.http.put(`${API_PREFIX}/invoices/generate/${id}`, {}));
    }
    delete(id) {
        return firstValueFrom(this.http.delete(`${API_PREFIX}/invoices/${id}`));
    }
    sendEmail(email, invoiceNumber, invoiceId, isEstimate, organizationId, tenantId) {
        return firstValueFrom(this.http.put(`${API_PREFIX}/invoices/email/${email}`, {
            params: {
                isEstimate,
                invoiceNumber,
                invoiceId,
                organizationId,
                tenantId
            }
        }));
    }
    changeValue(message) {
        this.source.next(message);
    }
    downloadInvoicePdf(invoiceId) {
        return this.http.get(`${API_PREFIX}/invoices/download/${invoiceId}`, {
            responseType: 'blob'
        });
    }
    downloadInvoicePaymentPdf(invoiceId) {
        return this.http.get(`${API_PREFIX}/invoices/payment/download/${invoiceId}`, {
            responseType: 'blob'
        });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: InvoicesService, deps: [{ token: i1.HttpClient }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: InvoicesService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: InvoicesService, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: i1.HttpClient }] });
//# sourceMappingURL=invoices.service.js.map