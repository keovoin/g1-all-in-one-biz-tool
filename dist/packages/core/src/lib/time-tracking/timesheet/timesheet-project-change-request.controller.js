"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimesheetProjectChangeRequestController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const contracts_1 = require("@gauzy/contracts");
const decorators_1 = require("./../../shared/decorators");
const guards_1 = require("./../../shared/guards");
const pipes_1 = require("./../../shared/pipes");
const dto_1 = require("./dto");
const timesheet_project_change_request_service_1 = require("./timesheet-project-change-request.service");
/**
 * Endpoints for the timesheet project change workflow (issue #9516).
 *
 * Raising a request needs nothing more than the time tracker permission every employee already
 * has — it changes no data on its own. Approving or rejecting one needs `CAN_APPROVE_TIMESHEET`,
 * the same permission that already gates approving a timesheet.
 */
let TimesheetProjectChangeRequestController = class TimesheetProjectChangeRequestController {
    constructor(timesheetProjectChangeRequestService) {
        this.timesheetProjectChangeRequestService = timesheetProjectChangeRequestService;
    }
    /**
     * Employee asks for the time booked to one project in their timesheet to be moved to another.
     *
     * @param input the request payload
     * @returns the created request, in `PENDING` state
     */
    async requestProjectChange(input) {
        return this.timesheetProjectChangeRequestService.requestProjectChange(input);
    }
    /**
     * Approve or reject a pending project change request.
     *
     * @param id the request to review
     * @param input the new status and an optional review note
     * @returns the reviewed request
     */
    async review(id, input) {
        return this.timesheetProjectChangeRequestService.review(id, input);
    }
    /**
     * List the project change requests raised against a timesheet.
     *
     * @param timesheetId the timesheet to list requests for
     * @param organizationId the organization the timesheet belongs to
     * @returns the matching requests, newest first
     */
    async findAllByTimesheet(timesheetId, organizationId) {
        return this.timesheetProjectChangeRequestService.findAllByTimesheet(timesheetId, organizationId);
    }
};
exports.TimesheetProjectChangeRequestController = TimesheetProjectChangeRequestController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Request a project change for a timesheet' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.CREATED, description: 'The project change request has been created.' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.BAD_REQUEST, description: 'Invalid input, check the response body for details' }),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.TIME_TRACKER),
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, pipes_1.UseValidationPipe)({ transform: true, whitelist: true }),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.RequestTimesheetProjectChangeDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], TimesheetProjectChangeRequestController.prototype, "requestProjectChange", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Approve or reject a project change request' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'The project change request has been reviewed.' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.NOT_FOUND, description: 'Record not found' }),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.CAN_APPROVE_TIMESHEET),
    (0, common_1.Put)('/:id/review'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, pipes_1.UseValidationPipe)({ transform: true, whitelist: true }),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, dto_1.ReviewTimesheetProjectChangeDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], TimesheetProjectChangeRequestController.prototype, "review", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get the project change requests of a timesheet' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'Found project change requests' }),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.TIME_TRACKER, contracts_1.PermissionsEnum.CAN_APPROVE_TIMESHEET),
    (0, common_1.Get)('/timesheet/:timesheetId'),
    tslib_1.__param(0, (0, common_1.Param)('timesheetId', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Query)('organizationId', pipes_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String]),
    tslib_1.__metadata("design:returntype", Promise)
], TimesheetProjectChangeRequestController.prototype, "findAllByTimesheet", null);
exports.TimesheetProjectChangeRequestController = TimesheetProjectChangeRequestController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('TimesheetProjectChangeRequest'),
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard, guards_1.PermissionGuard),
    (0, common_1.Controller)('/timesheet-project-change-request'),
    tslib_1.__metadata("design:paramtypes", [timesheet_project_change_request_service_1.TimesheetProjectChangeRequestService])
], TimesheetProjectChangeRequestController);
//# sourceMappingURL=timesheet-project-change-request.controller.js.map