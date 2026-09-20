import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { API_PREFIX } from '@gauzy/ui-core/common';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
export class EverAsyncService {
    constructor(http) {
        this.http = http;
        this.apiUrl = `${API_PREFIX}/integration/ever-async`;
    }
    options(organizationId) {
        return { params: new HttpParams().set('organizationId', organizationId) };
    }
    setup(dto, organizationId) {
        return this.http.post(`${this.apiUrl}/setup`, dto, this.options(organizationId));
    }
    getSettings(organizationId) {
        return this.http.get(`${this.apiUrl}/settings`, this.options(organizationId));
    }
    getOptions(organizationId) {
        return this.http.get(`${this.apiUrl}/options`, this.options(organizationId));
    }
    updateSettings(dto, organizationId) {
        return this.http.put(`${this.apiUrl}/settings`, dto, this.options(organizationId));
    }
    rotateCredentials(organizationId) {
        return this.http.post(`${this.apiUrl}/credentials/rotate`, {}, this.options(organizationId));
    }
    verify(serverUrl) {
        return this.http.post(`${this.apiUrl}/verify`, { serverUrl });
    }
    getStatus(organizationId) {
        return this.http.get(`${this.apiUrl}/status`, this.options(organizationId));
    }
    remove(integrationTenantId, organizationId) {
        return this.http.delete(`${this.apiUrl}/${integrationTenantId}`, this.options(organizationId));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: EverAsyncService, deps: [{ token: i1.HttpClient }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: EverAsyncService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: EverAsyncService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: () => [{ type: i1.HttpClient }] });
//# sourceMappingURL=ever-async.service.js.map