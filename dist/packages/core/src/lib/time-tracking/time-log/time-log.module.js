"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeLogModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const cqrs_1 = require("@nestjs/cqrs");
const nestjs_1 = require("@mikro-orm/nestjs");
const role_permission_module_1 = require("../../role-permission/role-permission.module");
const employee_module_1 = require("./../../employee/employee.module");
const organization_project_module_1 = require("./../../organization-project/organization-project.module");
const organization_contact_module_1 = require("./../../organization-contact/organization-contact.module");
const handlers_1 = require("./commands/handlers");
const organization_entity_1 = require("./../../organization/organization.entity");
const type_orm_organization_repository_1 = require("./../../organization/repository/type-orm-organization.repository");
const mikro_orm_organization_repository_1 = require("./../../organization/repository/mikro-orm-organization.repository");
const time_log_entity_1 = require("./time-log.entity");
const time_log_controller_1 = require("./time-log.controller");
const time_log_service_1 = require("./time-log.service");
const time_slot_module_1 = require("./../time-slot/time-slot.module");
const type_orm_time_log_repository_1 = require("./repository/type-orm-time-log.repository");
const mikro_orm_time_log_repository_1 = require("./repository/mikro-orm-time-log.repository");
let TimeLogModule = class TimeLogModule {
};
exports.TimeLogModule = TimeLogModule;
exports.TimeLogModule = TimeLogModule = tslib_1.__decorate([
    (0, common_1.Module)({
        controllers: [time_log_controller_1.TimeLogController],
        imports: [
            // `Organization` is registered here so that `OrganizationPermissionGuard`, which this
            // controller applies, can read the organization time-tracking policy columns.
            typeorm_1.TypeOrmModule.forFeature([time_log_entity_1.TimeLog, organization_entity_1.Organization]),
            nestjs_1.MikroOrmModule.forFeature([time_log_entity_1.TimeLog, organization_entity_1.Organization]),
            role_permission_module_1.RolePermissionModule,
            (0, common_1.forwardRef)(() => employee_module_1.EmployeeModule),
            (0, common_1.forwardRef)(() => organization_project_module_1.OrganizationProjectModule),
            (0, common_1.forwardRef)(() => organization_contact_module_1.OrganizationContactModule),
            (0, common_1.forwardRef)(() => time_slot_module_1.TimeSlotModule),
            cqrs_1.CqrsModule
        ],
        providers: [
            time_log_service_1.TimeLogService,
            type_orm_time_log_repository_1.TypeOrmTimeLogRepository,
            mikro_orm_time_log_repository_1.MikroOrmTimeLogRepository,
            type_orm_organization_repository_1.TypeOrmOrganizationRepository,
            mikro_orm_organization_repository_1.MikroOrmOrganizationRepository,
            ...handlers_1.CommandHandlers
        ],
        exports: [time_log_service_1.TimeLogService, type_orm_time_log_repository_1.TypeOrmTimeLogRepository, mikro_orm_time_log_repository_1.MikroOrmTimeLogRepository]
    })
], TimeLogModule);
//# sourceMappingURL=time-log.module.js.map