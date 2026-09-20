import { DeepPartial } from 'typeorm';
import { IJobPreset, IJobPresetUpworkJobSearchCriterion, IJobSearchCategory, IJobSearchOccupation, JobPostTypeEnum } from '@gauzy/contracts';
import { TenantOrganizationBaseEntity } from '@gauzy/core';
export declare class JobPresetUpworkJobSearchCriterion extends TenantOrganizationBaseEntity implements IJobPresetUpworkJobSearchCriterion {
    constructor(input?: DeepPartial<JobPresetUpworkJobSearchCriterion>);
    keyword?: string;
    jobType?: JobPostTypeEnum;
    /**
     *
     */
    jobPreset?: IJobPreset;
    jobPresetId?: string;
    /**
     *
     */
    occupation?: IJobSearchOccupation;
    occupationId?: string;
    /**
     *
     */
    category?: IJobSearchCategory;
    categoryId?: string;
}
