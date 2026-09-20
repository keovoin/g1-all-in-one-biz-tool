// src/app/permissions.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgxPermissionsService } from 'ngx-permissions';
import { firstValueFrom } from 'rxjs';
import { API_PREFIX } from '@gauzy/ui-core/common';
import { Store } from '../store/store.service';
import { ErrorHandlingService } from '../notification/error-handling.service';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
import * as i2 from "ngx-permissions";
import * as i3 from "../store/store.service";
import * as i4 from "../notification/error-handling.service";
export class PermissionsService {
    constructor(_http, _ngxPermissionsService, _store, _errorHandlingService) {
        this._http = _http;
        this._ngxPermissionsService = _ngxPermissionsService;
        this._store = _store;
        this._errorHandlingService = _errorHandlingService;
    }
    /**
     * Loads the permissions asynchronously and updates the user's role permissions in the store.
     *
     * @return {Promise<void>} A promise that resolves when the permissions are loaded.
     */
    async loadPermissions() {
        if (!this._store.userId)
            return;
        try {
            // Fetch role permissions and update the store
            const rolePermissions = await this.getPermissions();
            this._store.userRolePermissions = rolePermissions;
            // Extract and load permissions into the permissions service
            const permissions = rolePermissions.map(({ permission }) => permission);
            this._ngxPermissionsService.flushPermissions();
            this._ngxPermissionsService.loadPermissions(permissions);
        }
        catch (error) {
            console.log('Error while loading permissions:', error);
            this._errorHandlingService.handleError(error);
        }
    }
    /**
     * Retrieves the permissions for the current user.
     *
     * @return {Promise<IRolePermissions>} A promise that resolves to the pagination of the role permissions.
     */
    async getPermissions() {
        return firstValueFrom(this._http.get(`${API_PREFIX}/role-permissions/me`));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: PermissionsService, deps: [{ token: i1.HttpClient }, { token: i2.NgxPermissionsService }, { token: i3.Store }, { token: i4.ErrorHandlingService }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: PermissionsService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: PermissionsService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: () => [{ type: i1.HttpClient }, { type: i2.NgxPermissionsService }, { type: i3.Store }, { type: i4.ErrorHandlingService }] });
//# sourceMappingURL=permissions.service.js.map