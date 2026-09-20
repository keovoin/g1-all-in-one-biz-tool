import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { API_PREFIX, toParams } from '@gauzy/ui-core/common';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
export class OrganizationsService {
    constructor(http) {
        this.http = http;
    }
    create(body) {
        return firstValueFrom(this.http.post(`${API_PREFIX}/organization`, body));
    }
    update(id, body) {
        return firstValueFrom(this.http.put(`${API_PREFIX}/organization/${id}`, body));
    }
    delete(id) {
        return firstValueFrom(this.http.delete(`${API_PREFIX}/organization/${id}`));
    }
    getAll(where, relations = []) {
        return firstValueFrom(this.http.get(`${API_PREFIX}/organization`, {
            params: toParams({ where, relations })
        }));
    }
    getById(id, relations = [], select = {}) {
        return this.http.get(`${API_PREFIX}/organization/${id}`, {
            params: toParams({ relations, select })
        });
    }
    /**
     * GET organization by profile link
     *
     * @param profile_link
     * @returns
     */
    getByProfileLink(profile_link, organizationId, relations = []) {
        return this.http.get(`${API_PREFIX}/public/organization/${profile_link}/${organizationId}`, {
            params: toParams({ relations })
        });
    }
    /**
     * GET public clients by organization
     *
     * @param params
     * @returns
     */
    getAllPublicClients(params) {
        return this.http.get(`${API_PREFIX}/public/organization/client`, {
            params: toParams(params)
        });
    }
    /**
     * GET public client counts by organization
     *
     * @param params
     * @returns
     */
    getAllPublicClientCounts(params) {
        return this.http.get(`${API_PREFIX}/public/organization/client/count`, {
            params: toParams(params)
        });
    }
    /**
     * GET public project counts by organization
     *
     * @param params
     * @returns
     */
    getAllPublicProjectCounts(params) {
        return this.http.get(`${API_PREFIX}/public/organization/project/count`, {
            params: toParams(params)
        });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: OrganizationsService, deps: [{ token: i1.HttpClient }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: OrganizationsService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: OrganizationsService, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: i1.HttpClient }] });
//# sourceMappingURL=organizations.service.js.map