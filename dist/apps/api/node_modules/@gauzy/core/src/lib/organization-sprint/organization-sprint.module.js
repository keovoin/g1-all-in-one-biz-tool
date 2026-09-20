"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationSprintModule = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("@nestjs/typeorm");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const nestjs_1 = require("@mikro-orm/nestjs");
const organization_sprint_employee_entity_1 = require("./organization-sprint-employee.entity");
const organization_sprint_task_history_entity_1 = require("./organization-sprint-task-history.entity");
const role_module_1 = require("./../role/role.module");
const employee_module_1 = require("./../employee/employee.module");
const organization_sprint_service_1 = require("./organization-sprint.service");
const organization_sprint_controller_1 = require("./organization-sprint.controller");
const organization_sprint_entity_1 = require("./organization-sprint.entity");
const task_entity_1 = require("../tasks/task.entity");
const handlers_1 = require("./commands/handlers");
const role_permission_module_1 = require("../role-permission/role-permission.module");
const type_orm_organization_sprint_repository_1 = require("./repository/type-orm-organization-sprint.repository");
const mikro_orm_organization_sprint_repository_1 = require("./repository/mikro-orm-organization-sprint.repository");
const type_orm_organization_sprint_employee_repository_1 = require("./repository/type-orm-organization-sprint-employee.repository");
const mikro_orm_organization_sprint_employee_repository_1 = require("./repository/mikro-orm-organization-sprint-employee.repository");
const type_orm_organization_sprint_task_history_repository_1 = require("./repository/type-orm-organization-sprint-task-history.repository");
const mikro_orm_organization_sprint_task_history_repository_1 = require("./repository/mikro-orm-organization-sprint-task-history.repository");
let OrganizationSprintModule = class OrganizationSprintModule {
};
exports.OrganizationSprintModule = OrganizationSprintModule;
exports.OrganizationSprintModule = OrganizationSprintModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([organization_sprint_entity_1.OrganizationSprint, task_entity_1.Task, organization_sprint_employee_entity_1.OrganizationSprintEmployee, organization_sprint_task_history_entity_1.OrganizationSprintTaskHistory]),
            nestjs_1.MikroOrmModule.forFeature([
                organization_sprint_entity_1.OrganizationSprint,
                task_entity_1.Task,
                organization_sprint_employee_entity_1.OrganizationSprintEmployee,
                organization_sprint_task_history_entity_1.OrganizationSprintTaskHistory
            ]),
            role_module_1.RoleModule,
            employee_module_1.EmployeeModule,
            role_permission_module_1.RolePermissionModule,
            cqrs_1.CqrsModule
        ],
        controllers: [organization_sprint_controller_1.OrganizationSprintController],
        providers: [
            organization_sprint_service_1.OrganizationSprintService,
            type_orm_organization_sprint_repository_1.TypeOrmOrganizationSprintRepository, mikro_orm_organization_sprint_repository_1.MikroOrmOrganizationSprintRepository,
            type_orm_organization_sprint_employee_repository_1.TypeOrmOrganizationSprintEmployeeRepository, mikro_orm_organization_sprint_employee_repository_1.MikroOrmOrganizationSprintEmployeeRepository,
            type_orm_organization_sprint_task_history_repository_1.TypeOrmOrganizationSprintTaskHistoryRepository, mikro_orm_organization_sprint_task_history_repository_1.MikroOrmOrganizationSprintTaskHistoryRepository,
            ...handlers_1.CommandHandlers
        ],
        exports: [
            organization_sprint_service_1.OrganizationSprintService,
            type_orm_organization_sprint_repository_1.TypeOrmOrganizationSprintRepository, mikro_orm_organization_sprint_repository_1.MikroOrmOrganizationSprintRepository,
            type_orm_organization_sprint_employee_repository_1.TypeOrmOrganizationSprintEmployeeRepository, mikro_orm_organization_sprint_employee_repository_1.MikroOrmOrganizationSprintEmployeeRepository,
            type_orm_organization_sprint_task_history_repository_1.TypeOrmOrganizationSprintTaskHistoryRepository, mikro_orm_organization_sprint_task_history_repository_1.MikroOrmOrganizationSprintTaskHistoryRepository
        ]
    })
], OrganizationSprintModule);
//# sourceMappingURL=organization-sprint.module.js.map