"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeNotificationModule = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const nestjs_1 = require("@mikro-orm/nestjs");
const employee_notification_entity_1 = require("./employee-notification.entity");
const role_permission_module_1 = require("../role-permission/role-permission.module");
const employee_notification_setting_module_1 = require("../employee-notification-setting/employee-notification-setting.module");
const employee_notification_service_1 = require("./employee-notification.service");
const employee_notification_controller_1 = require("./employee-notification.controller");
const handlers_1 = require("./events/handlers");
const type_orm_employee_notification_repository_1 = require("./repository/type-orm-employee-notification.repository");
const mikro_orm_employee_notification_repository_1 = require("./repository/mikro-orm-employee-notification.repository");
let EmployeeNotificationModule = class EmployeeNotificationModule {
};
exports.EmployeeNotificationModule = EmployeeNotificationModule;
exports.EmployeeNotificationModule = EmployeeNotificationModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            cqrs_1.CqrsModule,
            typeorm_1.TypeOrmModule.forFeature([employee_notification_entity_1.EmployeeNotification]),
            nestjs_1.MikroOrmModule.forFeature([employee_notification_entity_1.EmployeeNotification]),
            employee_notification_setting_module_1.EmployeeNotificationSettingModule,
            role_permission_module_1.RolePermissionModule
        ],
        controllers: [employee_notification_controller_1.EmployeeNotificationController],
        providers: [employee_notification_service_1.EmployeeNotificationService, type_orm_employee_notification_repository_1.TypeOrmEmployeeNotificationRepository, mikro_orm_employee_notification_repository_1.MikroOrmEmployeeNotificationRepository, ...handlers_1.EventHandlers],
        exports: [employee_notification_service_1.EmployeeNotificationService]
    })
], EmployeeNotificationModule);
//# sourceMappingURL=employee-notification.module.js.map