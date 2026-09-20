"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRandomOrganizations = exports.createDefaultOrganizations = exports.getDefaultOrganizations = exports.getDefaultOrganization = void 0;
const underscore_1 = require("underscore");
const moment = require("moment");
const timezone = require("moment-timezone");
const faker_1 = require("@faker-js/faker");
const constants_1 = require("@gauzy/constants");
const contracts_1 = require("@gauzy/contracts");
const config_1 = require("@gauzy/config");
const utils_1 = require("@gauzy/utils");
const utils_2 = require("../core/utils");
const internal_1 = require("../core/entities/internal");
/**
 * The invite expiry periods an organization may be seeded with.
 *
 * `InvitationExpirationEnum` also carries `NEVER = 'Never'`, but `inviteExpiryPeriod` is a numeric
 * (days) column, so only the numeric members are seedable. Listing them explicitly rather than using
 * `Object.values()` avoids TypeScript's reverse mappings (`'DAY'`, `'WEEK'`, ...) leaking in.
 */
const SEEDABLE_INVITE_EXPIRY_PERIODS = [
    contracts_1.InvitationExpirationEnum.DAY,
    contracts_1.InvitationExpirationEnum.WEEK,
    contracts_1.InvitationExpirationEnum.TWO_WEEK,
    contracts_1.InvitationExpirationEnum.MONTH
];
/**
 * Retrieves the default organization for a given tenant.
 *
 * @param dataSource - The TypeORM data source.
 * @param tenant - The tenant for which the default organization is retrieved.
 * @returns A promise that resolves to the default organization if it exists, otherwise `null`.
 */
const getDefaultOrganization = async (dataSource, tenant) => {
    if (!tenant?.id) {
        throw new Error('Invalid tenant: Tenant ID is required.');
    }
    return dataSource.getRepository(internal_1.Organization).findOne({
        where: { tenantId: tenant.id, isDefault: true }
    });
};
exports.getDefaultOrganization = getDefaultOrganization;
/**
 * Retrieves all organizations for a given tenant.
 *
 * @param dataSource - The TypeORM data source.
 * @param tenant - The tenant for which the organizations are retrieved.
 * @returns A promise that resolves to an array of organizations for the specified tenant.
 * @throws Error if the tenant ID is not provided or invalid.
 */
const getDefaultOrganizations = async (dataSource, tenant) => {
    if (!tenant?.id) {
        throw new Error('Invalid tenant: Tenant ID is required.');
    }
    return dataSource.getRepository(internal_1.Organization).find({
        where: { tenantId: tenant.id }
    });
};
exports.getDefaultOrganizations = getDefaultOrganizations;
let defaultOrganizationsInserted = [];
/**
 * Creates default organizations for a tenant.
 *
 * @param dataSource - The TypeORM data source.
 * @param tenant - The tenant to associate the organizations with.
 * @param organizations - An array of organization input data.
 * @returns A promise that resolves to the created organizations.
 */
const createDefaultOrganizations = async (dataSource, tenant, organizations) => {
    if (!tenant) {
        throw new Error('Tenant is required to create default organizations.');
    }
    const defaultOrganizations = [];
    const skills = await getRandomSkills(dataSource, faker_1.faker.number.int({ min: 1, max: 4 }));
    const contacts = await getRandomContacts(dataSource);
    for (const organization of organizations) {
        const { name, currency, defaultValueDateType, imageUrl, isDefault, totalEmployees } = organization;
        const defaultOrganization = new internal_1.Organization();
        defaultOrganization.name = name;
        defaultOrganization.isDefault = isDefault || false;
        defaultOrganization.totalEmployees = totalEmployees || 0;
        defaultOrganization.profile_link = generateLink(name);
        defaultOrganization.currency = currency || 'USD';
        defaultOrganization.defaultValueDateType = defaultValueDateType || 'CURRENT_DATE';
        defaultOrganization.imageUrl = imageUrl;
        defaultOrganization.invitesAllowed = true;
        defaultOrganization.bonusType = contracts_1.BonusTypeEnum.REVENUE_BASED_BONUS;
        defaultOrganization.bonusPercentage = 10;
        defaultOrganization.registrationDate = faker_1.faker.date.past({ years: 5 });
        defaultOrganization.overview = faker_1.faker.lorem.sentence();
        defaultOrganization.short_description = faker_1.faker.lorem.sentence();
        defaultOrganization.client_focus = faker_1.faker.lorem.sentence();
        defaultOrganization.show_profits = false;
        defaultOrganization.show_bonuses_paid = false;
        defaultOrganization.show_income = false;
        defaultOrganization.show_total_hours = false;
        defaultOrganization.show_projects_count = true;
        defaultOrganization.show_minimum_project_size = true;
        defaultOrganization.show_clients_count = true;
        defaultOrganization.show_clients = true;
        defaultOrganization.show_employees_count = true;
        defaultOrganization.banner = faker_1.faker.lorem.sentence();
        defaultOrganization.skills = skills;
        defaultOrganization.brandColor = faker_1.faker.color.rgb();
        defaultOrganization.timeZone = faker_1.faker.helpers.arrayElement(timezone.tz.names().filter((zone) => zone.includes('/')));
        defaultOrganization.dateFormat = faker_1.faker.helpers.arrayElement(constants_1.DEFAULT_DATE_FORMATS);
        defaultOrganization.contact = (0, utils_1.getRandomElement)(contacts);
        defaultOrganization.defaultAlignmentType = faker_1.faker.helpers.arrayElement(Object.keys(contracts_1.AlignmentOptions));
        defaultOrganization.fiscalStartDate = moment().add(faker_1.faker.number.int(10), 'days').toDate();
        defaultOrganization.fiscalEndDate = moment(defaultOrganization.fiscalStartDate)
            .add(faker_1.faker.number.int({ min: 10, max: 20 }), 'days')
            .toDate();
        defaultOrganization.futureDateAllowed = true;
        defaultOrganization.inviteExpiryPeriod = Number(faker_1.faker.helpers.arrayElement(SEEDABLE_INVITE_EXPIRY_PERIODS));
        defaultOrganization.numberFormat = faker_1.faker.helpers.arrayElement(['USD', 'BGN', 'ILS']);
        defaultOrganization.officialName = faker_1.faker.company.name();
        defaultOrganization.separateInvoiceItemTaxAndDiscount = faker_1.faker.datatype.boolean();
        defaultOrganization.startWeekOn = contracts_1.WeekDaysEnum.MONDAY;
        defaultOrganization.tenant = tenant;
        defaultOrganization.valueDate = moment().add(faker_1.faker.number.int(10), 'days').toDate();
        defaultOrganizations.push(defaultOrganization);
    }
    await insertOrganizations(dataSource, defaultOrganizations);
    defaultOrganizationsInserted = [...defaultOrganizations];
    return defaultOrganizationsInserted;
};
exports.createDefaultOrganizations = createDefaultOrganizations;
/**
 * Creates random organizations for multiple tenants.
 *
 * @param dataSource - The TypeORM data source.
 * @param tenants - The list of tenants for which organizations will be created.
 * @param organizationsPerTenant - The number of organizations to create per tenant.
 * @returns A promise that resolves to a map of tenants and their corresponding organizations.
 */
const createRandomOrganizations = async (dataSource, tenants, organizationsPerTenant) => {
    if (!tenants || tenants.length === 0) {
        throw new Error('Tenants are required to create random organizations.');
    }
    const skills = await getRandomSkills(dataSource, faker_1.faker.number.int({ min: 1, max: 4 }));
    const defaultDateTypes = Object.values(contracts_1.DefaultValueDateTypeEnum);
    const tenantOrganizations = new Map();
    for await (const tenant of tenants) {
        const randomOrganizations = [];
        if (tenant.name === 'Ever') {
            tenantOrganizations.set(tenant, defaultOrganizationsInserted);
        }
        else {
            for (let index = 0; index < organizationsPerTenant; index++) {
                const organization = await generateRandomOrganization(tenant, index === 0, // Set the first organization as default
                defaultDateTypes[index % defaultDateTypes.length], skills, dataSource);
                randomOrganizations.push(organization);
            }
            await insertOrganizations(dataSource, randomOrganizations);
            tenantOrganizations.set(tenant, randomOrganizations);
        }
    }
    return tenantOrganizations;
};
exports.createRandomOrganizations = createRandomOrganizations;
/**
 * Generates a random organization entity.
 *
 * @param tenant - The tenant to associate the organization with.
 * @param isDefault - Whether the organization is the default for the tenant.
 * @param defaultValueDateType - The default value date type for the organization.
 * @param skills - Pre-generated skills to assign to the organization.
 * @param dataSource - The TypeORM data source (for fetching random contact).
 * @returns A randomly generated organization entity.
 */
const generateRandomOrganization = async (tenant, isDefault, defaultValueDateType, skills, dataSource) => {
    const timeZone = faker_1.faker.helpers.arrayElement(timezone.tz.names().filter((zone) => zone.includes('/')));
    const companyName = faker_1.faker.company.name();
    const logoAbbreviation = _extractLogoAbbreviation(companyName);
    const contacts = await getRandomContacts(dataSource);
    const { bonusType, bonusPercentage } = randomBonus();
    const organization = new internal_1.Organization();
    organization.name = companyName;
    organization.isDefault = isDefault;
    organization.totalEmployees = 5;
    organization.profile_link = generateLink(companyName);
    organization.currency = config_1.environment.defaultCurrency;
    organization.defaultValueDateType = defaultValueDateType;
    organization.imageUrl = (0, utils_2.getDummyImage)(330, 300, logoAbbreviation);
    organization.invitesAllowed = true;
    organization.bonusType = bonusType;
    organization.bonusPercentage = bonusPercentage;
    organization.registrationDate = faker_1.faker.date.past({ years: Math.floor(Math.random() * 10) + 1 });
    organization.overview = faker_1.faker.lorem.sentence();
    organization.short_description = faker_1.faker.lorem.sentence();
    organization.client_focus = faker_1.faker.lorem.sentence();
    organization.show_profits = false;
    organization.show_bonuses_paid = false;
    organization.show_income = false;
    organization.show_total_hours = false;
    organization.show_projects_count = true;
    organization.show_minimum_project_size = true;
    organization.show_clients_count = true;
    organization.show_employees_count = true;
    organization.banner = faker_1.faker.lorem.sentence();
    organization.skills = skills;
    organization.brandColor = faker_1.faker.color.rgb();
    organization.contact = (0, utils_1.getRandomElement)(contacts);
    organization.timeZone = timeZone;
    organization.dateFormat = faker_1.faker.helpers.arrayElement(constants_1.DEFAULT_DATE_FORMATS);
    organization.defaultAlignmentType = faker_1.faker.helpers.arrayElement(Object.keys(contracts_1.AlignmentOptions));
    organization.fiscalStartDate = moment().add(faker_1.faker.number.int(10), 'days').toDate();
    organization.fiscalEndDate = moment(organization.fiscalStartDate).add(faker_1.faker.number.int(10), 'days').toDate();
    organization.futureDateAllowed = true;
    organization.inviteExpiryPeriod = Number(faker_1.faker.helpers.arrayElement(SEEDABLE_INVITE_EXPIRY_PERIODS));
    organization.numberFormat = faker_1.faker.helpers.arrayElement(['USD', 'BGN', 'ILS']);
    organization.officialName = faker_1.faker.company.name();
    organization.separateInvoiceItemTaxAndDiscount = faker_1.faker.datatype.boolean();
    organization.startWeekOn = contracts_1.WeekDaysEnum.MONDAY;
    organization.tenant = tenant;
    organization.valueDate = moment().add(faker_1.faker.number.int(10), 'days').toDate();
    return organization;
};
/**
 * Inserts multiple organizations into the database.
 *
 * @param dataSource - The TypeORM data source.
 * @param organizations - An array of organizations to be inserted.
 * @returns A promise that resolves once the organizations are successfully inserted.
 * @throws Error if the `organizations` array is empty or invalid.
 */
const insertOrganizations = async (dataSource, organizations) => {
    if (!organizations || organizations.length === 0) {
        throw new Error('The organizations array must not be empty.');
    }
    try {
        await dataSource.manager.save(organizations);
    }
    catch (error) {
        throw new Error(`Failed to insert organizations: ${error.message}`);
    }
};
/**
 * Extracts an abbreviation for a company logo based on its name.
 * - If the company name has only one word, returns the first letter.
 * - If the company name has multiple words, returns the first letter of the first and last words.
 *
 * @param companyName - The full name of the company.
 * @returns The logo abbreviation as a string.
 * @throws Error if `companyName` is empty or not a valid string.
 */
const _extractLogoAbbreviation = (companyName) => {
    if (!companyName || typeof companyName !== 'string') {
        throw new Error('Invalid company name. A non-empty string is required.');
    }
    const trimmedName = companyName.trim();
    const words = trimmedName.split(/\s+/); // Split by one or more spaces
    // Get the first letter of the first word
    const firstLetter = words[0][0];
    // Get the first letter of the last word if there are multiple words
    const lastLetter = words.length > 1 ? words[words.length - 1][0] : '';
    return `${firstLetter}${lastLetter}`.toUpperCase();
};
/**
 * Generates a random bonus type and percentage.
 *
 * @returns An object containing the bonus type and the corresponding percentage.
 */
const randomBonus = () => {
    const randomNumberBetween = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
    const bonusType = Object.values(contracts_1.BonusTypeEnum)[randomNumberBetween(0, 1)];
    const bonusPercentage = bonusType === contracts_1.BonusTypeEnum.PROFIT_BASED_BONUS ? randomNumberBetween(65, 75) : randomNumberBetween(5, 10);
    return { bonusType, bonusPercentage };
};
/**
 * Generates a URL-friendly slug from a given name.
 *
 * @param name - The name to be converted into a slug.
 * @returns The generated slug as a string.
 */
const generateLink = (name) => {
    if (!name) {
        throw new Error('Name is required to generate a link.');
    }
    return name.replace(/[^A-Z0-9]+/gi, '-').toLowerCase();
};
/**
 * Retrieves a random subset of skills from the database.
 *
 * @param dataSource - The TypeORM data source to query the skills.
 * @param count - The number of random skills to retrieve.
 * @returns A promise that resolves to an array of randomly selected skills.
 * @throws Error if there is an issue retrieving skills from the database.
 */
const getRandomSkills = async (dataSource, count) => {
    if (!dataSource) {
        throw new Error('Invalid data source: DataSource is required.');
    }
    // Retrieve all skills from the database
    const skills = await dataSource.manager.find(internal_1.Skill, {});
    // Shuffle and select a subset of skills
    return (0, underscore_1.chain)(skills).shuffle().take(count).value();
};
/**
 * Retrieves all contacts from the database.
 *
 * @param dataSource - The TypeORM data source used for database operations.
 * @returns A promise that resolves to an array of contacts.
 * @throws Error if the data source is invalid or contacts cannot be retrieved.
 */
const getRandomContacts = async (dataSource) => {
    if (!dataSource) {
        throw new Error('Invalid data source: DataSource is required.');
    }
    // Retrieve all contacts from the database
    return await dataSource.getRepository(internal_1.Contact).find();
};
//# sourceMappingURL=organization.seed.js.map