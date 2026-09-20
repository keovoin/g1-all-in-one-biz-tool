"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationProjectModule = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const nestjs_1 = require("@mikro-orm/nestjs");
const organization_project_entity_1 = require("./organization-project.entity");
const organization_project_employee_entity_1 = require("./organization-project-employee.entity");
const organization_project_controller_1 = require("./organization-project.controller");
const organization_project_service_1 = require("./organization-project.service");
const handlers_1 = require("./commands/handlers");
const role_permission_module_1 = require("../role-permission/role-permission.module");
const role_module_1 = require("./../role/role.module");
const employee_module_1 = require("./../employee/employee.module");
const employee_recent_visit_module_1 = require("../employee-recent-visit/employee-recent-visit.module");
const type_orm_organization_project_repository_1 = require("./repository/type-orm-organization-project.repository");
const mikro_orm_organization_project_repository_1 = require("./repository/mikro-orm-organization-project.repository");
const type_orm_organization_project_employee_repository_1 = require("./repository/type-orm-organization-project-employee.repository");
const mikro_orm_organization_project_employee_repository_1 = require("./repository/mikro-orm-organization-project-employee.repository");
let OrganizationProjectModule = class OrganizationProjectModule {
};
exports.OrganizationProjectModule = OrganizationProjectModule;
exports.OrganizationProjectModule = OrganizationProjectModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([organization_project_entity_1.OrganizationProject, organization_project_employee_entity_1.OrganizationProjectEmployee]),
            nestjs_1.MikroOrmModule.forFeature([organization_project_entity_1.OrganizationProject, organization_project_employee_entity_1.OrganizationProjectEmployee]),
            role_module_1.RoleModule,
            employee_module_1.EmployeeModule,
            role_permission_module_1.RolePermissionModule,
            employee_recent_visit_module_1.EmployeeRecentVisitModule,
            cqrs_1.CqrsModule
        ],
        controllers: [organization_project_controller_1.OrganizationProjectController],
        providers: [
            organization_project_service_1.OrganizationProjectService,
            type_orm_organization_project_repository_1.TypeOrmOrganizationProjectRepository, mikro_orm_organization_project_repository_1.MikroOrmOrganizationProjectRepository,
            type_orm_organization_project_employee_repository_1.TypeOrmOrganizationProjectEmployeeRepository, mikro_orm_organization_project_employee_repository_1.MikroOrmOrganizationProjectEmployeeRepository,
            ...handlers_1.CommandHandlers
        ],
        exports: [
            organization_project_service_1.OrganizationProjectService,
            type_orm_organization_project_repository_1.TypeOrmOrganizationProjectRepository, mikro_orm_organization_project_repository_1.MikroOrmOrganizationProjectRepository,
            type_orm_organization_project_employee_repository_1.TypeOrmOrganizationProjectEmployeeRepository, mikro_orm_organization_project_employee_repository_1.MikroOrmOrganizationProjectEmployeeRepository
        ]
    })
], OrganizationProjectModule);
//# sourceMappingURL=organization-project.module.js.map