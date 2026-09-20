"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmCandidateSkillRepository = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const candidate_skill_entity_1 = require("../candidate-skill.entity");
let TypeOrmCandidateSkillRepository = class TypeOrmCandidateSkillRepository extends typeorm_2.Repository {
    constructor(repository) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
};
exports.TypeOrmCandidateSkillRepository = TypeOrmCandidateSkillRepository;
exports.TypeOrmCandidateSkillRepository = TypeOrmCandidateSkillRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(candidate_skill_entity_1.CandidateSkill)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], TypeOrmCandidateSkillRepository);
//# sourceMappingURL=type-orm-candidate-skill.repository.js.map