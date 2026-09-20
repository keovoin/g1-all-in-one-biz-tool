import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { API_PREFIX } from '@gauzy/ui-core/common';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
export class OrganizationRecurringExpenseService {
    constructor(http) {
        this.http = http;
        this.API_URL = `${API_PREFIX}/organization-recurring-expense`;
    }
    create(createInput) {
        return firstValueFrom(this.http.post(this.API_URL, createInput));
    }
    getAll(relations, findInput, order) {
        const data = JSON.stringify({ relations, findInput, order });
        return firstValueFrom(this.http.get(this.API_URL, {
            params: { data }
        }));
    }
    getAllByMonth(findInput) {
        const data = JSON.stringify({ findInput });
        return firstValueFrom(this.http.get(`${this.API_URL}/month`, {
            params: { data }
        }));
    }
    delete(id, deleteInput) {
        const data = JSON.stringify({ deleteInput });
        return firstValueFrom(this.http.delete(`${this.API_URL}/${id}`, {
            params: { data }
        }));
    }
    update(id, updateInput) {
        return firstValueFrom(this.http.put(`${this.API_URL}/${id}`, updateInput));
    }
    getSplitExpensesForEmployee(orgId, findInput) {
        const data = JSON.stringify({ findInput });
        return firstValueFrom(this.http.get(`${this.API_URL}/employee/${orgId}`, {
            params: { data }
        }));
    }
    getStartDateUpdateType(findInput) {
        const data = JSON.stringify({ findInput });
        return firstValueFrom(this.http.get(`${this.API_URL}/date-update-type`, {
            params: { data }
        }));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: OrganizationRecurringExpenseService, deps: [{ token: i1.HttpClient }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: OrganizationRecurringExpenseService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: OrganizationRecurringExpenseService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: () => [{ type: i1.HttpClient }] });
//# sourceMappingURL=organization-recurring-expense.service.js.map