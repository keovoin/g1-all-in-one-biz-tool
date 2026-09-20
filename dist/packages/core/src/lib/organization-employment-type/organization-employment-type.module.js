"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationEmploymentTypeModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const nestjs_1 = require("@mikro-orm/nestjs");
const role_permission_module_1 = require("../role-permission/role-permission.module");
const organization_employment_type_controller_1 = require("./organization-employment-type.controller");
const organization_employment_type_entity_1 = require("./organization-employment-type.entity");
const organization_employment_type_service_1 = require("./organization-employment-type.service");
const type_orm_organization_employment_type_repository_1 = require("./repository/type-orm-organization-employment-type.repository");
const mikro_orm_organization_employment_type_repository_1 = require("./repository/mikro-orm-organization-employment-type.repository");
let OrganizationEmploymentTypeModule = class OrganizationEmploymentTypeModule {
};
exports.OrganizationEmploymentTypeModule = OrganizationEmploymentTypeModule;
exports.OrganizationEmploymentTypeModule = OrganizationEmploymentTypeModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([organization_employment_type_entity_1.OrganizationEmploymentType]),
            nestjs_1.MikroOrmModule.forFeature([organization_employment_type_entity_1.OrganizationEmploymentType]),
            role_permission_module_1.RolePermissionModule
        ],
        controllers: [organization_employment_type_controller_1.OrganizationEmploymentTypeController],
        providers: [organization_employment_type_service_1.OrganizationEmploymentTypeService, type_orm_organization_employment_type_repository_1.TypeOrmOrganizationEmploymentTypeRepository, mikro_orm_organization_employment_type_repository_1.MikroOrmOrganizationEmploymentTypeRepository]
    })
], OrganizationEmploymentTypeModule);
//# sourceMappingURL=organization-employment-type.module.js.map