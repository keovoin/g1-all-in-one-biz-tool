"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimesheetModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const typeorm_1 = require("@nestjs/typeorm");
const nestjs_1 = require("@mikro-orm/nestjs");
const email_send_module_1 = require("./../../email-send/email-send.module");
const role_permission_module_1 = require("../../role-permission/role-permission.module");
const employee_module_1 = require("./../../employee/employee.module");
const time_slot_module_1 = require("./../time-slot/time-slot.module");
const handlers_1 = require("./commands/handlers");
const timesheet_controller_1 = require("./timesheet.controller");
const timesheet_service_1 = require("./timesheet.service");
const timesheet_entity_1 = require("./timesheet.entity");
const type_orm_timesheet_repository_1 = require("./repository/type-orm-timesheet.repository");
const mikro_orm_timesheet_repository_1 = require("./repository/mikro-orm-timesheet.repository");
let TimesheetModule = class TimesheetModule {
};
exports.TimesheetModule = TimesheetModule;
exports.TimesheetModule = TimesheetModule = tslib_1.__decorate([
    (0, common_1.Module)({
        controllers: [timesheet_controller_1.TimeSheetController],
        imports: [
            typeorm_1.TypeOrmModule.forFeature([timesheet_entity_1.Timesheet]),
            nestjs_1.MikroOrmModule.forFeature([timesheet_entity_1.Timesheet]),
            cqrs_1.CqrsModule,
            email_send_module_1.EmailSendModule,
            role_permission_module_1.RolePermissionModule,
            time_slot_module_1.TimeSlotModule,
            employee_module_1.EmployeeModule
        ],
        providers: [timesheet_service_1.TimeSheetService, type_orm_timesheet_repository_1.TypeOrmTimesheetRepository, mikro_orm_timesheet_repository_1.MikroOrmTimesheetRepository, ...handlers_1.CommandHandlers],
        exports: [timesheet_service_1.TimeSheetService, type_orm_timesheet_repository_1.TypeOrmTimesheetRepository, mikro_orm_timesheet_repository_1.MikroOrmTimesheetRepository]
    })
], TimesheetModule);
//# sourceMappingURL=timesheet.module.js.map