"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidateTechnologies = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const internal_1 = require("../core/entities/internal");
const class_validator_1 = require("class-validator");
const pipes_1 = require("./../shared/pipes");
const entity_1 = require("./../core/decorators/entity");
const mikro_orm_candidate_technologies_repository_1 = require("./repository/mikro-orm-candidate-technologies.repository");
let CandidateTechnologies = class CandidateTechnologies extends internal_1.TenantOrganizationBaseEntity {
};
exports.CandidateTechnologies = CandidateTechnologies;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], CandidateTechnologies.prototype, "name", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Number }),
    (0, entity_1.MultiORMColumn)({
        nullable: true,
        type: 'numeric',
        transformer: new pipes_1.ColumnNumericTransformerPipe()
    }),
    tslib_1.__metadata("design:type", Number)
], CandidateTechnologies.prototype, "rating", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => internal_1.CandidateInterview }),
    (0, entity_1.MultiORMManyToOne)(() => internal_1.CandidateInterview, (interview) => interview.technologies, {
        onDelete: 'CASCADE'
    }),
    tslib_1.__metadata("design:type", Object)
], CandidateTechnologies.prototype, "interview", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, typeorm_1.RelationId)((it) => it.interview),
    (0, class_validator_1.IsString)(),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ nullable: true, relationId: true }),
    tslib_1.__metadata("design:type", String)
], CandidateTechnologies.prototype, "interviewId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => internal_1.CandidateCriterionsRating }),
    (0, entity_1.MultiORMOneToMany)(() => internal_1.CandidateCriterionsRating, (criterionsRating) => criterionsRating.technology, {
        cascade: true
    }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Array)
], CandidateTechnologies.prototype, "criterionsRatings", void 0);
exports.CandidateTechnologies = CandidateTechnologies = tslib_1.__decorate([
    (0, entity_1.MultiORMEntity)('candidate_technology', { mikroOrmRepository: () => mikro_orm_candidate_technologies_repository_1.MikroOrmCandidateTechnologiesRepository })
], CandidateTechnologies);
//# sourceMappingURL=candidate-technologies.entity.js.map