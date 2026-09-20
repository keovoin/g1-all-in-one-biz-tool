"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeTrackingModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const activity_module_1 = require("./activity/activity.module");
const custom_tracking_module_1 = require("./custom-tracking/custom-tracking.module");
const screenshot_module_1 = require("./screenshot/screenshot.module");
const statistic_1 = require("./statistic");
const time_log_module_1 = require("./time-log/time-log.module");
const timer_module_1 = require("./timer/timer.module");
const timesheet_module_1 = require("./timesheet/timesheet.module");
const timesheet_project_change_request_module_1 = require("./timesheet/timesheet-project-change-request.module");
const time_slot_module_1 = require("./time-slot/time-slot.module");
let TimeTrackingModule = class TimeTrackingModule {
};
exports.TimeTrackingModule = TimeTrackingModule;
exports.TimeTrackingModule = TimeTrackingModule = tslib_1.__decorate([
    (0, common_1.Module)({
        controllers: [],
        imports: [
            timer_module_1.TimerModule,
            activity_module_1.ActivityModule,
            custom_tracking_module_1.CustomTrackingModule,
            time_log_module_1.TimeLogModule,
            time_slot_module_1.TimeSlotModule,
            screenshot_module_1.ScreenshotModule,
            statistic_1.StatisticModule,
            timesheet_module_1.TimesheetModule,
            timesheet_project_change_request_module_1.TimesheetProjectChangeRequestModule
        ]
    })
], TimeTrackingModule);
//# sourceMappingURL=time-tracking.module.js.map