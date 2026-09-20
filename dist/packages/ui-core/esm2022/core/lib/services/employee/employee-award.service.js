import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { toParams } from '@gauzy/ui-core/common';
import { API_PREFIX } from '@gauzy/ui-core/common';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
export class EmployeeAwardService {
    constructor(http) {
        this.http = http;
    }
    create(createInput) {
        return this.http.post(`${API_PREFIX}/employee-award`, createInput);
    }
    getAll(where, relations = []) {
        return this.http.get(`${API_PREFIX}/employee-award`, {
            params: toParams({ relations, where })
        });
    }
    update(id, updateInput) {
        return this.http.put(`${API_PREFIX}/employee-award/${id}`, updateInput);
    }
    delete(id) {
        return this.http.delete(`${API_PREFIX}/employee-award/${id}`);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: EmployeeAwardService, deps: [{ token: i1.HttpClient }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: EmployeeAwardService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: EmployeeAwardService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: () => [{ type: i1.HttpClient }] });
//# sourceMappingURL=employee-award.service.js.map