import { DeleteResult } from 'typeorm';
import { ID, IEmployeeUpworkJobsSearchCriterion, IGetMatchingCriterions, IJobPreset } from '@gauzy/contracts';
import { JobPresetService } from './job-preset.service';
import { SaveEmployeePresetDTO, SaveJobPresetCriterionDTO } from './dto';
export declare class EmployeePresetController {
    private readonly jobPresetService;
    constructor(jobPresetService: JobPresetService);
    /**
     * Retrieves the job preset for a specific employee.
     *
     * @param employeeId The ID of the employee.
     * @returns The job preset for the specified employee.
     */
    getEmployeePreset(employeeId: ID): Promise<IJobPreset[]>;
    /**
     * Retrieves all matching criteria for job presets of a specific employee.
     *
     * @param employeeId The ID of the employee.
     * @param request The request containing criteria for matching.
     * @returns The matching criteria for job presets of the specified employee.
     */
    getEmployeeCriterion(employeeId: ID, request: IGetMatchingCriterions): Promise<IEmployeeUpworkJobsSearchCriterion[]>;
    /**
     * Saves or updates matching criteria for job presets of a specific employee.
     *
     * @param employeeId The ID of the employee.
     * @param request The request containing criteria for matching.
     * @returns The saved or updated job presets for the specified employee.
     */
    saveUpdateEmployeeCriterion(employeeId: ID, request: SaveJobPresetCriterionDTO): Promise<IJobPreset[]>;
    /**
     * Saves an employee preset.
     *
     * @param request The request containing the employee preset data.
     * @returns The saved employee job preset.
     */
    saveEmployeePreset(request: SaveEmployeePresetDTO): Promise<IJobPreset[]>;
    /**
     * Deletes an employee job preset criterion.
     *
     * @param criterionId The ID of the criterion to delete.
     * @param employeeId The ID of the employee whose criterion to delete.
     * @returns The deleted employee job preset.
     */
    deleteEmployeeCriterion(criterionId: ID, employeeId: ID): Promise<DeleteResult>;
}
