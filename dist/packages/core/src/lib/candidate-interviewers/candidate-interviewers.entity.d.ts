import { ICandidateInterviewers, ICandidateInterview, IEmployee } from '@gauzy/contracts';
import { TenantOrganizationBaseEntity } from '../core/entities/internal';
export declare class CandidateInterviewers extends TenantOrganizationBaseEntity implements ICandidateInterviewers {
    interview: ICandidateInterview;
    interviewId: string;
    employee: IEmployee;
    employeeId: string;
}
