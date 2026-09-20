// src/app/permissions.guard.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { AuthService } from '../services';
import * as i0 from "@angular/core";
import * as i1 from "../services";
import * as i2 from "@angular/router";
export class PermissionsGuard {
    constructor(_authService, _router) {
        this._authService = _authService;
        this._router = _router;
    }
    /**
     * Asynchronously checks if the user is allowed to activate the route.
     *
     * @param {ActivatedRouteSnapshot} route - The route being navigated to.
     * @param {RouterStateSnapshot} state - The current state of the router.
     * @return {Observable<boolean>} A promise that resolves to a boolean indicating whether the user is allowed to activate the route.
     */
    canActivate(route, state) {
        return this._hasPermissions(route, state);
    }
    /**
     * Checks if the user is allowed to activate the child routes.
     *
     * @param {ActivatedRouteSnapshot} childRoute - The child route being navigated to.
     * @param {RouterStateSnapshot} state - The current state of the router.
     * @return {Observable<boolean>} An observable that resolves to a boolean indicating whether the user is allowed to activate the child routes.
     */
    canActivateChild(childRoute, state) {
        return this._hasPermissions(childRoute, state);
    }
    /**
     * Helper method to check permissions.
     *
     * @param {ActivatedRouteSnapshot} route - The route being navigated to.
     * @param {RouterStateSnapshot} state - The current state of the router.
     * @return {Observable<boolean>} An observable that resolves to a boolean indicating whether the user is allowed to activate the route.
     */
    _hasPermissions(route, state) {
        const permissions = route.data['permissions'];
        // No permissions required, allow access
        if (!permissions || (permissions.only && permissions.only.length === 0)) {
            return of(true);
        }
        // Retrieve required permissions from route
        const requiredPermissions = this.getRequiredPermissions(permissions, route);
        // Check if required permissions are valid
        if (!requiredPermissions) {
            return of(false); // Block access if permissions aren't valid
        }
        // Determine redirect path
        const redirectTo = this.getRedirectPath(permissions, route, state);
        // Check if the user has the necessary permissions
        return this._authService.hasPermissions(...requiredPermissions).pipe(map((hasPermission) => {
            if (hasPermission) {
                return true;
            }
            this._router.navigate([redirectTo]);
            return false;
        }), catchError(() => {
            this._router.navigate([redirectTo]);
            return of(false);
        }));
    }
    /**
     * Retrieve the required permissions from the route.
     *
     * @param {any} permissions - The permissions object from the route.
     * @param {ActivatedRouteSnapshot} route - The current route.
     * @returns {PermissionsEnum[] | null} - An array of required permissions or null if invalid.
     */
    getRequiredPermissions(permissions, route) {
        let requiredPermissions = null;
        // Check if permissions.only is a function
        if (typeof permissions.only === 'function') {
            requiredPermissions = permissions.only(route) || [];
        }
        else {
            requiredPermissions = permissions.only || [];
        }
        // Ensure it's an array
        if (!Array.isArray(requiredPermissions)) {
            console.error('Expected permissions.only to be an array but received:', requiredPermissions);
            return null; // Block access if permissions aren't valid
        }
        return requiredPermissions;
    }
    /**
     * Determine the redirect path based on permissions configuration.
     *
     * @param {any} permissions - The permissions object from the route.
     * @param {ActivatedRouteSnapshot} route - The current route.
     * @param {RouterStateSnapshot} state - The current state of the router.
     * @returns {string} - The redirect path or the default redirection path.
     */
    getRedirectPath(permissions, route, state) {
        const defaultRedirectTo = '/pages/dashboard'; // Default redirection path
        // Check if redirectTo is a function and call it
        if (typeof permissions.redirectTo === 'function') {
            return permissions.redirectTo(route, state) || defaultRedirectTo; // Fallback to default
        }
        // Return the specified redirectTo or the default
        return permissions.redirectTo || defaultRedirectTo;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: PermissionsGuard, deps: [{ token: i1.AuthService }, { token: i2.Router }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: PermissionsGuard, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: PermissionsGuard, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: () => [{ type: i1.AuthService }, { type: i2.Router }] });
//# sourceMappingURL=permission.guard.js.map