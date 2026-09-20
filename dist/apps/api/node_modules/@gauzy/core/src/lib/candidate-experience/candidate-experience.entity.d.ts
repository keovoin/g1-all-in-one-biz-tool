import { ICandidateExperience, ICandidate, ID } from '@gauzy/contracts';
import { TenantOrganizationBaseEntity } from '../core/entities/internal';
export declare class CandidateExperience extends TenantOrganizationBaseEntity implements ICandidateExperience {
    occupation: string;
    duration: string;
    description?: string;
    candidate?: ICandidate;
    candidateId?: ID;
}
