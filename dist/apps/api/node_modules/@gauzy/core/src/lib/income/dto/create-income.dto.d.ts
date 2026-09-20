import { IIncomeCreateInput } from "@gauzy/contracts";
import { RelationalCurrencyDTO } from "./../../currency/dto";
import { EmployeeFeatureDTO } from "./../../employee/dto";
import { RelationalTagDTO } from "./../../tags/dto";
import { IncomeDTO } from "./income.dto";
declare const CreateIncomeDTO_base: import("@nestjs/mapped-types").MappedType<RelationalTagDTO & RelationalCurrencyDTO & Partial<EmployeeFeatureDTO> & IncomeDTO>;
export declare class CreateIncomeDTO extends CreateIncomeDTO_base implements IIncomeCreateInput {
}
export {};
