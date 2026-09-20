import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { API_PREFIX } from '@gauzy/ui-core/common';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
export class PlaneService {
    constructor(http) {
        this.http = http;
        this.API_URL = `${API_PREFIX}/integration/plane`;
    }
    /**
     * Configure Plane integration with URLs.
     */
    setup(dto, organizationId) {
        const params = organizationId ? new HttpParams().set('organizationId', organizationId) : undefined;
        return this.http.post(`${this.API_URL}/setup`, dto, { params });
    }
    /**
     * Get Plane integration settings (no API key exposed).
     */
    getSettings(organizationId) {
        const params = organizationId ? new HttpParams().set('organizationId', organizationId) : undefined;
        return this.http.get(`${this.API_URL}/settings`, { params });
    }
    /**
     * Update Plane integration URL settings.
     */
    updateSettings(dto, organizationId) {
        const params = organizationId ? new HttpParams().set('organizationId', organizationId) : undefined;
        return this.http.put(`${this.API_URL}/settings`, dto, { params });
    }
    /**
     * Remove Plane integration.
     */
    removeIntegration(integrationTenantId) {
        return this.http.delete(`${this.API_URL}/${integrationTenantId}`);
    }
    /**
     * Regenerate API key and secret.
     */
    regenerateApiKey(organizationId) {
        const params = organizationId ? new HttpParams().set('organizationId', organizationId) : undefined;
        return this.http.post(`${this.API_URL}/regenerate-key`, null, { params });
    }
    /**
     * Get integration status.
     */
    getStatus() {
        return this.http.get(`${this.API_URL}/status`);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: PlaneService, deps: [{ token: i1.HttpClient }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: PlaneService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: PlaneService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: () => [{ type: i1.HttpClient }] });
//# sourceMappingURL=plane.service.js.map