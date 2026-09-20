"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationTeamEmployeeModule = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const nestjs_1 = require("@mikro-orm/nestjs");
const role_permission_module_1 = require("../role-permission/role-permission.module");
const organization_team_employee_controller_1 = require("./organization-team-employee.controller");
const organization_team_employee_entity_1 = require("./organization-team-employee.entity");
const organization_team_employee_service_1 = require("./organization-team-employee.service");
const task_module_1 = require("./../tasks/task.module");
const type_orm_organization_team_employee_repository_1 = require("./repository/type-orm-organization-team-employee.repository");
const mikro_orm_organization_team_employee_repository_1 = require("./repository/mikro-orm-organization-team-employee.repository");
let OrganizationTeamEmployeeModule = class OrganizationTeamEmployeeModule {
};
exports.OrganizationTeamEmployeeModule = OrganizationTeamEmployeeModule;
exports.OrganizationTeamEmployeeModule = OrganizationTeamEmployeeModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([organization_team_employee_entity_1.OrganizationTeamEmployee]),
            nestjs_1.MikroOrmModule.forFeature([organization_team_employee_entity_1.OrganizationTeamEmployee]),
            role_permission_module_1.RolePermissionModule,
            cqrs_1.CqrsModule,
            task_module_1.TaskModule
        ],
        controllers: [organization_team_employee_controller_1.OrganizationTeamEmployeeController],
        providers: [
            organization_team_employee_service_1.OrganizationTeamEmployeeService,
            type_orm_organization_team_employee_repository_1.TypeOrmOrganizationTeamEmployeeRepository,
            mikro_orm_organization_team_employee_repository_1.MikroOrmOrganizationTeamEmployeeRepository
        ],
        exports: [
            organization_team_employee_service_1.OrganizationTeamEmployeeService,
            type_orm_organization_team_employee_repository_1.TypeOrmOrganizationTeamEmployeeRepository,
            mikro_orm_organization_team_employee_repository_1.MikroOrmOrganizationTeamEmployeeRepository
        ]
    })
], OrganizationTeamEmployeeModule);
//# sourceMappingURL=organization-team-employee.module.js.map