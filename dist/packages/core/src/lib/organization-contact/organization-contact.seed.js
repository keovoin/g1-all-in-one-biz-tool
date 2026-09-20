"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assignOrganizationContactToEmployee = exports.createRandomOrganizationContact = exports.createDefaultOrganizationContact = void 0;
const faker_1 = require("@faker-js/faker");
const contracts_1 = require("@gauzy/contracts");
const _ = require("underscore");
const utils_1 = require("../core/utils");
const internal_1 = require("./../core/entities/internal");
const utils_2 = require("../core/seeds/utils");
const contact_seed_1 = require("../contact/contact.seed");
const createDefaultOrganizationContact = async (dataSource, tenant, noOfContactsPerOrganization) => {
    return await createOrganizationContact(dataSource, tenant, noOfContactsPerOrganization);
};
exports.createDefaultOrganizationContact = createDefaultOrganizationContact;
const createRandomOrganizationContact = async (dataSource, tenants, noOfContactsPerOrganization) => {
    for await (const tenant of tenants) {
        await createOrganizationContact(dataSource, tenant, noOfContactsPerOrganization);
    }
};
exports.createRandomOrganizationContact = createRandomOrganizationContact;
const createOrganizationContact = async (dataSource, tenant, noOfContactsPerOrganization) => {
    const { id: tenantId } = tenant;
    const organizations = await dataSource.manager.find(internal_1.Organization, {
        where: {
            tenantId
        },
        relations: {
            employees: true
        }
    });
    const allOrganizationContacts = [];
    for await (const organization of organizations) {
        const { id: organizationId } = organization;
        const { employees } = organization;
        const organizationContacts = [];
        const tags = await dataSource.manager.findBy(internal_1.Tag, {
            organizationId,
            tenantId
        });
        for (let i = 0; i < noOfContactsPerOrganization; i++) {
            const orgContact = await generateOrganizationContact(tenant, organization, tags);
            organizationContacts.push(orgContact);
        }
        await dataSource.manager.save(organizationContacts);
        await (0, exports.assignOrganizationContactToEmployee)(dataSource, tenant, organization, employees);
        allOrganizationContacts.push(...organizationContacts);
    }
    return allOrganizationContacts;
};
const generateOrganizationContact = async (tenant, organization, tags) => {
    const contact = (0, contact_seed_1.getRandomContact)(tenant, organization);
    const orgContact = new internal_1.OrganizationContact();
    orgContact.name = contact.name;
    orgContact.organization = organization;
    orgContact.tenant = tenant;
    orgContact.contact = contact;
    orgContact.contactType = faker_1.faker.helpers.arrayElement(Object.values(contracts_1.ContactType));
    orgContact.budgetType = faker_1.faker.helpers.arrayElement(Object.values(contracts_1.OrganizationContactBudgetTypeEnum));
    orgContact.budget =
        orgContact.budgetType == contracts_1.OrganizationContactBudgetTypeEnum.COST
            ? faker_1.faker.number.int({ min: 500, max: 5000 })
            : faker_1.faker.number.int({ min: 40, max: 400 });
    const email = (0, utils_2.getEmailWithPostfix)(faker_1.faker.internet.exampleEmail({ firstName: contact.firstName, lastName: contact.lastName }));
    orgContact.inviteStatus = faker_1.faker.helpers.arrayElement(Object.values(contracts_1.ContactOrganizationInviteStatus));
    const phone = faker_1.faker.phone.number();
    orgContact.primaryEmail = email;
    orgContact.primaryPhone = phone;
    orgContact.imageUrl = (0, utils_1.getDummyImage)(330, 300, (orgContact.name || faker_1.faker.person.firstName()).charAt(0).toUpperCase());
    orgContact.tags = _.chain(tags)
        .shuffle()
        .take(faker_1.faker.number.int({ min: 1, max: 2 }))
        .values()
        .value();
    return orgContact;
};
/*
* Assign Organization Contact To Respective Employees
*/
const assignOrganizationContactToEmployee = async (dataSource, tenant, organization, employees) => {
    const { id: tenantId } = tenant;
    const { id: organizationId } = organization;
    const organizationContacts = await dataSource.manager.findBy(internal_1.OrganizationContact, {
        organizationId,
        tenantId
    });
    for await (const employee of employees) {
        employee.organizationContacts = _.chain(organizationContacts)
            .shuffle()
            .take(faker_1.faker.number.int({ min: 2, max: 4 }))
            .unique()
            .values()
            .value();
    }
    await dataSource.manager.save(employees);
};
exports.assignOrganizationContactToEmployee = assignOrganizationContactToEmployee;
//# sourceMappingURL=organization-contact.seed.js.map