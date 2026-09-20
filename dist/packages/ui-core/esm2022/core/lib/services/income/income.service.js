import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_PREFIX, toParams } from '@gauzy/ui-core/common';
import { firstValueFrom } from 'rxjs';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
export class IncomeService {
    constructor(http) {
        this.http = http;
    }
    create(createInput) {
        return firstValueFrom(this.http.post(`${API_PREFIX}/income`, createInput));
    }
    getMyAll(relations, findInput, filterDate) {
        const data = JSON.stringify({ relations, findInput, filterDate });
        return firstValueFrom(this.http.get(`${API_PREFIX}/income/me`, {
            params: { data }
        }));
    }
    getAll(relations, findInput, filterDate) {
        const data = JSON.stringify({ relations, findInput, filterDate });
        return firstValueFrom(this.http.get(`${API_PREFIX}/income`, {
            params: { data }
        }));
    }
    update(id, updateInput) {
        return firstValueFrom(this.http.put(`${API_PREFIX}/income/${id}`, updateInput));
    }
    delete(incomeId, input) {
        return firstValueFrom(this.http.delete(`${API_PREFIX}/income/${incomeId}`, {
            params: toParams({ ...input })
        }));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: IncomeService, deps: [{ token: i1.HttpClient }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: IncomeService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: IncomeService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: () => [{ type: i1.HttpClient }] });
//# sourceMappingURL=income.service.js.map