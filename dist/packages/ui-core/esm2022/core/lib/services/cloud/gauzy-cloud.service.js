import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_PREFIX } from '@gauzy/ui-core/common';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
export class GauzyCloudService {
    constructor(_http) {
        this._http = _http;
    }
    migrateIntoCloud(payload) {
        return this._http.post(`${API_PREFIX}/cloud/migrate`, payload);
    }
    migrateTenant(payload, token) {
        return this._http.post(`${API_PREFIX}/cloud/migrate/tenant/${token}`, {
            ...payload
        });
    }
    migrateOrganization(payload, token) {
        return this._http.post(`${API_PREFIX}/cloud/migrate/organization/${token}`, {
            ...payload
        });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: GauzyCloudService, deps: [{ token: i1.HttpClient }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: GauzyCloudService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: GauzyCloudService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: () => [{ type: i1.HttpClient }] });
//# sourceMappingURL=gauzy-cloud.service.js.map