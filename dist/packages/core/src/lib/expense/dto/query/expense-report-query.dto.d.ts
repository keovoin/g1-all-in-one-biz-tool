import { IGetExpenseInput, ReportGroupFilterEnum } from "@gauzy/contracts";
import { RelationsQueryDTO, SelectorsQueryDTO } from "./../../../shared/dto";
declare const ExpenseReportQueryDTO_base: import("@nestjs/mapped-types").MappedType<RelationsQueryDTO & SelectorsQueryDTO>;
/**
 * Get expense report request DTO validation
 */
export declare class ExpenseReportQueryDTO extends ExpenseReportQueryDTO_base implements IGetExpenseInput {
    readonly groupBy: ReportGroupFilterEnum;
    readonly categoryId: string;
}
export {};
