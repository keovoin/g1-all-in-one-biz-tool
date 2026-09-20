"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertIncomes = exports.createRandomIncomes = exports.createDefaultIncomes = void 0;
const faker_1 = require("@faker-js/faker");
const fs = require("fs");
const csv = require("csv-parser");
const path = require("path");
const moment = require("moment");
const underscore_1 = require("underscore");
const config_1 = require("@gauzy/config");
const contracts_1 = require("@gauzy/contracts");
const internal_1 = require("./../core/entities/internal");
const utils_1 = require("./../core/utils");
/**
 * Reads income data from a CSV file asynchronously.
 *
 * @param filePath - The path to the CSV file.
 * @returns A promise that resolves to an array of income data objects.
 */
const readIncomeDataFromCSV = (filePath) => {
    return new Promise((resolve, reject) => {
        const incomeData = [];
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (data) => incomeData.push(data))
            .on('end', () => resolve(incomeData))
            .on('error', (error) => reject(error));
    });
};
/**
 * Finds an existing client or creates a new OrganizationContact based on the payload.
 *
 * @param dataSource - The TypeORM DataSource instance.
 * @param payload - The client details payload.
 * @returns A promise that resolves to an OrganizationContact.
 */
const findOrCreateClient = async (dataSource, payload) => {
    let client = await dataSource.manager.findOne(internal_1.OrganizationContact, {
        where: payload
    });
    if (!client) {
        client = new internal_1.OrganizationContact({
            ...payload,
            imageUrl: (0, utils_1.getDummyImage)(330, 300, payload.name.charAt(0).toUpperCase())
        });
        client = await dataSource.manager.save(client);
    }
    return client;
};
/**
 * Creates Income entities for an organization using the seed data.
 *
 * @param dataSource - The TypeORM DataSource instance.
 * @param tenant - The tenant object.
 * @param organization - The organization object.
 * @param employees - Array of employee objects.
 * @param incomeData - Array of income seed data read from CSV.
 * @param tags - Array of Tag entities for the organization.
 * @returns An array of Income entities.
 */
const buildIncomesForOrganization = async (dataSource, tenant, organization, employees, incomeData, tags) => {
    const incomes = [];
    for (const seedIncome of incomeData) {
        // Find the matching employee by email
        const employee = employees.find((emp) => emp.user.email === seedIncome.email);
        if (!employee) {
            continue;
        }
        // Generate a random date between 3 months and 10 days ago
        const dateRange = faker_1.faker.date.between({
            from: moment().subtract(3, 'months').calendar(),
            to: moment().add(10, 'days').calendar()
        });
        const income = new internal_1.Income();
        income.employee = employee;
        income.organization = organization;
        income.tenant = tenant;
        income.amount = parseFloat(seedIncome.amount);
        income.currency = seedIncome.currency || process.env.DEFAULT_CURRENCY;
        income.notes = seedIncome.notes;
        income.valueDate = moment(dateRange).startOf('day').toDate();
        const clientPayload = {
            name: `Client ${seedIncome.clientName}`,
            tenantId: tenant.id,
            organizationId: organization.id,
            contactType: contracts_1.ContactType.CLIENT,
            budgetType: contracts_1.OrganizationContactBudgetTypeEnum.HOURS
        };
        income.client = await findOrCreateClient(dataSource, clientPayload);
        // Randomly select between 1 and 3 tags
        income.tags = (0, underscore_1.chain)(tags)
            .shuffle()
            .take(faker_1.faker.number.int({ min: 1, max: 3 }))
            .value();
        incomes.push(income);
    }
    return incomes;
};
/**
 * Creates default incomes for a list of organizations and employees for a given tenant.
 *
 * @param dataSource - The TypeORM DataSource instance.
 * @param tenant - The tenant object.
 * @param organizations - An array of organization objects.
 * @param employees - An array of employee objects.
 * @returns A promise that resolves to an array of created Income entities.
 */
const createDefaultIncomes = async (dataSource, tenant, organization, employees) => {
    const filePath = path.resolve(__dirname, 'income-seed-data', 'income-data.csv');
    if (!fs.existsSync(filePath)) {
        console.error('Income data CSV file not found.');
        return [];
    }
    // Read the income seed data from CSV
    const incomeData = await readIncomeDataFromCSV(filePath);
    const allIncomes = [];
    // Process each organization sequentially
    const tags = await dataSource.manager.findBy(internal_1.Tag, { organizationId: organization.id });
    // Build Income entities for the current organization using the CSV data
    const incomes = await buildIncomesForOrganization(dataSource, tenant, organization, employees, incomeData, tags);
    // Insert the incomes into the database
    await (0, exports.insertIncomes)(dataSource, incomes);
    allIncomes.push(...incomes);
    return allIncomes;
};
exports.createDefaultIncomes = createDefaultIncomes;
/**
 * Creates a random Income for a specific employee.
 *
 * @param tenant - The tenant object.
 * @param organization - The organization object.
 * @param employee - The employee object.
 * @param organizationContacts - Array of OrganizationContact entities for the organization.
 * @param tags - Array of Tag entities for the organization.
 * @returns A new Income entity.
 */
const createRandomIncomeForEmployee = async (tenant, organization, employee, organizationContacts, tags) => {
    // Generate a random date between 3 months and 10 days ago
    const dateRange = faker_1.faker.date.between({
        from: moment().subtract(3, 'months').calendar(),
        to: moment().add(10, 'days').calendar()
    });
    const income = new internal_1.Income();
    income.organization = organization;
    income.tenant = tenant;
    income.employee = employee;
    income.amount = faker_1.faker.number.int({ min: 10, max: 9999 });
    // If available, assign a random client from organization contacts.
    if (organizationContacts.length > 0) {
        income.client = faker_1.faker.helpers.arrayElement(organizationContacts);
    }
    income.currency = employee.organization.currency || config_1.environment.defaultCurrency;
    income.valueDate = moment(dateRange).startOf('day').toDate();
    // Randomly select a note from a predefined array.
    const notes = ['Great job!', 'Well done!', 'Nice!', 'Done', 'Great job!'];
    income.notes = faker_1.faker.helpers.arrayElement(notes);
    // Randomly assign between 1 and 3 tags.
    income.tags = (0, underscore_1.chain)(tags)
        .shuffle()
        .take(faker_1.faker.number.int({ min: 1, max: 3 }))
        .values()
        .value();
    return income;
};
/**
 * Creates random incomes for employees across multiple tenants and organizations.
 *
 * @param dataSource - The TypeORM DataSource instance.
 * @param tenants - An array of tenant objects.
 * @param tenantOrganizationsMap - A map associating each tenant with an array of its organizations.
 * @param organizationEmployeesMap - A map associating each organization with an array of its employees.
 * @returns A promise that resolves when all incomes have been created and inserted.
 */
const createRandomIncomes = async (dataSource, tenants, tenantOrganizationsMap, organizationEmployeesMap) => {
    // Iterate over each tenant.
    for (const tenant of tenants) {
        const tenantId = tenant.id;
        // Fetch related organizations for the current tenant.
        const organizations = tenantOrganizationsMap.get(tenant) || [];
        // Iterate over each organization.
        for (const organization of organizations) {
            const incomes = [];
            const organizationId = organization.id;
            // Fetch related organization contacts and tags.
            const organizationContacts = await dataSource.manager.findBy(internal_1.OrganizationContact, {
                tenantId,
                organizationId
            });
            // Fetch related tags.
            const tags = await dataSource.manager.findBy(internal_1.Tag, {
                tenantId,
                organizationId
            });
            const employees = organizationEmployeesMap.get(organization) || [];
            for (const employee of employees) {
                // Create 100 random incomes per employee.
                for (let i = 0; i < 100; i++) {
                    const income = await createRandomIncomeForEmployee(tenant, organization, employee, organizationContacts, tags);
                    incomes.push(income);
                }
            }
            // Batch insert incomes for the current organization.
            await (0, exports.insertIncomes)(dataSource, incomes);
        }
    }
};
exports.createRandomIncomes = createRandomIncomes;
/**
 * Inserts an array of Income entities into the database.
 *
 * @param dataSource - The TypeORM DataSource instance.
 * @param incomes - An array of Income entities to insert.
 * @returns A promise that resolves when the incomes have been successfully inserted.
 */
const insertIncomes = async (dataSource, incomes, batchSize = 100 // Define the batch size to control the number of records inserted per query
) => {
    if (!incomes || incomes.length === 0) {
        console.warn('No incomes provided to insert. Please check the input data and try again.');
        return;
    }
    try {
        // Get the repository for EmployeeNotification
        const repository = dataSource.getRepository(internal_1.Income);
        // Use the chunk option to perform batch inserts
        await repository.save(incomes, { chunk: batchSize });
    }
    catch (error) {
        console.error('Error while inserting incomes:', error);
        return [];
    }
};
exports.insertIncomes = insertIncomes;
//# sourceMappingURL=income.seed.js.map