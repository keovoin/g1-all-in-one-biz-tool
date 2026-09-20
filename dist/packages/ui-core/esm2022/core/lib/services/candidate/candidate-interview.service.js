import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { toParams } from '@gauzy/ui-core/common';
import { API_PREFIX } from '@gauzy/ui-core/common';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
export class CandidateInterviewService {
    constructor(http) {
        this.http = http;
    }
    create(input) {
        return firstValueFrom(this.http.post(`${API_PREFIX}/candidate-interview`, input));
    }
    getAll(relations = [], where) {
        return this.http.get(`${API_PREFIX}/candidate-interview`, {
            params: toParams({ where, relations })
        });
    }
    findById(id, relations = []) {
        return firstValueFrom(this.http.get(`${API_PREFIX}/candidate-interview/${id}`, {
            params: toParams({ relations })
        }));
    }
    findByCandidateId(candidateId) {
        return firstValueFrom(this.http.get(`${API_PREFIX}/candidate-interview/candidate/${candidateId}`));
    }
    update(id, input) {
        return firstValueFrom(this.http.put(`${API_PREFIX}/candidate-interview/${id}`, input));
    }
    setInterviewAsArchived(id) {
        return firstValueFrom(this.http.put(`${API_PREFIX}/candidate-interview/${id}`, {
            isArchived: true
        }));
    }
    delete(id) {
        return firstValueFrom(this.http.delete(`${API_PREFIX}/candidate-interview/${id}`));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CandidateInterviewService, deps: [{ token: i1.HttpClient }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CandidateInterviewService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CandidateInterviewService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: () => [{ type: i1.HttpClient }] });
//# sourceMappingURL=candidate-interview.service.js.map