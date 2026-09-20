import { CommandBus, ICommandHandler } from '@nestjs/cqrs';
import { ITimeSlot } from '@gauzy/contracts';
import { MultiORM } from './../../../../core/utils';
import { TimeSlotMergeCommand } from '../time-slot-merge.command';
import { TypeOrmTimeSlotRepository } from '../../repository/type-orm-time-slot.repository';
import { MikroOrmTimeSlotRepository } from '../../repository/mikro-orm-time-slot.repository';
export declare class TimeSlotMergeHandler implements ICommandHandler<TimeSlotMergeCommand> {
    private readonly typeOrmTimeSlotRepository;
    private readonly mikroOrmTimeSlotRepository;
    private readonly commandBus;
    protected ormType: MultiORM;
    constructor(typeOrmTimeSlotRepository: TypeOrmTimeSlotRepository, mikroOrmTimeSlotRepository: MikroOrmTimeSlotRepository, commandBus: CommandBus);
    /**
     * Execute the TimeSlot merge command
     *
     * @param command - The TimeSlotMergeCommand to execute
     */
    execute(command: TimeSlotMergeCommand): Promise<ITimeSlot[]>;
    /**
     * Aggregates, saves new time slots, and deletes old ones.
     *
     * @param groupedTimeSlots - The grouped time slots by rounded start time
     * @param tenantId - Tenant ID associated with the time slots
     * @param organizationId - Organization ID associated with the time slots
     * @param employeeId - Employee ID associated with the time slots
     * @param forceDelete - Flag to force deletion of old time slots
     * @returns An array of created time slots
     */
    private mergeAndSaveTimeSlots;
    /**
     * Rounds start and end dates to the nearest 10 minutes and returns the formatted date range.
     *
     * @param start - Start date of the range
     * @param end - End date of the range
     * @returns The formatted start and end dates
     */
    private getRoundedDateRange;
    /**
     * Group time slots by their start time
     * @param timeSlots - The array of time slots to group
     * @returns An object where keys are the start times and values are arrays of time slots
     */
    private groupTimeSlots;
    /**
     * Creates a new TimeSlot instance by aggregating data from multiple time slots.
     * Calculates the overall duration, keyboard, mouse, and activity metrics, and
     * creates a new `TimeSlot` entity with aggregated screenshots, activities, and time logs.
     *
     * @param slots - The array of time slots to aggregate data from
     * @param startedAt - The start time for the new aggregated time slot
     * @param tenantId - The tenant ID associated with the time slot
     * @param organizationId - The organization ID associated with the time slot
     * @param employeeId - The employee ID associated with the time slot
     * @returns A new `TimeSlot` instance with aggregated data
     */
    private createNewTimeSlot;
    /**
     * Deletes or soft-deletes old time slots based on the `forceDelete` flag.
     *
     * @param slots - Array of time slots to clean up
     * @param forceDelete - Flag to indicate if deletion should be permanent
     */
    private cleanUpOldTimeSlots;
    /**
     * Aggregates data from multiple time slots into a single object.
     * It calculates the total duration, keyboard activity, mouse activity, and overall activity,
     * and consolidates screenshots, time logs, and activities into arrays.
     *
     * @param slots - An array of time slots to be aggregated.
     * @returns An object containing aggregated duration, keyboard activity, mouse activity,
     * overall activity, and arrays of screenshots, time logs, and activities.
     */
    private aggregateTimeSlot;
    /**
     * Calculates the average activity metrics from the aggregated data.
     * It calculates average keyboard and mouse activity from time slots that contain non-zero keyboard data.
     * It also ensures each metric (duration, overall, keyboard, mouse) is capped at a maximum of 600.
     *
     * @param data - Aggregated data from time slots including total keyboard, mouse, and overall activities.
     * @returns An object containing the calculated activity metrics (duration, overall, keyboard, mouse).
     */
    private calculateActivity;
    /**
     * Maps and prepares screenshots for a new time slot by omitting the `timeSlotId` property.
     *
     * @param screenshots - Array of screenshots to be mapped
     * @returns A new array of `Screenshot` instances without `timeSlotId`
     */
    private mapScreenshots;
    /**
     * Maps and prepares activities for a new time slot by omitting the `timeSlotId` property.
     *
     * @param activities - Array of activities to be mapped
     * @returns A new array of `Activity` instances without `timeSlotId`
     */
    private mapActivities;
    /**
     * Maps and deduplicates time logs by their unique ID.
     *
     * @param logs - Array of time logs to be mapped and deduplicated
     * @returns Array of unique time logs
     */
    private mapUniqueTimeLogs;
    /**
     * Calculates a value safely, returning 0 if the input is undefined or not a number.
     *
     * @param value - The value to calculate
     * @returns The calculated value, or 0 if the input is undefined or invalid
     */
    private calculateValue;
    /**
     * Round a moment date to the nearest 10 minutes
     *
     * @param date - The moment date to round
     * @returns The rounded moment date
     */
    private roundToNearestTenMinutes;
    /**
     * Get time slots for the given date range.
     *
     * @param params - An object containing parameters like organizationId, employeeId, tenantId, startedAt, and stoppedAt.
     * @returns A promise that resolves to an array of TimeSlot instances.
     */
    private getTimeSlots;
    /**
     * Updates time logs and recalculates the total worked hours for an employee based on the given time slot.
     *
     * @param newTimeSlot - The newly created time slot containing time logs and employee information.
     */
    private updateTimeLogAndEmployeeTotalWorkedHours;
}
