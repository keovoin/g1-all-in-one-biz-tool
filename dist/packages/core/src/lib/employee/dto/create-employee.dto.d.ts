import { ID, IEmployee, IEmployeeCreateInput } from '@gauzy/contracts';
import { EmploymentDTO } from './employment.dto';
import { UserInputDTO } from './user-input-dto';
import { RelationalTagDTO } from './../../tags/dto';
declare const CreateEmployeeDTO_base: import("@nestjs/mapped-types").MappedType<EmploymentDTO & RelationalTagDTO>;
/**
 * Employee Create DTO
 *
 */
export declare class CreateEmployeeDTO extends CreateEmployeeDTO_base implements IEmployeeCreateInput {
    /**
     * Create user to the employee
     */
    readonly user: UserInputDTO;
    /**
     * Sync user to the employee
     */
    readonly userId: ID;
    readonly password: string;
    readonly members?: IEmployee[];
    originalUrl?: string;
}
export {};
