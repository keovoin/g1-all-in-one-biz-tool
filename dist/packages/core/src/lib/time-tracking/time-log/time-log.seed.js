"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.recalculateTimesheetActivity = exports.createRandomTimeLogs = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const faker_1 = require("@faker-js/faker");
const underscore_1 = require("underscore");
const moment = require("moment");
const contracts_1 = require("@gauzy/contracts");
const utils_1 = require("@gauzy/utils");
const screenshot_seed_1 = require("../screenshot/screenshot.seed");
const time_slot_seed_1 = require("../time-slot/time-slot.seed");
const internal_1 = require("./../../core/entities/internal");
const utils_2 = require("./../../core/utils");
const database_helper_1 = require("./../../database/database.helper");
/**
 * Generates and saves random time logs for the provided timesheets.
 *
 * This function creates random time logs for each timesheet provided in the `timeSheets` array.
 * It uses the provided data source to interact with the database and save the generated time logs.
 *
 * @param {DataSource} dataSource - The database connection or ORM data source used to execute queries.
 * @param {Partial<ApplicationPluginConfig>} config - Configuration for generating random data (e.g., settings, paths).
 * @param {ITenant} tenant - The tenant to associate with the generated time logs.
 * @param {ITimesheet[]} timeSheets - An array of timesheets for which random time logs will be created.
 * @returns {Promise<void>} - A promise that resolves when the time logs have been generated and saved.
 */
const createRandomTimeLogs = async (dataSource, config, tenant, timeSheets) => {
    const query = dataSource.getRepository(internal_1.OrganizationProject).createQueryBuilder('organization_project');
    const projects = await query
        .leftJoinAndSelect(`${query.alias}.tasks`, 'tasks')
        .leftJoinAndSelect(`${query.alias}.organizationContact`, 'organizationContact')
        .andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."tenantId" =:tenantId`), { tenantId: tenant.id })
        .andWhere((0, database_helper_1.prepareSQLQuery)(`"tasks"."tenantId" =:tenantId`), { tenantId: tenant.id })
        .getMany();
    if ((0, utils_1.isEmpty)(projects)) {
        console.warn(`Warning: projects not found for tenantId: ${tenant.id}, RandomTimesheet will not be created`);
        return;
    }
    const timeSheetChunk = (0, underscore_1.chunk)(timeSheets, 5);
    const allTimeSlots = [];
    for (let timeSheetChunkIndex = 0; timeSheetChunkIndex < timeSheetChunk.length; timeSheetChunkIndex++) {
        const timeLogs = [];
        for (let timeSheetIndex = 0; timeSheetIndex < timeSheetChunk[timeSheetChunkIndex].length; timeSheetIndex++) {
            const timesheet = timeSheetChunk[timeSheetChunkIndex][timeSheetIndex];
            const randomDays = (0, underscore_1.chain)([0, 1, 2, 3, 4, 5, 6])
                .shuffle()
                .take(faker_1.faker.number.int({ min: 3, max: 5 }))
                .values()
                .value();
            for (let index = 0; index <= randomDays.length; index++) {
                const day = randomDays[index];
                const date = moment(timesheet.startedAt).add(day, 'day').toDate();
                const range = dateRanges(moment.utc(date).startOf('day').toDate(), moment.utc(date).toDate());
                for (let rangeIndex = 0; rangeIndex < range.length; rangeIndex++) {
                    const { startedAt, stoppedAt } = range[rangeIndex];
                    if (moment.utc().isAfter(moment.utc(stoppedAt))) {
                        const project = (0, utils_1.getRandomElement)(projects);
                        const task = (0, utils_1.getRandomElement)(project.tasks);
                        const source = faker_1.faker.helpers.arrayElement(Object.keys(contracts_1.TimeLogSourceEnum));
                        let logType = contracts_1.TimeLogType.TRACKED;
                        if (source === contracts_1.TimeLogSourceEnum.WEB_TIMER || source === contracts_1.TimeLogSourceEnum.BROWSER_EXTENSION) {
                            logType = contracts_1.TimeLogType.MANUAL;
                        }
                        const { employeeId, organizationId } = timesheet;
                        const timeLog = new internal_1.TimeLog({
                            employeeId,
                            organizationId,
                            timesheet,
                            project,
                            task,
                            startedAt: moment.utc(startedAt).toDate(),
                            stoppedAt: moment.utc(stoppedAt).toDate(),
                            logType,
                            source,
                            tenant
                        });
                        timeLog.organizationContact = project.organizationContact;
                        timeLog.description = faker_1.faker.lorem.sentence(faker_1.faker.number.int(10));
                        timeLog.isBillable = faker_1.faker.helpers.arrayElement([true, false]);
                        timeLog.isRunning = false;
                        timeLogs.push(timeLog);
                    }
                }
            }
        }
        const savedTimeLogs = await dataSource.getRepository(internal_1.TimeLog).save(timeLogs);
        const trackedTimeSlots = [];
        for await (const timeLog of savedTimeLogs) {
            const { startedAt, stoppedAt, employeeId, organizationId, tenantId } = timeLog;
            const newTimeSlots = (0, time_slot_seed_1.createTimeSlots)(startedAt, stoppedAt).map((timeSlot) => {
                return {
                    ...timeSlot,
                    employeeId,
                    organizationId,
                    tenantId,
                    timeLogs: [timeLog]
                };
            });
            trackedTimeSlots.push(...newTimeSlots);
        }
        /*
         * Saved Tracked Time Log & Time Slots and Related Screenshots
         */
        const newTrackedTimeSlots = [];
        for await (const timeSlot of trackedTimeSlots) {
            const { tenantId, organizationId, startedAt, stoppedAt, employeeId } = timeSlot;
            const randomScreenshots = await (0, screenshot_seed_1.createRandomScreenshot)(config, tenantId, organizationId, employeeId, startedAt, stoppedAt);
            const screenshots = randomScreenshots.map((item) => new internal_1.Screenshot((0, underscore_1.omit)(item, ['timeSlotId'])));
            const savedScreenshots = await dataSource.getRepository(internal_1.Screenshot).save(screenshots);
            const newTimeSlot = new internal_1.TimeSlot({
                ...(0, underscore_1.omit)(timeSlot),
                screenshots: savedScreenshots
            });
            newTrackedTimeSlots.push(newTimeSlot);
        }
        await dataSource.getRepository(internal_1.TimeSlot).save(newTrackedTimeSlots);
        allTimeSlots.push(...newTrackedTimeSlots);
    }
    return allTimeSlots;
};
exports.createRandomTimeLogs = createRandomTimeLogs;
/**
 * Generates a range of dates with start and stop timestamps.
 *
 * The function creates a random date range where the `startedAt` date
 * is generated within the provided `start` and `stop` range, and the `stoppedAt`
 * date is generated between `startedAt` and up to 2 hours after `startedAt`.
 *
 * @param {Date} start - The earliest possible start date for the range.
 * @param {Date} stop - The latest possible stop date for the range.
 * @returns {Array<{ startedAt: Date; stoppedAt: Date }>} - An array containing a single object
 * with `startedAt` and `stoppedAt` timestamps.
 */
function dateRanges(start, stop) {
    const range = [];
    // Generate a random start date within the range
    const startedAt = faker_1.faker.date.between({ from: start, to: stop });
    // Generate a random stop date between startedAt and 2 hours after startedAt
    const stoppedAt = faker_1.faker.date.between({
        from: startedAt,
        to: moment(startedAt).add(2, 'hours').toDate()
    });
    // Add the range to the result array
    range.push({ startedAt, stoppedAt });
    return range;
}
/**
 * Recalculates the activity for the given timesheets by interacting with the data source.
 *
 * This function performs recalculation of activities for a list of timesheets. It may involve
 * querying the database using the provided data source to update activity metrics based on the
 * timesheet records.
 *
 * @param {DataSource} dataSource - The database connection or ORM data source used to execute queries.
 * @param {ITimesheet[]} timesheets - An array of timesheet objects to process and recalculate activities for.
 * @returns {Promise<void>} - A promise that resolves when the recalculation process is complete.
 */
const recalculateTimesheetActivity = async (dataSource, timesheets) => {
    for await (const timesheet of timesheets) {
        const { id, startedAt, stoppedAt, employeeId, organizationId, tenantId } = timesheet;
        const { start, end } = (0, utils_2.getDateRangeFormat)(moment.utc(startedAt), moment.utc(stoppedAt));
        const query = dataSource.getRepository(internal_1.TimeSlot).createQueryBuilder();
        const timeSlot = await query
            .select('SUM(duration)', 'duration')
            .addSelect('AVG(keyboard)', 'keyboard')
            .addSelect('AVG(mouse)', 'mouse')
            .addSelect('AVG(overall)', 'overall')
            .where(new typeorm_1.Brackets((qb) => {
            qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."employeeId" = :employeeId`), { employeeId });
            qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."organizationId" = :organizationId`), { organizationId });
            qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."tenantId" = :tenantId`), { tenantId });
            qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."startedAt" >= :startedAt AND "${query.alias}"."startedAt" < :stoppedAt`), {
                startedAt: start,
                stoppedAt: end
            });
        }))
            .getRawOne();
        try {
            await dataSource.getRepository(internal_1.Timesheet).update(id, {
                duration: Math.round(timeSlot.duration),
                keyboard: Math.round(timeSlot.keyboard),
                mouse: Math.round(timeSlot.mouse),
                overall: Math.round(timeSlot.overall)
            });
        }
        catch (error) {
            throw new common_1.BadRequestException(`Can\'t update timesheet for employee-${employeeId} of organization-${organizationId}`);
        }
    }
};
exports.recalculateTimesheetActivity = recalculateTimesheetActivity;
//# sourceMappingURL=time-log.seed.js.map