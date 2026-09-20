"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeSlotMergeHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const typeorm_1 = require("typeorm");
const moment = require("moment");
const underscore_1 = require("underscore");
const utils_1 = require("@gauzy/utils");
const internal_1 = require("./../../../../core/entities/internal");
const context_1 = require("./../../../../core/context");
const utils_2 = require("./../../../../core/utils");
const database_helper_1 = require("./../../../../database/database.helper");
const update_employee_total_worked_hours_command_1 = require("../../../time-log/commands/update-employee-total-worked-hours.command");
const timesheet_recalculate_command_1 = require("./../../../timesheet/commands/timesheet-recalculate.command");
const time_slot_merge_command_1 = require("../time-slot-merge.command");
const type_orm_time_slot_repository_1 = require("../../repository/type-orm-time-slot.repository");
const mikro_orm_time_slot_repository_1 = require("../../repository/mikro-orm-time-slot.repository");
let TimeSlotMergeHandler = class TimeSlotMergeHandler {
    constructor(typeOrmTimeSlotRepository, mikroOrmTimeSlotRepository, commandBus) {
        this.typeOrmTimeSlotRepository = typeOrmTimeSlotRepository;
        this.mikroOrmTimeSlotRepository = mikroOrmTimeSlotRepository;
        this.commandBus = commandBus;
        this.ormType = (0, utils_2.getORMType)();
    }
    /**
     * Execute the TimeSlot merge command
     *
     * @param command - The TimeSlotMergeCommand to execute
     */
    async execute(command) {
        const { organizationId, employeeId, start, end, forceDelete } = command;
        const tenantId = context_1.RequestContext.currentTenantId();
        // Round start and end dates to the nearest 10 minutes
        const { start: startedAt, end: stoppedAt } = this.getRoundedDateRange(start, end);
        // Retrieve time slots for the given date range
        const slots = await this.getTimeSlots({
            organizationId,
            employeeId,
            tenantId,
            startedAt,
            stoppedAt
        });
        console.log('GET Time Slots To Be Merged Length: %s', slots.length);
        if ((0, utils_1.isNotEmpty)(slots)) {
            const groupedTimeSlots = this.groupTimeSlots(slots); // Group time slots by rounded start time
            // Aggregate data and save new time slots
            return await this.mergeAndSaveTimeSlots(groupedTimeSlots, // Group time slots by rounded start time
            tenantId, organizationId, employeeId, forceDelete);
        }
        return [];
    }
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
    async mergeAndSaveTimeSlots(groupedTimeSlots, tenantId, organizationId, employeeId, forceDelete) {
        const newTimeSlots = [];
        await Promise.all(Object.entries(groupedTimeSlots).map(async ([start, slots]) => {
            // Create a new TimeSlot instance with aggregated data
            const newTimeSlot = await this.createNewTimeSlot(slots, start, tenantId, organizationId, employeeId);
            // Update time logs and recalculate total worked hours for the employee
            await this.updateTimeLogAndEmployeeTotalWorkedHours(newTimeSlot);
            // Clean up old time slots if needed
            await this.cleanUpOldTimeSlots(slots, forceDelete);
            newTimeSlots.push(newTimeSlot);
        }));
        return newTimeSlots;
    }
    /**
     * Rounds start and end dates to the nearest 10 minutes and returns the formatted date range.
     *
     * @param start - Start date of the range
     * @param end - End date of the range
     * @returns The formatted start and end dates
     */
    getRoundedDateRange(start, end) {
        const startDate = this.roundToNearestTenMinutes(moment(start).utc());
        const endDate = this.roundToNearestTenMinutes(moment(end).utc().add(10, 'minutes'));
        return (0, utils_2.getDateRangeFormat)(startDate, endDate);
    }
    /**
     * Group time slots by their start time
     * @param timeSlots - The array of time slots to group
     * @returns An object where keys are the start times and values are arrays of time slots
     */
    groupTimeSlots(timeSlots) {
        return (0, underscore_1.chain)(timeSlots)
            .groupBy((slot) => this.roundToNearestTenMinutes(moment(slot.startedAt)).format('YYYY-MM-DD HH:mm:ss'))
            .value();
    }
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
    async createNewTimeSlot(slots, startedAt, tenantId, organizationId, employeeId) {
        const [slot] = slots; // Get the first time slot and aggregate data from all time slots
        const aggregated = this.aggregateTimeSlot(slots); // Aggregate data from all time slots
        // Create new TimeSlot instance with aggregated data
        const newTimeSlot = new internal_1.TimeSlot({
            ...(0, underscore_1.omit)(slot),
            ...this.calculateActivity(aggregated, slots), // Calculate activity metrics
            screenshots: this.mapScreenshots(aggregated.screenshots), // Map old screenshots
            activities: this.mapActivities(aggregated.activities), // Map old activities
            timeLogs: this.mapUniqueTimeLogs(aggregated.timeLogs), // Deduplicate time logs
            startedAt: moment(startedAt).toDate(),
            tenantId,
            organizationId,
            employeeId
        });
        console.log('Newly Created Time Slot with Aggregated Data:', newTimeSlot);
        // Save the new time slot to the database
        switch (this.ormType) {
            case utils_2.MultiORMEnum.MikroORM:
                await this.mikroOrmTimeSlotRepository.persistAndFlush(newTimeSlot);
                return newTimeSlot;
            case utils_2.MultiORMEnum.TypeORM:
            default:
                return await this.typeOrmTimeSlotRepository.save(newTimeSlot);
        }
    }
    /**
     * Deletes or soft-deletes old time slots based on the `forceDelete` flag.
     *
     * @param slots - Array of time slots to clean up
     * @param forceDelete - Flag to indicate if deletion should be permanent
     */
    async cleanUpOldTimeSlots(slots, forceDelete) {
        try {
            const idsToDelete = (0, underscore_1.pluck)(slots, 'id');
            // Keep the most recent time slot by removing it from deletion
            idsToDelete.splice(0, 1);
            console.log('---------------TimeSlots Ids Will Be Deleted---------------', idsToDelete);
            if ((0, utils_1.isNotEmpty)(idsToDelete)) {
                switch (this.ormType) {
                    case utils_2.MultiORMEnum.MikroORM: {
                        if (forceDelete) {
                            return await this.mikroOrmTimeSlotRepository.nativeDelete({ id: { $in: idsToDelete } });
                        }
                        return await this.mikroOrmTimeSlotRepository.nativeUpdate({ id: { $in: idsToDelete } }, {
                            deletedAt: new Date()
                        });
                    }
                    case utils_2.MultiORMEnum.TypeORM:
                    default: {
                        if (forceDelete) {
                            // Hard delete (permanent deletion)
                            return await this.typeOrmTimeSlotRepository.delete({ id: (0, typeorm_1.In)(idsToDelete) });
                        }
                        // Soft delete (mark records as deleted)
                        return await this.typeOrmTimeSlotRepository.softDelete({ id: (0, typeorm_1.In)(idsToDelete) });
                    }
                }
            }
        }
        catch (error) {
            console.error('Error while cleaning up old time slots:', error);
        }
    }
    /**
     * Aggregates data from multiple time slots into a single object.
     * It calculates the total duration, keyboard activity, mouse activity, and overall activity,
     * and consolidates screenshots, time logs, and activities into arrays.
     *
     * @param slots - An array of time slots to be aggregated.
     * @returns An object containing aggregated duration, keyboard activity, mouse activity,
     * overall activity, and arrays of screenshots, time logs, and activities.
     */
    aggregateTimeSlot(slots) {
        return slots.reduce((acc, slot) => {
            acc.duration += this.calculateValue(slot.duration);
            acc.keyboard += this.calculateValue(slot.keyboard);
            acc.mouse += this.calculateValue(slot.mouse);
            acc.overall += this.calculateValue(slot.overall);
            acc.screenshots.push(...(slot.screenshots || []));
            acc.timeLogs.push(...(slot.timeLogs || []));
            acc.activities.push(...(slot.activities || []));
            return acc;
        }, {
            duration: 0,
            keyboard: 0,
            mouse: 0,
            overall: 0,
            screenshots: [],
            timeLogs: [],
            activities: []
        });
    }
    /**
     * Calculates the average activity metrics from the aggregated data.
     * It calculates average keyboard and mouse activity from time slots that contain non-zero keyboard data.
     * It also ensures each metric (duration, overall, keyboard, mouse) is capped at a maximum of 600.
     *
     * @param data - Aggregated data from time slots including total keyboard, mouse, and overall activities.
     * @returns An object containing the calculated activity metrics (duration, overall, keyboard, mouse).
     */
    calculateActivity(data, slots) {
        const nonZeroKeyboardSlots = slots.filter((slot) => slot.keyboard > 0);
        const count = nonZeroKeyboardSlots.length; // Count the number of non-zero keyboard slots
        const keyboardAverage = count > 0 ? Math.round(data.keyboard / count) : 0;
        const mouseAverage = count > 0 ? Math.round(data.mouse / count) : 0;
        return {
            duration: Math.max(0, Math.min(600, data.duration)),
            overall: Math.max(0, Math.min(600, data.overall)),
            keyboard: Math.max(0, Math.min(600, keyboardAverage)),
            mouse: Math.max(0, Math.min(600, mouseAverage))
        };
    }
    /**
     * Maps and prepares screenshots for a new time slot by omitting the `timeSlotId` property.
     *
     * @param screenshots - Array of screenshots to be mapped
     * @returns A new array of `Screenshot` instances without `timeSlotId`
     */
    mapScreenshots(screenshots) {
        return screenshots.map((screenshot) => new internal_1.Screenshot((0, underscore_1.omit)(screenshot, ['timeSlotId'])));
    }
    /**
     * Maps and prepares activities for a new time slot by omitting the `timeSlotId` property.
     *
     * @param activities - Array of activities to be mapped
     * @returns A new array of `Activity` instances without `timeSlotId`
     */
    mapActivities(activities) {
        return activities.map((activity) => new internal_1.Activity((0, underscore_1.omit)(activity, ['timeSlotId'])));
    }
    /**
     * Maps and deduplicates time logs by their unique ID.
     *
     * @param logs - Array of time logs to be mapped and deduplicated
     * @returns Array of unique time logs
     */
    mapUniqueTimeLogs(logs) {
        return (0, underscore_1.uniq)(logs, (log) => log.id);
    }
    /**
     * Calculates a value safely, returning 0 if the input is undefined or not a number.
     *
     * @param value - The value to calculate
     * @returns The calculated value, or 0 if the input is undefined or invalid
     */
    calculateValue(value) {
        return Number(value) || 0;
    }
    /**
     * Round a moment date to the nearest 10 minutes
     *
     * @param date - The moment date to round
     * @returns The rounded moment date
     */
    roundToNearestTenMinutes(date) {
        const minutes = date.minutes();
        return date
            .minutes(minutes - (minutes % 10))
            .seconds(0)
            .milliseconds(0);
    }
    /**
     * Get time slots for the given date range.
     *
     * @param params - An object containing parameters like organizationId, employeeId, tenantId, startedAt, and stoppedAt.
     * @returns A promise that resolves to an array of TimeSlot instances.
     */
    async getTimeSlots({ organizationId, employeeId, tenantId, startedAt, stoppedAt }) {
        switch (this.ormType) {
            case utils_2.MultiORMEnum.MikroORM: {
                const items = await this.mikroOrmTimeSlotRepository.find({
                    tenantId,
                    organizationId,
                    employeeId,
                    startedAt: { $gte: moment.utc(startedAt).toDate(), $lt: moment.utc(stoppedAt).toDate() }
                }, {
                    populate: ['timeLogs', 'screenshots', 'activities'],
                    orderBy: { createdAt: 'ASC' }
                });
                return items.map((item) => (0, utils_2.wrapSerialize)(item));
            }
            case utils_2.MultiORMEnum.TypeORM:
            default: {
                // Create a query builder for the TimeSlot entity
                const query = this.typeOrmTimeSlotRepository.createQueryBuilder();
                query
                    .leftJoinAndSelect(`${query.alias}.timeLogs`, 'timeLogs')
                    .leftJoinAndSelect(`${query.alias}.screenshots`, 'screenshots')
                    .leftJoinAndSelect(`${query.alias}.activities`, 'activities');
                query
                    .where((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."startedAt" >= :startedAt AND "${query.alias}"."startedAt" < :stoppedAt`), {
                    startedAt,
                    stoppedAt
                })
                    .andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."employeeId" = :employeeId`), { employeeId })
                    .andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."organizationId" = :organizationId`), { organizationId })
                    .andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."tenantId" = :tenantId`), { tenantId })
                    .addOrderBy((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."createdAt"`), 'ASC');
                console.log('GET Time Slots Query:', query.getQueryAndParameters());
                // Execute the query and return the results
                return await query.getMany();
            }
        }
    }
    /**
     * Updates time logs and recalculates the total worked hours for an employee based on the given time slot.
     *
     * @param newTimeSlot - The newly created time slot containing time logs and employee information.
     */
    async updateTimeLogAndEmployeeTotalWorkedHours(newTimeSlot) {
        /**
         * Update TimeLog Entry Every TimeSlot Request From Desktop Timer
         * RECALCULATE timesheet activity
         */
        for await (const timeLog of newTimeSlot.timeLogs) {
            await this.commandBus.execute(new timesheet_recalculate_command_1.TimesheetRecalculateCommand(timeLog.timesheetId));
        }
        /**
         * UPDATE employee total worked hours
         */
        if (newTimeSlot.employeeId) {
            await this.commandBus.execute(new update_employee_total_worked_hours_command_1.UpdateEmployeeTotalWorkedHoursCommand(newTimeSlot.employeeId));
        }
    }
};
exports.TimeSlotMergeHandler = TimeSlotMergeHandler;
exports.TimeSlotMergeHandler = TimeSlotMergeHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(time_slot_merge_command_1.TimeSlotMergeCommand),
    tslib_1.__metadata("design:paramtypes", [type_orm_time_slot_repository_1.TypeOrmTimeSlotRepository,
        mikro_orm_time_slot_repository_1.MikroOrmTimeSlotRepository,
        cqrs_1.CommandBus])
], TimeSlotMergeHandler);
//# sourceMappingURL=time-slot-merge.handler.js.map