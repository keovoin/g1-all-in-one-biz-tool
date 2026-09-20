import { HttpClient } from '@angular/common/http';
import { IAggregatedEmployeeStatistic, IAggregatedEmployeeStatisticFindInput, IEmployeeStatistics, IEmployeeStatisticsFindInput, IMonthAggregatedEmployeeStatisticsFindInput, IMonthAggregatedEmployeeStatistics, IEmployeeStatisticsHistoryFindInput, IEmployeeStatisticsHistory } from '@gauzy/contracts';
import * as i0 from "@angular/core";
export declare class EmployeeStatisticsService {
    private http;
    constructor(http: HttpClient);
    /**
     * Gets the aggregated statistics for all employees of the organization from the start of time till now.
     * If date is provided in findInput it will return only for the month selected.
     */
    getAggregateStatisticsByOrganizationId(findInput?: IAggregatedEmployeeStatisticFindInput): Promise<IAggregatedEmployeeStatistic>;
    /**
     * Gets the statistics for the selected employee for the last 12 months.
     * If date is provided in findInput it will return only for the month selected.
     * @param employeeId The id of the employee.
     * @param findInput Object containing valueDate.
     * @returns Promise<EmployeeStatistics>
     */
    getStatisticsByEmployeeId(employeeId: string, findInput?: IEmployeeStatisticsFindInput): Promise<IEmployeeStatistics>;
    /**
     * Gets the statistics for the selected employee for the last N months.
     * @param findInput Object containing valueDate, employeeId, Months.
     * @returns Promise<MonthAggregatedEmployeeStatistics[]>
     */
    getAggregatedStatisticsByEmployeeId(where: IMonthAggregatedEmployeeStatisticsFindInput): Promise<IMonthAggregatedEmployeeStatistics[]>;
    /**
     * Gets the statistics history for the selected employee for the last N months.
     * @param findInput Object containing valueDate, employeeId, Months and History Type.
     * @returns Promise<EmployeeStatisticsHistory[]
     */
    getEmployeeStatisticsHistory(findInput: IEmployeeStatisticsHistoryFindInput): Promise<IEmployeeStatisticsHistory[]>;
    static ɵfac: i0.ɵɵFactoryDeclaration<EmployeeStatisticsService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<EmployeeStatisticsService>;
}
