import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_PREFIX, toParams } from '@gauzy/ui-core/common';
import { CrudService } from '../crud/crud.service';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
export class OrganizationTaskSettingService extends CrudService {
    static { this.API_URL = `${API_PREFIX}/organization-task-setting`; }
    constructor(http) {
        super(http, OrganizationTaskSettingService.API_URL);
    }
    /**
     * Retrieves organization task settings based on provided parameters.
     * @param params The parameters used to find the organization task setting.
     * @returns An Observable that emits the organization task setting.
     */
    getByOrganization(params) {
        return this.http.get(`${this.API_URL}/organization`, {
            params: toParams(params)
        });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: OrganizationTaskSettingService, deps: [{ token: i1.HttpClient }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: OrganizationTaskSettingService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: OrganizationTaskSettingService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: () => [{ type: i1.HttpClient }] });
//# sourceMappingURL=organization-task-setting.service.js.map