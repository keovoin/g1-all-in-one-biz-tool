import { CommandBus } from '@nestjs/cqrs';
import { DeleteResult } from 'typeorm';
import { ID, IEmployeePresetInput, IGetJobPresetCriterionInput, IGetJobPresetInput, IGetMatchingCriterions, IJobPreset, IMatchingCriterions } from '@gauzy/contracts';
import { TenantAwareCrudService, TypeOrmEmployeeRepository } from '@gauzy/core';
import { JobPreset } from './job-preset.entity';
import { TypeOrmJobPresetRepository } from './repository/type-orm-job-preset.repository';
import { MikroOrmJobPresetRepository } from './repository/mikro-orm-job-preset.repository';
import { TypeOrmJobPresetUpworkJobSearchCriterionRepository } from './repository/type-orm-job-preset-upwork-job-search-criterion.repository';
import { TypeOrmEmployeeUpworkJobsSearchCriterionRepository } from './repository/type-orm-employee-upwork-jobs-search-criterion.repository';
export declare class JobPresetService extends TenantAwareCrudService<JobPreset> {
    readonly typeOrmJobPresetRepository: TypeOrmJobPresetRepository;
    readonly mikroOrmJobPresetRepository: MikroOrmJobPresetRepository;
    private readonly typeOrmJobPresetUpworkJobSearchCriterionRepository;
    private readonly typeOrmEmployeeUpworkJobsSearchCriterionRepository;
    private readonly typeOrmEmployeeRepository;
    private readonly commandBus;
    constructor(typeOrmJobPresetRepository: TypeOrmJobPresetRepository, mikroOrmJobPresetRepository: MikroOrmJobPresetRepository, typeOrmJobPresetUpworkJobSearchCriterionRepository: TypeOrmJobPresetUpworkJobSearchCriterionRepository, typeOrmEmployeeUpworkJobsSearchCriterionRepository: TypeOrmEmployeeUpworkJobsSearchCriterionRepository, typeOrmEmployeeRepository: TypeOrmEmployeeRepository, commandBus: CommandBus);
    /**
     * Retrieves all job presets optionally filtered by tenant ID, organization ID, search string, or employee ID.
     *
     * @param request Additional parameters for filtering the job presets.
     * @returns A Promise that resolves to an array of job presets.
     */
    getAll(request?: IGetJobPresetInput): Promise<any>;
    /**
     * Retrieves a job preset by its ID along with its job preset criteria and employee criteria if requested.
     *
     * @param id The ID of the job preset to retrieve.
     * @param request Additional parameters for the query, such as employeeId for fetching employee criteria.
     * @returns A Promise that resolves to the retrieved job preset.
     */
    get(id: ID, request?: IGetJobPresetCriterionInput): Promise<JobPreset>;
    /**
     * Retrieves job preset criterion based on the preset ID.
     * @param presetId The ID of the job preset.
     * @returns A Promise that resolves to an array of job preset criterion.
     */
    getJobPresetCriterion(presetId: string): Promise<import("./job-preset-upwork-job-search-criterion.entity").JobPresetUpworkJobSearchCriterion[]>;
    /**
     * Retrieves employee criteria based on the provided input.
     * @param input The input data for retrieving employee criteria.
     * @returns A Promise that resolves to the employee criteria matching the input.
     */
    getEmployeeCriterion(input: IGetMatchingCriterions): Promise<import("./employee-upwork-jobs-search-criterion.entity").EmployeeUpworkJobsSearchCriterion[]>;
    /**
     * Creates a new job preset using the provided request data.
     * @param request The request data for creating the job preset.
     * @returns A Promise that resolves to the created job preset.
     */
    createJobPreset(request: IJobPreset): Promise<any>;
    /**
     * Saves job preset criterion based on the provided criteria.
     * @param request The criteria for saving job preset criterion.
     * @returns A Promise that resolves to the result of the command execution.
     */
    saveJobPresetCriterion(request: IMatchingCriterions): Promise<any>;
    /**
     * Saves employee criterion based on the provided criteria.
     * @param request The criteria for saving employee criterion.
     * @returns A Promise that resolves to the result of the command execution.
     */
    saveEmployeeCriterion(request: IMatchingCriterions): Promise<any>;
    /**
     * Retrieves the job presets associated with the specified employee.
     * @param employeeId The ID of the employee.
     * @returns A Promise that resolves to the job presets associated with the employee.
     */
    getEmployeePreset(employeeId: ID): Promise<IJobPreset[]>;
    /**
     * Saves employee presets based on the provided input.
     * @param request The input containing employee presets to be saved.
     * @returns A Promise that resolves to the result of the command execution.
     */
    saveEmployeePreset(request: IEmployeePresetInput): Promise<IJobPreset[]>;
    /**
     * Deletes the employee criterion with the specified ID associated with the employee ID.
     * @param creationId The ID of the employee criterion to be deleted.
     * @param employeeId The ID of the employee.
     * @returns A Promise that resolves to the result of the deletion operation.
     */
    deleteEmployeeCriterion(creationId: string, employeeId: string): Promise<DeleteResult>;
    /**
     * Deletes the job preset criterion with the specified ID.
     * @param creationId The ID of the job preset criterion to be deleted.
     * @returns A Promise that resolves to the result of the deletion operation.
     */
    deleteJobPresetCriterion(creationId: string): Promise<DeleteResult>;
}
