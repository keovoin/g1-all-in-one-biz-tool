import { ICandidateSkill, ICandidate } from '@gauzy/contracts';
import { TenantOrganizationBaseEntity } from '../core/entities/internal';
export declare class CandidateSkill extends TenantOrganizationBaseEntity implements ICandidateSkill {
    name: string;
    candidate?: ICandidate;
    candidateId?: ICandidate['id'];
}
