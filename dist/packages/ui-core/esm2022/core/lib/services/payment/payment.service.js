import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { toParams } from '@gauzy/ui-core/common';
import { API_PREFIX } from '@gauzy/ui-core/common';
import { firstValueFrom } from 'rxjs';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
export class PaymentService {
    constructor(http) {
        this.http = http;
    }
    getAll(relations = [], where) {
        return firstValueFrom(this.http.get(`${API_PREFIX}/payments`, {
            params: toParams({ relations, where })
        }));
    }
    add(payment) {
        return firstValueFrom(this.http.post(`${API_PREFIX}/payments`, payment));
    }
    update(id, updateInput) {
        return firstValueFrom(this.http.put(`${API_PREFIX}/payments/${id}`, updateInput));
    }
    delete(id) {
        return firstValueFrom(this.http.delete(`${API_PREFIX}/payments/${id}`));
    }
    /**
     * Asynchronously retrieves payment report data based on the provided request parameters.
     *
     * @param request - Optional parameters for customizing the request (IGetPaymentInput).
     * @returns A Promise that resolves to the payment report data.
     */
    async getPaymentsReport(request) {
        // Convert the request parameters to URL query parameters
        const params = toParams(request);
        // Make an HTTP GET request to the payment report data endpoint
        return await firstValueFrom(this.http.get(`${API_PREFIX}/payments/report`, { params }));
    }
    /**
     * retrieves payment report chart data based on the provided request parameters.
     *
     * @param request - Optional parameters for customizing the request (IGetPaymentInput).
     * @returns A Promise that resolves to the payment report chart data.
     */
    async getPaymentsReportCharts(request) {
        // Convert the request parameters to URL query parameters
        const params = toParams(request);
        // Make an HTTP GET request to the payment report chart data endpoint
        return await firstValueFrom(this.http.get(`${API_PREFIX}/payments/report/charts`, { params }));
    }
    sendReceipt(payment, invoice) {
        return firstValueFrom(this.http.post(`${API_PREFIX}/payments/receipt`, {
            params: {
                payment,
                invoice
            }
        }));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: PaymentService, deps: [{ token: i1.HttpClient }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: PaymentService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: PaymentService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: () => [{ type: i1.HttpClient }] });
//# sourceMappingURL=payment.service.js.map