"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HelpCenterSeederService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const core_1 = require("@gauzy/core");
const help_center_1 = require("./help-center");
const help_center_article_seed_1 = require("./help-center-article/help-center-article.seed");
const help_center_author_1 = require("./help-center-author");
/**
 * Service dealing with help center based operations.
 *
 * @class
 */
let HelpCenterSeederService = class HelpCenterSeederService {
    /**
     * Create an instance of class.
     *
     * @constructs
     *
     */
    constructor(seeder) {
        this.seeder = seeder;
    }
    /**
     * Seed all default help center and related methods.
     *
     * @function
     */
    async createDefault() {
        this.tenant = this.seeder.tenant;
        const organizations = await (0, core_1.getDefaultOrganizations)(this.seeder.dataSource, this.tenant);
        const tenantOrganizationsMap = new Map();
        tenantOrganizationsMap.set(this.tenant, organizations);
        await this.seeder.tryExecute('Default Help Centers', (0, help_center_1.createHelpCenter)(this.seeder.dataSource, [this.tenant], tenantOrganizationsMap));
        const noOfHelpCenterArticle = 40;
        await this.seeder.tryExecute('Default Help Center Articles', (0, help_center_article_seed_1.createHelpCenterArticle)(this.seeder.dataSource, [this.tenant], tenantOrganizationsMap, noOfHelpCenterArticle));
        const defaultEmployees = await (0, core_1.getDefaultEmployees)(this.seeder.dataSource, this.tenant);
        await this.seeder.tryExecute('Default Help Center Author', (0, help_center_author_1.createDefaultHelpCenterAuthor)(this.seeder.dataSource, defaultEmployees));
    }
    /**
     * Seed all random help center and related methods.
     *
     * @function
     */
    async createRandom() {
        const { name } = this.tenant;
        const randomTenants = await this.seeder.dataSource.getRepository(core_1.Tenant).find({
            where: {
                name: (0, typeorm_1.Not)(name)
            },
            relations: (0, core_1.parseFindOptionsRelations)(['organizations'])
        });
        const tenantOrganizationsMap = new Map();
        const employeeMap = new Map();
        for await (const tenant of randomTenants) {
            const { organizations } = tenant;
            tenantOrganizationsMap.set(tenant, organizations);
            const employees = await this.seeder.dataSource.manager.findBy(core_1.Employee, {
                tenantId: tenant.id
            });
            employeeMap.set(tenant, employees);
        }
        await this.seeder.tryExecute('Random Help Centers', (0, help_center_1.createHelpCenter)(this.seeder.dataSource, randomTenants, tenantOrganizationsMap));
        const noOfHelpCenterArticle = 40;
        await this.seeder.tryExecute('Random Help Center Articles', (0, help_center_article_seed_1.createHelpCenterArticle)(this.seeder.dataSource, randomTenants, tenantOrganizationsMap, noOfHelpCenterArticle));
        await this.seeder.tryExecute('Random Help Center Authors', (0, help_center_author_1.createRandomHelpCenterAuthor)(this.seeder.dataSource, randomTenants, employeeMap));
    }
};
exports.HelpCenterSeederService = HelpCenterSeederService;
exports.HelpCenterSeederService = HelpCenterSeederService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [core_1.SeedDataService])
], HelpCenterSeederService);
//# sourceMappingURL=help-center-seeder.service.js.map