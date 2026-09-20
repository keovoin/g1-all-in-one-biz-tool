"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmCandidatePersonalQualitiesRepository = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const candidate_personal_qualities_entity_1 = require("../candidate-personal-qualities.entity");
let TypeOrmCandidatePersonalQualitiesRepository = class TypeOrmCandidatePersonalQualitiesRepository extends typeorm_2.Repository {
    constructor(repository) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
};
exports.TypeOrmCandidatePersonalQualitiesRepository = TypeOrmCandidatePersonalQualitiesRepository;
exports.TypeOrmCandidatePersonalQualitiesRepository = TypeOrmCandidatePersonalQualitiesRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(candidate_personal_qualities_entity_1.CandidatePersonalQualities)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], TypeOrmCandidatePersonalQualitiesRepository);
//# sourceMappingURL=type-orm-candidate-personal-qualities.repository.js.map