import { IAggregatedEmployeeStatistic, IEmployeeStatistics, IMonthAggregatedEmployeeStatistics, IEmployeeStatisticsHistory, ID } from '@gauzy/contracts';
import { QueryBus } from '@nestjs/cqrs';
import { EmployeeStatisticsService } from './employee-statistics.service';
import { EmployeeAggregatedStatisticByMonthQueryDTO } from './dto';
export declare class EmployeeStatisticsController {
    private readonly employeeStatisticsService;
    private readonly queryBus;
    constructor(employeeStatisticsService: EmployeeStatisticsService, queryBus: QueryBus);
    /**
     *
     * @param data
     * @returns
     */
    findAggregatedByOrganizationId(data: any): Promise<IAggregatedEmployeeStatistic[]>;
    /**
     *
     * @param id
     * @param data
     * @returns
     */
    findAllByEmployeeId(id: ID, data?: any): Promise<IEmployeeStatistics>;
    /**
     *
     * @param options
     * @returns
     */
    findAggregatedStatisticsByEmployeeId(options: EmployeeAggregatedStatisticByMonthQueryDTO): Promise<IMonthAggregatedEmployeeStatistics>;
    /**
     *
     * @param data
     * @returns
     */
    findEmployeeStatisticsHistory(data?: any): Promise<IEmployeeStatisticsHistory[]>;
}
