"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeAppointmentModule = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("@nestjs/typeorm");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const nestjs_1 = require("@mikro-orm/nestjs");
const employee_appointment_entity_1 = require("./employee-appointment.entity");
const employee_appointment_controller_1 = require("./employee-appointment.controller");
const employee_appointment_service_1 = require("./employee-appointment.service");
const handlers_1 = require("./commands/handlers");
const email_send_module_1 = require("../email-send/email-send.module");
const employee_module_1 = require("../employee/employee.module");
const organization_module_1 = require("../organization/organization.module");
const role_permission_module_1 = require("../role-permission/role-permission.module");
const type_orm_employee_appointment_repository_1 = require("./repository/type-orm-employee-appointment.repository");
const mikro_orm_employee_appointment_repository_1 = require("./repository/mikro-orm-employee-appointment.repository");
let EmployeeAppointmentModule = class EmployeeAppointmentModule {
};
exports.EmployeeAppointmentModule = EmployeeAppointmentModule;
exports.EmployeeAppointmentModule = EmployeeAppointmentModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([employee_appointment_entity_1.EmployeeAppointment]),
            nestjs_1.MikroOrmModule.forFeature([employee_appointment_entity_1.EmployeeAppointment]),
            email_send_module_1.EmailSendModule,
            employee_module_1.EmployeeModule,
            organization_module_1.OrganizationModule,
            role_permission_module_1.RolePermissionModule,
            cqrs_1.CqrsModule
        ],
        controllers: [employee_appointment_controller_1.EmployeeAppointmentController],
        providers: [employee_appointment_service_1.EmployeeAppointmentService, type_orm_employee_appointment_repository_1.TypeOrmEmployeeAppointmentRepository, mikro_orm_employee_appointment_repository_1.MikroOrmEmployeeAppointmentRepository, ...handlers_1.CommandHandlers],
        exports: [employee_appointment_service_1.EmployeeAppointmentService, type_orm_employee_appointment_repository_1.TypeOrmEmployeeAppointmentRepository, mikro_orm_employee_appointment_repository_1.MikroOrmEmployeeAppointmentRepository]
    })
], EmployeeAppointmentModule);
//# sourceMappingURL=employee-appointment.module.js.map