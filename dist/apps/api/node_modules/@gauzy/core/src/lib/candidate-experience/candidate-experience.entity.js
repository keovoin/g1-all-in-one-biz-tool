"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidateExperience = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const internal_1 = require("../core/entities/internal");
const entity_1 = require("./../core/decorators/entity");
const mikro_orm_candidate_experience_repository_1 = require("./repository/mikro-orm-candidate-experience.repository");
const class_validator_1 = require("class-validator");
let CandidateExperience = class CandidateExperience extends internal_1.TenantOrganizationBaseEntity {
};
exports.CandidateExperience = CandidateExperience;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], CandidateExperience.prototype, "occupation", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], CandidateExperience.prototype, "duration", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], CandidateExperience.prototype, "description", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMManyToOne)(() => internal_1.Candidate, (candidate) => candidate.experience, {
        onDelete: 'CASCADE'
    }),
    tslib_1.__metadata("design:type", Object)
], CandidateExperience.prototype, "candidate", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsUUID)(),
    (0, typeorm_1.RelationId)((it) => it.candidate),
    (0, entity_1.MultiORMColumn)({ nullable: true, relationId: true }),
    tslib_1.__metadata("design:type", String)
], CandidateExperience.prototype, "candidateId", void 0);
exports.CandidateExperience = CandidateExperience = tslib_1.__decorate([
    (0, entity_1.MultiORMEntity)('candidate_experience', { mikroOrmRepository: () => mikro_orm_candidate_experience_repository_1.MikroOrmCandidateExperienceRepository })
], CandidateExperience);
//# sourceMappingURL=candidate-experience.entity.js.map