"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const cqrs_1 = require("@nestjs/cqrs");
const nestjs_1 = require("@mikro-orm/nestjs");
const role_permission_module_1 = require("../role-permission/role-permission.module");
const integration_tenant_module_1 = require("../integration-tenant/integration-tenant.module");
const integration_entity_1 = require("./integration.entity");
const integration_type_entity_1 = require("./integration-type.entity");
const integration_controller_1 = require("./integration.controller");
const integration_service_1 = require("./integration.service");
const integration_type_service_1 = require("./integration-type.service");
const handlers_1 = require("./commands/handlers");
const type_orm_integration_repository_1 = require("./repository/type-orm-integration.repository");
const mikro_orm_integration_repository_1 = require("./repository/mikro-orm-integration.repository");
const type_orm_integration_type_repository_1 = require("./repository/type-orm-integration-type.repository");
const mikro_orm_integration_type_repository_1 = require("./repository/mikro-orm-integration-type.repository");
let IntegrationModule = class IntegrationModule {
};
exports.IntegrationModule = IntegrationModule;
exports.IntegrationModule = IntegrationModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([integration_entity_1.Integration, integration_type_entity_1.IntegrationType]),
            nestjs_1.MikroOrmModule.forFeature([integration_entity_1.Integration, integration_type_entity_1.IntegrationType]),
            cqrs_1.CqrsModule,
            integration_tenant_module_1.IntegrationTenantModule,
            role_permission_module_1.RolePermissionModule
        ],
        controllers: [integration_controller_1.IntegrationController],
        providers: [
            integration_service_1.IntegrationService,
            integration_type_service_1.IntegrationTypeService,
            type_orm_integration_repository_1.TypeOrmIntegrationRepository, mikro_orm_integration_repository_1.MikroOrmIntegrationRepository,
            type_orm_integration_type_repository_1.TypeOrmIntegrationTypeRepository, mikro_orm_integration_type_repository_1.MikroOrmIntegrationTypeRepository,
            ...handlers_1.CommandHandlers
        ],
        exports: [integration_service_1.IntegrationService]
    })
], IntegrationModule);
//# sourceMappingURL=integration.module.js.map