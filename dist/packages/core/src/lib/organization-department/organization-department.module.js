"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationDepartmentModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const cqrs_1 = require("@nestjs/cqrs");
const nestjs_1 = require("@mikro-orm/nestjs");
const organization_department_entity_1 = require("./organization-department.entity");
const organization_department_controller_1 = require("./organization-department.controller");
const organization_department_service_1 = require("./organization-department.service");
const handlers_1 = require("./commands/handlers");
const role_permission_module_1 = require("../role-permission/role-permission.module");
const type_orm_organization_department_repository_1 = require("./repository/type-orm-organization-department.repository");
const mikro_orm_organization_department_repository_1 = require("./repository/mikro-orm-organization-department.repository");
let OrganizationDepartmentModule = class OrganizationDepartmentModule {
};
exports.OrganizationDepartmentModule = OrganizationDepartmentModule;
exports.OrganizationDepartmentModule = OrganizationDepartmentModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([organization_department_entity_1.OrganizationDepartment]),
            nestjs_1.MikroOrmModule.forFeature([organization_department_entity_1.OrganizationDepartment]),
            role_permission_module_1.RolePermissionModule,
            cqrs_1.CqrsModule
        ],
        controllers: [organization_department_controller_1.OrganizationDepartmentController],
        providers: [organization_department_service_1.OrganizationDepartmentService, type_orm_organization_department_repository_1.TypeOrmOrganizationDepartmentRepository, mikro_orm_organization_department_repository_1.MikroOrmOrganizationDepartmentRepository, ...handlers_1.CommandHandlers],
        exports: [organization_department_service_1.OrganizationDepartmentService, type_orm_organization_department_repository_1.TypeOrmOrganizationDepartmentRepository, mikro_orm_organization_department_repository_1.MikroOrmOrganizationDepartmentRepository]
    })
], OrganizationDepartmentModule);
//# sourceMappingURL=organization-department.module.js.map