"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeatureModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const typeorm_1 = require("@nestjs/typeorm");
const nestjs_1 = require("@mikro-orm/nestjs");
const feature_entity_1 = require("./feature.entity");
const feature_organization_entity_1 = require("./feature-organization.entity");
const feature_toggle_controller_1 = require("./feature-toggle.controller");
const feature_service_1 = require("./feature.service");
const feature_organization_service_1 = require("./feature-organization.service");
const role_permission_module_1 = require("../role-permission/role-permission.module");
const handlers_1 = require("./commands/handlers");
const type_orm_feature_repository_1 = require("./repository/type-orm-feature.repository");
const mikro_orm_feature_repository_1 = require("./repository/mikro-orm-feature.repository");
const type_orm_feature_organization_repository_1 = require("./repository/type-orm-feature-organization.repository");
const mikro_orm_feature_organization_repository_1 = require("./repository/mikro-orm-feature-organization.repository");
let FeatureModule = class FeatureModule {
};
exports.FeatureModule = FeatureModule;
exports.FeatureModule = FeatureModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([feature_entity_1.Feature, feature_organization_entity_1.FeatureOrganization]),
            nestjs_1.MikroOrmModule.forFeature([feature_entity_1.Feature, feature_organization_entity_1.FeatureOrganization]),
            (0, common_1.forwardRef)(() => role_permission_module_1.RolePermissionModule),
            cqrs_1.CqrsModule
        ],
        controllers: [feature_toggle_controller_1.FeatureToggleController],
        providers: [
            feature_service_1.FeatureService,
            feature_organization_service_1.FeatureOrganizationService,
            type_orm_feature_repository_1.TypeOrmFeatureRepository,
            mikro_orm_feature_repository_1.MikroOrmFeatureRepository,
            type_orm_feature_organization_repository_1.TypeOrmFeatureOrganizationRepository,
            mikro_orm_feature_organization_repository_1.MikroOrmFeatureOrganizationRepository,
            ...handlers_1.CommandHandlers
        ],
        exports: [feature_service_1.FeatureService, feature_organization_service_1.FeatureOrganizationService]
    })
], FeatureModule);
//# sourceMappingURL=feature.module.js.map