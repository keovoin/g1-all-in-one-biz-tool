"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeLogController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const contracts_1 = require("@gauzy/contracts");
const time_log_entity_1 = require("./time-log.entity");
const time_log_service_1 = require("./time-log.service");
const decorators_1 = require("./../../shared/decorators");
const guards_1 = require("./../../shared/guards");
const pipes_1 = require("./../../shared/pipes");
const dto_1 = require("./dto");
const query_1 = require("./dto/query");
const pipes_2 = require("./pipes");
let TimeLogController = class TimeLogController {
    constructor(_timeLogService) {
        this._timeLogService = _timeLogService;
    }
    /**
     * Get conflicting timer logs based on the provided entity.
     * @param entity The entity with information for checking conflicts.
     * @returns An array of conflicting timer logs.
     */
    async getConflict(request) {
        // Goes through the service, never the command bus directly: the command uses `employeeId`,
        // `organizationId` and `tenantId` exactly as given, and this route is reachable by any
        // TIME_TRACKER holder — i.e. every ordinary employee.
        return await this._timeLogService.getConflictTimeLogs(request);
    }
    /**
     * Get daily report for timer logs based on the provided options.
     * @param options The options for retrieving the daily report.
     * @returns The daily report for timer logs.
     */
    async getDailyReport(options) {
        return await this._timeLogService.getDailyReport(options);
    }
    /**
     * Get chart data for the daily report of timer logs based on the provided options.
     * @param options The options for retrieving the daily report chart data.
     * @returns The chart data for the daily report of timer logs.
     */
    async getDailyReportChartData(options) {
        return await this._timeLogService.getDailyReportCharts(options);
    }
    /**
     * Get report data for the owed amount based on the provided options.
     * @param options The options for retrieving the owed amount report data.
     * @returns The report data for the owed amount.
     */
    async getOwedAmountReport(options) {
        return await this._timeLogService.getOwedAmountReport(options);
    }
    /**
     * Get chart data for the owed amount report based on the provided options.
     * @param options The options for retrieving the owed amount report chart data.
     * @returns The chart data for the owed amount report.
     */
    async getOwedAmountReportChartData(options) {
        return await this._timeLogService.getOwedAmountReportCharts(options);
    }
    /**
     * Get the weekly report for timer logs based on the provided options.
     * @param options The options for retrieving the weekly report.
     * @returns The weekly report for timer logs if found, otherwise null.
     */
    async getWeeklyReport(options) {
        return await this._timeLogService.getWeeklyReport(options);
    }
    /**
     * Get the time limit report for timer logs based on the provided options.
     * @param options The options for retrieving the time limit report.
     * @returns The time limit report for timer logs if found, otherwise null.
     */
    async getTimeLimitReport(options) {
        return await this._timeLogService.getTimeLimit(options);
    }
    /**
     * Get project budget limit based on the provided options.
     * @param options The options for retrieving the project budget limit.
     * @returns The project budget limit if found, otherwise null.
     */
    async getProjectBudgetLimit(options) {
        return await this._timeLogService.getProjectBudgetLimit(options);
    }
    /**
     * Retrieve the client budget limit based on the provided options.
     * @param options The options for retrieving the client budget limit.
     * @returns The client budget limit if found; otherwise, null.
     */
    async clientBudgetLimit(options) {
        return await this._timeLogService.getClientBudgetLimit(options);
    }
    /**
     * Get timer logs based on provided options.
     * @param options The options for querying timer logs.
     * @returns An array of timer logs.
     */
    async getLogs(options) {
        return await this._timeLogService.getTimeLogs(options);
    }
    /**
     * Find time log by ID
     * @param id The ID of the time log.
     * @param options Additional options for finding the time log.
     * @returns The found time log.
     */
    async findById(id, options) {
        return await this._timeLogService.findOneByIdString(id, options);
    }
    /**
     * Add manual time
     * @param entity The data for creating a manual time log.
     * @returns The created manual time log.
     */
    async addManualTime(entity) {
        return await this._timeLogService.addManualTime(entity);
    }
    /**
     * Update time log
     * @param id The ID of the time log entry to be updated.
     * @param entity The updated data for the manual time log.
     * @returns The updated time log entry.
     */
    async updateManualTime(id, entity) {
        return await this._timeLogService.updateManualTime(id, entity);
    }
    /**
     * Deletes a time log based on the provided query parameters.
     *
     * @param options - The query parameters for deleting time logs, including conditions like log IDs and force delete flag.
     * @returns A Promise that resolves to either a DeleteResult or UpdateResult, depending on whether it's a soft or hard delete.
     * @throws BadRequestException if the input is invalid or deletion fails.
     */
    async deleteTimeLog(options) {
        return await this._timeLogService.deleteTimeLogs(options);
    }
};
exports.TimeLogController = TimeLogController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get Timer Logs Conflict' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Successfully retrieved conflicting timer logs',
        isArray: true
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input. The response body may contain clues as to what went wrong.'
    }),
    (0, common_1.Get)('conflict'),
    (0, pipes_1.UseValidationPipe)({ whitelist: true, transform: true }),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [query_1.GetTimeLogConflictQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], TimeLogController.prototype, "getConflict", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Find Timer Log by id' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Successfully retrieved the daily report'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'No records found for the provided options'
    }),
    (0, common_1.Get)('report/daily'),
    (0, pipes_1.UseValidationPipe)({ whitelist: true, transform: true }),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [query_1.TimeLogQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], TimeLogController.prototype, "getDailyReport", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Find Timer Log by id' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Successfully retrieved the chart data for the daily report'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'No records found for the provided options'
    }),
    (0, common_1.Get)('report/daily-chart'),
    (0, pipes_1.UseValidationPipe)({ whitelist: true }),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [query_1.TimeLogQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], TimeLogController.prototype, "getDailyReportChartData", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get Owed Amount Report' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Successfully retrieved the report data for the owed amount'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input. The response body may contain clues as to what went wrong.'
    }),
    (0, common_1.Get)('report/owed-report'),
    (0, pipes_1.UseValidationPipe)({ whitelist: true, transform: true }),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [query_1.TimeLogQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], TimeLogController.prototype, "getOwedAmountReport", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get Owed Amount Report Chart Data' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Successfully retrieved the chart data for the owed amount report'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input. The response body may contain clues as to what went wrong.'
    }),
    (0, common_1.Get)('report/owed-charts'),
    (0, pipes_1.UseValidationPipe)({ whitelist: true, transform: true }),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [query_1.TimeLogQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], TimeLogController.prototype, "getOwedAmountReportChartData", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get Weekly Report' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Successfully retrieved the weekly report for timer logs'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'No records found for the specified options'
    }),
    (0, common_1.Get)('report/weekly'),
    (0, pipes_1.UseValidationPipe)({ whitelist: true, transform: true }),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [query_1.TimeLogQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], TimeLogController.prototype, "getWeeklyReport", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get Time Limit Report' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Successfully retrieved the time limit report for timer logs'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'No records found for the specified options'
    }),
    (0, common_1.Get)('time-limit'),
    (0, pipes_1.UseValidationPipe)({ whitelist: true, transform: true }),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [query_1.TimeLogLimitQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], TimeLogController.prototype, "getTimeLimitReport", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get Project Budget Limit' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Successfully retrieved the project budget limit.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Project budget limit not found.'
    }),
    (0, common_1.Get)('project-budget-limit'),
    (0, pipes_1.UseValidationPipe)({ whitelist: true, transform: true }),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [query_1.TimeLogQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], TimeLogController.prototype, "getProjectBudgetLimit", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get Client Budget Limit' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Successfully retrieved the client budget limit.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Client budget limit not found.'
    }),
    (0, common_1.Get)('client-budget-limit'),
    (0, pipes_1.UseValidationPipe)({ whitelist: true, transform: true }),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [query_1.TimeLogQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], TimeLogController.prototype, "clientBudgetLimit", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get Timer Logs' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Successfully retrieved timer logs',
        isArray: true
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input. The response body may contain clues as to what went wrong.'
    }),
    (0, common_1.Get)(),
    (0, pipes_1.UseValidationPipe)({ whitelist: true, transform: true }),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [query_1.TimeLogQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], TimeLogController.prototype, "getLogs", null);
tslib_1.__decorate([
    (0, common_1.Get)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], TimeLogController.prototype, "findById", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Add manual time' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'The timer has been successfully On/Off.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input, The response body may contain clues as to what went wrong'
    }),
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(guards_1.OrganizationPermissionGuard),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALLOW_MANUAL_TIME),
    tslib_1.__param(0, (0, common_1.Body)(pipes_2.TimeLogBodyTransformPipe, new common_1.ValidationPipe({ transform: true }))),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.CreateManualTimeLogDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], TimeLogController.prototype, "addManualTime", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update time log' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'The timer has been successfully On/Off.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input, The response body may contain clues as to what went wrong'
    }),
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(guards_1.OrganizationPermissionGuard),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALLOW_MODIFY_TIME),
    (0, decorators_1.OrganizationPolicyTarget)(time_log_entity_1.TimeLog),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Body)(pipes_2.TimeLogBodyTransformPipe, new common_1.ValidationPipe({ transform: true }))),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, dto_1.UpdateManualTimeLogDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], TimeLogController.prototype, "updateManualTime", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Delete time log' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'The time log has been successfully deleted.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input, The response body may contain clues as to what went wrong.'
    }),
    (0, common_1.UseGuards)(guards_1.OrganizationPermissionGuard),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALLOW_DELETE_TIME),
    (0, common_1.Delete)(),
    (0, pipes_1.UseValidationPipe)({ transform: true }),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.DeleteTimeLogDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], TimeLogController.prototype, "deleteTimeLog", null);
exports.TimeLogController = TimeLogController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('TimeLog'),
    (0, common_1.UseGuards)(guards_1.TenantBaseGuard, guards_1.PermissionGuard),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.TIME_TRACKER, contracts_1.PermissionsEnum.ALL_ORG_EDIT, contracts_1.PermissionsEnum.ALL_ORG_VIEW),
    (0, common_1.Controller)('/timesheet/time-log'),
    tslib_1.__metadata("design:paramtypes", [time_log_service_1.TimeLogService])
], TimeLogController);
//# sourceMappingURL=time-log.controller.js.map