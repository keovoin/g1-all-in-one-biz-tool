import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Store } from '../services';
import * as i0 from "@angular/core";
import * as i1 from "@angular/router";
import * as i2 from "../services";
export class InviteGuard {
    constructor(router, store) {
        this.router = router;
        this.store = store;
        this.hasPermission = false;
        this.organizationInvitesAllowed = false;
    }
    /**
     * Checks if the user has the required permissions and if invites are allowed for the selected organization.
     *
     * @param {ActivatedRouteSnapshot} route - The route snapshot containing the expected permissions.
     * @return {Promise<boolean>} Returns true if the user has the required permissions and invites are allowed, otherwise false.
     */
    async canActivate(route) {
        let hasPermission = false;
        const expectedPermissions = route.data['expectedPermissions'];
        // Retrieve user role permissions
        const userRolePermissions = await firstValueFrom(this.store.userRolePermissions$);
        if (userRolePermissions) {
            hasPermission = expectedPermissions.some((permission) => this.store.hasPermission(permission));
        }
        // Retrieve selected organization
        const organization = await firstValueFrom(this.store.selectedOrganization$);
        const organizationInvitesAllowed = organization ? organization.invitesAllowed : false;
        // Check conditions
        if (organizationInvitesAllowed && hasPermission) {
            return true;
        }
        // Redirect to home if conditions are not met
        await this.router.navigate(['/']);
        return hasPermission;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: InviteGuard, deps: [{ token: i1.Router }, { token: i2.Store }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: InviteGuard }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: InviteGuard, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: i1.Router }, { type: i2.Store }] });
//# sourceMappingURL=invite.guard.js.map