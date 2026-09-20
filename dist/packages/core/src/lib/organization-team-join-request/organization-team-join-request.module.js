"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationTeamJoinRequestModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const typeorm_1 = require("@nestjs/typeorm");
const nestjs_1 = require("@mikro-orm/nestjs");
const email_send_module_1 = require("./../email-send/email-send.module");
const role_permission_module_1 = require("../role-permission/role-permission.module");
const invite_module_1 = require("../invite/invite.module");
const internal_1 = require("../core/entities/internal");
const role_module_1 = require("../role/role.module");
const login_attempt_module_1 = require("../auth/login-attempt.module");
const user_module_1 = require("./../user/user.module");
const employee_module_1 = require("./../employee/employee.module");
const organization_team_module_1 = require("./../organization-team/organization-team.module");
const organization_team_employee_module_1 = require("../organization-team-employee/organization-team-employee.module");
const handlers_1 = require("./commands/handlers");
const organization_team_join_request_controller_1 = require("./organization-team-join-request.controller");
const organization_team_join_request_entity_1 = require("./organization-team-join-request.entity");
const organization_team_join_request_service_1 = require("./organization-team-join-request.service");
const type_orm_organization_team_join_request_repository_1 = require("./repository/type-orm-organization-team-join-request.repository");
const mikro_orm_organization_team_join_request_repository_1 = require("./repository/mikro-orm-organization-team-join-request.repository");
let OrganizationTeamJoinRequestModule = class OrganizationTeamJoinRequestModule {
};
exports.OrganizationTeamJoinRequestModule = OrganizationTeamJoinRequestModule;
exports.OrganizationTeamJoinRequestModule = OrganizationTeamJoinRequestModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([organization_team_join_request_entity_1.OrganizationTeamJoinRequest, internal_1.OrganizationTeamEmployee]),
            nestjs_1.MikroOrmModule.forFeature([organization_team_join_request_entity_1.OrganizationTeamJoinRequest, internal_1.OrganizationTeamEmployee]),
            cqrs_1.CqrsModule,
            role_permission_module_1.RolePermissionModule,
            user_module_1.UserModule,
            employee_module_1.EmployeeModule,
            organization_team_module_1.OrganizationTeamModule,
            organization_team_employee_module_1.OrganizationTeamEmployeeModule,
            email_send_module_1.EmailSendModule,
            invite_module_1.InviteModule,
            role_module_1.RoleModule,
            login_attempt_module_1.LoginAttemptModule
        ],
        controllers: [organization_team_join_request_controller_1.OrganizationTeamJoinRequestController],
        providers: [organization_team_join_request_service_1.OrganizationTeamJoinRequestService, type_orm_organization_team_join_request_repository_1.TypeOrmOrganizationTeamJoinRequestRepository, mikro_orm_organization_team_join_request_repository_1.MikroOrmOrganizationTeamJoinRequestRepository, ...handlers_1.CommandHandlers],
        exports: [organization_team_join_request_service_1.OrganizationTeamJoinRequestService]
    })
], OrganizationTeamJoinRequestModule);
//# sourceMappingURL=organization-team-join-request.module.js.map