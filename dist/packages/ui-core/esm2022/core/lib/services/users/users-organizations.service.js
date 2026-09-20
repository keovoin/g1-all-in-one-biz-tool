import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { API_PREFIX, toParams } from '@gauzy/ui-core/common';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
export class UsersOrganizationsService {
    constructor(http) {
        this.http = http;
    }
    /**
     * Count the number of user organizations based on the provided filter.
     *
     * @param where - Optional filter criteria for counting user organizations.
     * @returns A promise that resolves to the count of user organizations.
     */
    getCount(where) {
        return firstValueFrom(this.http.get(`${API_PREFIX}/user-organization/count`, { params: toParams(where) }));
    }
    /**
     * Retrieves user organizations based on specified relations, conditions, and employee inclusion.
     *
     * @param relations An array of relation names to be eager loaded.
     * @param where Optional conditions to filter user organizations.
     * @param includeEmployee Specifies whether to include employee information.
     * @returns A promise that resolves to a paginated result of user organizations.
     */
    getAll(relations = [], where, includeEmployee = false) {
        // Construct request parameters
        const params = { relations, where, includeEmployee };
        // Send HTTP GET request to retrieve user organizations
        return firstValueFrom(this.http.get(`${API_PREFIX}/user-organization`, {
            params: toParams(params)
        }));
    }
    /**
     * Set user as inactive in the organization.
     *
     * @param id - The ID of the user organization.
     * @returns A promise that resolves to the updated user organization.
     */
    setUserAsInactive(id) {
        return firstValueFrom(this.http.put(`${API_PREFIX}/user-organization/${id}`, {
            isActive: false
        }));
    }
    /**
     * Get the count of organizations a user belongs to.
     *
     * @param id - The user ID.
     * @returns A promise that resolves to the count of organizations.
     */
    getUserOrganizationCount(id) {
        return firstValueFrom(this.http.get(`${API_PREFIX}/user-organization/${id}/count`));
    }
    /**
     * Remove user from the organization.
     *
     * @param id - The ID of the user organization.
     * @returns A promise that resolves to the removed user organization.
     */
    removeUserFromOrg(id) {
        return firstValueFrom(this.http.delete(`${API_PREFIX}/user-organization/${id}`));
    }
    /**
     * Create a new user organization.
     *
     * @param input - The input data for creating a user organization.
     * @returns An observable that resolves to the created user organization.
     */
    create(input) {
        return this.http.post(`${API_PREFIX}/user-organization`, input);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: UsersOrganizationsService, deps: [{ token: i1.HttpClient }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: UsersOrganizationsService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: UsersOrganizationsService, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: i1.HttpClient }] });
//# sourceMappingURL=users-organizations.service.js.map