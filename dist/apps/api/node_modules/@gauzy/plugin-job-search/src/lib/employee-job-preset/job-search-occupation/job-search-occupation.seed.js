"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDefaultJobSearchOccupations = void 0;
const contracts_1 = require("@gauzy/contracts");
const job_search_occupation_entity_1 = require("./job-search-occupation.entity");
/**
 * Creates default job search occupations.
 *
 * @param connection The connection to the data source for database operations.
 * @param tenant The tenant for which occupations are created.
 * @param organization The organization for which occupations are created.
 * @returns A Promise that resolves with the created job search occupations.
 */
const createDefaultJobSearchOccupations = async (connection, tenant, organization) => {
    const upworkOccupations = [
        { name: 'DevOps Engineering', jobSourceOccupationId: '1110580753140797440' },
        { name: 'Project Management', jobSourceOccupationId: '1017484851352698979' }
    ];
    const occupations = upworkOccupations.map(occupation => {
        const occ = new job_search_occupation_entity_1.JobSearchOccupation();
        occ.jobSource = contracts_1.JobPostSourceEnum.UPWORK;
        occ.organizationId = organization.id;
        occ.tenantId = tenant.id;
        occ.name = occupation.name;
        occ.jobSourceOccupationId = occupation.jobSourceOccupationId;
        return occ;
    });
    await connection.manager.save(occupations);
    return occupations;
};
exports.createDefaultJobSearchOccupations = createDefaultJobSearchOccupations;
//# sourceMappingURL=job-search-occupation.seed.js.map