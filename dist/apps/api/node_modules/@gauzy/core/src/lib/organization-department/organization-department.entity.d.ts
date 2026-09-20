import { IOrganizationDepartment, ITag, IEmployee, ICandidate } from '@gauzy/contracts';
import { TenantOrganizationBaseEntity } from '../core/entities/internal';
export declare class OrganizationDepartment extends TenantOrganizationBaseEntity implements IOrganizationDepartment {
    name: string;
    /**
     * Tag
     */
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
