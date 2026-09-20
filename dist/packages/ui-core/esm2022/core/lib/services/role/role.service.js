import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { API_PREFIX, toParams } from '@gauzy/ui-core/common';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
export class RoleService {
    constructor(http) {
        this.http = http;
    }
    getRoleByOptions(options) {
        return this.http.get(`${API_PREFIX}/roles/options`, {
            params: toParams({ ...options })
        });
    }
    getAll() {
        return firstValueFrom(this.http.get(`${API_PREFIX}/roles`));
    }
    create(role) {
        return this.http.post(`${API_PREFIX}/roles`, {
            ...role
        });
    }
    delete(role) {
        return this.http.delete(`${API_PREFIX}/roles/${role.id}`);
    }
    getRoleById(roleId) {
        return firstValueFrom(this.http.get(`${API_PREFIX}/roles/${roleId}`));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: RoleService, deps: [{ token: i1.HttpClient }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: RoleService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: RoleService, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: i1.HttpClient }] });
//# sourceMappingURL=role.service.js.map