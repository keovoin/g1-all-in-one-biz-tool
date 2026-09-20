import { HttpClient } from '@angular/common/http';
import { ID, IEmployeePresetInput, IGetJobPresetInput, IJobPreset, IMatchingCriterions } from '@gauzy/contracts';
import * as i0 from "@angular/core";
export declare class JobPresetService {
    readonly http: HttpClient;
    constructor(http: HttpClient);
    /**
     * Fetches a list of job presets.
     * @param request Optional parameter to filter the job presets.
     * @returns A promise that resolves to an array of job presets.
     */
    getJobPresets(request?: IGetJobPresetInput): Promise<IJobPreset[]>;
    /**
     * Fetches a specific job preset by its ID.
     * @param id The ID of the job preset to fetch.
     * @param request Optional parameter to filter the job preset.
     * @returns A promise that resolves to the job preset.
     */
    getJobPreset(id: ID, request?: IGetJobPresetInput): Promise<IJobPreset>;
    /**
     * Fetches an employee's job preset.
     * @param request Optional parameter to filter the job preset.
     * @returns A promise that resolves to the job preset.
     */
    getEmployeePreset(request?: IGetJobPresetInput): Promise<IJobPreset>;
    /**
     * Fetches matching criterions for a specific employee.
     * @param employeeId The ID of the employee whose criterions are to be fetched.
     * @param request Optional parameter to filter the criterions.
     * @returns A promise that resolves to an array of matching criterions.
     */
    getEmployeeCriterions(employeeId: ID, request?: IGetJobPresetInput): Promise<IMatchingCriterions[]>;
    /**
     * Creates a new job preset.
     * @param request The job preset data to create.
     * @returns A promise that resolves to the created job preset.
     */
    createJobPreset(request?: IJobPreset): Promise<IJobPreset>;
    /**
     * Saves an employee's job preset.
     * @param input The data for the employee's job preset.
     * @returns A promise that resolves to an array of job presets.
     */
    saveEmployeePreset(input: IEmployeePresetInput): Promise<IJobPreset[]>;
    /**
     * Creates a new criterion for a job preset.
     * @param jobPresetId The ID of the job preset to add the criterion to.
     * @param criterion The criterion data to create.
     * @returns A promise that resolves to the created job preset.
     */
    createJobPresetCriterion(jobPresetId: ID, criterion: IMatchingCriterions): Promise<IJobPreset>;
    /**
     * Creates a new criterion for an employee.
     * @param employeeId The ID of the employee to add the criterion to.
     * @param criterion The criterion data to create.
     * @returns A promise that resolves to the created matching criterions.
     */
    createEmployeeCriterion(employeeId: ID, criterion: IMatchingCriterions): Promise<IMatchingCriterions>;
    /**
     * Deletes a criterion from a job preset.
     * @param criterionId The ID of the criterion to delete.
     * @returns A promise that resolves to the deleted job preset.
     */
    deleteJobPresetCriterion(criterionId: ID): Promise<IJobPreset>;
    /**
     * Deletes a criterion from an employee's criterions.
     * @param employeeId The ID of the employee whose criterion is to be deleted.
     * @param criterionId The ID of the criterion to delete.
     * @returns A promise that resolves to the deleted matching criterions.
     */
    deleteEmployeeCriterion(employeeId: ID, criterionId: ID): Promise<IMatchingCriterions>;
    static ɵfac: i0.ɵɵFactoryDeclaration<JobPresetService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<JobPresetService>;
}
