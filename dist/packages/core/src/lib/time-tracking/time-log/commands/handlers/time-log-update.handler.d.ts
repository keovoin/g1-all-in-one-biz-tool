import { ICommandHandler, CommandBus } from '@nestjs/cqrs';
import { ITimeLog } from '@gauzy/contracts';
import { TimeSlotService } from '../../../time-slot/time-slot.service';
import { MultiORM } from './../../../../core/utils';
import { TimeLogUpdateCommand } from '../time-log-update.command';
import { TypeOrmTimeLogRepository } from '../../repository/type-orm-time-log.repository';
import { TypeOrmTimeSlotRepository } from '../../../time-slot/repository/type-orm-time-slot.repository';
import { MikroOrmTimeSlotRepository } from '../../../time-slot/repository/mikro-orm-time-slot.repository';
export declare class TimeLogUpdateHandler implements ICommandHandler<TimeLogUpdateCommand> {
    private readonly commandBus;
    private readonly typeOrmTimeLogRepository;
    private readonly typeOrmTimeSlotRepository;
    private readonly mikroOrmTimeSlotRepository;
    private readonly timeSlotService;
    protected ormType: MultiORM;
    constructor(commandBus: CommandBus, typeOrmTimeLogRepository: TypeOrmTimeLogRepository, typeOrmTimeSlotRepository: TypeOrmTimeSlotRepository, mikroOrmTimeSlotRepository: MikroOrmTimeSlotRepository, timeSlotService: TimeSlotService);
    /**
     * Updates a time log, manages associated time slots, and recalculates timesheet and employee hours.
     *
     * This method retrieves the time log, updates its details, and handles time slot conflicts if the start or stop time is modified.
     * It creates new time slots if necessary, saves the updated time log, and recalculates the timesheet and employee hours.
     *
     * @param command - The command containing the time log update data, including options for force delete and manual time slots.
     * @returns A promise that resolves to the updated `TimeLog`.
     */
    execute(command: TimeLogUpdateCommand): Promise<ITimeLog>;
    /**
     * Retrieves a time log by its ID or directly returns the instance if provided.
     *
     * If the `id` parameter is already a `TimeLog` instance, it is returned as is. Otherwise, it fetches
     * the time log from the repository using the provided `id`.
     *
     * @param id - The time log ID or an instance of `TimeLog`.
     * @returns A promise that resolves to the `ITimeLog` instance.
     */
    private getTimeLogByIdOrInstance;
    /**
     * Identifies the conflicting start times that need to be removed from time slots.
     *
     * This method filters out time slots that have matching `startedAt` times in the new slots and returns
     * the start times of the slots that need to be removed.
     *
     * @param slots - The existing time slots.
     * @param newSlots - The newly generated time slots.
     * @returns An array of conflicting start times that need to be removed.
     */
    private getConflictingStartTimes;
    /**
     * Removes or soft deletes conflicting time slots for a given employee within the specified time range.
     *
     * If `forceDelete` is true, the conflicting time slots will be hard deleted. Otherwise, they will be soft deleted.
     *
     * @param params - An object containing `tenantId`, `organizationId`, `employeeId`, and `startTimes`.
     * @param forceDelete - A boolean flag indicating whether to perform a hard delete (`true`) or a soft delete (`false`).
     * @returns A promise that resolves after the time slots have been deleted or soft deleted.
     */
    private removeConflictingTimeSlots;
    /**
     * Bulk creates time slots for a given time log.
     *
     * This method enriches the provided time slots by adding additional fields like `employeeId`, `organizationId`,
     * `tenantId`, and `timeLogId`, along with initializing `keyboard`, `mouse`, and `overall` activity metrics to zero.
     * It filters out any slots that do not have valid `tenantId` or `organizationId` values and then performs a bulk creation of time slots.
     *
     * @param updateTimeSlots - The array of time slots that need to be enriched and created.
     * @param timeLog - The time log associated with the time slots.
     * @param employeeId - The ID of the employee associated with the time slots.
     * @param organizationId - The ID of the organization associated with the time slots.
     * @param tenantId - The tenant ID associated with the time slots.
     * @returns A promise that resolves to an array of created time slots.
     */
    private bulkCreateTimeSlots;
    /**
     * Saves the updated time log to the repository.
     *
     * @param timeLog - The time log to be saved.
     * @returns A promise that resolves to the saved `ITimeLog` or throws an error if saving fails.
     */
    private saveUpdatedTimeLog;
    /**
     * Recalculates the timesheet activities and updates the employee's total worked hours.
     *
     * This method first recalculates the total activity for the given timesheet by executing the
     * `TimesheetRecalculateCommand`. Then, if an `employeeId` is provided, it updates the total
     * worked hours for that employee by executing the `UpdateEmployeeTotalWorkedHoursCommand`.
     *
     * @param timesheetId - The ID of the timesheet for which the activity needs to be recalculated.
     * @param employeeId - The ID of the employee whose total worked hours should be updated. If `null` or `undefined`, no update will be performed for the employee.
     * @returns A promise that resolves when both recalculation operations are complete.
     */
    private recalculateTimesheetAndEmployeeHours;
}
