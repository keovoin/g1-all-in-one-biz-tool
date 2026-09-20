"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateJobPresetHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const core_1 = require("@gauzy/core");
const job_preset_upwork_job_search_criterion_entity_1 = require("../../job-preset-upwork-job-search-criterion.entity");
const job_preset_entity_1 = require("../../job-preset.entity");
const create_job_preset_command_1 = require("../create-job-preset.command");
const type_orm_job_preset_repository_1 = require("../../repository/type-orm-job-preset.repository");
const type_orm_job_preset_upwork_job_search_criterion_repository_1 = require("../../repository/type-orm-job-preset-upwork-job-search-criterion.repository");
const contracts_1 = require("@gauzy/contracts");
let CreateJobPresetHandler = class CreateJobPresetHandler {
    constructor(typeOrmJobPresetRepository, typeOrmJobPresetUpworkJobSearchCriterionRepository) {
        this.typeOrmJobPresetRepository = typeOrmJobPresetRepository;
        this.typeOrmJobPresetUpworkJobSearchCriterionRepository = typeOrmJobPresetUpworkJobSearchCriterionRepository;
    }
    /**
     * Executes the command to create a job preset.
     *
     * @param command The command containing the input data for creating the job preset.
     * @returns A Promise that resolves to the created job preset.
     */
    async execute(command) {
        const { input } = command;
        // Set tenantId
        input.tenantId = core_1.RequestContext.currentTenantId() ?? input.tenantId;
        // If the current user has the permission to change the selected employee, use their ID
        if (!core_1.RequestContext.hasPermission(contracts_1.PermissionsEnum.CHANGE_SELECTED_EMPLOYEE)) {
            input.employees.push({ employeeId: core_1.RequestContext.currentEmployeeId() });
        }
        // Create a new job preset
        const jobPreset = new job_preset_entity_1.JobPreset(input);
        delete jobPreset.jobPresetCriterions; // Remove jobPresetCriterions property from input
        await this.typeOrmJobPresetRepository.save(jobPreset);
        // Prepare job preset criteria
        let jobPresetCriterion = [];
        if (input.jobPresetCriterions && input.jobPresetCriterions.length > 0) {
            jobPresetCriterion = input.jobPresetCriterions.map((criterion) => new job_preset_upwork_job_search_criterion_entity_1.JobPresetUpworkJobSearchCriterion({
                ...criterion,
                jobPresetId: jobPreset.id
            }));
            // Delete existing job preset criteria
            await this.typeOrmJobPresetUpworkJobSearchCriterionRepository.delete({
                jobPresetId: jobPreset.id
            });
            // Save new job preset criteria
            await this.typeOrmJobPresetUpworkJobSearchCriterionRepository.save(jobPresetCriterion);
            // Update job preset with the new job preset criteria
            jobPreset.jobPresetCriterions = jobPresetCriterion;
        }
        return jobPreset;
    }
};
exports.CreateJobPresetHandler = CreateJobPresetHandler;
exports.CreateJobPresetHandler = CreateJobPresetHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(create_job_preset_command_1.CreateJobPresetCommand),
    tslib_1.__metadata("design:paramtypes", [type_orm_job_preset_repository_1.TypeOrmJobPresetRepository,
        type_orm_job_preset_upwork_job_search_criterion_repository_1.TypeOrmJobPresetUpworkJobSearchCriterionRepository])
], CreateJobPresetHandler);
//# sourceMappingURL=create-job-preset.handler.js.map