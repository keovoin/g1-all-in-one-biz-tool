"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmSkillRepository = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const skill_entity_1 = require("../skill.entity");
let TypeOrmSkillRepository = class TypeOrmSkillRepository extends typeorm_2.Repository {
    constructor(repository) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
};
exports.TypeOrmSkillRepository = TypeOrmSkillRepository;
exports.TypeOrmSkillRepository = TypeOrmSkillRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(skill_entity_1.Skill)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], TypeOrmSkillRepository);
//# sourceMappingURL=type-orm-skill.repository.js.map