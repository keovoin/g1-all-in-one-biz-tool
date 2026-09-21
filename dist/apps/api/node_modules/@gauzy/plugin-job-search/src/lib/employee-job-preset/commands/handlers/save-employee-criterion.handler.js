"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaveEmployeeCriterionHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const plugin_integration_ai_1 = require("@gauzy/plugin-integration-ai");
const contracts_1 = require("@gauzy/contracts");
const core_1 = require("@gauzy/core");
const employee_upwork_jobs_search_criterion_entity_1 = require("../../employee-upwork-jobs-search-criterion.entity");
const save_employee_criterion_command_1 = require("../save-employee-criterion.command");
const type_orm_employee_upwork_jobs_search_criterion_repository_1 = require("../../repository/type-orm-employee-upwork-jobs-search-criterion.repository");
let SaveEmployeeCriterionHandler = class SaveEmployeeCriterionHandler {
    constructor(typeOrmEmployeeRepository, typeOrmEmployeeUpworkJobsSearchCriterionRepository, _gauzyAIService) {
        this.typeOrmEmployeeRepository = typeOrmEmployeeRepository;
        this.typeOrmEmployeeUpworkJobsSearchCriterionRepository = typeOrmEmployeeUpworkJobsSearchCriterionRepository;
        this._gauzyAIService = _gauzyAIService;
    }
    /**
     * Executes the logic to save employee criterion.
     * @param command The command containing the input data.
     * @returns Promise<IMatchingCriterions> A promise resolving to the created matching criterion.
     */
    async execute(command) {
        const { input } = command;
        // Set tenantId
        input.tenantId = core_1.RequestContext.currentTenantId() ?? input.tenantId;
        // If the current user has the permission to change the selected employee, use their ID
        if (!core_1.RequestContext.hasPermission(contracts_1.PermissionsEnum.CHANGE_SELECTED_EMPLOYEE)) {
            input.employeeId = core_1.RequestContext.currentEmployeeId();
        }
        // Every lookup below is a raw repository query keyed on employeeId; an empty id must fail here
        // rather than turn into an unscoped query (a null key used to be dropped from the SQL).
        if (!input.employeeId) {
            throw new common_1.BadRequestException('employeeId is required');
        }
        const { tenantId } = input;
        if (!tenantId) {
            throw new common_1.ForbiddenException('Tenant context is required');
        }
        // The employee must exist IN THIS TENANT before anything is persisted for them (raw repository —
        // scope explicitly). Its organization fills a missing organizationId.
        const employee = await this.typeOrmEmployeeRepository.findOne({
            where: { id: input.employeeId, tenantId },
            relations: { user: true, organization: true }
        });
        if (!employee) {
            throw new common_1.NotFoundException(`Employee with id ${input.employeeId} not found`);
        }
        if (!input.organizationId) {
            input.organizationId = employee.organizationId;
        }
        // Create criteria
        const creation = new employee_upwork_jobs_search_criterion_entity_1.EmployeeUpworkJobsSearchCriterion(input);
        await this.typeOrmEmployeeUpworkJobsSearchCriterionRepository.save(creation);
        // Find criteria for the employee
        const criteria = await this.typeOrmEmployeeUpworkJobsSearchCriterionRepository.findBy({
            employeeId: input.employeeId,
            jobPresetId: input.jobPresetId,
            tenantId
        });
        // Sync Gauzy AI criteria with the employee
        this._gauzyAIService.syncGauzyEmployeeJobSearchCriteria(employee, criteria);
        return creation;
    }
};
exports.SaveEmployeeCriterionHandler = SaveEmployeeCriterionHandler;
exports.SaveEmployeeCriterionHandler = SaveEmployeeCriterionHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(save_employee_criterion_command_1.SaveEmployeeCriterionCommand),
    tslib_1.__metadata("design:paramtypes", [core_1.TypeOrmEmployeeRepository,
        type_orm_employee_upwork_jobs_search_criterion_repository_1.TypeOrmEmployeeUpworkJobsSearchCriterionRepository,
        plugin_integration_ai_1.GauzyAIService])
], SaveEmployeeCriterionHandler);
//# sourceMappingURL=save-employee-criterion.handler.js.map