import { CommandBus } from '@nestjs/cqrs';
import { SelectQueryBuilder, DeleteResult, UpdateResult } from 'typeorm';
import { IManualTimeInput, IGetTimeLogConflictInput, IGetTimeLogReportInput, ITimeLog, IAmountOwedReport, IGetTimeLimitReportInput, ITimeLimitReport, IProjectBudgetLimitReport, IClientBudgetLimitReport, IDeleteTimeLog, IEmployee, ID } from '@gauzy/contracts';
import { TenantAwareCrudService } from './../../core/crud';
import { TypeOrmTimeLogRepository } from './repository/type-orm-time-log.repository';
import { MikroOrmTimeLogRepository } from './repository/mikro-orm-time-log.repository';
import { TypeOrmEmployeeRepository } from '../../employee/repository/type-orm-employee.repository';
import { TypeOrmOrganizationProjectRepository } from '../../organization-project/repository/type-orm-organization-project.repository';
import { TypeOrmOrganizationContactRepository } from '../../organization-contact/repository/type-orm-organization-contact.repository';
import { ManagedEmployeeService } from '../../employee/managed-employee.service';
import { TimeLog } from './time-log.entity';
export declare class TimeLogService extends TenantAwareCrudService<TimeLog> {
    readonly typeOrmTimeLogRepository: TypeOrmTimeLogRepository;
    readonly mikroOrmTimeLogRepository: MikroOrmTimeLogRepository;
    readonly typeOrmEmployeeRepository: TypeOrmEmployeeRepository;
    readonly typeOrmOrganizationProjectRepository: TypeOrmOrganizationProjectRepository;
    readonly typeOrmOrganizationContactRepository: TypeOrmOrganizationContactRepository;
    private readonly commandBus;
    private readonly _managedEmployeeService;
    constructor(typeOrmTimeLogRepository: TypeOrmTimeLogRepository, mikroOrmTimeLogRepository: MikroOrmTimeLogRepository, typeOrmEmployeeRepository: TypeOrmEmployeeRepository, typeOrmOrganizationProjectRepository: TypeOrmOrganizationProjectRepository, typeOrmOrganizationContactRepository: TypeOrmOrganizationContactRepository, commandBus: CommandBus, _managedEmployeeService: ManagedEmployeeService);
    /**
     * Retrieves time logs based on the provided input.
     * @param request The input parameters for fetching time logs.
     * @returns A Promise that resolves to an array of time logs.
     */
    getTimeLogs(request: IGetTimeLogReportInput): Promise<ITimeLog[]>;
    /**
     * Fetches time logs for a weekly report based on the provided input.
     * @param request The input parameters for fetching time logs.
     * @returns A Promise that resolves to an array of weekly report data.
     */
    getWeeklyReport(request: IGetTimeLogReportInput): Promise<{
        employee: IEmployee;
        dates: Record<string, any>;
        sum: number;
        activity: number;
    }[]>;
    /**
     * Fetches daily time logs for chart reports based on the provided input.
     * @param request The input parameters for fetching daily time logs.
     * @returns An array of daily time log chart reports.
     */
    getDailyReportCharts(request: IGetTimeLogReportInput): Promise<{
        date: string;
        value: {
            TRACKED: number;
            MANUAL: number;
            IDLE: number;
            RESUMED: number;
        };
    }[]>;
    /**
     * Retrieves a daily time logs report based on the provided input parameters.
     * @param request - Input parameters for querying the daily time logs report.
     * @returns A report containing time logs grouped by specified filters.
     */
    getDailyReport(request: IGetTimeLogReportInput): Promise<any>;
    /**
     * Fetches an owed amount report based on the provided input.
     * @param request The input parameters for fetching the owed amount report.
     * @returns A Promise that resolves to an array of owed amount report data.
     */
    getOwedAmountReport(request: IGetTimeLogReportInput): Promise<IAmountOwedReport[]>;
    /**
     * Fetches owed amount report data for charts based on the provided input.
     * @param request The input parameters for fetching owed amount report charts.
     * @returns An array of owed amount report chart data.
     */
    getOwedAmountReportCharts(request: IGetTimeLogReportInput): Promise<{
        date: string;
        value: any;
    }[]>;
    /**
     * It retrieves time log data, processes it, and calculates time limits for each employee based on the specified duration (day, month, etc.).
     * @param request - An object containing input parameters for the time limit report.
     * @returns An array of ITimeLimitReport containing information about time limits and durations for each date and employee.
     */
    getTimeLimit(request: IGetTimeLimitReportInput): Promise<ITimeLimitReport[]>;
    /**
     * Fetches project budget limit report data based on the provided input.
     * @param request The input parameters for fetching project budget limit report data.
     * @returns An array of project budget limit report data.
     */
    getProjectBudgetLimit(request: IGetTimeLogReportInput): Promise<IProjectBudgetLimitReport[]>;
    /**
     * Calculate client budget limit report for a given organization contact.
     * @param organizationContact The organization contact for which to calculate the budget limit report.
     * @returns The client budget limit report.
     */
    getClientBudgetLimit(request: IGetTimeLogReportInput): Promise<IClientBudgetLimitReport[]>;
    /**
     * Modifies the provided query to filter TimeLogs based on the given criteria.
     * @param query - The query to be modified.
     * @param request - The criteria for filtering TimeLogs.
     * @returns The modified query.
     */
    getFilterTimeLogQuery(query: SelectQueryBuilder<TimeLog>, request: IGetTimeLogReportInput): Promise<SelectQueryBuilder<TimeLog>>;
    /**
     * Builds a MikroORM-compatible where object for filtering TimeLogs.
     * This mirrors the getFilterTimeLogQuery logic for MikroORM.
     *
     * @param request - The criteria for filtering TimeLogs.
     * @returns A MikroORM-compatible where object.
     */
    private buildMikroOrmTimeLogWhere;
    /**
     * Returns the time logs of an employee that overlap a date range, for a REQUEST-BORNE input.
     *
     * `GET /timesheet/time-log/conflict` used to hand the caller's query straight to
     * `IGetConflictTimeLogCommand`, which uses `employeeId` and `organizationId` verbatim. The route
     * only requires the TIME_TRACKER permission — which the default EMPLOYEE role holds — so any
     * employee could name a colleague's employee id and read that colleague's time logs (start/stop
     * times, description, source, plus any joined relation) over any date range they liked.
     *
     * This wrapper puts the same authorization the report and delete paths already use in front of
     * it, and is the ONLY entry point the controller should use. `addManualTime`, `updateManualTime`
     * and the timer service keep executing the command directly: their `employeeId` has already been
     * forced to the caller's own by `TimeLogBodyTransformPipe`.
     *
     * @param input The validated conflict query.
     * @returns The conflicting time logs the caller is allowed to see.
     */
    getConflictTimeLogs(input: IGetTimeLogConflictInput): Promise<ITimeLog[]>;
    /**
     * Adds a manual time log entry.
     *
     * @param request The input data for the manual time log.
     * @returns The created time log entry.
     */
    addManualTime(request: IManualTimeInput): Promise<ITimeLog>;
    /**
     * Updates a manual time log entry.
     *
     * @param id The ID of the time log entry to be updated.
     * @param request The updated data for the manual time log.
     * @returns The updated time log entry.
     */
    updateManualTime(id: ID, request: IManualTimeInput): Promise<ITimeLog>;
    /**
     * Deletes time logs based on the provided parameters.
     *
     * @param params - The parameters for deleting the time logs, including `logIds`, `organizationId`, and `forceDelete`.
     * @returns A promise that resolves to the result of the delete or soft delete operation.
     * @throws NotAcceptableException if no log IDs are provided.
     */
    deleteTimeLogs(params: IDeleteTimeLog): Promise<DeleteResult | UpdateResult>;
    /**
     * Check if the provided date range is allowed.
     *
     * @param start - Start date
     * @param end - End date
     * @param organization - Organization object
     * @returns {boolean} - Returns true if the date range is allowed, otherwise false.
     */
    private allowDate;
    private static readonly TASK_SELECT_FIELDS;
}
