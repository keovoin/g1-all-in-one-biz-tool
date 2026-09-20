"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationEntitySettingTiedModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const cqrs_1 = require("@nestjs/cqrs");
const nestjs_1 = require("@mikro-orm/nestjs");
const integration_entity_setting_tied_entity_1 = require("./integration-entity-setting-tied.entity");
const integration_entity_setting_tied_controller_1 = require("./integration-entity-setting-tied.controller");
const integration_entity_setting_tied_service_1 = require("./integration-entity-setting-tied.service");
const role_permission_module_1 = require("../role-permission/role-permission.module");
const type_orm_integration_entity_setting_tied_repository_1 = require("./repository/type-orm-integration-entity-setting-tied.repository");
const mikro_orm_integration_entity_setting_tied_repository_1 = require("./repository/mikro-orm-integration-entity-setting-tied.repository");
let IntegrationEntitySettingTiedModule = class IntegrationEntitySettingTiedModule {
};
exports.IntegrationEntitySettingTiedModule = IntegrationEntitySettingTiedModule;
exports.IntegrationEntitySettingTiedModule = IntegrationEntitySettingTiedModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([integration_entity_setting_tied_entity_1.IntegrationEntitySettingTied]),
            nestjs_1.MikroOrmModule.forFeature([integration_entity_setting_tied_entity_1.IntegrationEntitySettingTied]),
            role_permission_module_1.RolePermissionModule,
            cqrs_1.CqrsModule
        ],
        controllers: [integration_entity_setting_tied_controller_1.IntegrationEntitySettingTiedController],
        providers: [integration_entity_setting_tied_service_1.IntegrationEntitySettingTiedService, type_orm_integration_entity_setting_tied_repository_1.TypeOrmIntegrationEntitySettingTiedRepository, mikro_orm_integration_entity_setting_tied_repository_1.MikroOrmIntegrationEntitySettingTiedRepository],
        exports: [integration_entity_setting_tied_service_1.IntegrationEntitySettingTiedService]
    })
], IntegrationEntitySettingTiedModule);
//# sourceMappingURL=integration-entity-setting-tied.module.js.map