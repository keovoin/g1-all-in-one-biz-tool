import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService, Store } from '../services';
import * as i0 from "@angular/core";
/**
 * Use for routes which only need to be displayed if user is NOT logged in
 */
export declare class NoAuthGuard {
    private readonly _router;
    private readonly _authService;
    private readonly _store;
    constructor(_router: Router, _authService: AuthService, _store: Store);
    /**
     * Checks if the user is authenticated before allowing navigation to a route.
     *
     * @param {ActivatedRouteSnapshot} route - The route to navigate to.
     * @param {RouterStateSnapshot} state - The current state of the router.
     * @return {Promise<boolean>} A promise that resolves to true if the user is authenticated, false otherwise.
     */
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean>;
    static ɵfac: i0.ɵɵFactoryDeclaration<NoAuthGuard, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<NoAuthGuard>;
}
