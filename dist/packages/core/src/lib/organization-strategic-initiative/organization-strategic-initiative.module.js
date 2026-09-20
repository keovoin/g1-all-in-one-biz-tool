"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationStrategicInitiativeModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const nestjs_1 = require("@mikro-orm/nestjs");
const cqrs_1 = require("@nestjs/cqrs");
const role_permission_module_1 = require("../role-permission/role-permission.module");
const employee_module_1 = require("../employee/employee.module");
const role_module_1 = require("../role/role.module");
const organization_team_employee_module_1 = require("../organization-team-employee/organization-team-employee.module");
const organization_project_module_1 = require("../organization-project/organization-project.module");
const organization_strategic_initiative_entity_1 = require("./organization-strategic-initiative.entity");
const organization_strategic_initiative_service_1 = require("./organization-strategic-initiative.service");
const organization_strategic_initiative_controller_1 = require("./organization-strategic-initiative.controller");
const type_orm_organization_strategic_initiative_repository_1 = require("./repository/type-orm-organization-strategic-initiative.repository");
const mikro_orm_organization_strategic_initiative_repository_1 = require("./repository/mikro-orm-organization-strategic-initiative.repository");
const handlers_1 = require("./commands/handlers");
const handlers_2 = require("./queries/handlers");
let OrganizationStrategicInitiativeModule = class OrganizationStrategicInitiativeModule {
};
exports.OrganizationStrategicInitiativeModule = OrganizationStrategicInitiativeModule;
exports.OrganizationStrategicInitiativeModule = OrganizationStrategicInitiativeModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([organization_strategic_initiative_entity_1.OrganizationStrategicInitiative]),
            nestjs_1.MikroOrmModule.forFeature([organization_strategic_initiative_entity_1.OrganizationStrategicInitiative]),
            cqrs_1.CqrsModule,
            role_permission_module_1.RolePermissionModule,
            employee_module_1.EmployeeModule,
            role_module_1.RoleModule,
            organization_team_employee_module_1.OrganizationTeamEmployeeModule,
            organization_project_module_1.OrganizationProjectModule
        ],
        controllers: [organization_strategic_initiative_controller_1.OrganizationStrategicInitiativeController],
        providers: [
            organization_strategic_initiative_service_1.OrganizationStrategicInitiativeService,
            type_orm_organization_strategic_initiative_repository_1.TypeOrmOrganizationStrategicInitiativeRepository, mikro_orm_organization_strategic_initiative_repository_1.MikroOrmOrganizationStrategicInitiativeRepository,
            ...handlers_1.CommandHandlers,
            ...handlers_2.QueryHandlers
        ],
        exports: [organization_strategic_initiative_service_1.OrganizationStrategicInitiativeService, type_orm_organization_strategic_initiative_repository_1.TypeOrmOrganizationStrategicInitiativeRepository, mikro_orm_organization_strategic_initiative_repository_1.MikroOrmOrganizationStrategicInitiativeRepository]
    })
], OrganizationStrategicInitiativeModule);
//# sourceMappingURL=organization-strategic-initiative.module.js.map