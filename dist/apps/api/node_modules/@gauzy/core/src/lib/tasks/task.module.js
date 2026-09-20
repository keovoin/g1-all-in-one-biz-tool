"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const cqrs_1 = require("@nestjs/cqrs");
const nestjs_1 = require("@mikro-orm/nestjs");
const event_bus_module_1 = require("../event-bus/event-bus.module");
const internal_1 = require("../core/entities/internal");
const handlers_1 = require("./commands/handlers");
const role_permission_module_1 = require("../role-permission/role-permission.module");
const user_module_1 = require("./../user/user.module");
const role_module_1 = require("./../role/role.module");
const employee_module_1 = require("./../employee/employee.module");
const organization_project_module_1 = require("./../organization-project/organization-project.module");
const organization_sprint_module_1 = require("./../organization-sprint/organization-sprint.module");
const view_module_1 = require("./views/view.module");
const task_entity_1 = require("./task.entity");
const task_service_1 = require("./task.service");
const task_controller_1 = require("./task.controller");
const type_orm_task_repository_1 = require("./repository/type-orm-task.repository");
const mikro_orm_task_repository_1 = require("./repository/mikro-orm-task.repository");
const employee_notification_module_1 = require("../employee-notification/employee-notification.module");
let TaskModule = class TaskModule {
};
exports.TaskModule = TaskModule;
exports.TaskModule = TaskModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([task_entity_1.Task, internal_1.TaskStatus, internal_1.IntegrationMap]),
            nestjs_1.MikroOrmModule.forFeature([task_entity_1.Task, internal_1.TaskStatus, internal_1.IntegrationMap]),
            role_permission_module_1.RolePermissionModule,
            (0, common_1.forwardRef)(() => user_module_1.UserModule),
            role_module_1.RoleModule,
            employee_module_1.EmployeeModule,
            organization_project_module_1.OrganizationProjectModule,
            organization_sprint_module_1.OrganizationSprintModule,
            view_module_1.TaskViewModule,
            employee_notification_module_1.EmployeeNotificationModule,
            cqrs_1.CqrsModule,
            event_bus_module_1.EventBusModule
        ],
        controllers: [task_controller_1.TaskController],
        providers: [task_service_1.TaskService, type_orm_task_repository_1.TypeOrmTaskRepository, mikro_orm_task_repository_1.MikroOrmTaskRepository, ...handlers_1.CommandHandlers],
        exports: [task_service_1.TaskService, type_orm_task_repository_1.TypeOrmTaskRepository, mikro_orm_task_repository_1.MikroOrmTaskRepository]
    })
], TaskModule);
//# sourceMappingURL=task.module.js.map