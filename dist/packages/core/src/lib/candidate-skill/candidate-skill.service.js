"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidateSkillService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const crud_1 = require("./../core/crud");
const type_orm_candidate_skill_repository_1 = require("./repository/type-orm-candidate-skill.repository");
const mikro_orm_candidate_skill_repository_1 = require("./repository/mikro-orm-candidate-skill.repository");
let CandidateSkillService = class CandidateSkillService extends crud_1.TenantAwareCrudService {
    constructor(typeOrmCandidateSkillRepository, mikroOrmCandidateSkillRepository) {
        super(typeOrmCandidateSkillRepository, mikroOrmCandidateSkillRepository);
    }
};
exports.CandidateSkillService = CandidateSkillService;
exports.CandidateSkillService = CandidateSkillService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_candidate_skill_repository_1.TypeOrmCandidateSkillRepository,
        mikro_orm_candidate_skill_repository_1.MikroOrmCandidateSkillRepository])
], CandidateSkillService);
//# sourceMappingURL=candidate-skill.service.js.map