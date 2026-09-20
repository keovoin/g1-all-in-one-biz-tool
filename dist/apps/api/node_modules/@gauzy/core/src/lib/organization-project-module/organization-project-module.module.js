"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationProjectModuleModule = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const nestjs_1 = require("@mikro-orm/nestjs");
const handlers_1 = require("./commands/handlers");
const organization_project_module_service_1 = require("./organization-project-module.service");
const organization_project_module_controller_1 = require("./organization-project-module.controller");
const organization_project_module_entity_1 = require("./organization-project-module.entity");
const role_permission_module_1 = require("../role-permission/role-permission.module");
const role_module_1 = require("../role/role.module");
const employee_module_1 = require("../employee/employee.module");
const task_module_1 = require("../tasks/task.module");
const organization_project_module_employee_entity_1 = require("./organization-project-module-employee.entity");
const type_orm_organization_project_module_repository_1 = require("./repository/type-orm-organization-project-module.repository");
const mikro_orm_organization_project_module_repository_1 = require("./repository/mikro-orm-organization-project-module.repository");
const type_orm_organization_project_module_employee_repository_1 = require("./repository/type-orm-organization-project-module-employee.repository");
const mikro_orm_organization_project_module_employee_repository_1 = require("./repository/mikro-orm-organization-project-module-employee.repository");
let OrganizationProjectModuleModule = class OrganizationProjectModuleModule {
};
exports.OrganizationProjectModuleModule = OrganizationProjectModuleModule;
exports.OrganizationProjectModuleModule = OrganizationProjectModuleModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([organization_project_module_entity_1.OrganizationProjectModule, organization_project_module_employee_entity_1.OrganizationProjectModuleEmployee]),
            nestjs_1.MikroOrmModule.forFeature([organization_project_module_entity_1.OrganizationProjectModule, organization_project_module_employee_entity_1.OrganizationProjectModuleEmployee]),
            nestjs_1.MikroOrmModule,
            role_permission_module_1.RolePermissionModule,
            role_module_1.RoleModule,
            employee_module_1.EmployeeModule,
            task_module_1.TaskModule,
            cqrs_1.CqrsModule
        ],
        controllers: [organization_project_module_controller_1.OrganizationProjectModuleController],
        providers: [
            organization_project_module_service_1.OrganizationProjectModuleService,
            type_orm_organization_project_module_repository_1.TypeOrmOrganizationProjectModuleRepository, mikro_orm_organization_project_module_repository_1.MikroOrmOrganizationProjectModuleRepository,
            type_orm_organization_project_module_employee_repository_1.TypeOrmOrganizationProjectModuleEmployeeRepository, mikro_orm_organization_project_module_employee_repository_1.MikroOrmOrganizationProjectModuleEmployeeRepository,
            ...handlers_1.CommandHandlers
        ],
        exports: [
            organization_project_module_service_1.OrganizationProjectModuleService,
            type_orm_organization_project_module_repository_1.TypeOrmOrganizationProjectModuleRepository, mikro_orm_organization_project_module_repository_1.MikroOrmOrganizationProjectModuleRepository,
            type_orm_organization_project_module_employee_repository_1.TypeOrmOrganizationProjectModuleEmployeeRepository, mikro_orm_organization_project_module_employee_repository_1.MikroOrmOrganizationProjectModuleEmployeeRepository
        ]
    })
], OrganizationProjectModuleModule);
//# sourceMappingURL=organization-project-module.module.js.map