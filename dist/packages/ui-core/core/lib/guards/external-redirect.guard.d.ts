import { ActivatedRouteSnapshot } from '@angular/router';
import * as i0 from "@angular/core";
export declare class ExternalRedirectGuard {
    /**
     * Checks if navigation can proceed.
     *
     * @param route - The activated route snapshot containing route parameters.
     * @returns {boolean} - Returns false to prevent navigation to the route and true to allow navigation.
     */
    canActivate(route: ActivatedRouteSnapshot): boolean;
    static ɵfac: i0.ɵɵFactoryDeclaration<ExternalRedirectGuard, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ExternalRedirectGuard>;
}
