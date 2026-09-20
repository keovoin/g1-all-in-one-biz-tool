"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileActivityController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const guards_1 = require("../../shared/guards");
const pipes_1 = require("../../shared/pipes");
const profile_activity_query_dto_1 = require("./dto/profile-activity-query.dto");
const statistic_service_1 = require("./statistic.service");
let ProfileActivityController = class ProfileActivityController {
    constructor(statisticService) {
        this.statisticService = statisticService;
    }
    getProfileActivity(query) {
        return this.statisticService.getProfileActivity(query);
    }
};
exports.ProfileActivityController = ProfileActivityController;
tslib_1.__decorate([
    (0, common_1.Get)('/profile-activity'),
    (0, pipes_1.UseValidationPipe)({ transform: true, whitelist: true }),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [profile_activity_query_dto_1.ProfileActivityQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], ProfileActivityController.prototype, "getProfileActivity", null);
exports.ProfileActivityController = ProfileActivityController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('TimesheetStatistic'),
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard),
    (0, common_1.Controller)('/timesheet/statistics'),
    tslib_1.__metadata("design:paramtypes", [statistic_service_1.StatisticService])
], ProfileActivityController);
//# sourceMappingURL=profile-activity.controller.js.map