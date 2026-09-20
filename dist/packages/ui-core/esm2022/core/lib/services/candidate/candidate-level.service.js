import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_PREFIX } from '@gauzy/ui-core/common';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
export class CandidateLevelService {
    constructor(http) {
        this.http = http;
    }
    getAll(orgId) {
        return this.http.get(`${API_PREFIX}/candidate-level/${orgId}`);
    }
    create(candidateLevel) {
        return this.http.post(`${API_PREFIX}/candidate-level`, candidateLevel);
    }
    delete(id) {
        return this.http.delete(`${API_PREFIX}/candidate-level/${id}`);
    }
    update(id, candidateLevel) {
        return this.http.put(`${API_PREFIX}/candidate-level/${id}`, candidateLevel);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CandidateLevelService, deps: [{ token: i1.HttpClient }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CandidateLevelService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CandidateLevelService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: () => [{ type: i1.HttpClient }] });
//# sourceMappingURL=candidate-level.service.js.map