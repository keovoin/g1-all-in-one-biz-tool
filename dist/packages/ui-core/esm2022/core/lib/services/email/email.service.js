import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { API_PREFIX, toParams } from '@gauzy/ui-core/common';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
export class EmailService {
    constructor(http) {
        this.http = http;
    }
    /**
     * Retrieves a paginated list of email history records.
     *
     * @param relations - An array of relation names to include (default is an empty array).
     * @param where - Optional filtering criteria for the email history records.
     * @param take - Optional limit on the number of records to retrieve.
     * @returns A promise that resolves to a paginated list of email history records.
     */
    getAll(relations = [], where, take) {
        const data = { relations, where };
        if (take) {
            data.take = take;
        }
        return firstValueFrom(this.http.get(`${API_PREFIX}/email`, {
            params: toParams(data)
        }));
    }
    /**
     * Updates an email history record with the given update input.
     *
     * @param id - The unique identifier of the email record.
     * @param body - The payload containing the update details.
     * @returns A promise that resolves to the updated email history record.
     */
    update(id, body) {
        return firstValueFrom(this.http.put(`${API_PREFIX}/email/${id}`, body));
    }
    /**
     * Resend an email based on the provided input.
     *
     * @param id - The unique identifier of the email record to resend.
     * @param input - The payload containing resend details.
     * @returns A promise that resolves to the email history record after resending.
     */
    resend(id, input) {
        return firstValueFrom(this.http.post(`${API_PREFIX}/email/resend/${id}`, input));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: EmailService, deps: [{ token: i1.HttpClient }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: EmailService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: EmailService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: () => [{ type: i1.HttpClient }] });
//# sourceMappingURL=email.service.js.map