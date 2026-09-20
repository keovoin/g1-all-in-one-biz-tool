import { IMonthAggregatedEmployeeStatisticsFindInput } from "@gauzy/contracts";
import { EmployeeFeatureDTO } from "../../employee/dto";
import { DateRangeQueryDTO } from "../../shared/dto";
declare const EmployeeAggregatedStatisticByMonthQueryDTO_base: import("@nestjs/mapped-types").MappedType<EmployeeFeatureDTO & DateRangeQueryDTO>;
/**
 * Get employee statistic query request DTO validation
 */
export declare class EmployeeAggregatedStatisticByMonthQueryDTO extends EmployeeAggregatedStatisticByMonthQueryDTO_base implements IMonthAggregatedEmployeeStatisticsFindInput {
}
export {};
