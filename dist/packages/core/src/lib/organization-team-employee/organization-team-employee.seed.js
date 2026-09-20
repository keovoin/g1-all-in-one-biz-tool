"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRandomOrganizationTeamEmployee = void 0;
const faker_1 = require("@faker-js/faker");
const organization_team_employee_entity_1 = require("./organization-team-employee.entity");
const internal_1 = require("./../core/entities/internal");
/**
 * Create random OrganizationTeamEmployee entries for each tenant, organization, and employee.
 *
 * @param dataSource - The data source instance for managing database operations
 * @param tenants - List of tenants to create OrganizationTeamEmployees for
 * @param tenantOrganizationsMap - A map linking each tenant to its organizations
 * @param organizationEmployeesMap - A map linking each organization to its employees
 * @returns void
 */
const createRandomOrganizationTeamEmployee = async (dataSource, tenants, tenantOrganizationsMap, organizationEmployeesMap) => {
    if (!tenantOrganizationsMap || !organizationEmployeesMap) {
        console.warn('Warning: Required maps not found, Random Organization Team Employee creation skipped.');
        return;
    }
    const orgTeamEmployees = [];
    // Iterate over each tenant
    for await (const tenant of tenants) {
        const organizations = tenantOrganizationsMap.get(tenant) || [];
        const { id: tenantId } = tenant;
        // Fetch employees in parallel
        const roles = await dataSource.manager.find(internal_1.Role, { where: { tenantId } }); // Fetch roles once for reuse
        // Iterate over each organization
        for await (const organization of organizations) {
            const tenantEmployees = organizationEmployeesMap.get(organization) || [];
            const { id: organizationId } = organization;
            // Fetch organization teams in parallel
            const organizationTeams = await dataSource.manager.findBy(internal_1.OrganizationTeam, {
                organizationId,
                tenantId
            });
            // Randomly select a team and employee if available
            if (organizationTeams.length && tenantEmployees.length) {
                const team = faker_1.faker.helpers.arrayElement(organizationTeams);
                const employee = faker_1.faker.helpers.arrayElement(tenantEmployees);
                // Create a new OrganizationTeamEmployee instance
                orgTeamEmployees.push(new organization_team_employee_entity_1.OrganizationTeamEmployee({
                    organizationTeamId: team.id,
                    employeeId: employee.id,
                    organizationTeam: team,
                    employee: employee,
                    organizationId,
                    tenantId,
                    role: faker_1.faker.helpers.arrayElement(roles)
                }));
            }
        }
    }
    // Save the organization team employees to the database
    await dataSource.manager.save(orgTeamEmployees);
};
exports.createRandomOrganizationTeamEmployee = createRandomOrganizationTeamEmployee;
//# sourceMappingURL=organization-team-employee.seed.js.map