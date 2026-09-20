"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRandomDeal = void 0;
const deal_entity_1 = require("./deal.entity");
const faker_1 = require("@faker-js/faker");
const internal_1 = require("./../core/entities/internal");
/**
 * Creates random deals for given tenants and inserts them into the database.
 *
 * @param dataSource - The data source used to access the database.
 * @param tenants - An array of tenant objects.
 * @param tenantOrganizationsMap - A map associating tenants with their organizations.
 * @param organizationEmployeesMap - A map associating organizations with their employees.
 * @param batchSize - The number of records to insert per batch. Default is 100.
 * @returns A promise that resolves to an array of inserted deals.
 */
const createRandomDeal = async (dataSource, tenants, tenantOrganizationsMap, organizationEmployeesMap, batchSize = 100) => {
    if (!organizationEmployeesMap) {
        console.warn('Warning: organizationEmployeesMap not found; deals will not be created.');
        return [];
    }
    if (!tenantOrganizationsMap) {
        console.warn('Warning: tenantOrganizationsMap not found; deals will not be created.');
        return [];
    }
    const deals = [];
    // Iterate over each tenant
    for (const tenant of tenants) {
        const { id: tenantId } = tenant;
        // Retrieve the organizations associated with the current tenant
        const organizations = tenantOrganizationsMap.get(tenant) || [];
        // Iterate over each organization
        for (const organization of organizations) {
            const { id: organizationId } = organization;
            let pipelines = [];
            try {
                pipelines = await dataSource.manager.findBy(internal_1.Pipeline, {
                    organizationId,
                    tenantId
                });
            }
            catch (error) {
                console.error(`Error fetching pipelines for organization ${organizationId}:`, error);
                continue;
            }
            // Retrieve the employees associated with the current organization
            const organizationEmployees = organizationEmployeesMap.get(organization) || [];
            for (const employee of organizationEmployees) {
                for (const pipeline of pipelines) {
                    const { id: pipelineId } = pipeline;
                    let pipelineStages = [];
                    try {
                        pipelineStages = await dataSource.manager.findBy(internal_1.PipelineStage, { pipelineId });
                    }
                    catch (error) {
                        console.error(`Error fetching pipeline stages for pipeline ${pipelineId}:`, error);
                        continue;
                    }
                    for (const pipelineStage of pipelineStages) {
                        const deal = new deal_entity_1.Deal();
                        deal.stage = pipelineStage;
                        deal.title = faker_1.faker.person.jobTitle();
                        deal.stageId = pipelineStage.id;
                        deal.probability = faker_1.faker.number.int(5);
                        deal.organizationId = organizationId;
                        deal.tenantId = tenantId;
                        deal.createdByUserId = employee.user.id;
                        deals.push(deal);
                    }
                }
            }
        }
    }
    // Insert any remaining deals
    return await insertDeals(deals, dataSource, batchSize);
};
exports.createRandomDeal = createRandomDeal;
/**
 * Inserts an array of deals into the database in batches.
 *
 * @param deals - An array of deals to be inserted into the database.
 * @param dataSource - The data source used to access the database.
 * @param batchSize - The number of records to insert per query. Default is 100.
 * @returns A Promise that resolves to an array of inserted deals or an empty array in case of an error.
 */
const insertDeals = async (deals, dataSource, batchSize = 100 // Define the batch size to control the number of records inserted per query
) => {
    if (!deals.length) {
        console.warn('No deals to insert. Please check the input data and try again');
        return [];
    }
    try {
        // Get the repository for Deal
        const repository = dataSource.getRepository(deal_entity_1.Deal);
        // Insert the deals in batches
        return await repository.save(deals, { chunk: batchSize });
    }
    catch (error) {
        console.error('Error while inserting deals:', error);
        return [];
    }
};
//# sourceMappingURL=deal.seed.js.map