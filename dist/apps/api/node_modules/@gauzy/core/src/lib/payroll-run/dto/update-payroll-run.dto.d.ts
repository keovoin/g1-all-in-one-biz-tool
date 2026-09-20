import { IPayrollRunUpdateInput } from '@gauzy/contracts';
import { CreatePayrollRunDTO } from './create-payroll-run.dto';
declare const UpdatePayrollRunDTO_base: import("@nestjs/common").Type<Partial<CreatePayrollRunDTO>>;
/**
 * Update Payroll Run request DTO.
 *
 * Derived from the create DTO, so `status`, `totalGross`, `totalDeductions` and `totalNet` cannot
 * be set here either. Combined with `whitelist: true` on the endpoint, a body carrying them is
 * stripped rather than silently applied.
 */
export declare class UpdatePayrollRunDTO extends UpdatePayrollRunDTO_base implements IPayrollRunUpdateInput {
}
export {};
