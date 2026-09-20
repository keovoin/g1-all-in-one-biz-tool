"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDefaultJobSearchCategories = void 0;
const contracts_1 = require("@gauzy/contracts");
const job_search_category_entity_1 = require("./job-search-category.entity");
/**
 * Creates default job search categories.
 *
 * @param connection The connection to the data source for database operations.
 * @param tenant The tenant for which categories are created.
 * @param organization The organization for which categories are created.
 * @returns A Promise that resolves with the created job search categories.
 */
const createDefaultJobSearchCategories = async (connection, tenant, organization) => {
    const upworkCategories = [
        { name: 'IT & Networking', jobSourceCategoryId: '531770282580668419' },
        { name: 'Web, Mobile & Software Dev', jobSourceCategoryId: '531770282580668418' }
    ];
    const categories = upworkCategories.map(category => {
        const cat = new job_search_category_entity_1.JobSearchCategory();
        cat.jobSource = contracts_1.JobPostSourceEnum.UPWORK;
        cat.organizationId = organization.id;
        cat.tenantId = tenant.id;
        cat.name = category.name;
        cat.jobSourceCategoryId = category.jobSourceCategoryId;
        return cat;
    });
    await connection.manager.save(categories);
    return categories;
};
exports.createDefaultJobSearchCategories = createDefaultJobSearchCategories;
//# sourceMappingURL=job-search-category.seed.js.map