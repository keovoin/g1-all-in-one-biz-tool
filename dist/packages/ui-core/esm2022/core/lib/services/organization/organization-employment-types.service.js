import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { API_PREFIX } from '@gauzy/ui-core/common';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
export class OrganizationEmploymentTypesService {
    constructor(http) {
        this.http = http;
        this.API_URL = `${API_PREFIX}/organization-employment-type`;
    }
    getAllWithPagination(findInput, relations) {
        const data = JSON.stringify({ relations, findInput });
        return firstValueFrom(this.http.get(this.API_URL, {
            params: { data }
        }));
    }
    getAll(relations, findInput) {
        const data = JSON.stringify({ relations, findInput });
        return this.http.get(this.API_URL, {
            params: { data }
        });
    }
    addEmploymentType(employmentType) {
        return this.http.post(this.API_URL, employmentType);
    }
    deleteEmploymentType(id) {
        return firstValueFrom(this.http.delete(`${this.API_URL}/${id}`));
    }
    editEmploymentType(id, updateInput) {
        return firstValueFrom(this.http.put(`${API_PREFIX}/organization-employment-type/${id}`, updateInput));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: OrganizationEmploymentTypesService, deps: [{ token: i1.HttpClient }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: OrganizationEmploymentTypesService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: OrganizationEmploymentTypesService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: () => [{ type: i1.HttpClient }] });
//# sourceMappingURL=organization-employment-types.service.js.map