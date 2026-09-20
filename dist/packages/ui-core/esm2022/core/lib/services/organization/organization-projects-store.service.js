import { __decorate, __metadata } from "tslib";
import { Injectable } from '@angular/core';
import { Query, Store as AkitaStore, StoreConfig } from '@datorama/akita';
import * as i0 from "@angular/core";
let OrganizationProjectAkitaStore = class OrganizationProjectAkitaStore extends AkitaStore {
    constructor() {
        super({});
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: OrganizationProjectAkitaStore, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: OrganizationProjectAkitaStore, providedIn: 'root' }); }
};
OrganizationProjectAkitaStore = __decorate([
    StoreConfig({ name: 'project', resettable: true }),
    __metadata("design:paramtypes", [])
], OrganizationProjectAkitaStore);
export { OrganizationProjectAkitaStore };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: OrganizationProjectAkitaStore, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: () => [] });
export class OrganizationProjectAkitaQuery extends Query {
    constructor(store) {
        super(store);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: OrganizationProjectAkitaQuery, deps: [{ token: OrganizationProjectAkitaStore }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: OrganizationProjectAkitaQuery, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: OrganizationProjectAkitaQuery, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: () => [{ type: OrganizationProjectAkitaStore }] });
/**
 * Service used to update organization project
 */
export class OrganizationProjectStore {
    constructor(organizationProjectAkitaStore, organizationProjectAkitaQuery) {
        this.organizationProjectAkitaStore = organizationProjectAkitaStore;
        this.organizationProjectAkitaQuery = organizationProjectAkitaQuery;
        this.organizationProjectAction$ = this.organizationProjectAkitaQuery.select(({ project, action }) => {
            return { project, action };
        });
    }
    set organizationProjectAction({ project, action }) {
        this.organizationProjectAkitaStore.update({
            project,
            action
        });
    }
    destroy() {
        this.organizationProjectAkitaStore.reset();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: OrganizationProjectStore, deps: [{ token: OrganizationProjectAkitaStore }, { token: OrganizationProjectAkitaQuery }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: OrganizationProjectStore, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: OrganizationProjectStore, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: () => [{ type: OrganizationProjectAkitaStore }, { type: OrganizationProjectAkitaQuery }] });
//# sourceMappingURL=organization-projects-store.service.js.map