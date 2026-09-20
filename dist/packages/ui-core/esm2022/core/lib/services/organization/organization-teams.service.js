import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, firstValueFrom, of } from 'rxjs';
import { API_PREFIX, toParams } from '@gauzy/ui-core/common';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
export class OrganizationTeamsService {
    constructor(http) {
        this.http = http;
    }
    // TODO: Implement logic to proceed the following requests:
    // 1) Get all employees of selected Organization and put in in the select as options;
    // 2) Create a team with name and members (employees involved);
    // 3) Edit team- similar with create;
    // 4) Delete a team
    // 5) Display all teams: show team name and members - avatar + full name for each member;
    /**
     * Creates a new organization team.
     *
     * @param input - The input data for creating the team.
     * @returns A promise that resolves to the created organization team.
     */
    create(input) {
        return firstValueFrom(this.http.post(`${API_PREFIX}/organization-team`, input));
    }
    /**
     * Retrieves all organization teams, optionally filtered and related.
     *
     * @param relations - An array of relations to include in the response.
     * @param where - Optional filter criteria for retrieving teams.
     * @returns A promise that resolves to a paginated list of organization teams.
     */
    getAll(relations = [], where) {
        return firstValueFrom(this.http.get(`${API_PREFIX}/organization-team`, {
            params: toParams({ where, relations })
        }));
    }
    /**
     * Updates an existing organization team.
     *
     * @param id - The ID of the team to update.
     * @param input - The input data for updating the team.
     * @returns A promise that resolves to the updated organization team or a response.
     */
    update(id, input) {
        return firstValueFrom(this.http.put(`${API_PREFIX}/organization-team/${id}`, input));
    }
    /**
     * Deletes an organization team by ID.
     *
     * @param id - The ID of the team to delete.
     * @param params - Additional parameters for the delete request.
     * @returns A promise that resolves to the deleted organization team or an error response.
     */
    delete(id, params) {
        return firstValueFrom(this.http.delete(`${API_PREFIX}/organization-team/${id}`, {
            params: toParams(params)
        }));
    }
    /**
     * Gets the count of organization teams based on the provided filter.
     *
     * @param params - The filter criteria for counting teams.
     * @returns A promise that resolves to the number of organization teams.
     */
    getCount(params) {
        return firstValueFrom(this.http.get(`${API_PREFIX}/organization-team/count`, {
            params: toParams({ ...params })
        }));
    }
    /**
     * Fetches the teams associated with the authenticated user.
     *
     * @param where - Optional filter criteria for fetching teams.
     * @param relations - Optional list of relations to include in the response.
     * @returns A promise that resolves to a paginated list of organization teams.
     */
    getMyTeams(where, relations = []) {
        return firstValueFrom(this.http
            .get(`${API_PREFIX}/organization-team/me`, {
            params: toParams({ where, relations })
        })
            .pipe(catchError((error) => {
            console.error('Error fetching teams:', error);
            return of({ total: 0, items: [] });
        })));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: OrganizationTeamsService, deps: [{ token: i1.HttpClient }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: OrganizationTeamsService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: OrganizationTeamsService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: () => [{ type: i1.HttpClient }] });
//# sourceMappingURL=organization-teams.service.js.map