import { ICandidateTechnologies, ICandidateInterview, ICandidateCriterionsRating } from '@gauzy/contracts';
import { TenantOrganizationBaseEntity } from '../core/entities/internal';
export declare class CandidateTechnologies extends TenantOrganizationBaseEntity implements ICandidateTechnologies {
    name: string;
    rating?: number;
    interview?: ICandidateInterview;
    interviewId?: string;
    criterionsRatings?: ICandidateCriterionsRating[];
}
