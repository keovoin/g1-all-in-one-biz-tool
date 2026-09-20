"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidateInterviewersModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const cqrs_1 = require("@nestjs/cqrs");
const nestjs_1 = require("@mikro-orm/nestjs");
const candidate_interviewers_entity_1 = require("./candidate-interviewers.entity");
const candidate_interviewers_service_1 = require("./candidate-interviewers.service");
const candidate_interviewers_controller_1 = require("./candidate-interviewers.controller");
const role_permission_module_1 = require("../role-permission/role-permission.module");
const handlers_1 = require("./commands/handlers");
const type_orm_candidate_interviewers_repository_1 = require("./repository/type-orm-candidate-interviewers.repository");
const mikro_orm_candidate_interviewers_repository_1 = require("./repository/mikro-orm-candidate-interviewers.repository");
let CandidateInterviewersModule = class CandidateInterviewersModule {
};
exports.CandidateInterviewersModule = CandidateInterviewersModule;
exports.CandidateInterviewersModule = CandidateInterviewersModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([candidate_interviewers_entity_1.CandidateInterviewers]),
            nestjs_1.MikroOrmModule.forFeature([candidate_interviewers_entity_1.CandidateInterviewers]),
            role_permission_module_1.RolePermissionModule,
            cqrs_1.CqrsModule
        ],
        controllers: [candidate_interviewers_controller_1.CandidateInterviewersController],
        providers: [candidate_interviewers_service_1.CandidateInterviewersService, type_orm_candidate_interviewers_repository_1.TypeOrmCandidateInterviewersRepository, mikro_orm_candidate_interviewers_repository_1.MikroOrmCandidateInterviewersRepository, ...handlers_1.CommandHandlers]
    })
], CandidateInterviewersModule);
//# sourceMappingURL=candidate-interviewers.module.js.map