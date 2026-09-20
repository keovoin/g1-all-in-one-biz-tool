"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidateEducation = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const internal_1 = require("../core/entities/internal");
const entity_1 = require("./../core/decorators/entity");
const mikro_orm_candidate_education_repository_1 = require("./repository/mikro-orm-candidate-education.repository");
let CandidateEducation = class CandidateEducation extends internal_1.TenantOrganizationBaseEntity {
};
exports.CandidateEducation = CandidateEducation;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], CandidateEducation.prototype, "schoolName", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], CandidateEducation.prototype, "degree", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], CandidateEducation.prototype, "field", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Date }),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", Date)
], CandidateEducation.prototype, "completionDate", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], CandidateEducation.prototype, "notes", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => internal_1.Candidate }),
    (0, entity_1.MultiORMManyToOne)(() => internal_1.Candidate, (candidate) => candidate.educations, {
        onDelete: 'CASCADE'
    }),
    tslib_1.__metadata("design:type", Object)
], CandidateEducation.prototype, "candidate", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, typeorm_1.RelationId)((it) => it.candidate),
    (0, entity_1.MultiORMColumn)({ nullable: true, relationId: true }),
    tslib_1.__metadata("design:type", String)
], CandidateEducation.prototype, "candidateId", void 0);
exports.CandidateEducation = CandidateEducation = tslib_1.__decorate([
    (0, entity_1.MultiORMEntity)('candidate_education', { mikroOrmRepository: () => mikro_orm_candidate_education_repository_1.MikroOrmCandidateEducationRepository })
], CandidateEducation);
//# sourceMappingURL=candidate-education.entity.js.map