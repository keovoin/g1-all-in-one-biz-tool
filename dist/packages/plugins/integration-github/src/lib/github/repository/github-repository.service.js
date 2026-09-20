"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GithubRepositoryService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const core_1 = require("@gauzy/core");
const integration_sync_github_repository_command_1 = require("../commands/integration-sync-github-repository.command");
const mikro_orm_organization_github_repository_repository_1 = require("./repository/mikro-orm-organization-github-repository.repository");
const type_orm_organization_github_repository_repository_1 = require("./repository/type-orm-organization-github-repository.repository");
let GithubRepositoryService = class GithubRepositoryService extends core_1.TenantAwareCrudService {
    constructor(typeOrmOrganizationGithubRepositoryRepository, mikroOrmOrganizationGithubRepositoryRepository, _commandBus) {
        super(typeOrmOrganizationGithubRepositoryRepository, mikroOrmOrganizationGithubRepositoryRepository);
        this.typeOrmOrganizationGithubRepositoryRepository = typeOrmOrganizationGithubRepositoryRepository;
        this.mikroOrmOrganizationGithubRepositoryRepository = mikroOrmOrganizationGithubRepositoryRepository;
        this._commandBus = _commandBus;
        this.logger = new common_1.Logger('GithubRepositoryService');
    }
    /**
     * Synchronize a GitHub repository with an integration.
     *
     * @param input - The input data for synchronization.
     * @returns An object indicating success or failure of the synchronization.
     */
    async syncGithubRepository(input) {
        try {
            return await this._commandBus.execute(new integration_sync_github_repository_command_1.IntegrationSyncGithubRepositoryCommand(input));
        }
        catch (error) {
            // Handle errors and return an appropriate error response
            this.logger.error('Error while sync github integration repository', error.message);
            throw new common_1.HttpException(`Failed to sync GitHub repository: ${error.message}`, common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
exports.GithubRepositoryService = GithubRepositoryService;
exports.GithubRepositoryService = GithubRepositoryService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_organization_github_repository_repository_1.TypeOrmOrganizationGithubRepositoryRepository,
        mikro_orm_organization_github_repository_repository_1.MikroOrmOrganizationGithubRepositoryRepository,
        cqrs_1.CommandBus])
], GithubRepositoryService);
//# sourceMappingURL=github-repository.service.js.map