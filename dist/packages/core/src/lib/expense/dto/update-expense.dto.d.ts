import { IExpenseUpdateInput } from '@gauzy/contracts';
import { RelationalCurrencyDTO } from './../../currency/dto';
import { OrganizationVendorFeatureDTO } from '../../organization-vendor/dto';
import { RelationalTagDTO } from './../../tags/dto';
import { ExpenseDTO } from './expense.dto';
declare const UpdateExpenseDTO_base: import("@nestjs/mapped-types").MappedType<OrganizationVendorFeatureDTO & ExpenseDTO & RelationalTagDTO & RelationalCurrencyDTO>;
/**
 * Update Expense DTO request validation
 */
export declare class UpdateExpenseDTO extends UpdateExpenseDTO_base implements IExpenseUpdateInput {
}
export {};
