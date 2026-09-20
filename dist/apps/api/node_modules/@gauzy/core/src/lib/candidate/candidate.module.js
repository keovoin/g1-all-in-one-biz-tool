"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidateModule = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const nestjs_1 = require("@mikro-orm/nestjs");
const email_send_module_1 = require("./../email-send/email-send.module");
const auth_module_1 = require("./../auth/auth.module");
const user_organization_module_1 = require("../user-organization/user-organization.module");
const user_module_1 = require("./../user/user.module");
const employee_module_1 = require("./../employee/employee.module");
const role_module_1 = require("./../role/role.module");
const role_permission_module_1 = require("../role-permission/role-permission.module");
const candidate_controller_1 = require("./candidate.controller");
const candidate_service_1 = require("./candidate.service");
const candidate_entity_1 = require("./candidate.entity");
const type_orm_candidate_repository_1 = require("./repository/type-orm-candidate.repository");
const mikro_orm_candidate_repository_1 = require("./repository/mikro-orm-candidate.repository");
const handlers_1 = require("./commands/handlers");
let CandidateModule = class CandidateModule {
};
exports.CandidateModule = CandidateModule;
exports.CandidateModule = CandidateModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([candidate_entity_1.Candidate]),
            nestjs_1.MikroOrmModule.forFeature([candidate_entity_1.Candidate]),
            email_send_module_1.EmailSendModule,
            cqrs_1.CqrsModule,
            user_organization_module_1.UserOrganizationModule,
            user_module_1.UserModule,
            employee_module_1.EmployeeModule,
            role_module_1.RoleModule,
            role_permission_module_1.RolePermissionModule,
            auth_module_1.AuthModule
        ],
        controllers: [candidate_controller_1.CandidateController],
        providers: [candidate_service_1.CandidateService, type_orm_candidate_repository_1.TypeOrmCandidateRepository, mikro_orm_candidate_repository_1.MikroOrmCandidateRepository, ...handlers_1.CommandHandlers],
        exports: [candidate_service_1.CandidateService, type_orm_candidate_repository_1.TypeOrmCandidateRepository, mikro_orm_candidate_repository_1.MikroOrmCandidateRepository]
    })
], CandidateModule);
//# sourceMappingURL=candidate.module.js.map