import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../services';
import * as i0 from "@angular/core";
import * as i1 from "@angular/router";
import * as i2 from "../services";
export class RoleGuard {
    constructor(router, authService) {
        this.router = router;
        this.authService = authService;
    }
    /**
     * Asynchronously checks if the user has the expected role to activate a route.
     *
     * @param {ActivatedRouteSnapshot} route - The route to be activated.
     * @param {RouterStateSnapshot} state - The current router state.
     * @return {Promise<boolean>} A promise that resolves to true if the user has the expected role, false otherwise.
     */
    async canActivate(route, state) {
        const expectedRole = route.data['expectedRole'];
        const hasRole = await firstValueFrom(this.authService.hasRole(expectedRole));
        if (hasRole) {
            return true;
        }
        this.router.navigate(['/auth/login'], {
            queryParams: { returnUrl: state.url }
        });
        return false;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: RoleGuard, deps: [{ token: i1.Router }, { token: i2.AuthService }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: RoleGuard }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: RoleGuard, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: i1.Router }, { type: i2.AuthService }] });
//# sourceMappingURL=role.guard.js.map