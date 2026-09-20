"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationTaskSettingModule = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("@nestjs/typeorm");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const nestjs_1 = require("@mikro-orm/nestjs");
const organization_task_setting_controller_1 = require("./organization-task-setting.controller");
const organization_task_setting_service_1 = require("./organization-task-setting.service");
const role_permission_module_1 = require("../role-permission/role-permission.module");
const organization_task_setting_entity_1 = require("./organization-task-setting.entity");
const handlers_1 = require("./commands/handlers");
const type_orm_organization_task_setting_repository_1 = require("./repository/type-orm-organization-task-setting.repository");
const mikro_orm_organization_task_setting_repository_1 = require("./repository/mikro-orm-organization-task-setting.repository");
let OrganizationTaskSettingModule = class OrganizationTaskSettingModule {
};
exports.OrganizationTaskSettingModule = OrganizationTaskSettingModule;
exports.OrganizationTaskSettingModule = OrganizationTaskSettingModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([organization_task_setting_entity_1.OrganizationTaskSetting]),
            nestjs_1.MikroOrmModule.forFeature([organization_task_setting_entity_1.OrganizationTaskSetting]),
            role_permission_module_1.RolePermissionModule,
            cqrs_1.CqrsModule
        ],
        controllers: [organization_task_setting_controller_1.OrganizationTaskSettingController],
        providers: [organization_task_setting_service_1.OrganizationTaskSettingService, type_orm_organization_task_setting_repository_1.TypeOrmOrganizationTaskSettingRepository, mikro_orm_organization_task_setting_repository_1.MikroOrmOrganizationTaskSettingRepository, ...handlers_1.CommandHandlers],
        exports: [organization_task_setting_service_1.OrganizationTaskSettingService, type_orm_organization_task_setting_repository_1.TypeOrmOrganizationTaskSettingRepository, mikro_orm_organization_task_setting_repository_1.MikroOrmOrganizationTaskSettingRepository]
    })
], OrganizationTaskSettingModule);
//# sourceMappingURL=organization-task-setting.module.js.map