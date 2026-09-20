import { ICommandHandler } from '@nestjs/cqrs';
import { MultiORM } from './../../../../core/utils';
import { ScheduleTimeLogEntriesCommand } from '../schedule-time-log-entries.command';
import { TypeOrmTimeLogRepository } from '../../repository/type-orm-time-log.repository';
import { MikroOrmTimeLogRepository } from '../../repository/mikro-orm-time-log.repository';
export declare class ScheduleTimeLogEntriesHandler implements ICommandHandler<ScheduleTimeLogEntriesCommand> {
    readonly typeOrmTimeLogRepository: TypeOrmTimeLogRepository;
    readonly mikroOrmTimeLogRepository: MikroOrmTimeLogRepository;
    protected ormType: MultiORM;
    constructor(typeOrmTimeLogRepository: TypeOrmTimeLogRepository, mikroOrmTimeLogRepository: MikroOrmTimeLogRepository);
    /**
     * Executes the scheduling of TimeLog entries based on the given command parameters.
     * This function is responsible for identifying any pending time logs for a specific tenant, organization,
     * and optionally an employee, and then processing each entry to ensure they are accurately tracked and updated.
     *
     * The function first retrieves all pending TimeLog entries that match the given criteria,
     * then iterates through each of them to perform necessary adjustments such as stopping timers,
     * updating durations, and correcting the 'stoppedAt' timestamps based on the employee's activities.
     *
     * @param command The command containing the details needed to identify the pending TimeLog entries,
     *                including `tenantId`, `organizationId`, and optionally `employeeId`.
     *
     * @returns A Promise that resolves when all pending TimeLog entries have been processed and updated.
     */
    execute(command: ScheduleTimeLogEntriesCommand): Promise<void>;
    /**
     * Retrieve pending TimeLog entries based on the given criteria.
     *
     * @param tenantId
     * @param organizationId
     * @param employeeId
     *
     * @returns A list of pending time logs
     */
    private getPendingTimeLogs;
    /**
     * Process a single TimeLog entry, adjusting its duration and stopping it if necessary.
     *
     * @param timeLog The time log entry to process
     */
    private processTimeLogEntry;
    /**
     * Updates the stoppedAt field using the startedAt value for a time log.
     *
     * @param timeLog - The time log entry to update
     */
    private updateStoppedAtUsingStartedAt;
    /**
     * Update the stoppedAt field using the total duration from the time slots for a time log.
     *
     * @param timeLog The time log entry to update
     * @param timeSlots The time slots associated with the time log
     */
    private updateStoppedAtUsingTimeSlots;
    /**
     * Update the stoppedAt field using the total duration from the time slots for a time log.
     *
     * @param timeLog The time log entry to update
     * @param timeSlots The time slots associated with the time log
     */
    private updateStoppedAtUsingTimeSlots2;
    /**
     * Marks the time log as not running (stopped) in the database.
     *
     * @param timeLog - The time log entry to stop
     */
    private stopTimeLog;
    /**
     * Saves a partial time log entity using the active ORM.
     *
     * @param partial - A partial time log entity with at least an id
     * @returns The saved time log entity
     */
    private saveTimeLog;
}
