"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskPriorityModule = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const nestjs_1 = require("@mikro-orm/nestjs");
const role_permission_module_1 = require("../../role-permission/role-permission.module");
const priority_controller_1 = require("./priority.controller");
const priority_entity_1 = require("./priority.entity");
const priority_service_1 = require("./priority.service");
const handlers_1 = require("./commands/handlers");
const type_orm_task_priority_repository_1 = require("./repository/type-orm-task-priority.repository");
const mikro_orm_task_priority_repository_1 = require("./repository/mikro-orm-task-priority.repository");
let TaskPriorityModule = class TaskPriorityModule {
};
exports.TaskPriorityModule = TaskPriorityModule;
exports.TaskPriorityModule = TaskPriorityModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([priority_entity_1.TaskPriority]),
            nestjs_1.MikroOrmModule.forFeature([priority_entity_1.TaskPriority]),
            role_permission_module_1.RolePermissionModule,
            cqrs_1.CqrsModule
        ],
        controllers: [priority_controller_1.TaskPriorityController],
        providers: [priority_service_1.TaskPriorityService, type_orm_task_priority_repository_1.TypeOrmTaskPriorityRepository, mikro_orm_task_priority_repository_1.MikroOrmTaskPriorityRepository, ...handlers_1.CommandHandlers],
        exports: [priority_service_1.TaskPriorityService]
    })
], TaskPriorityModule);
//# sourceMappingURL=priority.module.js.map