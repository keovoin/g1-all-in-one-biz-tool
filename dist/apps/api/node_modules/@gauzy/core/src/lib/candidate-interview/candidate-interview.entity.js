"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidateInterview = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const internal_1 = require("../core/entities/internal");
const pipes_1 = require("./../shared/pipes");
const entity_1 = require("./../core/decorators/entity");
const mikro_orm_candidate_interview_repository_1 = require("./repository/mikro-orm-candidate-interview.repository");
let CandidateInterview = class CandidateInterview extends internal_1.TenantOrganizationBaseEntity {
};
exports.CandidateInterview = CandidateInterview;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], CandidateInterview.prototype, "title", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Date }),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", Date)
], CandidateInterview.prototype, "startTime", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Date }),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", Date)
], CandidateInterview.prototype, "endTime", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], CandidateInterview.prototype, "location", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], CandidateInterview.prototype, "note", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Number }),
    (0, entity_1.MultiORMColumn)({
        nullable: true,
        type: 'numeric',
        transformer: new pipes_1.ColumnNumericTransformerPipe()
    }),
    tslib_1.__metadata("design:type", Number)
], CandidateInterview.prototype, "rating", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => internal_1.CandidateFeedback }),
    (0, entity_1.MultiORMOneToMany)(() => internal_1.CandidateFeedback, (feedback) => feedback.interview, {
        onDelete: 'SET NULL'
    }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Array)
], CandidateInterview.prototype, "feedbacks", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => internal_1.CandidateTechnologies }),
    (0, entity_1.MultiORMOneToMany)(() => internal_1.CandidateTechnologies, (technologies) => technologies.interview, {
        onDelete: 'SET NULL'
    }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Array)
], CandidateInterview.prototype, "technologies", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => internal_1.CandidatePersonalQualities }),
    (0, entity_1.MultiORMOneToMany)(() => internal_1.CandidatePersonalQualities, (personalQualities) => personalQualities.interview, {
        onDelete: 'SET NULL'
    }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Array)
], CandidateInterview.prototype, "personalQualities", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => internal_1.CandidateInterviewers }),
    (0, entity_1.MultiORMOneToMany)(() => internal_1.CandidateInterviewers, (interviewers) => interviewers.interview, {
        onDelete: 'SET NULL'
    }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Array)
], CandidateInterview.prototype, "interviewers", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => internal_1.Candidate }),
    (0, entity_1.MultiORMManyToOne)(() => internal_1.Candidate, (candidate) => candidate.interview, {
        onDelete: 'CASCADE'
    }),
    tslib_1.__metadata("design:type", Object)
], CandidateInterview.prototype, "candidate", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, typeorm_1.RelationId)((it) => it.candidate),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ nullable: true, relationId: true }),
    tslib_1.__metadata("design:type", Object)
], CandidateInterview.prototype, "candidateId", void 0);
exports.CandidateInterview = CandidateInterview = tslib_1.__decorate([
    (0, entity_1.MultiORMEntity)('candidate_interview', { mikroOrmRepository: () => mikro_orm_candidate_interview_repository_1.MikroOrmCandidateInterviewRepository })
], CandidateInterview);
//# sourceMappingURL=candidate-interview.entity.js.map