"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidateFeedback = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const contracts_1 = require("@gauzy/contracts");
const pipes_1 = require("./../shared/pipes");
const internal_1 = require("../core/entities/internal");
const entity_1 = require("./../core/decorators/entity");
const mikro_orm_candidate_feedback_repository_1 = require("./repository/mikro-orm-candidate-feedback.repository");
let CandidateFeedback = class CandidateFeedback extends internal_1.TenantOrganizationBaseEntity {
};
exports.CandidateFeedback = CandidateFeedback;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], CandidateFeedback.prototype, "description", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Number }),
    (0, entity_1.MultiORMColumn)({
        nullable: true,
        type: 'numeric',
        transformer: new pipes_1.ColumnNumericTransformerPipe()
    }),
    tslib_1.__metadata("design:type", Number)
], CandidateFeedback.prototype, "rating", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, enum: contracts_1.CandidateStatusEnum }),
    (0, entity_1.MultiORMColumn)({
        type: 'simple-enum',
        nullable: true,
        enum: contracts_1.CandidateStatusEnum
    }),
    tslib_1.__metadata("design:type", String)
], CandidateFeedback.prototype, "status", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => internal_1.Candidate }),
    (0, entity_1.MultiORMManyToOne)(() => internal_1.Candidate, (candidate) => candidate.feedbacks, {
        onDelete: 'CASCADE'
    }),
    tslib_1.__metadata("design:type", Object)
], CandidateFeedback.prototype, "candidate", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, typeorm_1.RelationId)((it) => it.candidate),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ nullable: true, relationId: true }),
    tslib_1.__metadata("design:type", Object)
], CandidateFeedback.prototype, "candidateId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => internal_1.CandidateInterview }),
    (0, entity_1.MultiORMManyToOne)(() => internal_1.CandidateInterview, (candidateInterview) => candidateInterview.feedbacks, {
        onDelete: 'CASCADE'
    }),
    tslib_1.__metadata("design:type", Object)
], CandidateFeedback.prototype, "interview", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, typeorm_1.RelationId)((it) => it.interview),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ nullable: true, relationId: true }),
    tslib_1.__metadata("design:type", Object)
], CandidateFeedback.prototype, "interviewId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => internal_1.CandidateCriterionsRating }),
    (0, entity_1.MultiORMOneToMany)(() => internal_1.CandidateCriterionsRating, (criterionsRating) => criterionsRating.feedback, {
        cascade: true
    }),
    tslib_1.__metadata("design:type", Array)
], CandidateFeedback.prototype, "criterionsRating", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMOneToOne)(() => internal_1.CandidateInterviewers, {
        /** Indicates if relation column value can be nullable or not. */
        nullable: true,
        /** This column is a boolean flag indicating whether the current entity is the 'owning' side of a relationship.  */
        owner: true
    }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Object)
], CandidateFeedback.prototype, "interviewer", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, typeorm_1.RelationId)((it) => it.interviewer),
    (0, entity_1.MultiORMColumn)({ nullable: true, relationId: true }),
    tslib_1.__metadata("design:type", Object)
], CandidateFeedback.prototype, "interviewerId", void 0);
exports.CandidateFeedback = CandidateFeedback = tslib_1.__decorate([
    (0, entity_1.MultiORMEntity)('candidate_feedback', { mikroOrmRepository: () => mikro_orm_candidate_feedback_repository_1.MikroOrmCandidateFeedbackRepository })
], CandidateFeedback);
//# sourceMappingURL=candidate-feedbacks.entity.js.map