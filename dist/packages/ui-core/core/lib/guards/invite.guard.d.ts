import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { Store } from '../services';
import * as i0 from "@angular/core";
export declare class InviteGuard implements CanActivate {
    private readonly router;
    private readonly store;
    hasPermission: boolean;
    organizationInvitesAllowed: boolean;
    constructor(router: Router, store: Store);
    /**
     * Checks if the user has the required permissions and if invites are allowed for the selected organization.
     *
     * @param {ActivatedRouteSnapshot} route - The route snapshot containing the expected permissions.
     * @return {Promise<boolean>} Returns true if the user has the required permissions and invites are allowed, otherwise false.
     */
    canActivate(route: ActivatedRouteSnapshot): Promise<boolean>;
    static ɵfac: i0.ɵɵFactoryDeclaration<InviteGuard, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<InviteGuard>;
}
