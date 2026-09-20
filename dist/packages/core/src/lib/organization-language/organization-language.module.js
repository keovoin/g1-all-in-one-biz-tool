"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationLanguageModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const nestjs_1 = require("@mikro-orm/nestjs");
const organization_language_entity_1 = require("./organization-language.entity");
const organization_language_controller_1 = require("./organization-language.controller");
const organization_language_service_1 = require("./organization-language.service");
const role_permission_module_1 = require("../role-permission/role-permission.module");
const type_orm_organization_language_repository_1 = require("./repository/type-orm-organization-language.repository");
const mikro_orm_organization_language_repository_1 = require("./repository/mikro-orm-organization-language.repository");
let OrganizationLanguageModule = class OrganizationLanguageModule {
};
exports.OrganizationLanguageModule = OrganizationLanguageModule;
exports.OrganizationLanguageModule = OrganizationLanguageModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([organization_language_entity_1.OrganizationLanguage]),
            nestjs_1.MikroOrmModule.forFeature([organization_language_entity_1.OrganizationLanguage]),
            role_permission_module_1.RolePermissionModule
        ],
        controllers: [organization_language_controller_1.OrganizationLanguageController],
        providers: [organization_language_service_1.OrganizationLanguageService, type_orm_organization_language_repository_1.TypeOrmOrganizationLanguageRepository, mikro_orm_organization_language_repository_1.MikroOrmOrganizationLanguageRepository]
    })
], OrganizationLanguageModule);
//# sourceMappingURL=organization-language.module.js.map