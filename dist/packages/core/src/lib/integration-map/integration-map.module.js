"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationMapModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const cqrs_1 = require("@nestjs/cqrs");
const nestjs_1 = require("@mikro-orm/nestjs");
const role_permission_module_1 = require("../role-permission/role-permission.module");
const task_module_1 = require("../tasks/task.module");
const tag_module_1 = require("../tags/tag.module");
const handlers_1 = require("./commands/handlers");
const integration_map_controller_1 = require("./integration-map.controller");
const integration_map_service_1 = require("./integration-map.service");
const integration_map_entity_1 = require("./integration-map.entity");
const type_orm_integration_map_repository_1 = require("./repository/type-orm-integration-map.repository");
const mikro_orm_integration_map_repository_1 = require("./repository/mikro-orm-integration-map.repository");
let IntegrationMapModule = class IntegrationMapModule {
};
exports.IntegrationMapModule = IntegrationMapModule;
exports.IntegrationMapModule = IntegrationMapModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([integration_map_entity_1.IntegrationMap]),
            nestjs_1.MikroOrmModule.forFeature([integration_map_entity_1.IntegrationMap]),
            role_permission_module_1.RolePermissionModule,
            task_module_1.TaskModule,
            tag_module_1.TagModule,
            cqrs_1.CqrsModule
        ],
        controllers: [integration_map_controller_1.IntegrationMapController],
        providers: [integration_map_service_1.IntegrationMapService, type_orm_integration_map_repository_1.TypeOrmIntegrationMapRepository, mikro_orm_integration_map_repository_1.MikroOrmIntegrationMapRepository, ...handlers_1.CommandHandlers],
        exports: [integration_map_service_1.IntegrationMapService]
    })
], IntegrationMapModule);
//# sourceMappingURL=integration-map.module.js.map