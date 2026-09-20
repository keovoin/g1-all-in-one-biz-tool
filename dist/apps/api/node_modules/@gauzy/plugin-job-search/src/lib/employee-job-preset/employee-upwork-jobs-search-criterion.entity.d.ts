import { DeepPartial } from 'typeorm';
import { IEmployee, IEmployeeUpworkJobsSearchCriterion, IJobPreset, IJobSearchCategory, IJobSearchOccupation, JobPostTypeEnum } from '@gauzy/contracts';
import { TenantOrganizationBaseEntity } from '@gauzy/core';
export declare class EmployeeUpworkJobsSearchCriterion extends TenantOrganizationBaseEntity implements IEmployeeUpworkJobsSearchCriterion {
    constructor(input?: DeepPartial<EmployeeUpworkJobsSearchCriterion>);
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
    employee?: IEmployee;
    employeeId?: string;
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
