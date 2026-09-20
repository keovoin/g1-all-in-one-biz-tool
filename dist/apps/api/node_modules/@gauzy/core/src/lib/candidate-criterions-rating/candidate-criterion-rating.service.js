"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidateCriterionsRatingService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const crud_1 = require("./../core/crud");
const type_orm_candidate_criterions_rating_repository_1 = require("./repository/type-orm-candidate-criterions-rating.repository");
const mikro_orm_candidate_criterions_rating_repository_1 = require("./repository/mikro-orm-candidate-criterions-rating.repository");
let CandidateCriterionsRatingService = class CandidateCriterionsRatingService extends crud_1.TenantAwareCrudService {
    constructor(typeOrmCandidateCriterionsRatingRepository, mikroOrmCandidateCriterionsRatingRepository) {
        super(typeOrmCandidateCriterionsRatingRepository, mikroOrmCandidateCriterionsRatingRepository);
    }
    /**
     * Creates bulk candidate criterion ratings.
     */
    async createBulk(technologyInputs = [], qualityInputs = []) {
        return this.saveBulk(technologyInputs, qualityInputs);
    }
    /**
     * Updates bulk candidate criterion ratings.
     */
    async updateBulk(technologyRatings = [], qualityRatings = []) {
        return this.saveBulk(technologyRatings, qualityRatings);
    }
    /**
     * Fetch criterions by feedback ID.
     */
    async getCriterionsByFeedbackId(feedbackId) {
        return this.find({
            where: { feedbackId }
        });
    }
    /**
     * Shared bulk save logic.
     */
    async saveBulk(tech, qual) {
        const [techResults, qualResults] = await Promise.all([
            tech.length ? this.saveMany(tech) : Promise.resolve([]),
            qual.length ? this.saveMany(qual) : Promise.resolve([])
        ]);
        return [...techResults, ...qualResults];
    }
};
exports.CandidateCriterionsRatingService = CandidateCriterionsRatingService;
exports.CandidateCriterionsRatingService = CandidateCriterionsRatingService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_candidate_criterions_rating_repository_1.TypeOrmCandidateCriterionsRatingRepository,
        mikro_orm_candidate_criterions_rating_repository_1.MikroOrmCandidateCriterionsRatingRepository])
], CandidateCriterionsRatingService);
//# sourceMappingURL=candidate-criterion-rating.service.js.map