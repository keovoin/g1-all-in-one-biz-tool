"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidatePersonalQualities = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const internal_1 = require("../core/entities/internal");
const class_validator_1 = require("class-validator");
const pipes_1 = require("./../shared/pipes");
const entity_1 = require("./../core/decorators/entity");
const mikro_orm_candidate_personal_qualities_repository_1 = require("./repository/mikro-orm-candidate-personal-qualities.repository");
let CandidatePersonalQualities = class CandidatePersonalQualities extends internal_1.TenantOrganizationBaseEntity {
};
exports.CandidatePersonalQualities = CandidatePersonalQualities;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], CandidatePersonalQualities.prototype, "name", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Number }),
    (0, entity_1.MultiORMColumn)({
        nullable: true,
        type: 'numeric',
        transformer: new pipes_1.ColumnNumericTransformerPipe()
    }),
    tslib_1.__metadata("design:type", Number)
], CandidatePersonalQualities.prototype, "rating", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => internal_1.CandidateInterview }),
    (0, entity_1.MultiORMManyToOne)(() => internal_1.CandidateInterview, (interview) => interview.personalQualities, {
        onDelete: 'CASCADE'
    }),
    tslib_1.__metadata("design:type", Object)
], CandidatePersonalQualities.prototype, "interview", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, typeorm_1.RelationId)((it) => it.interview),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ nullable: true, relationId: true }),
    tslib_1.__metadata("design:type", String)
], CandidatePersonalQualities.prototype, "interviewId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => internal_1.CandidateCriterionsRating }),
    (0, entity_1.MultiORMOneToMany)(() => internal_1.CandidateCriterionsRating, (criterionsRating) => criterionsRating.personalQuality, {
        cascade: true
    }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Array)
], CandidatePersonalQualities.prototype, "criterionsRatings", void 0);
exports.CandidatePersonalQualities = CandidatePersonalQualities = tslib_1.__decorate([
    (0, entity_1.MultiORMEntity)('candidate_personal_quality', { mikroOrmRepository: () => mikro_orm_candidate_personal_qualities_repository_1.MikroOrmCandidatePersonalQualitiesRepository })
], CandidatePersonalQualities);
//# sourceMappingURL=candidate-personal-qualities.entity.js.map