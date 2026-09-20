"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationEntitySettingModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const cqrs_1 = require("@nestjs/cqrs");
const nestjs_1 = require("@mikro-orm/nestjs");
const role_permission_module_1 = require("../role-permission/role-permission.module");
const integration_tenant_module_1 = require("./../integration-tenant/integration-tenant.module");
const handlers_1 = require("./commands/handlers");
const integration_entity_setting_entity_1 = require("./integration-entity-setting.entity");
const integration_entity_setting_controller_1 = require("./integration-entity-setting.controller");
const integration_entity_setting_service_1 = require("./integration-entity-setting.service");
const type_orm_integration_entity_setting_repository_1 = require("./repository/type-orm-integration-entity-setting.repository");
const mikro_orm_integration_entity_setting_repository_1 = require("./repository/mikro-orm-integration-entity-setting.repository");
let IntegrationEntitySettingModule = class IntegrationEntitySettingModule {
};
exports.IntegrationEntitySettingModule = IntegrationEntitySettingModule;
exports.IntegrationEntitySettingModule = IntegrationEntitySettingModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([integration_entity_setting_entity_1.IntegrationEntitySetting]),
            nestjs_1.MikroOrmModule.forFeature([integration_entity_setting_entity_1.IntegrationEntitySetting]),
            (0, common_1.forwardRef)(() => integration_tenant_module_1.IntegrationTenantModule),
            role_permission_module_1.RolePermissionModule,
            cqrs_1.CqrsModule
        ],
        controllers: [integration_entity_setting_controller_1.IntegrationEntitySettingController],
        providers: [integration_entity_setting_service_1.IntegrationEntitySettingService, type_orm_integration_entity_setting_repository_1.TypeOrmIntegrationEntitySettingRepository, mikro_orm_integration_entity_setting_repository_1.MikroOrmIntegrationEntitySettingRepository, ...handlers_1.CommandHandlers],
        exports: [integration_entity_setting_service_1.IntegrationEntitySettingService]
    })
], IntegrationEntitySettingModule);
//# sourceMappingURL=integration-entity-setting.module.js.map