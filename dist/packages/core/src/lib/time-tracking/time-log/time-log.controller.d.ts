import { DeleteResult, FindOneOptions, UpdateResult } from 'typeorm';
import { ITimeLog, ID } from '@gauzy/contracts';
import { TimeLogService } from './time-log.service';
import { CreateManualTimeLogDTO, DeleteTimeLogDTO, UpdateManualTimeLogDTO } from './dto';
import { GetTimeLogConflictQueryDTO, TimeLogLimitQueryDTO, TimeLogQueryDTO } from './dto/query';
export declare class TimeLogController {
    private readonly _timeLogService;
    constructor(_timeLogService: TimeLogService);
    /**
     * Get conflicting timer logs based on the provided entity.
     * @param entity The entity with information for checking conflicts.
     * @returns An array of conflicting timer logs.
     */
    getConflict(request: GetTimeLogConflictQueryDTO): Promise<ITimeLog[]>;
    /**
     * Get daily report for timer logs based on the provided options.
     * @param options The options for retrieving the daily report.
     * @returns The daily report for timer logs.
     */
    getDailyReport(options: TimeLogQueryDTO): Promise<any | null>;
    /**
     * Get chart data for the daily report of timer logs based on the provided options.
     * @param options The options for retrieving the daily report chart data.
     * @returns The chart data for the daily report of timer logs.
     */
    getDailyReportChartData(options: TimeLogQueryDTO): Promise<any | null>;
    /**
     * Get report data for the owed amount based on the provided options.
     * @param options The options for retrieving the owed amount report data.
     * @returns The report data for the owed amount.
     */
    getOwedAmountReport(options: TimeLogQueryDTO): Promise<any | null>;
    /**
     * Get chart data for the owed amount report based on the provided options.
     * @param options The options for retrieving the owed amount report chart data.
     * @returns The chart data for the owed amount report.
     */
    getOwedAmountReportChartData(options: TimeLogQueryDTO): Promise<any | null>;
    /**
     * Get the weekly report for timer logs based on the provided options.
     * @param options The options for retrieving the weekly report.
     * @returns The weekly report for timer logs if found, otherwise null.
     */
    getWeeklyReport(options: TimeLogQueryDTO): Promise<any | null>;
    /**
     * Get the time limit report for timer logs based on the provided options.
     * @param options The options for retrieving the time limit report.
     * @returns The time limit report for timer logs if found, otherwise null.
     */
    getTimeLimitReport(options: TimeLogLimitQueryDTO): Promise<any | null>;
    /**
     * Get project budget limit based on the provided options.
     * @param options The options for retrieving the project budget limit.
     * @returns The project budget limit if found, otherwise null.
     */
    getProjectBudgetLimit(options: TimeLogQueryDTO): Promise<import("@gauzy/contracts").IProjectBudgetLimitReport[]>;
    /**
     * Retrieve the client budget limit based on the provided options.
     * @param options The options for retrieving the client budget limit.
     * @returns The client budget limit if found; otherwise, null.
     */
    clientBudgetLimit(options: TimeLogQueryDTO): Promise<import("@gauzy/contracts").IClientBudgetLimitReport[]>;
    /**
     * Get timer logs based on provided options.
     * @param options The options for querying timer logs.
     * @returns An array of timer logs.
     */
    getLogs(options: TimeLogQueryDTO): Promise<ITimeLog[]>;
    /**
     * Find time log by ID
     * @param id The ID of the time log.
     * @param options Additional options for finding the time log.
     * @returns The found time log.
     */
    findById(id: ID, options: FindOneOptions): Promise<ITimeLog>;
    /**
     * Add manual time
     * @param entity The data for creating a manual time log.
     * @returns The created manual time log.
     */
    addManualTime(entity: CreateManualTimeLogDTO): Promise<ITimeLog>;
    /**
     * Update time log
     * @param id The ID of the time log entry to be updated.
     * @param entity The updated data for the manual time log.
     * @returns The updated time log entry.
     */
    updateManualTime(id: ID, entity: UpdateManualTimeLogDTO): Promise<ITimeLog>;
    /**
     * Deletes a time log based on the provided query parameters.
     *
     * @param options - The query parameters for deleting time logs, including conditions like log IDs and force delete flag.
     * @returns A Promise that resolves to either a DeleteResult or UpdateResult, depending on whether it's a soft or hard delete.
     * @throws BadRequestException if the input is invalid or deletion fails.
     */
    deleteTimeLog(options: DeleteTimeLogDTO): Promise<DeleteResult | UpdateResult>;
}
