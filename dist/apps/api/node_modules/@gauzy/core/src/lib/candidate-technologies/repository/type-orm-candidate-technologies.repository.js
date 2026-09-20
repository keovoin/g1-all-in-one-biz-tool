"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmCandidateTechnologiesRepository = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const candidate_technologies_entity_1 = require("../candidate-technologies.entity");
let TypeOrmCandidateTechnologiesRepository = class TypeOrmCandidateTechnologiesRepository extends typeorm_2.Repository {
    constructor(repository) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
};
exports.TypeOrmCandidateTechnologiesRepository = TypeOrmCandidateTechnologiesRepository;
exports.TypeOrmCandidateTechnologiesRepository = TypeOrmCandidateTechnologiesRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(candidate_technologies_entity_1.CandidateTechnologies)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], TypeOrmCandidateTechnologiesRepository);
//# sourceMappingURL=type-orm-candidate-technologies.repository.js.map