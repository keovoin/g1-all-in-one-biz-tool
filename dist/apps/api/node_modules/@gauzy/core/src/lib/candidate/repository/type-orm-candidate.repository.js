"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmCandidateRepository = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const candidate_entity_1 = require("../candidate.entity");
let TypeOrmCandidateRepository = class TypeOrmCandidateRepository extends typeorm_2.Repository {
    constructor(repository) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
};
exports.TypeOrmCandidateRepository = TypeOrmCandidateRepository;
exports.TypeOrmCandidateRepository = TypeOrmCandidateRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(candidate_entity_1.Candidate)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], TypeOrmCandidateRepository);
//# sourceMappingURL=type-orm-candidate.repository.js.map