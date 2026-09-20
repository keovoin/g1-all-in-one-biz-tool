import { IEmployeeAvailabilityUpdateInput } from '@gauzy/contracts';
import { CreateEmployeeAvailabilityDTO } from './create-employee-availability.dto';
declare const UpdateEmployeeAvailabilityDTO_base: import("@nestjs/common").Type<Partial<CreateEmployeeAvailabilityDTO>>;
export declare class UpdateEmployeeAvailabilityDTO extends UpdateEmployeeAvailabilityDTO_base implements IEmployeeAvailabilityUpdateInput {
}
export {};
