import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services';
import * as i0 from "@angular/core";
export declare class RoleGuard implements CanActivate {
    private readonly router;
    private readonly authService;
    constructor(router: Router, authService: AuthService);
    /**
     * Asynchronously checks if the user has the expected role to activate a route.
     *
     * @param {ActivatedRouteSnapshot} route - The route to be activated.
     * @param {RouterStateSnapshot} state - The current router state.
     * @return {Promise<boolean>} A promise that resolves to true if the user has the expected role, false otherwise.
     */
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean>;
    static ɵfac: i0.ɵɵFactoryDeclaration<RoleGuard, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<RoleGuard>;
}
