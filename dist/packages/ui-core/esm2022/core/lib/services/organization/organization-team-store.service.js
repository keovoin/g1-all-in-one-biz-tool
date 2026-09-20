import { __decorate, __metadata } from "tslib";
import { Injectable } from '@angular/core';
import { Query, Store as AkitaStore, StoreConfig } from '@datorama/akita';
import * as i0 from "@angular/core";
let OrganizationTeamAkitaStore = class OrganizationTeamAkitaStore extends AkitaStore {
    constructor() {
        super({});
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: OrganizationTeamAkitaStore, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: OrganizationTeamAkitaStore, providedIn: 'root' }); }
};
OrganizationTeamAkitaStore = __decorate([
    StoreConfig({ name: 'team', resettable: true }),
    __metadata("design:paramtypes", [])
], OrganizationTeamAkitaStore);
export { OrganizationTeamAkitaStore };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: OrganizationTeamAkitaStore, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: () => [] });
export class OrganizationTeamAkitaQuery extends Query {
    constructor(store) {
        super(store);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: OrganizationTeamAkitaQuery, deps: [{ token: OrganizationTeamAkitaStore }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: OrganizationTeamAkitaQuery, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: OrganizationTeamAkitaQuery, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: () => [{ type: OrganizationTeamAkitaStore }] });
/**
 * Service used to update organization Team
 */
export class OrganizationTeamStore {
    constructor(organizationTeamAkitaStore, OrganizationTeamAkitaQuery) {
        this.organizationTeamAkitaStore = organizationTeamAkitaStore;
        this.OrganizationTeamAkitaQuery = OrganizationTeamAkitaQuery;
        this.organizationTeamAction$ = this.OrganizationTeamAkitaQuery.select(({ team, action }) => {
            return { team, action };
        });
    }
    set organizationTeamAction({ team, action }) {
        this.organizationTeamAkitaStore.update({
            team,
            action
        });
    }
    destroy() {
        this.organizationTeamAkitaStore.reset();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: OrganizationTeamStore, deps: [{ token: OrganizationTeamAkitaStore }, { token: OrganizationTeamAkitaQuery }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: OrganizationTeamStore, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: OrganizationTeamStore, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: () => [{ type: OrganizationTeamAkitaStore }, { type: OrganizationTeamAkitaQuery }] });
//# sourceMappingURL=organization-team-store.service.js.map