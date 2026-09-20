import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { API_PREFIX, toParams } from '@gauzy/ui-core/common';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
export class RolePermissionsService {
    constructor(http) {
        this.http = http;
    }
    /**
     * Retrieves role permissions based on the specified filter criteria.
     *
     * @param {IRolePermissionFindInput} [where] - An optional filter object used to specify the criteria for retrieving role permissions.
     * @returns {Promise<IPagination<IRolePermission>>} - Returns a promise that resolves to a pagination object containing the role permissions.
     */
    getRolePermissions(where) {
        return firstValueFrom(this.http.get(`${API_PREFIX}/role-permissions`, {
            params: toParams({ where })
        }));
    }
    /**
     * Creates a new role permission.
     *
     * @param input - The input data for creating the role permission.
     * @returns A promise that resolves to the created role permission.
     */
    create(input) {
        return firstValueFrom(this.http.post(`${API_PREFIX}/role-permissions`, input));
    }
    /**
     * Updates an existing role permission.
     *
     * @param id - The ID of the role permission to update.
     * @param input - The input data for updating the role permission.
     * @returns A promise that resolves to the updated role permission.
     */
    update(id, input) {
        return firstValueFrom(this.http.put(`${API_PREFIX}/role-permissions/${id}`, input));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: RolePermissionsService, deps: [{ token: i1.HttpClient }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: RolePermissionsService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: RolePermissionsService, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: i1.HttpClient }] });
//# sourceMappingURL=role-permissions.service.js.map