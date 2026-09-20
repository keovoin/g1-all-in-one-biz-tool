"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmCandidateCriterionsRatingRepository = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const candidate_criterion_rating_entity_1 = require("../candidate-criterion-rating.entity");
let TypeOrmCandidateCriterionsRatingRepository = class TypeOrmCandidateCriterionsRatingRepository extends typeorm_2.Repository {
    constructor(repository) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
};
exports.TypeOrmCandidateCriterionsRatingRepository = TypeOrmCandidateCriterionsRatingRepository;
exports.TypeOrmCandidateCriterionsRatingRepository = TypeOrmCandidateCriterionsRatingRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(candidate_criterion_rating_entity_1.CandidateCriterionsRating)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], TypeOrmCandidateCriterionsRatingRepository);
//# sourceMappingURL=type-orm-candidate-criterions-rating.repository.js.map