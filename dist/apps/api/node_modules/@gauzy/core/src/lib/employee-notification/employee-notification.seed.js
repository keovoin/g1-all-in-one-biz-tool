"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRandomEmployeeNotifications = exports.createDefaultEmployeeNotifications = void 0;
const faker_1 = require("@faker-js/faker");
const contracts_1 = require("@gauzy/contracts");
const employee_notification_entity_1 = require("./employee-notification.entity");
/**
 * Generates default employee notifications for each employee within the provided tenants and organizations.
 *
 * @param dataSource - The DataSource instance to interact with the database.
 * @param tenant - The tenant object for which notifications are being created.
 * @param organizations - An array of organizations within the tenant.
 * @param organizationEmployees - An array of employees within the organization.
 * @returns A promise that resolves to an array of created employee notifications.
 */
const createDefaultEmployeeNotifications = async (dataSource, tenant, organization, organizationEmployees) => {
    // Initialize an array to hold the generated notifications
    const employeeNotifications = [];
    // Generate notifications for the current organization
    const notifications = generateEmployeeNotifications(tenant, organization, organizationEmployees);
    employeeNotifications.push(...notifications);
    // Insert the generated notifications into the database
    return insertEmployeeNotifications(dataSource, employeeNotifications);
};
exports.createDefaultEmployeeNotifications = createDefaultEmployeeNotifications;
/**
 * Generates random employee notifications for each employee within the provided tenants and organizations.
 *
 * @param dataSource - The DataSource instance to interact with the database.
 * @param tenants - An array of tenant objects.
 * @param tenantOrganizationsMap - A map associating each tenant with its corresponding organizations.
 * @param organizationEmployeesMap - A map associating each organization with its corresponding employees.
 * @returns A promise that resolves to an array of created employee notifications.
 */
const createRandomEmployeeNotifications = async (dataSource, tenants, tenantOrganizationsMap, organizationEmployeesMap) => {
    // Initialize an array to hold the generated notifications
    const employeeNotifications = [];
    // Iterate over each tenant
    for (const tenant of tenants) {
        // Retrieve the organizations associated with the current tenant
        const organizations = tenantOrganizationsMap.get(tenant) || [];
        // Iterate over each organization
        for (const organization of organizations) {
            // Retrieve the employees associated with the current organization
            const organizationEmployees = organizationEmployeesMap.get(organization) || [];
            // Generate notifications for the current organization
            const notifications = generateEmployeeNotifications(tenant, organization, organizationEmployees);
            employeeNotifications.push(...notifications);
        }
    }
    // Insert the generated notifications into the database
    return await insertEmployeeNotifications(dataSource, employeeNotifications);
};
exports.createRandomEmployeeNotifications = createRandomEmployeeNotifications;
/**
 * Generates employee notifications for a given tenant, organization, and employees.
 *
 * @param tenant - The tenant object for which notifications are being created.
 * @param organization - The organization within the tenant.
 * @param organizationEmployees - An array of employees within the organization.
 * @returns An array of generated employee notifications.
 */
const generateEmployeeNotifications = (tenant, organization, organizationEmployees) => {
    const notifications = [];
    // Iterate over each employee
    for (const employee of organizationEmployees) {
        // Generate a random task title with dynamic naming
        const randomTaskTitle = `Task ${faker_1.faker.number.int({ min: 1, max: 100 })}: ${faker_1.faker.lorem.words(3)}`;
        // Assign a random sender from the same organization
        const potentialSenders = organizationEmployees.filter((e) => e.id !== employee.id);
        const sentByEmployee = potentialSenders.length > 0 ? faker_1.faker.helpers.arrayElement(potentialSenders) : null;
        // Create and initialize the notification
        const notification = new employee_notification_entity_1.EmployeeNotification({
            title: `You have been assigned to the task "${randomTaskTitle}"`,
            message: `Please ensure to complete the task "${randomTaskTitle}" by the end of the week.`,
            type: getRandomNotificationType(),
            entity: contracts_1.BaseEntityEnum.Employee,
            entityId: employee.id,
            receiverEmployeeId: employee.id,
            sentByEmployeeId: sentByEmployee ? sentByEmployee.id : undefined,
            organization,
            tenant
        });
        // Add the notification to the array
        notifications.push(notification);
    }
    return notifications;
};
// Function to get a random notification type
function getRandomNotificationType() {
    const values = Object.values(contracts_1.EmployeeNotificationTypeEnum);
    const randomIndex = Math.floor(Math.random() * values.length);
    return values[randomIndex];
}
/**
 * Inserts multiple EmployeeNotification records into the database efficiently.
 *
 * @param dataSource - The DataSource instance connected to the database.
 * @param notifications - An array of EmployeeNotification entities to be inserted.
 * @returns A promise that resolves once the insertion is complete.
 * @throws An error if the insertion fails.
 */
const insertEmployeeNotifications = async (dataSource, notifications, batchSize = 100 // Define the batch size to control the number of records inserted per query
) => {
    if (!notifications.length) {
        console.warn('No notifications to insert. Please check the input data and try again');
        return [];
    }
    try {
        // Get the repository for EmployeeNotification
        const notificationRepository = dataSource.getRepository(employee_notification_entity_1.EmployeeNotification);
        // Insert the notifications in batches
        return await notificationRepository.save(notifications, { chunk: batchSize });
    }
    catch (error) {
        console.error('Error while inserting employee notifications:', error);
        return [];
    }
};
//# sourceMappingURL=employee-notification.seed.js.map