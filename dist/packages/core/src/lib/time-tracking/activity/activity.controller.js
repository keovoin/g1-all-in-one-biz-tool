"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const contracts_1 = require("@gauzy/contracts");
const guards_1 = require("./../../shared/guards");
const decorators_1 = require("./../../shared/decorators");
const pipes_1 = require("../../shared/pipes");
const activity_service_1 = require("./activity.service");
const activity_map_service_1 = require("./activity.map.service");
const bulk_activities_input_dto_1 = require("./dto/bulk-activities-input.dto");
const dto_1 = require("./dto");
let ActivityController = class ActivityController {
    constructor(activityService, activityMapService) {
        this.activityService = activityService;
        this.activityMapService = activityMapService;
    }
    /**
     * Retrieves a paginated list of activities based on the provided query parameters.
     *
     * @param options - The query parameters for fetching activities, including pagination options.
     * @returns A promise resolving to a paginated list of activities.
     */
    async getActivities(options) {
        const defaultParams = { page: 0, limit: 30 };
        options = Object.assign({}, defaultParams, options);
        return await this.activityService.getActivities(options);
    }
    /**
     * Retrieves daily activities based on the provided query parameters.
     *
     * @param options - The query parameters for fetching daily activities.
     * @returns A promise resolving to a list of daily activities.
     */
    async getDailyActivities(options) {
        return await this.activityService.getDailyActivities(options);
    }
    /**
     * Retrieves a report of daily activities based on the provided query parameters.
     *
     * @param options - The query parameters for fetching the daily activities report, including grouping options.
     * @returns A promise resolving to a grouped report of daily activities.
     */
    async getDailyActivitiesReport(options) {
        let activities = await this.activityService.getDailyActivitiesReport(options);
        if (options.groupBy === contracts_1.ReportGroupFilterEnum.date) {
            activities = this.activityMapService.mapByDate(activities);
        }
        else if (options.groupBy === contracts_1.ReportGroupFilterEnum.employee) {
            activities = this.activityMapService.mapByEmployee(activities);
        }
        else if (options.groupBy === contracts_1.ReportGroupFilterEnum.project) {
            activities = this.activityMapService.mapByProject(activities);
        }
        return activities;
    }
    /**
     * Saves multiple activities in bulk.
     *
     * @param entities - The list of activities to be saved in bulk.
     * @returns A promise resolving when the bulk save is complete.
     */
    async bulkSaveActivities(entities) {
        return await this.activityService.bulkSave(entities);
    }
};
exports.ActivityController = ActivityController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Retrieve paginated activities',
        description: 'Fetches a paginated list of activities based on filters like date, employee, and project.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Successfully retrieved activities'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input, the request parameters may contain errors'
    }),
    (0, common_1.Get)('/'),
    (0, pipes_1.UseValidationPipe)({ transform: true, whitelist: true }),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.ActivityQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], ActivityController.prototype, "getActivities", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Retrieve daily activities',
        description: 'Fetches a list of daily activities filtered by parameters such as date, employee, and project.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Successfully retrieved daily activities'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input, the request parameters may contain errors'
    }),
    (0, common_1.Get)('/daily'),
    (0, pipes_1.UseValidationPipe)({ transform: true, whitelist: true }),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.ActivityQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], ActivityController.prototype, "getDailyActivities", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Retrieve daily activities report',
        description: 'Fetches a report of daily activities grouped by parameters like date, employee, or project.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Successfully retrieved the daily activities report'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input, the request parameters may contain errors'
    }),
    (0, common_1.Get)('/report'),
    (0, pipes_1.UseValidationPipe)({ transform: true, whitelist: true }),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.ActivityQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], ActivityController.prototype, "getDailyActivitiesReport", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Bulk save activities',
        description: 'Saves multiple activities in one request. Useful for bulk data insertion.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'The activities have been successfully saved'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input, the request body may contain errors'
    }),
    (0, common_1.Post)('/bulk'),
    (0, pipes_1.UseValidationPipe)(),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [bulk_activities_input_dto_1.BulkActivityInputDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], ActivityController.prototype, "bulkSaveActivities", null);
exports.ActivityController = ActivityController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('Activity'),
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard, guards_1.PermissionGuard),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.TIME_TRACKER, contracts_1.PermissionsEnum.TIMESHEET_EDIT_TIME),
    (0, common_1.Controller)('/timesheet/activity'),
    tslib_1.__metadata("design:paramtypes", [activity_service_1.ActivityService,
        activity_map_service_1.ActivityMapService])
], ActivityController);
//# sourceMappingURL=activity.controller.js.map