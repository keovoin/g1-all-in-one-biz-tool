import { IOrganizationDepartment, IOrganizationEmploymentType, IOrganizationPosition, ISkill } from '@gauzy/contracts';
import { TenantOrganizationBaseDTO } from './../../core/dto';
import { Employee } from '../employee.entity';
declare const EmploymentDTO_base: import("@nestjs/common").Type<TenantOrganizationBaseDTO & Pick<Employee, "description" | "short_description" | "startedWorkOn" | "endWork" | "employeeLevel" | "anonymousBonus">>;
export declare class EmploymentDTO extends EmploymentDTO_base {
    readonly organizationEmploymentTypes?: IOrganizationEmploymentType[];
    readonly organizationDepartments?: IOrganizationDepartment[];
    readonly organizationPosition?: IOrganizationPosition;
    readonly skills?: ISkill[];
}
export {};
