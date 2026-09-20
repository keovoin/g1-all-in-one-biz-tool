import { ID, IMemberEntityBased } from '@gauzy/contracts';
import { TenantOrganizationBaseDTO } from './tenant-organization-base.dto';
export declare class MemberEntityBasedDTO extends TenantOrganizationBaseDTO implements IMemberEntityBased {
    /**
     * Array of member UUIDs.
     */
    memberIds?: ID[];
    /**
     * Array of manager UUIDs.
     */
    managerIds?: ID[];
}
