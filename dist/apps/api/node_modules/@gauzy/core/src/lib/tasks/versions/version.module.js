"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskVersionModule = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const nestjs_1 = require("@mikro-orm/nestjs");
const role_permission_module_1 = require("../../role-permission/role-permission.module");
const version_entity_1 = require("./version.entity");
const version_controller_1 = require("./version.controller");
const version_service_1 = require("./version.service");
const handlers_1 = require("./commands/handlers");
const handlers_2 = require("./queries/handlers");
const type_orm_task_version_repository_1 = require("./repository/type-orm-task-version.repository");
const mikro_orm_task_version_repository_1 = require("./repository/mikro-orm-task-version.repository");
let TaskVersionModule = class TaskVersionModule {
};
exports.TaskVersionModule = TaskVersionModule;
exports.TaskVersionModule = TaskVersionModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([version_entity_1.TaskVersion]),
            nestjs_1.MikroOrmModule.forFeature([version_entity_1.TaskVersion]),
            role_permission_module_1.RolePermissionModule,
            cqrs_1.CqrsModule
        ],
        controllers: [version_controller_1.TaskVersionController],
        providers: [version_service_1.TaskVersionService, type_orm_task_version_repository_1.TypeOrmTaskVersionRepository, mikro_orm_task_version_repository_1.MikroOrmTaskVersionRepository, ...handlers_2.QueryHandlers, ...handlers_1.CommandHandlers],
        exports: [version_service_1.TaskVersionService]
    })
], TaskVersionModule);
//# sourceMappingURL=version.module.js.map