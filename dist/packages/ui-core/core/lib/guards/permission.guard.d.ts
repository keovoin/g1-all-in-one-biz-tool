import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services';
import * as i0 from "@angular/core";
export declare class PermissionsGuard {
    private readonly _authService;
    private readonly _router;
    constructor(_authService: AuthService, _router: Router);
    /**
     * Asynchronously checks if the user is allowed to activate the route.
     *
     * @param {ActivatedRouteSnapshot} route - The route being navigated to.
     * @param {RouterStateSnapshot} state - The current state of the router.
     * @return {Observable<boolean>} A promise that resolves to a boolean indicating whether the user is allowed to activate the route.
     */
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>;
    /**
     * Checks if the user is allowed to activate the child routes.
     *
     * @param {ActivatedRouteSnapshot} childRoute - The child route being navigated to.
     * @param {RouterStateSnapshot} state - The current state of the router.
     * @return {Observable<boolean>} An observable that resolves to a boolean indicating whether the user is allowed to activate the child routes.
     */
    canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>;
    /**
     * Helper method to check permissions.
     *
     * @param {ActivatedRouteSnapshot} route - The route being navigated to.
     * @param {RouterStateSnapshot} state - The current state of the router.
     * @return {Observable<boolean>} An observable that resolves to a boolean indicating whether the user is allowed to activate the route.
     */
    private _hasPermissions;
    /**
     * Retrieve the required permissions from the route.
     *
     * @param {any} permissions - The permissions object from the route.
     * @param {ActivatedRouteSnapshot} route - The current route.
     * @returns {PermissionsEnum[] | null} - An array of required permissions or null if invalid.
     */
    private getRequiredPermissions;
    /**
     * Determine the redirect path based on permissions configuration.
     *
     * @param {any} permissions - The permissions object from the route.
     * @param {ActivatedRouteSnapshot} route - The current route.
     * @param {RouterStateSnapshot} state - The current state of the router.
     * @returns {string} - The redirect path or the default redirection path.
     */
    private getRedirectPath;
    static ɵfac: i0.ɵɵFactoryDeclaration<PermissionsGuard, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<PermissionsGuard>;
}
