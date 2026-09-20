"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRandomTimesheet = exports.createDefaultTimeSheet = void 0;
const faker_1 = require("@faker-js/faker");
const contracts_1 = require("@gauzy/contracts");
const moment = require("moment");
const _ = require("underscore");
const chalk = require("chalk");
const time_log_seed_1 = require("./../time-log/time-log.seed");
const activity_seed_1 = require("../activity/activity.seed");
const internal_1 = require("./../../core/entities/internal");
const random_seed_config_1 = require("./../../core/seeds/random-seed-config");
const createDefaultTimeSheet = async (dataSource, config, tenant, organization, employees) => {
    try {
        const timesheets = [];
        for (let index = 0; index < 5; index++) {
            const date = moment().subtract(index, 'week').toDate();
            const startedAt = moment(date).startOf('week').toDate();
            const stoppedAt = moment(date).endOf('week').toDate();
            for await (const employee of employees) {
                const status = faker_1.faker.helpers.arrayElement(Object.keys(contracts_1.TimesheetStatus));
                let isBilled = false;
                let approvedAt = null;
                let submittedAt = null;
                if (contracts_1.TimesheetStatus[status] === contracts_1.TimesheetStatus.PENDING) {
                    approvedAt = null;
                    submittedAt = faker_1.faker.date.past();
                }
                else if (contracts_1.TimesheetStatus[status] === contracts_1.TimesheetStatus.IN_REVIEW) {
                    approvedAt = null;
                    submittedAt = faker_1.faker.date.between({ from: startedAt, to: new Date() });
                }
                else if (contracts_1.TimesheetStatus[status] === contracts_1.TimesheetStatus.APPROVED) {
                    isBilled = faker_1.faker.helpers.arrayElement([true, false]);
                    approvedAt = faker_1.faker.date.between({ from: startedAt, to: new Date() });
                    submittedAt = faker_1.faker.date.between({ from: startedAt, to: approvedAt });
                }
                const timesheet = new internal_1.Timesheet();
                timesheet.employee = employee;
                timesheet.organization = organization;
                timesheet.tenant = tenant;
                timesheet.approvedBy = null;
                timesheet.startedAt = startedAt;
                timesheet.stoppedAt = stoppedAt;
                timesheet.duration = 0;
                timesheet.keyboard = 0;
                timesheet.mouse = 0;
                timesheet.overall = 0;
                timesheet.approvedAt = approvedAt;
                timesheet.submittedAt = submittedAt;
                timesheet.lockedAt = null;
                timesheet.isBilled = isBilled;
                timesheet.status = contracts_1.TimesheetStatus[status];
                timesheets.push(timesheet);
            }
        }
        await dataSource.getRepository(internal_1.Timesheet).save(timesheets);
    }
    catch (error) {
        console.log(chalk.red(`SEEDING Default Timesheet`, error));
    }
    try {
        console.log(chalk.green(`SEEDING Default TimeLogs & Activities`));
        const { id: organizationId, tenantId } = organization;
        const createdTimesheets = await dataSource.manager.findBy(internal_1.Timesheet, {
            tenantId,
            organizationId
        });
        const timeSlots = await (0, time_log_seed_1.createRandomTimeLogs)(dataSource, config, tenant, createdTimesheets);
        /**
         * Recalculate Timesheet Activities
         */
        await (0, time_log_seed_1.recalculateTimesheetActivity)(dataSource, createdTimesheets);
        await (0, activity_seed_1.createRandomActivities)(dataSource, tenant, timeSlots);
    }
    catch (error) {
        console.log(chalk.red(`SEEDING Default TimeLogs & Activities`, error));
    }
};
exports.createDefaultTimeSheet = createDefaultTimeSheet;
const createRandomTimesheet = async (dataSource, config, tenants) => {
    for await (const tenant of tenants) {
        try {
            const timesheets = [];
            const { id: tenantId } = tenant;
            const employees = await dataSource.getRepository(internal_1.Employee).find({
                where: {
                    tenantId: tenantId
                },
                relations: {
                    organization: true
                }
            });
            for (let index = 0; index < random_seed_config_1.randomSeedConfig.noOfTimesheetPerEmployee; index++) {
                const date = moment().subtract(index, 'week').toDate();
                const startedAt = moment(date).startOf('week').toDate();
                const stoppedAt = moment(date).endOf('week').toDate();
                _.chain(employees)
                    .shuffle()
                    .take(faker_1.faker.number.int(employees.length))
                    .each((employee) => {
                    const status = faker_1.faker.helpers.arrayElement(Object.keys(contracts_1.TimesheetStatus));
                    let isBilled = false;
                    let approvedAt = null;
                    let submittedAt = null;
                    if (contracts_1.TimesheetStatus[status] === contracts_1.TimesheetStatus.PENDING) {
                        approvedAt = null;
                        submittedAt = faker_1.faker.date.past();
                    }
                    else if (contracts_1.TimesheetStatus[status] === contracts_1.TimesheetStatus.IN_REVIEW) {
                        approvedAt = null;
                        submittedAt = faker_1.faker.date.between({ from: startedAt, to: new Date() });
                    }
                    else if (contracts_1.TimesheetStatus[status] === contracts_1.TimesheetStatus.APPROVED) {
                        isBilled = faker_1.faker.helpers.arrayElement([true, false]);
                        approvedAt = faker_1.faker.date.between({ from: startedAt, to: new Date() });
                        submittedAt = faker_1.faker.date.between({ from: startedAt, to: approvedAt });
                    }
                    const timesheet = new internal_1.Timesheet();
                    timesheet.employee = employee;
                    timesheet.organization = employee.organization;
                    timesheet.tenant = tenant;
                    timesheet.approvedBy = null;
                    timesheet.startedAt = startedAt;
                    timesheet.stoppedAt = stoppedAt;
                    timesheet.duration = 0;
                    timesheet.keyboard = 0;
                    timesheet.mouse = 0;
                    timesheet.overall = 0;
                    timesheet.approvedAt = approvedAt;
                    timesheet.submittedAt = submittedAt;
                    timesheet.lockedAt = null;
                    timesheet.isBilled = isBilled;
                    timesheet.status = contracts_1.TimesheetStatus[status];
                    timesheets.push(timesheet);
                });
            }
            await dataSource.getRepository(internal_1.Timesheet).save(timesheets);
        }
        catch (error) {
            console.log(chalk.red(`SEEDING Default Timesheet`, error));
        }
    }
    try {
        console.log(chalk.green(`SEEDING Random TimeLogs & Activities`));
        for (const tenant of tenants) {
            await seedTimeLogsAndActivities(dataSource, config, tenant);
        }
        console.log(chalk.green(`SEEDING Random TimeLogs & Activities completed successfully.`));
    }
    catch (error) {
        console.error(chalk.red(`Error occurred during SEEDING Random TimeLogs & Activities:`, error));
    }
};
exports.createRandomTimesheet = createRandomTimesheet;
/**
 * Seeds random time logs and activities for a tenant.
 *
 * @param dataSource - The TypeORM data source.
 * @param config - The configuration object.
 * @param tenant - The tenant for which the time logs and activities are seeded.
 */
const seedTimeLogsAndActivities = async (dataSource, config, tenant) => {
    const { id: tenantId } = tenant;
    // Fetch all timesheets for the current tenant
    const createdTimesheets = await dataSource.manager.findBy(internal_1.Timesheet, { tenantId });
    // Create random time logs for the tenant
    const timeSlots = await (0, time_log_seed_1.createRandomTimeLogs)(dataSource, config, tenant, createdTimesheets);
    // Recalculate timesheet activities
    await (0, time_log_seed_1.recalculateTimesheetActivity)(dataSource, createdTimesheets);
    // Create random activities for the tenant
    await (0, activity_seed_1.createRandomActivities)(dataSource, tenant, timeSlots);
    console.log(chalk.green(`Seeded TimeLogs and Activities for tenant: ${tenantId}`));
};
//# sourceMappingURL=timesheet.seed.js.map