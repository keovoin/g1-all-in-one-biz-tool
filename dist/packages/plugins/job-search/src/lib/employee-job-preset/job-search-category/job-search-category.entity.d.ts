import { JobPostSourceEnum, IJobSearchCategory, ID } from '@gauzy/contracts';
import { TenantOrganizationBaseEntity } from '@gauzy/core';
export declare class JobSearchCategory extends TenantOrganizationBaseEntity implements IJobSearchCategory {
    name?: string;
    jobSourceCategoryId?: ID;
    jobSource?: JobPostSourceEnum;
}
