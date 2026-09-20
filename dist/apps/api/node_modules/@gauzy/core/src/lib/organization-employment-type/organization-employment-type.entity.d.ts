import { ICandidate, IEmployee, IOrganizationEmploymentType, ITag } from '@gauzy/contracts';
import { TenantOrganizationBaseEntity } from '../core/entities/internal';
export declare class OrganizationEmploymentType extends TenantOrganizationBaseEntity implements IOrganizationEmploymentType {
    name: string;
    tags?: ITag[];
    /**
     * Employee
     */
    members?: IEmployee[];
    /**
     * Candidate
     */
    candidates?: ICandidate[];
}
