"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SavePresetCriterionHandler = void 0;
const tslib_1 = require("tslib");
const contracts_1 = require("@gauzy/contracts");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const core_1 = require("@gauzy/core");
const job_preset_upwork_job_search_criterion_entity_1 = require("../../job-preset-upwork-job-search-criterion.entity");
const save_preset_criterion_command_1 = require("../save-preset-criterion.command");
const type_orm_job_preset_upwork_job_search_criterion_repository_1 = require("../../repository/type-orm-job-preset-upwork-job-search-criterion.repository");
let SavePresetCriterionHandler = class SavePresetCriterionHandler {
    constructor(typeOrmEmployeeRepository, typeOrmJobPresetUpworkJobSearchCriterionRepository) {
        this.typeOrmEmployeeRepository = typeOrmEmployeeRepository;
        this.typeOrmJobPresetUpworkJobSearchCriterionRepository = typeOrmJobPresetUpworkJobSearchCriterionRepository;
    }
    /**
     * Executes the SavePresetCriterionCommand to save a preset criterion.
     *
     * @param command The command containing the input data for saving the preset criterion.
     * @returns The saved preset criterion.
     */
    async execute(command) {
        const { input } = command;
        input.tenantId = core_1.RequestContext.currentTenantId() ?? input.tenantId;
        if (!input.tenantId) {
            throw new common_1.ForbiddenException('Tenant context is required');
        }
        // If the current user has the permission to change the selected employee, use their ID
        if (!core_1.RequestContext.hasPermission(contracts_1.PermissionsEnum.CHANGE_SELECTED_EMPLOYEE)) {
            input.employeeId = core_1.RequestContext.currentEmployeeId();
        }
        // Set organizationId if not provided in the input (raw repository: scope to the tenant, and
        // only ever look an employee up by a real id).
        if (!input.organizationId && input.employeeId) {
            const employee = await this.typeOrmEmployeeRepository.findOneBy({
                id: input.employeeId,
                tenantId: input.tenantId
            });
            if (!employee) {
                throw new common_1.NotFoundException(`Employee with id ${input.employeeId} not found`);
            }
            input.organizationId = employee.organizationId;
        }
        // Create a new JobPresetUpworkJobSearchCriterion instance with the input data
        const creation = new job_preset_upwork_job_search_criterion_entity_1.JobPresetUpworkJobSearchCriterion(input);
        // Save the created instance to the database
        await this.typeOrmJobPresetUpworkJobSearchCriterionRepository.save(creation);
        // Return the saved preset criterion
        return creation;
    }
};
exports.SavePresetCriterionHandler = SavePresetCriterionHandler;
exports.SavePresetCriterionHandler = SavePresetCriterionHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(save_preset_criterion_command_1.SavePresetCriterionCommand),
    tslib_1.__metadata("design:paramtypes", [core_1.TypeOrmEmployeeRepository,
        type_orm_job_preset_upwork_job_search_criterion_repository_1.TypeOrmJobPresetUpworkJobSearchCriterionRepository])
], SavePresetCriterionHandler);
//# sourceMappingURL=save-preset-criterion.handler.js.map