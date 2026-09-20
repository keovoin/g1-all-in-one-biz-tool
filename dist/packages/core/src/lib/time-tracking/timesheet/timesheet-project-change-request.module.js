"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimesheetProjectChangeRequestModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const nestjs_1 = require("@mikro-orm/nestjs");
const organization_project_entity_1 = require("./../../organization-project/organization-project.entity");
const type_orm_organization_project_repository_1 = require("./../../organization-project/repository/type-orm-organization-project.repository");
const role_permission_module_1 = require("./../../role-permission/role-permission.module");
const time_log_entity_1 = require("./../time-log/time-log.entity");
const type_orm_time_log_repository_1 = require("./../time-log/repository/type-orm-time-log.repository");
const timesheet_entity_1 = require("./timesheet.entity");
const type_orm_timesheet_repository_1 = require("./repository/type-orm-timesheet.repository");
const timesheet_project_change_request_entity_1 = require("./timesheet-project-change-request.entity");
const timesheet_project_change_request_controller_1 = require("./timesheet-project-change-request.controller");
const timesheet_project_change_request_service_1 = require("./timesheet-project-change-request.service");
const mikro_orm_timesheet_project_change_request_repository_1 = require("./repository/mikro-orm-timesheet-project-change-request.repository");
const type_orm_timesheet_project_change_request_repository_1 = require("./repository/type-orm-timesheet-project-change-request.repository");
/**
 * Timesheet project change request module (issue #9516).
 *
 * `Timesheet`, `TimeLog` and `OrganizationProject` are registered with `forFeature` here rather
 * than imported from their own modules so that this feature stays a leaf of the module graph and
 * cannot introduce a circular dependency into the time-tracking modules.
 */
let TimesheetProjectChangeRequestModule = class TimesheetProjectChangeRequestModule {
};
exports.TimesheetProjectChangeRequestModule = TimesheetProjectChangeRequestModule;
exports.TimesheetProjectChangeRequestModule = TimesheetProjectChangeRequestModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([timesheet_project_change_request_entity_1.TimesheetProjectChangeRequest, timesheet_entity_1.Timesheet, time_log_entity_1.TimeLog, organization_project_entity_1.OrganizationProject]),
            nestjs_1.MikroOrmModule.forFeature([timesheet_project_change_request_entity_1.TimesheetProjectChangeRequest]),
            role_permission_module_1.RolePermissionModule
        ],
        controllers: [timesheet_project_change_request_controller_1.TimesheetProjectChangeRequestController],
        providers: [
            timesheet_project_change_request_service_1.TimesheetProjectChangeRequestService,
            type_orm_timesheet_project_change_request_repository_1.TypeOrmTimesheetProjectChangeRequestRepository,
            mikro_orm_timesheet_project_change_request_repository_1.MikroOrmTimesheetProjectChangeRequestRepository,
            type_orm_timesheet_repository_1.TypeOrmTimesheetRepository,
            type_orm_time_log_repository_1.TypeOrmTimeLogRepository,
            type_orm_organization_project_repository_1.TypeOrmOrganizationProjectRepository
        ],
        exports: [timesheet_project_change_request_service_1.TimesheetProjectChangeRequestService]
    })
], TimesheetProjectChangeRequestModule);
//# sourceMappingURL=timesheet-project-change-request.module.js.map