"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskViewModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const typeorm_1 = require("@nestjs/typeorm");
const nestjs_1 = require("@mikro-orm/nestjs");
const role_permission_module_1 = require("../../role-permission/role-permission.module");
const view_entity_1 = require("./view.entity");
const handlers_1 = require("./commands/handlers");
const view_service_1 = require("./view.service");
const view_controller_1 = require("./view.controller");
const type_orm_task_view_repository_1 = require("./repository/type-orm-task-view.repository");
const mikro_orm_task_view_repository_1 = require("./repository/mikro-orm-task-view.repository");
let TaskViewModule = class TaskViewModule {
};
exports.TaskViewModule = TaskViewModule;
exports.TaskViewModule = TaskViewModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([view_entity_1.TaskView]),
            nestjs_1.MikroOrmModule.forFeature([view_entity_1.TaskView]),
            role_permission_module_1.RolePermissionModule,
            cqrs_1.CqrsModule
        ],
        providers: [view_service_1.TaskViewService, type_orm_task_view_repository_1.TypeOrmTaskViewRepository, mikro_orm_task_view_repository_1.MikroOrmTaskViewRepository, ...handlers_1.CommandHandlers],
        controllers: [view_controller_1.TaskViewController],
        exports: [view_service_1.TaskViewService, type_orm_task_view_repository_1.TypeOrmTaskViewRepository, mikro_orm_task_view_repository_1.MikroOrmTaskViewRepository]
    })
], TaskViewModule);
//# sourceMappingURL=view.module.js.map