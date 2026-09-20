"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmCandidateSourceRepository = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const candidate_source_entity_1 = require("../candidate-source.entity");
let TypeOrmCandidateSourceRepository = class TypeOrmCandidateSourceRepository extends typeorm_2.Repository {
    constructor(repository) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
};
exports.TypeOrmCandidateSourceRepository = TypeOrmCandidateSourceRepository;
exports.TypeOrmCandidateSourceRepository = TypeOrmCandidateSourceRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(candidate_source_entity_1.CandidateSource)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], TypeOrmCandidateSourceRepository);
//# sourceMappingURL=type-orm-candidate-source.repository.js.map