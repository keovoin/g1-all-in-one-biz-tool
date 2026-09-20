import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTES } from '@gauzy/ui-core/common';
import { AuthService, Store } from '../services';
import * as i0 from "@angular/core";
import * as i1 from "@angular/router";
import * as i2 from "../services";
/**
 * Use for routes which only need to be displayed if user is NOT logged in
 */
export class NoAuthGuard {
    constructor(_router, _authService, _store) {
        this._router = _router;
        this._authService = _authService;
        this._store = _store;
    }
    /**
     * Checks if the user is authenticated before allowing navigation to a route.
     *
     * @param {ActivatedRouteSnapshot} route - The route to navigate to.
     * @param {RouterStateSnapshot} state - The current state of the router.
     * @return {Promise<boolean>} A promise that resolves to true if the user is authenticated, false otherwise.
     */
    async canActivate(route, state) {
        if (!this._store.token) {
            // not logged in so return true
            return true;
        }
        if (!(await this._authService.isAuthenticated())) {
            // not logged in so return true
            return true;
        }
        // logged in so redirect to dashboard
        this._router.navigate([ROUTES.DASHBOARD]);
        return false;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: NoAuthGuard, deps: [{ token: i1.Router }, { token: i2.AuthService }, { token: i2.Store }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: NoAuthGuard }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: NoAuthGuard, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: i1.Router }, { type: i2.AuthService }, { type: i2.Store }] });
//# sourceMappingURL=no-auth.guard.js.map