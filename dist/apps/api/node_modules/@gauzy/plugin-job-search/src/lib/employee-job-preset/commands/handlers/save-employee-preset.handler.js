"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaveEmployeePresetHandler = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const contracts_1 = require("@gauzy/contracts");
const plugin_integration_ai_1 = require("@gauzy/plugin-integration-ai");
const core_1 = require("@gauzy/core");
const employee_upwork_jobs_search_criterion_entity_1 = require("../../employee-upwork-jobs-search-criterion.entity");
const job_preset_entity_1 = require("../../job-preset.entity");
const save_employee_preset_command_1 = require("../save-employee-preset.command");
const type_orm_job_preset_repository_1 = require("../../repository/type-orm-job-preset.repository");
const type_orm_employee_upwork_jobs_search_criterion_repository_1 = require("../../repository/type-orm-employee-upwork-jobs-search-criterion.repository");
let SaveEmployeePresetHandler = class SaveEmployeePresetHandler {
    constructor(_typeOrmJobPresetRepository, _typeOrmEmployeeRepository, _typeOrmEmployeeUpworkJobsSearchCriterionRepository, _gauzyAIService) {
        this._typeOrmJobPresetRepository = _typeOrmJobPresetRepository;
        this._typeOrmEmployeeRepository = _typeOrmEmployeeRepository;
        this._typeOrmEmployeeUpworkJobsSearchCriterionRepository = _typeOrmEmployeeUpworkJobsSearchCriterionRepository;
        this._gauzyAIService = _gauzyAIService;
    }
    /**
     * Saves employee presets and syncs job search criteria.
     *
     * @param command The SaveEmployeePresetCommand object containing input data.
     * @returns A Promise resolving to an array of JobPreset objects.
     */
    async execute(command) {
        const { input } = command;
        const tenantId = core_1.RequestContext.currentTenantId();
        // Resolve the target employee fail-closed. A caller without CHANGE_SELECTED_EMPLOYEE may only
        // touch their own record; everyone else must name a real employee of their own tenant. Every
        // repository call below is a RAW TypeORM lookup, and `{ employeeId }` with a null value used to
        // be dropped from the SQL — the delete below then became an unfiltered DELETE of every tenant's
        // search criteria (GHSA-44pv-34gx-q9p4 class), so the id must never be empty here.
        const employeeId = core_1.RequestContext.hasPermission(contracts_1.PermissionsEnum.CHANGE_SELECTED_EMPLOYEE)
            ? input.employeeId
            : core_1.RequestContext.currentEmployeeId() ?? core_1.RequestContext.currentUser()?.employeeId;
        if (!employeeId) {
            throw new common_1.BadRequestException('employeeId is required');
        }
        if (!tenantId) {
            throw new common_1.ForbiddenException('Tenant context is required');
        }
        if (!Array.isArray(input.jobPresetIds) || input.jobPresetIds.length === 0) {
            throw new common_1.BadRequestException('jobPresetIds is required');
        }
        // Find the employee with related data — scoped to the caller's tenant.
        let employee = await this._typeOrmEmployeeRepository.findOne({
            where: { id: employeeId, tenantId },
            relations: (0, core_1.parseFindOptionsRelations)(['user', 'organization', 'customFields.jobPresets'])
        });
        if (!employee) {
            throw new common_1.NotFoundException(`Employee with id ${employeeId} not found`);
        }
        // Find ALL requested job presets with their criteria — in this tenant. Every requested id must
        // resolve, or a foreign / unknown preset id would be stored on the employee anyway.
        const jobPresetIds = [...new Set(input.jobPresetIds)];
        const jobPresets = await this._typeOrmJobPresetRepository.find({
            where: { id: (0, typeorm_1.In)(jobPresetIds), tenantId },
            relations: { jobPresetCriterions: true }
        });
        if (jobPresets.length !== jobPresetIds.length) {
            throw new common_1.NotFoundException('Job preset not found');
        }
        // Map every preset's criteria to employee criterions
        const employeeCriterions = jobPresets.flatMap((jobPreset) => (jobPreset.jobPresetCriterions ?? []).map((item) => new employee_upwork_jobs_search_criterion_entity_1.EmployeeUpworkJobsSearchCriterion({ ...item, employeeId })));
        // Update employee custom fields with the (verified) job presets
        employee.customFields['jobPresets'] = jobPresets.map(({ id }) => new job_preset_entity_1.JobPreset({ id }));
        await this._typeOrmEmployeeRepository.save(employee);
        // Delete existing employee job search criteria — for THIS employee of THIS tenant only.
        await this._typeOrmEmployeeUpworkJobsSearchCriterionRepository.delete({ employeeId, tenantId });
        // Save new employee job search criteria
        await this._typeOrmEmployeeUpworkJobsSearchCriterionRepository.save(employeeCriterions);
        // Sync Gauzy employee job search criteria
        this._gauzyAIService.syncGauzyEmployeeJobSearchCriteria(employee, employeeCriterions);
        // Find the employee with related data
        employee = await this._typeOrmEmployeeRepository.findOne({
            where: { id: employeeId, tenantId },
            relations: (0, core_1.parseFindOptionsRelations)(['customFields.jobPresets'])
        });
        return employee.customFields['jobPresets'];
    }
};
exports.SaveEmployeePresetHandler = SaveEmployeePresetHandler;
exports.SaveEmployeePresetHandler = SaveEmployeePresetHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(save_employee_preset_command_1.SaveEmployeePresetCommand),
    tslib_1.__metadata("design:paramtypes", [type_orm_job_preset_repository_1.TypeOrmJobPresetRepository,
        core_1.TypeOrmEmployeeRepository,
        type_orm_employee_upwork_jobs_search_criterion_repository_1.TypeOrmEmployeeUpworkJobsSearchCriterionRepository,
        plugin_integration_ai_1.GauzyAIService])
], SaveEmployeePresetHandler);
//# sourceMappingURL=save-employee-preset.handler.js.map