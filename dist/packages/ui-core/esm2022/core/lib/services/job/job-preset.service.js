import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { API_PREFIX, toParams } from '@gauzy/ui-core/common';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
export class JobPresetService {
    constructor(http) {
        this.http = http;
    }
    /**
     * Fetches a list of job presets.
     * @param request Optional parameter to filter the job presets.
     * @returns A promise that resolves to an array of job presets.
     */
    getJobPresets(request) {
        return firstValueFrom(this.http.get(`${API_PREFIX}/job-preset`, {
            params: request ? toParams(request) : {}
        }));
    }
    /**
     * Fetches a specific job preset by its ID.
     * @param id The ID of the job preset to fetch.
     * @param request Optional parameter to filter the job preset.
     * @returns A promise that resolves to the job preset.
     */
    getJobPreset(id, request) {
        return firstValueFrom(this.http.get(`${API_PREFIX}/job-preset/${id}`, {
            params: request ? toParams(request) : {}
        }));
    }
    /**
     * Fetches an employee's job preset.
     * @param request Optional parameter to filter the job preset.
     * @returns A promise that resolves to the job preset.
     */
    getEmployeePreset(request) {
        return firstValueFrom(this.http.get(`${API_PREFIX}/job-preset`, {
            params: request ? toParams(request) : {}
        }));
    }
    /**
     * Fetches matching criterions for a specific employee.
     * @param employeeId The ID of the employee whose criterions are to be fetched.
     * @param request Optional parameter to filter the criterions.
     * @returns A promise that resolves to an array of matching criterions.
     */
    getEmployeeCriterions(employeeId, request) {
        return firstValueFrom(this.http.get(`${API_PREFIX}/job-preset/employee/${employeeId}/criterion`, {
            params: request ? toParams(request) : {}
        }));
    }
    /**
     * Creates a new job preset.
     * @param request The job preset data to create.
     * @returns A promise that resolves to the created job preset.
     */
    createJobPreset(request) {
        return firstValueFrom(this.http.post(`${API_PREFIX}/job-preset`, request));
    }
    /**
     * Saves an employee's job preset.
     * @param input The data for the employee's job preset.
     * @returns A promise that resolves to an array of job presets.
     */
    saveEmployeePreset(input) {
        return firstValueFrom(this.http.post(`${API_PREFIX}/job-preset/employee`, input));
    }
    /**
     * Creates a new criterion for a job preset.
     * @param jobPresetId The ID of the job preset to add the criterion to.
     * @param criterion The criterion data to create.
     * @returns A promise that resolves to the created job preset.
     */
    createJobPresetCriterion(jobPresetId, criterion) {
        return firstValueFrom(this.http.post(`${API_PREFIX}/job-preset/${jobPresetId}/criterion`, criterion));
    }
    /**
     * Creates a new criterion for an employee.
     * @param employeeId The ID of the employee to add the criterion to.
     * @param criterion The criterion data to create.
     * @returns A promise that resolves to the created matching criterions.
     */
    createEmployeeCriterion(employeeId, criterion) {
        return firstValueFrom(this.http.post(`${API_PREFIX}/job-preset/employee/${employeeId}/criterion`, criterion));
    }
    /**
     * Deletes a criterion from a job preset.
     * @param criterionId The ID of the criterion to delete.
     * @returns A promise that resolves to the deleted job preset.
     */
    deleteJobPresetCriterion(criterionId) {
        return firstValueFrom(this.http.delete(`${API_PREFIX}/job-preset/criterion/${criterionId}`));
    }
    /**
     * Deletes a criterion from an employee's criterions.
     * @param employeeId The ID of the employee whose criterion is to be deleted.
     * @param criterionId The ID of the criterion to delete.
     * @returns A promise that resolves to the deleted matching criterions.
     */
    deleteEmployeeCriterion(employeeId, criterionId) {
        return firstValueFrom(this.http.delete(`${API_PREFIX}/job-preset/employee/${employeeId}/criterion/${criterionId}`));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: JobPresetService, deps: [{ token: i1.HttpClient }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: JobPresetService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: JobPresetService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: () => [{ type: i1.HttpClient }] });
//# sourceMappingURL=job-preset.service.js.map