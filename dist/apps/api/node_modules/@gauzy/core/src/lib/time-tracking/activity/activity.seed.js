"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRandomActivities = exports.AppsNames = void 0;
const faker_1 = require("@faker-js/faker");
const _ = require("underscore");
const moment = require("moment");
const contracts_1 = require("@gauzy/contracts");
const utils_1 = require("@gauzy/utils");
const activity_entity_1 = require("./activity.entity");
const internal_1 = require("./../../core/entities/internal");
const employee_entity_1 = require("../../employee/employee.entity");
const database_helper_1 = require("./../../database/database.helper");
exports.AppsNames = [
    'Sublime Text',
    'Chrome',
    'Visual Studio Core',
    'Git Desktop',
    'Slack',
    'Skype',
    'Mail',
    'Terminal',
    "Desktop Timer",
    "PgAdmin"
];
/**
 * Creates random activities for the given tenant and time slots.
 *
 * @param dataSource - The TypeORM data source.
 * @param tenant - The tenant for which activities are created.
 * @param timeSlots - The time slots to associate with activities.
 * @returns A promise that resolves to an array of created activities.
 */
const createRandomActivities = async (dataSource, tenant, timeSlots) => {
    const { id: tenantId } = tenant;
    // Fetch employees for the tenant
    const employees = await dataSource.manager.findBy(employee_entity_1.Employee, { tenantId });
    let query = dataSource
        .getRepository(internal_1.OrganizationProject)
        .createQueryBuilder();
    query.leftJoinAndSelect(`${query.alias}.tasks`, 'tasks');
    query.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."tenantId" = :tenantId`), { tenantId: tenant.id });
    const projects = await query.getMany();
    const appNames = _.shuffle(exports.AppsNames);
    const allActivities = [];
    for (let day = 0; day < 5; day++) {
        const date = moment().subtract(day, 'day').toDate();
        for (const employee of employees) {
            const employeeTimeSlots = timeSlots.filter((slot) => slot.employeeId === employee.id);
            // Generate activities for apps
            const appActivities = generateActivitiesForApps(appNames, projects, employeeTimeSlots, employee, tenant, date);
            // Generate activities for URLs
            const urlActivities = generateActivitiesForUrls(projects, employeeTimeSlots, employee, tenant, date);
            // Save activities to the database
            const activities = [...appActivities, ...urlActivities];
            await dataSource.manager.save(activities);
            allActivities.push(...activities);
        }
    }
    return allActivities;
};
exports.createRandomActivities = createRandomActivities;
/**
 * Generates activities for apps.
 *
 * @param appNames - The list of app names.
 * @param projects - The list of projects.
 * @param timeSlots - The list of time slots for the employee.
 * @param employee - The employee associated with the activities.
 * @param tenant - The tenant associated with the activities.
 * @param date - The date for the activities.
 * @returns An array of generated app activities.
 */
const generateActivitiesForApps = (appNames, projects, timeSlots, employee, tenant, date) => {
    return appNames.slice(0, faker_1.faker.number.int({ min: 0, max: appNames.length })).map((appName) => {
        const project = (0, utils_1.getRandomElement)(projects);
        const task = (0, utils_1.getRandomElement)(project?.tasks || []);
        const timeSlot = (0, utils_1.getRandomElement)(timeSlots);
        const activity = new activity_entity_1.Activity();
        activity.organizationId = employee.organizationId;
        activity.tenant = tenant;
        activity.employee = employee;
        activity.project = project;
        activity.timeSlot = timeSlot;
        activity.task = task;
        activity.title = appName;
        activity.date = moment(date).format('YYYY-MM-DD');
        activity.time = generateRandomTime(date);
        activity.recordedAt = date;
        activity.duration = faker_1.faker.number.int(100);
        activity.type = contracts_1.ActivityType.APP;
        return activity;
    });
};
/**
 * Generates activities for URLs.
 *
 * @param projects - The list of projects.
 * @param timeSlots - The list of time slots for the employee.
 * @param employee - The employee associated with the activities.
 * @param tenant - The tenant associated with the activities.
 * @param date - The date for the activities.
 * @returns An array of generated URL activities.
 */
const generateActivitiesForUrls = (projects, timeSlots, employee, tenant, date) => {
    return Array.from({ length: faker_1.faker.number.int({ min: 0, max: 10 }) }).flatMap(() => {
        const url = faker_1.faker.internet.domainName();
        return Array.from({ length: faker_1.faker.number.int({ min: 5, max: 10 }) }).map(() => {
            const project = (0, utils_1.getRandomElement)(projects);
            const task = (0, utils_1.getRandomElement)(project?.tasks || []);
            const timeSlot = (0, utils_1.getRandomElement)(timeSlots);
            const activity = new activity_entity_1.Activity();
            activity.organizationId = employee.organizationId;
            activity.tenant = tenant;
            activity.employee = employee;
            activity.project = project;
            activity.timeSlot = timeSlot;
            activity.task = task;
            activity.title = url;
            activity.metaData = {
                url: faker_1.faker.internet.url(),
                title: faker_1.faker.internet.domainSuffix(),
                description: faker_1.faker.lorem.sentence()
            };
            activity.description = faker_1.faker.lorem.sentence();
            activity.date = moment(date).format('YYYY-MM-DD');
            activity.time = generateRandomTime(date);
            activity.duration = faker_1.faker.number.int({ min: 10, max: 100 });
            activity.type = contracts_1.ActivityType.URL;
            return activity;
        });
    });
};
/**
 * Generates a random time for a given date.
 *
 * @param date - The date for the random time.
 * @returns A string representing the random time in HH:mm:ss format.
 */
const generateRandomTime = (date) => {
    return moment(faker_1.faker.date.between({
        from: moment(date).startOf('day').toDate(),
        to: moment(date).endOf('day').toDate()
    })).format('HH:mm:ss');
};
//# sourceMappingURL=activity.seed.js.map