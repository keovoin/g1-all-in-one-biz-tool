"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantSettingModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const typeorm_1 = require("@nestjs/typeorm");
const nestjs_1 = require("@mikro-orm/nestjs");
const role_permission_module_1 = require("../../role-permission/role-permission.module");
const tenant_setting_controller_1 = require("./tenant-setting.controller");
const tenant_ui_preferences_controller_1 = require("./tenant-ui-preferences.controller");
const tenant_setting_entity_1 = require("./tenant-setting.entity");
const tenant_setting_service_1 = require("./tenant-setting.service");
const handlers_1 = require("./commands/handlers");
const type_orm_tenant_setting_repository_1 = require("./repository/type-orm-tenant-setting.repository");
const mikro_orm_tenant_setting_repository_1 = require("./repository/mikro-orm-tenant-setting.repository");
let TenantSettingModule = class TenantSettingModule {
};
exports.TenantSettingModule = TenantSettingModule;
exports.TenantSettingModule = TenantSettingModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([tenant_setting_entity_1.TenantSetting]),
            nestjs_1.MikroOrmModule.forFeature([tenant_setting_entity_1.TenantSetting]),
            role_permission_module_1.RolePermissionModule,
            cqrs_1.CqrsModule
        ],
        controllers: [tenant_setting_controller_1.TenantSettingController, tenant_ui_preferences_controller_1.TenantUiPreferencesController],
        providers: [tenant_setting_service_1.TenantSettingService, type_orm_tenant_setting_repository_1.TypeOrmTenantSettingRepository, mikro_orm_tenant_setting_repository_1.MikroOrmTenantSettingRepository, ...handlers_1.CommandHandlers],
        exports: [tenant_setting_service_1.TenantSettingService, type_orm_tenant_setting_repository_1.TypeOrmTenantSettingRepository, mikro_orm_tenant_setting_repository_1.MikroOrmTenantSettingRepository]
    })
], TenantSettingModule);
//# sourceMappingURL=tenant-setting.module.js.map