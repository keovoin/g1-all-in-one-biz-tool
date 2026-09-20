"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentEmployeesModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const nestjs_1 = require("@mikro-orm/nestjs");
const appointment_employees_entity_1 = require("./appointment-employees.entity");
const appointment_employees_controller_1 = require("./appointment-employees.controller");
const appointment_employees_service_1 = require("./appointment-employees.service");
const role_permission_module_1 = require("../role-permission/role-permission.module");
const type_orm_appointment_employee_repository_1 = require("./repository/type-orm-appointment-employee.repository");
const mikro_orm_appointment_employee_repository_1 = require("./repository/mikro-orm-appointment-employee.repository");
let AppointmentEmployeesModule = class AppointmentEmployeesModule {
};
exports.AppointmentEmployeesModule = AppointmentEmployeesModule;
exports.AppointmentEmployeesModule = AppointmentEmployeesModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([appointment_employees_entity_1.AppointmentEmployee]),
            nestjs_1.MikroOrmModule.forFeature([appointment_employees_entity_1.AppointmentEmployee]),
            role_permission_module_1.RolePermissionModule
        ],
        controllers: [appointment_employees_controller_1.AppointmentEmployeesController],
        providers: [appointment_employees_service_1.AppointmentEmployeesService, type_orm_appointment_employee_repository_1.TypeOrmAppointmentEmployeeRepository, mikro_orm_appointment_employee_repository_1.MikroOrmAppointmentEmployeeRepository]
    })
], AppointmentEmployeesModule);
//# sourceMappingURL=appointment-employees.module.js.map