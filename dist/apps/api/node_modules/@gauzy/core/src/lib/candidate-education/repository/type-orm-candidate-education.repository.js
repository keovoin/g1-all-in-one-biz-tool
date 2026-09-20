"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmCandidateEducationRepository = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const candidate_education_entity_1 = require("../candidate-education.entity");
let TypeOrmCandidateEducationRepository = class TypeOrmCandidateEducationRepository extends typeorm_2.Repository {
    constructor(repository) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
};
exports.TypeOrmCandidateEducationRepository = TypeOrmCandidateEducationRepository;
exports.TypeOrmCandidateEducationRepository = TypeOrmCandidateEducationRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(candidate_education_entity_1.CandidateEducation)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], TypeOrmCandidateEducationRepository);
//# sourceMappingURL=type-orm-candidate-education.repository.js.map