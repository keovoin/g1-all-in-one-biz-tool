"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRandomProposals = exports.createDefaultProposals = void 0;
const proposal_entity_1 = require("./proposal.entity");
const faker_1 = require("@faker-js/faker");
const moment = require("moment");
const core_1 = require("@gauzy/core");
const contracts_1 = require("@gauzy/contracts");
/**
 * Creates default proposals for organizations.
 *
 * @param connection The database connection.
 * @param tenant The tenant information.
 * @param employees The list of employees.
 * @param organizations The list of organizations.
 * @param noOfProposalsPerOrganization The number of proposals to create per organization.
 * @returns A promise that resolves to an array of created proposals.
 */
const createDefaultProposals = async (connection, tenant, employees, organizations, noOfProposalsPerOrganization) => {
    const proposals = [];
    const tagsMap = new Map();
    const organizationContactsMap = new Map();
    // Fetch tags and organization contacts for each organization asynchronously
    await Promise.all(organizations.map(async (organization) => {
        const tags = await connection.manager.findBy(core_1.Tag, { organizationId: organization.id });
        const organizationContacts = await connection.manager.findBy(core_1.OrganizationContact, {
            organizationId: organization.id,
            tenantId: tenant.id
        });
        tagsMap.set(organization.id, tags);
        organizationContactsMap.set(organization.id, organizationContacts);
    }));
    // Generate proposals for each organization
    organizations.forEach((organization) => {
        const tags = tagsMap.get(organization.id) || [];
        const organizationContacts = organizationContactsMap.get(organization.id) || [];
        for (let i = 0; i < noOfProposalsPerOrganization; i++) {
            const proposal = new proposal_entity_1.Proposal();
            proposal.employee = faker_1.faker.helpers.arrayElement(employees);
            proposal.jobPostUrl = faker_1.faker.internet.url();
            proposal.jobPostContent = faker_1.faker.person.jobTitle();
            proposal.organization = organization;
            proposal.status = faker_1.faker.helpers.arrayElement(Object.values(contracts_1.ProposalStatusEnum));
            proposal.tags = [faker_1.faker.helpers.arrayElement(tags)];
            proposal.valueDate = moment(faker_1.faker.date.recent({ days: 0.5 })).startOf('day').toDate();
            proposal.proposalContent = faker_1.faker.person.jobDescriptor();
            proposal.tenant = tenant;
            if (organizationContacts.length) {
                proposal.organizationContactId = faker_1.faker.helpers.arrayElement(organizationContacts).id;
            }
            proposals.push(proposal);
        }
    });
    // Save generated proposals
    return await connection.manager.save(proposals, { chunk: 30 });
};
exports.createDefaultProposals = createDefaultProposals;
/**
 * Creates random proposals for organizations across multiple tenants.
 *
 * @param connection The database connection.
 * @param tenants An array of tenants.
 * @param tenantOrganizationsMap A map containing organizations for each tenant.
 * @param organizationEmployeesMap A map containing employees for each organization.
 * @param noOfProposalsPerOrganization The number of proposals to create per organization.
 * @returns A Promise that resolves with the created proposals.
 */
const createRandomProposals = async (connection, tenants, tenantOrganizationsMap, organizationEmployeesMap, noOfProposalsPerOrganization) => {
    const proposals = [];
    // Pre-fetch tags and organization contacts for all organizations
    const organizationTagsMap = new Map();
    const organizationContactsMap = new Map();
    for (const [tenant, organizations] of tenantOrganizationsMap.entries()) {
        for (const organization of organizations) {
            const { id: tenantId } = tenant;
            const { id: organizationId } = organization;
            const tags = await connection.manager.findBy(core_1.Tag, { organizationId, tenantId });
            organizationTagsMap.set(organizationId, tags);
            const contacts = await connection.manager.findBy(core_1.OrganizationContact, { organizationId, tenantId });
            organizationContactsMap.set(organizationId, contacts);
        }
    }
    // Generate proposals for each organization
    for (const tenant of tenants) {
        const organizations = tenantOrganizationsMap.get(tenant);
        if (!organizations)
            continue;
        for (const organization of organizations) {
            const employees = organizationEmployeesMap.get(organization);
            if (!employees)
                continue;
            const { id: organizationId } = organization;
            const tags = organizationTagsMap.get(organizationId) || [];
            const organizationContacts = organizationContactsMap.get(organizationId) || [];
            for (let i = 0; i < noOfProposalsPerOrganization; i++) {
                const proposal = new proposal_entity_1.Proposal();
                proposal.employee = faker_1.faker.helpers.arrayElement(employees);
                proposal.jobPostUrl = faker_1.faker.internet.url();
                proposal.jobPostContent = faker_1.faker.person.jobTitle();
                proposal.status = faker_1.faker.helpers.arrayElement(Object.values(contracts_1.ProposalStatusEnum));
                proposal.tags = [faker_1.faker.helpers.arrayElement(tags)];
                proposal.valueDate = moment(faker_1.faker.date.recent({ days: 0.5 })).startOf('day').toDate();
                proposal.proposalContent = faker_1.faker.person.jobDescriptor();
                proposal.organization = organization;
                proposal.tenant = tenant;
                if (organizationContacts.length) {
                    proposal.organizationContact = faker_1.faker.helpers.arrayElement(organizationContacts);
                }
                proposals.push(proposal);
            }
        }
    }
    // Save the generated proposals in batches
    return await connection.manager.save(proposals, { chunk: 30 });
};
exports.createRandomProposals = createRandomProposals;
//# sourceMappingURL=proposal.seed.js.map