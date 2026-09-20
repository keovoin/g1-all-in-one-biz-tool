"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskEstimationModule = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const nestjs_1 = require("@mikro-orm/nestjs");
const role_permission_module_1 = require("../../role-permission/role-permission.module");
const task_estimation_entity_1 = require("./task-estimation.entity");
const task_estimation_controller_1 = require("./task-estimation.controller");
const task_estimation_service_1 = require("./task-estimation.service");
const task_module_1 = require("../task.module");
const handlers_1 = require("./commands/handlers");
const type_orm_estimation_repository_1 = require("./repository/type-orm-estimation.repository");
const mikro_orm_estimation_repository_1 = require("./repository/mikro-orm-estimation.repository");
let TaskEstimationModule = class TaskEstimationModule {
};
exports.TaskEstimationModule = TaskEstimationModule;
exports.TaskEstimationModule = TaskEstimationModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([task_estimation_entity_1.TaskEstimation]),
            nestjs_1.MikroOrmModule.forFeature([task_estimation_entity_1.TaskEstimation]),
            role_permission_module_1.RolePermissionModule,
            cqrs_1.CqrsModule,
            task_module_1.TaskModule
        ],
        controllers: [task_estimation_controller_1.TaskEstimationController],
        providers: [task_estimation_service_1.TaskEstimationService, type_orm_estimation_repository_1.TypeOrmTaskEstimationRepository, mikro_orm_estimation_repository_1.MikroOrmTaskEstimationRepository, ...handlers_1.CommandHandlers]
    })
], TaskEstimationModule);
//# sourceMappingURL=task-estimation.module.js.map