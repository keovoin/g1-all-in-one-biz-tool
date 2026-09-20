"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationTenantModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const cqrs_1 = require("@nestjs/cqrs");
const nestjs_1 = require("@mikro-orm/nestjs");
const event_bus_module_1 = require("../event-bus/event-bus.module");
const integration_tenant_controller_1 = require("./integration-tenant.controller");
const integration_tenant_service_1 = require("./integration-tenant.service");
const integration_tenant_entity_1 = require("./integration-tenant.entity");
const integration_setting_module_1 = require("./../integration-setting/integration-setting.module");
const integration_entity_setting_module_1 = require("./../integration-entity-setting/integration-entity-setting.module");
const role_module_1 = require("../role/role.module");
const handlers_1 = require("./commands/handlers");
const role_permission_module_1 = require("../role-permission/role-permission.module");
const type_orm_integration_tenant_repository_1 = require("./repository/type-orm-integration-tenant.repository");
const mikro_orm_integration_tenant_repository_1 = require("./repository/mikro-orm-integration-tenant.repository");
let IntegrationTenantModule = class IntegrationTenantModule {
};
exports.IntegrationTenantModule = IntegrationTenantModule;
exports.IntegrationTenantModule = IntegrationTenantModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([integration_tenant_entity_1.IntegrationTenant]),
            nestjs_1.MikroOrmModule.forFeature([integration_tenant_entity_1.IntegrationTenant]),
            role_module_1.RoleModule,
            role_permission_module_1.RolePermissionModule,
            (0, common_1.forwardRef)(() => integration_setting_module_1.IntegrationSettingModule),
            (0, common_1.forwardRef)(() => integration_entity_setting_module_1.IntegrationEntitySettingModule),
            cqrs_1.CqrsModule,
            event_bus_module_1.EventBusModule
        ],
        controllers: [integration_tenant_controller_1.IntegrationTenantController],
        providers: [integration_tenant_service_1.IntegrationTenantService, type_orm_integration_tenant_repository_1.TypeOrmIntegrationTenantRepository, mikro_orm_integration_tenant_repository_1.MikroOrmIntegrationTenantRepository, ...handlers_1.CommandHandlers],
        exports: [integration_tenant_service_1.IntegrationTenantService, type_orm_integration_tenant_repository_1.TypeOrmIntegrationTenantRepository, mikro_orm_integration_tenant_repository_1.MikroOrmIntegrationTenantRepository]
    })
], IntegrationTenantModule);
//# sourceMappingURL=integration-tenant.module.js.map