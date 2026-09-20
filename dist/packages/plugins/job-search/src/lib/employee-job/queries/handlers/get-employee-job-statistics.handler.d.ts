import { IQueryHandler } from '@nestjs/cqrs';
import { GauzyAIService } from '@gauzy/plugin-integration-ai';
import { IEmployee, IPagination } from '@gauzy/contracts';
import { EmployeeService } from '@gauzy/core';
import { GetEmployeeJobStatisticsQuery } from '../get-employee-job-statistics.query';
export declare class GetEmployeeJobStatisticsHandler implements IQueryHandler<GetEmployeeJobStatisticsQuery> {
    private readonly employeeService;
    private readonly gauzyAIService;
    /**
     *
     * @param employeeService
     * @param gauzyAIService
     */
    constructor(employeeService: EmployeeService, gauzyAIService: GauzyAIService);
    /**
     * Executes the GetEmployeeJobStatisticsQuery to fetch paginated employee data
     * and augment it with additional statistics.
     *
     * @param query - The query containing options for pagination.
     * @returns A Promise resolving to an IPagination<IEmployee> with augmented data.
     */
    execute(query: GetEmployeeJobStatisticsQuery): Promise<IPagination<IEmployee>>;
}
