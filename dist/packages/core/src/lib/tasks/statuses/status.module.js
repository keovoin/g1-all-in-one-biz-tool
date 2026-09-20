"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskStatusModule = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const nestjs_1 = require("@mikro-orm/nestjs");
const role_permission_module_1 = require("../../role-permission/role-permission.module");
const status_entity_1 = require("./status.entity");
const status_controller_1 = require("./status.controller");
const status_service_1 = require("./status.service");
const handlers_1 = require("./commands/handlers");
const handlers_2 = require("./queries/handlers");
const type_orm_task_status_repository_1 = require("./repository/type-orm-task-status.repository");
const mikro_orm_task_status_repository_1 = require("./repository/mikro-orm-task-status.repository");
let TaskStatusModule = class TaskStatusModule {
};
exports.TaskStatusModule = TaskStatusModule;
exports.TaskStatusModule = TaskStatusModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([status_entity_1.TaskStatus]),
            nestjs_1.MikroOrmModule.forFeature([status_entity_1.TaskStatus]),
            role_permission_module_1.RolePermissionModule,
            cqrs_1.CqrsModule
        ],
        controllers: [status_controller_1.TaskStatusController],
        providers: [
            status_service_1.TaskStatusService,
            type_orm_task_status_repository_1.TypeOrmTaskStatusRepository,
            mikro_orm_task_status_repository_1.MikroOrmTaskStatusRepository,
            ...handlers_2.QueryHandlers,
            ...handlers_1.CommandHandlers
        ],
        exports: [status_service_1.TaskStatusService]
    })
], TaskStatusModule);
//# sourceMappingURL=status.module.js.map