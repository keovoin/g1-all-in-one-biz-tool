"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimerModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const time_log_module_1 = require("./../time-log/time-log.module");
const employee_module_1 = require("./../../employee/employee.module");
const role_permission_module_1 = require("../../role-permission/role-permission.module");
const timer_controller_1 = require("./timer.controller");
const timer_service_1 = require("./timer.service");
const handlers_1 = require("./commands/handlers");
const handlers_2 = require("./queries/handlers");
let TimerModule = class TimerModule {
};
exports.TimerModule = TimerModule;
exports.TimerModule = TimerModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [role_permission_module_1.RolePermissionModule, time_log_module_1.TimeLogModule, employee_module_1.EmployeeModule, cqrs_1.CqrsModule],
        controllers: [timer_controller_1.TimerController],
        exports: [timer_service_1.TimerService],
        providers: [timer_service_1.TimerService, ...handlers_1.CommandHandlers, ...handlers_2.QueryHandlers]
    })
], TimerModule);
//# sourceMappingURL=timer.module.js.map