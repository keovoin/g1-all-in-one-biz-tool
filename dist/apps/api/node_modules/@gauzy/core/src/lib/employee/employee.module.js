"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const typeorm_1 = require("@nestjs/typeorm");
const nestjs_1 = require("@mikro-orm/nestjs");
const user_module_1 = require("./../user/user.module");
const auth_module_1 = require("./../auth/auth.module");
const email_send_module_1 = require("./../email-send/email-send.module");
const user_organization_module_1 = require("../user-organization/user-organization.module");
const role_module_1 = require("./../role/role.module");
const role_permission_module_1 = require("../role-permission/role-permission.module");
const handlers_1 = require("./commands/handlers");
const employee_controller_1 = require("./employee.controller");
const employee_service_1 = require("./employee.service");
const managed_employee_service_1 = require("./managed-employee.service");
const employee_entity_1 = require("./employee.entity");
const type_orm_employee_repository_1 = require("./repository/type-orm-employee.repository");
const mikro_orm_employee_repository_1 = require("./repository/mikro-orm-employee.repository");
const organization_team_employee_entity_1 = require("../organization-team-employee/organization-team-employee.entity");
const organization_project_employee_entity_1 = require("../organization-project/organization-project-employee.entity");
const type_orm_organization_team_employee_repository_1 = require("../organization-team-employee/repository/type-orm-organization-team-employee.repository");
const mikro_orm_organization_team_employee_repository_1 = require("../organization-team-employee/repository/mikro-orm-organization-team-employee.repository");
const type_orm_organization_project_employee_repository_1 = require("../organization-project/repository/type-orm-organization-project-employee.repository");
const mikro_orm_organization_project_employee_repository_1 = require("../organization-project/repository/mikro-orm-organization-project-employee.repository");
let EmployeeModule = class EmployeeModule {
};
exports.EmployeeModule = EmployeeModule;
exports.EmployeeModule = EmployeeModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([employee_entity_1.Employee, organization_team_employee_entity_1.OrganizationTeamEmployee, organization_project_employee_entity_1.OrganizationProjectEmployee]),
            nestjs_1.MikroOrmModule.forFeature([employee_entity_1.Employee, organization_team_employee_entity_1.OrganizationTeamEmployee, organization_project_employee_entity_1.OrganizationProjectEmployee]),
            (0, common_1.forwardRef)(() => email_send_module_1.EmailSendModule),
            (0, common_1.forwardRef)(() => user_organization_module_1.UserOrganizationModule),
            (0, common_1.forwardRef)(() => role_permission_module_1.RolePermissionModule),
            (0, common_1.forwardRef)(() => user_module_1.UserModule),
            (0, common_1.forwardRef)(() => auth_module_1.AuthModule),
            role_module_1.RoleModule,
            cqrs_1.CqrsModule
        ],
        controllers: [employee_controller_1.EmployeeController],
        providers: [
            employee_service_1.EmployeeService,
            managed_employee_service_1.ManagedEmployeeService,
            type_orm_employee_repository_1.TypeOrmEmployeeRepository,
            mikro_orm_employee_repository_1.MikroOrmEmployeeRepository,
            type_orm_organization_team_employee_repository_1.TypeOrmOrganizationTeamEmployeeRepository, mikro_orm_organization_team_employee_repository_1.MikroOrmOrganizationTeamEmployeeRepository,
            type_orm_organization_project_employee_repository_1.TypeOrmOrganizationProjectEmployeeRepository, mikro_orm_organization_project_employee_repository_1.MikroOrmOrganizationProjectEmployeeRepository,
            ...handlers_1.CommandHandlers
        ],
        exports: [
            employee_service_1.EmployeeService,
            managed_employee_service_1.ManagedEmployeeService,
            type_orm_employee_repository_1.TypeOrmEmployeeRepository,
            mikro_orm_employee_repository_1.MikroOrmEmployeeRepository,
            type_orm_organization_team_employee_repository_1.TypeOrmOrganizationTeamEmployeeRepository, mikro_orm_organization_team_employee_repository_1.MikroOrmOrganizationTeamEmployeeRepository,
            type_orm_organization_project_employee_repository_1.TypeOrmOrganizationProjectEmployeeRepository, mikro_orm_organization_project_employee_repository_1.MikroOrmOrganizationProjectEmployeeRepository
        ]
    })
], EmployeeModule);
//# sourceMappingURL=employee.module.js.map