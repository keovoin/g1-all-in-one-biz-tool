import { ICandidateCriterionsRating, ICandidateCriterionsRatingCreateInput, ID } from '@gauzy/contracts';
import { TenantAwareCrudService } from './../core/crud';
import { CandidateCriterionsRating } from './candidate-criterion-rating.entity';
import { TypeOrmCandidateCriterionsRatingRepository } from './repository/type-orm-candidate-criterions-rating.repository';
import { MikroOrmCandidateCriterionsRatingRepository } from './repository/mikro-orm-candidate-criterions-rating.repository';
export declare class CandidateCriterionsRatingService extends TenantAwareCrudService<CandidateCriterionsRating> {
    constructor(typeOrmCandidateCriterionsRatingRepository: TypeOrmCandidateCriterionsRatingRepository, mikroOrmCandidateCriterionsRatingRepository: MikroOrmCandidateCriterionsRatingRepository);
    /**
     * Creates bulk candidate criterion ratings.
     */
    createBulk(technologyInputs?: ICandidateCriterionsRatingCreateInput[], qualityInputs?: ICandidateCriterionsRatingCreateInput[]): Promise<CandidateCriterionsRating[]>;
    /**
     * Updates bulk candidate criterion ratings.
     */
    updateBulk(technologyRatings?: ICandidateCriterionsRating[], qualityRatings?: ICandidateCriterionsRating[]): Promise<CandidateCriterionsRating[]>;
    /**
     * Fetch criterions by feedback ID.
     */
    getCriterionsByFeedbackId(feedbackId: ID): Promise<CandidateCriterionsRating[]>;
    /**
     * Shared bulk save logic.
     */
    private saveBulk;
}
