import { IContact, IEmployeeUpdateInput } from '@gauzy/contracts';
import { EmploymentDTO } from './employment.dto';
import { RelationalTagDTO } from './../../tags/dto';
import { Employee } from './../employee.entity';
declare const UpdateProfileDTO_base: import("@nestjs/mapped-types").MappedType<EmploymentDTO & RelationalTagDTO & Pick<Employee, "linkedInUrl" | "facebookUrl" | "instagramUrl" | "twitterUrl" | "githubUrl" | "gitlabUrl" | "upworkUrl" | "stackoverflowUrl"> & Pick<Employee, "payPeriod" | "billRateValue" | "minimumBillingRate" | "billRateCurrency" | "reWeeklyLimit"> & Pick<Employee, "offerDate" | "acceptDate" | "rejectDate"> & Pick<Employee, "profile_link" | "isAway" | "upworkId" | "linkedInId">>;
/**
 * EMPLOYEE can updates these fields only
 * Public Fields DTO
 */
export declare class UpdateProfileDTO extends UpdateProfileDTO_base implements IEmployeeUpdateInput {
    readonly contact?: IContact;
}
export {};
