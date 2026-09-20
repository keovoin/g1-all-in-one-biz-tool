import { Employee, BaseQueryDTO } from '@gauzy/core';
import { IQuery } from '@nestjs/cqrs';
export declare class GetEmployeeJobStatisticsQuery implements IQuery {
    readonly options: BaseQueryDTO<Employee>;
    static readonly type = "GetEmployeeJobStatisticsQuery";
    constructor(options: BaseQueryDTO<Employee>);
}
