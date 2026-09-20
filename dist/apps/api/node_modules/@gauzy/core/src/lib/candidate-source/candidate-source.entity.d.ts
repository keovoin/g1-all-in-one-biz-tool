import { ICandidate, ICandidateSource } from '@gauzy/contracts';
import { TenantOrganizationBaseEntity } from '../core/entities/internal';
export declare class CandidateSource extends TenantOrganizationBaseEntity implements ICandidateSource {
    name: string;
    candidate?: ICandidate;
}
