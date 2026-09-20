import { IRecurringExpenseEditInput } from "@gauzy/contracts";
import { EmployeeFeatureDTO } from "./../../employee/dto";
import { RelationalCurrencyDTO } from "./../../currency/dto";
import { EmployeeRecurringExpenseDTO } from "./employee-recurring-expense.dto";
declare const UpdateEmployeeRecurringExpenseDTO_base: import("@nestjs/mapped-types").MappedType<RelationalCurrencyDTO & EmployeeRecurringExpenseDTO & Partial<EmployeeFeatureDTO>>;
export declare class UpdateEmployeeRecurringExpenseDTO extends UpdateEmployeeRecurringExpenseDTO_base implements IRecurringExpenseEditInput {
}
export {};
