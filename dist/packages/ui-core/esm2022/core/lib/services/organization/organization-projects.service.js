import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, take } from 'rxjs';
import { toParams } from '@gauzy/ui-core/common';
import { API_PREFIX } from '@gauzy/ui-core/common';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
export class OrganizationProjectsService {
    constructor(_http) {
        this._http = _http;
        this.API_URL = `${API_PREFIX}/organization-projects`;
    }
    /**
     * Creates a new organization project.
     *
     * @param input The input data for creating the project.
     * @returns A Promise that resolves with the newly created project.
     */
    create(input) {
        return firstValueFrom(this._http.post(this.API_URL, input));
    }
    /**
     * Checks if a specific employee is a manager of a given project.
     *
     * This method makes a GET request to the backend to verify if the employee is part of the project
     * and if they hold the 'manager' role within the project team.
     *
     * @param projectId - The ID of the project to check.
     * @param employeeId - The ID of the employee to verify.
     * @returns An observable that resolves to a boolean indicating if the employee is a manager of the project.
     *          Returns `true` if the employee is a manager, otherwise `false`.
     */
    isManagerOfProject(projectId, employeeId) {
        return this._http.get(`${this.API_URL}/${projectId}/is-manager/${employeeId}`);
    }
    /**
     * Edits an existing organization project.
     *
     * @param input The input data for updating the project. Partial data is accepted.
     * @returns A Promise that resolves with the updated project.
     */
    edit(input) {
        return firstValueFrom(this._http.put(`${this.API_URL}/${input.id}`, input));
    }
    /**
     * Retrieves all projects assigned to a specific employee.
     *
     * @param id The employee ID.
     * @param where Optional filters to apply when retrieving projects.
     * @returns A Promise that resolves with a list of organization projects assigned to the employee.
     */
    getAllByEmployee(id, where) {
        return firstValueFrom(this._http.get(`${this.API_URL}/employee/${id}`, {
            params: toParams({ ...where })
        }));
    }
    /**
     * Retrieves all organization projects, with optional relations and filters.
     *
     * @param relations Optional array of related entities to include.
     * @param where Optional filters to apply when retrieving projects.
     * @returns A Promise that resolves with paginated organization projects.
     */
    getAll(relations = [], where) {
        return firstValueFrom(this._http.get(`${this.API_URL}`, {
            params: toParams({ where, relations })
        }));
    }
    /**
     * Retrieves a specific organization project by its ID.
     *
     * @param id The ID of the project.
     * @param relations Optional array of related entities to include.
     * @returns An Observable that resolves with the requested project.
     */
    getById(id, relations = []) {
        return this._http.get(`${this.API_URL}/${id}`, {
            params: toParams({ relations })
        });
    }
    /**
     * Retrieves the total count of organization projects that match the given criteria.
     *
     * @param request The input criteria for finding the projects.
     * @returns A Promise that resolves with the count of matching projects.
     */
    getCount(request) {
        return firstValueFrom(this._http.get(`${this.API_URL}/count`, {
            params: toParams({ ...request })
        }));
    }
    /**
     * Updates project assignments for an employee.
     *
     * @param updateInput The input data containing employee and project information.
     * @returns A Promise that resolves once the update operation is complete.
     */
    updateByEmployee(updateInput) {
        return firstValueFrom(this._http.put(`${this.API_URL}/employee`, updateInput));
    }
    /**
     * Updates the task view mode for a specific project.
     *
     * @param id The ID of the project.
     * @param input The input data for updating the task view mode.
     * @returns A Promise that resolves with the updated project.
     */
    updateTaskViewMode(id, input) {
        return firstValueFrom(this._http.put(`${this.API_URL}/task-view/${id}`, input).pipe(take(1)));
    }
    /**
     * Deletes an organization project by its ID.
     *
     * @param id The ID of the project to delete.
     * @returns A Promise that resolves once the project is deleted.
     */
    delete(id) {
        return firstValueFrom(this._http.delete(`${this.API_URL}/${id}`));
    }
    /**
     * Updates the settings for an organization project.
     *
     * @param id - The unique identifier (ID) of the organization project to update.
     * @param input - The updated project settings to apply.
     *
     * @returns An Observable of type `IOrganizationProject` representing the updated organization project.
     */
    updateProjectSetting(id, input) {
        // Construct the URL for the API endpoint
        const url = `${this.API_URL}/setting/${id}`;
        // Send an HTTP Put request to the specified URL with input parameters
        return this._http.put(url, input);
    }
    /**
     * Retrieve a list of synchronized organization projects with Github Repositories.
     *
     * @param where - Criteria for filtering projects.
     * @param relations - An array of related entities to include in the response (optional).
     * @returns An observable containing the paginated list of synchronized organization projects.
     */
    findSyncedProjects(where, relations = []) {
        // Construct the URL for the API endpoint
        const url = `${this.API_URL}/synced`;
        // Send an HTTP GET request to the specified URL with query parameters
        return this._http.get(url, {
            params: toParams({ where, relations })
        });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: OrganizationProjectsService, deps: [{ token: i1.HttpClient }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: OrganizationProjectsService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: OrganizationProjectsService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: () => [{ type: i1.HttpClient }] });
//# sourceMappingURL=organization-projects.service.js.map