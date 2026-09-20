import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { toParams } from '@gauzy/ui-core/common';
import { API_PREFIX } from '@gauzy/ui-core/common';
import { CrudService } from '../crud/crud.service';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
export class IntegrationTenantService extends CrudService {
    static { this.API_URL = `${API_PREFIX}/integration-tenant`; }
    constructor(_http) {
        super(_http, IntegrationTenantService.API_URL);
        this._http = _http;
    }
    /**
     * Get a list of IntegrationTenant entities based on specified criteria and optional relations.
     *
     * @param where - The criteria to filter IntegrationTenant entities.
     * @param relations - Optional relations to include in the response.
     * @returns An Observable of IPagination<IIntegrationTenant>.
     */
    getAll(where, relations = []) {
        const url = `${API_PREFIX}/integration-tenant`;
        const params = toParams({ where, relations }); // Include relations in the parameters
        return this._http.get(url, { params });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: IntegrationTenantService, deps: [{ token: i1.HttpClient }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: IntegrationTenantService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: IntegrationTenantService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: () => [{ type: i1.HttpClient }] });
//# sourceMappingURL=integration-tenant.service.js.map