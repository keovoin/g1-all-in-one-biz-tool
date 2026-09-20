import { Employee, Model } from '@gauzy/core';
import { IEmployeeJobPost, JobPostSourceEnum, JobPostStatusEnum, JobPostTypeEnum } from '@gauzy/contracts';
import { JobPost } from './jobPost.entity';
export declare class EmployeeJobPost extends Model implements IEmployeeJobPost {
    employeeId: string;
    employee: Employee;
    jobPostId: string;
    isApplied?: boolean;
    appliedDate?: Date;
    jobPost: JobPost;
    jobDateCreated?: Date;
    jobStatus?: JobPostStatusEnum;
    jobSource?: JobPostSourceEnum;
    jobType?: JobPostTypeEnum;
    providerCode: string;
    providerJobId: string;
    createdAt?: Date;
    updatedAt?: Date;
    isActive: boolean;
    isArchived: boolean;
}
