"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiCallLogController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const contracts_1 = require("@gauzy/contracts");
const decorators_1 = require("../shared/decorators");
const guards_1 = require("../shared/guards");
const pipes_1 = require("../shared/pipes");
const api_call_log_service_1 = require("./api-call-log.service");
const api_call_log_filter_dto_1 = require("./dto/api-call-log-filter.dto");
const api_call_log_delete_dto_1 = require("./dto/api-call-log-delete.dto");
let ApiCallLogController = class ApiCallLogController {
    constructor(_apiCallLogService) {
        this._apiCallLogService = _apiCallLogService;
    }
    /**
     * Retrieves a paginated and filtered list of all API call logs from the system.
     *
     * @param filters DTO containing filtering options like `organizationId`, `correlationId`, `url`, etc.
     * @returns A promise that resolves to a paginated list of `IApiCallLog` objects.
     */
    async findAll(filters) {
        return this._apiCallLogService.findAllLogs(filters);
    }
    /**
     * Deletes an API call log by its ID.
     *
     * @param id The ID of the API call log to be deleted.
     * @returns A promise that resolves to an object indicating the delete status.
     */
    async deleteById(id, filters) {
        // If the forceDelete flag is set, perform a hard delete
        if (filters.forceDelete) {
            return this._apiCallLogService.delete(id, { where: { ...filters } });
        }
        // Otherwise, perform a soft delete
        return this._apiCallLogService.softDelete(id, { where: { ...filters } });
    }
};
exports.ApiCallLogController = ApiCallLogController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get all API call logs with mandatory organizationId and optional filters' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Returns a list of all API call logs with filters applied.'
    }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Internal server error.' }),
    (0, common_1.Get)('/'),
    (0, pipes_1.UseValidationPipe)(),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [api_call_log_filter_dto_1.ApiCallLogFilterDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], ApiCallLogController.prototype, "findAll", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Delete an API call log by ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'API call log deleted successfully.'
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'API call log not found.'
    }),
    (0, swagger_1.ApiResponse)({
        status: 500,
        description: 'Internal server error.'
    }),
    (0, common_1.Delete)('/:id'),
    (0, pipes_1.UseValidationPipe)(),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__param(1, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, api_call_log_delete_dto_1.DeleteApiCallLogDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], ApiCallLogController.prototype, "deleteById", null);
exports.ApiCallLogController = ApiCallLogController = tslib_1.__decorate([
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard, guards_1.PermissionGuard),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_VIEW, contracts_1.PermissionsEnum.API_CALL_LOG_READ),
    (0, common_1.Controller)('/api-call-log'),
    tslib_1.__metadata("design:paramtypes", [api_call_log_service_1.ApiCallLogService])
], ApiCallLogController);
//# sourceMappingURL=api-call-log.controller.js.map