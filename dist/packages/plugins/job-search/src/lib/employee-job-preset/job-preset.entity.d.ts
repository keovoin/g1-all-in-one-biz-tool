import { DeepPartial } from 'typeorm';
import { IEmployeeUpworkJobsSearchCriterion, IJobPresetUpworkJobSearchCriterion, IJobPreset } from '@gauzy/contracts';
import { Employee, TenantOrganizationBaseEntity } from '@gauzy/core';
export declare class JobPreset extends TenantOrganizationBaseEntity implements IJobPreset {
    constructor(input?: DeepPartial<JobPreset>);
    name?: string;
    /**
     * Employee Job Criterions
     */
    employeeCriterions?: IEmployeeUpworkJobsSearchCriterion[];
    /**
     * Job Criterions
     */
    jobPresetCriterions?: IJobPresetUpworkJobSearchCriterion[];
    /**
     * Job Preset Employees
     */
    employees?: Employee[];
}
