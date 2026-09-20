import { IExpenseCreateInput } from '@gauzy/contracts';
import { RelationalTagDTO } from './../../tags/dto';
import { EmployeeFeatureDTO } from './../../employee/dto';
import { RelationalCurrencyDTO } from '../../currency/dto';
import { OrganizationVendorFeatureDTO } from './../../organization-vendor/dto';
import { ExpenseDTO } from './expense.dto';
declare const CreateExpenseDTO_base: import("@nestjs/mapped-types").MappedType<Partial<EmployeeFeatureDTO> & OrganizationVendorFeatureDTO & ExpenseDTO & RelationalTagDTO & RelationalCurrencyDTO>;
/**
 * Create Expense DTO request validation
 */
export declare class CreateExpenseDTO extends CreateExpenseDTO_base implements IExpenseCreateInput {
}
export {};
