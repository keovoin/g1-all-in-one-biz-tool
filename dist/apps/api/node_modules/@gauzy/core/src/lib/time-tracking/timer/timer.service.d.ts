import { CommandBus } from '@nestjs/cqrs';
import { ITimerStatus, ITimerToggleInput, ITimerStatusInput, ITimeLog, IEmployee, IEmployeeFindInput, ID } from '@gauzy/contracts';
import { TimeLog } from '../../core/entities/internal';
import { MultiORM } from '../../core/utils';
import { EmployeeService } from '../../employee/employee.service';
import { TypeOrmTimeLogRepository } from '../time-log/repository/type-orm-time-log.repository';
import { MikroOrmTimeLogRepository } from '../time-log/repository/mikro-orm-time-log.repository';
import { TypeOrmEmployeeRepository } from '../../employee/repository/type-orm-employee.repository';
import { MikroOrmEmployeeRepository } from '../../employee/repository/mikro-orm-employee.repository';
export declare class TimerService {
    readonly typeOrmTimeLogRepository: TypeOrmTimeLogRepository;
    readonly mikroOrmTimeLogRepository: MikroOrmTimeLogRepository;
    readonly typeOrmEmployeeRepository: TypeOrmEmployeeRepository;
    readonly mikroOrmEmployeeRepository: MikroOrmEmployeeRepository;
    private readonly _employeeService;
    private readonly _commandBus;
    protected ormType: MultiORM;
    constructor(typeOrmTimeLogRepository: TypeOrmTimeLogRepository, mikroOrmTimeLogRepository: MikroOrmTimeLogRepository, typeOrmEmployeeRepository: TypeOrmEmployeeRepository, mikroOrmEmployeeRepository: MikroOrmEmployeeRepository, _employeeService: EmployeeService, _commandBus: CommandBus);
    /**
     * Fetches an employee based on the provided query.
     *
     * @param query - The query parameters to find the employee.
     * @returns A Promise resolving to the employee entity or null.
     */
    fetchEmployee(query: IEmployeeFindInput): Promise<IEmployee | null>;
    /**
     * Implementation of timer status logic
     * This is intended to be used directly by the command handler
     */
    getTimerStatus(request: ITimerStatusInput): Promise<ITimerStatus>;
    /**
     * Implementation of start timer logic
     * This is intended to be used directly by the command handler
     */
    startTimer(request: ITimerToggleInput): Promise<ITimeLog>;
    /**
     * Implementation of stop timer logic
     * This is intended to be used directly by the command handler
     */
    stopTimer(request: ITimerToggleInput): Promise<ITimeLog>;
    /**
     * Handles any conflicting time logs that overlap with the current time log entry.
     *
     * @param lastLog The last running time log entry.
     * @param tenantId The tenant ID.
     * @param organizationId The organization ID.
     * @param forceDelete Flag indicating whether to force delete the conflicts.
     */
    private handleConflictingTimeLogs;
    /**
     * Calculates the stoppedAt time for the current time log based on the request and the last running time log.
     * It adjusts the stoppedAt time based on various conditions, such as the time log source (e.g., DESKTOP) and time slots.
     *
     * - If the source is DESKTOP and the last time slot was created more than 10 minutes ago,
     *   the stoppedAt time is adjusted based on the last time slot's duration.
     * - If no time slots exist and the last log's startedAt time exceeds 10 minutes from the current time,
     *   the stoppedAt time is adjusted by 10 seconds from the startedAt time.
     *
     * @param {ITimerToggleInput} request - The input data for stopping the timer, including stoppedAt and source.
     * @param {ITimeLog} lastLog - The last running time log, which may include time slots for more detailed tracking.
     * @returns {Promise<Date>} - A promise that resolves to the calculated stoppedAt date, adjusted as necessary.
     */
    calculateStoppedAt(request: ITimerToggleInput, lastLog: ITimeLog): Promise<Date>;
    /**
     * Calculates the stoppedAt time based on the last log and request parameters.
     * It handles the case for DESKTOP source, considering time slots' durations.
     *
     * @param request - The input request containing timer toggle information
     * @param lastLog - The last running time log for the employee
     * @returns The calculated stoppedAt date
     */
    calculateStoppedAt2(request: ITimerToggleInput, lastLog: ITimeLog): Promise<Date>;
    /**
     * Toggle time tracking start/stop
     *
     * @param request The timer toggle request input
     * @returns The started or stopped TimeLog
     */
    toggleTimeLog(request: ITimerToggleInput): Promise<TimeLog>;
    /**
     * Stops all previous running timers for the specified employee.
     *
     * @param employeeId - The ID of the employee whose timers need to be stopped
     * @param organizationId - The ID of the organization to which the employee belongs
     * @param tenantId - The ID of the tenant context
     */
    stopPreviousRunningTimers(employeeId: ID, organizationId: ID, tenantId: ID): Promise<void>;
    /**
     * Retrieves the current employee record based on the user and tenant context.
     *
     * @returns The employee record if found.
     * @throws NotFoundException if the employee record is not found.
     */
    findEmployee(): Promise<IEmployee>;
    /**
     * Get the last running log or all pending running logs for the current employee
     *
     * @param fetchAll - Set to `true` to fetch all pending logs, otherwise fetch the last running log
     * @param includeTimeSlots - Set to `true` to include the associated time slots in the result
     * @returns A single time log if `fetchAll` is `false`, or an array of time logs if `fetchAll` is `true`
     */
    private getRunningLogs;
    /**
     * Get the employee's last running timer log
     *
     * @returns The last running ITimeLog entry for the current employee
     */
    private getLastRunningLog;
    /**
     * Get all pending running logs for the current employee
     *
     * @returns An array of pending time logs
     */
    private getLastRunningLogs;
    /**
     * Get timer worked status
     *
     * @param request The input parameters for the query.
     * @returns The timer status for the employee.
     */
    getTimerWorkedStatus(request: ITimerStatusInput): Promise<ITimerStatus[]>;
}
