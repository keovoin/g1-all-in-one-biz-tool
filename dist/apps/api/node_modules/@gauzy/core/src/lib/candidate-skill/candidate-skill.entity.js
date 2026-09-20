"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidateSkill = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const internal_1 = require("../core/entities/internal");
const entity_1 = require("./../core/decorators/entity");
const mikro_orm_candidate_skill_repository_1 = require("./repository/mikro-orm-candidate-skill.repository");
let CandidateSkill = class CandidateSkill extends internal_1.TenantOrganizationBaseEntity {
};
exports.CandidateSkill = CandidateSkill;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], CandidateSkill.prototype, "name", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => internal_1.Candidate }),
    (0, entity_1.MultiORMManyToOne)(() => internal_1.Candidate, (candidate) => candidate.skills, {
        onDelete: 'CASCADE',
        nullable: true,
    }),
    tslib_1.__metadata("design:type", Object)
], CandidateSkill.prototype, "candidate", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, typeorm_1.RelationId)((it) => it.candidate),
    (0, entity_1.MultiORMColumn)({ nullable: true, relationId: true }),
    tslib_1.__metadata("design:type", Object)
], CandidateSkill.prototype, "candidateId", void 0);
exports.CandidateSkill = CandidateSkill = tslib_1.__decorate([
    (0, entity_1.MultiORMEntity)('candidate_skill', { mikroOrmRepository: () => mikro_orm_candidate_skill_repository_1.MikroOrmCandidateSkillRepository })
], CandidateSkill);
//# sourceMappingURL=candidate-skill.entity.js.map