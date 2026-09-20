import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { API_PREFIX } from '@gauzy/ui-core/common';
import { Router } from '@angular/router';
import { Store } from '../store/store.service';
import { PermissionsService } from '../permission/permissions.service';
import { UsersService } from '../users';
import { AuthStrategy } from '../auth/auth-strategy.service';
import * as i0 from "@angular/core";
import * as i1 from "@angular/router";
import * as i2 from "../store/store.service";
import * as i3 from "../users";
import * as i4 from "../auth/auth-strategy.service";
import * as i5 from "../permission/permissions.service";
import * as i6 from "@angular/common/http";
export class AppInitService {
    constructor(_router, _store, _usersService, _authStrategy, _permissionsService, _http) {
        this._router = _router;
        this._store = _store;
        this._usersService = _usersService;
        this._authStrategy = _authStrategy;
        this._permissionsService = _permissionsService;
        this._http = _http;
    }
    async init() {
        try {
            const id = this._store.userId;
            if (id) {
                const relations = [
                    'role',
                    'tenant',
                    'tenant.featureOrganizations',
                    'tenant.featureOrganizations.feature'
                ];
                this.user = await this._usersService.getMe(relations, true);
                // Electron authentication
                this._authStrategy.electronAuthentication({
                    user: this.user,
                    token: this._store.token,
                    refresh_token: this._store.refresh_token
                });
                //When a new user registers & logs in for the first time, he/she does not have tenantId.
                //In this case, we have to redirect the user to the onboarding page to create their first organization, tenant, role.
                if (!this.user?.tenantId) {
                    this._router.navigate(['/onboarding/tenant']);
                    return;
                }
                this._store.user = this.user;
                //Load permissions
                this._permissionsService.loadPermissions();
                //tenant enabled/disabled features for relatives organizations
                const { tenant } = this.user;
                this._store.featureTenant = tenant.featureOrganizations.filter((item) => !item.organizationId);
                // Whether this deployment does billing at all, resolved once here rather than by whatever
                // happens to need it. The sidebar reads it to decide whether a Billing entry exists at all:
                // a self-hosted install has no Stripe key, so offering a menu item that leads only to a
                // "not configured" card would be a visible change to people who never asked for billing.
                await this.loadBillingAvailability();
            }
        }
        catch (error) {
            console.log('Error on init', error);
        }
    }
    /**
     * Ask the API whether billing exists here, and remember the answer.
     *
     * Deliberately swallows every failure and leaves the flag false. An older API has no such route,
     * and a deployment that cannot answer is one that should not be showing billing UI anyway — so the
     * safe default and the failure default are the same value.
     */
    async loadBillingAvailability() {
        try {
            const config = await firstValueFrom(this._http.get(`${API_PREFIX}/billing/config`));
            this._store.billingEnabled = Boolean(config?.enabled);
        }
        catch {
            this._store.billingEnabled = false;
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: AppInitService, deps: [{ token: i1.Router }, { token: i2.Store }, { token: i3.UsersService }, { token: i4.AuthStrategy }, { token: i5.PermissionsService }, { token: i6.HttpClient }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: AppInitService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: AppInitService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: () => [{ type: i1.Router }, { type: i2.Store }, { type: i3.UsersService }, { type: i4.AuthStrategy }, { type: i5.PermissionsService }, { type: i6.HttpClient }] });
//# sourceMappingURL=app-init-service.js.map