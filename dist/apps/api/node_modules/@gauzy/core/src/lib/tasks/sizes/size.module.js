"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskSizeModule = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const nestjs_1 = require("@mikro-orm/nestjs");
const role_permission_module_1 = require("../../role-permission/role-permission.module");
const size_entity_1 = require("./size.entity");
const size_service_1 = require("./size.service");
const size_controller_1 = require("./size.controller");
const handlers_1 = require("./commands/handlers");
const type_orm_task_size_repository_1 = require("./repository/type-orm-task-size.repository");
const mikro_orm_task_size_repository_1 = require("./repository/mikro-orm-task-size.repository");
let TaskSizeModule = class TaskSizeModule {
};
exports.TaskSizeModule = TaskSizeModule;
exports.TaskSizeModule = TaskSizeModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([size_entity_1.TaskSize]),
            nestjs_1.MikroOrmModule.forFeature([size_entity_1.TaskSize]),
            cqrs_1.CqrsModule,
            role_permission_module_1.RolePermissionModule
        ],
        controllers: [size_controller_1.TaskSizeController],
        providers: [size_service_1.TaskSizeService, type_orm_task_size_repository_1.TypeOrmTaskSizeRepository, mikro_orm_task_size_repository_1.MikroOrmTaskSizeRepository, ...handlers_1.CommandHandlers],
        exports: [size_service_1.TaskSizeService]
    })
], TaskSizeModule);
//# sourceMappingURL=size.module.js.map