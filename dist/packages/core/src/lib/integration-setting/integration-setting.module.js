"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationSettingModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const cqrs_1 = require("@nestjs/cqrs");
const nestjs_1 = require("@mikro-orm/nestjs");
const role_permission_module_1 = require("../role-permission/role-permission.module");
const handlers_1 = require("./commands/handlers");
const integration_setting_controller_1 = require("./integration-setting.controller");
const integration_setting_service_1 = require("./integration-setting.service");
const integration_setting_entity_1 = require("./integration-setting.entity");
const type_orm_integration_setting_repository_1 = require("./repository/type-orm-integration-setting.repository");
const mikro_orm_integration_setting_repository_1 = require("./repository/mikro-orm-integration-setting.repository");
let IntegrationSettingModule = class IntegrationSettingModule {
};
exports.IntegrationSettingModule = IntegrationSettingModule;
exports.IntegrationSettingModule = IntegrationSettingModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([integration_setting_entity_1.IntegrationSetting]),
            nestjs_1.MikroOrmModule.forFeature([integration_setting_entity_1.IntegrationSetting]),
            role_permission_module_1.RolePermissionModule,
            cqrs_1.CqrsModule
        ],
        controllers: [integration_setting_controller_1.IntegrationSettingController],
        providers: [integration_setting_service_1.IntegrationSettingService, type_orm_integration_setting_repository_1.TypeOrmIntegrationSettingRepository, mikro_orm_integration_setting_repository_1.MikroOrmIntegrationSettingRepository, ...handlers_1.CommandHandlers],
        exports: [typeorm_1.TypeOrmModule, nestjs_1.MikroOrmModule, integration_setting_service_1.IntegrationSettingService, type_orm_integration_setting_repository_1.TypeOrmIntegrationSettingRepository, mikro_orm_integration_setting_repository_1.MikroOrmIntegrationSettingRepository]
    })
], IntegrationSettingModule);
//# sourceMappingURL=integration-setting.module.js.map