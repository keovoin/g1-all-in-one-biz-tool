"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeJobPostController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const cqrs_1 = require("@nestjs/cqrs");
const contracts_1 = require("@gauzy/contracts");
const core_1 = require("@gauzy/core");
const employee_job_service_1 = require("./employee-job.service");
const employee_job_entity_1 = require("./employee-job.entity");
const commands_1 = require("./commands");
const queries_1 = require("./queries");
const dto_1 = require("./dto");
let EmployeeJobPostController = class EmployeeJobPostController {
    constructor(_employeeJobPostService, _commandBus, _queryBus) {
        this._employeeJobPostService = _employeeJobPostService;
        this._commandBus = _commandBus;
        this._queryBus = _queryBus;
    }
    /**
     * Find all employee job posts.
     *
     * @param input - Query parameters for filtering employee job posts.
     * @returns A paginated list of employee job posts.
     */
    async findAll(input) {
        return await this._employeeJobPostService.findAll(input);
    }
    /**
     * GET employee job statistics.
     *
     * This endpoint retrieves statistics related to employee jobs,
     * providing details about job distribution, assignments, or other related data.
     *
     * @param options Pagination parameters for retrieving the data.
     * @returns A paginated list of employee job statistics.
     */
    async getEmployeeJobsStatistics(query) {
        return await this._queryBus.execute(new queries_1.GetEmployeeJobStatisticsQuery(query));
    }
    /**
     * UPDATE employee's job search status by their IDs
     *
     * This endpoint allows updating the job search status of an employee, given their ID.
     *
     * @param employeeId The unique identifier of the employee whose job search status is being updated.
     * @param entity The updated job search status information.
     * @returns A promise resolving to the updated employee record or an update result.
     */
    async updateJobSearchStatus(employeeId, input) {
        return await this._commandBus.execute(new commands_1.UpdateEmployeeJobSearchStatusCommand(employeeId, input));
    }
    /**
     * Apply for a job.
     *
     * @param input - The input for the job application.
     * @returns A promise that resolves to the applied job post details.
     */
    async apply(input) {
        try {
            // Apply for the job using the service
            const appliedJobPost = await this._employeeJobPostService.apply(input);
            // If needed, perform additional logic here
            return appliedJobPost;
        }
        catch (error) {
            // Handle or log the error, depending on your application's needs
            console.error('Error applying for a job:', error);
            // Return null or a custom error response
            return null;
        }
    }
    /**
     * Update the status of a job application.
     *
     * @param input - The input for updating the job application.
     * @returns A promise that resolves to the updated job post details.
     */
    async updateApplied(input) {
        try {
            // Update the job application status using the service
            const updatedJobPost = await this._employeeJobPostService.updateApplied(input);
            // If needed, perform additional logic here
            return updatedJobPost;
        }
        catch (error) {
            // Handle or log the error, depending on your application's needs
            console.error('Error updating applied for a job:', error);
            // Return null or a custom error response
            return null;
        }
    }
    /**
     * Update the visibility status for a job.
     *
     * @param data - The input for updating the job visibility.
     * @returns A promise that resolves to the updated job post details.
     */
    async updateVisibility(data) {
        try {
            // Update the job visibility status using the service
            const updatedJobPost = await this._employeeJobPostService.updateVisibility(data);
            // If needed, perform additional logic here
            return updatedJobPost;
        }
        catch (error) {
            // Handle or log the error, depending on your application's needs
            console.error(error);
            // Return null or a custom error response
            return null;
        }
    }
    /**
     * Create a preliminary record for an employee job application.
     *
     * @param input - The input for creating the preliminary job application record.
     * @returns A promise that resolves to the partial details of the created job application.
     */
    async preProcessEmployeeJobApplication(input) {
        try {
            // Validate the input structure if needed
            // Create a preliminary employee job application record using the service
            const createdJobApplication = await this._employeeJobPostService.preProcessEmployeeJobApplication(input);
            // If needed, perform additional logic here
            return createdJobApplication;
        }
        catch (error) {
            // Handle or log the error, depending on your application's needs
            console.error('Error pre-processing employee job application:', error);
            // Return null or a custom error response
            return null;
        }
    }
    /**
     * Get AI-generated proposal for an employee job application.
     *
     * @param employeeJobApplicationId - The ID of the employee job application.
     * @returns A promise that resolves to the AI-generated proposal details.
     */
    async getEmployeeJobApplication(employeeJobApplicationId) {
        try {
            // Retrieve AI-generated proposal for the employee job application using the service
            const proposal = await this._employeeJobPostService.getEmployeeJobApplication(employeeJobApplicationId);
            // If needed, perform additional logic here
            return proposal;
        }
        catch (error) {
            // Handle or log the error, depending on your application's needs
            console.log('Error retrieving employee job application:', error);
            // Return null or a custom error response
            return null;
        }
    }
    /**
     * Generate AI proposal for an employee job application.
     *
     * @param employeeJobApplicationId - The ID of the employee job application.
     * @returns A promise that resolves to the generated AI proposal details.
     */
    async generateAIProposal(employeeJobApplicationId) {
        try {
            // Generate AI proposal for the employee job application using the service
            const aiProposal = await this._employeeJobPostService.generateAIProposal(employeeJobApplicationId);
            // If needed, perform additional logic here
            return aiProposal;
        }
        catch (error) {
            // Handle or log the error, depending on your application's needs
            console.log('Error generating AI proposal for employee job application:', error);
            // Return null or a custom error response
            return null;
        }
    }
};
exports.EmployeeJobPostController = EmployeeJobPostController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Find all employee job posts' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found employee job posts',
        type: employee_job_entity_1.EmployeeJobPost
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.ORG_JOB_SEARCH),
    (0, common_1.Get)('/'),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], EmployeeJobPostController.prototype, "findAll", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Retrieve employee job statistics' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Employee job statistics found'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input. The response body may contain clues about what went wrong.'
    }),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.ORG_JOB_EMPLOYEE_VIEW),
    (0, common_1.Get)('/statistics'),
    (0, core_1.UseValidationPipe)({ transform: true }),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [core_1.BaseQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], EmployeeJobPostController.prototype, "getEmployeeJobsStatistics", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update Job Search Status' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'Job search status has been successfully updated.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input. The response body may contain clues as to what went wrong.'
    }),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.ORG_EMPLOYEES_EDIT, contracts_1.PermissionsEnum.PROFILE_EDIT),
    (0, common_1.Put)('/:id/job-search-status'),
    (0, core_1.UseValidationPipe)({ whitelist: true }),
    tslib_1.__param(0, (0, common_1.Param)('id', core_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, dto_1.EmployeeJobStatisticDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], EmployeeJobPostController.prototype, "updateJobSearchStatus", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Apply for a Job' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Apply for a Job',
        type: employee_job_entity_1.EmployeeJobPost
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.ORG_JOB_APPLY),
    (0, common_1.Post)('/apply'),
    (0, core_1.UseValidationPipe)() // Assuming ValidationPipe is configured appropriately
    ,
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], EmployeeJobPostController.prototype, "apply", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update applied for a job' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Update applied for a job',
        type: employee_job_entity_1.EmployeeJobPost
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.ORG_JOB_APPLY),
    (0, common_1.Post)('/updateApplied'),
    (0, core_1.UseValidationPipe)() // Assuming ValidationPipe is configured appropriately
    ,
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], EmployeeJobPostController.prototype, "updateApplied", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Hide job' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Update visibility for a job',
        type: employee_job_entity_1.EmployeeJobPost
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, common_1.Post)('/hide'),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.ORG_JOB_EDIT),
    (0, core_1.UseValidationPipe)() // Assuming ValidationPipe is configured appropriately
    ,
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], EmployeeJobPostController.prototype, "updateVisibility", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Create employee job application record' }),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.ORG_JOB_APPLY),
    (0, common_1.Post)('/pre-process'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], EmployeeJobPostController.prototype, "preProcessEmployeeJobApplication", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Get AI generated proposal for employee job application.'
    }),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.ORG_JOB_APPLY),
    (0, common_1.Get)('/application/:employeeJobApplicationId'),
    tslib_1.__param(0, (0, common_1.Param)('employeeJobApplicationId', core_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], EmployeeJobPostController.prototype, "getEmployeeJobApplication", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Generate AI proposal for employee job application'
    }),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.ORG_JOB_APPLY),
    (0, common_1.Post)('/generate-proposal/:employeeJobApplicationId'),
    tslib_1.__param(0, (0, common_1.Param)('employeeJobApplicationId', core_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], EmployeeJobPostController.prototype, "generateAIProposal", null);
exports.EmployeeJobPostController = EmployeeJobPostController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('EmployeeJobPost'),
    (0, common_1.UseGuards)(core_1.TenantPermissionGuard, core_1.PermissionGuard),
    (0, common_1.Controller)('/employee-job'),
    tslib_1.__metadata("design:paramtypes", [employee_job_service_1.EmployeeJobPostService,
        cqrs_1.CommandBus,
        cqrs_1.QueryBus])
], EmployeeJobPostController);
//# sourceMappingURL=employee-job.controller.js.map