"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeSettingModule = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const nestjs_1 = require("@mikro-orm/nestjs");
const handlers_1 = require("./commands/handlers");
const employee_setting_entity_1 = require("./employee-setting.entity");
const employee_setting_service_1 = require("./employee-setting.service");
const employee_setting_controller_1 = require("./employee-setting.controller");
const role_permission_module_1 = require("../role-permission/role-permission.module");
const type_orm_employee_setting_repository_1 = require("./repository/type-orm-employee-setting.repository");
const mikro_orm_employee_setting_repository_1 = require("./repository/mikro-orm-employee-setting.repository");
let EmployeeSettingModule = class EmployeeSettingModule {
};
exports.EmployeeSettingModule = EmployeeSettingModule;
exports.EmployeeSettingModule = EmployeeSettingModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([employee_setting_entity_1.EmployeeSetting]),
            nestjs_1.MikroOrmModule.forFeature([employee_setting_entity_1.EmployeeSetting]),
            cqrs_1.CqrsModule,
            role_permission_module_1.RolePermissionModule
        ],
        controllers: [employee_setting_controller_1.EmployeeSettingController],
        providers: [employee_setting_service_1.EmployeeSettingService, type_orm_employee_setting_repository_1.TypeOrmEmployeeSettingRepository, mikro_orm_employee_setting_repository_1.MikroOrmEmployeeSettingRepository, ...handlers_1.CommandHandlers]
    })
], EmployeeSettingModule);
//# sourceMappingURL=employee-setting.module.js.map