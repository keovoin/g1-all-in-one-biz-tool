"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidateInterviewModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const nestjs_1 = require("@mikro-orm/nestjs");
const candidate_interview_service_1 = require("./candidate-interview.service");
const candidate_interview_controller_1 = require("./candidate-interview.controller");
const candidate_interview_entity_1 = require("./candidate-interview.entity");
const role_permission_module_1 = require("../role-permission/role-permission.module");
const type_orm_candidate_interview_repository_1 = require("./repository/type-orm-candidate-interview.repository");
const mikro_orm_candidate_interview_repository_1 = require("./repository/mikro-orm-candidate-interview.repository");
let CandidateInterviewModule = class CandidateInterviewModule {
};
exports.CandidateInterviewModule = CandidateInterviewModule;
exports.CandidateInterviewModule = CandidateInterviewModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([candidate_interview_entity_1.CandidateInterview]),
            nestjs_1.MikroOrmModule.forFeature([candidate_interview_entity_1.CandidateInterview]),
            role_permission_module_1.RolePermissionModule
        ],
        providers: [candidate_interview_service_1.CandidateInterviewService, type_orm_candidate_interview_repository_1.TypeOrmCandidateInterviewRepository, mikro_orm_candidate_interview_repository_1.MikroOrmCandidateInterviewRepository],
        controllers: [candidate_interview_controller_1.CandidateInterviewController],
        exports: [candidate_interview_service_1.CandidateInterviewService]
    })
], CandidateInterviewModule);
//# sourceMappingURL=candidate-interview.module.js.map