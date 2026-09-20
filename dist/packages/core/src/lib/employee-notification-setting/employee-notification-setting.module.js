"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeNotificationSettingModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const typeorm_1 = require("@nestjs/typeorm");
const nestjs_1 = require("@mikro-orm/nestjs");
const role_permission_module_1 = require("../role-permission/role-permission.module");
const handlers_1 = require("./commands/handlers");
const employee_notification_setting_service_1 = require("./employee-notification-setting.service");
const employee_notification_setting_controller_1 = require("./employee-notification-setting.controller");
const type_orm_employee_notification_setting_repository_1 = require("./repository/type-orm-employee-notification-setting.repository");
const mikro_orm_employee_notification_setting_repository_1 = require("./repository/mikro-orm-employee-notification-setting.repository");
const employee_notification_setting_entity_1 = require("./employee-notification-setting.entity");
let EmployeeNotificationSettingModule = class EmployeeNotificationSettingModule {
};
exports.EmployeeNotificationSettingModule = EmployeeNotificationSettingModule;
exports.EmployeeNotificationSettingModule = EmployeeNotificationSettingModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([employee_notification_setting_entity_1.EmployeeNotificationSetting]),
            nestjs_1.MikroOrmModule.forFeature([employee_notification_setting_entity_1.EmployeeNotificationSetting]),
            role_permission_module_1.RolePermissionModule,
            cqrs_1.CqrsModule
        ],
        controllers: [employee_notification_setting_controller_1.EmployeeNotificationSettingController],
        providers: [employee_notification_setting_service_1.EmployeeNotificationSettingService, type_orm_employee_notification_setting_repository_1.TypeOrmEmployeeNotificationSettingRepository, mikro_orm_employee_notification_setting_repository_1.MikroOrmEmployeeNotificationSettingRepository, ...handlers_1.CommandHandlers],
        exports: [employee_notification_setting_service_1.EmployeeNotificationSettingService]
    })
], EmployeeNotificationSettingModule);
//# sourceMappingURL=employee-notification-setting.module.js.map