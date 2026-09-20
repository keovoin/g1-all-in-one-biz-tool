"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidateFeedbacksModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const cqrs_1 = require("@nestjs/cqrs");
const nestjs_1 = require("@mikro-orm/nestjs");
const role_permission_module_1 = require("../role-permission/role-permission.module");
const candidate_interview_module_1 = require("./../candidate-interview/candidate-interview.module");
const candidate_feedbacks_entity_1 = require("./candidate-feedbacks.entity");
const candidate_feedbacks_service_1 = require("./candidate-feedbacks.service");
const candidate_feedbacks_controller_1 = require("./candidate-feedbacks.controller");
const handlers_1 = require("./commands/handlers");
const type_orm_candidate_feedback_repository_1 = require("./repository/type-orm-candidate-feedback.repository");
const mikro_orm_candidate_feedback_repository_1 = require("./repository/mikro-orm-candidate-feedback.repository");
let CandidateFeedbacksModule = class CandidateFeedbacksModule {
};
exports.CandidateFeedbacksModule = CandidateFeedbacksModule;
exports.CandidateFeedbacksModule = CandidateFeedbacksModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([candidate_feedbacks_entity_1.CandidateFeedback]),
            nestjs_1.MikroOrmModule.forFeature([candidate_feedbacks_entity_1.CandidateFeedback]),
            role_permission_module_1.RolePermissionModule,
            candidate_interview_module_1.CandidateInterviewModule,
            cqrs_1.CqrsModule
        ],
        providers: [candidate_feedbacks_service_1.CandidateFeedbacksService, type_orm_candidate_feedback_repository_1.TypeOrmCandidateFeedbackRepository, mikro_orm_candidate_feedback_repository_1.MikroOrmCandidateFeedbackRepository, ...handlers_1.CommandHandlers],
        controllers: [candidate_feedbacks_controller_1.CandidateFeedbacksController]
    })
], CandidateFeedbacksModule);
//# sourceMappingURL=candidate-feedbacks.module.js.map