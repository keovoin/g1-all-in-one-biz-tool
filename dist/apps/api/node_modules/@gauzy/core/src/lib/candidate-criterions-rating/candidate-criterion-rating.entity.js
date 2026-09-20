"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidateCriterionsRating = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const internal_1 = require("../core/entities/internal");
const entity_1 = require("./../core/decorators/entity");
const mikro_orm_candidate_criterions_rating_repository_1 = require("./repository/mikro-orm-candidate-criterions-rating.repository");
let CandidateCriterionsRating = class CandidateCriterionsRating extends internal_1.TenantOrganizationBaseEntity {
};
exports.CandidateCriterionsRating = CandidateCriterionsRating;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", Number)
], CandidateCriterionsRating.prototype, "rating", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => internal_1.CandidateTechnologies }),
    (0, entity_1.MultiORMManyToOne)(() => internal_1.CandidateTechnologies, (quality) => quality.criterionsRatings, {
        onDelete: 'CASCADE'
    }),
    tslib_1.__metadata("design:type", Object)
], CandidateCriterionsRating.prototype, "technology", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, typeorm_1.RelationId)((it) => it.technology),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ nullable: true, relationId: true }),
    tslib_1.__metadata("design:type", String)
], CandidateCriterionsRating.prototype, "technologyId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => internal_1.CandidatePersonalQualities }),
    (0, entity_1.MultiORMManyToOne)(() => internal_1.CandidatePersonalQualities, (quality) => quality.criterionsRatings, {
        onDelete: 'CASCADE'
    }),
    tslib_1.__metadata("design:type", Object)
], CandidateCriterionsRating.prototype, "personalQuality", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, typeorm_1.RelationId)((it) => it.personalQuality),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ nullable: true, relationId: true }),
    tslib_1.__metadata("design:type", String)
], CandidateCriterionsRating.prototype, "personalQualityId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => internal_1.CandidateFeedback }),
    (0, entity_1.MultiORMManyToOne)(() => internal_1.CandidateFeedback, (feedback) => feedback.criterionsRating, {
        onDelete: 'CASCADE'
    }),
    tslib_1.__metadata("design:type", Object)
], CandidateCriterionsRating.prototype, "feedback", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, typeorm_1.RelationId)((it) => it.feedback),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ nullable: true, relationId: true }),
    tslib_1.__metadata("design:type", String)
], CandidateCriterionsRating.prototype, "feedbackId", void 0);
exports.CandidateCriterionsRating = CandidateCriterionsRating = tslib_1.__decorate([
    (0, entity_1.MultiORMEntity)('candidate_criterion_rating', { mikroOrmRepository: () => mikro_orm_candidate_criterions_rating_repository_1.MikroOrmCandidateCriterionsRatingRepository })
], CandidateCriterionsRating);
//# sourceMappingURL=candidate-criterion-rating.entity.js.map