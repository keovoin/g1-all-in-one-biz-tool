"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatisticModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const employee_module_1 = require("./../../employee/employee.module");
const user_module_1 = require("./../../user/user.module");
const organization_project_module_1 = require("./../../organization-project/organization-project.module");
const statistic_controller_1 = require("./statistic.controller");
const profile_activity_controller_1 = require("./profile-activity.controller");
const statistic_service_1 = require("./statistic.service");
const task_module_1 = require("./../../tasks/task.module");
const time_slot_module_1 = require("./../time-slot/time-slot.module");
const activity_module_1 = require("./../activity/activity.module");
const time_log_module_1 = require("./../time-log/time-log.module");
const role_permission_module_1 = require("../../role-permission/role-permission.module");
let StatisticModule = class StatisticModule {
};
exports.StatisticModule = StatisticModule;
exports.StatisticModule = StatisticModule = tslib_1.__decorate([
    (0, common_1.Module)({
        controllers: [statistic_controller_1.StatisticController, profile_activity_controller_1.ProfileActivityController],
        imports: [
            role_permission_module_1.RolePermissionModule,
            organization_project_module_1.OrganizationProjectModule,
            task_module_1.TaskModule,
            time_slot_module_1.TimeSlotModule,
            employee_module_1.EmployeeModule,
            user_module_1.UserModule,
            activity_module_1.ActivityModule,
            time_log_module_1.TimeLogModule
        ],
        providers: [statistic_service_1.StatisticService],
        exports: [statistic_service_1.StatisticService]
    })
], StatisticModule);
//# sourceMappingURL=statistic.module.js.map