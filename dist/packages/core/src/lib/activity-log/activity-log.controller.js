"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityLogController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const decorators_1 = require("../shared/decorators");
const guards_1 = require("../shared/guards");
const pipes_1 = require("../shared/pipes");
const get_activity_logs_dto_1 = require("./dto/get-activity-logs.dto");
const activity_log_service_1 = require("./activity-log.service");
let ActivityLogController = class ActivityLogController {
    constructor(_activityLogService) {
        this._activityLogService = _activityLogService;
    }
    /**
     * Retrieves activity logs based on query parameters.
     * Supports filtering, pagination, sorting, and ordering.
     *
     * @param query Query parameters for filtering, pagination, and ordering.
     * @returns A list of activity logs.
     */
    async getActivityLogs(query) {
        return await this._activityLogService.findActivityLogs(query);
    }
};
exports.ActivityLogController = ActivityLogController;
tslib_1.__decorate([
    (0, common_1.Get)('/'),
    (0, pipes_1.UseValidationPipe)({ transform: true }),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [get_activity_logs_dto_1.GetActivityLogsDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], ActivityLogController.prototype, "getActivityLogs", null);
exports.ActivityLogController = ActivityLogController = tslib_1.__decorate([
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard, guards_1.PermissionGuard),
    (0, decorators_1.Permissions)(),
    (0, common_1.Controller)('/activity-log'),
    tslib_1.__metadata("design:paramtypes", [activity_log_service_1.ActivityLogService])
], ActivityLogController);
//# sourceMappingURL=activity-log.controller.js.map