import { ID, IGetJobPresetCriterionInput } from '@gauzy/contracts';
import { GauzyAIService } from '@gauzy/plugin-integration-ai';
import { EmployeeService } from '@gauzy/core';
import { JobPresetService } from './job-preset.service';
import { JobPreset } from './job-preset.entity';
import { JobPresetUpworkJobSearchCriterion } from './job-preset-upwork-job-search-criterion.entity';
import { CreateJobPresetDTO, JobPresetQueryDTO, SaveJobPresetCriterionDTO } from './dto';
export declare class JobSearchPresetController {
    private readonly jobPresetService;
    private readonly employeeService;
    private readonly gauzyAIService;
    constructor(jobPresetService: JobPresetService, employeeService: EmployeeService, gauzyAIService: GauzyAIService);
    /**
     * Retrieves all employee job presets.
     *
     * @param input The query parameters for filtering job presets.
     * @returns A Promise that resolves to the retrieved job presets.
     */
    getAll(input: JobPresetQueryDTO): Promise<any>;
    /**
     * Retrieves an employee job preset by its ID.
     *
     * @param presetId The ID of the job preset to retrieve.
     * @param request The query parameters for filtering job presets.
     * @returns A Promise that resolves to the retrieved job preset.
     */
    get(presetId: ID, request: IGetJobPresetCriterionInput): Promise<JobPreset>;
    /**
     * Retrieves job preset criteria for a specific job preset by its ID.
     *
     * @param presetId The ID of the job preset for which to retrieve criteria.
     * @returns A Promise that resolves to the job preset criteria.
     */
    getJobPresetCriterion(presetId: ID): Promise<JobPresetUpworkJobSearchCriterion[]>;
    /**
     * Creates a new job preset.
     *
     * @param request The job preset data.
     * @returns A Promise that resolves to the created job preset.
     */
    createJobPreset(request: CreateJobPresetDTO): Promise<any>;
    /**
     * Saves or updates job preset criteria for a specific job preset.
     *
     * @param jobPresetId The ID of the job preset.
     * @param request The criteria data to save or update.
     * @returns A Promise that resolves to the saved or updated job preset criteria.
     */
    saveUpdate(jobPresetId: ID, request: SaveJobPresetCriterionDTO): Promise<any>;
    /**
     * Deletes a job preset criterion by its ID.
     *
     * @param criterionId The ID of the job preset criterion to delete.
     * @returns A Promise that resolves to the deleted job preset criterion.
     */
    deleteJobPresetCriterion(criterionId: ID): Promise<import("typeorm").DeleteResult>;
}
