"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteTimeSpanHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const underscore_1 = require("underscore");
const utils_1 = require("@gauzy/utils");
const moment_extend_1 = require("../../../../core/moment-extend");
const commands_1 = require("./../../../timesheet/commands");
const delete_time_span_command_1 = require("../delete-time-span.command");
const time_log_update_command_1 = require("../time-log-update.command");
const time_log_delete_command_1 = require("../time-log-delete.command");
const time_slot_service_1 = require("../../../time-slot/time-slot.service");
const commands_2 = require("./../../../time-slot/commands");
const utils_2 = require("./../../../time-slot/utils");
const type_orm_time_log_repository_1 = require("../../repository/type-orm-time-log.repository");
const type_orm_time_slot_repository_1 = require("../../../time-slot/repository/type-orm-time-slot.repository");
let DeleteTimeSpanHandler = class DeleteTimeSpanHandler {
    constructor(typeOrmTimeLogRepository, typeOrmTimeSlotRepository, _commandBus, _timeSlotService) {
        this.typeOrmTimeLogRepository = typeOrmTimeLogRepository;
        this.typeOrmTimeSlotRepository = typeOrmTimeSlotRepository;
        this._commandBus = _commandBus;
        this._timeSlotService = _timeSlotService;
    }
    /**
     * Execute delete time span logic
     *
     * @param command - The command containing newTime, timeLog, and timeSlot
     * @returns Promise<boolean>
     */
    async execute(command) {
        const { newTime, timeLog, timeSlot, forceDelete } = command;
        const { id } = timeLog;
        const { start, end } = newTime;
        // Retrieve the time log with the specified ID
        const log = await this.typeOrmTimeLogRepository.findOne({
            where: { id },
            relations: { timeSlots: true }
        });
        const { startedAt, stoppedAt, employeeId, organizationId } = log;
        const newTimeRange = moment_extend_1.moment.range(start, end); // Calculate the new time rang
        const dbTimeRange = moment_extend_1.moment.range(startedAt, stoppedAt); // Calculate the database time range
        /*
         * Check is overlapping time or not.
         */
        if (!newTimeRange.overlaps(dbTimeRange, { adjacent: false })) {
            console.log('Not Overlapping', newTimeRange, dbTimeRange);
            // Handle non-overlapping time ranges
            await this.handleNonOverlappingTimeRange(log, timeSlot, employeeId, organizationId, forceDelete);
        }
        if ((0, moment_extend_1.moment)(startedAt).isBetween((0, moment_extend_1.moment)(start), (0, moment_extend_1.moment)(end), null, '[]')) {
            if ((0, moment_extend_1.moment)(stoppedAt).isBetween((0, moment_extend_1.moment)(start), (0, moment_extend_1.moment)(end), null, '[]')) {
                /*
                 * Delete time log because overlap entire time.
                 * New Start time							New Stop time
                 * |-----------------------------------------------------|
                 * 		DB Start Time				DB Stop Time
                 *  		|--------------------------------------|
                 */
                // Overlap entire time: delete time log
                console.log('Delete time log because overlap entire time.');
                await this.deleteTimeLog(log, forceDelete);
            }
            else {
                /*
                 * Update start time
                 * New Start time							New Stop time
                 * |-----------------------------------------------------|
                 * 		DB Start Time				DB Stop Time
                 * 		|--------------------------------------	|
                 */
                // Partial overlap: update start time or delete
                console.log(`Partial overlap: update started time or delete`);
                await this.updateStartTimeOrDelete(log, timeSlot, organizationId, employeeId, end, stoppedAt, forceDelete);
            }
        }
        else {
            if ((0, moment_extend_1.moment)(timeLog.stoppedAt).isBetween((0, moment_extend_1.moment)(start), (0, moment_extend_1.moment)(end), null, '[]')) {
                /*
                 * Update stopped time
                 * New Start time							New Stop time
                 * |----------------------------------------------------|
                 * 		DB Start Time				DB Stop Time
                 * 		|--------------------------------------|
                 */
                console.log(`Partial overlap: update stopped time or delete`);
                await this.updateStopTimeOrDelete(log, timeSlot, organizationId, employeeId, start, startedAt, end, forceDelete);
            }
            else {
                /*
                 * Split database time in two entries.
                 * New Start time (start)						New Stop time (end)
                 * |---------------------------------------------------------------|
                 * 		DB Start Time (startedAt)	DB Stop Time (stoppedAt)
                 *  		|--------------------------------------------------|
                 */
                console.log('Split database time in two entries.');
                await this.handleTimeLogSplitting(timeLog, timeSlot, organizationId, employeeId, start, end, startedAt, forceDelete);
            }
        }
        return true;
    }
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
    async handleNonOverlappingTimeRange(timeLog, timeSlot, employeeId, organizationId, forceDelete = false) {
        // Delete the associated time slots
        const timeSlotsIds = [timeSlot.id];
        // Bulk delete the time slots
        await this._commandBus.execute(new commands_2.TimeSlotBulkDeleteCommand({
            organizationId,
            employeeId,
            timeLog,
            timeSlotsIds
        }, forceDelete, true));
        // Recalculate the timesheet
        await this._commandBus.execute(new commands_1.TimesheetRecalculateCommand(timeLog.timesheetId));
    }
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
    async updateStartTimeOrDelete(log, slot, organizationId, employeeId, end, stoppedAt, forceDelete = false) {
        const stoppedAtMoment = (0, moment_extend_1.moment)(stoppedAt); // Get the stopped at moment
        const endMoment = (0, moment_extend_1.moment)(end); // Get the end moment
        const remainingDuration = stoppedAtMoment.diff(endMoment, 'seconds'); // Calculate the remaining duration
        // If there is remaining duration
        if (remainingDuration > 0) {
            // Update the start time if there is remaining duration
            try {
                console.log(`update startedAt time to ${end}`);
                // Update the started at time
                let timeLog = await this._commandBus.execute(new time_log_update_command_1.TimeLogUpdateCommand({ startedAt: end }, log, true, forceDelete));
                // Delete the associated time slots
                const timeSlotsIds = [slot.id];
                // Bulk delete the time slots
                await this._commandBus.execute(new commands_2.TimeSlotBulkDeleteCommand({
                    organizationId,
                    employeeId,
                    timeLog,
                    timeSlotsIds
                }, forceDelete, true));
                // Check if there are any remaining time slots
                timeLog = await this.typeOrmTimeLogRepository.findOne({
                    where: { id: timeLog.id },
                    relations: { timeSlots: true }
                });
                // If no remaining time slots, delete the time log
                if ((0, utils_1.isEmpty)(timeLog.timeSlots)) {
                    // Delete TimeLog if remaining timeSlots are 0
                    await this.deleteTimeLog(timeLog, forceDelete);
                }
            }
            catch (error) {
                console.log('Error while updating startedAt time', error);
            }
        }
        else {
            // Delete the time log if remaining duration is 0
            console.log('Remaining duration is 0, so we are deleting the time log during update startedAt time');
            await this.deleteTimeLog(log, forceDelete);
        }
    }
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
    async updateStopTimeOrDelete(log, slot, organizationId, employeeId, start, startedAt, end, forceDelete = false) {
        const startedAtMoment = (0, moment_extend_1.moment)(startedAt); // Get the started at moment
        const endMoment = (0, moment_extend_1.moment)(end); // Get the end moment
        const remainingDuration = endMoment.diff(startedAtMoment, 'seconds'); // Calculate the remaining duration
        // If there is remaining duration
        if (remainingDuration > 0) {
            // Update the stoppedAt time if there is remaining duration
            try {
                console.log(`update stoppedAt time to ${start}`);
                // Update the stoppedAt time
                let timeLog = await this._commandBus.execute(new time_log_update_command_1.TimeLogUpdateCommand({ stoppedAt: start }, log, true, forceDelete));
                // Delete the associated time slots
                const timeSlotsIds = [slot.id];
                // Bulk delete the time slots
                await this._commandBus.execute(new commands_2.TimeSlotBulkDeleteCommand({
                    organizationId,
                    employeeId,
                    timeLog,
                    timeSlotsIds
                }, forceDelete, true));
                // Check if there are any remaining time slots
                timeLog = await this.typeOrmTimeLogRepository.findOne({
                    where: { id: timeLog.id },
                    relations: { timeSlots: true }
                });
                // If no remaining time slots, delete the time log
                if ((0, utils_1.isEmpty)(timeLog.timeSlots)) {
                    await this.deleteTimeLog(timeLog, forceDelete);
                }
            }
            catch (error) {
                console.log('Error while updating stoppedAt time', error);
            }
        }
        else {
            console.log('Remaining duration is 0, so we are deleting the time log during update stoppedAt time');
            await this.deleteTimeLog(log, forceDelete);
        }
    }
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
    async handleTimeLogSplitting(timeLog, timeSlot, organizationId, employeeId, start, end, startedAt, forceDelete = false) {
        const startedAtMoment = (0, moment_extend_1.moment)(startedAt); // Get the started at moment
        const startMoment = (0, moment_extend_1.moment)(start); // Get the start moment
        const remainingDuration = startMoment.diff(startedAtMoment, 'seconds'); // Calculate the remaining duration
        // If there is remaining duration
        if (remainingDuration > 0) {
            try {
                timeLog.stoppedAt = start;
                await this.typeOrmTimeLogRepository.save(timeLog);
            }
            catch (error) {
                console.error(`Error while updating stoppedAt time for ID: ${timeLog.id}`, error);
            }
        }
        else {
            // Delete the old time log if remaining duration is 0
            await this.deleteTimeLog(timeLog, forceDelete);
        }
        try {
            // Delete the associated time slots
            const timeSlotsIds = [timeSlot.id];
            // Bulk delete the time slots
            await this._commandBus.execute(new commands_2.TimeSlotBulkDeleteCommand({
                organizationId,
                employeeId,
                timeLog,
                timeSlotsIds
            }, forceDelete, true));
        }
        catch (error) {
            console.error(`Error while splitting time entries: ${remainingDuration}`, error);
        }
        // Handle the creation of the new time log
        await this.createAndSyncNewTimeLog(timeLog, end);
    }
    /**
     * Creates and syncs the new time log if the duration is greater than 0.
     *
     * @param timeLog - The original time log (will be cloned).
     * @param end - The new start time for the new log.
     */
    async createAndSyncNewTimeLog(timeLog, end) {
        const clone = (0, underscore_1.omit)(timeLog, ['createdAt', 'updatedAt', 'id']);
        const newLog = clone;
        newLog.startedAt = end;
        // Calculate the remaining duration of the new log
        const newLogRemainingDuration = (0, moment_extend_1.moment)(newLog.stoppedAt).diff((0, moment_extend_1.moment)(newLog.startedAt), 'seconds');
        // If there is remaining duration
        if (newLogRemainingDuration > 0) {
            try {
                await this.typeOrmTimeLogRepository.save(newLog);
            }
            catch (error) {
                console.log('Error while creating new log', error, newLog);
            }
            try {
                // Sync time slots for the new time log
                const slots = await this.syncTimeSlots(newLog);
                console.log('sync time slots for new log', { slots }, { newLog });
                // Assign the new log to time slots and save
                if ((0, utils_1.isNotEmpty)(slots)) {
                    // Assign the new log to time slots and save
                    for await (const ts of slots) {
                        ts.timeLogs = [newLog];
                    }
                    await this.typeOrmTimeSlotRepository.save(slots);
                }
            }
            catch (error) {
                console.error('Error while creating or syncing new log and time slots', error);
            }
        }
    }
    /**
     * Deletes a time log if it overlaps the entire time range.
     *
     * @param timeLog - The log to delete.
     * @param forceDelete - Whether to hard delete (default: false).
     * @returns Promise<void> - Resolves when deletion is complete.
     */
    async deleteTimeLog(timeLog, forceDelete = false) {
        try {
            // Execute the TimeLogDeleteCommand to delete the time log
            await this._commandBus.execute(new time_log_delete_command_1.TimeLogDeleteCommand(timeLog, forceDelete));
        }
        catch (error) {
            // Log any errors that occur during deletion
            console.log(`Error while, delete time log because overlap entire time for ID: ${timeLog.id}`, error);
        }
    }
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
    async syncTimeSlots(timeLog) {
        const { startedAt, stoppedAt, employeeId, organizationId } = timeLog;
        // Calculate start and end intervals based on the time log's start and stop times
        const { start, end } = (0, utils_2.getStartEndIntervals)((0, moment_extend_1.moment)(startedAt), (0, moment_extend_1.moment)(stoppedAt));
        // Retrieve and return the corresponding time slots within the interval for the given employee and organization
        return await this._timeSlotService.getTimeSlots({
            startDate: (0, moment_extend_1.moment)(start).toDate(),
            endDate: (0, moment_extend_1.moment)(end).toDate(),
            organizationId,
            employeeIds: [employeeId],
            syncSlots: true
        });
    }
};
exports.DeleteTimeSpanHandler = DeleteTimeSpanHandler;
exports.DeleteTimeSpanHandler = DeleteTimeSpanHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(delete_time_span_command_1.DeleteTimeSpanCommand),
    tslib_1.__metadata("design:paramtypes", [type_orm_time_log_repository_1.TypeOrmTimeLogRepository,
        type_orm_time_slot_repository_1.TypeOrmTimeSlotRepository,
        cqrs_1.CommandBus,
        time_slot_service_1.TimeSlotService])
], DeleteTimeSpanHandler);
//# sourceMappingURL=delete-time-span.handler.js.map