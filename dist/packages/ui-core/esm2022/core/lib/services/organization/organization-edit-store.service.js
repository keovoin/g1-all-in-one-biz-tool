import { __decorate, __metadata } from "tslib";
import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Query, Store as AkitaStore, StoreConfig } from '@datorama/akita';
import * as i0 from "@angular/core";
let OrganizationStore = class OrganizationStore extends AkitaStore {
    constructor() {
        super({});
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: OrganizationStore, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: OrganizationStore, providedIn: 'root' }); }
};
OrganizationStore = __decorate([
    StoreConfig({ name: 'organization', resettable: true }),
    __metadata("design:paramtypes", [])
], OrganizationStore);
export { OrganizationStore };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: OrganizationStore, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: () => [] });
export class OrganizationQuery extends Query {
    constructor(store) {
        super(store);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: OrganizationQuery, deps: [{ token: OrganizationStore }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: OrganizationQuery, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: OrganizationQuery, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: () => [{ type: OrganizationStore }] });
/**
 * Service used to update organization
 */
export class OrganizationEditStore {
    constructor(organizationStore, organizationQuery) {
        this.organizationStore = organizationStore;
        this.organizationQuery = organizationQuery;
        this.selectedOrganization$ = new BehaviorSubject(this.selectedOrganization);
        this.organizationForm$ = new BehaviorSubject(this.organizationForm);
        this.organizationAction$ = this.organizationQuery.select(({ organization, action }) => {
            return { organization, action };
        });
    }
    set selectedOrganization(organization) {
        this._selectedOrganization = organization;
        this.selectedOrganization$.next(organization);
    }
    get selectedOrganization() {
        return this._selectedOrganization;
    }
    set organizationForm(organization) {
        this._organizationForm = organization;
        this.organizationForm$.next(organization);
    }
    get organizationForm() {
        return this._organizationForm;
    }
    set organizationAction({ organization, action }) {
        this.organizationStore.update({
            organization,
            action
        });
    }
    /**
     * Update the organization form with new data
     *
     * @param formData - The form data to update.
     */
    async updateOrganizationForm(formData) {
        this.organizationForm = { ...this.organizationForm, ...formData };
    }
    destroy() {
        this.organizationStore.reset();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: OrganizationEditStore, deps: [{ token: OrganizationStore }, { token: OrganizationQuery }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: OrganizationEditStore, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: OrganizationEditStore, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: () => [{ type: OrganizationStore }, { type: OrganizationQuery }] });
//# sourceMappingURL=organization-edit-store.service.js.map