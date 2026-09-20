import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService, AuthStrategy, ElectronService, Store } from '../services';
import * as i0 from "@angular/core";
export declare class AuthGuard {
    private readonly _router;
    private readonly _authService;
    private readonly _authStrategy;
    private readonly _store;
    private readonly _electronService;
    constructor(_router: Router, _authService: AuthService, _authStrategy: AuthStrategy, _store: Store, _electronService: ElectronService);
    /**
     * Checks if the user is authenticated before allowing navigation to a route.
     *
     * @param {ActivatedRouteSnapshot} route - The route to navigate to.
     * @param {RouterStateSnapshot} state - The current state of the router.
     * @return {Promise<boolean>} A promise that resolves to true if the user is authenticated, false otherwise.
     */
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean>;
    /**
     * Handles the logout process and redirects to the login page.
     *
     * @param {string} returnUrl - The URL to return to after logging in.
     */
    private handleLogout;
    /**
     * Validates the format of a JWT token.
     *
     * @param {string} token - The JWT token to validate.
     * @returns {boolean} - Returns true if the token is valid, otherwise false.
     */
    private validateToken;
    static ɵfac: i0.ɵɵFactoryDeclaration<AuthGuard, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<AuthGuard>;
}
