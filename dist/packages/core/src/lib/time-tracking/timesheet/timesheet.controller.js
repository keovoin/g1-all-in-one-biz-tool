"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeSheetController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const cqrs_1 = require("@nestjs/cqrs");
const contracts_1 = require("@gauzy/contracts");
const timesheet_service_1 = require("./timesheet.service");
const guards_1 = require("./../../shared/guards");
const pipes_1 = require("./../../shared/pipes");
const decorators_1 = require("./../../shared/decorators");
const query_1 = require("./dto/query");
const commands_1 = require("./commands");
let TimeSheetController = class TimeSheetController {
    constructor(_commandBus, _timeSheetService) {
        this._commandBus = _commandBus;
        this._timeSheetService = _timeSheetService;
    }
    /**
     * GET timesheet counts for the same tenant
     * This method retrieves the count of timesheets for a tenant, filtered by the provided query options.
     *
     * @param options - The query parameters for filtering timesheets, such as tenant ID, date range, employee ID, etc.
     * @returns Promise<number> - The count of timesheets matching the provided filters.
     * @throws HttpException - If an error occurs during query execution, it returns an HTTP 400 error with an error message.
     */
    async getTimesheetCount(options) {
        try {
            // Return the timesheet count directly
            return await this._timeSheetService.getTimeSheetCount(options);
        }
        catch (error) {
            // Handle errors and throw an appropriate error response
            throw new common_1.HttpException(`Error retrieving timesheet count: ${error.message}`, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    /**
     * UPDATE timesheet status
     * This method updates the status of a timesheet based on the data provided in the DTO.
     *
     * @param entity - The DTO containing the updated status for the timesheet.
     * @returns Promise<ITimesheet[]> - The updated list of timesheets after applying the status changes.
     * @throws HttpException - If an error occurs during status update, it throws an HTTP 400 error.
     */
    async updateTimesheetStatus(entity) {
        return await this._commandBus.execute(new commands_1.TimesheetUpdateStatusCommand(entity));
    }
    /**
     * UPDATE timesheet submit status
     * This method submits a timesheet by updating its submission status.
     *
     * @param entity - The DTO containing the submission details for the timesheet.
     * @returns Promise<ITimesheet[]> - The updated list of timesheets after the submission.
     * @throws HttpException - If an error occurs during submission, it throws an HTTP 400 error.
     */
    async submitTimeSheet(entity) {
        return await this._commandBus.execute(new commands_1.TimesheetSubmitCommand(entity));
    }
    /**
     * GET all timesheets in the same tenant
     * This method retrieves all timesheets for the same tenant based on the provided query options.
     *
     * @param options - The query parameters for filtering timesheets, such as tenant ID, date range, employee ID, etc.
     * @returns Promise<ITimesheet[]> - A list of timesheets matching the provided filters.
     * @throws HttpException - If an error occurs during query execution, it throws an HTTP 400 error with an error message.
     */
    async get(options) {
        try {
            return await this._timeSheetService.getTimeSheets(options);
        }
        catch (error) {
            // Handle errors and throw an appropriate error response
            throw new common_1.HttpException(`Error retrieving timesheets: ${error.message}`, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    /**
     * Find timesheet by ID
     * This method retrieves a specific timesheet by its unique identifier.
     *
     * @param id - The UUID of the timesheet to retrieve.
     * @returns Promise<ITimesheet> - The timesheet with the specified ID.
     * @throws HttpException - If the timesheet with the specified ID is not found, it throws an HTTP 400 error.
     */
    async findById(id) {
        return await this._timeSheetService.findOneByIdString(id);
    }
};
exports.TimeSheetController = TimeSheetController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get timesheet count' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Timesheet count successfully retrieved'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input, check the response body for more details'
    }),
    (0, common_1.Get)('/count'),
    (0, pipes_1.UseValidationPipe)({ whitelist: true }),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [query_1.TimesheetQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], TimeSheetController.prototype, "getTimesheetCount", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update timesheet' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'The timesheet has been successfully updated.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input, The response body may contain clues as to what went wrong'
    }),
    (0, common_1.Put)('/status'),
    (0, pipes_1.UseValidationPipe)({ whitelist: true }),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [query_1.UpdateTimesheetStatusDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], TimeSheetController.prototype, "updateTimesheetStatus", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Submit timesheet' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'The timesheet has been successfully submit.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input, The response body may contain clues as to what went wrong'
    }),
    (0, common_1.Put)('/submit'),
    (0, pipes_1.UseValidationPipe)({ whitelist: true }),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [query_1.SubmitTimesheetStatusDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], TimeSheetController.prototype, "submitTimeSheet", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get timesheet' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Get timesheet'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input, The response body may contain clues as to what went wrong'
    }),
    (0, common_1.Get)(),
    (0, pipes_1.UseValidationPipe)({ whitelist: true }),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [query_1.TimesheetQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], TimeSheetController.prototype, "get", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Find timesheet by id' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found timesheet by id'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input, The response body may contain clues as to what went wrong'
    }),
    (0, common_1.Get)('/:id'),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], TimeSheetController.prototype, "findById", null);
exports.TimeSheetController = TimeSheetController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('TimeSheet'),
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard, guards_1.PermissionGuard),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.CAN_APPROVE_TIMESHEET),
    (0, common_1.Controller)('/timesheet'),
    tslib_1.__metadata("design:paramtypes", [cqrs_1.CommandBus, timesheet_service_1.TimeSheetService])
], TimeSheetController);
//# sourceMappingURL=timesheet.controller.js.map