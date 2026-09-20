"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeePresetController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const core_1 = require("@gauzy/core");
const job_preset_service_1 = require("./job-preset.service");
const job_preset_entity_1 = require("./job-preset.entity");
const dto_1 = require("./dto");
let EmployeePresetController = class EmployeePresetController {
    constructor(jobPresetService) {
        this.jobPresetService = jobPresetService;
    }
    /**
     * Retrieves the job preset for a specific employee.
     *
     * @param employeeId The ID of the employee.
     * @returns The job preset for the specified employee.
     */
    async getEmployeePreset(employeeId) {
        return await this.jobPresetService.getEmployeePreset(employeeId);
    }
    /**
     * Retrieves all matching criteria for job presets of a specific employee.
     *
     * @param employeeId The ID of the employee.
     * @param request The request containing criteria for matching.
     * @returns The matching criteria for job presets of the specified employee.
     */
    async getEmployeeCriterion(employeeId, request) {
        return await this.jobPresetService.getEmployeeCriterion({
            ...request,
            employeeId
        });
    }
    /**
     * Saves or updates matching criteria for job presets of a specific employee.
     *
     * @param employeeId The ID of the employee.
     * @param request The request containing criteria for matching.
     * @returns The saved or updated job presets for the specified employee.
     */
    async saveUpdateEmployeeCriterion(employeeId, request) {
        return await this.jobPresetService.saveEmployeeCriterion({
            ...request,
            employeeId
        });
    }
    /**
     * Saves an employee preset.
     *
     * @param request The request containing the employee preset data.
     * @returns The saved employee job preset.
     */
    async saveEmployeePreset(request) {
        return await this.jobPresetService.saveEmployeePreset(request);
    }
    /**
     * Deletes an employee job preset criterion.
     *
     * @param criterionId The ID of the criterion to delete.
     * @param employeeId The ID of the employee whose criterion to delete.
     * @returns The deleted employee job preset.
     */
    async deleteEmployeeCriterion(criterionId, employeeId) {
        return await this.jobPresetService.deleteEmployeeCriterion(criterionId, employeeId);
    }
};
exports.EmployeePresetController = EmployeePresetController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Retrieves the job preset for a specific employee.' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found employee job preset',
        type: job_preset_entity_1.JobPreset
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, common_1.Get)('/:employeeId'),
    tslib_1.__param(0, (0, common_1.Param)('employeeId', core_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], EmployeePresetController.prototype, "getEmployeePreset", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Find all employee job posts' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found matching criteria for employee job presets',
        type: job_preset_entity_1.JobPreset
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, common_1.Get)('/:employeeId/criterion'),
    tslib_1.__param(0, (0, common_1.Param)('employeeId', core_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], EmployeePresetController.prototype, "getEmployeeCriterion", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Save or update employee job presets' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Employee job presets saved or updated successfully',
        type: job_preset_entity_1.JobPreset
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, common_1.Post)('/:employeeId/criterion'),
    tslib_1.__param(0, (0, common_1.Param)('employeeId', core_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, dto_1.SaveJobPresetCriterionDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], EmployeePresetController.prototype, "saveUpdateEmployeeCriterion", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Save Employee preset' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Employee job preset saved successfully',
        type: job_preset_entity_1.JobPreset
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, common_1.Post)('/'),
    (0, core_1.UseValidationPipe)({ whitelist: true }),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.SaveEmployeePresetDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], EmployeePresetController.prototype, "saveEmployeePreset", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Delete employee job preset criterion' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Employee job preset criterion deleted successfully',
        type: job_preset_entity_1.JobPreset
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, common_1.Delete)('/:employeeId/criterion/:criterionId'),
    tslib_1.__param(0, (0, common_1.Param)('criterionId', core_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Param)('employeeId', core_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String]),
    tslib_1.__metadata("design:returntype", Promise)
], EmployeePresetController.prototype, "deleteEmployeeCriterion", null);
exports.EmployeePresetController = EmployeePresetController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('EmployeeJobPreset'),
    (0, common_1.Controller)('/job-preset/employee'),
    tslib_1.__metadata("design:paramtypes", [job_preset_service_1.JobPresetService])
], EmployeePresetController);
//# sourceMappingURL=employee-preset.controller.js.map