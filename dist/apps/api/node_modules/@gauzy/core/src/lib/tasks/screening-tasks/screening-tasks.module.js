"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScreeningTasksModule = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const common_1 = require("@nestjs/common");
const nestjs_1 = require("@mikro-orm/nestjs");
const typeorm_1 = require("@nestjs/typeorm");
const role_permission_module_1 = require("../../role-permission/role-permission.module");
const task_module_1 = require("../task.module");
const organization_project_module_1 = require("../../organization-project/organization-project.module");
const handlers_1 = require("./commands/handlers");
const screening_tasks_service_1 = require("./screening-tasks.service");
const screening_tasks_controller_1 = require("./screening-tasks.controller");
const screening_task_entity_1 = require("./screening-task.entity");
const type_orm_screening_task_repository_1 = require("./repository/type-orm-screening-task.repository");
const mikro_orm_screening_task_repository_1 = require("./repository/mikro-orm-screening-task.repository");
let ScreeningTasksModule = class ScreeningTasksModule {
};
exports.ScreeningTasksModule = ScreeningTasksModule;
exports.ScreeningTasksModule = ScreeningTasksModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([screening_task_entity_1.ScreeningTask]),
            nestjs_1.MikroOrmModule.forFeature([screening_task_entity_1.ScreeningTask]),
            organization_project_module_1.OrganizationProjectModule,
            role_permission_module_1.RolePermissionModule,
            task_module_1.TaskModule,
            cqrs_1.CqrsModule
        ],
        providers: [screening_tasks_service_1.ScreeningTasksService, type_orm_screening_task_repository_1.TypeOrmScreeningTaskRepository, mikro_orm_screening_task_repository_1.MikroOrmScreeningTaskRepository, ...handlers_1.CommandHandlers],
        controllers: [screening_tasks_controller_1.ScreeningTasksController],
        exports: []
    })
], ScreeningTasksModule);
//# sourceMappingURL=screening-tasks.module.js.map