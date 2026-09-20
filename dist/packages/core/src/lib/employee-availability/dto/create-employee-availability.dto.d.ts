import { IEmployeeAvailabilityCreateInput } from '@gauzy/contracts';
import { TenantOrganizationBaseDTO } from '../../core/dto';
import { EmployeeAvailability } from '../employee-availability.entity';
declare const CreateEmployeeAvailabilityDTO_base: import("@nestjs/common").Type<TenantOrganizationBaseDTO & Pick<EmployeeAvailability, "employeeId" | "startDate" | "endDate" | "dayOfWeek" | "availabilityStatus" | "availabilityNotes">>;
export declare class CreateEmployeeAvailabilityDTO extends CreateEmployeeAvailabilityDTO_base implements IEmployeeAvailabilityCreateInput {
}
export {};
