import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { toParams } from '@gauzy/ui-core/common';
import { API_PREFIX } from '@gauzy/ui-core/common';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
export class CandidateDocumentsService {
    constructor(http) {
        this.http = http;
    }
    create(createInput) {
        return firstValueFrom(this.http.post(`${API_PREFIX}/candidate-documents`, createInput));
    }
    getAll(where) {
        return firstValueFrom(this.http.get(`${API_PREFIX}/candidate-documents`, {
            params: toParams({ where })
        }));
    }
    update(id, updateInput) {
        return firstValueFrom(this.http.put(`${API_PREFIX}/candidate-documents/${id}`, updateInput));
    }
    delete(id) {
        return firstValueFrom(this.http.delete(`${API_PREFIX}/candidate-documents/${id}`));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CandidateDocumentsService, deps: [{ token: i1.HttpClient }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CandidateDocumentsService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CandidateDocumentsService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: () => [{ type: i1.HttpClient }] });
//# sourceMappingURL=candidate-documents.service.js.map