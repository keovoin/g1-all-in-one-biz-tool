import { JobPostSourceEnum, IJobSearchOccupation } from '@gauzy/contracts';
import { TenantOrganizationBaseEntity } from '@gauzy/core';
export declare class JobSearchOccupation extends TenantOrganizationBaseEntity implements IJobSearchOccupation {
    name?: string;
    jobSourceOccupationId?: string;
    jobSource?: JobPostSourceEnum;
}
