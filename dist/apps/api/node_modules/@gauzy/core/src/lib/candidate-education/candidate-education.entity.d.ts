import { ICandidateEducation, ICandidate } from '@gauzy/contracts';
import { TenantOrganizationBaseEntity } from '../core/entities/internal';
export declare class CandidateEducation extends TenantOrganizationBaseEntity implements ICandidateEducation {
    schoolName: string;
    degree: string;
    field: string;
    completionDate: Date;
    notes?: string;
    /**
     * Candidate
     */
    candidate?: ICandidate;
    candidateId?: string;
}
