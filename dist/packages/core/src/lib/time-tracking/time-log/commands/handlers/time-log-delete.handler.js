"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeLogDeleteHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const typeorm_1 = require("typeorm");
const underscore_1 = require("underscore");
const timesheet_recalculate_command_1 = require("./../../../timesheet/commands/timesheet-recalculate.command");
const update_employee_total_worked_hours_command_1 = require("../update-employee-total-worked-hours.command");
const commands_1 = require("./../../../time-slot/commands");
const time_log_delete_command_1 = require("../time-log-delete.command");
const type_orm_time_log_repository_1 = require("../../repository/type-orm-time-log.repository");
const mikro_orm_time_log_repository_1 = require("../..//repository/mikro-orm-time-log.repository");
let TimeLogDeleteHandler = class TimeLogDeleteHandler {
    constructor(typeOrmTimeLogRepository, mikroOrmTimeLogRepository, _commandBus) {
        this.typeOrmTimeLogRepository = typeOrmTimeLogRepository;
        this.mikroOrmTimeLogRepository = mikroOrmTimeLogRepository;
        this._commandBus = _commandBus;
    }
    /**
     * Executes the TimeLogDeleteCommand to handle both soft and hard deletions of time logs,
     * and ensures that associated time slots are deleted. It also recalculates relevant
     * timesheet and employee worked hours based on the deleted time logs.
     *
     * This method performs the following operations:
     * 1. Fetches the time logs based on the provided IDs.
     * 2. Deletes associated time slots for each time log sequentially.
     * 3. Soft deletes the time logs (or hard deletes them if `forceDelete` is true).
     * 4. Recalculates timesheet and employee worked hours for the affected time logs.
     *
     * @param command - The TimeLogDeleteCommand containing the IDs or TimeLog objects to delete, along with the `forceDelete` flag.
     * @returns A promise that resolves to a DeleteResult (for hard delete) or UpdateResult (for soft delete).
     */
    async execute(command) {
        const { ids, forceDelete = false } = command;
        // Step 1: Fetch time logs based on the provided IDs
        const timeLogs = await this.fetchTimeLogs(ids);
        // Step 2: Delete associated time slots for each time log sequentially
        await this.deleteTimeSlotsForLogs(timeLogs, forceDelete);
        // Step 3: Perform soft delete or hard delete based on the `forceDelete` flag
        const updateResult = await this.deleteTimeLogs(timeLogs, forceDelete);
        // Step 4: Recalculate timesheet and employee worked hours after deletion
        await this.recalculateTimesheetAndEmployeeHours(timeLogs);
        return updateResult;
    }
    /**
     * Fetches time logs based on provided IDs or time log objects.
     *
     * @param ids - A string, array of strings, or TimeLog object(s).
     * @returns A promise that resolves to an array of TimeLogs.
     */
    async fetchTimeLogs(ids) {
        if (typeof ids === 'string') {
            // Fetch single time log by ID
            return this.typeOrmTimeLogRepository.findBy({ id: ids });
        }
        else if (Array.isArray(ids)) {
            if (typeof ids[0] === 'string') {
                // Fetch multiple time logs by IDs
                return this.typeOrmTimeLogRepository.findBy({ id: (0, typeorm_1.In)(ids) });
            }
            // Return the array of TimeLog objects
            return ids;
        }
        else {
            // Return single TimeLog object wrapped in an array
            return [ids];
        }
    }
    /**
     * Deletes associated time slots for each time log sequentially.
     *
     * @param timeLogs - An array of time logs whose associated time slots will be deleted.
     */
    async deleteTimeSlotsForLogs(timeLogs, forceDelete = false) {
        // Loop through each time log and delete its associated time slots
        for await (const timeLog of timeLogs) {
            const { employeeId, organizationId, timeSlots } = timeLog;
            const timeSlotsIds = (0, underscore_1.pluck)(timeSlots, 'id');
            // Delete time slots sequentially
            await this._commandBus.execute(new commands_1.TimeSlotBulkDeleteCommand({
                organizationId,
                employeeId,
                timeLog,
                timeSlotsIds
            }, forceDelete));
        }
    }
    /**
     * Deletes the provided time logs, either soft or hard depending on the `forceDelete` flag.
     *
     * If `forceDelete` is true, the time logs are permanently deleted. Otherwise, they are soft deleted.
     * The method uses the TypeORM repository to perform the appropriate operation.
     *
     * @param timeLogs - An array of time logs to be deleted or soft deleted.
     * @param forceDelete - A boolean flag indicating whether to force delete (hard delete) the time logs.
     *                      Defaults to `false`, meaning soft delete is performed by default.
     * @returns A promise that resolves to a DeleteResult (for hard delete) or UpdateResult (for soft delete).
     */
    async deleteTimeLogs(timeLogs, forceDelete = false) {
        const logIds = timeLogs.map((log) => log.id); // Extract ids using map for simplicity
        console.log('deleting time logs', logIds, forceDelete);
        if (forceDelete) {
            // Hard delete (permanent deletion)
            return await this.typeOrmTimeLogRepository.delete({ id: (0, typeorm_1.In)(logIds) });
        }
        // Soft delete (mark records as deleted)
        return await this.typeOrmTimeLogRepository.softDelete({ id: (0, typeorm_1.In)(logIds) });
    }
    /**
     * Recalculates timesheet and employee worked hours for the deleted time logs.
     *
     * @param timeLogs - An array of time logs for which the recalculations will be made.
     */
    async recalculateTimesheetAndEmployeeHours(timeLogs) {
        try {
            const timesheetIds = [...new Set(timeLogs.map((log) => log.timesheetId))];
            const employeeIds = [...new Set(timeLogs.map((log) => log.employeeId))];
            // Recalculate timesheets
            await Promise.all(timesheetIds.map((timesheetId) => this._commandBus.execute(new timesheet_recalculate_command_1.TimesheetRecalculateCommand(timesheetId))));
            // Recalculate employee worked hours
            await Promise.all(employeeIds.map((employeeId) => this._commandBus.execute(new update_employee_total_worked_hours_command_1.UpdateEmployeeTotalWorkedHoursCommand(employeeId))));
        }
        catch (error) {
            console.error('Error while recalculating timesheet and employee worked hours:', error);
        }
    }
};
exports.TimeLogDeleteHandler = TimeLogDeleteHandler;
exports.TimeLogDeleteHandler = TimeLogDeleteHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(time_log_delete_command_1.TimeLogDeleteCommand),
    tslib_1.__metadata("design:paramtypes", [type_orm_time_log_repository_1.TypeOrmTimeLogRepository,
        mikro_orm_time_log_repository_1.MikroOrmTimeLogRepository,
        cqrs_1.CommandBus])
], TimeLogDeleteHandler);
//# sourceMappingURL=time-log-delete.handler.js.map