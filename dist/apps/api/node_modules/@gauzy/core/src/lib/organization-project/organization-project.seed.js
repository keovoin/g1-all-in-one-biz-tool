"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assignOrganizationProjectToEmployee = exports.createRandomOrganizationProjects = exports.createDefaultOrganizationProjects = void 0;
exports.seedProjectMembersCount = seedProjectMembersCount;
const faker_1 = require("@faker-js/faker");
const underscore_1 = require("underscore");
const contracts_1 = require("@gauzy/contracts");
const config_1 = require("@gauzy/config");
const default_organization_projects_1 = require("./default-organization-projects");
const internal_1 = require("./../core/entities/internal");
const organization_project_entity_1 = require("./organization-project.entity");
const database_helper_1 = require("../database/database.helper");
const utils_1 = require("../core/utils");
/**
 * Creates default organization projects, assigns them to employees, and seeds project member counts.
 *
 * @param dataSource - The TypeORM data source instance for database operations.
 * @param tenant - The tenant information.
 * @param organization - The organization information.
 * @returns A promise that resolves to an array of created organization projects.
 */
const createDefaultOrganizationProjects = async (dataSource, tenant, organization) => {
    const { id: organizationId, tenantId } = organization;
    try {
        // Create and save the Tag
        const tags = await dataSource.getRepository(internal_1.Tag).save([
            {
                name: 'Web',
                description: '',
                color: faker_1.faker.color.human()
            },
            {
                name: 'API',
                description: '',
                color: faker_1.faker.color.human()
            }
        ]);
        // Fetch all OrganizationContacts once to avoid redundant queries
        const organizationContacts = await dataSource.manager.findBy(internal_1.OrganizationContact, {
            tenantId,
            organizationId
        });
        // Fetch all OrganizationTeams to assign projects to teams
        const organizationTeams = await dataSource.manager.findBy(internal_1.OrganizationTeam, {
            tenantId,
            organizationId
        });
        // Define a mapping between Budget Types and their respective min and max values
        const budgetRanges = {
            [contracts_1.OrganizationProjectBudgetTypeEnum.COST]: { min: 500, max: 5000 },
            [contracts_1.OrganizationProjectBudgetTypeEnum.HOURS]: { min: 40, max: 400 }
        };
        // Initialize an array to hold the created projects
        const projects = [];
        // Iterate over the default project names and create OrganizationProject instances
        for (const projectName of default_organization_projects_1.DEFAULT_ORGANIZATION_PROJECTS) {
            const budgetType = faker_1.faker.helpers.arrayElement(Object.values(contracts_1.OrganizationProjectBudgetTypeEnum));
            // Retrieve the budget range based on the budgetType
            const { min, max } = budgetRanges[budgetType] || { min: 0, max: 0 };
            // Generate the budget using faker with the determined range
            const budget = faker_1.faker.number.int({ min, max });
            // Create a new OrganizationProject instance
            const project = new organization_project_entity_1.OrganizationProject();
            project.name = projectName;
            project.status = faker_1.faker.helpers.arrayElement(Object.values(contracts_1.ProjectStatusEnum).filter((s) => s !== contracts_1.ProjectStatusEnum.CUSTOM));
            project.tags = tags;
            project.organizationContact = faker_1.faker.helpers.arrayElement(organizationContacts);
            project.organization = organization;
            project.tenant = tenant;
            project.budgetType = budgetType;
            project.budget = budget;
            project.taskListType = faker_1.faker.helpers.arrayElement(Object.values(contracts_1.TaskListTypeEnum));
            // If organizationContacts is not empty, assign a random organization contact
            if (organizationContacts.length > 0) {
                project.organizationContact = faker_1.faker.helpers.arrayElement(organizationContacts);
            }
            // Assign project to 1-3 random teams if teams exist
            if (organizationTeams.length > 0) {
                const numberOfTeams = faker_1.faker.number.int({ min: 1, max: Math.min(3, organizationTeams.length) });
                project.teams = faker_1.faker.helpers.arrayElements(organizationTeams, numberOfTeams);
            }
            // Add project to projects array
            projects.push(project);
        }
        // Bulk save all projects
        const savedProjects = await dataSource.manager.save(projects, { chunk: 100 });
        // Assign projects to employees
        await (0, exports.assignOrganizationProjectToEmployee)(dataSource, organization);
        // Seed project member counts for the tenant
        await seedProjectMembersCount(dataSource, [tenant]);
        return savedProjects;
    }
    catch (error) {
        console.log('Error creating default organization projects:', error?.message);
    }
};
exports.createDefaultOrganizationProjects = createDefaultOrganizationProjects;
/**
 * Creates random organization projects for given tenants and their organizations.
 *
 * @param dataSource - The TypeORM data source instance for database operations.
 * @param tenants - An array of tenant entities.
 * @param tenantOrganizationsMap - A map linking each tenant to its organizations.
 * @param tags - An array of tag entities to associate with projects.
 * @param maxProjectsPerOrganization - The maximum number of projects to create per organization.
 * @returns A promise that resolves to an array of created OrganizationProject entities.
 */
const createRandomOrganizationProjects = async (dataSource, tenants, tenantOrganizationsMap, tags = [], maxProjectsPerOrganization) => {
    // Iterate over each tenant and create random projects for each organization
    for await (const tenant of tenants) {
        // Get the ID of the current tenant
        const { id: tenantId } = tenant;
        // Fetch organizations for the current tenant
        const organizations = tenantOrganizationsMap.get(tenant);
        // Determine the number of projects to create for each organization
        const projectsPerOrganization = Math.floor(Math.random() * (maxProjectsPerOrganization - 5)) + 5;
        if (!organizations || organizations.length === 0) {
            console.warn(`No organizations found for tenant ID: ${tenantId}`);
            continue; // Skip to the next tenant if no organizations are found
        }
        // Define a mapping between Budget Types and their respective min and max values
        const budgetRanges = {
            [contracts_1.OrganizationProjectBudgetTypeEnum.COST]: { min: 500, max: 5000 },
            [contracts_1.OrganizationProjectBudgetTypeEnum.HOURS]: { min: 40, max: 400 }
        };
        // Create random projects for each organization
        for await (const organization of organizations) {
            const { id: organizationId } = organization;
            // Fetch all OrganizationContacts once to avoid redundant queries
            const organizationContacts = await dataSource.manager.findBy(internal_1.OrganizationContact, {
                tenantId,
                organizationId
            });
            const projects = [];
            // Iterate over each organization and create projects
            for (let i = 0; i < projectsPerOrganization; i++) {
                const budgetType = faker_1.faker.helpers.arrayElement(Object.values(contracts_1.OrganizationProjectBudgetTypeEnum));
                // Retrieve the budget range based on the budgetType
                const { min, max } = budgetRanges[budgetType] || { min: 0, max: 0 };
                // Generate the budget using faker with the determined range
                const budget = faker_1.faker.number.int({ min, max });
                // Create a new OrganizationProject instance
                const project = new organization_project_entity_1.OrganizationProject();
                project.tags = [tags[Math.floor(Math.random() * tags.length)]];
                project.name = faker_1.faker.company.name();
                project.status = faker_1.faker.helpers.arrayElement(Object.values(contracts_1.ProjectStatusEnum).filter((s) => s !== contracts_1.ProjectStatusEnum.CUSTOM));
                project.organization = organization;
                project.tenant = tenant;
                project.budgetType = budgetType;
                project.budget = budget;
                project.startDate = faker_1.faker.date.past({ years: 5 });
                project.endDate = faker_1.faker.date.between({ from: project.startDate, to: new Date() });
                // If organizationContacts is not empty, assign a random organization contact
                if (organizationContacts.length > 0) {
                    project.organizationContact = faker_1.faker.helpers.arrayElement(organizationContacts);
                }
                projects.push(project);
            }
            // Bulk save all projects
            await dataSource.manager.save(projects, { chunk: 100 });
            // Assign projects to employees
            await (0, exports.assignOrganizationProjectToEmployee)(dataSource, organization);
        }
        // Seed project member counts for the tenant
        await seedProjectMembersCount(dataSource, [tenant]);
    }
};
exports.createRandomOrganizationProjects = createRandomOrganizationProjects;
/**
 * Assigns unique Organization Projects to each Employee within an Organization.
 *
 * @param dataSource - The data source instance for database operations.
 * @param organization - The organization object containing `id` and `tenantId`.
 */
const assignOrganizationProjectToEmployee = async (dataSource, organization) => {
    const { id: organizationId, tenantId } = organization;
    // Fetch all projects, employees, and manager role for the organization and tenant
    const [organizationProjects, employees, managerRole] = await Promise.all([
        dataSource.manager.findBy(organization_project_entity_1.OrganizationProject, { tenantId, organizationId }),
        dataSource.manager.findBy(internal_1.Employee, { tenantId, organizationId }),
        dataSource.manager.findOneBy(internal_1.Role, { tenantId, name: contracts_1.RolesEnum.MANAGER })
    ]);
    // Check if there are enough projects to assign
    if (organizationProjects.length === 0) {
        console.warn('Not enough projects to assign. At least 1 projects are required.');
        return;
    }
    // Guard against missing manager role
    if (!managerRole) {
        console.warn('Manager role not found for tenant. Projects will be assigned without managers.');
    }
    // Initialize an array to store the OrganizationProjectEmployee instances
    const members = [];
    // Iterate over each employee and assign projects
    for (const employee of employees) {
        // Determine the number of projects to assign (between 2 and 4)
        const numberOfProjects = faker_1.faker.number.int({ min: 2, max: 4 });
        // Shuffle and select unique projects
        const projects = (0, underscore_1.chain)(organizationProjects).shuffle().take(numberOfProjects).value();
        // Create OrganizationProjectEmployee instances for the selected projects
        for (let i = 0; i < projects.length; i++) {
            const project = projects[i];
            // Make the first project assignment a manager role (25% chance to be manager)
            // Only if managerRole exists
            const isManager = managerRole && i === 0 && faker_1.faker.datatype.boolean({ probability: 0.25 });
            const projectEmployee = new internal_1.OrganizationProjectEmployee();
            // Set IDs
            projectEmployee.employeeId = employee.id;
            projectEmployee.organizationProjectId = project.id;
            projectEmployee.organizationId = organizationId;
            projectEmployee.tenantId = tenantId;
            // Set relations
            projectEmployee.employee = employee;
            projectEmployee.organizationProject = project;
            projectEmployee.organization = organization;
            projectEmployee.tenant = organization.tenant;
            // Set manager fields
            projectEmployee.isManager = isManager;
            projectEmployee.role = isManager ? managerRole : undefined;
            projectEmployee.assignedAt = new Date();
            members.push(projectEmployee);
        }
    }
    // Save all OrganizationProjectEmployee relationships in bulk
    await dataSource.manager.save(members, { chunk: 100 });
};
exports.assignOrganizationProjectToEmployee = assignOrganizationProjectToEmployee;
/**
 * Seeds the members count for each organization project associated with the provided tenants.
 *
 * @param dataSource - The TypeORM data source instance for database operations.
 * @param tenants - An array of tenant entities.
 *
 * @returns A promise that resolves when the seeding is complete.
 */
async function seedProjectMembersCount(dataSource, tenants) {
    try {
        for (const tenant of tenants) {
            const tenantId = tenant.id;
            let query;
            // Check if the database type is MySQL
            if (dataSource.options.type === config_1.DatabaseTypeEnum.mysql) {
                // Rewrite the query for MySQL without using the FROM clause
                query = `
					UPDATE \`organization_project\` op
					JOIN (
						SELECT \`organizationProjectId\`, COUNT(\`employeeId\`) AS count
						FROM \`organization_project_employee\`
						GROUP BY \`organizationProjectId\`
					) AS sub
					ON op.id = sub.\`organizationProjectId\`
					SET op.\`membersCount\` = sub.count
					WHERE op.\`tenantId\` = ?;
				`;
            }
            else {
                // Consolidated SQL to update membersCount for all projects of the current tenant
                query = (0, utils_1.replacePlaceholders)((0, database_helper_1.prepareSQLQuery)(`
					UPDATE "organization_project" AS op
					SET "membersCount" = sub.count
					FROM (
						SELECT "organizationProjectId", COUNT("employeeId") AS count
						FROM "organization_project_employee"
						GROUP BY "organizationProjectId"
					) AS sub
					WHERE op.id = sub."organizationProjectId"
					AND op."tenantId" = $1;
				`), dataSource.options.type);
            }
            // Execute the consolidated update query with the appropriate parameter
            await dataSource.manager.query(query, [tenantId]);
            console.log(`Updated membersCount for tenant ID: ${tenantId}`);
        }
    }
    catch (error) {
        console.error('Error seeding project members count:', error);
    }
}
//# sourceMappingURL=organization-project.seed.js.map