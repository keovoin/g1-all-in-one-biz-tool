import { ICommandHandler, CommandBus } from '@nestjs/cqrs';
import { DeleteTimeSpanCommand } from '../delete-time-span.command';
import { TimeSlotService } from '../../../time-slot/time-slot.service';
import { TypeOrmTimeLogRepository } from '../../repository/type-orm-time-log.repository';
import { TypeOrmTimeSlotRepository } from '../../../time-slot/repository/type-orm-time-slot.repository';
export declare class DeleteTimeSpanHandler implements ICommandHandler<DeleteTimeSpanCommand> {
    readonly typeOrmTimeLogRepository: TypeOrmTimeLogRepository;
    readonly typeOrmTimeSlotRepository: TypeOrmTimeSlotRepository;
    private readonly _commandBus;
    private readonly _timeSlotService;
    constructor(typeOrmTimeLogRepository: TypeOrmTimeLogRepository, typeOrmTimeSlotRepository: TypeOrmTimeSlotRepository, _commandBus: CommandBus, _timeSlotService: TimeSlotService);
    /**
     * Execute delete time span logic
     *
     * @param command - The command containing newTime, timeLog, and timeSlot
     * @returns Promise<boolean>
     */
    execute(command: DeleteTimeSpanCommand): Promise<boolean>;
    /**
     * Handles non-overlapping time ranges by deleting the time log and associated time slots,
     * and recalculating the timesheet.
     *
     * @param timeLog - The time log associated with the non-overlapping time range.
     * @param timeSlot - The time slot to be deleted.
     * @param employeeId - The ID of the employee associated with the time log.
     * @param organizationId - The ID of the organization.
     * @param forceDelete - A flag indicating whether to perform a hard delete.
     */
    private handleNonOverlappingTimeRange;
    /**
     * Updates the start time or deletes the time log if remaining duration is 0.
     *
     * @param log - The time log to update or delete.
     * @param slot - The related time slot.
     * @param organizationId - The organization ID.
     * @param employeeId - The employee ID.
     * @param end - The new end time.
     * @param stoppedAt - The current stopped time of the log.
     */
    private updateStartTimeOrDelete;
    /**
     * Updates the stoppedAt time for a given time log, or deletes it if the remaining duration is 0.
     *
     * @param log - The time log to update or delete.
     * @param slot - The related time slot.
     * @param organizationId - The organization ID.
     * @param employeeId - The employee ID.
     * @param start - The new start time.
     * @param startedAt - The original start time of the time log.
     * @param end - The new end time for the time log.
     */
    private updateStopTimeOrDelete;
    /**
     * Handles splitting a time log into two entries and processing the associated time slots.
     *
     * @param timeLog - The original time log to split.
     * @param timeSlot - The related time slot.
     * @param organizationId - The organization ID.
     * @param employeeId - The employee ID.
     * @param start - The new start time.
     * @param end - The new end time.
     * @param startedAt - The original start time of the time log.
     */
    private handleTimeLogSplitting;
    /**
     * Creates and syncs the new time log if the duration is greater than 0.
     *
     * @param timeLog - The original time log (will be cloned).
     * @param end - The new start time for the new log.
     */
    private createAndSyncNewTimeLog;
    /**
     * Deletes a time log if it overlaps the entire time range.
     *
     * @param timeLog - The log to delete.
     * @param forceDelete - Whether to hard delete (default: false).
     * @returns Promise<void> - Resolves when deletion is complete.
     */
    private deleteTimeLog;
    /**
     * Synchronizes time slots for the provided time log.
     *
     * This method calculates the start and end intervals based on the `startedAt` and `stoppedAt`
     * values from the provided time log. It then retrieves the corresponding time slots for the
     * specified employee and organization within that time range. The time slot synchronization
     * is triggered with the `syncSlots` flag set to true.
     *
     * @param timeLog - The time log containing the data used to synchronize time slots (start, stop, employeeId, organizationId).
     * @returns A promise that resolves to the retrieved time slots within the specified range for the employee and organization.
     */
    private syncTimeSlots;
}
