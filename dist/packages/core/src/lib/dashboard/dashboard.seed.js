"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRandomEmployeeDashboards = exports.createDefaultEmployeeDashboards = void 0;
const dashboard_entity_1 = require("./dashboard.entity");
/**
 * Creates default dashboards for a list of employees within a specific tenant and organization.
 *
 * @param dataSource - The TypeORM DataSource instance.
 * @param tenant - The tenant object.
 * @param organization - The organization object.
 * @param employees - An array of employee objects.
 * @returns A promise that resolves to an array of created Dashboard entities.
 */
const createDefaultEmployeeDashboards = async (dataSource, tenant, organization, employees) => {
    const dashboards = employees.map((employee) => {
        return new dashboard_entity_1.Dashboard({
            name: 'Default Dashboard',
            identifier: `default_${employee.id}`,
            description: 'This is the default dashboard.',
            contentHtml: '<div>Welcome to your dashboard</div>',
            isDefault: true,
            tenantId: tenant.id,
            organizationId: organization.id,
            employeeId: employee.id,
            createdByUserId: employee.user.id
        });
    });
    // Insert the generated dashboards into the database
    return await insertDashboards(dataSource, dashboards);
};
exports.createDefaultEmployeeDashboards = createDefaultEmployeeDashboards;
/**
 * Creates random dashboards for employees across multiple tenants and organizations.
 *
 * @param dataSource - The TypeORM DataSource instance.
 * @param tenants - An array of tenant objects.
 * @param tenantOrganizationsMap - A map where each tenant maps to an array of its organizations.
 * @param organizationEmployeesMap - A map where each organization maps to an array of its employees.
 * @returns A promise that resolves to an array of created Dashboard entities.
 */
const createRandomEmployeeDashboards = async (dataSource, tenants, tenantOrganizationsMap, organizationEmployeesMap) => {
    const dashboards = [];
    for (const tenant of tenants) {
        const organizations = tenantOrganizationsMap.get(tenant) || [];
        for (const organization of organizations) {
            const employees = organizationEmployeesMap.get(organization) || [];
            for (const employee of employees) {
                const dashboard = new dashboard_entity_1.Dashboard({
                    name: `Dashboard for ${employee.fullName}`,
                    identifier: `dashboard_${employee.id}`,
                    description: 'This is a randomly generated dashboard.',
                    contentHtml: '<div>Random dashboard content</div>',
                    isDefault: false,
                    tenantId: tenant.id,
                    organizationId: organization.id,
                    employeeId: employee.id,
                    createdByUserId: employee.user.id
                });
                dashboards.push(dashboard);
            }
        }
    }
    // Insert the generated dashboards into the database
    return await insertDashboards(dataSource, dashboards);
};
exports.createRandomEmployeeDashboards = createRandomEmployeeDashboards;
/**
 * Inserts an array of dashboards into the database in batches.
 *
 * @param dataSource - The TypeORM DataSource instance.
 * @param dashboards - An array of Dashboard entities to insert.
 * @returns A promise that resolves to an array of inserted Dashboard entities.
 */
const insertDashboards = async (dataSource, dashboards, batchSize = 100 // Define the batch size to control the number of records inserted per query
) => {
    if (!dashboards.length) {
        console.warn('No dashboards to insert. Please check the input data and try again.');
        return [];
    }
    try {
        // Get the repository for EmployeeNotification
        const dashboardRepository = dataSource.getRepository(dashboard_entity_1.Dashboard);
        // Insert the notifications in batches
        return await dashboardRepository.save(dashboards, { chunk: batchSize });
    }
    catch (error) {
        console.error('Error while inserting dashboards:', error);
        return [];
    }
};
//# sourceMappingURL=dashboard.seed.js.map