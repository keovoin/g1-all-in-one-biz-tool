"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobPresetService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const class_validator_1 = require("class-validator");
const contracts_1 = require("@gauzy/contracts");
const core_1 = require("@gauzy/core");
const core_2 = require("@gauzy/core");
const commands_1 = require("./commands");
const type_orm_job_preset_repository_1 = require("./repository/type-orm-job-preset.repository");
const mikro_orm_job_preset_repository_1 = require("./repository/mikro-orm-job-preset.repository");
const type_orm_job_preset_upwork_job_search_criterion_repository_1 = require("./repository/type-orm-job-preset-upwork-job-search-criterion.repository");
const type_orm_employee_upwork_jobs_search_criterion_repository_1 = require("./repository/type-orm-employee-upwork-jobs-search-criterion.repository");
let JobPresetService = class JobPresetService extends core_1.TenantAwareCrudService {
    constructor(typeOrmJobPresetRepository, mikroOrmJobPresetRepository, typeOrmJobPresetUpworkJobSearchCriterionRepository, typeOrmEmployeeUpworkJobsSearchCriterionRepository, typeOrmEmployeeRepository, commandBus) {
        super(typeOrmJobPresetRepository, mikroOrmJobPresetRepository);
        this.typeOrmJobPresetRepository = typeOrmJobPresetRepository;
        this.mikroOrmJobPresetRepository = mikroOrmJobPresetRepository;
        this.typeOrmJobPresetUpworkJobSearchCriterionRepository = typeOrmJobPresetUpworkJobSearchCriterionRepository;
        this.typeOrmEmployeeUpworkJobsSearchCriterionRepository = typeOrmEmployeeUpworkJobsSearchCriterionRepository;
        this.typeOrmEmployeeRepository = typeOrmEmployeeRepository;
        this.commandBus = commandBus;
    }
    /**
     * Retrieves all job presets optionally filtered by tenant ID, organization ID, search string, or employee ID.
     *
     * @param request Additional parameters for filtering the job presets.
     * @returns A Promise that resolves to an array of job presets.
     */
    async getAll(request) {
        // Tenant ID is required for the query
        const tenantId = core_1.RequestContext.currentTenantId() || request?.tenantId;
        // Extract parameters from the request object
        let { organizationId, search, employeeId } = request || {};
        // If the user does not have the permission to change selected employee, use the current employee ID
        if (!core_1.RequestContext.hasPermission(contracts_1.PermissionsEnum.CHANGE_SELECTED_EMPLOYEE)) {
            employeeId = core_1.RequestContext.currentEmployeeId();
        }
        switch (this.ormType) {
            case core_1.MultiORMEnum.MikroORM: {
                // MikroORM: Use Knex for left join on employees relation
                const knex = this.mikroOrmRepository.getKnex();
                let qb = knex('job_preset')
                    .leftJoin('job_preset_employee', 'job_preset.id', 'job_preset_employee.jobPresetId')
                    .where('job_preset.tenantId', tenantId);
                if ((0, class_validator_1.isNotEmpty)(organizationId)) {
                    qb = qb.andWhere('job_preset.organizationId', organizationId);
                }
                if ((0, class_validator_1.isNotEmpty)(search)) {
                    qb = qb.andWhere('job_preset.name', 'ILIKE', `%${search}%`);
                }
                if ((0, class_validator_1.isNotEmpty)(employeeId)) {
                    qb = qb.andWhere('job_preset_employee.employeeId', employeeId);
                }
                qb = qb.select('job_preset.*').orderBy('job_preset.name', 'asc').distinct();
                const rawItems = await qb;
                return rawItems.map((row) => this.mikroOrmRepository.map(row));
            }
            case core_1.MultiORMEnum.TypeORM:
            default: {
                // Create a query builder for the JobPreset entity
                const query = this.typeOrmRepository.createQueryBuilder('job_preset');
                // typeorm-v1: the legacy `join` find-option was removed. Left join the `employees`
                // relation explicitly so the raw `"employees"."id" = :employeeId` filter below can
                // resolve the alias.
                query.leftJoin('job_preset.employees', 'employees');
                // Set the find options for the query
                query.setFindOptions({
                    // Include job preset criterions in the query result
                    relations: { jobPresetCriterions: true },
                    // Order the results by job preset name in ascending order
                    order: { name: 'ASC' }
                });
                // Add conditions to the query using the query builder
                query.where((qb) => {
                    // Filter by tenant ID
                    qb.andWhere((0, core_2.prepareSQLQuery)(`"${qb.alias}"."tenantId" = :tenantId`), { tenantId });
                    // Filter by organization ID if provided
                    if ((0, class_validator_1.isNotEmpty)(organizationId)) {
                        qb.andWhere((0, core_2.prepareSQLQuery)(`"${qb.alias}"."organizationId" = :organizationId`), { organizationId });
                    }
                    // Filter by search string if provided
                    if ((0, class_validator_1.isNotEmpty)(search)) {
                        qb.andWhere((0, core_2.prepareSQLQuery)(`"${query.alias}"."name" ${core_1.LIKE_OPERATOR} :search`), { search: `%${search}%` });
                    }
                    // Filter by employee ID if provided
                    if ((0, class_validator_1.isNotEmpty)(employeeId)) {
                        qb.andWhere((0, core_2.prepareSQLQuery)(`"employees"."id" = :employeeId`), { employeeId });
                    }
                });
                // Execute the query and return the result
                return await query.getMany();
            }
        }
    }
    /**
     * Retrieves a job preset by its ID along with its job preset criteria and employee criteria if requested.
     *
     * @param id The ID of the job preset to retrieve.
     * @param request Additional parameters for the query, such as employeeId for fetching employee criteria.
     * @returns A Promise that resolves to the retrieved job preset.
     */
    async get(id, request) {
        switch (this.ormType) {
            case core_1.MultiORMEnum.MikroORM: {
                // MikroORM: Use repository find with populate
                const populate = ['jobPresetCriterions'];
                if (request?.employeeId) {
                    populate.push('employeeCriterions');
                }
                const result = await this.mikroOrmRepository.findOne({ id }, { populate });
                // Filter employeeCriterions by employeeId if needed
                if (request?.employeeId && result?.employeeCriterions) {
                    result.employeeCriterions = result.employeeCriterions.filter((ec) => ec.employeeId === request.employeeId);
                }
                return result;
            }
            case core_1.MultiORMEnum.TypeORM:
            default: {
                const query = this.typeOrmRepository.createQueryBuilder();
                // Left join job preset criterions
                query.leftJoinAndSelect(`${query.alias}.jobPresetCriterions`, 'jobPresetCriterions');
                // Left join employee criterions if employeeId is provided in the request
                if (request?.employeeId) {
                    const { employeeId } = request;
                    query.leftJoinAndSelect(`${query.alias}.employeeCriterions`, 'employeeCriterions', 'employeeCriterions.employeeId = :employeeId', { employeeId });
                }
                // Filter by job preset ID
                query.andWhere(`${query.alias}.id = :id`, { id });
                // Execute the query and return the result
                return await query.getOne();
            }
        }
    }
    /**
     * Retrieves job preset criterion based on the preset ID.
     * @param presetId The ID of the job preset.
     * @returns A Promise that resolves to an array of job preset criterion.
     */
    async getJobPresetCriterion(presetId) {
        // Use the job preset ID to find related job preset criterion
        return await this.typeOrmJobPresetUpworkJobSearchCriterionRepository.findBy({ jobPresetId: presetId });
    }
    /**
     * Retrieves employee criteria based on the provided input.
     * @param input The input data for retrieving employee criteria.
     * @returns A Promise that resolves to the employee criteria matching the input.
     */
    async getEmployeeCriterion(input) {
        return await this.typeOrmEmployeeUpworkJobsSearchCriterionRepository.findBy({
            ...(input.jobPresetId ? { jobPresetId: input.jobPresetId } : {}),
            employeeId: input.employeeId
        });
    }
    /**
     * Creates a new job preset using the provided request data.
     * @param request The request data for creating the job preset.
     * @returns A Promise that resolves to the created job preset.
     */
    async createJobPreset(request) {
        return await this.commandBus.execute(new commands_1.CreateJobPresetCommand(request));
    }
    /**
     * Saves job preset criterion based on the provided criteria.
     * @param request The criteria for saving job preset criterion.
     * @returns A Promise that resolves to the result of the command execution.
     */
    async saveJobPresetCriterion(request) {
        // Execute the SavePresetCriterionCommand with the provided criteria
        return this.commandBus.execute(new commands_1.SavePresetCriterionCommand(request));
    }
    /**
     * Saves employee criterion based on the provided criteria.
     * @param request The criteria for saving employee criterion.
     * @returns A Promise that resolves to the result of the command execution.
     */
    async saveEmployeeCriterion(request) {
        // Execute the SaveEmployeeCriterionCommand with the provided criteria
        return this.commandBus.execute(new commands_1.SaveEmployeeCriterionCommand(request));
    }
    /**
     * Retrieves the job presets associated with the specified employee.
     * @param employeeId The ID of the employee.
     * @returns A Promise that resolves to the job presets associated with the employee.
     */
    async getEmployeePreset(employeeId) {
        // Find the employee with the specified ID and include jobPresets relation
        const employee = await this.typeOrmEmployeeRepository.findOne({
            where: { id: employeeId },
            relations: (0, core_1.parseFindOptionsRelations)(['customFields.jobPresets'])
        });
        // Return the job presets associated with the employee
        return employee.customFields['jobPresets'];
    }
    /**
     * Saves employee presets based on the provided input.
     * @param request The input containing employee presets to be saved.
     * @returns A Promise that resolves to the result of the command execution.
     */
    async saveEmployeePreset(request) {
        // Execute the SaveEmployeePresetCommand with the provided input
        return await this.commandBus.execute(new commands_1.SaveEmployeePresetCommand(request));
    }
    /**
     * Deletes the employee criterion with the specified ID associated with the employee ID.
     * @param creationId The ID of the employee criterion to be deleted.
     * @param employeeId The ID of the employee.
     * @returns A Promise that resolves to the result of the deletion operation.
     */
    async deleteEmployeeCriterion(creationId, employeeId) {
        // Delete the employee criterion with the specified ID associated with the employee ID
        return await this.typeOrmEmployeeUpworkJobsSearchCriterionRepository.delete({
            id: creationId,
            employeeId: employeeId
        });
    }
    /**
     * Deletes the job preset criterion with the specified ID.
     * @param creationId The ID of the job preset criterion to be deleted.
     * @returns A Promise that resolves to the result of the deletion operation.
     */
    async deleteJobPresetCriterion(creationId) {
        // Delete the job preset criterion with the specified ID
        return await this.typeOrmJobPresetUpworkJobSearchCriterionRepository.delete(creationId);
    }
};
exports.JobPresetService = JobPresetService;
exports.JobPresetService = JobPresetService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_job_preset_repository_1.TypeOrmJobPresetRepository,
        mikro_orm_job_preset_repository_1.MikroOrmJobPresetRepository,
        type_orm_job_preset_upwork_job_search_criterion_repository_1.TypeOrmJobPresetUpworkJobSearchCriterionRepository,
        type_orm_employee_upwork_jobs_search_criterion_repository_1.TypeOrmEmployeeUpworkJobsSearchCriterionRepository,
        core_1.TypeOrmEmployeeRepository,
        cqrs_1.CommandBus])
], JobPresetService);
//# sourceMappingURL=job-preset.service.js.map