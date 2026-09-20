import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { toParams } from '@gauzy/ui-core/common';
import { firstValueFrom } from 'rxjs';
import { API_PREFIX } from '@gauzy/ui-core/common';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
export class ExpensesService {
    constructor(http) {
        this.http = http;
    }
    create(createInput) {
        return firstValueFrom(this.http.post(`${API_PREFIX}/expense`, createInput));
    }
    getMyAllWithSplitExpenses(relations, filterDate) {
        const data = JSON.stringify({ relations, filterDate });
        return firstValueFrom(this.http.get(`${API_PREFIX}/expense/me`, {
            params: { data }
        }));
    }
    getById(id) {
        return firstValueFrom(this.http.get(`${API_PREFIX}/expense/${id}`));
    }
    getAllWithSplitExpenses(employeeId, relations, filterDate) {
        const data = JSON.stringify({ relations, filterDate });
        return firstValueFrom(this.http.get(`${API_PREFIX}/expense/include-split/${employeeId}`, {
            params: { data }
        }));
    }
    getAll(relations, findInput, filterDate) {
        const data = JSON.stringify({ relations, findInput, filterDate });
        return firstValueFrom(this.http.get(`${API_PREFIX}/expense`, {
            params: { data }
        }));
    }
    update(id, updateInput) {
        return firstValueFrom(this.http.put(`${API_PREFIX}/expense/${id}`, updateInput));
    }
    delete(expenseId, input) {
        return firstValueFrom(this.http.delete(`${API_PREFIX}/expense/${expenseId}`, {
            params: toParams({ ...input })
        }));
    }
    getDailyExpensesReport(request = {}) {
        return firstValueFrom(this.http.get(`${API_PREFIX}/expense/report`, {
            params: toParams(request)
        }));
    }
    /**
     * Retrieves expense report chart data based on the provided request parameters.
     * @param request - The request parameters for fetching expense report data.
     * @returns A Promise that resolves to an array of IExpenseReportData objects.
     */
    getExpenseReportCharts(request = {}) {
        // Construct the URL for the API endpoint
        const url = `${API_PREFIX}/expense/report/daily-chart`;
        // Convert the request parameters to an HTTP params object
        const params = toParams(request);
        // Make an HTTP GET request using Angular's HttpClient, and convert the observable to a Promise
        return firstValueFrom(this.http.get(url, { params }));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ExpensesService, deps: [{ token: i1.HttpClient }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ExpensesService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ExpensesService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: () => [{ type: i1.HttpClient }] });
//# sourceMappingURL=expenses.service.js.map