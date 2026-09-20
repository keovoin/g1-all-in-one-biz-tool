import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService, AuthStrategy, ElectronService, Store } from '../services';
import { getCookie } from './cookie-helper';
import * as i0 from "@angular/core";
import * as i1 from "@angular/router";
import * as i2 from "../services";
export class AuthGuard {
    constructor(_router, _authService, _authStrategy, _store, _electronService) {
        this._router = _router;
        this._authService = _authService;
        this._authStrategy = _authStrategy;
        this._store = _store;
        this._electronService = _electronService;
    }
    /**
     * Checks if the user is authenticated before allowing navigation to a route.
     *
     * @param {ActivatedRouteSnapshot} route - The route to navigate to.
     * @param {RouterStateSnapshot} state - The current state of the router.
     * @return {Promise<boolean>} A promise that resolves to true if the user is authenticated, false otherwise.
     */
    async canActivate(route, state) {
        const token = route.queryParamMap.get('token') || getCookie('token');
        const userId = route.queryParamMap.get('userId') || getCookie('userId');
        const refreshToken = route.queryParamMap.get('refresh_token') || getCookie('refresh_token');
        // If token and userId exist, store them
        if (token && userId) {
            this._store.token = token;
            this._store.userId = userId;
            this._store.refresh_token = refreshToken;
        }
        // Validate the token before proceeding
        if (token && !this.validateToken(token)) {
            console.error('Invalid token, redirecting to login page...');
            await this.handleLogout(state.url); // Handle invalid token
            return false; // Prevent navigation
        }
        // Check if the user is authenticated
        if (await this._authService.isAuthenticated()) {
            return true; // Allow navigation
        }
        // Not authenticated, handle logout
        await this.handleLogout(state.url);
        return false;
    }
    /**
     * Handles the logout process and redirects to the login page.
     *
     * @param {string} returnUrl - The URL to return to after logging in.
     */
    async handleLogout(returnUrl) {
        if (this._electronService.isElectron) {
            try {
                this._electronService.ipcRenderer.send('logout');
            }
            catch (error) {
                console.error('Error sending logout message to Electron:', error);
            }
        }
        await firstValueFrom(this._authStrategy.logout());
        await this._router.navigate(['/auth/login'], { queryParams: { returnUrl } });
    }
    /**
     * Validates the format of a JWT token.
     *
     * @param {string} token - The JWT token to validate.
     * @returns {boolean} - Returns true if the token is valid, otherwise false.
     */
    validateToken(token) {
        return typeof token === 'string' && token.trim().length > 0 && token.split('.').length === 3;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: AuthGuard, deps: [{ token: i1.Router }, { token: i2.AuthService }, { token: i2.AuthStrategy }, { token: i2.Store }, { token: i2.ElectronService }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: AuthGuard }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: AuthGuard, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: i1.Router }, { type: i2.AuthService }, { type: i2.AuthStrategy }, { type: i2.Store }, { type: i2.ElectronService }] });
//# sourceMappingURL=auth.guard.js.map