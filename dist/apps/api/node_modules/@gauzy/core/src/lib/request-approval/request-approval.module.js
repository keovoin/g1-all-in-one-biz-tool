"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestApprovalModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const cqrs_1 = require("@nestjs/cqrs");
const nestjs_1 = require("@mikro-orm/nestjs");
const request_approval_entity_1 = require("./request-approval.entity");
const request_approval_controller_1 = require("./request-approval.controller");
const request_approval_service_1 = require("./request-approval.service");
const organization_team_module_1 = require("../organization-team/organization-team.module");
const employee_module_1 = require("../employee/employee.module");
const organization_team_employee_module_1 = require("../organization-team-employee/organization-team-employee.module");
const role_permission_module_1 = require("../role-permission/role-permission.module");
const user_module_1 = require("./../user/user.module");
const role_module_1 = require("./../role/role.module");
const organization_module_1 = require("./../organization/organization.module");
const equipment_sharing_module_1 = require("./../equipment-sharing/equipment-sharing.module");
const time_off_request_module_1 = require("./../time-off-request/time-off-request.module");
const handlers_1 = require("./commands/handlers");
const task_module_1 = require("./../tasks/task.module");
const statistic_module_1 = require("../time-tracking/statistic/statistic.module");
const timer_module_1 = require("../time-tracking/timer/timer.module");
const type_orm_request_approval_repository_1 = require("./repository/type-orm-request-approval.repository");
const mikro_orm_request_approval_repository_1 = require("./repository/mikro-orm-request-approval.repository");
let RequestApprovalModule = class RequestApprovalModule {
};
exports.RequestApprovalModule = RequestApprovalModule;
exports.RequestApprovalModule = RequestApprovalModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([request_approval_entity_1.RequestApproval]),
            nestjs_1.MikroOrmModule.forFeature([request_approval_entity_1.RequestApproval]),
            cqrs_1.CqrsModule,
            organization_team_employee_module_1.OrganizationTeamEmployeeModule,
            role_permission_module_1.RolePermissionModule,
            user_module_1.UserModule,
            employee_module_1.EmployeeModule,
            organization_team_module_1.OrganizationTeamModule,
            role_module_1.RoleModule,
            organization_module_1.OrganizationModule,
            (0, common_1.forwardRef)(() => time_off_request_module_1.TimeOffRequestModule),
            (0, common_1.forwardRef)(() => equipment_sharing_module_1.EquipmentSharingModule),
            task_module_1.TaskModule,
            timer_module_1.TimerModule,
            statistic_module_1.StatisticModule
        ],
        controllers: [request_approval_controller_1.RequestApprovalController],
        providers: [request_approval_service_1.RequestApprovalService, type_orm_request_approval_repository_1.TypeOrmRequestApprovalRepository, mikro_orm_request_approval_repository_1.MikroOrmRequestApprovalRepository, ...handlers_1.CommandHandlers],
        exports: [request_approval_service_1.RequestApprovalService, type_orm_request_approval_repository_1.TypeOrmRequestApprovalRepository, mikro_orm_request_approval_repository_1.MikroOrmRequestApprovalRepository]
    })
], RequestApprovalModule);
//# sourceMappingURL=request-approval.module.js.map