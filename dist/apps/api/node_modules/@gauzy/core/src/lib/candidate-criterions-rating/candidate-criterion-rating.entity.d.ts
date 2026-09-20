import { ICandidateCriterionsRating, ICandidateFeedback, ICandidatePersonalQualities, ICandidateTechnologies } from '@gauzy/contracts';
import { TenantOrganizationBaseEntity } from '../core/entities/internal';
export declare class CandidateCriterionsRating extends TenantOrganizationBaseEntity implements ICandidateCriterionsRating {
    rating: number;
    /**
     * Candidate Technologies
     */
    technology?: ICandidateTechnologies;
    technologyId?: string;
    /**
     * Candidate Personal Qualities
     */
    personalQuality?: ICandidatePersonalQualities;
    personalQualityId?: string;
    /**
     * Candidate Feedback
     */
    feedback?: ICandidateFeedback;
    feedbackId?: string;
}
