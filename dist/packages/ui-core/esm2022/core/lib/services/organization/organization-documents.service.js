import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_PREFIX } from '@gauzy/ui-core/common';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
export class OrganizationDocumentsService {
    constructor(http) {
        this.http = http;
    }
    create(newDocument) {
        return this.http.post(`${API_PREFIX}/organization-documents`, newDocument);
    }
    getAll(findInput) {
        const data = JSON.stringify({ findInput });
        return this.http.get(`${API_PREFIX}/organization-documents`, { params: { data } });
    }
    update(id, updateInput) {
        return this.http.put(`${API_PREFIX}/organization-documents/${id}`, updateInput);
    }
    delete(id) {
        return this.http.delete(`${API_PREFIX}/organization-documents/${id}`);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: OrganizationDocumentsService, deps: [{ token: i1.HttpClient }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: OrganizationDocumentsService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: OrganizationDocumentsService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: () => [{ type: i1.HttpClient }] });
//# sourceMappingURL=organization-documents.service.js.map