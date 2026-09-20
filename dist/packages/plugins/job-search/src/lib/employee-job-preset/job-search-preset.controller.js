"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobSearchPresetController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const plugin_integration_ai_1 = require("@gauzy/plugin-integration-ai");
const core_1 = require("@gauzy/core");
const job_preset_service_1 = require("./job-preset.service");
const job_preset_entity_1 = require("./job-preset.entity");
const job_preset_upwork_job_search_criterion_entity_1 = require("./job-preset-upwork-job-search-criterion.entity");
const dto_1 = require("./dto");
let JobSearchPresetController = class JobSearchPresetController {
    constructor(jobPresetService, employeeService, gauzyAIService) {
        this.jobPresetService = jobPresetService;
        this.employeeService = employeeService;
        this.gauzyAIService = gauzyAIService;
    }
    /**
     * Retrieves all employee job presets.
     *
     * @param input The query parameters for filtering job presets.
     * @returns A Promise that resolves to the retrieved job presets.
     */
    async getAll(input) {
        console.log('GetAll Presets called. We will sync all employees now');
        // Synchronize all active employees
        const employees = await this.employeeService.findAllActive();
        await this.gauzyAIService.syncEmployees(employees);
        // Retrieve all job presets based on the provided query parameters
        return await this.jobPresetService.getAll(input);
    }
    /**
     * Retrieves an employee job preset by its ID.
     *
     * @param presetId The ID of the job preset to retrieve.
     * @param request The query parameters for filtering job presets.
     * @returns A Promise that resolves to the retrieved job preset.
     */
    async get(presetId, request) {
        return await this.jobPresetService.get(presetId, request);
    }
    /**
     * Retrieves job preset criteria for a specific job preset by its ID.
     *
     * @param presetId The ID of the job preset for which to retrieve criteria.
     * @returns A Promise that resolves to the job preset criteria.
     */
    async getJobPresetCriterion(presetId) {
        return await this.jobPresetService.getJobPresetCriterion(presetId);
    }
    /**
     * Creates a new job preset.
     *
     * @param request The job preset data.
     * @returns A Promise that resolves to the created job preset.
     */
    async createJobPreset(request) {
        return await this.jobPresetService.createJobPreset(request);
    }
    /**
     * Saves or updates job preset criteria for a specific job preset.
     *
     * @param jobPresetId The ID of the job preset.
     * @param request The criteria data to save or update.
     * @returns A Promise that resolves to the saved or updated job preset criteria.
     */
    async saveUpdate(jobPresetId, request) {
        return await this.jobPresetService.saveJobPresetCriterion({
            ...request,
            jobPresetId
        });
    }
    /**
     * Deletes a job preset criterion by its ID.
     *
     * @param criterionId The ID of the job preset criterion to delete.
     * @returns A Promise that resolves to the deleted job preset criterion.
     */
    async deleteJobPresetCriterion(criterionId) {
        return await this.jobPresetService.deleteJobPresetCriterion(criterionId);
    }
};
exports.JobSearchPresetController = JobSearchPresetController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Find all employee job posts' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found employee job presets',
        type: job_preset_entity_1.JobPreset
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, common_1.Get)('/'),
    (0, core_1.UseValidationPipe)({ whitelist: true }),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.JobPresetQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], JobSearchPresetController.prototype, "getAll", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Find an employee job preset by ID' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found employee job preset',
        type: job_preset_entity_1.JobPreset
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, common_1.Get)('/:id'),
    tslib_1.__param(0, (0, common_1.Param)('id', core_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], JobSearchPresetController.prototype, "get", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Find job preset criteria by job preset ID' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found job preset criteria',
        type: job_preset_upwork_job_search_criterion_entity_1.JobPresetUpworkJobSearchCriterion
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, common_1.Get)('/:id/criterion'),
    tslib_1.__param(0, (0, common_1.Param)('id', core_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], JobSearchPresetController.prototype, "getJobPresetCriterion", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Create a new job preset' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Job preset created successfully',
        type: job_preset_entity_1.JobPreset
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid job preset data'
    }),
    (0, common_1.Post)('/'),
    (0, core_1.UseValidationPipe)(),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.CreateJobPresetDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], JobSearchPresetController.prototype, "createJobPreset", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Save or update job preset criteria' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Job preset criteria saved or updated successfully',
        type: job_preset_entity_1.JobPreset
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid job preset criteria data'
    }),
    (0, common_1.Post)('/:jobPresetId/criterion'),
    (0, core_1.UseValidationPipe)(),
    tslib_1.__param(0, (0, common_1.Param)('jobPresetId', core_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, dto_1.SaveJobPresetCriterionDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], JobSearchPresetController.prototype, "saveUpdate", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Delete job preset criterion by ID' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Job preset criterion deleted successfully',
        type: job_preset_entity_1.JobPreset
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Job preset criterion not found'
    }),
    (0, common_1.Delete)('/criterion/:criterionId'),
    tslib_1.__param(0, (0, common_1.Param)('criterionId', core_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], JobSearchPresetController.prototype, "deleteJobPresetCriterion", null);
exports.JobSearchPresetController = JobSearchPresetController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('JobSearchPreset'),
    (0, common_1.Controller)('/job-preset'),
    tslib_1.__metadata("design:paramtypes", [job_preset_service_1.JobPresetService,
        core_1.EmployeeService,
        plugin_integration_ai_1.GauzyAIService])
], JobSearchPresetController);
//# sourceMappingURL=job-search-preset.controller.js.map