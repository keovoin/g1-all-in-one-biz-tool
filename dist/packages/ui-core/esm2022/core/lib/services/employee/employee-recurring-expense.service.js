import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { toParams } from '@gauzy/ui-core/common';
import { firstValueFrom } from 'rxjs';
import { API_PREFIX } from '@gauzy/ui-core/common';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
export class EmployeeRecurringExpenseService {
    constructor(http) {
        this.http = http;
        this.API_URL = `${API_PREFIX}/employee-recurring-expense`;
    }
    create(createInput) {
        return firstValueFrom(this.http.post(this.API_URL, createInput));
    }
    getAll(relations = [], where, order) {
        return firstValueFrom(this.http.get(this.API_URL, {
            params: toParams({ relations, where, order })
        }));
    }
    getAllByRange(relations, where) {
        return firstValueFrom(this.http.get(`${this.API_URL}/month`, {
            params: toParams({ relations, ...where })
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
    getStartDateUpdateType(findInput) {
        const data = JSON.stringify({ findInput });
        return firstValueFrom(this.http.get(`${this.API_URL}/date-update-type`, {
            params: { data }
        }));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: EmployeeRecurringExpenseService, deps: [{ token: i1.HttpClient }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: EmployeeRecurringExpenseService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: EmployeeRecurringExpenseService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: () => [{ type: i1.HttpClient }] });
//# sourceMappingURL=employee-recurring-expense.service.js.map