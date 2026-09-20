"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDefaultEmployees = exports.createRandomEmployees = exports.createDefaultEmployees = void 0;
const contracts_1 = require("@gauzy/contracts");
const faker_1 = require("@faker-js/faker");
const config_1 = require("@gauzy/config");
const internal_1 = require("./../core/entities/internal");
const organization_seed_1 = require("./../organization/organization.seed");
/**
 * Creates default employees for the given organization.
 *
 * @param dataSource - The data source to interact with the database.
 * @param tenant - The tenant to which the employees belong.
 * @param organization - The organization for the employees.
 * @param users - The users to be converted into employees.
 * @param defaultEmployees - The default employee configurations.
 * @returns The created employees.
 */
const createDefaultEmployees = async (dataSource, tenant, organization, users, defaultEmployees) => {
    // Pre compute the organization's currency or use the default currency
    const currency = organization.currency || config_1.environment.defaultCurrency;
    // Use the default employee configurations to generate employees
    const employees = users.map((user) => {
        const defaultEmployee = defaultEmployees.find(({ email }) => email === user.email);
        // Generate bill rate and minimum billing rate once to avoid repeated calculations
        const billRateValue = faker_1.faker.number.int({ min: 15, max: 40 });
        const minimumBillingRate = faker_1.faker.number.int({ min: 5, max: billRateValue - 1 });
        // Determine if user has administrative privileges.
        // user.role is set in-memory by the seed functions (generateRandomUser / seedDefaultEmployeeUsers)
        // before insertUsers is called, so it is always populated here.
        const roleName = user.role?.name;
        const isAdmin = !!roleName && [contracts_1.RolesEnum.ADMIN, contracts_1.RolesEnum.SUPER_ADMIN].includes(roleName);
        return new internal_1.Employee({
            organization,
            tenant,
            user,
            employeeLevel: defaultEmployee?.employeeLevel,
            startedWorkOn: parseDate(defaultEmployee?.startedWorkOn),
            endWork: parseDate(defaultEmployee?.endWork),
            payPeriod: faker_1.faker.helpers.arrayElement(Object.values(contracts_1.PayPeriodEnum)),
            billRateValue,
            billRateCurrency: currency,
            minimumBillingRate,
            reWeeklyLimit: faker_1.faker.number.int({ min: 10, max: 40 }),
            allowManualTime: isAdmin,
            allowModifyTime: isAdmin,
            allowDeleteTime: isAdmin
        });
    });
    await insertEmployees(dataSource, employees);
    return employees;
};
exports.createDefaultEmployees = createDefaultEmployees;
/**
 * Creates random employees for each tenant and organization.
 *
 * This function iterates over the provided tenants and their associated organizations,
 * generating random employees for each organization based on the users associated with
 * that organization. The employees are then inserted into the database and returned in
 * a map, associating organizations with their respective employees.
 *
 * @param dataSource - The data source for interacting with the database.
 * @param tenants - A list of tenant entities for which employees will be created.
 * @param tenantOrganizationsMap - A map associating each tenant with their respective organizations.
 * @param organizationUsersMap - A map associating each organization with its users.
 * @returns A promise that resolves to a map associating organizations with their respective employees.
 */
const createRandomEmployees = async (dataSource, tenants, tenantOrganizationsMap, organizationUsersMap) => {
    // Initialize the map to store organizations and their respective employees
    const organizationEmployeesMap = new Map();
    // Iterate through each tenant
    for (const tenant of tenants) {
        const organizations = tenantOrganizationsMap.get(tenant) || [];
        // Iterate through each organization in the tenant
        for (const organization of organizations) {
            const users = organizationUsersMap.get(organization) || [];
            // Map each user to a new random employee entity
            const employees = users.map((user) => {
                // Determine if user has administrative privileges.
                // user.role is set in-memory by seedRandomUsers / createRandomSuperAdminUsers.
                const roleName = user.role?.name;
                const isAdmin = !!roleName && [contracts_1.RolesEnum.ADMIN, contracts_1.RolesEnum.SUPER_ADMIN].includes(roleName);
                const employee = new internal_1.Employee({
                    organization,
                    tenant,
                    user,
                    isActive: true,
                    startedWorkOn: faker_1.faker.date.past(),
                    payPeriod: faker_1.faker.helpers.arrayElement(Object.values(contracts_1.PayPeriodEnum)),
                    billRateValue: faker_1.faker.number.int({ min: 15, max: 40 }),
                    billRateCurrency: (organization.currency || config_1.environment.defaultCurrency),
                    reWeeklyLimit: faker_1.faker.number.int({ min: 10, max: 40 }),
                    endWork: null,
                    allowManualTime: isAdmin,
                    allowModifyTime: isAdmin,
                    allowDeleteTime: isAdmin
                });
                return employee;
            });
            // Add employees to the map and save them to the database
            organizationEmployeesMap.set(organization, employees);
            await insertEmployees(dataSource, employees);
        }
    }
    return organizationEmployeesMap;
};
exports.createRandomEmployees = createRandomEmployees;
/**
 * Inserts the employees into the database.
 *
 * @param dataSource - The data source for database interactions.
 * @param employees - The list of employees to be inserted.
 * @returns A promise of inserted employees.
 */
const insertEmployees = (dataSource, employees) => {
    return dataSource.manager.save(employees);
};
/**
 * Parses a date string into a Date object.
 *
 * @param dateString - The string to be parsed.
 * @returns The parsed Date object, or null if the string is not provided.
 */
const parseDate = (dateString) => {
    return dateString ? new Date(dateString) : null;
};
/**
 * Fetches default employees for the given tenant.
 */
const getDefaultEmployees = async (dataSource, tenant) => {
    // Get the default organization for the given tenant
    const organization = await (0, organization_seed_1.getDefaultOrganization)(dataSource, tenant);
    // Fetch the employees for the given organization
    return dataSource.getRepository(internal_1.Employee).find({
        where: { tenantId: tenant.id, organizationId: organization.id },
        relations: { tenant: true, organization: true }
    });
};
exports.getDefaultEmployees = getDefaultEmployees;
//# sourceMappingURL=employee.seed.js.map