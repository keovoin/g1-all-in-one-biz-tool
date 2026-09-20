import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { API_PREFIX, buildHttpParams } from '@gauzy/ui-core/common';
import * as i0 from "@angular/core";
export class UsersService {
    constructor() {
        this.http = inject(HttpClient);
    }
    /**
     * Retrieves the current user's details, optionally including specified relations and employee data.
     *
     * @param relations - An array of relation names to include in the response.
     * @param includeEmployee - Whether to include employee details.
     * @returns A promise that resolves to the IUser object.
     */
    async getMe(relations = [], includeEmployee = false) {
        const params = buildHttpParams({ relations, includeEmployee });
        return firstValueFrom(this.http.get(`${API_PREFIX}/user/me`, { params }));
    }
    /**
     * Retrieves a user by their email address.
     *
     * @param emailId - The email address of the user to retrieve.
     * @returns A Promise that resolves with the user information.
     */
    async getUserByEmail(emailId) {
        return await firstValueFrom(this.http.get(`${API_PREFIX}/user/email/${emailId}`));
    }
    /**
     * Retrieves a user by their unique ID, optionally including related entities.
     *
     * @param id - The unique identifier of the user to retrieve.
     * @param relations - (Optional) An array of related entity names to include in the result.
     * @returns A Promise that resolves with the user information.
     */
    async getUserById(id, relations) {
        const data = JSON.stringify({ relations });
        return await firstValueFrom(this.http.get(`${API_PREFIX}/user/${id}`, { params: { data } }));
    }
    /**
     * Updates the user information for a specific user ID.
     *
     * @param id - The unique identifier of the user to update.
     * @param input - An object containing the updated user details.
     * @returns A Promise that resolves with the server's response after updating the user.
     */
    async update(id, input) {
        return await firstValueFrom(this.http.put(`${API_PREFIX}/user/${id}`, input));
    }
    /**
     * Deletes a user by their ID.
     *
     * @param id - The unique identifier of the user to delete.
     * @param user - Additional user data or options (if required by the API) to be passed in the request.
     * @returns A Promise that resolves with the server's response after deleting the user.
     */
    async delete(id, user) {
        return await firstValueFrom(this.http.delete(`${API_PREFIX}/user/${id}`, { body: user }));
    }
    /**
     * Deletes all user-related data from the system.
     *
     * @returns A Promise that resolves once all user data has been successfully deleted.
     */
    async deleteAllData() {
        return await firstValueFrom(this.http.delete(`${API_PREFIX}/user/reset`));
    }
    /**
     * Updates the user's preferred language setting.
     *
     * @param input - An object containing the user update information, including the new preferred language.
     * @returns A Promise that resolves once the preferred language has been successfully updated.
     */
    async updatePreferredLanguage(input) {
        return await firstValueFrom(this.http.put(`${API_PREFIX}/user/preferred-language`, input));
    }
    /**
     * Updates the user's preferred component layout setting.
     *
     * @param input - An object containing the user update information, including the new preferred layout preference.
     * @returns A Promise that resolves once the preferred layout has been successfully updated.
     */
    async updatePreferredComponentLayout(input) {
        return await firstValueFrom(this.http.put(`${API_PREFIX}/user/preferred-layout`, input));
    }
    /**
     * Merges a per-feature patch into the current user's server-side UI preferences
     * (`PUT /user/ui-preferences`, shallow merge per top-level feature key).
     *
     * @param patch - Feature-keyed objects to replace, e.g. `{ aiChat: { expanded: true } }`.
     * @returns A Promise resolving to the merged preferences as now stored.
     */
    async updateUiPreferences(patch) {
        return await firstValueFrom(this.http.put(`${API_PREFIX}/user/ui-preferences`, patch));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: UsersService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: UsersService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: UsersService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }] });
//# sourceMappingURL=users.service.js.map