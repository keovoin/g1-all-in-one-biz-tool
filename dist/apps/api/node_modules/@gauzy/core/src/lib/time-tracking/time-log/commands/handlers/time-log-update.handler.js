"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeLogUpdateHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const moment = require("moment");
const contracts_1 = require("@gauzy/contracts");
const utils_1 = require("@gauzy/utils");
const commands_1 = require("./../../../timesheet/commands");
const time_slot_service_1 = require("../../../time-slot/time-slot.service");
const update_employee_total_worked_hours_command_1 = require("../update-employee-total-worked-hours.command");
const context_1 = require("./../../../../core/context");
const utils_2 = require("./../../../../core/utils");
const database_helper_1 = require("./../../../../database/database.helper");
const time_log_entity_1 = require("./../../time-log.entity");
const time_log_update_command_1 = require("../time-log-update.command");
const type_orm_time_log_repository_1 = require("../../repository/type-orm-time-log.repository");
const type_orm_time_slot_repository_1 = require("../../../time-slot/repository/type-orm-time-slot.repository");
const mikro_orm_time_slot_repository_1 = require("../../../time-slot/repository/mikro-orm-time-slot.repository");
let TimeLogUpdateHandler = class TimeLogUpdateHandler {
    constructor(commandBus, typeOrmTimeLogRepository, typeOrmTimeSlotRepository, mikroOrmTimeSlotRepository, timeSlotService) {
        this.commandBus = commandBus;
        this.typeOrmTimeLogRepository = typeOrmTimeLogRepository;
        this.typeOrmTimeSlotRepository = typeOrmTimeSlotRepository;
        this.mikroOrmTimeSlotRepository = mikroOrmTimeSlotRepository;
        this.timeSlotService = timeSlotService;
        this.ormType = (0, utils_2.getORMType)();
    }
    /**
     * Updates a time log, manages associated time slots, and recalculates timesheet and employee hours.
     *
     * This method retrieves the time log, updates its details, and handles time slot conflicts if the start or stop time is modified.
     * It creates new time slots if necessary, saves the updated time log, and recalculates the timesheet and employee hours.
     *
     * @param command - The command containing the time log update data, including options for force delete and manual time slots.
     * @returns A promise that resolves to the updated `TimeLog`.
     */
    async execute(command) {
        // Extract input parameters from the command
        const { id, input, manualTimeSlot, forceDelete = false } = command;
        console.log('Executing TimeLogUpdateCommand:', { id, input, manualTimeSlot, forceDelete });
        // Retrieve the tenant ID from the request context or the provided input
        const tenantId = context_1.RequestContext.currentTenantId() ?? input.tenantId;
        console.log('Tenant ID:', tenantId);
        let timeLog = await this.getTimeLogByIdOrInstance(id);
        console.log('Retrieved TimeLog:', timeLog);
        const { employeeId, organizationId } = timeLog;
        let timesheet;
        let updateTimeSlots = [];
        // Check if time slots need to be updated
        let needToUpdateTimeSlots = Boolean(input.startedAt || input.stoppedAt);
        console.log('Need to update time slots:', needToUpdateTimeSlots);
        if (needToUpdateTimeSlots) {
            timesheet = await this.commandBus.execute(new commands_1.TimesheetFirstOrCreateCommand(input.startedAt, employeeId, organizationId));
            console.log('Generated or retrieved Timesheet:', timesheet);
            // Generate time slots based on the updated time log details
            const { startedAt, stoppedAt } = { ...timeLog, ...input };
            updateTimeSlots = this.timeSlotService.generateTimeSlots(startedAt, stoppedAt);
            console.log('Generated updated TimeSlots:', updateTimeSlots);
        }
        // Update the time log in the repository
        await this.typeOrmTimeLogRepository.update(timeLog.id, {
            ...input,
            ...(timesheet ? { timesheetId: timesheet.id } : {})
        });
        console.log('Updated TimeLog in the repository:', { id: timeLog.id, input });
        // Regenerate the existing time slots for the time log
        const timeSlots = this.timeSlotService.generateTimeSlots(timeLog.startedAt, timeLog.stoppedAt);
        console.log('Generated existing TimeSlots for TimeLog:', timeSlots);
        // Retrieve the updated time log
        timeLog = await this.typeOrmTimeLogRepository.findOneBy({ id: timeLog.id });
        console.log('Retrieved updated TimeLog from repository:', timeLog);
        // Check if time slots need to be updated
        if (needToUpdateTimeSlots) {
            // Identify conflicting start times
            const startTimes = this.getConflictingStartTimes(timeSlots, updateTimeSlots);
            console.log('Identified conflicting start times:', startTimes);
            // Remove conflicting time slots
            if (startTimes.length > 0) {
                await this.removeConflictingTimeSlots(tenantId, organizationId, employeeId, startTimes, forceDelete);
                console.log('Removed conflicting TimeSlots:', startTimes);
            }
            // Create new time slots if needed for Web Timer
            if (!manualTimeSlot && timeLog.source === contracts_1.TimeLogSourceEnum.WEB_TIMER) {
                await this.bulkCreateTimeSlots(updateTimeSlots, timeLog, employeeId, organizationId, tenantId);
                console.log('Created new TimeSlots for Web Timer:', updateTimeSlots);
            }
            // Update the time log in the repository
            await this.saveUpdatedTimeLog(timeLog);
            console.log('Saved updated TimeLog in the repository:', timeLog);
            // Recalculate timesheets and employee hours
            await this.recalculateTimesheetAndEmployeeHours(timeLog.timesheetId, employeeId);
            console.log('Recalculated timesheets and employee hours:', timeLog.timesheetId, employeeId);
        }
        // Return the updated time log
        const updatedTimeLog = await this.typeOrmTimeLogRepository.findOneBy({ id: timeLog.id });
        console.log('Final updated TimeLog:', updatedTimeLog);
        return updatedTimeLog;
    }
    /**
     * Retrieves a time log by its ID or directly returns the instance if provided.
     *
     * If the `id` parameter is already a `TimeLog` instance, it is returned as is. Otherwise, it fetches
     * the time log from the repository using the provided `id`.
     *
     * @param id - The time log ID or an instance of `TimeLog`.
     * @returns A promise that resolves to the `ITimeLog` instance.
     */
    async getTimeLogByIdOrInstance(id) {
        return id instanceof time_log_entity_1.TimeLog ? id : this.typeOrmTimeLogRepository.findOneBy({ id });
    }
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
    getConflictingStartTimes(slots, newSlots) {
        return slots
            .filter((existingSlot) => !newSlots.some((newSlot) => moment(newSlot.startedAt).isSame(existingSlot.startedAt)))
            .map((slot) => new Date(slot.startedAt));
    }
    /**
     * Removes or soft deletes conflicting time slots for a given employee within the specified time range.
     *
     * If `forceDelete` is true, the conflicting time slots will be hard deleted. Otherwise, they will be soft deleted.
     *
     * @param params - An object containing `tenantId`, `organizationId`, `employeeId`, and `startTimes`.
     * @param forceDelete - A boolean flag indicating whether to perform a hard delete (`true`) or a soft delete (`false`).
     * @returns A promise that resolves after the time slots have been deleted or soft deleted.
     */
    async removeConflictingTimeSlots(tenantId, organizationId, employeeId, startTimes, forceDelete) {
        let slots = [];
        switch (this.ormType) {
            case utils_2.MultiORMEnum.MikroORM: {
                const em = this.mikroOrmTimeSlotRepository.getEntityManager();
                slots = await em.find('TimeSlot', {
                    organizationId,
                    tenantId,
                    employeeId,
                    startedAt: { $in: startTimes }
                }, {
                    populate: ['timeLogs', 'screenshots', 'activities', 'timeSlotMinutes']
                });
                break;
            }
            case utils_2.MultiORMEnum.TypeORM:
            default: {
                // Query to fetch conflicting time slots
                const query = this.typeOrmTimeSlotRepository.createQueryBuilder('time_slot');
                // Add joins to the query
                query
                    .leftJoinAndSelect(`${query.alias}.timeLogs`, 'timeLogs')
                    .leftJoinAndSelect(`${query.alias}.screenshots`, 'screenshots')
                    .leftJoinAndSelect(`${query.alias}.activities`, 'activities')
                    .leftJoinAndSelect(`${query.alias}.timeSlotMinutes`, 'timeSlotMinutes');
                // Add where clauses to the query
                query
                    .where((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."organizationId" = :organizationId`), { organizationId })
                    .andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."tenantId" = :tenantId`), { tenantId })
                    .andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."employeeId" = :employeeId`), { employeeId })
                    .andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."startedAt" IN (:...startTimes)`), { startTimes });
                // Get the conflicting time slots
                slots = await query.getMany();
                break;
            }
        }
        console.log(`conflicting time slots for ${forceDelete ? 'hard' : 'soft'} deleting: %s`, slots.length);
        if ((0, utils_1.isEmpty)(slots)) {
            return [];
        }
        // Delete or soft delete the conflicting time slots
        switch (this.ormType) {
            case utils_2.MultiORMEnum.MikroORM: {
                const em = this.mikroOrmTimeSlotRepository.getEntityManager();
                if (forceDelete) {
                    await em.removeAndFlush(slots);
                }
                else {
                    for (const slot of slots) {
                        slot.deletedAt = new Date();
                    }
                    await em.persistAndFlush(slots);
                }
                return slots;
            }
            case utils_2.MultiORMEnum.TypeORM:
            default:
                return forceDelete
                    ? this.typeOrmTimeSlotRepository.remove(slots)
                    : this.typeOrmTimeSlotRepository.softRemove(slots);
        }
    }
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
    async bulkCreateTimeSlots(updateTimeSlots, timeLog, employeeId, organizationId, tenantId) {
        const slots = updateTimeSlots
            .map((slot) => ({
            ...slot,
            employeeId,
            organizationId,
            tenantId,
            keyboard: 0,
            mouse: 0,
            overall: 0,
            timeLogId: timeLog.id
        }))
            .filter((slot) => slot.tenantId && slot.organizationId); // Filter slots with valid tenant and organization IDs
        // Assign regenerated TimeSlot entries for existed TimeLog
        return await this.timeSlotService.bulkCreate(slots, employeeId, organizationId);
    }
    /**
     * Saves the updated time log to the repository.
     *
     * @param timeLog - The time log to be saved.
     * @returns A promise that resolves to the saved `ITimeLog` or throws an error if saving fails.
     */
    async saveUpdatedTimeLog(timeLog) {
        try {
            return await this.typeOrmTimeLogRepository.save(timeLog);
        }
        catch (error) {
            console.log('Failed to update the time log at line: 217', error);
        }
    }
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
    async recalculateTimesheetAndEmployeeHours(timesheetId, employeeId) {
        // Recalculate timesheets
        await this.commandBus.execute(new commands_1.TimesheetRecalculateCommand(timesheetId));
        // Update employee total worked hours
        if (employeeId) {
            await this.commandBus.execute(new update_employee_total_worked_hours_command_1.UpdateEmployeeTotalWorkedHoursCommand(employeeId));
        }
    }
};
exports.TimeLogUpdateHandler = TimeLogUpdateHandler;
exports.TimeLogUpdateHandler = TimeLogUpdateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(time_log_update_command_1.TimeLogUpdateCommand),
    tslib_1.__metadata("design:paramtypes", [cqrs_1.CommandBus,
        type_orm_time_log_repository_1.TypeOrmTimeLogRepository,
        type_orm_time_slot_repository_1.TypeOrmTimeSlotRepository,
        mikro_orm_time_slot_repository_1.MikroOrmTimeSlotRepository,
        time_slot_service_1.TimeSlotService])
], TimeLogUpdateHandler);
//# sourceMappingURL=time-log-update.handler.js.map