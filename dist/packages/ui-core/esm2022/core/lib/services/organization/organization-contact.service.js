import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { toParams } from '@gauzy/ui-core/common';
import { API_PREFIX } from '@gauzy/ui-core/common';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
export class OrganizationContactService {
    constructor(http) {
        this.http = http;
    }
    /**
     * Create organization contact
     *
     * @param input
     * @returns
     */
    create(input) {
        return firstValueFrom(this.http.post(`${API_PREFIX}/organization-contact`, input));
    }
    /**
     * Update organization contact
     *
     * @param id
     * @param input
     * @returns
     */
    update(id, input) {
        return firstValueFrom(this.http.put(`${API_PREFIX}/organization-contact/${id}`, input));
    }
    getAllByEmployee(id, where) {
        return firstValueFrom(this.http.get(`${API_PREFIX}/organization-contact/employee/${id}`, {
            params: toParams({ ...where })
        }));
    }
    getById(id, tenantId, relations) {
        const data = JSON.stringify({ relations, tenantId });
        return firstValueFrom(this.http.get(`${API_PREFIX}/organization-contact/${id}`, {
            params: { data }
        }));
    }
    getAll(relations, findInput) {
        const data = JSON.stringify({ relations, findInput });
        return firstValueFrom(this.http.get(`${API_PREFIX}/organization-contact`, {
            params: toParams({ data })
        }));
    }
    getByName(relations, findInput) {
        const data = JSON.stringify({ relations, findInput });
        return firstValueFrom(this.http.get(`${API_PREFIX}/organization-contact`, { params: { data } }));
    }
    updateByEmployee(updateInput) {
        return firstValueFrom(this.http.put(`${API_PREFIX}/organization-contact/employee`, updateInput));
    }
    delete(id) {
        return firstValueFrom(this.http.delete(`${API_PREFIX}/organization-contact/${id}`));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: OrganizationContactService, deps: [{ token: i1.HttpClient }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: OrganizationContactService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: OrganizationContactService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: () => [{ type: i1.HttpClient }] });
//# sourceMappingURL=organization-contact.service.js.map