"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomTrackingController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const guards_1 = require("../../shared/guards");
const contracts_1 = require("@gauzy/contracts");
const decorators_1 = require("../../shared/decorators");
const pipes_1 = require("../../shared/pipes");
const custom_tracking_service_1 = require("./custom-tracking.service");
const dto_1 = require("./dto");
let CustomTrackingController = class CustomTrackingController {
    constructor(customTrackingService) {
        this.customTrackingService = customTrackingService;
    }
    /**
     * Submit custom tracking data
     */
    async submitTrackingData(input) {
        return await this.customTrackingService.submitTrackingData(input);
    }
    /**
     * Submit bulk custom tracking data
     */
    async submitBulkTrackingData(input) {
        return await this.customTrackingService.submitBulkTrackingData(input.list);
    }
    /**
     * Get custom tracking sessions with filtering and grouping
     */
    async getTrackingSessions(query) {
        return await this.customTrackingService.getTrackingSessions(query);
    }
    /**
     * Get tracking data for a specific TimeSlot
     */
    async getTimeSlotTrackingData(timeSlotId) {
        return await this.customTrackingService.getTimeSlotTrackingData(timeSlotId);
    }
    /**
     * Get tracking sessions by sessionId with efficient lookup
     */
    async getSessionsBySessionId(sessionId, startDate, endDate) {
        const start = startDate ? new Date(startDate) : undefined;
        const end = endDate ? new Date(endDate) : undefined;
        return await this.customTrackingService.getSessionsBySessionId(sessionId, undefined, undefined, start, end);
    }
    /**
     * Get active tracking sessions
     */
    async getActiveSessions(employeeId, activityThresholdMinutes) {
        return await this.customTrackingService.getActiveSessions(employeeId, Math.max(1, activityThresholdMinutes));
    }
};
exports.CustomTrackingController = CustomTrackingController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Submit custom tracking data',
        description: 'Submit encoded tracking data to be stored in the appropriate TimeSlot'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'Custom tracking data submitted successfully'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid tracking data or no active TimeSlot found'
    }),
    (0, common_1.Post)(''),
    (0, pipes_1.UseValidationPipe)({ transform: true }),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.ProcessTrackingDataDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], CustomTrackingController.prototype, "submitTrackingData", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Submit bulk custom tracking data',
        description: 'Submit multiple encoded tracking data entries to be processed in bulk'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'Bulk custom tracking data submitted successfully'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid bulk tracking data'
    }),
    (0, common_1.Post)('/bulk'),
    tslib_1.__param(0, (0, common_1.Body)(pipes_1.BulkBodyLoadTransformPipe, new common_1.ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
        forbidUnknownValues: true
    }))),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.CustomTrackingBulkInputDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], CustomTrackingController.prototype, "submitBulkTrackingData", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Get custom tracking sessions',
        description: 'Retrieve custom tracking sessions with optional filtering by date range, employee, and project'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Custom tracking sessions retrieved successfully'
    }),
    (0, common_1.Get)('/sessions'),
    (0, pipes_1.UseValidationPipe)({ whitelist: true, transform: true }),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.CustomTrackingSessionsQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], CustomTrackingController.prototype, "getTrackingSessions", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Get TimeSlot tracking data',
        description: 'Retrieve custom tracking data for a specific TimeSlot'
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        type: String,
        description: 'TimeSlot ID'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'TimeSlot tracking data retrieved successfully'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'TimeSlot not found'
    }),
    (0, common_1.Get)('/time-slot/:id'),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], CustomTrackingController.prototype, "getTimeSlotTrackingData", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Get tracking sessions by sessionId',
        description: 'Retrieve tracking sessions for a specific sessionId'
    }),
    (0, swagger_1.ApiParam)({
        name: 'sessionId',
        type: String,
        description: 'Session ID to search for'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Tracking sessions retrieved successfully'
    }),
    (0, common_1.Get)('/session/:sessionId'),
    tslib_1.__param(0, (0, common_1.Param)('sessionId')),
    tslib_1.__param(1, (0, common_1.Query)('startDate')),
    tslib_1.__param(2, (0, common_1.Query)('endDate')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String, String]),
    tslib_1.__metadata("design:returntype", Promise)
], CustomTrackingController.prototype, "getSessionsBySessionId", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Get active tracking sessions',
        description: 'Retrieve currently active tracking sessions with recent activity'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Active tracking sessions retrieved successfully'
    }),
    (0, common_1.Get)('/active'),
    tslib_1.__param(0, (0, common_1.Query)('employeeId', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Query)('activityThresholdMinutes', new common_1.DefaultValuePipe(30), common_1.ParseIntPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Number]),
    tslib_1.__metadata("design:returntype", Promise)
], CustomTrackingController.prototype, "getActiveSessions", null);
exports.CustomTrackingController = CustomTrackingController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('Custom Tracking'),
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard, guards_1.PermissionGuard),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.TIME_TRACKER, contracts_1.PermissionsEnum.ALL_ORG_EDIT, contracts_1.PermissionsEnum.ALL_ORG_VIEW),
    (0, common_1.Controller)('/timesheet/custom-tracking'),
    tslib_1.__metadata("design:paramtypes", [custom_tracking_service_1.CustomTrackingService])
], CustomTrackingController);
//# sourceMappingURL=custom-tracking.controller.js.map