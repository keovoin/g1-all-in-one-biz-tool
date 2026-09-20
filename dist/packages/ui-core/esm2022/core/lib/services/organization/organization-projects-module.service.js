import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, throwError } from 'rxjs';
import { API_PREFIX, toParams } from '@gauzy/ui-core/common';
import { catchError } from 'rxjs/operators';
import { CrudService } from '../crud';
import { ToastrService } from '../notification';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
import * as i2 from "../notification";
export class OrganizationProjectModuleService extends CrudService {
    static { this.API_URL = `${API_PREFIX}/organization-project-modules`; }
    constructor(http, toastrService) {
        super(http, OrganizationProjectModuleService.API_URL);
        this.toastrService = toastrService;
        /**
         * BehaviorSubject to notify components when project modules are updated.
         * This ensures that all components displaying modules stay synchronized.
         */
        this.moduleUpdatedSubject = new BehaviorSubject(null);
        /**
         * Observable that components can subscribe to for module update notifications.
         */
        this.moduleUpdated$ = this.moduleUpdatedSubject.asObservable();
    }
    /**
     * Notifies subscribers that a module update has occurred.
     */
    notifyModuleUpdated() {
        this.moduleUpdatedSubject.next();
    }
    getAllModulesByProjectId(where, relations = []) {
        return this.http
            .get(this.API_URL, {
            params: toParams({ relations, where })
        })
            .pipe(catchError((error) => this.errorHandler(error)));
    }
    /**
     * Find project modules for an employee based on pagination parameters.
     * @param params - The pagination parameters for filtering employee project modules.
     * @returns An Observable that emits the paginated list of employee project modules.
     */
    getEmployeeProjectModules(params) {
        return this.http
            .get(`${this.API_URL}/employee`, { params })
            .pipe(catchError((error) => this.errorHandler(error)));
    }
    /**
     * Retrieve project modules associated with a team using pagination parameters.
     * @param params - The pagination parameters for filtering team project modules.
     * @returns An Observable that emits the paginated list of team project modules.
     */
    findTeamProjectModules(params) {
        return this.http
            .get(`${this.API_URL}/team`, { params })
            .pipe(catchError((error) => this.errorHandler(error)));
    }
    /**
     * Retrieve project modules associated with a specific employee.
     * @param employeeId - The unique identifier of the employee.
     * @param params - Additional query parameters for filtering.
     * @returns An Observable that emits the paginated list of project modules for the specified employee.
     */
    findByEmployee(employeeId, params) {
        return this.http
            .get(`${this.API_URL}/employee/${employeeId}`, { params })
            .pipe(catchError((error) => this.errorHandler(error)));
    }
    /**
     * Find a specific project module by its unique identifier.
     * @param id - The unique identifier of the project module.
     * @param params - Additional query parameters if required.
     * @returns An Observable that emits the found project module.
     */
    findById(id, params) {
        return this.http
            .get(`${this.API_URL}/${id}`, { params })
            .pipe(catchError((error) => this.errorHandler(error)));
    }
    errorHandler(error) {
        this.toastrService.danger(error.message, error.message);
        return throwError(error.message);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: OrganizationProjectModuleService, deps: [{ token: i1.HttpClient }, { token: i2.ToastrService }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: OrganizationProjectModuleService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: OrganizationProjectModuleService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: () => [{ type: i1.HttpClient }, { type: i2.ToastrService }] });
//# sourceMappingURL=organization-projects-module.service.js.map