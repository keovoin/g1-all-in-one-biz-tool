"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobSeederService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const chalk = require("chalk");
const config_1 = require("@gauzy/config");
const core_1 = require("@gauzy/core");
const job_search_category_seed_1 = require("./job-search-category/job-search-category.seed");
const job_search_occupation_seed_1 = require("./job-search-occupation/job-search-occupation.seed");
/**
 * Service dealing with help center based operations.
 *
 * @class
 */
let JobSeederService = class JobSeederService {
    /**
     * Create an instance of class.
     *
     * @constructs
     *
     */
    constructor(connectionEntityManager, seeder) {
        this.connectionEntityManager = connectionEntityManager;
        this.seeder = seeder;
    }
    /**
     * Seeds job data into the database.
     *
     * This function seeds default job search categories and occupations using the provided connection,
     * tenant, and default organization. It logs the seeding process and any errors encountered.
     */
    async seedDefaultJobsData() {
        try {
            // Log the start of the seeding process
            this.seeder.log(chalk.green(`🌱 SEEDING ${config_1.environment.production ? 'PRODUCTION' : ''} JOBS DATABASE...`));
            // Seed default job search categories
            await this.seeder.tryExecute('Default Job Search Categories', (0, job_search_category_seed_1.createDefaultJobSearchCategories)(this.connectionEntityManager.rawConnection, this.seeder.tenant, this.seeder.defaultOrganization));
            // Seed default job search occupations
            await this.seeder.tryExecute('Default Job Search Occupations', (0, job_search_occupation_seed_1.createDefaultJobSearchOccupations)(this.connectionEntityManager.rawConnection, this.seeder.tenant, this.seeder.defaultOrganization));
            // Log the completion of the seeding process
            this.seeder.log(chalk.green(`✅ SEEDED ${config_1.environment.production ? 'PRODUCTION' : ''} JOBS DATABASE`));
        }
        catch (error) {
            // Log any errors encountered during the seeding process
            console.log('Error while job data seeding: %s', error.message);
        }
    }
};
exports.JobSeederService = JobSeederService;
exports.JobSeederService = JobSeederService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [core_1.ConnectionEntityManager,
        core_1.SeedDataService])
], JobSeederService);
//# sourceMappingURL=job-seeder.service.js.map