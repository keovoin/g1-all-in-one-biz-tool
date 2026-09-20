"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProposalSeederService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const core_1 = require("@gauzy/core");
const proposal_seed_1 = require("./proposal.seed");
/**
 * Service dealing with help center based operations.
 *
 * @class
 */
let ProposalSeederService = class ProposalSeederService {
    /**
     * Create an instance of class.
     *
     * @constructs
     *
     */
    constructor(_connectionEntityManager, _seeder) {
        this._connectionEntityManager = _connectionEntityManager;
        this._seeder = _seeder;
    }
    /**
     * Creates default proposals for organizations.
     *
     * @returns A Promise that resolves when the default proposals are created.
     */
    async createDefaultProposals() {
        await (0, proposal_seed_1.createDefaultProposals)(this._connectionEntityManager.rawConnection, this._seeder.tenant, this._seeder.defaultEmployees, this._seeder.organizations, core_1.randomSeedConfig.proposalsSharingPerOrganizations || 30);
    }
    /**
     * Creates random proposals for organizations.
     *
     * @returns A Promise that resolves when the random proposals are created.
     */
    async createRandomProposals() {
        await (0, proposal_seed_1.createRandomProposals)(this._connectionEntityManager.rawConnection, this._seeder.randomTenants, this._seeder.randomTenantOrganizationsMap, this._seeder.randomOrganizationEmployeesMap, core_1.randomSeedConfig.proposalsSharingPerOrganizations || 30);
    }
};
exports.ProposalSeederService = ProposalSeederService;
exports.ProposalSeederService = ProposalSeederService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [core_1.ConnectionEntityManager,
        core_1.SeedDataService])
], ProposalSeederService);
//# sourceMappingURL=proposal-seeder.service.js.map