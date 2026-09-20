import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { API_PREFIX } from '@gauzy/ui-core/common';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
export class EmployeeLevelService {
    constructor(http) {
        this.http = http;
    }
    getAll(relations, findInput) {
        const data = JSON.stringify({ relations: relations || [], findInput });
        return firstValueFrom(this.http.get(`${API_PREFIX}/employee-level`, {
            params: { data }
        }));
    }
    create(employeeLevel) {
        return firstValueFrom(this.http.post(`${API_PREFIX}/employee-level`, employeeLevel));
    }
    delete(id) {
        return firstValueFrom(this.http.delete(`${API_PREFIX}/employee-level/${id}`));
    }
    update(id, employeeLevel) {
        return firstValueFrom(this.http.put(`${API_PREFIX}/employee-level/${id}`, employeeLevel));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: EmployeeLevelService, deps: [{ token: i1.HttpClient }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: EmployeeLevelService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: EmployeeLevelService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: () => [{ type: i1.HttpClient }] });
//# sourceMappingURL=employee-level.service.js.map